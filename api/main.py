"""
FastAPI application for patient risk prediction model serving.
"""

import os
import logging
import sys
from datetime import datetime
from typing import List
import time
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from api.schemas import (
    PatientData, RiskPrediction, BatchPredictionRequest, BatchPredictionResponse,
    ModelInfo, HealthCheck, ErrorResponse
)
from src.utils import (
    MODELS_DIR, load_model, load_config, categorize_risk, get_risk_emoji
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Patient Risk Prediction API",
    description="API for predicting patient readmission risk using ML",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
MODEL = None
MODEL_CONFIG = None
MODEL_LOADED = False


def load_model_on_startup():
    """Load model and configuration on startup."""
    global MODEL, MODEL_CONFIG, MODEL_LOADED
    
    try:
        model_path = os.path.join(MODELS_DIR, 'best_model.joblib')
        config_path = os.path.join(MODELS_DIR, 'model_config.json')
        
        if not os.path.exists(model_path) or not os.path.exists(config_path):
            logger.warning("Model or configuration not found. Running in demo mode.")
            MODEL_LOADED = False
            return
        
        MODEL = load_model(model_path)
        MODEL_CONFIG = load_config(config_path)
        MODEL_LOADED = True
        logger.info("Model and configuration loaded successfully")
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        MODEL_LOADED = False


@app.on_event("startup")
async def startup_event():
    """Run on API startup."""
    logger.info("Starting Patient Risk Prediction API...")
    load_model_on_startup()


@app.on_event("shutdown")
async def shutdown_event():
    """Run on API shutdown."""
    logger.info("Shutting down Patient Risk Prediction API...")


@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint."""
    return HealthCheck(
        status="healthy" if MODEL_LOADED else "degraded",
        message="API is running" if MODEL_LOADED else "API running in demo mode - model not loaded",
        timestamp=datetime.utcnow(),
        model_loaded=MODEL_LOADED
    )


@app.get("/model/info", response_model=ModelInfo)
async def model_info():
    """Get model information."""
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return ModelInfo(
        model_name="Patient Risk Prediction Model",
        model_type=MODEL_CONFIG.get('best_model', 'Unknown'),
        version="1.0.0",
        training_date=datetime.utcnow(),
        accuracy=float(MODEL_CONFIG.get('metrics', {}).get('accuracy', 0)),
        roc_auc=float(MODEL_CONFIG.get('metrics', {}).get('roc_auc', 0)),
        recall=float(MODEL_CONFIG.get('metrics', {}).get('recall', 0)),
        precision=float(MODEL_CONFIG.get('metrics', {}).get('precision', 0)),
        threshold=float(MODEL_CONFIG.get('best_threshold', 0.5)),
        features_count=len(MODEL_CONFIG.get('features', []))
    )


@app.post("/predict", response_model=RiskPrediction)
async def predict(patient: PatientData):
    """
    Predict risk for a single patient.
    
    Returns:
        RiskPrediction: Contains risk score, level, and confidence
    """
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert patient data to DataFrame
        patient_dict = patient.dict()
        patient_df = pd.DataFrame([patient_dict])
        
        # Ensure features match model training
        expected_features = MODEL_CONFIG.get('features', [])
        for feature in expected_features:
            if feature not in patient_df.columns:
                patient_df[feature] = 0
        
        # Select only expected features
        patient_df = patient_df[expected_features]
        
        # Get prediction
        threshold = float(MODEL_CONFIG.get('best_threshold', 0.5))
        risk_score = float(MODEL.predict_proba(patient_df)[0][1])
        risk_level = categorize_risk(risk_score)
        risk_emoji = get_risk_emoji(risk_level)
        
        # Calculate confidence
        confidence = abs(risk_score - threshold) * 100
        confidence = min(confidence, 100)
        
        return RiskPrediction(
            risk_score=risk_score,
            risk_level=risk_level,
            risk_emoji=risk_emoji,
            confidence=confidence
        )
    
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def batch_predict(request: BatchPredictionRequest):
    """
    Predict risk for multiple patients.
    
    Args:
        request: BatchPredictionRequest with list of patients
    
    Returns:
        BatchPredictionResponse: Contains predictions and risk distribution
    """
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        start_time = time.time()
        
        # Convert to DataFrame
        patients_data = [patient.dict() for patient in request.patients]
        patients_df = pd.DataFrame(patients_data)
        
        # Ensure features match model training
        expected_features = MODEL_CONFIG.get('features', [])
        for feature in expected_features:
            if feature not in patients_df.columns:
                patients_df[feature] = 0
        
        patients_df = patients_df[expected_features]
        
        # Get predictions
        threshold = float(MODEL_CONFIG.get('best_threshold', 0.5))
        risk_scores = MODEL.predict_proba(patients_df)[:, 1]
        
        predictions = []
        high_risk_count = 0
        medium_risk_count = 0
        low_risk_count = 0
        
        for risk_score in risk_scores:
            risk_level = categorize_risk(risk_score)
            risk_emoji = get_risk_emoji(risk_level)
            confidence = abs(risk_score - threshold) * 100
            confidence = min(confidence, 100)
            
            predictions.append(RiskPrediction(
                risk_score=float(risk_score),
                risk_level=risk_level,
                risk_emoji=risk_emoji,
                confidence=confidence
            ))
            
            if risk_level == 'high':
                high_risk_count += 1
            elif risk_level == 'medium':
                medium_risk_count += 1
            else:
                low_risk_count += 1
        
        processing_time = (time.time() - start_time) * 1000
        
        return BatchPredictionResponse(
            predictions=predictions,
            total_count=len(predictions),
            high_risk_count=high_risk_count,
            medium_risk_count=medium_risk_count,
            low_risk_count=low_risk_count,
            processing_time_ms=processing_time
        )
    
    except Exception as e:
        logger.error(f"Error during batch prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")


@app.post("/predict/csv")
async def predict_from_csv(file: UploadFile = File(...)):
    """
    Predict risk from uploaded CSV file.
    
    CSV should contain columns matching the model's expected features.
    """
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read CSV
        contents = await file.read()
        df = pd.read_csv(pd.io.common.StringIO(contents.decode('utf-8')))
        
        # Prepare data
        expected_features = MODEL_CONFIG.get('features', [])
        for feature in expected_features:
            if feature not in df.columns:
                df[feature] = 0
        
        df = df[expected_features]
        
        # Get predictions
        threshold = float(MODEL_CONFIG.get('best_threshold', 0.5))
        risk_scores = MODEL.predict_proba(df)[:, 1]
        
        # Add predictions to dataframe
        df['risk_score'] = risk_scores
        df['risk_level'] = [categorize_risk(score) for score in risk_scores]
        df['risk_emoji'] = [get_risk_emoji(categorize_risk(score)) for score in risk_scores]
        
        # Return as JSON
        return {
            "total_predictions": len(df),
            "data": df.to_dict(orient='records')
        }
    
    except Exception as e:
        logger.error(f"Error processing CSV: {e}")
        raise HTTPException(status_code=500, detail=f"CSV processing failed: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Patient Risk Prediction API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": MODEL_LOADED,
        "endpoints": {
            "health": "/health",
            "model_info": "/model/info",
            "predict_single": "/predict (POST)",
            "predict_batch": "/predict/batch (POST)",
            "predict_csv": "/predict/csv (POST)",
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )

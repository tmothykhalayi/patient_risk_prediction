"""
Pydantic schemas for API request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class PatientData(BaseModel):
    """Single patient data point for prediction."""
    age: float = Field(..., ge=0, le=150)
    bmi: float = Field(..., ge=10, le=100)
    gender: str = Field(..., description="Male or Female")
    
    # Vital signs
    systolic_bp: float = Field(..., ge=50, le=250)
    diastolic_bp: float = Field(..., ge=30, le=150)
    heart_rate: float = Field(..., ge=30, le=200)
    temperature: float = Field(..., ge=35, le=42)
    respiratory_rate: float = Field(..., ge=8, le=60)
    
    # Lab values
    glucose: float = Field(..., ge=0)
    creatinine: float = Field(..., ge=0)
    hemoglobin: float = Field(..., ge=0)
    wbc_count: float = Field(..., ge=0)
    platelets: float = Field(..., ge=0)
    
    # Comorbidities (0 or 1)
    diabetes: int = Field(0, ge=0, le=1)
    hypertension: int = Field(0, ge=0, le=1)
    heart_disease: int = Field(0, ge=0, le=1)
    copd: int = Field(0, ge=0, le=1)
    chronic_kidney_disease: int = Field(0, ge=0, le=1)
    
    # Medications
    medication_count: int = Field(0, ge=0)
    antibiotic_use: int = Field(0, ge=0, le=1)
    corticosteroid_use: int = Field(0, ge=0, le=1)
    
    class Config:
        schema_extra = {
            "example": {
                "age": 65,
                "bmi": 28.5,
                "gender": "Male",
                "systolic_bp": 140,
                "diastolic_bp": 90,
                "heart_rate": 75,
                "temperature": 37.0,
                "respiratory_rate": 16,
                "glucose": 120,
                "creatinine": 1.2,
                "hemoglobin": 13.5,
                "wbc_count": 7.5,
                "platelets": 250,
                "diabetes": 1,
                "hypertension": 1,
                "heart_disease": 0,
                "copd": 0,
                "chronic_kidney_disease": 0,
                "medication_count": 5,
                "antibiotic_use": 0,
                "corticosteroid_use": 0
            }
        }


class RiskPrediction(BaseModel):
    """Risk prediction output."""
    risk_score: float = Field(..., ge=0, le=1, description="Risk probability between 0 and 1")
    risk_level: str = Field(..., description="Low, Medium, or High")
    risk_emoji: str = Field(..., description="Visual indicator")
    confidence: float = Field(..., ge=0, le=100, description="Confidence percentage")
    
    class Config:
        schema_extra = {
            "example": {
                "risk_score": 0.75,
                "risk_level": "High",
                "risk_emoji": "🔴",
                "confidence": 92.5
            }
        }


class BatchPredictionRequest(BaseModel):
    """Batch prediction request."""
    patients: List[PatientData] = Field(..., description="List of patients for prediction")
    
    class Config:
        schema_extra = {
            "example": {
                "patients": [
                    {
                        "age": 65,
                        "bmi": 28.5,
                        "gender": "Male",
                        "systolic_bp": 140,
                        "diastolic_bp": 90,
                        "heart_rate": 75,
                        "temperature": 37.0,
                        "respiratory_rate": 16,
                        "glucose": 120,
                        "creatinine": 1.2,
                        "hemoglobin": 13.5,
                        "wbc_count": 7.5,
                        "platelets": 250,
                        "diabetes": 1,
                        "hypertension": 1,
                        "heart_disease": 0,
                        "copd": 0,
                        "chronic_kidney_disease": 0,
                        "medication_count": 5,
                        "antibiotic_use": 0,
                        "corticosteroid_use": 0
                    }
                ]
            }
        }


class BatchPredictionResponse(BaseModel):
    """Batch prediction response."""
    predictions: List[RiskPrediction]
    total_count: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    processing_time_ms: float


class ModelInfo(BaseModel):
    """Model information endpoint."""
    model_name: str
    model_type: str
    version: str
    training_date: datetime
    accuracy: float
    roc_auc: float
    recall: float
    precision: float
    threshold: float
    features_count: int
    
    class Config:
        schema_extra = {
            "example": {
                "model_name": "Patient Risk Prediction Model",
                "model_type": "Logistic Regression",
                "version": "1.0.0",
                "training_date": "2024-01-15T10:30:00",
                "accuracy": 0.82,
                "roc_auc": 0.85,
                "recall": 0.85,
                "precision": 0.39,
                "threshold": 0.371,
                "features_count": 42
            }
        }


class HealthCheck(BaseModel):
    """Health check response."""
    status: str
    message: str
    timestamp: datetime
    model_loaded: bool
    
    class Config:
        schema_extra = {
            "example": {
                "status": "healthy",
                "message": "API is running",
                "timestamp": "2024-01-15T10:30:00",
                "model_loaded": True
            }
        }


class ErrorResponse(BaseModel):
    """Error response."""
    error: str
    detail: str
    timestamp: datetime
    
    class Config:
        schema_extra = {
            "example": {
                "error": "Validation Error",
                "detail": "Invalid input data",
                "timestamp": "2024-01-15T10:30:00"
            }
        }

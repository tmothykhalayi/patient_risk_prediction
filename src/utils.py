"""
Utility functions, constants, and configuration for the patient risk prediction pipeline.
"""

import os
import json
import pickle
import joblib
from typing import Any, Dict, List
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Project structure paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DATA_DIR = os.path.join(DATA_DIR, 'raw')
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, 'processed')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')

# Create directories if they don't exist
for directory in [RAW_DATA_DIR, PROCESSED_DATA_DIR, MODELS_DIR, REPORTS_DIR]:
    os.makedirs(directory, exist_ok=True)

# Data configuration
RANDOM_STATE = 42
TEST_SIZE = 0.2
CV_FOLDS = 5
CORRELATION_THRESHOLD = 0.90

# Model hyperparameters
MODEL_PARAMS = {
    'logistic_regression': {
        'max_iter': 1000,
        'random_state': RANDOM_STATE,
        'class_weight': 'balanced'
    },
    'random_forest': {
        'n_estimators': 100,
        'max_depth': 15,
        'random_state': RANDOM_STATE,
        'class_weight': 'balanced',
        'n_jobs': -1
    },
    'gradient_boosting': {
        'n_estimators': 100,
        'learning_rate': 0.1,
        'max_depth': 5,
        'random_state': RANDOM_STATE
    },
    'xgboost': {
        'n_estimators': 100,
        'learning_rate': 0.1,
        'max_depth': 5,
        'random_state': RANDOM_STATE,
        'scale_pos_weight': 1
    }
}

# Clinical feature mapping
CLINICAL_FEATURES = {
    'vitals': ['systolic_bp', 'diastolic_bp', 'heart_rate', 'temperature', 'respiratory_rate'],
    'labs': ['glucose', 'creatinine', 'hemoglobin', 'wbc_count', 'platelets'],
    'demographics': ['age', 'gender', 'bmi'],
    'comorbidities': ['diabetes', 'hypertension', 'heart_disease', 'copd', 'chronic_kidney_disease'],
    'medications': ['medication_count', 'antibiotic_use', 'corticosteroid_use']
}

# Target variable
TARGET_COLUMN = 'readmission_risk'

# Risk level mapping
RISK_LEVELS = {
    'low': (0.0, 0.33),
    'medium': (0.33, 0.67),
    'high': (0.67, 1.0)
}

RISK_EMOJIS = {
    'low': '🟢',
    'medium': '🟡',
    'high': '🔴'
}


def save_model(model: Any, filepath: str) -> None:
    """Save a model using joblib."""
    try:
        joblib.dump(model, filepath)
        logger.info(f"Model saved successfully to {filepath}")
    except Exception as e:
        logger.error(f"Error saving model: {e}")
        raise


def load_model(filepath: str) -> Any:
    """Load a model using joblib."""
    try:
        model = joblib.load(filepath)
        logger.info(f"Model loaded successfully from {filepath}")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise


def save_config(config: Dict[str, Any], filepath: str) -> None:
    """Save configuration to JSON file."""
    try:
        with open(filepath, 'w') as f:
            json.dump(config, f, indent=4, default=str)
        logger.info(f"Config saved to {filepath}")
    except Exception as e:
        logger.error(f"Error saving config: {e}")
        raise


def load_config(filepath: str) -> Dict[str, Any]:
    """Load configuration from JSON file."""
    try:
        with open(filepath, 'r') as f:
            config = json.load(f)
        logger.info(f"Config loaded from {filepath}")
        return config
    except Exception as e:
        logger.error(f"Error loading config: {e}")
        raise


def get_all_features() -> List[str]:
    """Get all clinical features as a flat list."""
    features = []
    for feature_list in CLINICAL_FEATURES.values():
        features.extend(feature_list)
    return features


def categorize_risk(score: float) -> str:
    """Categorize a risk score into low, medium, or high."""
    if score < RISK_LEVELS['low'][1]:
        return 'low'
    elif score < RISK_LEVELS['medium'][1]:
        return 'medium'
    else:
        return 'high'


def get_risk_emoji(risk_level: str) -> str:
    """Get emoji representation for risk level."""
    return RISK_EMOJIS.get(risk_level, '❓')

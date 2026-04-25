"""
Data loading and validation module for EHR data.
"""

import pandas as pd
import numpy as np
import logging
from typing import Tuple, List, Optional
from src.utils import RAW_DATA_DIR, TARGET_COLUMN, CLINICAL_FEATURES

logger = logging.getLogger(__name__)


class DataLoader:
    """Load and validate patient EHR data."""
    
    def __init__(self, filepath: str = None):
        """Initialize DataLoader with optional filepath."""
        self.filepath = filepath
        self.data = None
        self.validation_errors = []
    
    def load_data(self, filepath: Optional[str] = None) -> pd.DataFrame:
        """Load data from CSV file."""
        if filepath is None:
            filepath = self.filepath
        
        if filepath is None:
            raise ValueError("No filepath provided")
        
        try:
            self.data = pd.read_csv(filepath)
            logger.info(f"Data loaded successfully. Shape: {self.data.shape}")
            return self.data
        except FileNotFoundError:
            logger.error(f"File not found: {filepath}")
            raise
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise
    
    def validate_data(self) -> bool:
        """Validate data for logical impossibilities and inconsistencies."""
        if self.data is None:
            logger.error("No data loaded. Call load_data() first.")
            return False
        
        self.validation_errors = []
        
        # Check for required columns
        required_columns = [TARGET_COLUMN]
        for feature_list in CLINICAL_FEATURES.values():
            required_columns.extend(feature_list)
        
        missing_columns = [col for col in required_columns if col not in self.data.columns]
        if missing_columns:
            self.validation_errors.append(f"Missing columns: {missing_columns}")
        
        # Validate vital signs ranges
        if 'systolic_bp' in self.data.columns:
            invalid_bp = self.data[(self.data['systolic_bp'] < 50) | (self.data['systolic_bp'] > 250)]
            if len(invalid_bp) > 0:
                self.validation_errors.append(f"Invalid systolic BP values: {len(invalid_bp)} records")
        
        if 'heart_rate' in self.data.columns:
            invalid_hr = self.data[(self.data['heart_rate'] < 30) | (self.data['heart_rate'] > 200)]
            if len(invalid_hr) > 0:
                self.validation_errors.append(f"Invalid heart rate values: {len(invalid_hr)} records")
        
        # Validate lab values
        lab_columns = CLINICAL_FEATURES.get('labs', [])
        for col in lab_columns:
            if col in self.data.columns:
                negative_values = self.data[self.data[col] < 0]
                if len(negative_values) > 0:
                    self.validation_errors.append(f"Negative values in {col}: {len(negative_values)} records")
        
        # Validate demographics
        if 'age' in self.data.columns:
            invalid_age = self.data[(self.data['age'] < 0) | (self.data['age'] > 150)]
            if len(invalid_age) > 0:
                self.validation_errors.append(f"Invalid age values: {len(invalid_age)} records")
        
        if 'bmi' in self.data.columns:
            invalid_bmi = self.data[(self.data['bmi'] < 10) | (self.data['bmi'] > 100)]
            if len(invalid_bmi) > 0:
                self.validation_errors.append(f"Invalid BMI values: {len(invalid_bmi)} records")
        
        # Validate target variable
        if TARGET_COLUMN in self.data.columns:
            if not self.data[TARGET_COLUMN].isin([0, 1]).all():
                self.validation_errors.append(f"{TARGET_COLUMN} contains invalid values (should be 0 or 1)")
        
        # Log validation results
        if self.validation_errors:
            for error in self.validation_errors:
                logger.warning(f"Validation warning: {error}")
            logger.warning(f"Total validation warnings: {len(self.validation_errors)}")
            return False
        else:
            logger.info("Data validation passed successfully")
            return True
    
    def get_data_summary(self) -> dict:
        """Get summary statistics of the data."""
        if self.data is None:
            logger.error("No data loaded")
            return {}
        
        summary = {
            'total_records': len(self.data),
            'total_features': len(self.data.columns),
            'missing_values': self.data.isnull().sum().to_dict(),
            'duplicates': self.data.duplicated().sum(),
            'target_distribution': self.data[TARGET_COLUMN].value_counts().to_dict() if TARGET_COLUMN in self.data.columns else None,
            'memory_usage': self.data.memory_usage(deep=True).sum() / 1024**2  # MB
        }
        
        logger.info(f"Data Summary: {summary['total_records']} records, {summary['total_features']} features")
        return summary
    
    def check_data_types(self) -> dict:
        """Check and report data types."""
        if self.data is None:
            logger.error("No data loaded")
            return {}
        
        dtype_summary = {
            'numeric': self.data.select_dtypes(include=[np.number]).columns.tolist(),
            'categorical': self.data.select_dtypes(include=['object']).columns.tolist(),
            'datetime': self.data.select_dtypes(include=['datetime64']).columns.tolist()
        }
        
        logger.info(f"Data types: {len(dtype_summary['numeric'])} numeric, {len(dtype_summary['categorical'])} categorical, {len(dtype_summary['datetime'])} datetime")
        return dtype_summary


def load_patient_data(filepath: Optional[str] = None) -> Tuple[pd.DataFrame, bool]:
    """Convenience function to load and validate patient data."""
    loader = DataLoader(filepath)
    data = loader.load_data()
    is_valid = loader.validate_data()
    summary = loader.get_data_summary()
    
    return data, is_valid

"""
Feature engineering module for clinical features.
"""

import pandas as pd
import numpy as np
import logging
from typing import List, Tuple
from src.utils import CLINICAL_FEATURES, TARGET_COLUMN

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """Create derived features and encode categorical variables."""
    
    def __init__(self, data: pd.DataFrame):
        """Initialize with dataframe."""
        self.data = data.copy()
        self.created_features = []
        self.encoded_features = []
    
    def create_vital_features(self) -> pd.DataFrame:
        """Create derived vital sign features."""
        vitals = CLINICAL_FEATURES.get('vitals', [])
        
        # Pulse Pressure
        if 'systolic_bp' in self.data.columns and 'diastolic_bp' in self.data.columns:
            self.data['pulse_pressure'] = self.data['systolic_bp'] - self.data['diastolic_bp']
            self.created_features.append('pulse_pressure')
        
        # Mean Arterial Pressure
        if 'systolic_bp' in self.data.columns and 'diastolic_bp' in self.data.columns:
            self.data['mean_arterial_pressure'] = (self.data['systolic_bp'] + 2 * self.data['diastolic_bp']) / 3
            self.created_features.append('mean_arterial_pressure')
        
        logger.info(f"Created {len([f for f in ['pulse_pressure', 'mean_arterial_pressure'] if f in self.created_features])} vital features")
        return self.data
    
    def create_demographic_features(self) -> pd.DataFrame:
        """Create derived demographic features."""
        # Age-BMI Interaction
        if 'age' in self.data.columns and 'bmi' in self.data.columns:
            self.data['age_bmi_ratio'] = self.data['age'] / (self.data['bmi'] + 1)
            self.created_features.append('age_bmi_ratio')
        
        # Age groups
        if 'age' in self.data.columns:
            bins = [0, 18, 35, 50, 65, 80, 150]
            labels = ['0-18', '19-35', '36-50', '51-65', '66-80', '80+']
            self.data['age_group'] = pd.cut(self.data['age'], bins=bins, labels=labels)
            self.created_features.append('age_group')
        
        # BMI Category
        if 'bmi' in self.data.columns:
            self.data['bmi_category'] = pd.cut(
                self.data['bmi'],
                bins=[0, 18.5, 25, 30, 35, 100],
                labels=['underweight', 'normal', 'overweight', 'obese', 'severely_obese']
            )
            self.created_features.append('bmi_category')
        
        logger.info(f"Created {len([f for f in ['age_bmi_ratio', 'age_group', 'bmi_category'] if f in self.created_features])} demographic features")
        return self.data
    
    def create_lab_features(self) -> pd.DataFrame:
        """Create derived lab value features."""
        labs = CLINICAL_FEATURES.get('labs', [])
        
        # Glucose-Creatinine Ratio (kidney function indicator)
        if 'glucose' in self.data.columns and 'creatinine' in self.data.columns:
            self.data['glucose_creatinine_ratio'] = (self.data['glucose'] + 1) / (self.data['creatinine'] + 1)
            self.created_features.append('glucose_creatinine_ratio')
        
        # WBC to Platelets Ratio
        if 'wbc_count' in self.data.columns and 'platelets' in self.data.columns:
            self.data['wbc_platelet_ratio'] = (self.data['wbc_count'] + 1) / (self.data['platelets'] + 1)
            self.created_features.append('wbc_platelet_ratio')
        
        # Hemoglobin to WBC Ratio
        if 'hemoglobin' in self.data.columns and 'wbc_count' in self.data.columns:
            self.data['hemoglobin_wbc_ratio'] = (self.data['hemoglobin'] + 1) / (self.data['wbc_count'] + 1)
            self.created_features.append('hemoglobin_wbc_ratio')
        
        logger.info(f"Created {len([f for f in ['glucose_creatinine_ratio', 'wbc_platelet_ratio', 'hemoglobin_wbc_ratio'] if f in self.created_features])} lab features")
        return self.data
    
    def create_comorbidity_index(self) -> pd.DataFrame:
        """Create comorbidity index from binary comorbidity features."""
        comorbidities = CLINICAL_FEATURES.get('comorbidities', [])
        existing_comorbidities = [col for col in comorbidities if col in self.data.columns]
        
        if existing_comorbidities:
            self.data['comorbidity_index'] = self.data[existing_comorbidities].sum(axis=1)
            self.created_features.append('comorbidity_index')
            logger.info(f"Created comorbidity index from {len(existing_comorbidities)} conditions")
        
        return self.data
    
    def create_medication_features(self) -> pd.DataFrame:
        """Create medication-related features."""
        medications = CLINICAL_FEATURES.get('medications', [])
        
        # Medication burden
        med_use_cols = [col for col in medications if col in self.data.columns and col != 'medication_count']
        if med_use_cols:
            self.data['medication_types_used'] = self.data[med_use_cols].sum(axis=1)
            self.created_features.append('medication_types_used')
        
        logger.info(f"Created medication-related features")
        return self.data
    
    def encode_categorical_features(self, method: str = 'one_hot') -> pd.DataFrame:
        """Encode categorical features."""
        categorical_cols = self.data.select_dtypes(include=['object']).columns.tolist()
        categorical_cols = [col for col in categorical_cols if col != TARGET_COLUMN]
        
        if not categorical_cols:
            logger.info("No categorical features to encode")
            return self.data
        
        if method == 'one_hot':
            self.data = pd.get_dummies(self.data, columns=categorical_cols, drop_first=True)
            self.encoded_features = categorical_cols
            logger.info(f"One-hot encoded {len(categorical_cols)} categorical features")
        
        elif method == 'label':
            from sklearn.preprocessing import LabelEncoder
            le_dict = {}
            for col in categorical_cols:
                le = LabelEncoder()
                self.data[col] = le.fit_transform(self.data[col].astype(str))
                le_dict[col] = le
            self.encoded_features = categorical_cols
            logger.info(f"Label encoded {len(categorical_cols)} categorical features")
        
        return self.data
    
    def scale_numeric_features(self) -> pd.DataFrame:
        """Flag numeric features for scaling (actual scaling done in pipeline)."""
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        numeric_cols = [col for col in numeric_cols if col != TARGET_COLUMN]
        logger.info(f"Identified {len(numeric_cols)} numeric features for scaling")
        return self.data
    
    def get_feature_engineering_report(self) -> dict:
        """Get summary report of feature engineering."""
        return {
            'created_features': self.created_features,
            'encoded_features': self.encoded_features,
            'total_features_created': len(self.created_features),
            'total_features_encoded': len(self.encoded_features),
            'final_feature_count': len(self.data.columns) - 1  # Exclude target
        }
    
    def engineer_all(self) -> pd.DataFrame:
        """Execute all feature engineering steps."""
        logger.info("Starting feature engineering pipeline...")
        self.create_vital_features()
        self.create_demographic_features()
        self.create_lab_features()
        self.create_comorbidity_index()
        self.create_medication_features()
        self.encode_categorical_features(method='one_hot')
        self.scale_numeric_features()
        logger.info("Feature engineering completed")
        return self.data


def engineer_features(data: pd.DataFrame) -> Tuple[pd.DataFrame, dict]:
    """Convenience function to engineer features."""
    engineer = FeatureEngineer(data)
    engineered_data = engineer.engineer_all()
    report = engineer.get_feature_engineering_report()
    return engineered_data, report

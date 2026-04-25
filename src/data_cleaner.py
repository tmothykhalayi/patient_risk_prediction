"""
Data cleaning and preprocessing module.
"""

import pandas as pd
import numpy as np
import logging
from typing import Tuple, List
from sklearn.impute import SimpleImputer
from src.utils import CORRELATION_THRESHOLD, TARGET_COLUMN, CLINICAL_FEATURES

logger = logging.getLogger(__name__)


class DataCleaner:
    """Clean and preprocess patient EHR data."""
    
    def __init__(self, data: pd.DataFrame):
        """Initialize with dataframe."""
        self.data = data.copy()
        self.original_shape = data.shape
        self.removed_features = []
        self.imputation_report = {}
    
    def remove_duplicates(self) -> pd.DataFrame:
        """Remove duplicate records."""
        initial_count = len(self.data)
        self.data = self.data.drop_duplicates()
        removed_count = initial_count - len(self.data)
        logger.info(f"Removed {removed_count} duplicate records")
        return self.data
    
    def handle_missing_values(self) -> pd.DataFrame:
        """Handle missing values with imputation."""
        missing_summary = self.data.isnull().sum()
        columns_with_missing = missing_summary[missing_summary > 0]
        
        if len(columns_with_missing) == 0:
            logger.info("No missing values found")
            return self.data
        
        logger.info(f"Found missing values in {len(columns_with_missing)} columns")
        
        # Get numeric and categorical columns
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = self.data.select_dtypes(include=['object']).columns.tolist()
        
        # Impute numeric columns with median
        numeric_imputer = SimpleImputer(strategy='median')
        numeric_missing = [col for col in numeric_cols if self.data[col].isnull().any()]
        if numeric_missing:
            self.data[numeric_missing] = numeric_imputer.fit_transform(self.data[numeric_missing])
            self.imputation_report['numeric'] = {col: 'median' for col in numeric_missing}
            logger.info(f"Imputed {len(numeric_missing)} numeric columns with median")
        
        # Impute categorical columns with mode
        categorical_imputer = SimpleImputer(strategy='most_frequent')
        categorical_missing = [col for col in categorical_cols if self.data[col].isnull().any()]
        if categorical_missing:
            self.data[categorical_missing] = categorical_imputer.fit_transform(self.data[categorical_missing])
            self.imputation_report['categorical'] = {col: 'mode' for col in categorical_missing}
            logger.info(f"Imputed {len(categorical_missing)} categorical columns with mode")
        
        return self.data
    
    def remove_high_correlation_features(self) -> pd.DataFrame:
        """Remove features with high correlation to prevent multicollinearity."""
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        
        if len(numeric_cols) < 2:
            logger.info("Insufficient numeric features for correlation analysis")
            return self.data
        
        # Calculate correlation matrix
        corr_matrix = self.data[numeric_cols].corr().abs()
        
        # Find highly correlated features
        upper_tri = corr_matrix.where(
            np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
        )
        
        high_corr_features = []
        for column in upper_tri.columns:
            corr_cols = upper_tri[column][upper_tri[column] > CORRELATION_THRESHOLD].index.tolist()
            if corr_cols:
                high_corr_features.extend([(column, col) for col in corr_cols])
        
        # Remove features (keep first of each pair, skip target)
        features_to_remove = set()
        for feat1, feat2 in high_corr_features:
            if feat1 != TARGET_COLUMN and feat2 != TARGET_COLUMN:
                # Remove the second feature in each pair
                features_to_remove.add(feat2)
        
        if features_to_remove:
            self.removed_features = list(features_to_remove)
            self.data = self.data.drop(columns=self.removed_features)
            logger.info(f"Removed {len(self.removed_features)} highly correlated features: {self.removed_features}")
        else:
            logger.info("No highly correlated features found")
        
        return self.data
    
    def handle_outliers(self, method: str = 'iqr', threshold: float = 1.5) -> pd.DataFrame:
        """Handle outliers using IQR or z-score method."""
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        numeric_cols = [col for col in numeric_cols if col != TARGET_COLUMN]
        
        if method == 'iqr':
            for col in numeric_cols:
                Q1 = self.data[col].quantile(0.25)
                Q3 = self.data[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - threshold * IQR
                upper_bound = Q3 + threshold * IQR
                
                outliers = self.data[(self.data[col] < lower_bound) | (self.data[col] > upper_bound)]
                if len(outliers) > 0:
                    logger.info(f"Found {len(outliers)} outliers in {col} (IQR method)")
                    # Cap outliers instead of removing them
                    self.data[col] = self.data[col].clip(lower_bound, upper_bound)
        
        elif method == 'zscore':
            from scipy import stats
            z_scores = np.abs(stats.zscore(self.data[numeric_cols].fillna(0)))
            outliers = (z_scores > threshold).any(axis=1)
            logger.info(f"Found {outliers.sum()} outliers using z-score method")
        
        logger.info("Outliers handled successfully")
        return self.data
    
    def get_cleaning_report(self) -> dict:
        """Get a summary report of cleaning operations."""
        return {
            'original_shape': self.original_shape,
            'final_shape': self.data.shape,
            'removed_features': self.removed_features,
            'imputation_report': self.imputation_report,
            'rows_removed': self.original_shape[0] - self.data.shape[0],
            'columns_removed': self.original_shape[1] - self.data.shape[1]
        }
    
    def clean_all(self) -> pd.DataFrame:
        """Execute all cleaning steps."""
        logger.info("Starting data cleaning pipeline...")
        self.remove_duplicates()
        self.handle_missing_values()
        self.remove_high_correlation_features()
        self.handle_outliers()
        logger.info("Data cleaning completed")
        return self.data


def clean_data(data: pd.DataFrame) -> Tuple[pd.DataFrame, dict]:
    """Convenience function to clean data."""
    cleaner = DataCleaner(data)
    cleaned_data = cleaner.clean_all()
    report = cleaner.get_cleaning_report()
    return cleaned_data, report

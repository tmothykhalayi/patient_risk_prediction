"""
Model training and cross-validation module.
"""

import pandas as pd
import numpy as np
import logging
from typing import Tuple, Dict, List, Any
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, precision_recall_curve
from src.utils import MODEL_PARAMS, RANDOM_STATE, TEST_SIZE, CV_FOLDS, TARGET_COLUMN

logger = logging.getLogger(__name__)


class ModelTrainer:
    """Train and evaluate multiple models with cross-validation."""
    
    def __init__(self, X: pd.DataFrame, y: pd.Series):
        """Initialize with features and target."""
        self.X = X
        self.y = y
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.models = {}
        self.cv_results = {}
        self.best_model = None
        self.best_model_name = None
        self.best_threshold = 0.5
    
    def train_test_split(self, test_size: float = TEST_SIZE, random_state: int = RANDOM_STATE) -> Tuple:
        """Split data into train and test sets."""
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y,
            test_size=test_size,
            random_state=random_state,
            stratify=self.y
        )
        
        logger.info(f"Train/Test split - Train: {len(self.X_train)}, Test: {len(self.X_test)}")
        logger.info(f"Train set target distribution: {self.y_train.value_counts().to_dict()}")
        logger.info(f"Test set target distribution: {self.y_test.value_counts().to_dict()}")
        
        return self.X_train, self.X_test, self.y_train, self.y_test
    
    def build_pipeline(self, model_name: str) -> Pipeline:
        """Build sklearn pipeline for a model."""
        if model_name not in MODEL_PARAMS:
            raise ValueError(f"Unknown model: {model_name}")
        
        params = MODEL_PARAMS[model_name]
        
        if model_name == 'logistic_regression':
            model = LogisticRegression(**params)
            pipeline = Pipeline([
                ('scaler', StandardScaler()),
                ('model', model)
            ])
        
        elif model_name == 'random_forest':
            model = RandomForestClassifier(**params)
            pipeline = Pipeline([
                ('model', model)
            ])
        
        elif model_name == 'gradient_boosting':
            model = GradientBoostingClassifier(**params)
            pipeline = Pipeline([
                ('model', model)
            ])
        
        elif model_name == 'xgboost':
            model = XGBClassifier(**params)
            pipeline = Pipeline([
                ('model', model)
            ])
        
        return pipeline
    
    def cross_validate_model(self, model_name: str, cv_folds: int = CV_FOLDS) -> Dict[str, Any]:
        """Perform stratified k-fold cross-validation."""
        logger.info(f"Starting {cv_folds}-fold cross-validation for {model_name}...")
        
        pipeline = self.build_pipeline(model_name)
        
        cv = StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=RANDOM_STATE)
        
        scoring = {
            'accuracy': 'accuracy',
            'precision': 'precision',
            'recall': 'recall',
            'f1': 'f1',
            'roc_auc': 'roc_auc'
        }
        
        cv_results = cross_validate(
            pipeline, self.X_train, self.y_train,
            cv=cv, scoring=scoring,
            return_train_score=True, n_jobs=-1
        )
        
        # Summarize results
        summary = {}
        for metric in scoring.keys():
            train_scores = cv_results[f'train_{metric}']
            test_scores = cv_results[f'test_{metric}']
            summary[metric] = {
                'train_mean': train_scores.mean(),
                'train_std': train_scores.std(),
                'test_mean': test_scores.mean(),
                'test_std': test_scores.std()
            }
        
        self.cv_results[model_name] = summary
        
        logger.info(f"CV Results for {model_name}:")
        for metric, scores in summary.items():
            logger.info(f"  {metric}: {scores['test_mean']:.4f} (+/- {scores['test_std']:.4f})")
        
        return summary
    
    def train_model(self, model_name: str) -> Pipeline:
        """Train model on training set."""
        logger.info(f"Training {model_name} on full training set...")
        
        pipeline = self.build_pipeline(model_name)
        pipeline.fit(self.X_train, self.y_train)
        
        # Calculate training metrics
        train_score = pipeline.score(self.X_train, self.y_train)
        test_score = pipeline.score(self.X_test, self.y_test)
        
        logger.info(f"Training accuracy: {train_score:.4f}")
        logger.info(f"Test accuracy: {test_score:.4f}")
        
        self.models[model_name] = pipeline
        return pipeline
    
    def train_all_models(self) -> Dict[str, Pipeline]:
        """Train all available models."""
        logger.info("Training all models...")
        
        for model_name in MODEL_PARAMS.keys():
            try:
                self.cross_validate_model(model_name)
                self.train_model(model_name)
            except Exception as e:
                logger.error(f"Error training {model_name}: {e}")
        
        logger.info(f"Successfully trained {len(self.models)} models")
        return self.models
    
    def select_best_model(self) -> Tuple[str, Pipeline]:
        """Select best model based on ROC-AUC score."""
        if not self.models:
            raise ValueError("No models trained yet")
        
        best_auc = -1
        best_name = None
        
        for model_name, pipeline in self.models.items():
            y_pred_proba = pipeline.predict_proba(self.X_test)[:, 1]
            auc = roc_auc_score(self.y_test, y_pred_proba)
            
            if auc > best_auc:
                best_auc = auc
                best_name = model_name
        
        self.best_model = self.models[best_name]
        self.best_model_name = best_name
        
        logger.info(f"Best model selected: {best_name} (ROC-AUC: {best_auc:.4f})")
        return best_name, self.best_model
    
    def tune_threshold(self, target_recall: float = 0.85) -> float:
        """Tune classification threshold to achieve target recall."""
        if self.best_model is None:
            raise ValueError("No best model selected yet")
        
        y_pred_proba = self.best_model.predict_proba(self.X_test)[:, 1]
        precision, recall, thresholds = precision_recall_curve(self.y_test, y_pred_proba)
        
        # Find threshold closest to target recall
        idx = np.argmin(np.abs(recall - target_recall))
        optimal_threshold = thresholds[idx] if idx < len(thresholds) else 0.5
        
        self.best_threshold = optimal_threshold
        logger.info(f"Optimal threshold: {optimal_threshold:.4f} (target recall: {target_recall:.4f})")
        logger.info(f"Achieved recall: {recall[idx]:.4f}")
        
        return optimal_threshold
    
    def get_training_summary(self) -> Dict[str, Any]:
        """Get summary of training results."""
        return {
            'models_trained': len(self.models),
            'best_model': self.best_model_name,
            'best_threshold': self.best_threshold,
            'cv_results': self.cv_results,
            'models': list(self.models.keys())
        }


def train_models(X: pd.DataFrame, y: pd.Series) -> Tuple[Pipeline, str, float, Dict]:
    """Convenience function to train and select best model."""
    trainer = ModelTrainer(X, y)
    trainer.train_test_split()
    trainer.train_all_models()
    best_name, best_model = trainer.select_best_model()
    best_threshold = trainer.tune_threshold()
    summary = trainer.get_training_summary()
    
    return best_model, best_name, best_threshold, summary

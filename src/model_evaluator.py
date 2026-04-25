"""
Model evaluation and reporting module.
"""

import pandas as pd
import numpy as np
import logging
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Tuple, Any
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_curve, auc, roc_auc_score,
    precision_recall_curve, f1_score
)
from sklearn.pipeline import Pipeline
from src.utils import REPORTS_DIR, TARGET_COLUMN, categorize_risk, get_risk_emoji

logger = logging.getLogger(__name__)


class ModelEvaluator:
    """Evaluate model performance and generate comprehensive reports."""
    
    def __init__(self, model: Pipeline, X_test: pd.DataFrame, y_test: pd.Series,
                 best_threshold: float = 0.5, output_dir: str = REPORTS_DIR):
        """Initialize evaluator."""
        self.model = model
        self.X_test = X_test
        self.y_test = y_test
        self.best_threshold = best_threshold
        self.output_dir = output_dir
        
        # Get predictions
        self.y_pred_proba = model.predict_proba(X_test)[:, 1]
        self.y_pred = (self.y_pred_proba >= best_threshold).astype(int)
        
        # Calculate metrics
        self.metrics = self._calculate_metrics()
    
    def _calculate_metrics(self) -> Dict[str, Any]:
        """Calculate comprehensive evaluation metrics."""
        metrics = {}
        
        # Classification metrics
        metrics['accuracy'] = np.mean(self.y_pred == self.y_test)
        metrics['f1'] = f1_score(self.y_test, self.y_pred)
        
        # ROC-AUC
        metrics['roc_auc'] = roc_auc_score(self.y_test, self.y_pred_proba)
        
        # Precision, Recall, F1
        class_report = classification_report(self.y_test, self.y_pred, output_dict=True)
        metrics['precision'] = class_report['1']['precision']
        metrics['recall'] = class_report['1']['recall']
        metrics['precision_0'] = class_report['0']['precision']
        metrics['recall_0'] = class_report['0']['recall']
        
        # Confusion Matrix
        cm = confusion_matrix(self.y_test, self.y_pred)
        metrics['tn'] = cm[0, 0]
        metrics['fp'] = cm[0, 1]
        metrics['fn'] = cm[1, 0]
        metrics['tp'] = cm[1, 1]
        
        # Sensitivity and Specificity
        metrics['sensitivity'] = metrics['tp'] / (metrics['tp'] + metrics['fn']) if (metrics['tp'] + metrics['fn']) > 0 else 0
        metrics['specificity'] = metrics['tn'] / (metrics['tn'] + metrics['fp']) if (metrics['tn'] + metrics['fp']) > 0 else 0
        
        return metrics
    
    def plot_roc_curve(self, filename: str = '07_roc_curve.png') -> str:
        """Plot ROC curve."""
        fpr, tpr, _ = roc_curve(self.y_test, self.y_pred_proba)
        roc_auc = self.metrics['roc_auc']
        
        plt.figure(figsize=(10, 8))
        plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC Curve (AUC = {roc_auc:.4f})')
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--', label='Random Classifier')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate', fontsize=12)
        plt.ylabel('True Positive Rate', fontsize=12)
        plt.title('ROC Curve', fontsize=14, fontweight='bold')
        plt.legend(loc='lower right', fontsize=11)
        plt.grid(alpha=0.3)
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"Saved ROC curve to {filepath}")
        return filepath
    
    def plot_confusion_matrix(self, filename: str = '08_confusion_matrix.png') -> str:
        """Plot confusion matrix."""
        cm = confusion_matrix(self.y_test, self.y_pred)
        
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False,
                   xticklabels=['No Risk', 'High Risk'],
                   yticklabels=['No Risk', 'High Risk'])
        plt.title('Confusion Matrix', fontsize=14, fontweight='bold')
        plt.ylabel('True Label', fontsize=12)
        plt.xlabel('Predicted Label', fontsize=12)
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"Saved confusion matrix to {filepath}")
        return filepath
    
    def plot_precision_recall_curve(self, filename: str = '09_precision_recall.png') -> str:
        """Plot precision-recall curve."""
        precision, recall, thresholds = precision_recall_curve(self.y_test, self.y_pred_proba)
        
        plt.figure(figsize=(10, 8))
        plt.plot(recall, precision, color='purple', lw=2, label='Precision-Recall Curve')
        plt.scatter([self.metrics['recall']], [self.metrics['precision']], color='red', s=100, 
                   label=f'Operating Point (Threshold={self.best_threshold:.3f})', zorder=5)
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('Recall', fontsize=12)
        plt.ylabel('Precision', fontsize=12)
        plt.title('Precision-Recall Curve', fontsize=14, fontweight='bold')
        plt.legend(loc='best', fontsize=11)
        plt.grid(alpha=0.3)
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"Saved precision-recall curve to {filepath}")
        return filepath
    
    def plot_feature_importance(self, top_n: int = 10, filename: str = '10_feature_importance.png') -> str:
        """Plot feature importance from model."""
        try:
            # Try to get feature importance from the model
            if hasattr(self.model, 'named_steps'):
                estimator = self.model.named_steps['model']
            else:
                estimator = self.model
            
            if hasattr(estimator, 'feature_importances_'):
                importances = estimator.feature_importances_
            elif hasattr(estimator, 'coef_'):
                importances = np.abs(estimator.coef_[0])
            else:
                logger.warning("Model does not have feature importance")
                return ""
            
            feature_names = self.X_test.columns
            top_indices = np.argsort(importances)[-top_n:]
            top_features = feature_names[top_indices]
            top_importances = importances[top_indices]
            
            plt.figure(figsize=(10, 6))
            plt.barh(range(len(top_features)), top_importances, color='steelblue')
            plt.yticks(range(len(top_features)), top_features)
            plt.xlabel('Importance', fontsize=12)
            plt.title(f'Top {top_n} Feature Importance', fontsize=14, fontweight='bold')
            plt.tight_layout()
            
            filepath = f"{self.output_dir}/{filename}"
            plt.savefig(filepath, dpi=300, bbox_inches='tight')
            plt.close()
            
            logger.info(f"Saved feature importance to {filepath}")
            return filepath
        
        except Exception as e:
            logger.warning(f"Could not generate feature importance: {e}")
            return ""
    
    def generate_evaluation_report(self, filename: str = '11_evaluation_report.txt') -> str:
        """Generate comprehensive evaluation report."""
        report = []
        report.append("=" * 80)
        report.append("MODEL EVALUATION REPORT")
        report.append("=" * 80)
        report.append("")
        
        # Model Configuration
        report.append("MODEL CONFIGURATION")
        report.append("-" * 80)
        report.append(f"Classification Threshold: {self.best_threshold:.4f}")
        report.append("")
        
        # Performance Metrics
        report.append("PERFORMANCE METRICS")
        report.append("-" * 80)
        report.append(f"Accuracy:     {self.metrics['accuracy']:.4f}")
        report.append(f"Precision:    {self.metrics['precision']:.4f}")
        report.append(f"Recall:       {self.metrics['recall']:.4f}")
        report.append(f"F1 Score:     {self.metrics['f1']:.4f}")
        report.append(f"ROC-AUC:      {self.metrics['roc_auc']:.4f}")
        report.append(f"Sensitivity:  {self.metrics['sensitivity']:.4f}")
        report.append(f"Specificity:  {self.metrics['specificity']:.4f}")
        report.append("")
        
        # Confusion Matrix
        report.append("CONFUSION MATRIX")
        report.append("-" * 80)
        report.append(f"True Negatives:  {self.metrics['tn']}")
        report.append(f"False Positives: {self.metrics['fp']}")
        report.append(f"False Negatives: {self.metrics['fn']}")
        report.append(f"True Positives:  {self.metrics['tp']}")
        report.append("")
        
        # Test Set Statistics
        report.append("TEST SET STATISTICS")
        report.append("-" * 80)
        report.append(f"Total Test Samples: {len(self.y_test)}")
        report.append(f"Positive Cases:     {(self.y_test == 1).sum()}")
        report.append(f"Negative Cases:     {(self.y_test == 0).sum()}")
        report.append("")
        
        # Classification Report
        report.append("DETAILED CLASSIFICATION REPORT")
        report.append("-" * 80)
        report.append(classification_report(self.y_test, self.y_pred, 
                                           target_names=['No Risk', 'High Risk']))
        report.append("")
        
        report_text = "\n".join(report)
        filepath = f"{self.output_dir}/{filename}"
        
        with open(filepath, 'w') as f:
            f.write(report_text)
        
        logger.info(f"Saved evaluation report to {filepath}")
        return filepath
    
    def generate_risk_scores_csv(self, filename: str = 'risk_scores.csv') -> str:
        """Generate risk scores CSV for stakeholders."""
        risk_data = pd.DataFrame({
            'actual_risk': self.y_test.values,
            'predicted_risk_score': self.y_pred_proba,
            'predicted_risk_class': self.y_pred,
            'risk_category': [categorize_risk(score) for score in self.y_pred_proba],
            'risk_emoji': [get_risk_emoji(categorize_risk(score)) for score in self.y_pred_proba]
        })
        
        filepath = f"{self.output_dir}/{filename}"
        risk_data.to_csv(filepath, index=False)
        
        logger.info(f"Saved risk scores to {filepath}")
        return filepath
    
    def run_full_evaluation(self) -> Dict[str, str]:
        """Run complete evaluation pipeline."""
        logger.info("Starting model evaluation...")
        
        outputs = {
            'roc_curve': self.plot_roc_curve(),
            'confusion_matrix': self.plot_confusion_matrix(),
            'precision_recall': self.plot_precision_recall_curve(),
            'feature_importance': self.plot_feature_importance(),
            'evaluation_report': self.generate_evaluation_report(),
            'risk_scores': self.generate_risk_scores_csv()
        }
        
        logger.info("Model evaluation completed")
        return outputs


def evaluate_model(model: Pipeline, X_test: pd.DataFrame, y_test: pd.Series,
                  best_threshold: float = 0.5) -> Tuple[Dict[str, str], Dict[str, Any]]:
    """Convenience function to evaluate model."""
    evaluator = ModelEvaluator(model, X_test, y_test, best_threshold)
    outputs = evaluator.run_full_evaluation()
    metrics = evaluator.metrics
    return outputs, metrics

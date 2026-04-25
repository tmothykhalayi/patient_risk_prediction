"""
Main orchestrator script for the patient risk prediction pipeline.
"""

import logging
import sys
from src.data_loader import DataLoader
from src.data_cleaner import DataCleaner
from src.feature_engineer import FeatureEngineer
from src.eda import EDA
from src.model_trainer import ModelTrainer
from src.model_evaluator import ModelEvaluator
from src.utils import (
    RAW_DATA_DIR, PROCESSED_DATA_DIR, MODELS_DIR, REPORTS_DIR,
    TARGET_COLUMN, save_model, save_config
)
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(REPORTS_DIR, 'pipeline.log')),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


def main():
    """Execute the complete patient risk prediction pipeline."""
    
    try:
        logger.info("=" * 80)
        logger.info("PATIENT RISK PREDICTION PIPELINE STARTED")
        logger.info("=" * 80)
        
        # Step 1: Data Loading & Validation
        logger.info("\n[STEP 1/7] Loading and validating patient data...")
        data_path = os.path.join(RAW_DATA_DIR, 'patient_data.csv')
        
        # Check if data file exists
        if not os.path.exists(data_path):
            logger.error(f"Data file not found: {data_path}")
            logger.error("Please place your patient data CSV file in the data/raw/ directory")
            return
        
        loader = DataLoader(data_path)
        data = loader.load_data()
        is_valid = loader.validate_data()
        summary = loader.get_data_summary()
        
        logger.info(f"Data loaded: {data.shape[0]} records, {data.shape[1]} features")
        
        # Step 2: Exploratory Data Analysis
        logger.info("\n[STEP 2/7] Performing exploratory data analysis...")
        eda = EDA(data)
        eda_outputs = eda.run_all_analyses()
        logger.info(f"EDA completed. Generated {len(eda_outputs)} visualizations")
        
        # Step 3: Data Cleaning
        logger.info("\n[STEP 3/7] Cleaning and preprocessing data...")
        cleaner = DataCleaner(data)
        cleaned_data = cleaner.clean_all()
        cleaning_report = cleaner.get_cleaning_report()
        logger.info(f"Cleaned data shape: {cleaned_data.shape}")
        
        # Save cleaned data
        cleaned_data.to_csv(os.path.join(PROCESSED_DATA_DIR, 'cleaned_dataset.csv'), index=False)
        logger.info(f"Cleaned data saved to {PROCESSED_DATA_DIR}/cleaned_dataset.csv")
        
        # Step 4: Feature Engineering
        logger.info("\n[STEP 4/7] Engineering clinical features...")
        engineer = FeatureEngineer(cleaned_data)
        engineered_data = engineer.engineer_all()
        fe_report = engineer.get_feature_engineering_report()
        logger.info(f"Engineered features: {len(engineered_data.columns)} total features")
        logger.info(f"Created {fe_report['total_features_created']} new features")
        
        # Step 5: Model Training & Cross-Validation
        logger.info("\n[STEP 5/7] Training models with cross-validation...")
        
        # Prepare features and target
        X = engineered_data.drop(columns=[TARGET_COLUMN])
        y = engineered_data[TARGET_COLUMN]
        
        trainer = ModelTrainer(X, y)
        trainer.train_test_split()
        trainer.train_all_models()
        best_name, best_model = trainer.select_best_model()
        training_summary = trainer.get_training_summary()
        
        logger.info(f"Models trained: {training_summary['models_trained']}")
        logger.info(f"Best model: {best_name}")
        
        # Step 6: Threshold Tuning
        logger.info("\n[STEP 6/7] Tuning classification threshold for optimal recall...")
        best_threshold = trainer.tune_threshold(target_recall=0.85)
        logger.info(f"Optimal threshold: {best_threshold:.4f}")
        
        # Step 7: Evaluation & Reporting
        logger.info("\n[STEP 7/7] Evaluating model and generating reports...")
        evaluator = ModelEvaluator(best_model, trainer.X_test, trainer.y_test, best_threshold)
        eval_outputs = evaluator.run_full_evaluation()
        metrics = evaluator.metrics
        
        logger.info(f"Model Accuracy: {metrics['accuracy']:.4f}")
        logger.info(f"Model ROC-AUC: {metrics['roc_auc']:.4f}")
        logger.info(f"Model Recall: {metrics['recall']:.4f}")
        logger.info(f"Model Precision: {metrics['precision']:.4f}")
        
        # Save model and configuration
        logger.info("\nSaving model artifacts...")
        model_path = os.path.join(MODELS_DIR, 'best_model.joblib')
        save_model(best_model, model_path)
        
        config = {
            'best_model': best_name,
            'best_threshold': best_threshold,
            'model_path': model_path,
            'features': X.columns.tolist(),
            'metrics': {k: float(v) if isinstance(v, (int, float)) else v for k, v in metrics.items()},
            'training_summary': training_summary
        }
        
        config_path = os.path.join(MODELS_DIR, 'model_config.json')
        save_config(config, config_path)
        
        logger.info(f"Model saved to: {model_path}")
        logger.info(f"Configuration saved to: {config_path}")
        
        # Final summary
        logger.info("\n" + "=" * 80)
        logger.info("PIPELINE COMPLETED SUCCESSFULLY")
        logger.info("=" * 80)
        logger.info(f"Reports generated in: {REPORTS_DIR}")
        logger.info(f"Models saved in: {MODELS_DIR}")
        logger.info(f"Processed data saved in: {PROCESSED_DATA_DIR}")
        logger.info("\nKey Output Files:")
        logger.info(f"  - Risk Scores: {REPORTS_DIR}/risk_scores.csv")
        logger.info(f"  - Evaluation Report: {REPORTS_DIR}/11_evaluation_report.txt")
        logger.info(f"  - Feature Importance: {REPORTS_DIR}/10_feature_importance.png")
        logger.info("=" * 80)
        
    except FileNotFoundError as e:
        logger.error(f"File not found error: {e}")
        logger.error("Please ensure all required files are in the correct directories")
    except Exception as e:
        logger.error(f"Unexpected error occurred: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()

"""
Sample data generator for testing the pipeline without real patient data.
Run this to generate sample patient data in data/raw/patient_data.csv
"""

import pandas as pd
import numpy as np
import os
from src.utils import RAW_DATA_DIR, RANDOM_STATE

np.random.seed(RANDOM_STATE)


def generate_sample_data(n_samples: int = 1000, save: bool = True) -> pd.DataFrame:
    """Generate synthetic patient EHR data."""
    
    print(f"Generating {n_samples} sample patient records...")
    
    data = {
        'age': np.random.randint(18, 95, n_samples),
        'bmi': np.random.normal(27, 5, n_samples),
        'gender': np.random.choice(['Male', 'Female'], n_samples),
        
        # Vital signs
        'systolic_bp': np.random.normal(130, 20, n_samples),
        'diastolic_bp': np.random.normal(80, 15, n_samples),
        'heart_rate': np.random.normal(75, 12, n_samples),
        'temperature': np.random.normal(37.0, 0.5, n_samples),
        'respiratory_rate': np.random.normal(16, 2, n_samples),
        
        # Lab values
        'glucose': np.random.normal(110, 40, n_samples),
        'creatinine': np.random.normal(1.0, 0.5, n_samples),
        'hemoglobin': np.random.normal(13.5, 2, n_samples),
        'wbc_count': np.random.normal(7.0, 2, n_samples),
        'platelets': np.random.normal(250, 50, n_samples),
        
        # Comorbidities
        'diabetes': np.random.binomial(1, 0.3, n_samples),
        'hypertension': np.random.binomial(1, 0.4, n_samples),
        'heart_disease': np.random.binomial(1, 0.15, n_samples),
        'copd': np.random.binomial(1, 0.1, n_samples),
        'chronic_kidney_disease': np.random.binomial(1, 0.12, n_samples),
        
        # Medications
        'medication_count': np.random.randint(0, 15, n_samples),
        'antibiotic_use': np.random.binomial(1, 0.2, n_samples),
        'corticosteroid_use': np.random.binomial(1, 0.15, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Generate target variable (readmission risk)
    # Make it correlated with age, comorbidities, and lab values
    risk_score = (
        df['age'] / 100 * 0.1 +
        df['diabetes'] * 0.15 +
        df['hypertension'] * 0.1 +
        df['heart_disease'] * 0.2 +
        df['copd'] * 0.15 +
        df['chronic_kidney_disease'] * 0.12 +
        df['glucose'] / 200 * 0.1 +
        df['creatinine'] / 3 * 0.1 +
        np.random.normal(0, 0.1, n_samples)  # Add noise
    )
    
    df['readmission_risk'] = (risk_score > np.median(risk_score)).astype(int)
    
    # Clip unrealistic values
    df['bmi'] = df['bmi'].clip(10, 100)
    df['systolic_bp'] = df['systolic_bp'].clip(50, 250)
    df['diastolic_bp'] = df['diastolic_bp'].clip(30, 150)
    df['heart_rate'] = df['heart_rate'].clip(30, 200)
    df['temperature'] = df['temperature'].clip(35, 42)
    df['respiratory_rate'] = df['respiratory_rate'].clip(8, 60)
    df['glucose'] = df['glucose'].clip(0, 500)
    df['creatinine'] = df['creatinine'].clip(0, 10)
    df['hemoglobin'] = df['hemoglobin'].clip(0, 20)
    df['wbc_count'] = df['wbc_count'].clip(0, 30)
    df['platelets'] = df['platelets'].clip(0, 800)
    
    if save:
        filepath = os.path.join(RAW_DATA_DIR, 'patient_data.csv')
        os.makedirs(RAW_DATA_DIR, exist_ok=True)
        df.to_csv(filepath, index=False)
        print(f"Sample data saved to: {filepath}")
    
    print(f"Dataset shape: {df.shape}")
    print(f"Target distribution:\n{df['readmission_risk'].value_counts()}")
    
    return df


if __name__ == "__main__":
    # Generate sample data
    generate_sample_data(n_samples=1000)
    print("\nSample data generation complete!")
    print("You can now run: python main.py")

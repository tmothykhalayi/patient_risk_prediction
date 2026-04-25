"""
Simplified data generator using only standard library
"""
import csv
import random
import os
import math

random.seed(42)

def generate_csv_data(n_samples=1000, filename='data/raw/patient_data.csv'):
    """Generate synthetic patient data as CSV"""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Define headers
    headers = [
        'age', 'bmi', 'gender',
        'systolic_bp', 'diastolic_bp', 'heart_rate', 'temperature', 'respiratory_rate',
        'glucose', 'creatinine', 'hemoglobin', 'wbc_count', 'platelets',
        'diabetes', 'hypertension', 'heart_disease', 'copd', 'chronic_kidney_disease',
        'medication_count', 'antibiotic_use', 'corticosteroid_use', 'readmission_risk'
    ]
    
    print(f"Generating {n_samples} sample records...")
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        
        for i in range(n_samples):
            age = random.randint(18, 95)
            bmi = max(10, min(100, random.gauss(27, 5)))
            gender = random.choice(['Male', 'Female'])
            
            systolic_bp = max(50, min(250, random.gauss(130, 20)))
            diastolic_bp = max(30, min(150, random.gauss(80, 15)))
            heart_rate = max(30, min(200, random.gauss(75, 12)))
            temperature = max(35, min(42, random.gauss(37.0, 0.5)))
            respiratory_rate = max(8, min(60, random.gauss(16, 2)))
            
            glucose = max(0, random.gauss(110, 40))
            creatinine = max(0, random.gauss(1.0, 0.5))
            hemoglobin = max(0, random.gauss(13.5, 2))
            wbc_count = max(0, random.gauss(7.0, 2))
            platelets = max(0, random.gauss(250, 50))
            
            diabetes = random.randint(0, 1) if random.random() < 0.3 else 0
            hypertension = random.randint(0, 1) if random.random() < 0.4 else 0
            heart_disease = random.randint(0, 1) if random.random() < 0.15 else 0
            copd = random.randint(0, 1) if random.random() < 0.1 else 0
            chronic_kidney_disease = random.randint(0, 1) if random.random() < 0.12 else 0
            
            medication_count = random.randint(0, 15)
            antibiotic_use = random.randint(0, 1) if random.random() < 0.2 else 0
            corticosteroid_use = random.randint(0, 1) if random.random() < 0.15 else 0
            
            # Calculate risk
            risk_score = (
                age / 100 * 0.1 +
                diabetes * 0.15 +
                hypertension * 0.1 +
                heart_disease * 0.2 +
                copd * 0.15 +
                chronic_kidney_disease * 0.12 +
                glucose / 200 * 0.1 +
                creatinine / 3 * 0.1 +
                random.gauss(0, 0.1)
            )
            readmission_risk = 1 if risk_score > 0.23 else 0  # Approx median
            
            writer.writerow([
                f'{age:.0f}', f'{bmi:.1f}', gender,
                f'{systolic_bp:.1f}', f'{diastolic_bp:.1f}', f'{heart_rate:.1f}', 
                f'{temperature:.1f}', f'{respiratory_rate:.1f}',
                f'{glucose:.1f}', f'{creatinine:.2f}', f'{hemoglobin:.1f}', 
                f'{wbc_count:.1f}', f'{platelets:.1f}',
                diabetes, hypertension, heart_disease, copd, chronic_kidney_disease,
                medication_count, antibiotic_use, corticosteroid_use, readmission_risk
            ])
            
            if (i + 1) % 200 == 0:
                print(f"  Generated {i+1}/{n_samples} records...")
    
    print(f"✓ Data saved to: {filename}")
    print(f"✓ Dataset shape: {n_samples} x {len(headers)}")
    return filename

if __name__ == "__main__":
    try:
        filepath = generate_csv_data(n_samples=1000)
        print("\n✓ Sample data generation complete!")
    except Exception as e:
        print(f"✗ Error: {e}")

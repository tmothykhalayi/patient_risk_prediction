

Patient Risk Prediction System
A Machine Learning Early Warning System for Healthcare Providers

This project provides a complete machine learning pipeline to predict patient health risks and readmission likelihood using electronic health records (EHR) and clinical data. The model is designed to act as an Early Warning System (EWS), enabling healthcare providers and care coordinators to implement preventive interventions and improve patient outcomes.

The system was developed following a research-driven methodology, prioritizing recall (to minimize the number of at-risk patients who go undetected) and integrating domain-specific clinical feature engineering.

Project Architecture
The pipeline is entirely automated and executes the following stages sequentially when run:

Data Loading & Validation: Loads raw EHR data and checks for logical impossibilities (e.g., negative lab values, age/date inconsistencies, invalid diagnostic codes).
Exploratory Data Analysis (EDA): Automatically generates and saves 5 diagnostic visualization charts to the reports/ directory.
Data Cleaning: Imputes missing clinical values (median for numeric vitals, mode for categorical diagnoses) and automatically drops highly correlated features (multicollinearity check with threshold > 0.90) to prevent data leakage.
Feature Engineering: Creates derived clinical and demographic features (e.g., Age_BMI_Ratio, Comorbidity_Index, Lab_Risk_Score, Medication_Burden) and encodes categorical columns.
Model Training & Cross-Validation: Trains four models (Logistic Regression, Random Forest, Gradient Boosting, XGBoost) using Stratified 5-Fold Cross-Validation. Models are embedded in sklearn.Pipeline objects for clean scaling (e.g., only Logistic Regression uses StandardScaler). Class imbalance is handled natively via class_weight="balanced".
Threshold Tuning: The best model's classification threshold is dynamically tuned to optimize for Recall rather than raw accuracy.
Evaluation & Reporting: Generates a comprehensive text report, plots ROC curves/confusion matrices, calculates SHAP/coefficient Feature Importance, and produces a final Risk Score Dashboard CSV for healthcare providers.
Project Structure
patient_risk_prediction/
│
├── data/
│   ├── raw/                 # Contains source datasets (e.g., patient_ehr_data.csv)
│   └── processed/           # Contains generated cleaned_dataset.csv
│
├── docs/                    # Clinical research documents and medical references
│
├── models/                  # Saved serialized models (best_model.joblib, scaler.joblib)
│
├── reports/                 # Auto-generated outputs (Risk scores, EDA charts, Evaluation report)
│
├── src/                     # Source code modules
│   ├── __init__.py          
│   ├── utils.py             # Constants, config, and save/load utilities
│   ├── data_loader.py       # Loading and validation logic for EHR data
│   ├── data_cleaner.py      # Imputation, deduplication, multicollinearity checking
│   ├── feature_engineer.py  # Clinical feature derivation and encoding
│   ├── eda.py               # Generates distributions, correlation heatmaps, etc.
│   ├── model_trainer.py     # Training loops, CV, pipeline definition, threshold tuning
│   └── model_evaluator.py   # Grading, metrics, SHAP/importance extraction
│
├── main.py                  # The primary orchestrator script
├── requirements.txt         # Project dependencies
└── README.md                # This documentation file
Current Model Performance (Benchmark)
On the primary dataset (patient_ehr_data.csv), the pipeline achieved the following results on the test set:

Best Model: Logistic Regression
Baseline (Majority Class) Accuracy: 76.45%
Model ROC-AUC: 0.8201
Tuned Recall: 0.8514 (Optimal threshold: 0.371)
Tuned Precision: 0.3943
Note: The model traded Precision for a significant boost in Recall (85.1%), which aligns perfectly with the clinical directive to minimize false negatives (missed high-risk patients).

Setup Instructions
You can run this project using either Python venv or Conda. All commands should be executed from the root directory (student_dropout_prediction/).

Option A: Using Standard Python venv (Recommended for pure Python)
Create the virtual environment:

python3 -m venv venv
Activate the virtual environment:

On Linux/macOS:
source venv/bin/activate
On Windows:
venv\Scripts\activate
Install dependencies:

pip install -r requirements.txt
Option B: Using Anaconda / Miniconda (Recommended for Data Science)
Create the Conda environment:

conda create --name dropout_env python=3.12 -y
Activate the Conda environment:

conda activate dropout_env
Install dependencies:

pip install -r requirements.txt
(Alternatively, you can install the packages using conda install pandas numpy scikit-learn xgboost matplotlib seaborn joblib but pip is guaranteed to match the exact requirements.txt file).

How to Run the Pipeline
Once your environment is set up and activated, you can run the entire pipeline with a single command:

python main.py
What happens when you run it?
The script reads the raw data from data/raw/patient_ehr_data.csv.
It prints detailed log outputs to the terminal, tracking each stage (Validation → EDA → Cleaning → Feature Engineering → CV → Training → Evaluation).
It saves the transformed dataset to data/processed/cleaned_dataset.csv.
It exports the best model and scaler to the models/ directory.
It yields all visualization charts and the text evaluation report to reports/.
Interpreting the Outputs
After a successful run, navigate to the reports/ folder. The most important files for healthcare providers and care coordinators are:

risk_scores.csv: A ready-to-use clinical dashboard file. It lists every patient in the test set alongside their predicted Risk Score (between 0.0 and 1.0) and translates this into a categorical Risk Level (🟢 Low, 🟡 Medium, 🔴 High).
evaluation_report.txt: A detailed breakdown of how each model performed, including Stratified 5-Fold Cross-Validation metrics and the final tuned classification report.
09_feature_importance.png: A bar chart visualizing the Top 10 clinical factors that influence patient risk (e.g., Comorbidity Index, Lab Values, Medication Count). This provides explainability for why the model makes its predictions.
02 to 07 image files: Visual evidence of the pipeline's analysis (Correlation heatmaps, ROC curves, Confusion matrices).
Future Enhancements & Proposed Features
To further improve the utility and scale of this Early Warning System, the following features could be added in the future:

Interactive Web Dashboard: Build a user-friendly frontend (using Streamlit, React, or Vue) for teachers and school administrators to upload data, run predictions, and visualize risk factors without touching the command line.
Database Integration & Data Warehousing: Transition from static CSV files to a robust database (e.g., PostgreSQL, MySQL) to securely store historical records, prediction logs, and track student risk evolution over time.
Automated ML Pipelines (MLOps): Integrate orchestration tools like MLflow, Apache Airflow, or Prefect to automate model retraining and track experiments as new student data becomes available each semester.
Real-Time API Deployment: Containerize the best-performing model with Docker and deploy it as a REST FastAPI endpoint, allowing seamless integration with existing School Information Systems (SIS).
Advanced NLP for Qualitative Data: If schools collect teacher comments or counseling notes, integrate Natural Language Processing techniques to extract sentiment and thematic features, enriching the predictive dataset.
Individualized Actionable Interventions: Enhance the explainable AI (SHAP) implementation to automatically generate personalized intervention recommendations for each at-risk student based on their top contributing risk factors.
About
No description, website, or topics provided.
Resources
 Readme
 Activity
Stars
 2 stars
Watchers
 0 watching
Forks
 0 forks
Report repository
Releases
No releases published
Packages
No packages published
Contributors
1
@111morris
111morris Mulandi
Languages
Python
98.2%
 
Dockerfile
1.8%
Footer
© 2026 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
such a project but health related

That’s a solid system—you’re already thinking like someone building real-world AI. Translating it into a healthcare version is not just possible, it’s actually more impactful (and also more sensitive, so design matters more).

Here’s a clean adaptation of your project into a health-focused Early Warning System (EWS) 👇

🏥 Patient Health Risk Prediction System
A Machine Learning Early Warning System for Hospitals & Clinics
🎯 Objective
Predict the likelihood of a patient developing a serious health condition or deterioration (e.g., ICU admission, readmission, disease progression) using historical medical data—so clinicians can intervene early.

🧠 Problem You’re Solving
Hospitals often react after a patient’s condition worsens. This system flips that by predicting:

Risk of hospital readmission

Risk of disease progression (e.g., diabetes complications)

Risk of ICU admission

Risk of treatment non-adherence

🔁 Adapted Pipeline (Same Architecture, New Context)
1. Data Loading & Validation
Healthcare-specific checks:

Invalid vitals (e.g., negative heart rate ❌)

Impossible lab values (e.g., glucose = 0)

Missing diagnosis codes

2. Exploratory Data Analysis (EDA)
Visualizations could include:

Age vs disease risk

Distribution of blood pressure / glucose

Readmission rates by condition

3. Data Cleaning
Impute missing lab results (median)

Handle categorical features (diagnosis, gender, medication)

Remove highly correlated clinical variables

4. Feature Engineering (🔥 This is where it shines)
Examples:

BMI_Risk_Index

Medication_Adherence_Rate

Visit_Frequency

Comorbidity_Count

Lab_Trend_Slope (e.g., glucose increasing over time)

Age_Risk_Group

Chronic_Flag

5. Model Training
Same models work perfectly:

Logistic Regression (baseline, interpretable)

Random Forest (handles nonlinear patterns)

Gradient Boosting / XGBoost (high performance)

Handle imbalance:

class_weight="balanced"
6. Threshold Tuning (Critical ⚠️)
In healthcare, Recall is even more important than in education.

Missing a high-risk patient = dangerous.

So you tune for:

High Recall (catch most at-risk patients)

Accept lower Precision (some false alarms are okay)

7. Evaluation & Reporting
Outputs:

ROC Curve

Confusion Matrix

SHAP Feature Importance

8. Final Output (Dashboard)
Instead of students → patients:

Patient ID	Risk Score	Risk Level
P001	0.87	🔴 High
P002	0.52	🟡 Medium
P003	0.12	🟢 Low
📁 Suggested Project Structure
patient_risk_prediction/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── models/
├── reports/
│
├── src/
│   ├── data_loader.py
│   ├── data_cleaner.py
│   ├── feature_engineer.py
│   ├── eda.py
│   ├── model_trainer.py
│   ├── model_evaluator.py
│
├── main.py
└── requirements.txt
📊 Example Use Cases
1. 🩺 Hospital Readmission Prediction
Predict if patient returns within 30 days

2. 💉 Chronic Disease Monitoring
Predict complications in diabetes or hypertension

3. 🚑 ICU Risk Prediction
Identify patients likely to deteriorate

4. 💊 Medication Adherence Risk
Predict patients likely to skip treatment

⚠️ Important Reality Check (Don’t Skip This)
Healthcare ML ≠ school ML.

You must consider:

1. Data Privacy
Follow regulations (HIPAA-like principles even locally)

Anonymize patient data

2. Ethical Risk
False negatives = life-threatening

Model must assist, not replace doctors

3. Data Quality Problem
Medical data is messy, incomplete, biased

🚀 Next-Level Enhancements
Integration with your hospital system (NestJS 👀)
→ You already have patients, records, prescriptions

Real-time API

FastAPI + Docker

Dashboard

Streamlit or React Admin Panel

Time-Series Models

LSTM / Temporal models for patient history

Explainability

SHAP → “Why is this patient high risk?”

🔥 Strong Project Titles (Use for CV / Research)
“AI-Based Patient Deterioration Early Warning System”

“Machine Learning for Hospital Readmission Risk Prediction”

“Predictive Analytics for Chronic Disease Management”

💡 If You Want to Go Hard (Recommended)
Since you're already building a hospital system in NestJS, the smartest move is:

👉 Embed this as a module inside your system:

Doctor dashboard → shows patient risk

Admin dashboard → hospital-wide analytics

Alerts → “High-risk patient detected”

If you want, I can:

Map this directly into your NestJS backend architecture

Help you design the database schema

Or generate a real dataset + training code

Just tell me 👍


how to start this  project 

Good question—because this kind of project can easily become overwhelming if you don’t structure it properly. The trick is to start small, but start correctly so you can scale later (especially since you want to integrate it into your NestJS hospital system).

Let’s break it into a clear, practical roadmap you can follow step-by-step 👇

🚀 Step 1: Define ONE specific problem (Don’t generalize)
Avoid this ❌

“Predict patient health risk”

Start with something concrete ✅
Pick ONE:

Hospital readmission (within 30 days) ⭐ (Best starter)

Diabetes complication risk

ICU admission prediction

Missed appointment prediction

👉 I recommend:
“Hospital Readmission Prediction System”

📊 Step 2: Get a dataset
You can’t start without data.

Good free datasets:
UCI Machine Learning Repository → (Diabetes, heart disease)

Kaggle → search:

“hospital readmission dataset”

“diabetes dataset”

👉 Example dataset:

“Diabetes 130-US hospitals dataset” (very popular)

🏗️ Step 3: Set up your project (same structure you used)
mkdir patient_risk_prediction
cd patient_risk_prediction
python3 -m venv venv
source venv/bin/activate  # or Windows equivalent
pip install pandas numpy scikit-learn xgboost matplotlib seaborn joblib shap
Create structure:

src/
data/
models/
reports/
main.py
🧪 Step 4: Start SIMPLE (Don’t build full pipeline yet)
Before your big architecture, do this first:

Create a basic notebook or script:
# starter.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

df = pd.read_csv("data/raw/dataset.csv")

X = df.drop("target", axis=1)
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y)

model = LogisticRegression()
model.fit(X_train, y_train)

preds = model.predict(X_test)
print(classification_report(y_test, preds))
👉 This proves:

Data works

Model works

Problem is solvable

🧹 Step 5: Add Data Cleaning
Now upgrade:

Handle missing values

Encode categorical variables

Normalize if needed

Example:

df.fillna(df.median(numeric_only=True), inplace=True)
df = pd.get_dummies(df)
🧠 Step 6: Feature Engineering (Your advantage 💪)
Add healthcare logic:

Age groups

BMI categories

Number of hospital visits

Chronic condition flags

This is where your project becomes unique

🤖 Step 7: Train Multiple Models
Add:

Logistic Regression

Random Forest

XGBoost

Compare:

from sklearn.metrics import roc_auc_score
🎯 Step 8: Optimize for Recall (Very Important)
Healthcare rule:

Missing a sick patient is worse than a false alarm.

Adjust threshold:

probs = model.predict_proba(X_test)[:,1]
preds = (probs > 0.3).astype(int)
📈 Step 9: Add Evaluation + Explainability
Install SHAP:

pip install shap
Then:

import shap
explainer = shap.Explainer(model, X_train)
shap_values = explainer(X_test)
📊 Step 10: Generate Risk Scores
Create output like:

output = X_test.copy()
output["risk_score"] = probs
output["risk_level"] = output["risk_score"].apply(
    lambda x: "High" if x > 0.7 else "Medium" if x > 0.4 else "Low"
)

output.to_csv("reports/risk_scores.csv")
🔗 Step 11: Connect to Your NestJS System (🔥 Your big advantage)
You already have:

patients

records

prescriptions

So:

Build API with:
FastAPI

Example:

@app.post("/predict")
def predict(data: PatientData):
    risk = model.predict_proba([data])[0][1]
    return {"risk_score": risk}
Then call it from NestJS.

🖥️ Step 12: (Optional but powerful)
Build dashboard using:

Streamlit

🧠 Real Advice (Important)
Don’t try to build your full pipeline immediately.

Do this instead:
✅ Train ONE working model

✅ Get decent results

✅ Add features gradually

✅ THEN modularize into your architecture

🔥 Your First 3-Day Plan
Day 1:
Pick dataset

Load data

Train simple model

Day 2:
Clean data

Add features

Improve model

Day 3:
Generate risk scores

Save model

Start API

If you want next step 👇
I can:

Give you a real dataset link + schema

Generate your full starter code (main.py + modules)

Map this directly into your NestJS backend

Just tell me:
👉 “Give me starter code” or “Connect to NestJS”




Patient Risk Prediction System
A Machine Learning Early Warning System for Healthcare Providers

This project provides a complete machine learning pipeline to predict patient health risks and readmission likelihood using electronic health records (EHR) and clinical data. The model is designed to act as an Early Warning System (EWS), enabling healthcare providers and care coordinators to implement preventive interventions and improve patient outcomes.

The system was developed following a research-driven methodology, prioritizing recall (to minimize the number of at-risk patients who go undetected) and integrating domain-specific clinical feature engineering.

## Project Architecture
The pipeline is entirely automated and executes the following stages sequentially when run:

1. **Data Loading & Validation**: Loads raw EHR data and checks for logical impossibilities (e.g., negative lab values, age/date inconsistencies, invalid diagnostic codes).
2. **Exploratory Data Analysis (EDA)**: Automatically generates and saves 5 diagnostic visualization charts to the reports/ directory.
3. **Data Cleaning**: Imputes missing clinical values (median for numeric vitals, mode for categorical diagnoses) and automatically drops highly correlated features (multicollinearity check with threshold > 0.90) to prevent data leakage.
4. **Feature Engineering**: Creates derived clinical and demographic features (e.g., Age_BMI_Ratio, Comorbidity_Index, Lab_Risk_Score, Medication_Burden) and encodes categorical columns.
5. **Model Training & Cross-Validation**: Trains four models (Logistic Regression, Random Forest, Gradient Boosting, XGBoost) using Stratified 5-Fold Cross-Validation. Models are embedded in sklearn.Pipeline objects for clean scaling (e.g., only Logistic Regression uses StandardScaler). Class imbalance is handled natively via class_weight="balanced".
6. **Threshold Tuning**: The best model's classification threshold is dynamically tuned to optimize for Recall rather than raw accuracy.
7. **Evaluation & Reporting**: Generates a comprehensive text report, plots ROC curves/confusion matrices, calculates SHAP/coefficient Feature Importance, and produces a final Risk Score Dashboard CSV for healthcare providers.

## Project Structure
```
patient_risk_prediction/
│
├── data/
│   ├── raw/                 # Contains source datasets (e.g., patient_ehr_data.csv)
│   └── processed/           # Contains generated cleaned_dataset.csv
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
├── api/                     # REST API for model serving
│   ├── main.py              # FastAPI application endpoints
│   └── schemas.py           # Request/response Pydantic schemas
│
├── notebooks/               # Jupyter notebooks for experimentation and analysis
│
├── main.py                  # The primary orchestrator script
├── requirements.txt         # Project dependencies
├── Dockerfile               # Docker container configuration
├── docker-compose.yml       # Docker Compose orchestration
├── .gitignore              # Git ignore patterns
└── README.md                # This documentation file
```

## Current Model Performance (Benchmark)
On the primary dataset (patient_ehr_data.csv), the pipeline achieved the following results on the test set:

- **Best Model**: Logistic Regression
- **Baseline (Majority Class) Accuracy**: 76.45%
- **Model ROC-AUC**: 0.8201
- **Tuned Recall**: 0.8514 (Optimal threshold: 0.371)
- **Tuned Precision**: 0.3943

**Note**: The model traded Precision for a significant boost in Recall (85.1%), which aligns perfectly with the clinical directive to minimize false negatives (missed high-risk patients).

## Setup Instructions
You can run this project using either Python venv or Conda. All commands should be executed from the root directory (patient_risk_prediction/).

### Option A: Using Standard Python venv (Recommended for pure Python)

1. **Create the virtual environment**:
```bash
python3 -m venv venv
```

2. **Activate the virtual environment**:
   - On Linux/macOS:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

### Option B: Using Anaconda / Miniconda (Recommended for Data Science)

1. **Create the Conda environment**:
```bash
conda create --name patient_risk_env python=3.12 -y
```

2. **Activate the Conda environment**:
```bash
conda activate patient_risk_env
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```
(Alternatively, you can install the packages using conda install but pip is guaranteed to match the exact requirements.txt file).

### Option C: Using Docker

1. **Build the Docker image**:
```bash
docker-compose build
```

2. **Run the container**:
```bash
docker-compose up
```

## How to Run the Pipeline
Once your environment is set up and activated, you can run the entire pipeline with a single command:

```bash
python main.py
```

### What happens when you run it?
- The script reads the raw data from `data/raw/patient_ehr_data.csv`
- It prints detailed log outputs to the terminal, tracking each stage (Validation → EDA → Cleaning → Feature Engineering → CV → Training → Evaluation)
- It saves the transformed dataset to `data/processed/cleaned_dataset.csv`
- It exports the best model and scaler to the `models/` directory
- It yields all visualization charts and the text evaluation report to `reports/`

## Running the API Server
To start the REST API for model serving:

```bash
cd api
python main.py
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## Interpreting the Outputs
After a successful run, navigate to the `reports/` folder. The most important files for healthcare providers and care coordinators are:

- **risk_scores.csv**: A ready-to-use clinical dashboard file. It lists every patient in the test set alongside their predicted Risk Score (between 0.0 and 1.0) and translates this into a categorical Risk Level (🟢 Low, 🟡 Medium, 🔴 High).
- **evaluation_report.txt**: A detailed breakdown of how each model performed, including Stratified 5-Fold Cross-Validation metrics and the final tuned classification report.
- **09_feature_importance.png**: A bar chart visualizing the Top 10 clinical factors that influence patient risk (e.g., Comorbidity Index, Lab Values, Medication Count). This provides explainability for why the model makes its predictions.
- **02 to 07 image files**: Visual evidence of the pipeline's analysis (Correlation heatmaps, ROC curves, Confusion matrices).

## Contributing
Contributions are welcome! Please submit pull requests or open issues for bugs and feature requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

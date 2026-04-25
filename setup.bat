@echo off
REM Setup script for Patient Risk Prediction project (Windows)
REM Usage: setup.bat

echo =========================================
echo Patient Risk Prediction - Setup Script
echo =========================================
echo.

REM Check Python version
echo Checking Python version...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.12+
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set python_version=%%i
echo [OK] Python %python_version% found
echo.

REM Create virtual environment
echo Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo [OK] Virtual environment created
) else (
    echo [OK] Virtual environment already exists
)
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip --quiet
echo [OK] pip upgraded
echo.

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Retrying with timeout settings...
    pip install -r requirements.txt --default-timeout=1000 --retries 5
)
echo [OK] Dependencies installed
echo.

REM Verify installation
echo Verifying installation...
python -c "import pandas, numpy, sklearn, xgboost, fastapi; print('[OK] All core packages imported successfully')"
if errorlevel 1 (
    echo WARNING: Some packages may not have installed correctly
)
echo.

REM Create necessary directories
echo Creating project directories...
if not exist "data\raw" mkdir data\raw
if not exist "data\processed" mkdir data\processed
if not exist "models" mkdir models
if not exist "reports" mkdir reports
if not exist "notebooks" mkdir notebooks
echo [OK] Directories created
echo.

REM Check for sample data
if not exist "data\raw\patient_data.csv" (
    echo Generating sample data...
    python simple_data_gen.py
    echo [OK] Sample data generated
) else (
    echo [OK] Sample data already exists
)
echo.

echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo Next steps:
echo 1. Run the pipeline:     python main.py
echo 2. Start the API:        python -m uvicorn api.main:app --reload
echo 3. Run with Docker:      docker-compose up
echo.
echo For more info, see:
echo   - README.md          - Project overview
echo   - QUICKSTART.md      - Quick start guide
echo   - DEPLOYMENT.md      - Deployment instructions
echo   - API_EXAMPLES.md    - API usage examples
echo.
pause

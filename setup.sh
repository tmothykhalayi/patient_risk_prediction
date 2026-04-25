#!/bin/bash
# Setup script for Patient Risk Prediction project
# Usage: bash setup.sh

echo "========================================="
echo "Patient Risk Prediction - Setup Script"
echo "========================================="
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python --version 2>&1 | grep -oE '[0-9]+\.[0-9]+')
echo "✓ Python $python_version found"
echo ""

# Create virtual environment
echo "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip --quiet
echo "✓ pip upgraded"
echo ""

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt --quiet
echo "✓ Dependencies installed"
echo ""

# Verify installation
echo "Verifying installation..."
python -c "
import pandas, numpy, sklearn, xgboost, fastapi
print('✓ All core packages imported successfully')
"
echo ""

# Create necessary directories
echo "Creating project directories..."
mkdir -p data/raw
mkdir -p data/processed
mkdir -p models
mkdir -p reports
mkdir -p notebooks
echo "✓ Directories created"
echo ""

# Check for sample data
if [ ! -f "data/raw/patient_data.csv" ]; then
    echo "Generating sample data..."
    python simple_data_gen.py
    echo "✓ Sample data generated"
else
    echo "✓ Sample data already exists"
fi
echo ""

echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Run the pipeline:     python main.py"
echo "2. Start the API:        python -m uvicorn api.main:app --reload"
echo "3. Run with Docker:      docker-compose up"
echo ""
echo "For more info, see:"
echo "  - README.md          - Project overview"
echo "  - QUICKSTART.md      - Quick start guide"
echo "  - DEPLOYMENT.md      - Deployment instructions"
echo "  - API_EXAMPLES.md    - API usage examples"
echo ""

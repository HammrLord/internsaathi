#!/bin/bash
# Setup script for KG-based Job Allocation System

echo "=================================="
echo "KG-based Job Allocation Setup"
echo "=================================="

# Check Python version
python_version=$(python --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Create virtual environment (optional but recommended)
read -p "Create a new virtual environment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Creating virtual environment..."
    python -m venv kg_env
    echo "Activating virtual environment..."
    source kg_env/bin/activate
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install --upgrade pip

# Install numpy first (specific version for compatibility)
echo "Installing NumPy 1.x..."
pip install "numpy<2.0.0"

# Install pandas
echo "Installing pandas..."
pip install pandas

# Install torch (CPU version for portability)
echo "Installing PyTorch..."
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install torch-geometric dependencies
echo "Installing PyTorch Geometric..."
pip install torch-geometric

# Install other dependencies
echo "Installing other dependencies..."
pip install networkx deap matplotlib plotly pyvis scikit-learn tqdm pyyaml

# Optional: Install spaCy for advanced NLP
read -p "Install spaCy for advanced NLP features? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    pip install spacy nltk
    python -m spacy download en_core_web_sm
fi

echo ""
echo "=================================="
echo "Setup complete!"
echo "=================================="
echo ""
echo "Run the pipeline with:"
echo "  python pipeline.py --mode test"
echo ""
echo "Or for full run:"
echo "  python pipeline.py --mode full --sample-size 5000"

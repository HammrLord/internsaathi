#!/bin/bash
# One-command fix for the impatient :)

echo "🚀 Quick Fix - Creating virtual environment..."
echo ""

# Create venv
python -m venv kg_env

# Activate
source kg_env/bin/activate

echo "✅ Virtual environment activated"
echo ""
echo "📦 Installing dependencies (this may take 2-3 minutes)..."
echo ""

# Install core dependencies
pip install -q --upgrade pip
pip install -q "numpy<2.0"
pip install -q pandas networkx
pip install -q streamlit plotly matplotlib pyvis
pip install -q scikit-learn tqdm pyyaml

echo "✅ Dependencies installed!"
echo ""
echo "🧪 Testing..."

if python -c "import pandas, networkx, numpy, streamlit" 2>/dev/null; then
    echo "✅ All imports working!"
    echo ""
    echo "🎉 SUCCESS! Starting dashboard..."
    echo ""
    streamlit run app.py
else
    echo "❌ Something went wrong. Check FIX_ERRORS.md for alternatives"
fi

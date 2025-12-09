#!/bin/bash
# Fix NumPy dependency issues for KG Allocation System

echo "🔧 Fixing NumPy Dependency Issues..."
echo ""

# Check current NumPy version
numpy_version=$(python -c "import numpy; print(numpy.__version__)" 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "Current NumPy version: $numpy_version"
    
    # Check if NumPy 2.x
    if [[ $numpy_version == 2.* ]]; then
        echo "⚠️  NumPy 2.x detected - this is incompatible with your pandas installation"
        echo ""
        echo "Options:"
        echo "  1) Downgrade NumPy (quick fix, may affect other packages)"
        echo "  2) Create virtual environment (recommended, isolated)"
        echo ""
        read -p "Choose option (1 or 2): " choice
        
        if [ "$choice" = "1" ]; then
            echo ""
            echo "Downgrading NumPy to 1.x..."
            pip uninstall -y numpy
            pip install "numpy<2.0"
            pip install --force-reinstall pandas pyarrow
            echo "✅ NumPy downgraded"
        elif [ "$choice" = "2" ]; then
            echo ""
            echo "Creating virtual environment..."
            python -m venv kg_env
            echo "✅ Virtual environment created"
            echo ""
            echo "To activate:"
            echo "  source kg_env/bin/activate"
            echo ""
            echo "Then run this script again to install dependencies"
            exit 0
        fi
    else
        echo "✅ NumPy version is compatible"
    fi
else
    echo "❌ NumPy not found or import error"
    echo "Installing NumPy 1.x..."
    pip install "numpy<2.0"
fi

echo ""
echo "Installing/verifying other dependencies..."
pip install -q pandas networkx

# Check if in virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo ""
    echo "⚠️  WARNING: Not in a virtual environment!"
    echo "   It's recommended to use a virtual environment to avoid conflicts."
    echo ""
fi

# Test imports
echo ""
echo "Testing imports..."

python -c "import pandas; print('✅ pandas')" 2>/dev/null || echo "❌ pandas failed"
python -c "import networkx; print('✅ networkx')" 2>/dev/null || echo "❌ networkx failed"
python -c "import numpy; print('✅ numpy')" 2>/dev/null || echo "❌ numpy failed"

echo ""
echo "Testing app imports..."
if python -c "from config import PipelineConfig; from feature_extractor import FeatureExtractor" 2>/dev/null; then
    echo "✅ Core modules working!"
    echo ""
    echo "🎉 Fix complete! You can now run:"
    echo "   ./start_dashboard.sh"
    echo "   OR"
    echo "   streamlit run app.py"
else
    echo "❌ Still have import errors"
    echo ""
    echo "Detailed error:"
    python -c "from config import PipelineConfig" 2>&1 | head -20
    echo ""
    echo "Solutions:"
    echo "1. Create fresh virtual environment:"
    echo "   python -m venv kg_env"
    echo "   source kg_env/bin/activate"
    echo "   pip install 'numpy<2.0' pandas networkx streamlit"
    echo ""
    echo "2. Or use conda:"
    echo "   conda create -n kg_allocation python=3.10"
    echo "   conda activate kg_allocation"
    echo "   pip install -r requirements.txt"
fi

# 🔧 Quick Fix Guide - NumPy Dependency Issue

## Problem

Your system has NumPy 2.3.4, but pandas/pyarrow were compiled with NumPy 1.x, causing import errors.

## ✅ SOLUTION 1: Automated Fix (Recommended)

```bash
./fix_dependencies.sh
```

This script will:
1. Detect your NumPy version
2. Offer to downgrade NumPy OR create virtual environment
3. Test all imports
4. Confirm everything works

## ✅ SOLUTION 2: Manual Virtual Environment (Cleanest)

```bash
# Create virtual environment
python -m venv kg_env

# Activate it
source kg_env/bin/activate  # Mac/Linux
# kg_env\Scripts\activate  # Windows

# Install compatible dependencies
pip install "numpy<2.0"
pip install pandas networkx streamlit plotly matplotlib pyvis scikit-learn

# Run dashboard
streamlit run app.py
```

## ✅ SOLUTION 3: Quick Downgrade (If no other projects need NumPy 2.x)

```bash
pip uninstall numpy
pip install "numpy<2.0"  
pip install --force-reinstall pandas pyarrow

# Test
python -c "import pandas; print('✅ Works!')"

# Run dashboard
streamlit run app.py
```

## ✅ SOLUTION 4: Conda Environment

```bash
conda create -n kg_allocation python=3.10 -y
conda activate kg_allocation
pip install -r requirements.txt

# Run dashboard
streamlit run app.py
```

## 🧪 Verify Fix

After applying any solution, test:

```bash
python -c "import pandas, networkx, numpy; print('✅ All imports work!')"
```

Then start dashboard:

```bash
streamlit run app.py
# Opens at http://localhost:8501
```

## 📋 Why This Happens

- Your Anaconda has NumPy 2.3.4 (new version)
- pandas/pyarrow installed earlier were compiled against NumPy 1.x
- NumPy 2.x has breaking changes in the C API
- Virtual environment avoids this by using clean, compatible versions

## 🚀 After Fix

Once fixed, the dashboard should start without errors. You'll see:

```
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.x.x:8501
```

## ❓ Still Having Issues?

1. Check Python version: `python --version` (need 3.8+)
2. Check if in venv: `echo $VIRTUAL_ENV` (should show path if active)
3. List installed packages: `pip list | grep -E "numpy|pandas|streamlit"`
4. Clear Python cache: `find . -type d -name __pycache__ -exec rm -rf {} +`

## 💡 Best Practice

**Always use virtual environments for Python projects!**

```bash
# For this project
python -m venv kg_env
source kg_env/bin/activate
pip install -r requirements.txt

# When done
deactivate
```

This keeps dependencies isolated and prevents version conflicts.

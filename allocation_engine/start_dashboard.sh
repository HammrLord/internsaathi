#!/bin/bash
# Launch Admin Dashboard

echo "🚀 Launching KG Allocation Admin Dashboard..."
echo ""

# Check if streamlit is installed
if ! python -c "import streamlit" 2>/dev/null; then
    echo "❌ Streamlit not found!"
    echo "Installing dashboard dependencies..."
    pip install streamlit streamlit-agraph
fi

# Launch streamlit app
echo "✅ Starting dashboard on http://localhost:8501"
echo ""
streamlit run app.py

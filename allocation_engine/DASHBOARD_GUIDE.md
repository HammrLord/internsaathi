# Admin Dashboard User Guide

## 🎯 Overview

The KG Allocation Admin Dashboard provides a comprehensive web interface for managing the job allocation system. It allows you to build Knowledge Graphs, run multi-objective optimizations, explore results, and generate reports.

## 🚀 Starting the Dashboard

```bash
# Method 1: Using the startup script
./start_dashboard.sh

# Method 2: Direct command
streamlit run app.py
```

The dashboard will open in your browser at `http://localhost:8501`

## 📋 Dashboard Pages

### 1. 📊 Dashboard (Overview)
**Purpose**: Quick overview and quick actions

**Features**:
- System status metrics (candidates, nodes, solutions)
- Quick action buttons:
  - Build Knowledge Graph (500 samples for testing)
  - Run Quick Allocation (10 jobs, 20 generations)
  - View Results
- Recent activity log
- Category distribution chart
- Rural vs Urban pie chart

**Use Case**: Get a quick snapshot of the system and run fast test allocations

---

### 2. ▶️ Run Allocation
**Purpose**: Configure and execute allocation runs

**Features**:
- **Data Settings**:
  - Sample Size (100-10,000 candidates)
  - Number of Jobs (5-100)
  - Candidates per Job (1-20)
  
- **Algorithm Settings**:
  - Population Size (20-200)
  - Number of Generations (10-200)
  - Historical allocations toggle

- **Real-time Progress**: Progress bar with status updates

- **Results Display**: Detailed fitness scores and statistics

**Workflow**:
1. Configure data and algorithm parameters
2. Click "RUN ALLOCATION"
3. Wait for completion (~1-3 minutes depending on settings)
4. View results summary with fitness scores
5. Navigate to Results Explorer for detailed analysis

---

### 3. 📈 Results Explorer
**Purpose**: Analyze and compare optimization solutions

**Features**:
- **3D Pareto Front Visualization**:
  - Interactive 3D scatter plot
  - X-axis: Diversity score
  - Y-axis: Fairness score
  - Z-axis: Participation score
  - Color: Location preference score
  - Hover for detailed scores

- **Solution Selector**: Choose from all Pareto-optimal solutions

- **Fitness Metrics**: Display scores for all 4 objectives

- **Allocation Table**:
  - Job assignments
  - Candidate details (ID, skills, experience, rural status, education)
  - Sortable and filterable

- **Export**: Download allocations as CSV

**Use Case**: Compare different solutions and select the best fit for your needs

---

### 4. 🕸️ Knowledge Graph
**Purpose**: Explore the Knowledge Graph structure

**Features**:
- **Graph Statistics**:
  - Total nodes, candidates, jobs, edges
  
- **Interactive Visualization**:
  - Sample graph (50 nodes for performance)
  - Blue nodes: Urban candidates
  - Green nodes: Rural candidates
  - Orange diamonds: Job positions
  - Hover for node details

- **Node Inspector**:
  - Filter by type (All/Candidates/Jobs)
  - Select individual nodes
  - View full node attributes in JSON format

**Use Case**: Understand graph structure and verify data quality

---

### 5. ⚙️ Configuration
**Purpose**: Adjust system settings

**3 Tabs**:

**Tab 1: Data Config**
- Sample size
- Max skills per candidate
- Jobs to allocate
- Candidates per job

**Tab 2: GA Config**
- Population size
- Number of generations
- Crossover probability
- Mutation probability

**Tab 3: Objectives**
- Rural participation target (0-100%)
- New candidate ratio target (0-100%)

**Note**: Changes persist during session (not saved to disk)

---

### 6. 📋 Reports & Analytics
**Purpose**: Generate and download reports

**Features**:
- **Objective Scores Distribution**: Box plots across all solutions
- **Allocation Summary Table**:
  - Allocated count per job
  - Rural participation percentage
  - Average experience years
  
- **Downloads**:
  - Full report (JSON format)
  - Objective scores (CSV format)

**Use Case**: Generate reports for stakeholders and documentation

---

## 🎬 Typical Workflow

### First-Time Setup
1. Start dashboard: `./start_dashboard.sh`
2. Go to "📊 Dashboard"
3. Click "Build Knowledge Graph"
4. Click "Quick Allocation"
5. Explore results in "Results Explorer"

### Production Run
1. Go to "▶️ Run Allocation"
2. Configure:
   - Sample Size: 5000+
   - Jobs: 50+
   - Generations: 100+
3. Click "RUN ALLOCATION"
4. Wait for completion
5. Go to "Results Explorer"
6. Select best solution from Pareto front
7. Download allocations CSV
8. Generate report in "Reports" page

### Analysis Workflow
1. "🕸️ Knowledge Graph" → Verify data quality
2. "▶️ Run Allocation" → Execute optimization  
3. "📈 Results Explorer" → Compare solutions
4. "📋 Reports" → Generate documentation

---

## 💡 Tips & Best Practices

### Performance
- **Quick Tests**: Use sample size 500-1000, 20-30 generations
- **Production**: Use sample size 5000+, 100+ generations
- **Large Datasets**: Increase gradually to avoid browser freezing

### Interpreting Results
- **High Diversity**: More skill variety, may sacrifice other objectives
- **High Fairness**: Better rural participation, balanced representation
- **High Participation**: Good new/returning balance
- **Pareto Front**: All solutions are optimal trade-offs

### Selecting Solutions
- No single "best" solution in multi-objective optimization
- Choose based on priorities:
  - Diversity-focused: Pick highest diversity score
  - Fairness-focused: Pick highest fairness score
  - Balanced: Pick middle solution from Pareto front

---

## 🐛 Troubleshooting

### Dashboard won't start
```bash
# Install dependencies
pip install streamlit streamlit-agraph

# Try direct command
streamlit run app.py
```

### "No KG loaded" warning
- Go to Dashboard and click "Build Knowledge Graph"
- Or run allocation which builds KG automatically

### Visualization not showing
- Reduce sample size in configuration
- Check browser console for errors
- Try refreshing the page

### Slow performance
- Reduce sample size
- Lower population size or generations
- Use Chrome/Firefox (better than Safari for Streamlit)

---

## 🔧 Advanced Features

### Session State
- KG and results persist during browser session
- Refresh page to reset
- No automatic save (intentional for testing)

### Customization
- Edit `app.py` to add custom pages
- Modify objectives in `genetic_optimizer.py`
- Add new metrics in `visualize_kg.py`

---

## 📞 Support

For issues or questions:
1. Check `README.md` for system documentation
2. Review `walkthrough.md` for architecture details
3. Inspect browser console for errors
4. Check terminal output for backend errors

---

## 🎨 UI Colors

- **Blue** (#1f77b4): Candidates (urban)
- **Green** (#28a745): Candidates (rural)
- **Orange** (#ff7f0e): Job positions
- **Purple Gradient**: Metric cards
- **Viridis**: Pareto front color scale

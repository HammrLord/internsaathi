# Quick Start Guide

## Installation

### Option 1: Virtual Environment (Recommended - avoids NumPy conflicts)

```bash
# Navigate to project directory
cd /Users/kartiksharma/Desktop/sih/KG/dataset

# Create virtual environment
python -m venv kg_env

# Activate it
source kg_env/bin/activate  # Mac/Linux
# kg_env\Scripts\activate  # Windows

# Install dependencies
pip install "numpy<2.0" pandas networkx

# Install ML libraries
pip install torch torch-geometric deap matplotlib plotly pyvis scikit-learn tqdm pyyaml
```

### Option 2: Conda Environment

```bash
conda create -n kg_allocation python=3.10
conda activate kg_allocation
pip install -r requirements.txt
```

## Running the System

### Test Run (500 candidates, 10 jobs, 20 generations - ~1 min)

```bash
python pipeline.py --mode test
```

### Full Run (1000 candidates, custom parameters - ~2-3 min)

```bash
python pipeline.py --mode full --sample-size 1000 --num-jobs 20 --generations 50
```

### Production Run (all data)

```bash
python pipeline.py --mode full --sample-size 10000 --num-jobs 100 --generations 100 --output-dir ./production_results
```

## Viewing Results

After running, open these files in your browser:

1. **`output/kg_visualization.html`** - Interactive Knowledge Graph
2. **`output/pareto_front.html`** - 3D optimization results
3. **`output/allocation_results.json`** - Detailed allocations

## Customization

Edit `config.py` to modify:

```python
# Number of candidates to sample
kg_config.sample_size = 2000

# Genetic algorithm settings
genetic_config.population_size = 200  # Larger = better solutions, slower
geneticconfig.num_generations = 100

# Optimization targets
objectives_config.rural_participation_target = 0.4  # 40% rural candidates
objectives_config.new_candidate_ratio_target = 0.5  # 50% new candidates
```

## Troubleshooting

### NumPy Version Error

**Problem**: "A module that was compiled using NumPy 1.x cannot be run in NumPy 2.x"

**Solution**: Use virtual environment (Option 1 above) with NumPy 1.x

### Missing Dependencies

```bash
pip install pandas networkx torch torch-geometric deap matplotlib plotly pyvis scikit-learn
```

### Memory Issues on Large Dataset

Reduce sample size or use batching:
```bash
python pipeline.py --sample-size 5000  # Instead of 19000
```

## File Structure

```
dataset/
├── config.py                 # Configuration
├── feature_extractor.py      # Extract features from resumes
├── kg_builder.py             # Build Knowledge Graph
├── gnn_model.py              # GNN architecture (placeholder)
├── genetic_optimizer.py      # NSGA-II optimization
├── visualize_kg.py           # Visualizations
├── pipeline.py               # Main orchestration
├── requirements.txt          # Dependencies
├── setup.sh                  # Automated setup
├── test_quick.py             # Quick tests
└── README.md                 # Full documentation
```

## Next Steps

1. ✅ Install dependencies (virtual environment recommended)
2. ✅ Run test pipeline: `python pipeline.py --mode test`
3. ✅ View results in `output/` directory
4. ✅ Customize objectives in `config.py` for your use case
5. ⏳ Collect historical allocation data to train GNN
6. ⏳ Scale to production with full dataset

## Support

See `README.md` and `walkthrough.md` for complete documentation.

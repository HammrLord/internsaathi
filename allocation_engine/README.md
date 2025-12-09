# Knowledge Graph-based Job Allocation System

A comprehensive system for building Knowledge Graphs from resume data and performing multi-objective job allocation using Graph Neural Networks (GNN) and genetic algorithms (NSGA-II).

## Overview

This system creates a Knowledge Graph representing candidates and jobs, uses Graph Neural Networks to learn allocation patterns, and employs multi-objective genetic optimization to find optimal job allocations based on:

1. **Diversity**: Maximizing skill and background variety
2. **Fairness**: Ensuring rural/underrepresented participation  
3. **Past Participation**: Balancing new vs. returning candidates
4. **Location Preference**: Matching candidates to preferred locations

## Architecture

```
Resume CSV → Feature Extraction → Knowledge Graph → GNN Embeddings → NSGA-II Optimizer → Allocations
```

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Download spaCy model (optional, for advanced NLP)
python -m spacy download en_core_web_sm
```

## Quick Start

### Launch Admin Dashboard (Recommended)

```bash
# Start the web interface
./start_dashboard.sh

# Or directly
streamlit run app.py
```

Then open `http://localhost:8501` in your browser and:
1. Click "Build Knowledge Graph" on the Dashboard page
2. Click "Quick Allocation" to run a test
3. Explore results in the Results Explorer

See `DASHBOARD_GUIDE.md` for complete dashboard documentation.

### Command Line Usage

#### Test Mode (Quick)
```bash
python pipeline.py --mode test
```

### Full Mode
```bash
python pipeline.py --mode full --sample-size 5000 --num-jobs 50 --generations 50
```

## Project Structure

- **config.py**: Configuration settings for all components
- **feature_extractor.py**: Extract features from resume text (skills, experience, location, etc.)
- **kg_builder.py**: Build Knowledge Graph with candidate and job nodes
- **gnn_model.py**: Graph Attention Network model (placeholder until training data available)
- **genetic_optimizer.py**: NSGA-II multi-objective optimization
- **visualize_kg.py**: Interactive visualizations for KG and Pareto front
- **pipeline.py**: End-to-end orchestration

## Usage

### Build Knowledge Graph Only

```python
from kg_builder import KnowledgeGraphBuilder
from config import KGConfig

config = KGConfig(sample_size=1000)
builder = KnowledgeGraphBuilder(config=config)
kg = builder.build()
```

### Run Genetic Optimization

```python
from genetic_optimizer import MultiObjectiveAllocator

optimizer = MultiObjectiveAllocator(
    kg=kg,
    num_jobs=20,
    candidates_per_job=5
)
pareto_front, population = optimizer.optimize()
```

### Visualize Results

```python
from visualize_kg import KGVisualizer, visualize_pareto_front

visualizer = KGVisualizer(kg)
visualizer.visualize_plotly(output_path="kg.html")
visualize_pareto_front(pareto_front, output_path="pareto.html")
```

## Configuration

Edit `config.py` or create custom config:

```python
from config import PipelineConfig

config = PipelineConfig()
config.kg_config.sample_size = 2000
config.genetic_config.population_size = 100
config.genetic_config.num_generations = 100
config.num_jobs_to_allocate = 30
```

## Output

The pipeline generates:

- **knowledge_graph.pkl**: Serialized NetworkX graph
- **allocation_results.json**: Detailed allocation with fitness scores
- **pareto_front.csv**: All Pareto-optimal solutions
- **kg_visualization.html**: Interactive Plotly KG visualization
- **kg_network.html**: Interactive PyVis network
- **pareto_front.html**: 3D Pareto front visualization
- **kg_statistics.png**: Graph statistics plots

## GNN Training (Future Work)

The GNN component is currently a placeholder. To train it:

1. Collect historical allocation data (past candidate-job allocations)
2. Create training labels from successful allocations
3. Implement training loop in `gnn_model.py`
4. Set `use_gnn_embeddings=True` in config

## Multi-Objective Optimization

The system uses NSGA-II to find Pareto-optimal solutions across four objectives. You can:

- Adjust objective importance in `config.py`
- Customize objective functions in `genetic_optimizer.py`
- Select solutions from Pareto front based on preferences

## License

MIT

## Contact

For questions or issues, please open a GitHub issue.

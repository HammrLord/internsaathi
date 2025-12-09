"""
Configuration file for Knowledge Graph-based Job Allocation System
"""
from dataclasses import dataclass
from typing import List, Dict


@dataclass
class KGConfig:
    """Knowledge Graph construction configuration"""
    # Data paths
    resume_csv_path: str = "./resume.csv"
    
    # Sample size (set to None for full dataset)
    sample_size: int = 1000  # Use subset for faster testing
    
    # Node types
    candidate_node_prefix: str = "CANDIDATE_"
    job_node_prefix: str = "JOB_"
    
    # Feature extraction
    max_skills_per_candidate: int = 10
    extract_location: bool = True
    extract_experience: bool = True
    
    # Edge types
    edge_types: List[str] = None
    
    def __post_init__(self):
        if self.edge_types is None:
            self.edge_types = [
                "ALLOCATED_TO",
                "QUALIFIED_FOR",
                "PREFERS_LOCATION",
                "HAS_SKILL"
            ]


@dataclass
class GNNConfig:
    """GNN model configuration"""
    # Architecture
    hidden_channels: int = 128
    num_layers: int = 3
    num_heads: int = 4  # For GAT
    dropout: float = 0.2
    
    # Training
    learning_rate: float = 0.001
    num_epochs: int = 100
    batch_size: int = 32
    
    # Device
    device: str = "cpu"  # Change to "cuda" if GPU available
    
    # Model save path
    model_save_path: str = "./models/gnn_allocation.pth"


@dataclass
class GeneticConfig:
    """Genetic Algorithm (NSGA-II) configuration"""
    # Population
    population_size: int = 100
    num_generations: int = 50
    
    # Genetic operators
    crossover_prob: float = 0.8
    mutation_prob: float = 0.2
    
    # Selection
    tournament_size: int = 3
    
    # Objectives (weights for normalization, not for optimization - NSGA-II is Pareto-based)
    objective_weights: Dict[str, float] = None
    
    def __post_init__(self):
        if self.objective_weights is None:
            self.objective_weights = {
                "diversity": 1.0,
                "fairness": 1.0,
                "past_participation": 1.0,
                "location_preference": 1.0
            }


@dataclass
class OptimizationObjectives:
    """Configuration for optimization objectives"""
    # Diversity
    diversity_metric: str = "skill_diversity"  # Options: skill_diversity, category_diversity
    
    # Fairness (rural participation)
    rural_participation_target: float = 0.3  # Target 30% rural candidates
    rural_keywords: List[str] = None
    
    # Past participation
    new_candidate_ratio_target: float = 0.4  # Target 40% new candidates
    
    # Location preference
    location_match_weight: float = 1.0
    
    def __post_init__(self):
        if self.rural_keywords is None:
            self.rural_keywords = [
                "rural", "village", "town", "district",
                "agricultural", "farming", "countryside"
            ]


@dataclass
class PipelineConfig:
    """Overall pipeline configuration"""
    # Sub-configs
    kg_config: KGConfig = None
    gnn_config: GNNConfig = None
    genetic_config: GeneticConfig = None
    objectives_config: OptimizationObjectives = None
    
    # Pipeline settings
    use_gnn_embeddings: bool = False  # Set to True when GNN is trained
    num_jobs_to_allocate: int = 50
    candidates_per_job: int = 5
    
    # Output
    output_dir: str = "./output"
    save_kg: bool = True
    save_allocations: bool = True
    
    # Visualization
    visualize_kg: bool = True
    visualize_pareto_front: bool = True
    
    def __post_init__(self):
        if self.kg_config is None:
            self.kg_config = KGConfig()
        if self.gnn_config is None:
            self.gnn_config = GNNConfig()
        if self.genetic_config is None:
            self.genetic_config = GeneticConfig()
        if self.objectives_config is None:
            self.objectives_config = OptimizationObjectives()


# Default configuration instance
DEFAULT_CONFIG = PipelineConfig()

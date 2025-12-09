"""
End-to-End Pipeline for KG-based Job Allocation
Orchestrates the entire workflow: KG building → GNN (placeholder) → Genetic Optimization
"""
import os
import argparse
import json
import pandas as pd
from datetime import datetime
from typing import Dict, List

# Import modules
from config import PipelineConfig, KGConfig, GNNConfig, GeneticConfig, OptimizationObjectives
from kg_builder import KnowledgeGraphBuilder
from gnn_model import create_gnn_model, GNNConverter
from genetic_optimizer import MultiObjectiveAllocator
from visualize_kg import KGVisualizer, visualize_pareto_front


class AllocationPipeline:
    """End-to-end pipeline for job allocation"""
    
    def __init__(self, config: PipelineConfig = None):
        self.config = config or PipelineConfig()
        self.kg = None
        self.gnn_model = None
        self.pareto_front = None
        self.best_allocation = None
        
        # Create output directory
        os.makedirs(self.config.output_dir, exist_ok=True)
    
    def build_knowledge_graph(self):
        """Step 1: Build Knowledge Graph"""
        print("\n" + "="*80)
        print("STEP 1: Building Knowledge Graph")
        print("="*80)
        
        builder = KnowledgeGraphBuilder(config=self.config.kg_config)
        self.kg = builder.build(add_historical=True)
        
        # Save KG if configured
        if self.config.save_kg:
            kg_path = os.path.join(self.config.output_dir, "knowledge_graph.pkl")
            builder.save_graph(kg_path)
        
        return self.kg
    
    def setup_gnn(self):
        """Step 2: Setup GNN (placeholder for now)"""
        print("\n" + "="*80)
        print("STEP 2: Setting up GNN Model")
        print("="*80)
        
        if not self.config.use_gnn_embeddings:
            print("GNN embeddings disabled in config (use_gnn_embeddings=False)")
            print("Skipping GNN setup - genetic algorithm will use graph features directly")
            return None
        
        # Convert graph to PyTorch Geometric format
        converter = GNNConverter(self.config.gnn_config)
        num_features = converter.get_num_features()
        
        # Create GNN model
        self.gnn_model = create_gnn_model(num_features, self.config.gnn_config)
        
        print(f"Created GNN model with {num_features} node features")
        print("Note: GNN is untrained (placeholder) - requires historical allocation data for training")
        
        return self.gnn_model
    
    def run_genetic_optimization(self):
        """Step 3: Run multi-objective genetic optimization"""
        print("\n" + "="*80)
        print("STEP 3: Running Multi-Objective Genetic Optimization")
        print("="*80)
        
        # Create optimizer
        optimizer = MultiObjectiveAllocator(
            kg=self.kg,
            num_jobs=self.config.num_jobs_to_allocate,
            candidates_per_job=self.config.candidates_per_job,
            genetic_config=self.config.genetic_config,
            objectives_config=self.config.objectives_config
        )
        
        # Run optimization
        self.pareto_front, population = optimizer.optimize()
        
        # Select best solution from Pareto front
        # For now, just pick the first one (could use decision-making strategy)
        self.best_allocation = self.pareto_front[0]
        
        return self.pareto_front, self.best_allocation
    
    def save_results(self):
        """Step 4: Save allocation results"""
        print("\n" + "="*80)
        print("STEP 4: Saving Results")
        print("="*80)
        
        # Convert best allocation to readable format
        optimizer = MultiObjectiveAllocator(
            kg=self.kg,
            num_jobs=self.config.num_jobs_to_allocate,
            candidates_per_job=self.config.candidates_per_job
        )
        allocation_dict = optimizer.get_allocation_dict(self.best_allocation)
        
        # Create results structure
        results = {
            'metadata': {
                'timestamp': datetime.now().isoformat(),
                'num_jobs': len(allocation_dict),
                'total_allocations': len(self.best_allocation),
                'pareto_front_size': len(self.pareto_front),
                'config': {
                    'population_size': self.config.genetic_config.population_size,
                    'num_generations': self.config.genetic_config.num_generations,
                    'candidates_per_job': self.config.candidates_per_job
                }
            },
            'fitness_scores': {
                'diversity': -self.best_allocation.fitness.values[0],
                'fairness': -self.best_allocation.fitness.values[1],
                'past_participation': -self.best_allocation.fitness.values[2],
                'location_preference': -self.best_allocation.fitness.values[3]
            },
            'allocations': {}
        }
        
        # Add allocation details
        for job_id, candidate_ids in allocation_dict.items():
            job_category = self.kg.nodes[job_id]['category']
            
            candidates_info = []
            for cand_id in candidate_ids:
                cand_node = self.kg.nodes[cand_id]
                candidates_info.append({
                    'candidate_id': cand_id,
                    'skills': cand_node.get('skills', []),
                    'experience_years': cand_node.get('experience_years'),
                    'location': cand_node.get('location'),
                    'is_rural': cand_node.get('is_rural', False),
                    'education_level': cand_node.get('education_level', 'unknown')
                })
            
            results['allocations'][job_id] = {
                'job_category': job_category,
                'num_allocated': len(candidate_ids),
                'candidates': candidates_info
            }
        
        # Save to JSON
        if self.config.save_allocations:
            results_path = os.path.join(self.config.output_dir, "allocation_results.json")
            with open(results_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"Saved allocation results to {results_path}")
        
        # Save Pareto front data
        pareto_data = []
        for idx, individual in enumerate(self.pareto_front):
            pareto_data.append({
                'solution_id': idx,
                'diversity': -individual.fitness.values[0],
                'fairness': -individual.fitness.values[1],
                'past_participation': -individual.fitness.values[2],
                'location_preference': -individual.fitness.values[3],
                'num_allocations': len(individual)
            })
        
        pareto_df = pd.DataFrame(pareto_data)
        pareto_path = os.path.join(self.config.output_dir, "pareto_front.csv")
        pareto_df.to_csv(pareto_path, index=False)
        print(f"Saved Pareto front data to {pareto_path}")
        
        return results
    
    def visualize_results(self):
        """Step 5: Create visualizations"""
        print("\n" + "="*80)
        print("STEP 5: Creating Visualizations")
        print("="*80)
        
        visualizer = KGVisualizer(self.kg)
        
        # Visualize Knowledge Graph
        if self.config.visualize_kg:
            plotly_path = os.path.join(self.config.output_dir, "kg_visualization.html")
            visualizer.visualize_plotly(output_path=plotly_path, max_nodes=200)
            
            pyvis_path = os.path.join(self.config.output_dir, "kg_network.html")
            visualizer.visualize_pyvis(output_path=pyvis_path, max_nodes=200)
            
            # Plot statistics
            visualizer.plot_statistics(output_dir=self.config.output_dir)
        
        # Visualize Pareto front
        if self.config.visualize_pareto_front:
            pareto_path = os.path.join(self.config.output_dir, "pareto_front.html")
            visualize_pareto_front(self.pareto_front, output_path=pareto_path)
        
        print(f"All visualizations saved to {self.config.output_dir}")
    
    def run(self):
        """Run complete pipeline"""
        print("\n" + "="*80)
        print("KNOWLEDGE GRAPH-BASED JOB ALLOCATION PIPELINE")
        print("="*80)
        print(f"Start time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        try:
            # Execute pipeline steps
            self.build_knowledge_graph()
            self.setup_gnn()
            self.run_genetic_optimization()
            results = self.save_results()
            self.visualize_results()
            
            # Print summary
            print("\n" + "="*80)
            print("PIPELINE COMPLETE")
            print("="*80)
            print(f"Knowledge Graph: {self.kg.number_of_nodes()} nodes, {self.kg.number_of_edges()} edges")
            print(f"Pareto Front: {len(self.pareto_front)} solutions")
            print(f"\nBest Solution Fitness:")
            print(f"  Diversity: {results['fitness_scores']['diversity']:.4f}")
            print(f"  Fairness: {results['fitness_scores']['fairness']:.4f}")
            print(f"  Past Participation: {results['fitness_scores']['past_participation']:.4f}")
            print(f"  Location Preference: {results['fitness_scores']['location_preference']:.4f}")
            print(f"\nResults saved to: {self.config.output_dir}")
            print("="*80)
            
            return results
            
        except Exception as e:
            print(f"\nERROR: Pipeline failed with exception: {e}")
            import traceback
            traceback.print_exc()
            return None


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="KG-based Job Allocation Pipeline")
    
    parser.add_argument("--mode", type=str, default="full", choices=["test", "full"],
                        help="Run mode: 'test' for small sample, 'full' for complete dataset")
    parser.add_argument("--sample-size", type=int, default=None,
                        help="Number of resumes to sample (overrides config)")
    parser.add_argument("--num-jobs", type=int, default=None,
                        help="Number of jobs to allocate to (overrides config)")
    parser.add_argument("--candidates-per-job", type=int, default=None,
                        help="Candidates per job (overrides config)")
    parser.add_argument("--generations", type=int, default=None,
                        help="Number of GA generations (overrides config)")
    parser.add_argument("--output-dir", type=str, default=None,
                        help="Output directory (overrides config)")
    
    args = parser.parse_args()
    
    # Create config
    config = PipelineConfig()
    
    # Apply mode presets
    if args.mode == "test":
        print("Running in TEST mode (small sample for quick testing)")
        config.kg_config.sample_size = 500
        config.num_jobs_to_allocate = 10
        config.genetic_config.population_size = 50
        config.genetic_config.num_generations = 20
    
    # Apply command-line overrides
    if args.sample_size:
        config.kg_config.sample_size = args.sample_size
    if args.num_jobs:
        config.num_jobs_to_allocate = args.num_jobs
    if args.candidates_per_job:
        config.candidates_per_job = args.candidates_per_job
    if args.generations:
        config.genetic_config.num_generations = args.generations
    if args.output_dir:
        config.output_dir = args.output_dir
    
    # Run pipeline
    pipeline = AllocationPipeline(config)
    results = pipeline.run()
    
    if results:
        print("\n✓ Pipeline completed successfully!")
    else:
        print("\n✗ Pipeline failed!")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())

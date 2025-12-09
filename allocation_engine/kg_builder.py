"""
Knowledge Graph Builder
Constructs a Knowledge Graph from resume data with candidate and job nodes
"""
import networkx as nx
import pandas as pd
from typing import Dict, List, Optional, Tuple
import pickle
import os
from feature_extractor import FeatureExtractor
from config import KGConfig


class KnowledgeGraphBuilder:
    """Build Knowledge Graph from resume data"""
    
    def __init__(self, resume_csv_path: str = None, config: KGConfig = None):
        self.config = config or KGConfig()
        self.resume_csv_path = resume_csv_path or self.config.resume_csv_path
        self.feature_extractor = FeatureExtractor(config=self.config)
        self.graph = nx.DiGraph()
        self.candidate_features = None
        self.job_categories = set()
    
    def load_data(self) -> pd.DataFrame:
        """Load resume data"""
        print(f"Loading resume data from {self.resume_csv_path}...")
        df = pd.read_csv(self.resume_csv_path)
        
        # Sample if configured
        if self.config.sample_size and self.config.sample_size < len(df):
            df = df.sample(n=self.config.sample_size, random_state=42)
            print(f"Sampled {self.config.sample_size} resumes")
        
        return df
    
    def extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract features from resume dataframe"""
        self.candidate_features = self.feature_extractor.process_resume_dataframe(df)
        return self.candidate_features
    
    def create_candidate_nodes(self):
        """Create candidate nodes in the graph"""
        print("Creating candidate nodes...")
        
        for idx, row in self.candidate_features.iterrows():
            node_id = f"{self.config.candidate_node_prefix}{row['candidate_id']}"
            
            # Node attributes
            self.graph.add_node(
                node_id,
                node_type='candidate',
                category=row['category'],
                skills=row['skills'],
                skill_count=row['skill_count'],
                experience_years=row.get('experience_years'),
                location=row.get('location'),
                is_rural=row['is_rural'],
                education_level=row['education_level'],
                diversity_score=row['diversity_score'],
                resume_length=row['resume_length']
            )
            
            # Track job categories
            self.job_categories.add(row['category'])
        
        print(f"Created {len([n for n, d in self.graph.nodes(data=True) if d.get('node_type') == 'candidate'])} candidate nodes")
    
    def create_job_nodes(self):
        """Create job category nodes"""
        print("Creating job nodes...")
        
        for job_category in self.job_categories:
            node_id = f"{self.config.job_node_prefix}{job_category}"
            
            # Get candidates in this category for stats
            category_candidates = self.candidate_features[
                self.candidate_features['category'] == job_category
            ]
            
            # Calculate average skills for this job category
            avg_skills = category_candidates['skill_count'].mean() if len(category_candidates) > 0 else 0
            
            self.graph.add_node(
                node_id,
                node_type='job',
                category=job_category,
                required_skill_count=int(avg_skills),
                num_qualified_candidates=len(category_candidates)
            )
        
        print(f"Created {len(self.job_categories)} job nodes")
    
    def create_edges(self):
        """Create edges between candidates and jobs"""
        print("Creating edges...")
        
        edge_count = 0
        
        for idx, row in self.candidate_features.iterrows():
            candidate_id = f"{self.config.candidate_node_prefix}{row['candidate_id']}"
            job_id = f"{self.config.job_node_prefix}{row['category']}"
            
            # QUALIFIED_FOR edge (candidate → job)
            self.graph.add_edge(
                candidate_id,
                job_id,
                edge_type='QUALIFIED_FOR',
                weight=1.0,
                skill_match_score=row['diversity_score']
            )
            edge_count += 1
            
            # HAS_SKILL edges (candidate → skill pseudo-nodes could be added)
            # For now, skills are stored as node attributes
        
        print(f"Created {edge_count} edges")
    
    def add_historical_allocations(self, allocation_df: Optional[pd.DataFrame] = None):
        """
        Add historical allocation data if available (PLACEHOLDER)
        This would create ALLOCATED_TO edges showing past allocations
        """
        if allocation_df is None:
            print("No historical allocation data provided. Creating placeholder allocations...")
            
            # Create random placeholder allocations for demonstration
            import random
            random.seed(42)
            
            candidate_nodes = [n for n, d in self.graph.nodes(data=True) if d.get('node_type') == 'candidate']
            job_nodes = [n for n, d in self.graph.nodes(data=True) if d.get('node_type') == 'job']
            
            # Allocate 30% of candidates randomly
            num_to_allocate = int(len(candidate_nodes) * 0.3)
            allocated_candidates = random.sample(candidate_nodes, num_to_allocate)
            
            for candidate_id in allocated_candidates:
                # Get candidate's category
                category = self.graph.nodes[candidate_id]['category']
                job_id = f"{self.config.job_node_prefix}{category}"
                
                # Add ALLOCATED_TO edge
                self.graph.add_edge(
                    candidate_id,
                    job_id,
                    edge_type='ALLOCATED_TO',
                    weight=1.0,
                    is_historical=True
                )
            
            print(f"Added {num_to_allocate} placeholder historical allocations")
        else:
            # Process actual historical data
            print("Processing historical allocation data...")
            # Implementation would go here
            pass
    
    def compute_graph_statistics(self) -> Dict:
        """Compute statistics about the graph"""
        stats = {
            'num_nodes': self.graph.number_of_nodes(),
            'num_edges': self.graph.number_of_edges(),
            'num_candidates': len([n for n, d in self.graph.nodes(data=True) if d.get('node_type') == 'candidate']),
            'num_jobs': len([n for n, d in self.graph.nodes(data=True) if d.get('node_type') == 'job']),
            'num_job_categories': len(self.job_categories),
            'job_categories': list(self.job_categories),
            'avg_degree': sum(dict(self.graph.degree()).values()) / self.graph.number_of_nodes() if self.graph.number_of_nodes() > 0 else 0,
        }
        
        # Rural candidates
        rural_candidates = len([n for n, d in self.graph.nodes(data=True) 
                               if d.get('node_type') == 'candidate' and d.get('is_rural', False)])
        stats['num_rural_candidates'] = rural_candidates
        stats['rural_percentage'] = rural_candidates / stats['num_candidates'] * 100 if stats['num_candidates'] > 0 else 0
        
        return stats
    
    def build(self, add_historical: bool = True) -> nx.DiGraph:
        """Build the complete Knowledge Graph"""
        print("\n" + "="*60)
        print("Building Knowledge Graph")
        print("="*60)
        
        # Load and process data
        df = self.load_data()
        self.extract_features(df)
        
        # Create nodes
        self.create_candidate_nodes()
        self.create_job_nodes()
        
        # Create edges
        self.create_edges()
        
        # Add historical allocations (placeholder for now)
        if add_historical:
            self.add_historical_allocations()
        
        # Compute statistics
        stats = self.compute_graph_statistics()
        
        print("\n" + "-"*60)
        print("Knowledge Graph Statistics:")
        print("-"*60)
        for key, value in stats.items():
            if key != 'job_categories':
                print(f"  {key}: {value}")
        print("-"*60)
        
        return self.graph
    
    def save_graph(self, filepath: str):
        """Save graph to file"""
        print(f"Saving graph to {filepath}...")
        with open(filepath, 'wb') as f:
            pickle.dump(self.graph, f)
        print("Graph saved successfully")
    
    def load_graph(self, filepath: str) -> nx.DiGraph:
        """Load graph from file"""
        print(f"Loading graph from {filepath}...")
        with open(filepath, 'rb') as f:
            self.graph = pickle.load(f)
        print("Graph loaded successfully")
        return self.graph
    
    def get_candidate_node_features(self, node_id: str) -> Dict:
        """Get features for a candidate node"""
        return dict(self.graph.nodes[node_id])
    
    def get_job_node_features(self, node_id: str) -> Dict:
        """Get features for a job node"""
        return dict(self.graph.nodes[node_id])


if __name__ == "__main__":
    # Test KG builder
    config = KGConfig(sample_size=100)  # Use small sample for testing
    builder = KnowledgeGraphBuilder(config=config)
    
    kg = builder.build()
    
    print("\nSample Candidate Node:")
    candidate_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'candidate']
    if candidate_nodes:
        sample_node = candidate_nodes[0]
        print(f"  Node ID: {sample_node}")
        for key, value in builder.get_candidate_node_features(sample_node).items():
            print(f"    {key}: {value}")
    
    print("\nSample Job Node:")
    job_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'job']
    if job_nodes:
        sample_node = job_nodes[0]
        print(f"  Node ID: {sample_node}")
        for key, value in builder.get_job_node_features(sample_node).items():
            print(f"    {key}: {value}")

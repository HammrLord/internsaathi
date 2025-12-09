import os
import sys
from config import KGConfig
from kg_builder import KnowledgeGraphBuilder

def main():
    print("Building small Knowledge Graph (approx 100-200 entities)...")
    
    # Configure for ~150 resumes, which will yield ~150 candidate nodes + job nodes
    # This should land nicely in the 100-200 range or slightly above
    config = KGConfig(sample_size=150)
    
    # Initialize builder
    builder = KnowledgeGraphBuilder(config=config)
    
    # Build graph
    kg = builder.build(add_historical=True)
    
    # Print stats
    print("\nFinal Statistics:")
    print(f"Total Nodes: {kg.number_of_nodes()}")
    print(f"Total Edges: {kg.number_of_edges()}")
    
    candidate_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'candidate']
    job_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'job']
    
    print(f"Candidate Nodes: {len(candidate_nodes)}")
    print(f"Job Nodes: {len(job_nodes)}")
    
    # Save
    output_path = "small_knowledge_graph.pkl"
    builder.save_graph(output_path)
    print(f"\nSaved small KG to {os.path.abspath(output_path)}")

if __name__ == "__main__":
    main()

"""
Knowledge Graph Visualization
Interactive visualization of the KG using Plotly and PyVis
"""
import networkx as nx
import plotly.graph_objects as go
from pyvis.network import Network
import matplotlib.pyplot as plt
from typing import Optional, Dict
import os


class KGVisualizer:
    """Visualize Knowledge Graph"""
    
    def __init__(self, kg: nx.DiGraph):
        self.kg = kg
    
    def visualize_plotly(self, output_path: str = "kg_visualization.html", max_nodes: int = 200):
        """
        Create interactive visualization using Plotly
        
        Args:
            output_path: Path to save HTML file
            max_nodes: Maximum number of nodes to display (for performance)
        """
        print(f"Creating Plotly visualization...")
        
        # Sample nodes if too many
        if self.kg.number_of_nodes() > max_nodes:
            print(f"Sampling {max_nodes} nodes for visualization (graph has {self.kg.number_of_nodes()} nodes)")
            nodes_to_keep = list(self.kg.nodes())[:max_nodes]
            subgraph = self.kg.subgraph(nodes_to_keep)
        else:
            subgraph = self.kg
        
        # Calculate layout
        pos = nx.spring_layout(subgraph, k=0.5, iterations=50)
        
        # Create edge trace
        edge_x = []
        edge_y = []
        edge_colors = []
        
        for edge in subgraph.edges(data=True):
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
            
            # Color by edge type
            edge_type = edge[2].get('edge_type', 'UNKNOWN')
            if edge_type == 'ALLOCATED_TO':
                edge_colors.append('red')
            elif edge_type == 'QUALIFIED_FOR':
                edge_colors.append('blue')
            else:
                edge_colors.append('gray')
        
        edge_trace = go.Scatter(
            x=edge_x, y=edge_y,
            line=dict(width=0.5, color='#888'),
            hoverinfo='none',
            mode='lines'
        )
        
        # Create node traces (separate for candidates and jobs)
        candidate_x = []
        candidate_y = []
        candidate_text = []
        candidate_colors = []
        
        job_x = []
        job_y = []
        job_text = []
        
        for node, data in subgraph.nodes(data=True):
            x, y = pos[node]
            
            if data.get('node_type') == 'candidate':
                candidate_x.append(x)
                candidate_y.append(y)
                
                # Node text
                skills = data.get('skills', [])
                skills_str = ', '.join(skills[:3]) if skills else 'No skills'
                text = f"{node}<br>Category: {data.get('category', 'N/A')}<br>Skills: {skills_str}<br>Rural: {data.get('is_rural', False)}"
                candidate_text.append(text)
                
                # Color by rural status
                if data.get('is_rural', False):
                    candidate_colors.append('green')
                else:
                    candidate_colors.append('lightblue')
            
            else:  # job node
                job_x.append(x)
                job_y.append(y)
                text = f"{node}<br>Category: {data.get('category', 'N/A')}<br>Qualified: {data.get('num_qualified_candidates', 0)}"
                job_text.append(text)
        
        candidate_trace = go.Scatter(
            x=candidate_x, y=candidate_y,
            mode='markers',
            hoverinfo='text',
            text=candidate_text,
            marker=dict(
                size=10,
                color=candidate_colors,
                line=dict(width=2, color='white')
            ),
            name='Candidates'
        )
        
        job_trace = go.Scatter(
            x=job_x, y=job_y,
            mode='markers',
            hoverinfo='text',
            text=job_text,
            marker=dict(
                size=20,
                color='orange',
                symbol='diamond',
                line=dict(width=2, color='white')
            ),
            name='Jobs'
        )
        
        # Create figure
        fig = go.Figure(
            data=[edge_trace, candidate_trace, job_trace],
            layout=go.Layout(
                title='Knowledge Graph: Candidate-Job Network',
                titlefont_size=16,
                showlegend=True,
                hovermode='closest',
                margin=dict(b=0, l=0, r=0, t=40),
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                plot_bgcolor='white'
            )
        )
        
        # Save to HTML
        fig.write_html(output_path)
        print(f"Saved Plotly visualization to {output_path}")
        
        return fig
    
    def visualize_pyvis(self, output_path: str = "kg_network.html", max_nodes: int = 200):
        """
        Create interactive network using PyVis
        
        Args:
            output_path: Path to save HTML file
            max_nodes: Maximum number of nodes to display
        """
        print(f"Creating PyVis visualization...")
        
        # Sample if needed
        if self.kg.number_of_nodes() > max_nodes:
            nodes_to_keep = list(self.kg.nodes())[:max_nodes]
            subgraph = self.kg.subgraph(nodes_to_keep)
        else:
            subgraph = self.kg
        
        # Create PyVis network
        net = Network(height='750px', width='100%', bgcolor='#ffffff', font_color='black')
        net.barnes_hut()
        
        # Add nodes
        for node, data in subgraph.nodes(data=True):
            node_type = data.get('node_type', 'unknown')
            
            if node_type == 'candidate':
                color = 'green' if data.get('is_rural', False) else 'lightblue'
                size = 15
                shape = 'dot'
                title = f"Candidate: {node}<br>Category: {data.get('category', 'N/A')}<br>Skills: {len(data.get('skills', []))}"
            else:
                color = 'orange'
                size = 25
                shape = 'diamond'
                title = f"Job: {data.get('category', 'N/A')}<br>Candidates: {data.get('num_qualified_candidates', 0)}"
            
            net.add_node(node, label=node.split('_')[-1][:15], color=color, size=size, shape=shape, title=title)
        
        # Add edges
        for u, v, data in subgraph.edges(data=True):
            edge_type = data.get('edge_type', 'UNKNOWN')
            
            if edge_type == 'ALLOCATED_TO':
                color = 'red'
                width = 3
            elif edge_type == 'QUALIFIED_FOR':
                color = 'blue'
                width = 1
            else:
                color = 'gray'
                width = 1
            
            net.add_edge(u, v, color=color, width=width, title=edge_type)
        
        # Save
        net.save_graph(output_path)
        print(f"Saved PyVis visualization to {output_path}")
        
        return net
    
    def plot_statistics(self, output_dir: str = "./output"):
        """Plot graph statistics"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Degree distribution
        degrees = [d for n, d in self.kg.degree()]
        
        plt.figure(figsize=(12, 4))
        
        plt.subplot(1, 3, 1)
        plt.hist(degrees, bins=20, edgecolor='black')
        plt.xlabel('Degree')
        plt.ylabel('Frequency')
        plt.title('Degree Distribution')
        
        # Skills distribution
        skill_counts = [
            len(data.get('skills', []))
            for n, data in self.kg.nodes(data=True)
            if data.get('node_type') == 'candidate'
        ]
        
        plt.subplot(1, 3, 2)
        plt.hist(skill_counts, bins=15, edgecolor='black', color='green')
        plt.xlabel('Number of Skills')
        plt.ylabel('Frequency')
        plt.title('Candidate Skills Distribution')
        
        # Category distribution
        categories = [
            data.get('category', 'Unknown')
            for n, data in self.kg.nodes(data=True)
            if data.get('node_type') == 'candidate'
        ]
        
        from collections import Counter
        category_counts = Counter(categories)
        
        plt.subplot(1, 3, 3)
        top_categories = dict(sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:10])
        plt.barh(list(top_categories.keys()), list(top_categories.values()), color='orange')
        plt.xlabel('Count')
        plt.ylabel('Category')
        plt.title('Top 10 Job Categories')
        
        plt.tight_layout()
        output_path = os.path.join(output_dir, 'kg_statistics.png')
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        print(f"Saved statistics plot to {output_path}")
        plt.close()


def visualize_pareto_front(pareto_front, output_path: str = "pareto_front.html"):
    """
    Visualize Pareto front from genetic algorithm
    
    Args:
        pareto_front: List of individuals on Pareto front
        output_path: Path to save HTML file
    """
    print(f"Visualizing Pareto front with {len(pareto_front)} solutions...")
    
    # Extract fitness values (negate back for display)
    diversity_scores = [-ind.fitness.values[0] for ind in pareto_front]
    fairness_scores = [-ind.fitness.values[1] for ind in pareto_front]
    participation_scores = [-ind.fitness.values[2] for ind in pareto_front]
    location_scores = [-ind.fitness.values[3] for ind in pareto_front]
    
    # Create 3D scatter plot
    fig = go.Figure(data=[go.Scatter3d(
        x=diversity_scores,
        y=fairness_scores,
        z=participation_scores,
        mode='markers',
        marker=dict(
            size=8,
            color=location_scores,
            colorscale='Viridis',
            showscale=True,
            colorbar=dict(title="Location<br>Score")
        ),
        text=[f"Diversity: {d:.3f}<br>Fairness: {f:.3f}<br>Participation: {p:.3f}<br>Location: {l:.3f}"
              for d, f, p, l in zip(diversity_scores, fairness_scores, participation_scores, location_scores)],
        hoverinfo='text'
    )])
    
    fig.update_layout(
        title='Pareto Front: Multi-Objective Allocation Solutions',
        scene=dict(
            xaxis_title='Diversity Score',
            yaxis_title='Fairness Score',
            zaxis_title='Participation Score'
        ),
        margin=dict(l=0, r=0, b=0, t=40)
    )
    
    fig.write_html(output_path)
    print(f"Saved Pareto front visualization to {output_path}")
    
    return fig


if __name__ == "__main__":
    print("KG Visualizer module loaded")
    print("Run pipeline.py to generate and visualize a complete Knowledge Graph")

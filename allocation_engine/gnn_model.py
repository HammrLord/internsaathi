"""
GNN Model for Knowledge Graph-based Allocation
Graph Attention Network (GAT) for learning allocation patterns
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GATConv, global_mean_pool
from torch_geometric.data import Data, Batch
import networkx as nx
from typing import Dict, List, Tuple, Optional
import numpy as np
from config import GNNConfig


class AllocationGNN(nn.Module):
    """
    Graph Attention Network for job allocation prediction
    
    This is a PLACEHOLDER implementation. The GNN will need:
    1. Historical allocation data for training
    2. Proper node feature encoding
    3. Training loop with loss function
    
    For now, it generates embeddings that can be used by the genetic algorithm.
    """
    
    def __init__(self, 
                 num_node_features: int,
                 hidden_channels: int = 128,
                 num_layers: int = 3,
                 num_heads: int = 4,
                 dropout: float = 0.2):
        super(AllocationGNN, self).__init__()
        
        self.num_layers = num_layers
        self.dropout = dropout
        
        # GAT layers
        self.convs = nn.ModuleList()
        self.convs.append(
            GATConv(num_node_features, hidden_channels, heads=num_heads, dropout=dropout)
        )
        
        for _ in range(num_layers - 2):
            self.convs.append(
                GATConv(hidden_channels * num_heads, hidden_channels, heads=num_heads, dropout=dropout)
            )
        
        # Output layer
        self.convs.append(
            GATConv(hidden_channels * num_heads, hidden_channels, heads=1, concat=False, dropout=dropout)
        )
        
        # Allocation prediction head
        self.allocation_head = nn.Sequential(
            nn.Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_channels // 2, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x, edge_index, batch=None):
        """
        Forward pass
        
        Args:
            x: Node features [num_nodes, num_features]
            edge_index: Edge connectivity [2, num_edges]
            batch: Batch assignment for each node (for batched graphs)
        
        Returns:
            Node embeddings and allocation scores
        """
        # Apply GAT layers
        for i, conv in enumerate(self.convs[:-1]):
            x = conv(x, edge_index)
            x = F.elu(x)
            x = F.dropout(x, p=self.dropout, training=self.training)
        
        # Final layer
        x = self.convs[-1](x, edge_index)
        embeddings = x
        
        # Predict allocation scores
        allocation_scores = self.allocation_head(x)
        
        return embeddings, allocation_scores
    
    def get_candidate_embeddings(self, x, edge_index, candidate_mask):
        """Get embeddings for candidate nodes only"""
        embeddings, _ = self.forward(x, edge_index)
        return embeddings[candidate_mask]


class GNNConverter:
    """Convert NetworkX graph to PyTorch Geometric format"""
    
    def __init__(self, config: GNNConfig = None):
        self.config = config or GNNConfig()
    
    def networkx_to_pyg(self, G: nx.DiGraph) -> Data:
        """
        Convert NetworkX graph to PyTorch Geometric Data object
        
        Args:
            G: NetworkX graph
        
        Returns:
            PyTorch Geometric Data object
        """
        # Create node index mapping
        node_to_idx = {node: idx for idx, node in enumerate(G.nodes())}
        idx_to_node = {idx: node for node, idx in node_to_idx.items()}
        
        # Extract node features
        node_features = []
        node_types = []
        
        for node in G.nodes():
            features = self._extract_node_features(G.nodes[node])
            node_features.append(features)
            node_types.append(1 if G.nodes[node].get('node_type') == 'candidate' else 0)
        
        # Convert to tensor
        x = torch.tensor(node_features, dtype=torch.float)
        
        # Extract edges
        edge_list = []
        edge_features = []
        
        for u, v, data in G.edges(data=True):
            edge_list.append([node_to_idx[u], node_to_idx[v]])
            # Could add edge features here if needed
        
        edge_index = torch.tensor(edge_list, dtype=torch.long).t().contiguous()
        
        # Create masks
        candidate_mask = torch.tensor(node_types, dtype=torch.bool)
        
        # Create PyG Data object
        data = Data(
            x=x,
            edge_index=edge_index,
            candidate_mask=candidate_mask,
            node_to_idx=node_to_idx,
            idx_to_node=idx_to_node
        )
        
        return data
    
    def _extract_node_features(self, node_attrs: Dict) -> List[float]:
        """Extract numerical features from node attributes"""
        features = []
        
        # Node type (0 = job, 1 = candidate)
        features.append(1.0 if node_attrs.get('node_type') == 'candidate' else 0.0)
        
        # Skill count (normalized)
        skill_count = node_attrs.get('skill_count', 0)
        features.append(min(skill_count / 10.0, 1.0))
        
        # Experience years (normalized)
        exp_years = node_attrs.get('experience_years', 0) or 0
        features.append(min(exp_years / 20.0, 1.0))
        
        # Is rural
        features.append(1.0 if node_attrs.get('is_rural', False) else 0.0)
        
        # Diversity score
        features.append(node_attrs.get('diversity_score', 0.0))
        
        # Education level encoding
        edu_level = node_attrs.get('education_level', 'unknown')
        edu_encoding = {
            'doctorate': 1.0,
            'masters': 0.75,
            'bachelors': 0.5,
            'associate': 0.25,
            'unknown': 0.0
        }
        features.append(edu_encoding.get(edu_level, 0.0))
        
        # Resume length (normalized, log scale)
        resume_len = node_attrs.get('resume_length', 0)
        features.append(min(np.log1p(resume_len) / 10.0, 1.0))
        
        return features
    
    def get_num_features(self) -> int:
        """Get number of node features"""
        return 7  # Based on _extract_node_features


class GNNTrainer:
    """
    PLACEHOLDER for GNN training
    
    In a real implementation, this would:
    1. Load historical allocation data
    2. Train the GNN to predict allocations
    3. Save trained model weights
    
    For now, we'll use untrained embeddings or simple heuristics.
    """
    
    def __init__(self, model: AllocationGNN, config: GNNConfig = None):
        self.model = model
        self.config = config or GNNConfig()
        self.optimizer = torch.optim.Adam(model.parameters(), lr=self.config.learning_rate)
    
    def train_placeholder(self):
        """Placeholder training function"""
        print("GNN Training is a PLACEHOLDER - requires historical allocation data")
        print("Using untrained model for embedding generation")
        return self.model


def create_gnn_model(num_features: int, config: GNNConfig = None) -> AllocationGNN:
    """Factory function to create GNN model"""
    config = config or GNNConfig()
    
    model = AllocationGNN(
        num_node_features=num_features,
        hidden_channels=config.hidden_channels,
        num_layers=config.num_layers,
        num_heads=config.num_heads,
        dropout=config.dropout
    )
    
    return model


if __name__ == "__main__":
    # Test GNN model creation
    print("Testing GNN Model...")
    
    config = GNNConfig()
    converter = GNNConverter(config)
    num_features = converter.get_num_features()
    
    model = create_gnn_model(num_features, config)
    print(f"Created GNN model with {num_features} input features")
    print(f"Model architecture:\n{model}")
    
    # Test forward pass with dummy data
    num_nodes = 100
    num_edges = 200
    
    x = torch.randn(num_nodes, num_features)
    edge_index = torch.randint(0, num_nodes, (2, num_edges))
    
    embeddings, scores = model(x, edge_index)
    print(f"\nTest forward pass:")
    print(f"  Input shape: {x.shape}")
    print(f"  Embeddings shape: {embeddings.shape}")
    print(f"  Allocation scores shape: {scores.shape}")

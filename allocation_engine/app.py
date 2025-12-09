"""
Admin Dashboard for Knowledge Graph-based Job Allocation System
Multi-page Streamlit application for allocation management
"""

import streamlit as st
import pandas as pd
import networkx as nx
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime
import os
import json
import sys
from pathlib import Path

# Import our modules
from config import PipelineConfig, KGConfig, GeneticConfig
from kg_builder import KnowledgeGraphBuilder
from genetic_optimizer import MultiObjectiveAllocator
from visualize_kg import KGVisualizer, visualize_pareto_front
from pipeline import AllocationPipeline

# Page configuration
st.set_page_config(
    page_title="KG Allocation Admin",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f77b4;
        margin-bottom: 1rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 10px;
        color: white;
        text-align: center;
    }
    .success-box {
        background-color: #d4edda;
        border-left: 5px solid #28a745;
        padding: 1rem;
        margin: 1rem 0;
    }
    .warning-box {
        background-color: #fff3cd;
        border-left: 5px solid #ffc107;
        padding: 1rem;
        margin: 1rem 0;
    }
    .info-box {
        background-color: #d1ecf1;
        border-left: 5px solid #17a2b8;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'kg' not in st.session_state:
    st.session_state.kg = None
if 'pareto_front' not in st.session_state:
    st.session_state.pareto_front = None
if 'best_allocation' not in st.session_state:
    st.session_state.best_allocation = None
if 'config' not in st.session_state:
    st.session_state.config = PipelineConfig()
if 'last_run_time' not in st.session_state:
    st.session_state.last_run_time = None

# Sidebar navigation
st.sidebar.markdown("# 🎯 KG Allocation Admin")
st.sidebar.markdown("---")

page = st.sidebar.radio(
    "Navigation",
    ["📊 Dashboard", "▶️ Run Allocation", "📈 Results Explorer", 
     "🕸️ Knowledge Graph", "⚙️ Configuration", "📋 Reports"]
)

st.sidebar.markdown("---")
st.sidebar.markdown("### System Status")
if st.session_state.kg is not None:
    st.sidebar.success(f"✅ KG Loaded ({st.session_state.kg.number_of_nodes()} nodes)")
else:
    st.sidebar.info("ℹ️ No KG loaded")

if st.session_state.pareto_front is not None:
    st.sidebar.success(f"✅ Results Available ({len(st.session_state.pareto_front)} solutions)")
else:
    st.sidebar.info("ℹ️ No results yet")

if st.session_state.last_run_time:
    st.sidebar.info(f"🕐 Last run: {st.session_state.last_run_time}")


# ==================== PAGE 1: DASHBOARD ====================
if page == "📊 Dashboard":
    st.markdown('<h1 class="main-header">📊 Allocation Dashboard</h1>', unsafe_allow_html=True)
    
    # Overview metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        total_resumes = 19066  # From resume.csv
        st.metric("Total Candidates", f"{total_resumes:,}")
    
    with col2:
        if st.session_state.kg:
            st.metric("KG Nodes", st.session_state.kg.number_of_nodes())
        else:
            st.metric("KG Nodes", "Not loaded")
    
    with col3:
        if st.session_state.pareto_front:
            st.metric("Optimal Solutions", len(st.session_state.pareto_front))
        else:
            st.metric("Optimal Solutions", "Run allocation")
    
    with col4:
        if st.session_state.best_allocation:
            st.metric("Allocations", len(st.session_state.best_allocation))
        else:
            st.metric("Allocations", "N/A")
    
    st.markdown("---")
    
    # Quick actions
    st.markdown("### 🚀 Quick Actions")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🏗️ Build Knowledge Graph", use_container_width=True):
            with st.spinner("Building Knowledge Graph..."):
                config = st.session_state.config
                config.kg_config.sample_size = 500  # Quick build
                builder = KnowledgeGraphBuilder(config=config.kg_config)
                st.session_state.kg = builder.build(add_historical=True)
                st.success(f"✅ KG built with {st.session_state.kg.number_of_nodes()} nodes!")
                st.rerun()
    
    with col2:
        if st.button("⚡ Quick Allocation (Test)", use_container_width=True, disabled=st.session_state.kg is None):
            if st.session_state.kg:
                with st.spinner("Running allocation..."):
                    optimizer = MultiObjectiveAllocator(
                        kg=st.session_state.kg,
                        num_jobs=10,
                        candidates_per_job=5,
                        genetic_config=GeneticConfig(population_size=50, num_generations=20)
                    )
                    st.session_state.pareto_front, _ = optimizer.optimize()
                    st.session_state.best_allocation = st.session_state.pareto_front[0]
                    st.session_state.last_run_time = datetime.now().strftime("%H:%M:%S")
                    st.success("✅ Allocation complete!")
                    st.rerun()
    
    with col3:
        if st.button("📊 View Results", use_container_width=True, disabled=st.session_state.pareto_front is None):
            st.session_state.page = "📈 Results Explorer"
            st.rerun()
    
    # Recent activity
    st.markdown("---")
    st.markdown("### 📜 Recent Activity")
    
    if st.session_state.last_run_time:
        st.markdown(f"""
        <div class="info-box">
        ✅ Last allocation run completed at {st.session_state.last_run_time}<br>
        Generated {len(st.session_state.pareto_front) if st.session_state.pareto_front else 0} Pareto-optimal solutions
        </div>
        """, unsafe_allow_html=True)
    else:
        st.info("No recent activity. Run an allocation to get started!")
    
    # System overview
    if st.session_state.kg:
        st.markdown("---")
        st.markdown("### 📊 System Overview")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Category distribution
            categories = [data.get('category', 'Unknown') for n, data in st.session_state.kg.nodes(data=True) 
                         if data.get('node_type') == 'candidate']
            category_df = pd.DataFrame({'Category': categories})
            category_counts = category_df['Category'].value_counts().head(10)
            
            fig = px.bar(x=category_counts.values, y=category_counts.index, 
                        orientation='h', title="Top 10 Job Categories",
                        labels={'x': 'Count', 'y': 'Category'})
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Rural vs Non-rural
            rural_count = sum(1 for n, d in st.session_state.kg.nodes(data=True) 
                            if d.get('node_type') == 'candidate' and d.get('is_rural', False))
            total_candidates = sum(1 for n, d in st.session_state.kg.nodes(data=True) 
                                 if d.get('node_type') == 'candidate')
            
            fig = go.Figure(data=[go.Pie(
                labels=['Rural', 'Urban'],
                values=[rural_count, total_candidates - rural_count],
                hole=0.4,
                marker=dict(colors=['#28a745', '#17a2b8'])
            )])
            fig.update_layout(title="Rural vs Urban Candidates", height=400)
            st.plotly_chart(fig, use_container_width=True)


# ==================== PAGE 2: RUN ALLOCATION ====================
elif page == "▶️ Run Allocation":
    st.markdown('<h1 class="main-header">▶️ Run Allocation</h1>', unsafe_allow_html=True)
    
    # Configuration
    st.markdown("### ⚙️ Configuration")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Data Settings")
        sample_size = st.number_input("Sample Size", 100, 10000, 1000, 100,
                                     help="Number of candidates to sample from dataset")
        num_jobs = st.number_input("Number of Jobs", 5, 100, 20, 5,
                                   help="Number of job positions to allocate")
        candidates_per_job = st.number_input("Candidates per Job", 1, 20, 5, 1,
                                            help="Number of candidates to allocate per job")
    
    with col2:
        st.markdown("#### Algorithm Settings")
        population_size = st.number_input("Population Size", 20, 200, 100, 10,
                                         help="GA population size (larger = better, slower)")
        num_generations = st.number_input("Generations", 10, 200, 50, 10,
                                         help="Number of GA generations")
        
        add_historical = st.checkbox("Add Historical Allocations (Placeholder)", value=True,
                                     help="Creates random historical allocations for testing")
    
    st.markdown("---")
    st.markdown("### 🎯 Multi-Objective Weights")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Diversity", "1.0", help="Skill/category variety")
    with col2:
        st.metric("Fairness", "1.0", help="Rural participation")
    with col3:
        st.metric("Participation", "1.0", help="New vs returning balance")
    with col4:
        st.metric("Location", "1.0", help="Location preference match")
    
    st.info("ℹ️ All objectives are equally weighted in NSGA-II (Pareto optimization)")
    
    st.markdown("---")
    
    # Run button
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("🚀 RUN ALLOCATION", use_container_width=True, type="primary"):
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            try:
                # Step 1: Build KG
                status_text.text("📊 Building Knowledge Graph...")
                progress_bar.progress(20)
                
                config = PipelineConfig()
                config.kg_config.sample_size = sample_size
                config.num_jobs_to_allocate = num_jobs
                config.candidates_per_job = candidates_per_job
                config.genetic_config.population_size = population_size
                config.genetic_config.num_generations = num_generations
                
                builder = KnowledgeGraphBuilder(config=config.kg_config)
                st.session_state.kg = builder.build(add_historical=add_historical)
                
                progress_bar.progress(40)
                
                # Step 2: Run optimization
                status_text.text("🧬 Running NSGA-II Optimization...")
                
                optimizer = MultiObjectiveAllocator(
                    kg=st.session_state.kg,
                    num_jobs=num_jobs,
                    candidates_per_job=candidates_per_job,
                    genetic_config=config.genetic_config,
                    objectives_config=config.objectives_config
                )
                
                st.session_state.pareto_front, _ = optimizer.optimize()
                st.session_state.best_allocation = st.session_state.pareto_front[0]
                st.session_state.last_run_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                progress_bar.progress(100)
                status_text.empty()
                progress_bar.empty()
                
                # Success
                st.markdown(f"""
                <div class="success-box">
                <h3>✅ Allocation Complete!</h3>
                <ul>
                    <li>Knowledge Graph: {st.session_state.kg.number_of_nodes()} nodes, {st.session_state.kg.number_of_edges()} edges</li>
                    <li>Pareto Front: {len(st.session_state.pareto_front)} optimal solutions</li>
                    <li>Total Allocations: {len(st.session_state.best_allocation)}</li>
                    <li>Fitness Scores:
                        <ul>
                            <li>Diversity: {-st.session_state.best_allocation.fitness.values[0]:.4f}</li>
                            <li>Fairness: {-st.session_state.best_allocation.fitness.values[1]:.4f}</li>
                            <li>Participation: {-st.session_state.best_allocation.fitness.values[2]:.4f}</li>
                            <li>Location: {-st.session_state.best_allocation.fitness.values[3]:.4f}</li>
                        </ul>
                    </li>
                </ul>
                </div>
                """, unsafe_allow_html=True)
                
                st.balloons()
                
            except Exception as e:
                st.error(f"❌ Error during allocation: {str(e)}")
                import traceback
                with st.expander("Error Details"):
                    st.code(traceback.format_exc())


# ==================== PAGE 3: RESULTS EXPLORER ====================
elif page == "📈 Results Explorer":
    st.markdown('<h1 class="main-header">📈 Results Explorer</h1>', unsafe_allow_html=True)
    
    if st.session_state.pareto_front is None:
        st.warning("⚠️ No results available. Please run an allocation first!")
    else:
        # Pareto Front Visualization
        st.markdown("### 🎯 Pareto Front (3D)")
        
        diversity_scores = [-ind.fitness.values[0] for ind in st.session_state.pareto_front]
        fairness_scores = [-ind.fitness.values[1] for ind in st.session_state.pareto_front]
        participation_scores = [-ind.fitness.values[2] for ind in st.session_state.pareto_front]
        location_scores = [-ind.fitness.values[3] for ind in st.session_state.pareto_front]
        
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
                colorbar=dict(title="Location Score"),
                line=dict(width=1, color='white')
            ),
            text=[f"Sol #{i}<br>Div: {d:.3f}<br>Fair: {f:.3f}<br>Part: {p:.3f}<br>Loc: {l:.3f}"
                  for i, (d, f, p, l) in enumerate(zip(diversity_scores, fairness_scores, 
                                                       participation_scores, location_scores))],
            hoverinfo='text'
        )])
        
        fig.update_layout(
            scene=dict(
                xaxis_title='Diversity',
                yaxis_title='Fairness',
                zaxis_title='Participation'
            ),
            height=600,
            margin=dict(l=0, r=0, b=0, t=0)
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Solution selector
        st.markdown("---")
        st.markdown("### 🔍 Solution Details")
        
        solution_idx = st.selectbox(
            "Select Solution",
            range(len(st.session_state.pareto_front)),
            format_func=lambda x: f"Solution #{x} (Div: {-st.session_state.pareto_front[x].fitness.values[0]:.3f}, Fair: {-st.session_state.pareto_front[x].fitness.values[1]:.3f})"
        )
        
        selected_solution = st.session_state.pareto_front[solution_idx]
        
        # Fitness scores
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Diversity", f"{-selected_solution.fitness.values[0]:.4f}")
        with col2:
            st.metric("Fairness", f"{-selected_solution.fitness.values[1]:.4f}")
        with col3:
            st.metric("Participation", f"{-selected_solution.fitness.values[2]:.4f}")
        with col4:
            st.metric("Location", f"{-selected_solution.fitness.values[3]:.4f}")
        
        # Allocation details
        st.markdown("### 📋 Allocation Details")
        
        optimizer = MultiObjectiveAllocator(
            kg=st.session_state.kg, num_jobs=10, candidates_per_job=5
        )
        allocation_dict = optimizer.get_allocation_dict(selected_solution)
        
        allocations_data = []
        for job_id, candidate_ids in allocation_dict.items():
            job_category = st.session_state.kg.nodes[job_id]['category']
            for cand_id in candidate_ids:
                cand_node = st.session_state.kg.nodes[cand_id]
                allocations_data.append({
                    'Job': job_category,
                    'Candidate ID': cand_id.split('_')[-1],
                    'Skills': ', '.join(cand_node.get('skills', [])[:3]),
                    'Experience': cand_node.get('experience_years', 'N/A'),
                    'Rural': '✅' if cand_node.get('is_rural', False) else '❌',
                    'Education': cand_node.get('education_level', 'unknown').title()
                })
        
        df = pd.DataFrame(allocations_data)
        st.dataframe(df, use_container_width=True, height=400)
        
        # Download button
        csv = df.to_csv(index=False)
        st.download_button(
            "📥 Download Allocations CSV",
            csv,
            "allocations.csv",
            "text/csv",
            key='download-csv'
        )


# ==================== PAGE 4: KNOWLEDGE GRAPH ====================
elif page == "🕸️ Knowledge Graph":
    st.markdown('<h1 class="main-header">🕸️ Knowledge Graph Explorer</h1>', unsafe_allow_html=True)
    
    if st.session_state.kg is None:
        st.warning("⚠️ No Knowledge Graph loaded. Build one from the Dashboard or Run Allocation page!")
    else:
        # KG Statistics
        st.markdown("### 📊 Graph Statistics")
        
        col1, col2, col3, col4 = st.columns(4)
        
        num_candidates = sum(1 for n, d in st.session_state.kg.nodes(data=True) if d.get('node_type') == 'candidate')
        num_jobs = sum(1 for n, d in st.session_state.kg.nodes(data=True) if d.get('node_type') == 'job')
        
        with col1:
            st.metric("Total Nodes", st.session_state.kg.number_of_nodes())
        with col2:
            st.metric("Candidate Nodes", num_candidates)
        with col3:
            st.metric("Job Nodes", num_jobs)
        with col4:
            st.metric("Edges", st.session_state.kg.number_of_edges())
        
        st.markdown("---")
        
        # Sample visualization
        st.markdown("### 🎨 Graph Visualization (Sample)")
        st.info("📌 Showing a sample of the Knowledge Graph for performance")
        
        # Create sample subgraph
        sample_nodes = list(st.session_state.kg.nodes())[:50]
        subgraph = st.session_state.kg.subgraph(sample_nodes)
        
        # Simple visualization with Plotly
        pos = nx.spring_layout(subgraph, k=0.5, iterations=30)
        
        edge_x = []
        edge_y = []
        for edge in subgraph.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
        
        edge_trace = go.Scatter(
            x=edge_x, y=edge_y,
            line=dict(width=0.5, color='#888'),
            hoverinfo='none',
            mode='lines'
        )
        
        node_x = []
        node_y = []
        node_text = []
        node_color = []
        
        for node in subgraph.nodes():
            x, y = pos[node]
            node_x.append(x)
            node_y.append(y)
            data = subgraph.nodes[node]
            node_text.append(f"{node}<br>Type: {data.get('node_type', 'N/A')}")
            node_color.append('#ff7f0e' if data.get('node_type') == 'job' else '#1f77b4')
        
        node_trace = go.Scatter(
            x=node_x, y=node_y,
            mode='markers',
            hoverinfo='text',
            text=node_text,
            marker=dict(
                size=10,
                color=node_color,
                line=dict(width=2, color='white')
            )
        )
        
        fig = go.Figure(data=[edge_trace, node_trace],
                       layout=go.Layout(
                           showlegend=False,
                           hovermode='closest',
                           margin=dict(b=0,l=0,r=0,t=0),
                           xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                           yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                           height=600
                       ))
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Node details
        st.markdown("---")
        st.markdown("### 🔍 Node Inspector")
        
        node_type = st.radio("Filter by type", ["All", "Candidates", "Jobs"], horizontal=True)
        
        if node_type == "Candidates":
            nodes = [n for n, d in st.session_state.kg.nodes(data=True) if d.get('node_type') == 'candidate']
        elif node_type == "Jobs":
            nodes = [n for n, d in st.session_state.kg.nodes(data=True) if d.get('node_type') == 'job']
        else:
            nodes = list(st.session_state.kg.nodes())
        
        selected_node = st.selectbox("Select Node", nodes[:100])  # Limit for performance
        
        if selected_node:
            node_data = dict(st.session_state.kg.nodes[selected_node])
            st.json(node_data)


# ==================== PAGE 5: CONFIGURATION ====================
elif page == "⚙️ Configuration":
    st.markdown('<h1 class="main-header">⚙️ System Configuration</h1>', unsafe_allow_html=True)
    
    tab1, tab2, tab3 = st.tabs(["📊 Data Config", "🧬 GA Config", "🎯 Objectives"])
    
    with tab1:
        st.markdown("### Data & Knowledge Graph Settings")
        
        st.session_state.config.kg_config.sample_size = st.number_input(
            "Sample Size",
            100, 20000,
            st.session_state.config.kg_config.sample_size,
            help="Number of resumes to sample"
        )
        
        st.session_state.config.kg_config.max_skills_per_candidate = st.number_input(
            "Max Skills Per Candidate",
            5, 20,
            st.session_state.config.kg_config.max_skills_per_candidate
        )
        
        st.markdown("---")
        
        st.session_state.config.num_jobs_to_allocate = st.number_input(
            "Jobs to Allocate",
            5, 100,
            st.session_state.config.num_jobs_to_allocate
        )
        
        st.session_state.config.candidates_per_job = st.number_input(
            "Candidates Per Job",
            1, 20,
            st.session_state.config.candidates_per_job
        )
    
    with tab2:
        st.markdown("### Genetic Algorithm Settings")
        
        st.session_state.config.genetic_config.population_size = st.number_input(
            "Population Size",
            20, 500,
            st.session_state.config.genetic_config.population_size,
            help="Larger = better solutions, slower"
        )
        
        st.session_state.config.genetic_config.num_generations = st.number_input(
            "Number of Generations",
            10, 500,
            st.session_state.config.genetic_config.num_generations
        )
        
        st.session_state.config.genetic_config.crossover_prob = st.slider(
            "Crossover Probability",
            0.0, 1.0,
            st.session_state.config.genetic_config.crossover_prob,
            0.05
        )
        
        st.session_state.config.genetic_config.mutation_prob = st.slider(
            "Mutation Probability",
            0.0, 1.0,
            st.session_state.config.genetic_config.mutation_prob,
            0.05
        )
    
    with tab3:
        st.markdown("### Optimization Objectives")
        
        st.session_state.config.objectives_config.rural_participation_target = st.slider(
            "Rural Participation Target",
            0.0, 1.0,
            st.session_state.config.objectives_config.rural_participation_target,
            0.05,
            help="Target percentage of rural candidates"
        )
        
        st.session_state.config.objectives_config.new_candidate_ratio_target = st.slider(
            "New Candidate Ratio Target",
            0.0, 1.0,
            st.session_state.config.objectives_config.new_candidate_ratio_target,
            0.05,
            help="Target percentage of new (vs returning) candidates"
        )
        
        st.markdown("---")
        st.info("ℹ️ All objectives use equal weights (1.0) in NSGA-II Pareto optimization")
    
    if st.button("💾 Save Configuration"):
        st.success("✅ Configuration saved!")


# ==================== PAGE 6: REPORTS ====================
elif page == "📋 Reports":
    st.markdown('<h1 class="main-header">📋 Reports & Analytics</h1>', unsafe_allow_html=True)
    
    if st.session_state.pareto_front is None or st.session_state.kg is None:
        st.warning("⚠️ Run an allocation first to generate reports!")
    else:
        # Objective scores comparison
        st.markdown("### 📊 Objective Scores Across Solutions")
        
        scores_data = []
        for idx, ind in enumerate(st.session_state.pareto_front):
            scores_data.append({
                'Solution': f"#{idx}",
                'Diversity': -ind.fitness.values[0],
                'Fairness': -ind.fitness.values[1],
                'Participation': -ind.fitness.values[2],
                'Location': -ind.fitness.values[3]
            })
        
        df_scores = pd.DataFrame(scores_data)
        
        fig = go.Figure()
        for col in ['Diversity', 'Fairness', 'Participation', 'Location']:
            fig.add_trace(go.Box(y=df_scores[col], name=col))
        
        fig.update_layout(title="Distribution of Objective Scores", height=400)
        st.plotly_chart(fig, use_container_width=True)
        
        # Allocation summary
        st.markdown("---")
        st.markdown("### 📈 Allocation Summary")
        
        optimizer = MultiObjectiveAllocator(kg=st.session_state.kg, num_jobs=10, candidates_per_job=5)
        allocation_dict = optimizer.get_allocation_dict(st.session_state.best_allocation)
        
        summary_data = []
        for job_id, candidate_ids in allocation_dict.items():
            job_category = st.session_state.kg.nodes[job_id]['category']
            rural_count = sum(1 for c in candidate_ids if st.session_state.kg.nodes[c].get('is_rural', False))
            avg_exp = np.mean([st.session_state.kg.nodes[c].get('experience_years', 0) or 0 for c in candidate_ids])
            
            summary_data.append({
                'Job': job_category,
                'Allocated': len(candidate_ids),
                'Rural %': f"{rural_count/len(candidate_ids)*100:.1f}%",
                'Avg Experience': f"{avg_exp:.1f} yrs"
            })
        
        st.dataframe(pd.DataFrame(summary_data), use_container_width=True)
        
        # Download report
        st.markdown("---")
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button("📥 Download Full Report (JSON)", use_container_width=True):
                report = {
                    'timestamp': st.session_state.last_run_time,
                    'configuration': {
                        'sample_size': st.session_state.config.kg_config.sample_size,
                        'num_jobs': st.session_state.config.num_jobs_to_allocate,
                        'population_size': st.session_state.config.genetic_config.population_size
                    },
                    'results': {
                        'pareto_front_size': len(st.session_state.pareto_front),
                        'best_scores': {
                            'diversity': -st.session_state.best_allocation.fitness.values[0],
                            'fairness': -st.session_state.best_allocation.fitness.values[1],
                            'participation': -st.session_state.best_allocation.fitness.values[2],
                            'location': -st.session_state.best_allocation.fitness.values[3]
                        }
                    }
                }
                
                st.download_button(
                    "Download JSON",
                    json.dumps(report, indent=2),
                    "allocation_report.json",
                    "application/json"
                )
        
        with col2:
            csv_data = df_scores.to_csv(index=False)
            st.download_button(
                "📥 Download Scores CSV",
                csv_data,
                "objective_scores.csv",
                "text/csv"
            )

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("### About")
st.sidebar.info("""
**KG Allocation System v1.0**

Multi-objective job allocation using:
- Knowledge Graphs
- Graph Neural Networks
- NSGA-II Genetic Algorithm

Optimizes for: Diversity, Fairness, Participation, Location
""")

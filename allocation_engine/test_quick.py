"""
Quick Test Script
Test KG construction without full dependencies
"""
import sys
import os

def test_imports():
    """Test if core modules can be imported"""
    print("Testing imports...")
    
    try:
        import pandas as pd
        print("✓ pandas")
    except ImportError as e:
        print(f"✗ pandas: {e}")
        return False
    
    try:
        import networkx as nx
        print("✓ networkx")
    except ImportError as e:
        print(f"✗ networkx: {e}")
        return False
    
    try:
        from config import PipelineConfig
        print("✓ config")
    except Exception as e:
        print(f"✗ config: {e}")
        return False
    
    try:
        from feature_extractor import FeatureExtractor
        print("✓ feature_extractor")
    except Exception as e:
        print(f"✗ feature_extractor: {e}")
        return False
    
    return True


def test_feature_extraction():
    """Test feature extraction"""
    print("\nTesting feature extraction...")
    
    from feature_extractor import FeatureExtractor
    
    extractor = FeatureExtractor()
    
    test_resume = """
    HR MANAGER with 10+ years of experience in recruitment, employee relations, 
    and policy development. Located in Springfield, IL. Skills include Python, 
    Excel, Leadership, Communication, HRIS, and Recruitment.
    """
    
    features = extractor.extract_all_features(test_resume, "HR", 0)
    
    print("\nExtracted features:")
    for key, value in features.items():
        print(f"  {key}: {value}")
    
    assert len(features['skills']) > 0, "No skills extracted"
    print("\n✓ Feature extraction working")
    
    return True


def test_kg_construction():
    """Test KG construction with minimal data"""
    print("\nTesting KG construction...")
    
    try:
        import pandas as pd
        import networkx as nx
        from kg_builder import KnowledgeGraphBuilder
        from config import KGConfig
        
        # Create sample data
        sample_data = pd.DataFrame({
            'Resume_str': [
                'HR Manager with Python and Excel skills. 10 years experience. Location: City, State',
                'Software Engineer with Java and Python. 5 years experience. Rural background.',
                'Data Analyst with SQL and Tableau. 3 years experience.'
            ],
            'Category': ['HR', 'INFORMATION-TECHNOLOGY', 'INFORMATION-TECHNOLOGY']
        })
        
        # Save to temp CSV
        temp_csv = 'temp_test_resumes.csv'
        sample_data.to_csv(temp_csv, index=False)
        
        # Build KG
        config = KGConfig(sample_size=3)
        config.resume_csv_path = temp_csv
        
        builder = KnowledgeGraphBuilder(config=config)
        kg = builder.build(add_historical=False)
        
        # Cleanup
        os.remove(temp_csv)
        
        print(f"\n✓ KG created with {kg.number_of_nodes()} nodes and {kg.number_of_edges()} edges")
        
        # Verify structure
        candidate_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'candidate']
        job_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'job']
        
        print(f"  - Candidate nodes: {len(candidate_nodes)}")
        print(f"  - Job nodes: {len(job_nodes)}")
        
        assert len(candidate_nodes) == 3, f"Expected 3 candidates, got {len(candidate_nodes)}"
        assert len(job_nodes) == 2, f"Expected 2 jobs, got {len(job_nodes)}"  # HR and IT
        
        print("\n✓ KG construction working")
        return True
        
    except Exception as e:
        print(f"\n✗ KG construction failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("="*60)
    print("KG-based Job Allocation System - Quick Test")
    print("="*60)
    
    # Test imports
    if not test_imports():
        print("\n✗ Import test failed. Please install dependencies:")
        print("  pip install pandas networkx")
        return 1
    
    # Test feature extraction
    try:
        if not test_feature_extraction():
            return 1
    except Exception as e:
        print(f"\n✗ Feature extraction test failed: {e}")
        return 1
    
    # Test KG construction
    try:
        if not test_kg_construction():
            return 1
    except Exception as e:
        print(f"\n✗ KG construction test failed: {e}")
        return 1
    
    print("\n" + "="*60)
    print("✓ All tests passed!")
    print("="*60)
    print("\nNext steps:")
    print("1. Install remaining dependencies: pip install -r requirements.txt")
    print("2. Run test pipeline: python pipeline.py --mode test")
    print("3. Run full pipeline: python pipeline.py --mode full")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())

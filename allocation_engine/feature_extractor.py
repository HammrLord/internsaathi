"""
Feature Extractor for Resume Data
Extracts structured features from resume text for KG construction
"""
import re
import pandas as pd
from typing import Dict, List, Set, Optional
from config import KGConfig, OptimizationObjectives


class FeatureExtractor:
    """Extract features from resume text"""
    
    def __init__(self, config: KGConfig = None, objectives_config: OptimizationObjectives = None):
        self.config = config or KGConfig()
        self.objectives_config = objectives_config or OptimizationObjectives()
        
        # Common skills keywords (expandable)
        self.skill_keywords = {
            'python', 'java', 'javascript', 'c++', 'sql', 'data', 'machine learning',
            'ml', 'ai', 'deep learning', 'analysis', 'management', 'leadership',
            'communication', 'excel', 'powerpoint', 'project management', 'agile',
            'scrum', 'git', 'aws', 'cloud', 'docker', 'kubernetes', 'react', 'angular',
            'node', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
            'marketing', 'sales', 'customer service', 'hr', 'accounting', 'finance',
            'engineering', 'design', 'ui/ux', 'web development', 'mobile', 'testing',
            'devops', 'security', 'network', 'database', 'tableau', 'power bi'
        }
        
        # Location indicators
        self.location_patterns = [
            r'City\s*,\s*State',
            r'[A-Z][a-z]+\s*,\s*[A-Z]{2}',
            r'Location:?\s*([^,\n]+)',
        ]
        
        # Experience indicators
        self.experience_patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience.*?(\d+)\+?\s*years?',
        ]
    
    def extract_skills(self, resume_text: str) -> List[str]:
        """Extract skills from resume text"""
        if not isinstance(resume_text, str):
            return []
        
        text_lower = resume_text.lower()
        found_skills = []
        
        for skill in self.skill_keywords:
            if skill in text_lower:
                found_skills.append(skill)
        
        # Limit to max skills
        return found_skills[:self.config.max_skills_per_candidate]
    
    def extract_experience_years(self, resume_text: str) -> Optional[int]:
        """Extract years of experience from resume"""
        if not isinstance(resume_text, str):
            return None
        
        for pattern in self.experience_patterns:
            match = re.search(pattern, resume_text, re.IGNORECASE)
            if match:
                try:
                    years = int(match.group(1))
                    return min(years, 50)  # Cap at 50 years
                except (ValueError, IndexError):
                    continue
        
        return None
    
    def extract_location(self, resume_text: str) -> Optional[str]:
        """Extract location from resume"""
        if not isinstance(resume_text, str):
            return None
        
        for pattern in self.location_patterns:
            match = re.search(pattern, resume_text)
            if match:
                if match.groups():
                    return match.group(1).strip()
                else:
                    return match.group(0).strip()
        
        return None
    
    def is_rural_background(self, resume_text: str) -> bool:
        """Determine if candidate has rural background"""
        if not isinstance(resume_text, str):
            return False
        
        text_lower = resume_text.lower()
        
        for keyword in self.objectives_config.rural_keywords:
            if keyword in text_lower:
                return True
        
        return False
    
    def extract_education_level(self, resume_text: str) -> str:
        """Extract education level from resume"""
        if not isinstance(resume_text, str):
            return "unknown"
        
        text_lower = resume_text.lower()
        
        if any(x in text_lower for x in ['phd', 'ph.d', 'doctorate', 'doctoral']):
            return "doctorate"
        elif any(x in text_lower for x in ['master', 'mba', 'ms', 'm.s', 'ma', 'm.a']):
            return "masters"
        elif any(x in text_lower for x in ['bachelor', 'bs', 'b.s', 'ba', 'b.a', 'undergraduate']):
            return "bachelors"
        elif any(x in text_lower for x in ['associate', 'diploma']):
            return "associate"
        
        return "unknown"
    
    def calculate_diversity_score(self, skills: List[str], category: str) -> float:
        """Calculate a diversity score based on skill variety"""
        if not skills:
            return 0.0
        
        # Simple diversity: ratio of unique skills to max possible
        unique_skills = len(set(skills))
        return min(unique_skills / self.config.max_skills_per_candidate, 1.0)
    
    def extract_all_features(self, resume_text: str, category: str, candidate_id: int) -> Dict:
        """Extract all features from a resume"""
        features = {
            'candidate_id': candidate_id,
            'category': category,
            'skills': self.extract_skills(resume_text),
            'experience_years': self.extract_experience_years(resume_text),
            'location': self.extract_location(resume_text),
            'is_rural': self.is_rural_background(resume_text),
            'education_level': self.extract_education_level(resume_text),
            'resume_length': len(resume_text) if isinstance(resume_text, str) else 0,
        }
        
        # Add diversity score
        features['diversity_score'] = self.calculate_diversity_score(
            features['skills'], 
            category
        )
        
        # Add skill count
        features['skill_count'] = len(features['skills'])
        
        return features
    
    def process_resume_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process entire resume dataframe"""
        print(f"Processing {len(df)} resumes...")
        
        features_list = []
        for idx, row in df.iterrows():
            features = self.extract_all_features(
                row['Resume_str'],
                row['Category'],
                idx
            )
            features_list.append(features)
        
        features_df = pd.DataFrame(features_list)
        print(f"Extracted features for {len(features_df)} candidates")
        
        return features_df


if __name__ == "__main__":
    # Test feature extraction
    extractor = FeatureExtractor()
    
    test_resume = """
    HR MANAGER
    
    Summary: Experienced HR Manager with 10+ years of experience in recruitment,
    employee relations, and policy development. Located in Small Town, Kansas.
    
    Skills: Leadership, Communication, Excel, PowerPoint, HRIS, ADP, Recruitment
    
    Education: MBA in Human Resources Management
    """
    
    features = extractor.extract_all_features(test_resume, "HR", 0)
    print("Extracted Features:")
    for key, value in features.items():
        print(f"  {key}: {value}")

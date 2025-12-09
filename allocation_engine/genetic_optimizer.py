"""
Genetic Algorithm for Multi-Objective Job Allocation
Implements NSGA-II for optimizing diversity, fairness, past participation, and location preference
"""
import random
import numpy as np
from deap import base, creator, tools, algorithms
from typing import List, Dict, Tuple, Set
import networkx as nx
from config import GeneticConfig, OptimizationObjectives


class AllocationChromosome:
    """
    Represents a job allocation solution
    
    Chromosome encoding:
    - List of (candidate_id, job_id) tuples
    - Each tuple represents one allocation
    """
    
    def __init__(self, allocations: List[Tuple[str, str]]):
        self.allocations = allocations
    
    def __repr__(self):
        return f"AllocationChromosome({len(self.allocations)} allocations)"


class MultiObjectiveAllocator:
    """
    Multi-objective genetic algorithm for job allocation using NSGA-II
    
    Objectives:
    1. Diversity: Maximize skill/background diversity in allocations
    2. Fairness: Ensure rural/underrepresented participation
    3. Past Participation: Balance new vs. returning candidates
    4. Location Preference: Match candidates to preferred locations
    """
    
    def __init__(self, 
                 kg: nx.DiGraph,
                 num_jobs: int,
                 candidates_per_job: int,
                 genetic_config: GeneticConfig = None,
                 objectives_config: OptimizationObjectives = None):
        
        self.kg = kg
        self.num_jobs = num_jobs
        self.candidates_per_job = candidates_per_job
        self.genetic_config = genetic_config or GeneticConfig()
        self.objectives_config = objectives_config or OptimizationObjectives()
        
        # Extract candidate and job information
        self.candidate_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'candidate']
        self.job_nodes = [n for n, d in kg.nodes(data=True) if d.get('node_type') == 'job']
        
        # Limit jobs if needed
        if len(self.job_nodes) > num_jobs:
            self.job_nodes = random.sample(self.job_nodes, num_jobs)
        
        # Setup DEAP framework
        self._setup_deap()
    
    def _setup_deap(self):
        """Setup DEAP framework for NSGA-II"""
        # Create fitness and individual classes
        # NSGA-II minimizes by default, so we negate objectives we want to maximize
        creator.create("FitnessMulti", base.Fitness, weights=(-1.0, -1.0, -1.0, -1.0))  # All maximize
        creator.create("Individual", list, fitness=creator.FitnessMulti)
        
        self.toolbox = base.Toolbox()
        
        # Register genetic operators
        self.toolbox.register("individual", self._create_individual)
        self.toolbox.register("population", tools.initRepeat, list, self.toolbox.individual)
        self.toolbox.register("evaluate", self._evaluate_individual)
        self.toolbox.register("mate", self._crossover)
        self.toolbox.register("mutate", self._mutate)
        self.toolbox.register("select", tools.selNSGA2)
    
    def _create_individual(self) -> creator.Individual:
        """Create a random allocation individual"""
        allocations = []
        
        for job_node in self.job_nodes:
            # Get job category
            job_category = self.kg.nodes[job_node]['category']
            
            # Get qualified candidates for this job
            qualified_candidates = [
                n for n in self.candidate_nodes
                if self.kg.nodes[n]['category'] == job_category
            ]
            
            # Randomly select candidates
            if len(qualified_candidates) >= self.candidates_per_job:
                selected = random.sample(qualified_candidates, self.candidates_per_job)
            else:
                # If not enough qualified, take all qualified candidates
                selected = qualified_candidates
            
            # Add allocations
            for candidate in selected:
                allocations.append((candidate, job_node))
        
        return creator.Individual(allocations)
    
    def _evaluate_individual(self, individual: List) -> Tuple[float, float, float, float]:
        """
        Evaluate individual across all objectives
        
        Returns:
            Tuple of (diversity_score, fairness_score, participation_score, location_score)
            All scores are negated for minimization (DEAP convention)
        """
        diversity = self._evaluate_diversity(individual)
        fairness = self._evaluate_fairness(individual)
        participation = self._evaluate_past_participation(individual)
        location = self._evaluate_location_preference(individual)
        
        # Negate scores for minimization
        return (-diversity, -fairness, -participation, -location)
    
    def _evaluate_diversity(self, individual: List) -> float:
        """
        Evaluate diversity objective
        Measures skill diversity across allocations
        """
        all_skills = set()
        candidate_categories = []
        
        for candidate_id, job_id in individual:
            # Get candidate skills
            skills = self.kg.nodes[candidate_id].get('skills', [])
            all_skills.update(skills)
            
            # Get category
            category = self.kg.nodes[candidate_id].get('category', '')
            candidate_categories.append(category)
        
        # Skill diversity: unique skills / total allocations
        skill_diversity = len(all_skills) / max(len(individual), 1)
        
        # Category diversity: entropy of category distribution
        if candidate_categories:
            from collections import Counter
            category_counts = Counter(candidate_categories)
            total = len(candidate_categories)
            category_diversity = -sum(
                (count/total) * np.log(count/total) 
                for count in category_counts.values()
            )
        else:
            category_diversity = 0.0
        
        # Combined diversity score
        diversity_score = 0.6 * skill_diversity + 0.4 * category_diversity
        
        return diversity_score
    
    def _evaluate_fairness(self, individual: List) -> float:
        """
        Evaluate fairness objective
        Ensures rural/underrepresented participation
        """
        rural_count = 0
        total_count = len(individual)
        
        for candidate_id, job_id in individual:
            is_rural = self.kg.nodes[candidate_id].get('is_rural', False)
            if is_rural:
                rural_count += 1
        
        if total_count == 0:
            return 0.0
        
        rural_ratio = rural_count / total_count
        target_ratio = self.objectives_config.rural_participation_target
        
        # Penalize deviation from target
        fairness_score = 1.0 - abs(rural_ratio - target_ratio)
        
        return max(fairness_score, 0.0)
    
    def _evaluate_past_participation(self, individual: List) -> float:
        """
        Evaluate past participation objective
        Balance between new and returning candidates
        """
        # Check which candidates have historical allocations
        new_candidates = 0
        returning_candidates = 0
        
        for candidate_id, job_id in individual:
            # Check if candidate has ALLOCATED_TO edges (historical)
            has_history = any(
                edge_data.get('edge_type') == 'ALLOCATED_TO' and edge_data.get('is_historical', False)
                for _, _, edge_data in self.kg.edges(candidate_id, data=True)
            )
            
            if has_history:
                returning_candidates += 1
            else:
                new_candidates += 1
        
        total = new_candidates + returning_candidates
        if total == 0:
            return 0.0
        
        new_ratio = new_candidates / total
        target_ratio = self.objectives_config.new_candidate_ratio_target
        
        # Penalize deviation from target
        participation_score = 1.0 - abs(new_ratio - target_ratio)
        
        return max(participation_score, 0.0)
    
    def _evaluate_location_preference(self, individual: List) -> float:
        """
        Evaluate location preference objective
        Match candidates to jobs in preferred/nearby locations
        """
        # PLACEHOLDER: Since we don't have job location data,
        # we'll use a simple heuristic based on candidate location
        
        location_matches = 0
        total_count = len(individual)
        
        for candidate_id, job_id in individual:
            candidate_location = self.kg.nodes[candidate_id].get('location')
            job_category = self.kg.nodes[job_id].get('category')
            
            # Simple heuristic: if candidate has location info, give partial credit
            if candidate_location:
                location_matches += 0.5
            
            # Could add more sophisticated location matching here
        
        if total_count == 0:
            return 0.0
        
        location_score = location_matches / total_count
        return location_score
    
    def _crossover(self, ind1: creator.Individual, ind2: creator.Individual) -> Tuple:
        """
        Crossover operator for allocations
        Uses uniform crossover at job level
        """
        # Group allocations by job
        job_to_candidates1 = {}
        job_to_candidates2 = {}
        
        for cand, job in ind1:
            job_to_candidates1.setdefault(job, []).append(cand)
        
        for cand, job in ind2:
            job_to_candidates2.setdefault(job, []).append(cand)
        
        # Create offspring
        offspring1_allocs = []
        offspring2_allocs = []
        
        all_jobs = set(job_to_candidates1.keys()) | set(job_to_candidates2.keys())
        
        for job in all_jobs:
            if random.random() < 0.5:
                # Swap job allocations
                cands1 = job_to_candidates2.get(job, job_to_candidates1.get(job, []))
                cands2 = job_to_candidates1.get(job, job_to_candidates2.get(job, []))
            else:
                cands1 = job_to_candidates1.get(job, [])
                cands2 = job_to_candidates2.get(job, [])
            
            offspring1_allocs.extend([(c, job) for c in cands1])
            offspring2_allocs.extend([(c, job) for c in cands2])
        
        ind1[:] = offspring1_allocs
        ind2[:] = offspring2_allocs
        
        return ind1, ind2
    
    def _mutate(self, individual: creator.Individual) -> Tuple:
        """
        Mutation operator for allocations
        Randomly replaces some candidates
        """
        mutation_rate = self.genetic_config.mutation_prob
        
        for i, (candidate_id, job_id) in enumerate(individual):
            if random.random() < mutation_rate:
                # Get job category
                job_category = self.kg.nodes[job_id]['category']
                
                # Get qualified candidates
                qualified_candidates = [
                    n for n in self.candidate_nodes
                    if self.kg.nodes[n]['category'] == job_category
                ]
                
                # Select new candidate
                if qualified_candidates:
                    new_candidate = random.choice(qualified_candidates)
                    individual[i] = (new_candidate, job_id)
        
        return (individual,)
    
    def optimize(self) -> Tuple[List, List]:
        """
        Run NSGA-II optimization
        
        Returns:
            Tuple of (pareto_front, all_fitnesses)
        """
        print(f"\n{'='*60}")
        print("Running NSGA-II Multi-Objective Optimization")
        print(f"{'='*60}")
        print(f"Population size: {self.genetic_config.population_size}")
        print(f"Generations: {self.genetic_config.num_generations}")
        print(f"Jobs: {len(self.job_nodes)}")
        print(f"Candidates per job: {self.candidates_per_job}")
        print(f"Total allocations per solution: ~{len(self.job_nodes) * self.candidates_per_job}")
        
        # Create initial population
        population = self.toolbox.population(n=self.genetic_config.population_size)
        
        # Evaluate initial population
        fitnesses = list(map(self.toolbox.evaluate, population))
        for ind, fit in zip(population, fitnesses):
            ind.fitness.values = fit
        
        # Statistics
        stats = tools.Statistics(lambda ind: ind.fitness.values)
        stats.register("avg", np.mean, axis=0)
        stats.register("std", np.std, axis=0)
        stats.register("min", np.min, axis=0)
        stats.register("max", np.max, axis=0)
        
        # Run NSGA-II
        print(f"\nStarting evolution...")
        
        for gen in range(self.genetic_config.num_generations):
            # Select offspring
            offspring = tools.selTournamentDCD(population, len(population))
            offspring = [self.toolbox.clone(ind) for ind in offspring]
            
            # Apply crossover
            for i in range(0, len(offspring) - 1, 2):
                if random.random() < self.genetic_config.crossover_prob:
                    self.toolbox.mate(offspring[i], offspring[i+1])
                    del offspring[i].fitness.values
                    del offspring[i+1].fitness.values
            
            # Apply mutation
            for mutant in offspring:
                if random.random() < self.genetic_config.mutation_prob:
                    self.toolbox.mutate(mutant)
                    del mutant.fitness.values
            
            # Evaluate invalid individuals
            invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
            fitnesses = map(self.toolbox.evaluate, invalid_ind)
            for ind, fit in zip(invalid_ind, fitnesses):
                ind.fitness.values = fit
            
            # Select next generation
            population = self.toolbox.select(population + offspring, self.genetic_config.population_size)
            
            # Print progress
            if (gen + 1) % 10 == 0:
                record = stats.compile(population)
                print(f"  Generation {gen+1}/{self.genetic_config.num_generations}")
                print(f"    Avg fitness: {-record['avg']}") # Negate back for display
        
        # Extract Pareto front
        pareto_front = tools.sortNondominated(population, len(population), first_front_only=True)[0]
        
        print(f"\n{'='*60}")
        print(f"Optimization complete!")
        print(f"Pareto front size: {len(pareto_front)}")
        print(f"{'='*60}\n")
        
        return pareto_front, population
    
    def get_allocation_dict(self, individual: List) -> Dict[str, List[str]]:
        """Convert individual to allocation dictionary"""
        allocation_dict = {}
        
        for candidate_id, job_id in individual:
            if job_id not in allocation_dict:
                allocation_dict[job_id] = []
            allocation_dict[job_id].append(candidate_id)
        
        return allocation_dict


if __name__ == "__main__":
    print("Testing Genetic Optimizer...")
    print("Note: This requires a built Knowledge Graph")
    print("Run kg_builder.py first to create a test graph")

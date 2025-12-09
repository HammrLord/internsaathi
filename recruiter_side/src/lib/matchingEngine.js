/**
 * Matching Engine Logic for PM Recruit
 * Calculates a match score (0-100) based on weighted criteria.
 */

export const calculateMatchScore = (candidate, job, weights) => {
    let score = 0;
    let totalWeight = 0;

    // 1. Skills Match (Vector similarity simulation)
    const skillsScore = calculateSkillsMatch(candidate.skills, job.requiredSkills);
    score += skillsScore * (weights.skills / 100);
    totalWeight += weights.skills;

    // 2. Education Fit
    const educationScore = calculateEducationFit(candidate.education, job.minEducation);
    score += educationScore * (weights.education / 100);
    totalWeight += weights.education;

    // 3. AI Interview Score
    if (candidate.aiInterview && candidate.aiInterview.score) {
        score += candidate.aiInterview.score * (weights.interview / 100);
        totalWeight += weights.interview;
    }

    // 4. Location Proximity
    const locationScore = calculateLocationScore(candidate.location, job.location);
    score += locationScore * (weights.location / 100);
    totalWeight += weights.location;

    // Normalize if weights don't add up to 100 (fallback)
    if (totalWeight > 0) {
        return Math.round((score / totalWeight) * 100);
    }
    return 0;
};

// Helper: Simulate Skill Matching (Jaccard Index for now)
function calculateSkillsMatch(candidateSkills, jobSkills) {
    if (!candidateSkills || !jobSkills) return 0;
    const intersection = candidateSkills.filter(skill => jobSkills.includes(skill));
    return (intersection.length / jobSkills.length) * 100;
}

// Helper: Education Fit
function calculateEducationFit(candidateEdu, minEdu) {
    // Simplified logic
    const levels = { 'High School': 1, 'Diploma': 2, 'Graduate': 3 };
    const candLevel = levels[candidateEdu] || 1;
    const minLevel = levels[minEdu] || 1;

    if (candLevel >= minLevel) return 100;
    return 50; // Partial credit
}

// Helper: Location Score
function calculateLocationScore(candidateLoc, jobLoc) {
    if (!candidateLoc || !jobLoc) return 0;
    // Exact match or "Remote"
    if (candidateLoc.includes(jobLoc) || jobLoc === 'Remote') return 100;
    // Same country (assuming format "City, Country")
    if (candidateLoc.split(',')[1] === jobLoc.split(',')[1]) return 60;
    return 20;
}

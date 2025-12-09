/**
 * @file constants.js
 * @description Shared constants across all applications
 * @keywords constants, config, settings, enums, status
 * 
 * Search tags:
 * - status: application statuses, job statuses
 * - roles: user roles, permissions
 * - config: configuration values
 */

// @keywords: candidate-status, application-status, status-values
export const CANDIDATE_STATUS = {
    APPLIED: 'Applied',
    SHORTLISTED: 'Shortlisted',
    INTERVIEW: 'Interview',
    HIRED: 'Hired',
    REJECTED: 'Rejected',
    WAITLISTED: 'Waitlisted',
    WITHDRAWN: 'Withdrawn',
};

// @keywords: interview-rounds, round-names, stages
export const INTERVIEW_ROUNDS = {
    R1_SCREENING: 'R1: Screening',
    R2_TECHNICAL: 'R2: Technical',
    R3_FINAL: 'R3: Final',
    SELECTED: 'Selected',
};

// @keywords: user-roles, permissions, access-levels
export const USER_ROLES = {
    ADMIN: 'admin',
    RECRUITER: 'recruiter',
    STUDENT: 'student',
    VIEWER: 'viewer',
};

// @keywords: job-types, employment-types
export const JOB_TYPES = {
    INTERNSHIP: 'Internship',
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
};

// @keywords: locations, cities, regions, india
export const INDIAN_CITIES = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Noida', 'Gurgaon', 'Chandigarh', 'Kochi', 'Indore',
];

// @keywords: skills, technologies, competencies
export const SKILL_CATEGORIES = {
    TECHNICAL: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Java', 'AWS'],
    SOFT: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving'],
    TOOLS: ['Excel', 'Figma', 'Jira', 'Git', 'Docker', 'Tableau'],
};

// @keywords: match-score-thresholds, scoring, grades
export const MATCH_THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 75,
    AVERAGE: 60,
    LOW: 40,
};

// @keywords: pagination, limits, defaults
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};

// @keywords: api-endpoints, routes, urls
export const API_ROUTES = {
    // Recruiter routes
    JOBS: '/api/jobs',
    CANDIDATES: '/api/candidates',
    SCHEDULE: '/api/schedule',
    CHAT: '/api/chat',
    // Student routes
    RECOMMENDATIONS: '/api/student/recommendations',
    PROFILE: '/api/student/profile',
    APPLICATIONS: '/api/student/applications',
};

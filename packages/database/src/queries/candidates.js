/**
 * @file candidates.js
 * @description Database queries for candidates/applicants
 * @keywords candidates, applicants, students, applications, interns
 * 
 * Search tags:
 * - new: new application, new registration
 * - list: all candidates, applicant listing
 * - status: application status, shortlist, reject
 * - match: match score, allocation, ranking
 * - filter: search candidates, filter by criteria
 */

import { query } from '../index.js';

/**
 * Get all candidates for a job
 * @keywords: list-candidates, job-applicants, applications
 */
export const getCandidatesByJob = async (jobId, filters = {}) => {
    const { minMatch = 0, status = null, location = null, search = '' } = filters;

    let sql = `
        SELECT * FROM candidates 
        WHERE job_id = $1 
        AND match_score >= $2
    `;
    const params = [jobId, minMatch];
    let paramIndex = 3;

    if (status) {
        sql += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }

    if (location) {
        sql += ` AND location ILIKE $${paramIndex}`;
        params.push(`%${location}%`);
        paramIndex++;
    }

    if (search) {
        sql += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
    }

    // @keywords: sort-candidates, ranking, priority-order
    sql += ` ORDER BY 
        CASE 
            WHEN current_round = 'Selected' OR status = 'Hired' THEN 1
            WHEN current_round LIKE 'R3%' THEN 2
            WHEN current_round LIKE 'R2%' THEN 3
            WHEN current_round LIKE 'R1%' THEN 4
            WHEN status = 'Applied' THEN 5
            WHEN status = 'Waitlisted' THEN 6
            WHEN status = 'Rejected' THEN 7
            ELSE 5
        END ASC,
        match_score DESC
    `;

    return await query(sql, params);
};

/**
 * Get single candidate by ID
 * @keywords: candidate-details, single-candidate, profile
 */
export const getCandidateById = async (candidateId) => {
    return await query('SELECT * FROM candidates WHERE id = $1', [candidateId]);
};

/**
 * Get candidate by email
 * @keywords: find-by-email, lookup-candidate, student-profile
 */
export const getCandidateByEmail = async (email) => {
    return await query('SELECT * FROM candidates WHERE email = $1', [email]);
};

/**
 * Create new candidate application
 * @keywords: new-application, apply, register-candidate, new-registration
 */
export const createCandidate = async (candidateData) => {
    const {
        name, email, phone, job_id, skills, education,
        location, match_score, status = 'Applied'
    } = candidateData;

    const sql = `
        INSERT INTO candidates 
        (name, email, phone, job_id, skills, education, location, match_score, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING *
    `;
    return await query(sql, [name, email, phone, job_id, skills, education, location, match_score, status]);
};

/**
 * Update candidate status
 * @keywords: update-status, shortlist, reject, hire, next-round
 */
export const updateCandidateStatus = async (candidateId, status, currentRound = null) => {
    const sql = `
        UPDATE candidates 
        SET status = $2, 
            current_round = COALESCE($3, current_round),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
    `;
    return await query(sql, [candidateId, status, currentRound]);
};

/**
 * Bulk update candidate statuses
 * @keywords: bulk-update, mass-action, batch-status
 */
export const bulkUpdateStatus = async (candidateIds, status, currentRound = null) => {
    const sql = `
        UPDATE candidates 
        SET status = $2, 
            current_round = COALESCE($3, current_round),
            updated_at = NOW()
        WHERE id = ANY($1)
        RETURNING *
    `;
    return await query(sql, [candidateIds, status, currentRound]);
};

/**
 * Get candidates by match score range
 * @keywords: high-match, top-candidates, best-matches, allocation
 */
export const getTopCandidates = async (jobId, minScore = 80, limit = 50) => {
    const sql = `
        SELECT * FROM candidates 
        WHERE job_id = $1 AND match_score >= $2
        ORDER BY match_score DESC
        LIMIT $3
    `;
    return await query(sql, [jobId, minScore, limit]);
};

/**
 * Get candidate stats for dashboard
 * @keywords: stats, dashboard, analytics, metrics, count
 */
export const getCandidateStats = async (jobId = null) => {
    let sql = `
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'Applied') as applied,
            COUNT(*) FILTER (WHERE status = 'Shortlisted') as shortlisted,
            COUNT(*) FILTER (WHERE status = 'Hired') as hired,
            COUNT(*) FILTER (WHERE status = 'Rejected') as rejected,
            AVG(match_score)::numeric(5,2) as avg_match_score
        FROM candidates
    `;

    if (jobId) {
        sql += ` WHERE job_id = $1`;
        return await query(sql, [jobId]);
    }

    return await query(sql);
};

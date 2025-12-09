/**
 * @file jobs.js
 * @description Database queries for jobs/vacancies
 * @keywords jobs, vacancies, positions, openings, job-post, new-job
 * 
 * Search tags:
 * - new: create new job posting
 * - list: get all jobs listing
 * - update: modify job details
 * - delete: remove job posting
 * - search: find jobs by criteria
 */

import { query } from '../index.js';

/**
 * Get all active jobs
 * @keywords: list-jobs, all-jobs, active-jobs, job-listing
 */
export const getAllJobs = async () => {
    const sql = `
        SELECT * FROM jobs 
        WHERE is_active = true 
        ORDER BY created_at DESC
    `;
    return await query(sql);
};

/**
 * Get job by ID with application count
 * @keywords: job-details, single-job, job-by-id
 */
export const getJobById = async (jobId) => {
    const sql = `
        SELECT j.*, 
               COUNT(c.id) as application_count
        FROM jobs j
        LEFT JOIN candidates c ON j.id = c.job_id
        WHERE j.id = $1
        GROUP BY j.id
    `;
    return await query(sql, [jobId]);
};

/**
 * Create a new job posting
 * @keywords: new-job, create-job, add-job, post-vacancy
 */
export const createJob = async (jobData) => {
    const { title, company, location, description, requirements, salary_range } = jobData;
    const sql = `
        INSERT INTO jobs (title, company, location, description, requirements, salary_range, is_active, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
        RETURNING *
    `;
    return await query(sql, [title, company, location, description, requirements, salary_range]);
};

/**
 * Update job details
 * @keywords: update-job, edit-job, modify-job
 */
export const updateJob = async (jobId, updates) => {
    const { title, company, location, description, requirements, salary_range, is_active } = updates;
    const sql = `
        UPDATE jobs 
        SET title = COALESCE($2, title),
            company = COALESCE($3, company),
            location = COALESCE($4, location),
            description = COALESCE($5, description),
            requirements = COALESCE($6, requirements),
            salary_range = COALESCE($7, salary_range),
            is_active = COALESCE($8, is_active),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
    `;
    return await query(sql, [jobId, title, company, location, description, requirements, salary_range, is_active]);
};

/**
 * Delete a job (soft delete)
 * @keywords: delete-job, remove-job, close-job
 */
export const deleteJob = async (jobId) => {
    const sql = `UPDATE jobs SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`;
    return await query(sql, [jobId]);
};

/**
 * Search jobs by keyword
 * @keywords: search-jobs, find-jobs, filter-jobs
 */
export const searchJobs = async (keyword, location = null) => {
    let sql = `
        SELECT * FROM jobs 
        WHERE is_active = true 
        AND (title ILIKE $1 OR description ILIKE $1 OR company ILIKE $1)
    `;
    const params = [`%${keyword}%`];

    if (location) {
        sql += ` AND location ILIKE $2`;
        params.push(`%${location}%`);
    }

    sql += ` ORDER BY created_at DESC`;
    return await query(sql, params);
};

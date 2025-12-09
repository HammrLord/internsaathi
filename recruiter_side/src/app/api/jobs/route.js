/**
 * @file route.js (api/jobs)
 * @description API routes for job postings management
 * @keywords jobs, vacancies, positions, openings, new-job, job-post, listing
 * 
 * Search tags:
 * - new: create new job (POST)
 * - list: get all jobs (GET)
 * - job-post: posting new vacancy
 * - vacancy: job openings
 * - seeding: auto-populate jobs from mock data
 */
import { NextResponse } from 'next/server';
import { query } from "@/lib/db";
import initialJobs from '@/data/jobs';

export async function GET() {
    try {
        // 1. Fetch jobs from DB
        const result = await query('SELECT * FROM jobs ORDER BY id ASC');

        // 2. Sync with Mock Data (Upsert Strategy)
        // This ensures new dummy jobs are added even if DB is not empty
        // We will check by 'title' and 'location' to avoid duplicates, or just by ID if we could force ID (but serial ID makes that tricky).
        // Let's use simple logic: If total counts differ significantly, or just try to insert non-existing ones.
        // Actually, let's keep it simple: If DB has < 30 jobs, seed the rest.

        if (result.rows.length < initialJobs.length) {
            console.log("Seeding missing mock jobs...");
            const stringifiedTitles = result.rows.map(j => `${j.title}|${j.location}`);
            const jobsToAdd = initialJobs.filter(j => !stringifiedTitles.includes(`${j.title}|${j.location}`));

            for (const job of jobsToAdd) {
                await query(
                    `INSERT INTO jobs (title, location, type, status, description, applicants_count) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        job.title,
                        job.location,
                        job.type,
                        job.status || 'Active',
                        job.description,
                        job.applicants || 0
                    ]
                );
            }
            // Re-fetch to return full list
            const updatedResult = await query('SELECT * FROM jobs ORDER BY id ASC');
            return NextResponse.json(updatedResult.rows);
        }

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching/seeding jobs:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, location, type, description, company, skills, responsibilities, deadline } = body;

        // Ensure skills are an array (postgres array literal format or just array if using pg library parameterization which handles it)
        // pg library handles JS array -> Postgres array automatically in parameterized queries.

        const result = await query(
            `INSERT INTO jobs (
                title, location, type, description, status, applicants_count, 
                company, skills_required, responsibilities, deadline
            ) VALUES ($1, $2, $3, $4, $5, 0, $6, $7, $8, $9) RETURNING *`,
            [
                title,
                location,
                type,
                description || '',
                'Active',
                company || 'Your Startup', // Default if missing
                skills || [],              // Default empty array
                responsibilities || [],    // Default empty array
                deadline || null
            ]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

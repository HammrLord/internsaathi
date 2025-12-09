import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Hard Reset Recreate - timestamp 99999
export async function POST(request) {
    try {
        const body = await request.json();
        const { jobId, email, relocatable } = body;

        // 0. Check Application Limit (Max 6)
        const countRes = await query(
            `SELECT COUNT(DISTINCT job_id) as count 
             FROM candidates 
             WHERE email = $1 AND job_id IS NOT NULL`,
            [email]
        );
        const currentCount = parseInt(countRes.rows[0].count, 10);

        if (currentCount >= 6) {
            return NextResponse.json({ error: 'Application Limit Reached (Max 6)' }, { status: 403 });
        }

        // 1. Check Previous Application (Prevent Duplicate)
        const existing = await query(
            `SELECT id FROM candidates WHERE email = $1 AND job_id = $2`,
            [email, jobId]
        );
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Already applied to this job' }, { status: 409 });
        }

        // 2. Fetch Job Details
        const jobRes = await query('SELECT * FROM jobs WHERE id = $1', [jobId]);
        if (jobRes.rows.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }
        const job = jobRes.rows[0];

        // 3. Get Student Name
        const userRes = await query('SELECT name FROM users WHERE email = $1', [email]);
        const userName = userRes.rows.length > 0 ? userRes.rows[0].name : email.split('@')[0];

        // 4. Calculate Match Score
        const candRes = await query('SELECT skills FROM candidates WHERE email = $1 LIMIT 1', [email]);
        const userSkills = (candRes.rows.length > 0 && candRes.rows[0].skills) ? candRes.rows[0].skills : [];
        const matchScore = calculateMatchScore(userSkills, job.skills_required || []);

        // 5. Ensure relocatable column exists
        try {
            await query("ALTER TABLE candidates ADD COLUMN IF NOT EXISTS relocatable BOOLEAN DEFAULT false");
        } catch (e) {
            // Ignore
        }

        // 6. Insert Application
        await query(
            `INSERT INTO candidates (name, email, role, location, status, match_score, relocatable, job_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                userName,
                email,
                job.title,
                job.location,
                'Applied',
                matchScore,
                relocatable,
                jobId
            ]
        );

        // 7. Increment Job Applicants Count
        await query('UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = $1', [jobId]);

        return NextResponse.json({ message: 'Application submitted successfully' });

    } catch (e) {
        console.error("Apply Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}

function calculateMatchScore(candidateSkills, jobSkills) {
    if (!jobSkills || jobSkills.length === 0) return 0;
    if (!candidateSkills || candidateSkills.length === 0) return 10;

    const cSkills = candidateSkills.map(s => s.toLowerCase().trim());
    const jSkills = jobSkills.map(s => s.toLowerCase().trim());

    const matches = jSkills.filter(s => cSkills.includes(s));
    const percentage = Math.round((matches.length / jSkills.length) * 100);

    return Math.min(100, Math.max(10, percentage));
}

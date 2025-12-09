import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateMatchScore } from '@/lib/matchingEngine';

export async function POST(request, { params }) {
    try {
        const { id } = params;

        // Fetch candidate
        const candidateResult = await query('SELECT * FROM candidates WHERE id = $1', [id]);
        if (candidateResult.rows.length === 0) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }
        const candidate = candidateResult.rows[0];

        // Fetch job (mocking job ID 1 for now as context isn't fully clear on which job)
        // In real app, job ID would be passed in body or context
        const job = {
            requiredSkills: ['SQL', 'Product Strategy', 'Data Analysis'],
            minEducation: 'Graduate',
            location: 'Bangalore, India'
        };

        const weights = { skills: 40, education: 20, interview: 30, location: 10 };

        // Mocking candidate data structure to match engine expectation if DB columns differ
        const candidateData = {
            skills: candidate.skills || [], // Assuming skills column exists or is JSON
            education: candidate.education,
            location: candidate.location,
            aiInterview: { score: 85 } // Mock if not in DB
        };

        const newScore = calculateMatchScore(candidateData, job, weights);

        // Update DB
        await query('UPDATE candidates SET match_score = $1 WHERE id = $2', [newScore, id]);

        return NextResponse.json({ matchScore: newScore });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

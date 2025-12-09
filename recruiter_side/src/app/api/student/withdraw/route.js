import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { jobId, email } = body;

        if (!jobId || !email) {
            return NextResponse.json({ error: 'Job ID and Email required' }, { status: 400 });
        }

        // Update status to 'Withdrawn'
        const result = await query(
            `UPDATE candidates 
             SET status = 'Withdrawn' 
             WHERE job_id = $1 AND email = $2`,
            [jobId, email]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // Optional: Decrement job applicant count?
        // Usually we keep the count or have a separate 'active_applicants' count.
        // For simplicity, we won't decrement 'applicants_count' as it represents total interest,
        // or we SHOULD decrement if it represents active pool.
        // Let's decrement for accuracy in Recruiter Dashboard.
        await query('UPDATE jobs SET applicants_count = GREATEST(0, applicants_count - 1) WHERE id = $1', [jobId]);

        return NextResponse.json({ message: 'Application withdrawn successfully' });

    } catch (e) {
        console.error("In withdraw:", e);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

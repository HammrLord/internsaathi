import { NextResponse } from 'next/server';
import { query } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { topCount, waitlistCount, bufferHours, emailInclude } = await request.json();

        // 1. Update Job Settings
        await query(
            'UPDATE jobs SET auto_top_count = $1, auto_waitlist_count = $2, auto_buffer_hours = $3 WHERE id = $4',
            [topCount, waitlistCount, bufferHours, id]
        );

        // 2. Fetch Candidates ordered by match score (descending)
        const candidatesResult = await query(
            'SELECT * FROM candidates WHERE job_id = $1 ORDER BY match_score DESC',
            [id]
        );
        const candidates = candidatesResult.rows;

        const topCandidates = candidates.slice(0, topCount);
        const waitlistCandidates = candidates.slice(topCount, topCount + waitlistCount);

        // 3. Process Top Candidates (Send Email, Update Status)
        for (const candidate of topCandidates) {
            // Update Status to R1
            await query(
                `UPDATE candidates SET status = 'R1: Contacted', current_round = 'R1', last_contacted_at = NOW() WHERE id = $1`,
                [candidate.id]
            );

            // Send Custom Email
            if (emailInclude?.invite) {
                const subject = emailInclude.invite.subject;
                const body = emailInclude.invite.body.replace('{{candidate_name}}', candidate.name);
                console.log(`[Mock Email] To: ${candidate.email} | Subject: ${subject}`);
                console.log(`[Mock Email] Body: ${body}`);
            }
        }

        // 4. Process Waitlist Candidates
        let order = 1;
        for (const candidate of waitlistCandidates) {
            await query(
                `UPDATE candidates SET status = 'Waitlisted', waitlist_order = $1 WHERE id = $2`,
                [order++, candidate.id]
            );

            // Send Custom Waitlist Email
            if (emailInclude?.waitlist) {
                const subject = emailInclude.waitlist.subject;
                const body = emailInclude.waitlist.body.replace('{{candidate_name}}', candidate.name);
                console.log(`[Mock Email] To: ${candidate.email} | Subject: ${subject}`);
                console.log(`[Mock Email] Body: ${body}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${topCandidates.length} top candidates and ${waitlistCandidates.length} waitlisted candidates.`
        });

    } catch (error) {
        console.error("Error in automation:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

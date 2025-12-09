import { NextResponse } from 'next/server';
import { query } from "@/lib/db";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        const minMatch = searchParams.get('minMatch') || 0;
        const location = searchParams.get('location');
        const search = searchParams.get('search');

        let sql = `
            SELECT * FROM candidates 
            WHERE job_id = $1 
        `;
        const validParams = [parseInt(id, 10)]; // Ensure id is a number
        let paramIndex = 2;

        if (minMatch > 0) {
            sql += ` AND match_score >= $${paramIndex++}`;
            validParams.push(minMatch);
        }
        if (location) {
            sql += ` AND location ILIKE $${paramIndex++}`;
            validParams.push(`%${location}%`);
        }
        if (search) {
            sql += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
            paramIndex++;
            validParams.push(`%${search}%`);
        }

        // Custom Sort Order: 
        // 1. Hired/Selected
        // 2. R3: Interview
        // 3. R2: Pre-Interview
        // 4. R1: Contacted/Match
        // 5. Applied (Default)
        // 6. Waitlisted
        // 7. Rejected (Bottom)
        sql += `
         ORDER BY 
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
            match_score DESC`;

        const candidatesResult = await query(sql, validParams);

        // DEMO FIX: Boost scores for demo purposes
        // "change the percentage here from 0% to 79%"
        const candidates = candidatesResult.rows.map(c => ({
            ...c,
            match_score: c.match_score === 0 ? 79 : c.match_score
        }));

        return NextResponse.json(candidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

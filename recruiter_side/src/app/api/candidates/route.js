import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let sql = 'SELECT * FROM candidates';
        const params = [];

        if (status) {
            sql += ' WHERE status = $1';
            params.push(status);
        }

        sql += ' ORDER BY match_score DESC';

        const result = await query(sql, params);
        return NextResponse.json({ candidates: result.rows });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate body
        if (!body.name || !body.email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const sql = `
            INSERT INTO candidates (name, role, email, location, match_score, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const params = [
            body.name,
            body.role || 'Product Analyst Intern',
            body.email,
            body.location || 'Unknown',
            Math.floor(Math.random() * 100), // Mock score calculation for now
            'Applied'
        ];

        const result = await query(sql, params);
        return NextResponse.json({ candidate: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

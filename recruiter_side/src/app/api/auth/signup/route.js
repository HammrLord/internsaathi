import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Derive name from email if not provided (to satisfy NOT NULL constraint and user request)
        const dbName = name || email.split('@')[0];

        // Check if user exists
        const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with onboarding_completed = true
        const result = await query(
            'INSERT INTO users (name, email, password, role, onboarding_completed) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role',
            [dbName, email, hashedPassword, 'recruiter', true]
        );

        return NextResponse.json({ user: result.rows[0] }, { status: 201 });
    } catch (e) {
        console.error("Signup Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

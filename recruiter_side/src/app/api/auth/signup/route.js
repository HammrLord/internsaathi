import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import { checkContent } from '@/lib/gemini';
const disposableDomains = require('disposable-email-domains');

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Feature 6: Data Validation (Name)
        if (name && !/^[a-zA-Z\s'-]*$/.test(name)) {
            return NextResponse.json({
                error: 'Name cannot contain digits or special characters.'
            }, { status: 400 });
        }

        // Feature 3: Block Disposable Emails
        const domain = email.split('@')[1];
        if (disposableDomains.includes(domain)) {
            return NextResponse.json({
                error: 'Disposable email addresses are not allowed. Please use a permanent email address.'
            }, { status: 400 });
        }

        // Derive name from email if not provided (to satisfy NOT NULL constraint and user request)
        const dbName = name || email.split('@')[0];

        // Feature 4: Content Moderation
        const isSafe = await checkContent(dbName);

        if (!isSafe) {
            return NextResponse.json({
                error: 'The provided name contains inappropriate content. Please choose another name.'
            }, { status: 400 });
        }

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

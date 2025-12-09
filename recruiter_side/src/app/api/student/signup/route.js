import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import { checkContent } from '@/lib/gemini';
const disposableDomains = require('disposable-email-domains');

// Handle OPTIONS for CORS explicitly if needed (though next.config.mjs should handle it)
export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, skills, projects } = body;

        // Basic Validation
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Feature 6: Data Validation (Name)
        if (!/^[a-zA-Z\s'-]*$/.test(name)) {
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

        // Feature 4: Content Moderation
        const isSafe = await checkContent(name);
        if (!isSafe) {
            return NextResponse.json({
                error: 'The provided name contains inappropriate content. Please choose another name.'
            }, { status: 400 });
        }

        // 1. Check User Existence
        const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User (Role: Student)
        await query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
            [name, email, hashedPassword, 'student']
        );

        // 4. Create Candidate Profile (Skills & Projects)
        // Note: projects is mapped to 'summary' for now, or we can add a 'projects' column later.
        // For now using 'summary' field for projects description.
        await query(
            `INSERT INTO candidates (name, role, email, skills, summary, status, match_score) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                name,
                'Student Intern',
                email,
                skills || [], // Array of strings
                projects || '', // Text
                'Registered',
                0 // Initial score
            ]
        );

        return NextResponse.json({ message: 'Student registered successfully' }, { status: 201 });

    } catch (e) {
        console.error("Student Signup Error:", e);
        return NextResponse.json({ error: 'Internal Server Error: ' + e.message }, { status: 500 });
    }
}

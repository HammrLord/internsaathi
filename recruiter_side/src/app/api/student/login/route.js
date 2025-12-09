import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and Password required' }, { status: 400 });
        }

        const res = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (res.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = res.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Return user info on success
        return NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });

    } catch (e) {
        console.error("Login Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const result = await query('SELECT email, role FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            return NextResponse.json({ exists: true, role: result.rows[0].role });
        } else {
            return NextResponse.json({ exists: false });
        }
    } catch (error) {
        console.error('Check Email Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

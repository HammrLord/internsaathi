import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, recaptchaToken } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and Password required' }, { status: 400 });
        }

        const res = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (res.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = res.rows[0];

        // Check failed attempts
        if (user.failed_login_attempts >= 3) {
            if (!recaptchaToken) {
                return NextResponse.json({ error: 'RECAPTCHA_REQUIRED' }, { status: 403 });
            }

            // Verify Recaptcha
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            if (secretKey) {
                const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
                const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
                const recaptchaData = await recaptchaRes.json();

                if (!recaptchaData.success) {
                    return NextResponse.json({ error: 'RECAPTCHA_INVALID' }, { status: 403 });
                }
            }
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            // Increment failed attempts
            await query('UPDATE users SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1, last_failed_login = NOW() WHERE email = $1', [email]);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Reset failed attempts on success
        if (user.failed_login_attempts > 0) {
            await query('UPDATE users SET failed_login_attempts = 0, last_failed_login = NULL WHERE email = $1', [email]);
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

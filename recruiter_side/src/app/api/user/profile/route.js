import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { query } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { companyName, phone } = body;

        if (!companyName || !phone) {
            return NextResponse.json({ error: 'Company Name and Phone are required' }, { status: 400 });
        }

        const userId = session.user.id || (await getUserIdByEmail(session.user.email));

        await query(
            'UPDATE users SET company_name = $1, phone = $2, onboarding_completed = $3 WHERE id = $4',
            [companyName, phone, true, userId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function getUserIdByEmail(email) {
    const res = await query('SELECT id FROM users WHERE email = $1', [email]);
    return res.rows[0]?.id;
}

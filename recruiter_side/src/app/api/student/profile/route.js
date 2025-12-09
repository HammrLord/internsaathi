import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    try {
        // 1. Get Extended Profile (if exists)
        const extendedRes = await query(
            `SELECT * FROM student_profiles WHERE email = $1`,
            [email]
        );

        let profile = {};

        if (extendedRes.rows.length > 0) {
            profile = extendedRes.rows[0];
            // Format legacy fields if they don't match
            if (!profile.education) profile.education = '[]';
            if (!profile.experience) profile.experience = '[]';
            if (!profile.projects) profile.projects = '[]';
        } else {
            // Fallback to minimal data from candidates/users for legacy
            const legacyRes = await query(
                `SELECT u.name as full_name, u.email, c.skills, c.summary as projects, c.education_level 
                 FROM users u
                 LEFT JOIN candidates c ON u.email = c.email
                 WHERE u.email = $1
                 ORDER BY c.id ASC LIMIT 1`,
                [email]
            );
            if (legacyRes.rows.length > 0) {
                profile = {
                    ...legacyRes.rows[0],
                    education: '[]',
                    experience: '[]',
                    social_links: '{}',
                    projects: JSON.stringify([{ title: 'Summary', description: legacyRes.rows[0].projects || '', link: '' }])
                };
            }
        }

        // 2. Get Application Count
        // Count distinct job_ids applied to (excluding the initial signup record if it has no job_id)
        const countRes = await query(
            `SELECT COUNT(DISTINCT job_id) as count 
             FROM candidates 
             WHERE email = $1 AND job_id IS NOT NULL`,
            [email]
        );

        const applicationCount = parseInt(countRes.rows[0].count, 10);

        return NextResponse.json({
            profile,
            applicationCount,
            canApply: applicationCount < 6
        });

    } catch (e) {
        console.error("Profile API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            email,
            full_name,
            phone,
            address,
            dob,
            gender,
            skills,
            bio,
            projects,
            experience,
            education,
            education_level,
            social_links,
            resume_url,
            transcript_url,
            other_docs_url,
            preferences
        } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        // Upsert into student_profiles
        const sql = `
            INSERT INTO student_profiles (
                email, full_name, phone, address, dob, gender, 
                skills, bio, projects, experience, education, education_level, 
                social_links, resume_url, transcript_url, other_docs_url, 
                preferences, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
            ON CONFLICT (email) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                dob = EXCLUDED.dob,
                gender = EXCLUDED.gender,
                skills = EXCLUDED.skills,
                bio = EXCLUDED.bio,
                projects = EXCLUDED.projects,
                experience = EXCLUDED.experience,
                education = EXCLUDED.education,
                education_level = EXCLUDED.education_level,
                social_links = EXCLUDED.social_links,
                resume_url = EXCLUDED.resume_url,
                transcript_url = EXCLUDED.transcript_url,
                other_docs_url = EXCLUDED.other_docs_url,
                preferences = EXCLUDED.preferences,
                updated_at = NOW()
        `;

        await query(sql, [
            email,
            full_name || '',
            phone || '',
            address || '',
            dob || null,
            gender || '',
            skills || [],
            bio || '',
            JSON.stringify(projects || []),
            JSON.stringify(experience || []),
            JSON.stringify(education || []),
            education_level || '',
            JSON.stringify(social_links || {}),
            resume_url || '',
            transcript_url || '',
            other_docs_url || '',
            preferences || ''
        ]);

        return NextResponse.json({ message: 'Profile updated successfully' });

    } catch (e) {
        console.error("Profile Update Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

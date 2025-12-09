import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { query } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple matching algorithm
// Match Score = (Intersection of Skills / Job Required Skills) * 100
function calculateMatchScore(userSkills, jobSkills) {
    if (!jobSkills || jobSkills.length === 0) return 0;
    if (!userSkills || userSkills.length === 0) return 0;

    const intersection = jobSkills.filter(skill =>
        userSkills.some(uSkill => uSkill.toLowerCase() === skill.toLowerCase())
    );

    return Math.round((intersection.length / jobSkills.length) * 100);
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Default demo skills if no email or user found
    let userSkills = ['Product Strategy', 'Figma', 'SQL', 'Communication', 'React'];

    try {
        if (email) {
            const candidateRes = await query("SELECT skills FROM candidates WHERE email = $1", [email]);
            if (candidateRes.rows.length > 0 && candidateRes.rows[0].skills) {
                userSkills = candidateRes.rows[0].skills;
            }
        }

        // Fetch active jobs
        const jobsResult = await query("SELECT * FROM jobs WHERE status = 'Active'");
        const jobs = jobsResult.rows;

        // Calculate scores
        const recommendations = jobs.map(job => {
            let score = calculateMatchScore(userSkills, job.skills_required);

            // DEMO FIX: Ensure manual jobs (which might have few matching skills) get a high score as requested
            // "change the match percentage of the job of the extra jobs i enter around 67 68 and above"
            if (score < 67) {
                // Generate a random score between 67 and 89
                score = Math.floor(Math.random() * (89 - 67 + 1)) + 67;
            }

            return { ...job, match_score: score };
        });

        // Sort by match score
        recommendations.sort((a, b) => b.match_score - a.match_score);

        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import coursesData from '../../../../lib/courses_data';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const skillsParam = searchParams.get('skills');
    const searchParam = searchParams.get('search');

    try {
        let results = coursesData;

        // 1. Filter by Skills (if provided)
        if (skillsParam) {
            const userSkills = skillsParam.toLowerCase().split(',').map(s => s.trim());

            results = results.filter(course => {
                const titleMatch = userSkills.some(skill => course.title.toLowerCase().includes(skill));
                const disciplineMatch = userSkills.some(skill => course.discipline.toLowerCase().includes(skill));
                const tagMatch = userSkills.some(skill => course.tags.some(tag => tag.includes(skill) || skill.includes(tag)));

                return titleMatch || disciplineMatch || tagMatch;
            });

            // If strict filtering yields nothing, fallback to some recommendation logic or return empty 
            // but usually returning empty is fine so frontend can show "Try searching"
        }
        // 2. Filter by Search Query (if provided - overrides skills usually or refines them)
        else if (searchParam) {
            const query = searchParam.toLowerCase();
            results = results.filter(course =>
                course.title.toLowerCase().includes(query) ||
                (course.discipline && course.discipline.toLowerCase().includes(query)) ||
                (course.tags && course.tags.some(t => t.includes(query)))
            );
        }

        // 3. Limit results
        const finalCourses = results.slice(0, 20);

        return NextResponse.json({ courses: finalCourses });

    } catch (e) {
        console.error("Course API Error:", e);
        // Fallback
        return NextResponse.json({
            courses: coursesData.slice(0, 6),
            error: 'Failed to filter courses.'
        });
    }
}

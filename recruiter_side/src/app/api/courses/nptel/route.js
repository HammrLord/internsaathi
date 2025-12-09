import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        // Attempt to scrape NPTEL courses
        const response = await fetch('https://nptel.ac.in/courses', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch NPTEL: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let courses = [];

        // Try to find course cards or list items. 
        // Note: NPTEL structure varies. If SPA, this might be empty.
        // We look for common patterns.
        $('div.course-card, div.card, a.course-link').each((i, el) => {
            if (courses.length >= 50) return; // Limit to 50
            const title = $(el).find('h3, .title, .course-name').text().trim();
            const link = $(el).attr('href') || $(el).find('a').attr('href');
            const image = $(el).find('img').attr('src');

            if (title && link) {
                courses.push({
                    id: `nptel-${i}`,
                    title,
                    link: link.startsWith('http') ? link : `https://nptel.ac.in${link}`,
                    image: image ? (image.startsWith('http') ? image : `https://nptel.ac.in${image}`) : null,
                    source: 'NPTEL'
                });
            }
        });

        // Swayam Courses (Curated List)
        const swayamCourses = [
            { id: 'sw1', title: 'Digital Marketing - Swayam', link: 'https://swayam.gov.in/explorer?searchText=digital+marketing', discipline: 'Management', source: 'Swayam', image: 'https://storage.googleapis.com/swayam2_central/assets/img/swayam_images/logo_swayam.png' },
            { id: 'sw2', title: 'Animations - Swayam', link: 'https://swayam.gov.in/explorer?searchText=animation', discipline: 'Design', source: 'Swayam', image: 'https://storage.googleapis.com/swayam2_central/assets/img/swayam_images/logo_swayam.png' },
            { id: 'sw3', title: 'Cyber Security - Swayam', link: 'https://swayam.gov.in/explorer?searchText=cyber+security', discipline: 'Computer Science', source: 'Swayam', image: 'https://storage.googleapis.com/swayam2_central/assets/img/swayam_images/logo_swayam.png' },
            { id: 'sw4', title: 'Python for Data Science - Swayam', link: 'https://swayam.gov.in/explorer?searchText=python', discipline: 'Computer Science', source: 'Swayam', image: 'https://storage.googleapis.com/swayam2_central/assets/img/swayam_images/logo_swayam.png' },
            { id: 'sw5', title: 'Communication Skills - Swayam', link: 'https://swayam.gov.in/explorer?searchText=communication', discipline: 'Humanities', source: 'Swayam', image: 'https://storage.googleapis.com/swayam2_central/assets/img/swayam_images/logo_swayam.png' },
            { id: 'sw6', title: 'Graphic Design - Swayam', link: 'https://swayam.gov.in/explorer?searchText=graphic+design', discipline: 'Design', source: 'Swayam', image: 'https://storage.googleapis.com/swayam2_central/assets/img/swayam_images/logo_swayam.png' },
        ];

        // Fallback Data if scraping yields nothing (common for SPAs or if selector mismatch)
        if (courses.length === 0) {
            console.log("Scraping yielded 0 results, using fallback data.");
            courses = [
                { id: 'f1', title: 'Introduction to Machine Learning', link: 'https://nptel.ac.in/courses/106106139', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f2', title: 'Data Structures and Algorithms', link: 'https://nptel.ac.in/courses/106102064', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f3', title: 'Programming in Java', link: 'https://nptel.ac.in/courses/106105191', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f4', title: 'Introduction to Internet of Things', link: 'https://nptel.ac.in/courses/106105166', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f5', title: 'Cloud Computing', link: 'https://nptel.ac.in/courses/106105167', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f6', title: 'Artificial Intelligence', link: 'https://nptel.ac.in/courses/106102220', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f7', title: 'Blockchain and its Applications', link: 'https://nptel.ac.in/courses/106105184', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f8', title: 'Deep Learning', link: 'https://nptel.ac.in/courses/106106184', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f9', title: 'Software Engineering', link: 'https://nptel.ac.in/courses/106101061', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f10', title: 'Database Management System', link: 'https://nptel.ac.in/courses/106105175', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f11', title: 'Ethical Hacking', link: 'https://nptel.ac.in/courses/106105217', discipline: 'Computer Science', source: 'NPTEL' },
                { id: 'f12', title: 'Python for Data Science', link: 'https://nptel.ac.in/courses/106106212', discipline: 'Computer Science', source: 'NPTEL' }
            ];
        }

        // Combine NPTEL and Swayam
        courses = [...swayamCourses, ...courses];

        return NextResponse.json({ courses });

    } catch (e) {
        console.error("NPTEL Scraping Error:", e);
        // Return fallback even on error
        return NextResponse.json({
            courses: [
                { id: 'err1', title: 'Introduction to Machine Learning (Fallback)', link: 'https://nptel.ac.in/courses/106106139', source: 'NPTEL' }
            ],
            error: 'Scraping failed, showing limited results.'
        });
    }
}

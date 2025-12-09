const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'nikhiltalwar',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pm_recruit',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
});

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anika', 'Navya', 'Myra', 'Riya', 'Aaradhya'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Bhatia', 'Saxena', 'Mehta', 'Joshi', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Nair', 'Rao', 'Iyer', 'Menon', 'Chatterjee', 'Das', 'Roy', 'Chopra'];
const skillsList = ['Python', 'SQL', 'React', 'Node.js', 'Java', 'Data Analysis', 'Product Management', 'Figma', 'AWS', 'Docker'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSkills() {
    const count = Math.floor(Math.random() * 4) + 2; // 2 to 5 skills
    const shuffled = skillsList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function seedCandidates() {
    const client = await pool.connect();
    try {
        console.log('Fetching all jobs...');
        const jobsRes = await client.query('SELECT id FROM jobs');
        const jobs = jobsRes.rows;

        for (const job of jobs) {
            const jobId = job.id;
            console.log(`Seeding candidates for Job ID ${jobId}...`);

            // Clear existing candidates for this job
            await client.query('DELETE FROM candidates WHERE job_id = $1', [jobId]);

            // Random number of candidates between 50 and 150
            const candidateCount = Math.floor(Math.random() * 100) + 50;

            for (let i = 0; i < candidateCount; i++) {
                const firstName = getRandomElement(firstNames);
                const lastName = getRandomElement(lastNames);
                const name = `${firstName} ${lastName}`;
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${jobId}_${i}@example.com`;
                const phone = `+91 9${Math.floor(Math.random() * 1000000000)}`;
                // Varied match score: 40 to 99
                const score = Math.floor(Math.random() * 60) + 40;
                const exp = Math.floor(Math.random() * 4); // 0-3 years
                const skills = getRandomSkills();
                const location = Math.random() > 0.3 ? 'Bangalore' : getRandomElement(['Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Remote']);

                await client.query(
                    `INSERT INTO candidates (job_id, name, email, phone, match_score, years_of_experience, skills, location, status) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Applied')`,
                    [jobId, name, email, phone, score, exp, skills, location]
                );
            }

            // Update applicants count
            await client.query('UPDATE jobs SET applicants_count = $1 WHERE id = $2', [candidateCount, jobId]);
        }

        console.log('Seeding completed successfully for all jobs.');
    } catch (err) {
        console.error('Error seeding candidates:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seedCandidates();

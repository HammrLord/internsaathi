import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually load env vars
try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, '');
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
} catch (e) {
    console.warn("Could not load .env.local manually:", e);
}

import { query } from '../recruiter_side/src/lib/db.js';

async function debugQueries() {
    const email = 'kartik12e4@gmail.com'; // Use the email from user report

    console.log(`Debugging queries for email: ${email}`);

    try {
        console.log("1. Testing student_profiles query...");
        const extendedRes = await query(
            `SELECT * FROM student_profiles WHERE email = $1`,
            [email]
        );
        console.log(`   Success. Rows found: ${extendedRes.rows.length}`);
    } catch (e) {
        console.error("   FAILED student_profiles query:", e.message);
    }

    try {
        console.log("2. Testing candidate count query...");
        const countRes = await query(
            `SELECT COUNT(DISTINCT job_id) as count 
             FROM candidates 
             WHERE email = $1 AND job_id IS NOT NULL`,
            [email]
        );
        console.log(`   Success. Count: ${countRes.rows[0].count}`);
    } catch (e) {
        console.error("   FAILED candidate count query:", e.message);
    }

    // Test the legacy fallback query just in case
    try {
        console.log("3. Testing legacy fallback query...");
        const legacyRes = await query(
            `SELECT u.name as full_name, u.email, c.skills, c.summary as projects, c.education_level 
             FROM users u
             LEFT JOIN candidates c ON u.email = c.email
             WHERE u.email = $1
             ORDER BY c.id ASC LIMIT 1`,
            [email]
        );
        console.log(`   Success. Rows found: ${legacyRes.rows.length}`);
    } catch (e) {
        console.error("   FAILED legacy query:", e.message);
    }
}

debugQueries();

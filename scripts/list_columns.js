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

async function listColumns() {
    try {
        const res = await query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'candidates'
            ORDER BY ordinal_position;
        `);
        console.log("Columns in 'candidates' table:");
        res.rows.forEach(row => console.log(`- ${row.column_name}`));
    } catch (err) {
        console.error("Error listing columns:", err);
    }
}

listColumns();

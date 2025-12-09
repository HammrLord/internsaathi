const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pm_recruit',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false } // Needed for neon.tech usually
});

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'migrations_student_profile_expanded.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('Running migration...');
        await pool.query(sql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

runMigration();

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const isLocal = (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pm_recruit',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'migrations_student_profile_expanded.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log(`Connecting to ${process.env.DB_HOST}... (SSL: ${!isLocal})`);
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

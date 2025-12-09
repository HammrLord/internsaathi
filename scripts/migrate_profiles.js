const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables manually like in add_recruiter.js
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8').split('\n');
    envConfig.forEach(line => {
        if (line && line.indexOf('=') !== -1) {
            const [key, value] = line.split('=');
            process.env[key.trim()] = value.trim();
        }
    });
}

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pm_recruit',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false,
});

async function runMigration() {
    const client = await pool.connect();
    try {
        const sqlPath = path.join(__dirname, 'migrations_student_profile.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        await client.query(sql);
        console.log('Migration successful: student_profiles table created.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();

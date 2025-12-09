import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'nikhiltalwar',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pm_recruit',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function run() {
    const client = await pool.connect();
    try {
        console.log("Dropping unique constraint on candidates(email)...");
        await client.query('ALTER TABLE candidates DROP CONSTRAINT IF EXISTS candidates_email_key');
        console.log("Constraint dropped successfully.");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        client.release();
        pool.end();
    }
}

run();

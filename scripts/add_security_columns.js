
import pg from 'pg';

const { Pool } = pg;

// Fallback to default if env var is missing
const pool = new Pool({
    user: process.env.DB_USER || 'kartiksharma',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pm_recruit',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function runMigration() {
    try {
        console.log('Running migration: Add failed_login_attempts to users table...');

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check if column exists to avoid errors on re-run
            const checkCol = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='failed_login_attempts';
            `);

            if (checkCol.rows.length === 0) {
                await client.query(`
                    ALTER TABLE users 
                    ADD COLUMN failed_login_attempts INT DEFAULT 0,
                    ADD COLUMN last_failed_login TIMESTAMP;
                `);
                console.log('✅ Columns added successfully.');
            } else {
                console.log('ℹ️ Columns already exist. Skipping.');
            }

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await pool.end();
    }
}

runMigration();

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Load environment variables for local testing (optional)
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
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false,
});

async function seedAdmin() {
    const client = await pool.connect();
    try {
        console.log('Seeding admin user...');

        // Use environment variables for the admin credentials, or default fallback for safety
        const email = process.env.ADMIN_EMAIL || 'vedanshitalwar@gmail.com';
        const password = process.env.ADMIN_PASSWORD || 'Sukriti';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const checkRes = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkRes.rows.length > 0) {
            console.log(`User ${email} already exists. Updating password/role...`);
            await client.query(
                'UPDATE users SET password = $1, role = $2, name = $3 WHERE email = $4',
                [hashedPassword, 'admin', 'Admin User', email]
            );
        } else {
            console.log(`Creating new admin user: ${email}`);
            await client.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                [email, hashedPassword, 'Admin User', 'admin']
            );
        }

        console.log('Admin user seeded successfully.');
    } catch (err) {
        console.error('Error seeding admin user:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedAdmin();

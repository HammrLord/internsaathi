const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Load environment variables
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

async function addRecruiter() {
    const client = await pool.connect();
    try {
        const email = 'sukrititalwar@gmail.com';
        const passwordPlain = 'sukriti';
        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        console.log(`Adding user: ${email}`);

        // Check if user exists
        const checkRes = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkRes.rows.length > 0) {
            console.log(`User ${email} already exists. Updating password...`);
            await client.query(
                'UPDATE users SET password = $1, role = $2, name = $3 WHERE email = $4',
                [hashedPassword, 'recruiter', 'Sukriti Talwar', email]
            );
        } else {
            console.log(`Creating new user...`);
            await client.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                [email, hashedPassword, 'Sukriti Talwar', 'recruiter']
            );
        }

        console.log('User created/updated successfully.');
    } catch (err) {
        console.error('Error adding user:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

addRecruiter();

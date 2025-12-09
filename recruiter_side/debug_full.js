import fs from 'fs';
import path from 'path';
import pg from 'pg';
const { Pool } = pg;

// 1. Check ENV
console.log("--- Checking Environment ---");
let envVars = {};
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let val = parts.slice(1).join('=').trim();
                // Remove quotes if present
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.slice(1, -1);
                }
                envVars[key] = val;
            }
        });
        console.log("NEXTAUTH_SECRET present:", !!envVars['NEXTAUTH_SECRET']);
        console.log("NEXTAUTH_URL present:", !!envVars['NEXTAUTH_URL']);
        console.log("DB_USER present:", !!envVars['DB_USER']);
    } else {
        console.log("❌ .env.local not found");
    }
} catch (e) { console.error("Error reading .env.local:", e.message); }

// 2. Check DB
console.log("\n--- Checking Database ---");
const pool = new Pool({
    user: envVars.DB_USER || 'kartiksharma',
    host: envVars.DB_HOST || 'localhost',
    database: envVars.DB_NAME || 'pm_recruit',
    password: envVars.DB_PASSWORD || '',
    port: parseInt(envVars.DB_PORT || '5432'),
    connectionTimeoutMillis: 2000,
});

(async () => {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        console.log("✅ Database Connection Successful:", res.rows[0].now);
        client.release();
    } catch (e) {
        console.error("❌ Database Connection Failed:", e.message);
        if (e.message.includes('auth')) {
            console.log("Hint: Check DB_PASSWORD in .env.local");
        }
    }
    await pool.end();
})();

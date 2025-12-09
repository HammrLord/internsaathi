/**
 * @file db.js
 * @description PostgreSQL database connection for PM Internship Platform
 * @keywords database, connection, pool, postgres, shared, db
 * 
 * Search tags:
 * - database: main database connection
 * - pool: connection pooling
 * - query: execute SQL queries
 * - transaction: database transactions
 */

import { Pool } from 'pg';

// @keywords: database-config, environment, connection-string
const pool = new Pool({
    user: process.env.DB_USER || 'kartiksharma',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pm_recruit',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    // @keywords: pool-config, max-connections
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Log connection status
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL pool error:', err.message);
});

/**
 * Execute a database query
 * @keywords: query, execute, sql, select, insert, update, delete
 */
export const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

/**
 * Get a client from the pool for transactions
 * @keywords: transaction, client, begin, commit, rollback
 */
export const getClient = async () => {
    const client = await pool.connect();
    const originalQuery = client.query;
    const release = client.release;

    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
    }, 5000);

    client.query = (...args) => {
        client.lastQuery = args;
        return originalQuery.apply(client, args);
    };

    client.release = () => {
        clearTimeout(timeout);
        client.query = originalQuery;
        client.release = release;
        return release.apply(client);
    };

    return client;
};

/**
 * Check database health
 * @keywords: health, ping, status, connection-test
 */
export const healthCheck = async () => {
    try {
        const res = await query('SELECT NOW()');
        return { status: 'healthy', timestamp: res.rows[0].now };
    } catch (error) {
        return { status: 'unhealthy', error: error.message };
    }
};

export default pool;

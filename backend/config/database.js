const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nkwapay',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  connectionTimeoutMillis: 5000, // Add timeout
});

// Add connection test
pool.on('connect', () => console.log('Connected to PostgreSQL'));
pool.on('error', (err) => console.error('PostgreSQL error:', err));

module.exports = { pool, query: (text, params) => pool.query(text, params) };

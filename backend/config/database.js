const { Pool } = require('pg');
require('dotenv').config();

// Configuration for Render PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Uses Render's connection string
  ssl: {
    rejectUnauthorized: false // Required for Render's PostgreSQL
  },
  max: 15, // Maximum number of connections in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 5000 // Timeout for new connections
});

// Enhanced connection logging
pool.on('connect', (client) => {
  console.log(`[${new Date().toISOString()}] Connected to Render PostgreSQL`);
});

pool.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] PostgreSQL error:`, err.stack);
  process.exit(-1); // Restart on critical errors 
});

// Test connection immediately
(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection test successful');
  } catch (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }
})();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  
  // Helper for transactions
  async transaction(queries) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const results = [];
      for (const { text, values } of queries) {
        results.push(await client.query(text, values));
      }
      await client.query('COMMIT');
      return results;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};

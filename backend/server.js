const app = require('./app');
const { pool } = require('./config/database');
const logger = require('./utils/logger'); // Updated import

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

pool.query('SELECT NOW()', (err) => {
  if (err) {
    logger.error('Database connection error:', err.message); // Using logger properly
    process.exit(1);
  } else {
    app.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`); // This will now work
      logger.info(`API documentation available at http://${HOST}:${PORT}/api-docs`);
    });
  }
});

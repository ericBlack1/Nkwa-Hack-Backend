/**
 * Error handler middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);

  // Determine the status code (default to 500 if not set)
  const statusCode = err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  // If this is a validation error, include validation details
  if (err.name === 'ValidationError') {
    errorResponse.error.details = err.errors;
    errorResponse.error.message = 'Validation failed';
  }

  // If this is a database error
  if (err.name === 'SequelizeDatabaseError' || err.name === 'MongoError') {
    errorResponse.error.message = 'Database operation failed';
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

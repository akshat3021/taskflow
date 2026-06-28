'use strict';

/**
 * Custom error class that extends the native Error.
 * Using a dedicated error class (not generic Error) gives us:
 *  - Structured HTTP status codes
 *  - Consistent error shapes for the global error handler
 *  - Stack traces in development
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors; // Validation errors array
    this.isOperational = true; // Distinguishes from programmer errors

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common errors — improves readability at call sites
  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static internalServer(message = 'Internal server error') {
    return new ApiError(500, message);
  }

  static unprocessable(message, errors = []) {
    return new ApiError(422, message, errors);
  }
}

module.exports = ApiError;

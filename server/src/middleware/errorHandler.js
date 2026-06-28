'use strict';

const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

/**
 * Global error handling middleware.
 * This is the single place where ALL errors are processed and formatted.
 *
 * Error flow:
 *   catchAsync → next(error) → errorHandler → JSON response
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log in development for full stack traces
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    });
  }

  // Mongoose: Invalid ObjectId (malformed _id)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    error = ApiError.badRequest(`Invalid ID format: ${err.value}`);
  }

  // Mongoose: Duplicate key violation
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.badRequest(`Duplicate value for ${field}`);
  }

  // Mongoose: Schema validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.unprocessable('Validation failed', errors);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;

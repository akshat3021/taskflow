'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Catches all requests to undefined routes.
 * Must be registered AFTER all valid routes.
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;

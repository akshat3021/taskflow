'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Middleware factory that validates req.body against a Joi schema.
 * Returns a 422 with field-level errors if validation fails.
 *
 * Usage:
 *   router.post('/', validateRequest(schemas.createTask), controller.create);
 *
 * @param {import('joi').ObjectSchema} schema - Joi validation schema
 * @param {'body' | 'query' | 'params'} source - Where to validate (default: body)
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,      // Return ALL errors, not just the first
      stripUnknown: true,     // Remove unknown fields (security)
      convert: true,          // Type coercion (string '2024-01-01' → Date)
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));
      return next(ApiError.unprocessable('Validation failed', errors));
    }

    // Replace req[source] with the sanitized, validated value
    req[source] = value;
    next();
  };
};

module.exports = validateRequest;

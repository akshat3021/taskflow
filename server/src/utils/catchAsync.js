'use strict';

/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Instead of try/catch in every controller, we catch here and call next(error).
 * This keeps controllers clean and readable.
 *
 * Usage:
 *   router.get('/tasks', catchAsync(taskController.getAllTasks));
 *
 * @param {Function} fn - Async route handler
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;

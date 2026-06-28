'use strict';

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const validateRequest = require('../middleware/validateRequest');
const taskValidation = require('../validation/task.validation');

/**
 * Task Routes — /api/v1/tasks
 *
 * IMPORTANT: /stats must come BEFORE /:id
 * Otherwise Express will interpret 'stats' as an ObjectId param.
 */

// Stats (must be before /:id)
router.get('/stats', taskController.getTaskStats);

// Collection routes
router
  .route('/')
  .get(validateRequest(taskValidation.queryTasks, 'query'), taskController.getAllTasks)
  .post(validateRequest(taskValidation.createTask), taskController.createTask);

// Document routes
router
  .route('/:id')
  .get(taskController.getTaskById)
  .put(validateRequest(taskValidation.updateTask), taskController.updateTask)
  .delete(taskController.deleteTask);

// Partial update: status only
router.patch(
  '/:id/status',
  validateRequest(taskValidation.updateStatus),
  taskController.updateTaskStatus
);

module.exports = router;

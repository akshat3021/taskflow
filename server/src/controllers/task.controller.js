'use strict';

const Task = require('../models/Task.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Task Controller
 *
 * Each method handles one specific responsibility.
 * No business logic leaks into routes.
 * No direct res.json() outside of ApiResponse to keep consistency.
 */

/**
 * GET /api/v1/tasks
 * Supports: search, status filter, priority filter, sort, pagination
 */
const getAllTasks = catchAsync(async (req, res) => {
  const {
    search,
    status,
    priority,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 20,
  } = req.query;

  // Build filter object dynamically — only add fields that were requested
  const filter = {};

  if (search && search.trim()) {
    // Use MongoDB text search when search term is present
    filter.$text = { $search: search.trim() };
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (priority && priority !== 'all') {
    filter.priority = priority;
  }

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort: if text search, include textScore relevance sorting
  const sortOptions = {};
  if (search && search.trim()) {
    sortOptions.score = { $meta: 'textScore' };
  }
  sortOptions[sortBy] = order === 'asc' ? 1 : -1;

  // Projection for text score (only needed during text search)
  const projection = search && search.trim()
    ? { score: { $meta: 'textScore' } }
    : {};

  // Run count and data query in parallel for performance
  const [tasks, total] = await Promise.all([
    Task.find(filter, projection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum),
    Task.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return new ApiResponse(200, {
    tasks,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  }, 'Tasks retrieved successfully').send(res);
});

/**
 * GET /api/v1/tasks/stats
 * Returns aggregate counts by status for the dashboard stats bar.
 * Must be registered BEFORE /:id routes to avoid 'stats' being treated as an ID.
 */
const getTaskStats = catchAsync(async (req, res) => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Transform array into a usable object
  const result = {
    total: 0,
    todo: 0,
    'in-progress': 0,
    completed: 0,
  };

  stats.forEach(({ _id, count }) => {
    result[_id] = count;
    result.total += count;
  });

  // Count overdue tasks
  const overdueCount = await Task.countDocuments({
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' },
  });

  result.overdue = overdueCount;

  return new ApiResponse(200, result, 'Stats retrieved successfully').send(res);
});

/**
 * GET /api/v1/tasks/:id
 */
const getTaskById = catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound(`Task with ID ${req.params.id} not found`);
  }

  return new ApiResponse(200, { task }, 'Task retrieved successfully').send(res);
});

/**
 * POST /api/v1/tasks
 */
const createTask = catchAsync(async (req, res) => {
  const task = await Task.create(req.body);

  // Use document to trigger toJSON transformation
  const created = await Task.findById(task._id);

  return new ApiResponse(201, { task: created }, 'Task created successfully').send(res);
});

/**
 * PUT /api/v1/tasks/:id
 * Full update — replaces all updatable fields.
 */
const updateTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    {
      new: true,           // Return the updated document
      runValidators: true, // Run schema validators on update
    }
  );

  if (!task) {
    throw ApiError.notFound(`Task with ID ${req.params.id} not found`);
  }

  return new ApiResponse(200, { task }, 'Task updated successfully').send(res);
});

/**
 * PATCH /api/v1/tasks/:id/status
 * Lightweight endpoint for quick status toggle from kanban/card.
 */
const updateTaskStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw ApiError.notFound(`Task with ID ${req.params.id} not found`);
  }

  return new ApiResponse(200, { task }, `Task status updated to ${status}`).send(res);
});

/**
 * DELETE /api/v1/tasks/:id
 */
const deleteTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw ApiError.notFound(`Task with ID ${req.params.id} not found`);
  }

  return new ApiResponse(200, { id: req.params.id }, 'Task deleted successfully').send(res);
});

module.exports = {
  getAllTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};

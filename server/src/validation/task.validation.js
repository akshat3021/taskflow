'use strict';

const Joi = require('joi');

const STATUSES = ['todo', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];
const SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
const ORDERS = ['asc', 'desc'];

/**
 * Validation schemas for Task routes.
 * Using Joi here keeps validation logic out of controllers.
 */
const taskValidation = {
  createTask: Joi.object({
    title: Joi.string().min(3).max(100).trim().required().messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().max(500).trim().allow('', null).optional(),
    status: Joi.string()
      .valid(...STATUSES)
      .default('todo')
      .messages({
        'any.only': `Status must be one of: ${STATUSES.join(', ')}`,
      }),
    priority: Joi.string()
      .valid(...PRIORITIES)
      .default('medium')
      .messages({
        'any.only': `Priority must be one of: ${PRIORITIES.join(', ')}`,
      }),
    dueDate: Joi.date().iso().greater('now').allow(null).optional().messages({
      'date.greater': 'Due date must be in the future',
      'date.format': 'Due date must be a valid ISO date',
    }),
    tags: Joi.array()
      .items(Joi.string().trim().lowercase().max(30))
      .max(10)
      .default([])
      .messages({
        'array.max': 'Cannot have more than 10 tags',
      }),
  }),

  updateTask: Joi.object({
    title: Joi.string().min(3).max(100).trim().messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 100 characters',
    }),
    description: Joi.string().max(500).trim().allow('', null).optional(),
    status: Joi.string()
      .valid(...STATUSES)
      .messages({
        'any.only': `Status must be one of: ${STATUSES.join(', ')}`,
      }),
    priority: Joi.string()
      .valid(...PRIORITIES)
      .messages({
        'any.only': `Priority must be one of: ${PRIORITIES.join(', ')}`,
      }),
    dueDate: Joi.date().iso().allow(null).optional().messages({
      'date.format': 'Due date must be a valid ISO date',
    }),
    tags: Joi.array()
      .items(Joi.string().trim().lowercase().max(30))
      .max(10)
      .messages({
        'array.max': 'Cannot have more than 10 tags',
      }),
  }).min(1).messages({
    'object.min': 'At least one field is required for update',
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(...STATUSES)
      .required()
      .messages({
        'any.only': `Status must be one of: ${STATUSES.join(', ')}`,
        'any.required': 'Status is required',
      }),
  }),

  queryTasks: Joi.object({
    search: Joi.string().trim().max(100).allow('').optional(),
    status: Joi.string().valid(...STATUSES, 'all').allow('', 'all').optional(),
    priority: Joi.string().valid(...PRIORITIES, 'all').allow('', 'all').optional(),
    sortBy: Joi.string().valid(...SORT_FIELDS).default('createdAt'),
    order: Joi.string().valid(...ORDERS).default('desc'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

module.exports = taskValidation;

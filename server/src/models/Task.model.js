'use strict';

const mongoose = require('mongoose');

/**
 * Task Schema
 *
 * Design decisions:
 * - Indexes on status, priority, dueDate for filtered queries
 * - Text index on title + description for full-text search
 * - timestamps: true auto-manages createdAt/updatedAt
 * - tags stored as lowercase strings (normalized at validation layer)
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'completed'],
        message: 'Status must be todo, in-progress, or completed',
      },
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
  },
  {
    timestamps: true,  // Adds createdAt and updatedAt automatically
    versionKey: false, // Remove __v from documents
    toJSON: {
      // Clean up _id → id transformation for frontend consistency
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// Compound text index for full-text search across title and description
taskSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 10, description: 5 }, name: 'task_text_index' }
);

// Compound index for the most common filter combination
taskSchema.index({ status: 1, priority: 1, createdAt: -1 });

/**
 * Virtual: isOverdue
 * True when task is not completed and dueDate has passed.
 */
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

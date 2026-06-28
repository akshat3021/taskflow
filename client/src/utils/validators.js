/**
 * Client-side validation rules.
 * These mirror the backend Joi schemas to provide instant feedback.
 * The backend is always the source of truth — this is just UX.
 */

export const taskValidators = {
  title: (value) => {
    if (!value || !value.trim()) return 'Title is required';
    if (value.trim().length < 3) return 'Title must be at least 3 characters';
    if (value.trim().length > 100) return 'Title cannot exceed 100 characters';
    return null;
  },

  description: (value) => {
    if (value && value.length > 500) return 'Description cannot exceed 500 characters';
    return null;
  },

  dueDate: (value) => {
    if (!value) return null; // Optional field
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    // Allow editing existing tasks with past due dates
    return null;
  },

  tags: (value) => {
    if (!value) return null;
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
    if (tags.length > 10) return 'Cannot have more than 10 tags';
    if (tags.some((t) => t.length > 30)) return 'Each tag cannot exceed 30 characters';
    return null;
  },
};

/**
 * Validates an entire task form object.
 * Returns an object of { field: errorMessage } pairs.
 * Empty object means no errors.
 */
export const validateTaskForm = (formData) => {
  const errors = {};

  Object.keys(taskValidators).forEach((field) => {
    const error = taskValidators[field](formData[field]);
    if (error) errors[field] = error;
  });

  return errors;
};

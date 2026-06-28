import { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../../context/TaskContext';
import { validateTaskForm } from '../../utils/validators';
import { toDateInputValue } from '../../utils/formatters';
import {
  FILTER_STATUS_OPTIONS,
  FILTER_PRIORITY_OPTIONS,
} from '../../utils/constants';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import './TaskForm.css';

/**
 * TaskForm — Used for both Create and Edit operations.
 *
 * Controlled inputs with real-time field-level validation.
 * Submits only changed fields on edit (partial update).
 * Maps server validation errors back to field-level display.
 */
const TaskForm = ({ task = null, onSuccess }) => {
  const { createTask, updateTask } = useTasks();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? toDateInputValue(task.dueDate) : '',
        tags: task.tags ? task.tags.join(', ') : '',
      });
    }
  }, [task]);

  // Real-time validation on touched fields
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = validateTaskForm(formData);
      // Only show errors for touched fields
      const touchedErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([key]) => touched[key])
      );
      setErrors(touchedErrors);
    }
  }, [formData, touched]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submit
    const allErrors = validateTaskForm(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched({ title: true, description: true, dueDate: true, tags: true });
      return;
    }

    setSubmitting(true);

    // Build payload — parse tags string into array
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : [],
    };

    try {
      let result;
      if (isEditing) {
        result = await updateTask(task.id, payload);
      } else {
        result = await createTask(payload);
      }

      if (result.success) {
        onSuccess?.();
      } else if (result.errors) {
        // Map server field errors back to the form
        const serverErrors = {};
        result.errors.forEach(({ field, message }) => {
          serverErrors[field] = message;
        });
        setErrors(serverErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = FILTER_STATUS_OPTIONS.filter((o) => o.value !== 'all');
  const priorityOptions = FILTER_PRIORITY_OPTIONS.filter((o) => o.value !== 'all');

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__grid">
        {/* Title */}
        <div className="task-form__full">
          <Input
            id="task-title"
            label="Title"
            type="text"
            placeholder="e.g. Design landing page mockup"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            error={errors.title}
            required
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div className="task-form__full">
          <div className="input-group">
            <label htmlFor="task-description" className="input-label">
              Description{' '}
              <span className="task-form__optional">(optional)</span>
            </label>
            <textarea
              id="task-description"
              className={`input-field ${errors.description ? 'input-field--error' : ''}`}
              placeholder="Add more details about this task..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              maxLength={500}
              rows={3}
            />
            <div className="task-form__char-count">
              <span className={formData.description.length > 450 ? 'task-form__char-count--warn' : ''}>
                {formData.description.length}/500
              </span>
            </div>
            {errors.description && (
              <p className="input-error" role="alert">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <Select
          id="task-status"
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          error={errors.status}
        />

        {/* Priority */}
        <Select
          id="task-priority"
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={priorityOptions}
          error={errors.priority}
        />

        {/* Due Date */}
        <Input
          id="task-due-date"
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          onBlur={() => handleBlur('dueDate')}
          error={errors.dueDate}
          hint="Optional"
        />

        {/* Tags */}
        <Input
          id="task-tags"
          label="Tags"
          type="text"
          placeholder="design, frontend, api"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          onBlur={() => handleBlur('tags')}
          error={errors.tags}
          hint="Separate with commas, max 10 tags"
        />
      </div>

      {/* Actions */}
      <div className="task-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={submitting}
          fullWidth
        >
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;

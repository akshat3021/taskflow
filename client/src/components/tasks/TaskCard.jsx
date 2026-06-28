import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDueDate, isOverdue, truncate } from '../../utils/formatters';
import { formatRelative } from '../../utils/formatters';
import { TASK_STATUSES } from '../../utils/constants';
import './TaskCard.css';

/**
 * TaskCard — Displays a single task with all actions.
 *
 * Features:
 * - Status cycle on checkbox click (optimistic update)
 * - Edit/Delete with confirmation
 * - Overdue visual indicator
 * - Tag display
 * - Hover reveal for actions
 */
const TaskCard = ({ task, onEdit }) => {
  const { updateTaskStatus, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const overdue = isOverdue(task.dueDate, task.status);

  // Cycle: todo → in-progress → completed → todo
  const getNextStatus = (current) => {
    const cycle = [TASK_STATUSES.TODO, TASK_STATUSES.IN_PROGRESS, TASK_STATUSES.COMPLETED];
    const idx = cycle.indexOf(current);
    return cycle[(idx + 1) % cycle.length];
  };

  const handleStatusCycle = () => {
    updateTaskStatus(task.id, getNextStatus(task.status));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask(task.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <article
      className={`task-card ${task.status === 'completed' ? 'task-card--completed' : ''} ${overdue ? 'task-card--overdue' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Status Checkbox */}
      <button
        className={`task-card__checkbox task-card__checkbox--${task.status}`}
        onClick={handleStatusCycle}
        aria-label={`Status: ${task.status}. Click to advance status`}
        title={`Click to move to ${getNextStatus(task.status).replace('-', ' ')}`}
      >
        {task.status === 'completed' && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {task.status === 'in-progress' && (
          <div className="task-card__checkbox-ring" aria-hidden="true" />
        )}
      </button>

      {/* Content */}
      <div className="task-card__content">
        <div className="task-card__header">
          <h3 className={`task-card__title ${task.status === 'completed' ? 'task-card__title--done' : ''}`}>
            {task.title}
          </h3>

          {/* Action buttons — shown on hover */}
          <div className="task-card__actions">
            <button
              className="task-card__action-btn"
              onClick={() => onEdit(task)}
              aria-label={`Edit task: ${task.title}`}
              title="Edit task"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9.5 1.5l3 3-8 8H1.5v-3l8-8z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="task-card__action-btn task-card__action-btn--danger"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label={`Delete task: ${task.title}`}
              title="Delete task"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 3.5h12M4.5 3.5V2h5v1.5M5.5 6v5M8.5 6v5M2.5 3.5l.5 8.5h8l.5-8.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {task.description && (
          <p className="task-card__description">
            {truncate(task.description, 120)}
          </p>
        )}

        {/* Meta Row */}
        <div className="task-card__meta">
          <Badge variant="status" value={task.status} />
          <Badge variant="priority" value={task.priority} />

          {task.dueDate && (
            <span className={`task-card__due ${overdue ? 'task-card__due--overdue' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.25"/>
                <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
              {overdue ? 'Overdue · ' : ''}{formatDueDate(task.dueDate)}
            </span>
          )}

          <span className="task-card__time" title={new Date(task.createdAt).toLocaleString()}>
            {formatRelative(task.createdAt)}
          </span>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="task-card__tags" aria-label="Tags">
            {task.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="task-card__tag">#{tag}</span>
            ))}
            {task.tags.length > 4 && (
              <span className="task-card__tag task-card__tag--more">
                +{task.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="task-card__confirm-overlay">
          <div className="task-card__confirm">
            <p className="task-card__confirm-text">Delete this task?</p>
            <div className="task-card__confirm-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={isDeleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default TaskCard;

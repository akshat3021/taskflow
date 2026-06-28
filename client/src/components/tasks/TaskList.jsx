import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Modal from '../common/Modal';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import './TaskList.css';

/**
 * TaskList — Renders the task grid with all states:
 * - Loading: skeleton cards
 * - Error: error empty state
 * - Empty (no tasks): create prompt
 * - Empty (filtered): search/filter empty state
 * - Data: task cards
 */
const TaskList = () => {
  const { tasks, loading, error, filters, clearFilters, fetchTasks } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  const isFiltered =
    filters.search ||
    (filters.status && filters.status !== 'all') ||
    (filters.priority && filters.priority !== 'all');

  const handleEditClose = () => setEditingTask(null);

  const handleEditSuccess = () => {
    setEditingTask(null);
  };

  // ── Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="task-list">
        <Skeleton variant="card" count={6} className="task-list__skeleton" />
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────
  if (error) {
    return (
      <EmptyState
        type="error"
        onAction={() => fetchTasks()}
      />
    );
  }

  // ── Empty State ────────────────────────────────────────────
  if (tasks.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          type="search"
          searchTerm={filters.search}
          onAction={clearFilters}
        />
      );
    }
    return <EmptyState type="tasks" />;
  }

  // ── Task Grid ──────────────────────────────────────────────
  return (
    <>
      <div className="task-list" role="list" aria-label="Task list">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            role="listitem"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <TaskCard
              task={task}
              onEdit={setEditingTask}
            />
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={handleEditClose}
        title="Edit Task"
        size="md"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </>
  );
};

export default TaskList;

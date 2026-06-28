import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { TaskProvider } from './context/TaskContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/common/ToastContainer';
import Header from './components/layout/Header';
import TaskStats from './components/tasks/TaskStats';
import TaskFilters from './components/tasks/TaskFilters';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import Modal from './components/common/Modal';
import Button from './components/common/Button';
import './styles/index.css';
import './styles/animations.css';
import './App.css';

/**
 * App — Root component.
 *
 * Provider order: ErrorBoundary → ToastProvider → TaskProvider → UI
 * This ensures toasts can be shown by any component including error states.
 */
const AppContent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Header onNewTask={() => setShowCreateModal(true)} />

      <main className="app-main">
        <div className="app-container">

          {/* Stats Dashboard */}
          <section className="app-section" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Task Statistics</h2>
            <TaskStats />
          </section>

          {/* Controls Row */}
          <section className="app-toolbar" aria-label="Task controls">
            <TaskFilters />
            <Button
              id="new-task-mobile-btn"
              variant="primary"
              size="md"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              onClick={() => setShowCreateModal(true)}
              className="app-toolbar__new-btn"
            >
              New Task
            </Button>
          </section>

          {/* Task List */}
          <section className="app-section" aria-label="Task list">
            <TaskList />
          </section>

        </div>
      </main>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        size="md"
      >
        <TaskForm onSuccess={() => setShowCreateModal(false)} />
      </Modal>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ToastProvider>
  </ErrorBoundary>
);

export default App;

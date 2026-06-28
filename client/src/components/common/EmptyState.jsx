import './EmptyState.css';

/**
 * EmptyState — Display when a list or section has no content.
 * Different messages for empty task list vs. no search results.
 *
 * @param {'tasks' | 'search' | 'error'} type
 * @param {Function} onAction - Optional CTA callback
 */
const EmptyState = ({ type = 'tasks', onAction, searchTerm }) => {
  const content = {
    tasks: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="12" width="48" height="44" rx="6" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3"/>
          <path d="M20 26h24M20 34h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="48" cy="48" r="10" fill="var(--color-primary)" opacity="0.12" stroke="var(--color-primary)" strokeWidth="1.5"/>
          <path d="M48 44v4l2 2" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'No tasks yet',
      description: "You haven't created any tasks. Add your first task to get started.",
      action: 'Create your first task',
    },
    search: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="2"/>
          <path d="M40 40l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 28h12M28 22v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        </svg>
      ),
      title: 'No results found',
      description: searchTerm
        ? `No tasks match "${searchTerm}". Try a different search term.`
        : 'No tasks match the current filters.',
      action: 'Clear filters',
    },
    error: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="24" stroke="var(--color-danger)" strokeWidth="2" opacity="0.3"/>
          <path d="M32 20v16M32 42v2" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Something went wrong',
      description: 'Failed to load tasks. Please check your connection and try again.',
      action: 'Try again',
    },
  };

  const { icon, title, description, action } = content[type] || content.tasks;

  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {onAction && (
        <button className="empty-state__action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

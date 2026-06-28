import './Badge.css';

/**
 * Badge — Pill-shaped status and priority indicators.
 * Uses semantic color variables for consistent theming.
 *
 * @param {'status' | 'priority'} variant
 * @param {string} value - The status or priority value
 * @param {boolean} dot - Show colored dot before text
 */
const Badge = ({ variant = 'status', value, dot = true, className = '' }) => {
  const classes = [
    'badge',
    `badge--${variant}`,
    `badge--${value}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labels = {
    // Status
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    // Priority
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
  };

  return (
    <span className={classes}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {labels[value] || value}
    </span>
  );
};

export default Badge;

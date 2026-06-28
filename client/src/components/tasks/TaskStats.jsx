import { useTasks } from '../../context/TaskContext';
import Skeleton from '../common/Skeleton';
import './TaskStats.css';

/**
 * TaskStats — Dashboard summary bar showing counts per status.
 * Uses skeleton loading while stats are being fetched.
 */
const StatCard = ({ label, count, colorClass, icon }) => (
  <div className={`stat-card stat-card--${colorClass}`}>
    <div className="stat-card__header">
      <span className="stat-card__icon" aria-hidden="true">{icon}</span>
      <span className="stat-card__label">{label}</span>
    </div>
    <div className="stat-card__count">{count}</div>
  </div>
);

const TaskStats = () => {
  const { stats, statsLoading } = useTasks();

  if (statsLoading) {
    return (
      <div className="task-stats">
        <Skeleton variant="stat" count={4} />
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total',
      count: stats.total,
      colorClass: 'total',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.25"/>
          <path d="M4 7h8M4 10h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'To Do',
      count: stats.todo,
      colorClass: 'todo',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25"/>
        </svg>
      ),
    },
    {
      label: 'In Progress',
      count: stats['in-progress'],
      colorClass: 'progress',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 3"/>
          <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5"/>
        </svg>
      ),
    },
    {
      label: 'Completed',
      count: stats.completed,
      colorClass: 'completed',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25"/>
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  if (stats.overdue > 0) {
    statItems.push({
      label: 'Overdue',
      count: stats.overdue,
      colorClass: 'overdue',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25"/>
          <path d="M8 5v3.5l2 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
      ),
    });
  }

  return (
    <div className="task-stats" role="region" aria-label="Task statistics">
      {statItems.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default TaskStats;

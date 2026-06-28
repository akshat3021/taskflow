// App-wide constants — single source of truth
// Changing these here propagates everywhere

export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const STATUS_LABELS = {
  [TASK_STATUSES.TODO]: 'To Do',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.COMPLETED]: 'Completed',
};

export const PRIORITY_LABELS = {
  [TASK_PRIORITIES.LOW]: 'Low',
  [TASK_PRIORITIES.MEDIUM]: 'Medium',
  [TASK_PRIORITIES.HIGH]: 'High',
};

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export const FILTER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: TASK_STATUSES.TODO, label: 'To Do' },
  { value: TASK_STATUSES.IN_PROGRESS, label: 'In Progress' },
  { value: TASK_STATUSES.COMPLETED, label: 'Completed' },
];

export const FILTER_PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: TASK_PRIORITIES.LOW, label: 'Low' },
  { value: TASK_PRIORITIES.MEDIUM, label: 'Medium' },
  { value: TASK_PRIORITIES.HIGH, label: 'High' },
];

export const TOAST_DURATION = 3500; // ms
export const DEBOUNCE_DELAY = 400;  // ms for search input
export const DEFAULT_PAGE_LIMIT = 20;

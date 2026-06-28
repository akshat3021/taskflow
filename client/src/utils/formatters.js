import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

/**
 * Formats a date into a human-friendly display string.
 * Shows relative time for dates within a week.
 */
export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return format(d, 'MMM d, yyyy');
};

/**
 * Returns a relative time string ("2 hours ago", "in 3 days")
 */
export const formatRelative = (date) => {
  if (!date) return null;
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Smart due date display:
 * - "Today" if due today
 * - "Tomorrow" if due tomorrow
 * - "Jan 15" for near dates
 * - "Jan 15, 2025" for far dates
 */
export const formatDueDate = (date) => {
  if (!date) return null;
  const d = new Date(date);

  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d');
};

/**
 * Returns true if a date is in the past and the task is not completed.
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return isPast(new Date(dueDate));
};

/**
 * Truncates text with an ellipsis at the specified length.
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a date to ISO string for <input type="date"> value.
 */
export const toDateInputValue = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

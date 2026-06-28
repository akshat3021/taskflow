import { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  FILTER_STATUS_OPTIONS,
  FILTER_PRIORITY_OPTIONS,
  SORT_OPTIONS,
} from '../../utils/constants';
import Select from '../common/Select';
import Button from '../common/Button';
import './TaskFilters.css';

/**
 * TaskFilters — Filter, sort, and order controls.
 *
 * Displays the active filter count as a badge.
 * Clear all button appears only when filters are applied.
 */
const TaskFilters = () => {
  const { filters, setFilters, clearFilters } = useTasks();

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.priority && filters.priority !== 'all') count++;
    if (filters.sortBy && filters.sortBy !== 'createdAt') count++;
    return count;
  }, [filters]);

  const handleChange = (field) => (e) => {
    setFilters({ [field]: e.target.value });
  };

  const orderOptions = [
    { value: 'desc', label: 'Newest first' },
    { value: 'asc', label: 'Oldest first' },
  ];

  return (
    <div className="task-filters">
      <div className="task-filters__controls">
        <Select
          id="filter-status"
          label="Status"
          value={filters.status}
          onChange={handleChange('status')}
          options={FILTER_STATUS_OPTIONS}
          className="task-filters__select"
        />

        <Select
          id="filter-priority"
          label="Priority"
          value={filters.priority}
          onChange={handleChange('priority')}
          options={FILTER_PRIORITY_OPTIONS}
          className="task-filters__select"
        />

        <Select
          id="filter-sort"
          label="Sort by"
          value={filters.sortBy}
          onChange={handleChange('sortBy')}
          options={SORT_OPTIONS}
          className="task-filters__select"
        />

        <Select
          id="filter-order"
          label="Order"
          value={filters.order}
          onChange={handleChange('order')}
          options={orderOptions}
          className="task-filters__select"
        />
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="task-filters__clear"
        >
          Clear filters
          <span className="task-filters__badge" aria-label={`${activeFilterCount} active filters`}>
            {activeFilterCount}
          </span>
        </Button>
      )}
    </div>
  );
};

export default TaskFilters;

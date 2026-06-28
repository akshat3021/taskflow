import { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../../context/TaskContext';
import { DEBOUNCE_DELAY } from '../../utils/constants';
import './Header.css';

/**
 * Header — App-wide header with search, branding, and create button.
 *
 * Search: controlled input with debouncing to avoid excessive API calls.
 * The debounce is implemented here at the UI level, not in the context.
 */
const Header = ({ onNewTask }) => {
  const { filters, setFilters } = useTasks();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search to avoid firing API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters({ search: localSearch });
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [localSearch]);

  // Sync local state if external filters are cleared
  useEffect(() => {
    if (!filters.search) setLocalSearch('');
  }, [filters.search]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    setFilters({ search: '' });
  }, [setFilters]);

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        {/* Branding */}
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="var(--color-primary)"/>
              <path
                d="M8 10h12M8 14h8M8 18h10"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <circle cx="20" cy="18" r="3" fill="white" opacity="0.9"/>
              <path d="M19 18l.8.8 1.7-1.7" stroke="var(--color-primary)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header__brand-text">
            <span className="header__name">TaskFlow</span>
            <span className="header__tagline">clarity in every task</span>
          </div>
        </div>

        {/* Search */}
        <div className="header__search-wrap">
          <div className="header__search">
            <span className="header__search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.25"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              id="search-tasks"
              type="search"
              className="header__search-input"
              placeholder="Search tasks..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              aria-label="Search tasks"
              autoComplete="off"
            />
            {localSearch && (
              <button
                className="header__search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* New Task */}
        <button
          id="new-task-btn"
          className="header__new-btn"
          onClick={onNewTask}
          aria-label="Create new task"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

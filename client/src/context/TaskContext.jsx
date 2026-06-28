import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { taskApi } from '../api/taskApi';
import { useToast } from './ToastContext';

/**
 * TaskContext — Global task state management
 *
 * Uses useReducer for predictable state transitions.
 * Optimistic updates: UI updates immediately, reverts on error.
 * Stats are fetched alongside tasks for the dashboard bar.
 */

const TaskContext = createContext(null);

// ── State Shape ───────────────────────────────────────────────
const initialState = {
  tasks: [],
  stats: { total: 0, todo: 0, 'in-progress': 0, completed: 0, overdue: 0 },
  loading: false,
  statsLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    order: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

// ── Reducer ───────────────────────────────────────────────────
const taskReducer = (state, action) => {
  switch (action.type) {
    // ── Loading States ───────────────────────────────────────
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_STATS_START':
      return { ...state, statsLoading: true };

    // ── Data Actions ─────────────────────────────────────────
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
      };
    case 'FETCH_STATS_SUCCESS':
      return { ...state, statsLoading: false, stats: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    // ── CRUD Actions ─────────────────────────────────────────
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
          [action.payload.status]: (state.stats[action.payload.status] || 0) + 1,
        },
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'OPTIMISTIC_STATUS_UPDATE': {
      const { id, status: newStatus, previousStatus } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
        stats: {
          ...state.stats,
          [previousStatus]: Math.max(0, (state.stats[previousStatus] || 0) - 1),
          [newStatus]: (state.stats[newStatus] || 0) + 1,
        },
      };
    }

    case 'REVERT_STATUS_UPDATE': {
      const { id, previousStatus, failedStatus } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, status: previousStatus } : t
        ),
        stats: {
          ...state.stats,
          [failedStatus]: Math.max(0, (state.stats[failedStatus] || 0) - 1),
          [previousStatus]: (state.stats[previousStatus] || 0) + 1,
        },
      };
    }

    case 'DELETE_TASK': {
      const deleted = state.tasks.find((t) => t.id === action.payload);
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        stats: deleted
          ? {
              ...state.stats,
              total: Math.max(0, state.stats.total - 1),
              [deleted.status]: Math.max(0, (state.stats[deleted.status] || 0) - 1),
            }
          : state.stats,
      };
    }

    // ── Filter Actions ───────────────────────────────────────
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }, // Reset to page 1 on filter change
      };

    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        pagination: { ...state.pagination, page: 1 },
      };

    default:
      return state;
  }
};

// ── Provider ──────────────────────────────────────────────────
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { toast } = useToast();

  // ── Fetch Tasks ─────────────────────────────────────────────
  // Using a ref to always access the latest state without stale closures
  const stateRef = { filters: state.filters, pagination: state.pagination };

  const fetchTasks = useCallback(async (overrideParams = {}) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const params = {
        ...stateRef.filters,
        page: stateRef.pagination.page,
        limit: stateRef.pagination.limit,
        ...overrideParams,
      };

      // Remove 'all' values — backend expects empty or specific values
      if (params.status === 'all') delete params.status;
      if (params.priority === 'all') delete params.priority;
      if (!params.search) delete params.search;

      const response = await taskApi.getAll(params);
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: response.data,
      });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters, state.pagination.page, state.pagination.limit]);

  // ── Fetch Stats ─────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    dispatch({ type: 'FETCH_STATS_START' });
    try {
      const response = await taskApi.getStats();
      dispatch({ type: 'FETCH_STATS_SUCCESS', payload: response.data });
    } catch {
      // Stats failure is non-critical — silently ignore
    }
  }, []);

  // ── Create Task ─────────────────────────────────────────────
  const createTask = useCallback(async (taskData) => {
    try {
      const response = await taskApi.create(taskData);
      dispatch({ type: 'ADD_TASK', payload: response.data.task });
      toast.success('Task created successfully');
      return { success: true, task: response.data.task };
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
      return { success: false, errors: err.errors };
    }
  }, [toast]);

  // ── Update Task ─────────────────────────────────────────────
  const updateTask = useCallback(async (id, taskData) => {
    try {
      const response = await taskApi.update(id, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: response.data.task });
      toast.success('Task updated successfully');
      return { success: true, task: response.data.task };
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      return { success: false, errors: err.errors };
    }
  }, [toast]);

  // ── Update Status (optimistic) ──────────────────────────────
  const updateTaskStatus = useCallback(async (id, newStatus) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task || task.status === newStatus) return;

    const previousStatus = task.status;

    // Optimistic update
    dispatch({
      type: 'OPTIMISTIC_STATUS_UPDATE',
      payload: { id, status: newStatus, previousStatus },
    });

    try {
      await taskApi.updateStatus(id, newStatus);
      toast.success(`Moved to ${newStatus.replace('-', ' ')}`);
    } catch {
      // Revert on failure
      dispatch({
        type: 'REVERT_STATUS_UPDATE',
        payload: { id, previousStatus, failedStatus: newStatus },
      });
      toast.error('Failed to update status');
    }
  }, [state.tasks, toast]);

  // ── Delete Task ─────────────────────────────────────────────
  const deleteTask = useCallback(async (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id }); // Optimistic delete
    try {
      await taskApi.delete(id);
      toast.success('Task deleted');
    } catch {
      // Refetch to restore state on error
      fetchTasks();
      toast.error('Failed to delete task');
    }
  }, [toast, fetchTasks]);

  // ── Filter Actions ──────────────────────────────────────────
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  // ── Auto-fetch on filter/page change ───────────────────────
  // fetchTasks is memoized and will change when filters/page change,
  // so this effect correctly re-runs on those changes.
  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters, state.pagination.page]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const value = {
    ...state,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    setFilters,
    clearFilters,
    setPage,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
};

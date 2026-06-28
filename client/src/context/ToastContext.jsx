import { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * Toast Context
 *
 * Provides a global toast notification system.
 * Decoupled from TaskContext so any component can trigger toasts
 * without knowing about task state.
 */

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    icon: '✓',
    className: 'toast--success',
  },
  error: {
    icon: '✕',
    className: 'toast--error',
  },
  warning: {
    icon: '⚠',
    className: 'toast--warning',
  },
  info: {
    icon: 'ℹ',
    className: 'toast--info',
  },
};

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload];
    case 'REMOVE_TOAST':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id,
        message,
        type,
        duration,
        ...TOAST_TYPES[type],
      },
    });

    // Auto-remove after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, duration + 500); // Extra 500ms for exit animation

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  // Convenience methods
  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

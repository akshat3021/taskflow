import { useEffect, useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import './Toast.css';

/**
 * Individual Toast notification.
 * Handles its own exit animation before removal.
 */
const Toast = ({ id, message, type, icon, className, duration = 3500 }) => {
  const { removeToast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      handleClose();
    }, duration);
  };

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, []);

  const handleClose = () => {
    clearTimer();
    setIsLeaving(true);
    // Wait for CSS exit animation to finish before removing from DOM
    setTimeout(() => removeToast(id), 350);
  };

  return (
    <div
      className={`toast ${className} ${isLeaving ? 'toast--leaving' : ''}`}
      role="alert"
      aria-live="polite"
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <span className="toast__icon" aria-hidden="true">{icon}</span>
      <p className="toast__message">{message}</p>
      <button
        className="toast__close"
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Progress bar — visual timer indicator */}
      <div
        className="toast__progress"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default Toast;

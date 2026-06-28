import { createPortal } from 'react-dom';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import './ToastContainer.css';

/**
 * ToastContainer — Renders toasts in a portal at top-right.
 * Using a portal keeps toasts outside the component tree,
 * preventing z-index and overflow issues.
 */
const ToastContainer = () => {
  const { toasts } = useToast();

  return createPortal(
    <div className="toast-container" aria-label="Notifications" role="region">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;

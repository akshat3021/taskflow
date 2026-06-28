import './Input.css';

/**
 * Input — Controlled input with label, error message, and icon slots.
 * Handles the full controlled input pattern in a single component.
 *
 * @param {string} label
 * @param {string} error - Error message to display
 * @param {React.ReactNode} leadingIcon
 * @param {React.ReactNode} trailingIcon
 * @param {string} hint - Helper text below the input
 */
const Input = ({
  id,
  label,
  error,
  hint,
  leadingIcon,
  trailingIcon,
  className = '',
  required,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {leadingIcon && (
          <span className="input-icon input-icon--leading" aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        <input
          id={inputId}
          className={`input-field ${leadingIcon ? 'input-field--leading' : ''} ${trailingIcon ? 'input-field--trailing' : ''}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          required={required}
          {...props}
        />

        {trailingIcon && (
          <span className="input-icon input-icon--trailing" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${inputId}-hint`} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;

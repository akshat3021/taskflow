import './Select.css';

/**
 * Select — Styled native select element.
 * Native select is preferred over custom dropdowns for accessibility.
 * Styled to match the Input component perfectly.
 */
const Select = ({
  id,
  label,
  error,
  options = [],
  className = '',
  required,
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="select-wrapper">
        <select
          id={selectId}
          className="select-field"
          aria-invalid={!!error}
          required={required}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="select-chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {error && (
        <p className="input-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;

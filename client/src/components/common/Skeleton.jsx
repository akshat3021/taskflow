import './Skeleton.css';

/**
 * Skeleton — Content loading placeholder.
 * Matches the shape of the content it replaces.
 *
 * @param {'text' | 'title' | 'card' | 'stat'} variant
 * @param {number} count - Number of skeletons to render
 * @param {string} width - Optional custom width
 * @param {string} height - Optional custom height
 */
const Skeleton = ({
  variant = 'text',
  count = 1,
  width,
  height,
  className = '',
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={`skeleton-card ${className}`}>
            <div className="skeleton-card__header">
              <div className="skeleton skeleton--text skeleton--w60" />
              <div className="skeleton skeleton--badge" />
            </div>
            <div className="skeleton skeleton--text skeleton--w90" />
            <div className="skeleton skeleton--text skeleton--w75" />
            <div className="skeleton-card__footer">
              <div className="skeleton skeleton--badge" />
              <div className="skeleton skeleton--badge" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'stat') {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={`skeleton-stat ${className}`}>
            <div className="skeleton skeleton--text skeleton--w40" />
            <div className="skeleton skeleton--title skeleton--w60" />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={`skeleton skeleton--${variant} ${className}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
};

export default Skeleton;

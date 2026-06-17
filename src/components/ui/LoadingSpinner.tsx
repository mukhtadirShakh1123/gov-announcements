import './LoadingSpinner.css';

type LoadingSpinnerProps = {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Accessible loading indicator with optional message.
 */
export function LoadingSpinner({
  message = 'Loading announcements...',
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`loading loading--${size}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading__spinner" aria-hidden="true">
        <div className="loading__ring" />
      </div>
      <p className="loading__text">{message}</p>
    </div>
  );
}

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <p>{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button type="button" className="error-state-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
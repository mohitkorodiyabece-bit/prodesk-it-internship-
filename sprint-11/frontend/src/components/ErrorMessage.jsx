function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <h2>Unable to load posts</h2>
      <p>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

function LoadingSpinner() {
  return (
    <span className="loading-spinner" role="status" aria-live="polite">
      <span className="loading-spinner-circle" aria-hidden="true"></span>
      <span className="visually-hidden">Loading, please wait.</span>
    </span>
  );
}

export default LoadingSpinner;
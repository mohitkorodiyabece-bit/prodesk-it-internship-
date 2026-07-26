function LoadingSpinner() {
  return (
    <div className="status-message" role="status">
      <div className="spinner" />
      <p>Loading posts from MongoDB...</p>
    </div>
  );
}

export default LoadingSpinner;

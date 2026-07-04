function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state-title">No data found</p>
      <p className="empty-state-subtitle">
        Create your first cupcake configuration to get started.
      </p>
    </div>
  );
}

export default EmptyState;
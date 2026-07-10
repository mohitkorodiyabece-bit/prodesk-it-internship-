export default function EmptyState({ message = 'No movies found.' }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
}
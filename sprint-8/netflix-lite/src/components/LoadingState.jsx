export default function LoadingState({ message = 'Loading movies…' }) {
  return (
    <div className="loading-state" role="status" aria-busy="true" aria-live="polite">
      <span>{message}</span>
    </div>
  );
}
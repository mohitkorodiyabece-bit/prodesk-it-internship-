const VIEW_OPTIONS = [
  { id: 'popular', label: 'Popular' },
  { id: 'favorites', label: 'Favorites' },
];

export default function Header({ activeView, onViewChange }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-name">Netflix Lite</span>
      </div>
      <nav className="nav-actions" aria-label="Main navigation">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={
              activeView === option.id
                ? 'nav-action nav-action-active'
                : 'nav-action'
            }
            aria-pressed={activeView === option.id}
            onClick={() => onViewChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
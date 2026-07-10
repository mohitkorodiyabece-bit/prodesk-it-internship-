export default function SearchBar({ value, onChange, placeholder = 'Search movies…' }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar">
      <label className="search-bar-label" htmlFor="movie-search-input">
        Search movies
      </label>
      <input
        id="movie-search-input"
        type="text"
        className="search-bar-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
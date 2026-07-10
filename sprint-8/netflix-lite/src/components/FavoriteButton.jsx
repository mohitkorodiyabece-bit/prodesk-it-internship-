import { useFavorites } from '../context/FavoritesContext';

export default function FavoriteButton({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = isFavorite(movie.id);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    toggleFavorite(movie);
  }

  return (
    <button
      type="button"
      className={
        favorite
          ? 'cf-favorite-btn cf-favorite-btn--active'
          : 'cf-favorite-btn'
      }
      onClick={handleClick}
      aria-label={
        favorite
          ? `Remove ${movie.title} from favorites`
          : `Add ${movie.title} to favorites`
      }
      aria-pressed={favorite}
      title={
        favorite
          ? 'Remove from favorites'
          : 'Add to favorites'
      }
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={favorite ? 'currentColor' : 'none'}
        aria-hidden="true"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
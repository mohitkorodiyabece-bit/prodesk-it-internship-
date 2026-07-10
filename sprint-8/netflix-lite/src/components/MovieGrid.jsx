import MovieCard from './MovieCard';
import EmptyState from './EmptyState';

export default function MovieGrid({ movies, emptyMessage }) {
  if (!movies || movies.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
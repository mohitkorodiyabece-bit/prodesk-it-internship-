export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZE = 'w500';
export const FALLBACK_POSTER = null;

/**
 * Builds a full poster image URL from a TMDB poster_path.
 * Returns null when no path is available so consumers can render a fallback.
 */
export function buildPosterUrl(posterPath, size = POSTER_SIZE) {
  if (!posterPath) return FALLBACK_POSTER;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

/**
 * Extracts a four-digit year from a TMDB date string (YYYY-MM-DD).
 * Returns null when the date is missing or malformed.
 */
export function extractReleaseYear(releaseDate) {
  if (!releaseDate || typeof releaseDate !== 'string') return null;
  const year = releaseDate.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}

/**
 * Rounds a TMDB vote_average (0-10) to one decimal place for display.
 * Returns null when no rating data exists.
 */
export function normalizeRating(voteAverage) {
  if (typeof voteAverage !== 'number' || Number.isNaN(voteAverage)) return null;
  return Math.round(voteAverage * 10) / 10;
}

/**
 * Normalizes a single raw TMDB movie object into the shape used
 * throughout the application. This is the single source of truth
 * for movie normalization — do not duplicate this logic elsewhere.
 */
export function normalizeMovie(rawMovie) {
  if (!rawMovie || typeof rawMovie.id === 'undefined') return null;

  return {
    id: rawMovie.id,
    title: rawMovie.title || rawMovie.original_title || 'Untitled',
    posterUrl: buildPosterUrl(rawMovie.poster_path),
    posterPath: rawMovie.poster_path || null,
    releaseDate: rawMovie.release_date || null,
    releaseYear: extractReleaseYear(rawMovie.release_date),
    rating: normalizeRating(rawMovie.vote_average),
    overview: rawMovie.overview || '',
  };
}

/**
 * Normalizes an array of raw TMDB movie objects, filtering out
 * any malformed entries that fail to normalize.
 */
export function normalizeMovieList(rawMovies) {
  if (!Array.isArray(rawMovies)) return [];
  return rawMovies.map(normalizeMovie).filter(Boolean);
}

/**
 * Merges a new page of movies into an existing list while
 * de-duplicating by movie ID. Used by infinite scroll to prevent
 * duplicate cards when pages overlap or a request is retried.
 */
export function mergeUniqueMovies(existingMovies, newMovies) {
  const seenIds = new Set(existingMovies.map((movie) => movie.id));
  const uniqueNewMovies = newMovies.filter((movie) => !seenIds.has(movie.id));
  return [...existingMovies, ...uniqueNewMovies];
}
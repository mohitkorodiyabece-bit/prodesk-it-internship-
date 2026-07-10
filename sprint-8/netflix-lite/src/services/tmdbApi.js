const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Thrown when TMDB configuration is missing so callers can
 * distinguish a config problem from a network/API failure.
 */
export class TmdbConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TmdbConfigError';
  }
}

/**
 * Thrown for non-OK TMDB HTTP responses.
 */
export class TmdbApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'TmdbApiError';
    this.status = status;
  }
}

function assertConfigured() {
  if (!API_KEY) {
    throw new TmdbConfigError(
      'TMDB API key is missing. Set VITE_TMDB_API_KEY in your environment.'
    );
  }
}

function buildUrl(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

async function tmdbFetch(path, params = {}, signal) {
  assertConfigured();

  let response;
  try {
    response = await fetch(buildUrl(path, params), { signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new TmdbApiError('Network error while contacting TMDB.', null);
  }

  if (!response.ok) {
    let message = `TMDB request failed with status ${response.status}.`;
    try {
      const body = await response.json();
      if (body?.status_message) {
        message = body.status_message;
      }
    } catch {
      // response body wasn't JSON; keep default message
    }
    throw new TmdbApiError(message, response.status);
  }

  return response.json();
}

/**
 * Fetches a page of popular movies.
 * @param {number} page
 * @param {AbortSignal} [signal]
 * @returns {Promise<{results: object[], page: number, totalPages: number, totalResults: number}>}
 */
export async function getPopularMovies(page = 1, signal) {
  const data = await tmdbFetch('/movie/popular', { page }, signal);
  return {
    results: data.results || [],
    page: data.page || page,
    totalPages: data.total_pages || 0,
    totalResults: data.total_results || 0,
  };
}

/**
 * Searches movies by text query.
 * @param {string} query
 * @param {number} page
 * @param {AbortSignal} [signal]
 * @returns {Promise<{results: object[], page: number, totalPages: number, totalResults: number}>}
 */
export async function searchMovies(query, page = 1, signal) {
  const trimmedQuery = (query || '').trim();
  if (!trimmedQuery) {
    return { results: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  const data = await tmdbFetch(
    '/search/movie',
    { query: trimmedQuery, page, include_adult: false },
    signal
  );
  return {
    results: data.results || [],
    page: data.page || page,
    totalPages: data.total_pages || 0,
    totalResults: data.total_results || 0,
  };
}
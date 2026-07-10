import { useCallback, useEffect, useRef, useState } from 'react';
import { getPopularMovies, searchMovies, TmdbConfigError } from '../services/tmdbApi';
import { normalizeMovieList, mergeUniqueMovies } from '../utils/movieUtils';

/**
 * Manages movie fetching for both "popular" and "search" modes,
 * including pagination, loading states, and error handling.
 *
 * Race conditions are avoided by:
 * - aborting the in-flight request whenever the query changes or a
 *   new request starts
 * - tagging each request with an incrementing id and ignoring any
 *   response that resolves after a newer request has started
 *
 * @param {Object} params
 * @param {'popular'|'search'} params.mode
 * @param {string} params.query - only used when mode === 'search'
 */
export function useMovies({ mode, query }) {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(
    async (page, { isFirstPage }) => {
      // Cancel any in-flight request before starting a new one.
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const thisRequestId = ++requestIdRef.current;

      if (isFirstPage) {
        setIsInitialLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const fetcher = mode === 'search' ? () => searchMovies(query, page, controller.signal) : () => getPopularMovies(page, controller.signal);

        const data = await fetcher();

        // A newer request has since started; discard this stale response.
        if (thisRequestId !== requestIdRef.current) {
          return;
        }

        const normalized = normalizeMovieList(data.results);

        setMovies((prev) => (isFirstPage ? normalized : mergeUniqueMovies(prev, normalized)));
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        if (thisRequestId !== requestIdRef.current) {
          return;
        }

        if (err instanceof TmdbConfigError) {
          setError({ type: 'config', message: err.message });
        } else {
          setError({ type: 'api', message: err.message || 'Failed to load movies.' });
        }

        if (isFirstPage) {
          setMovies([]);
          setTotalPages(0);
        }
      } finally {
        if (thisRequestId === requestIdRef.current) {
          setIsInitialLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [mode, query]
  );

  // Reset and refetch whenever mode changes, or the (debounced) search
  // query changes. Empty search query short-circuits to an empty list
  // without hitting the network.
  useEffect(() => {
    if (mode === 'search' && !query.trim()) {
      abortControllerRef.current?.abort();
      requestIdRef.current += 1;
      setMovies([]);
      setCurrentPage(0);
      setTotalPages(0);
      setIsInitialLoading(false);
      setIsLoadingMore(false);
      setError(null);
      return;
    }

    setCurrentPage(0);
    setTotalPages(0);
    fetchPage(1, { isFirstPage: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, query]);

  // Abort any pending request on unmount.
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchNextPage = useCallback(() => {
    if (isInitialLoading || isLoadingMore) return;
    if (currentPage === 0 || currentPage >= totalPages) return;
    fetchPage(currentPage + 1, { isFirstPage: false });
  }, [currentPage, totalPages, isInitialLoading, isLoadingMore, fetchPage]);

  const hasNextPage = currentPage > 0 && currentPage < totalPages;

  return {
    movies,
    currentPage,
    totalPages,
    hasNextPage,
    isInitialLoading,
    isLoadingMore,
    error,
    fetchNextPage,
  };
}
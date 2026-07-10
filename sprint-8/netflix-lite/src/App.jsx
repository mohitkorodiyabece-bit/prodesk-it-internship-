import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MoodMatcher from './components/MoodMatcher';
import MovieGrid from './components/MovieGrid';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import InfiniteScrollSentinel from './components/InfiniteScrollSentinel';
import { useDebounce } from './hooks/useDebounce';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useMovies } from './hooks/useMovies';
import { useFavorites } from './context/FavoritesContext';
import { getMovieRecommendationFromMood } from './services/geminiApi';

const VIEWS = {
  POPULAR: 'popular',
  SEARCH: 'search',
  FAVORITES: 'favorites',
};

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS.POPULAR);
  const [searchQuery, setSearchQuery] = useState('');
  const [mood, setMood] = useState('');
  const [moodLoading, setMoodLoading] = useState(false);
  const [moodError, setMoodError] = useState(null);

  const debouncedQuery = useDebounce(searchQuery, 500);
  const { favorites } = useFavorites();

  // Switching to search mode happens implicitly: whenever the user has
  // a non-empty debounced query we are effectively in "search"; an
  // empty query returns them to "popular" (unless they're in Favorites).
  useEffect(() => {
    if (activeView === VIEWS.FAVORITES) return;
    setActiveView(debouncedQuery.trim() ? VIEWS.SEARCH : VIEWS.POPULAR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const fetchMode = activeView === VIEWS.SEARCH ? 'search' : 'popular';

  const {
    movies,
    hasNextPage,
    isInitialLoading,
    isLoadingMore,
    error,
    fetchNextPage,
  } = useMovies({ mode: fetchMode, query: debouncedQuery });

  const isFavoritesView = activeView === VIEWS.FAVORITES;

  const displayedMovies = isFavoritesView ? favorites : movies;

  const infiniteScrollEnabled = !isFavoritesView && hasNextPage;

  const sentinelRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    enabled: infiniteScrollEnabled,
    isLoading: isLoadingMore,
  });

  const handleViewChange = useCallback((nextView) => {
    setActiveView(nextView);
    if (nextView !== VIEWS.SEARCH) {
      setSearchQuery('');
    }
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleMoodSubmit = useCallback(async (moodValue) => {
    setMood(moodValue);
    setMoodLoading(true);
    setMoodError(null);

    try {
      const movieTitle = await getMovieRecommendationFromMood(moodValue);
      setActiveView(VIEWS.SEARCH);
      setSearchQuery(movieTitle);
    } catch (err) {
      setMoodError(err.message || 'Could not find a movie for that mood.');
    } finally {
      setMoodLoading(false);
    }
  }, []);

  const emptyMessage = useMemo(() => {
    if (isFavoritesView) return 'You have not added any favorites yet.';
    if (activeView === VIEWS.SEARCH) return 'No movies matched your search.';
    return 'No popular movies available right now.';
  }, [isFavoritesView, activeView]);

  const showInitialLoading = !isFavoritesView && isInitialLoading;
  const showError = !isFavoritesView && error && !isInitialLoading;

  const handleRetry = useCallback(() => {
    // Re-trigger the effect chain by toggling query state minimally.
    setSearchQuery((prev) => prev);
    setActiveView((prev) => prev);
  }, []);

  return (
    <div className="app-shell">
      <Header activeView={activeView} onViewChange={handleViewChange} />

      <section className="search-section">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
        <MoodMatcher
          onMoodSubmit={handleMoodSubmit}
          isLoading={moodLoading}
          error={moodError}
        />
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>
            {isFavoritesView && 'Your Favorites'}
            {!isFavoritesView && activeView === VIEWS.SEARCH && `Results for "${debouncedQuery}"`}
            {!isFavoritesView && activeView === VIEWS.POPULAR && 'Popular Movies'}
          </h2>
        </div>

        {showInitialLoading && <LoadingState message="Loading movies…" />}

        {showError && (
          <ErrorState message={error.message} onRetry={handleRetry} />
        )}

        {!showInitialLoading && !showError && (
          <MovieGrid movies={displayedMovies} emptyMessage={emptyMessage} />
        )}

        {!isFavoritesView && isLoadingMore && <LoadingState message="Loading more…" />}

        {infiniteScrollEnabled && (
          <InfiniteScrollSentinel ref={sentinelRef} isLoadingMore={isLoadingMore} />
        )}
      </section>
    </div>
  );
}
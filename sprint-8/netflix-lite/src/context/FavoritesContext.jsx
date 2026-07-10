import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'netflix-lite-favorites';

const FavoritesContext = createContext(null);

function readFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavoritesToStorage(favorites) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage may be unavailable (e.g. private browsing quota);
    // fail silently so the app keeps working in-memory for the session.
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readFavoritesFromStorage());

  useEffect(() => {
    writeFavoritesToStorage(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (movieId) => favorites.some((movie) => movie.id === movieId),
    [favorites]
  );

  const addFavorite = useCallback((movie) => {
    if (!movie || typeof movie.id === 'undefined') return;
    setFavorites((prev) => {
      if (prev.some((existing) => existing.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  }, []);

  const removeFavorite = useCallback((movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  const toggleFavorite = useCallback(
    (movie) => {
      if (!movie || typeof movie.id === 'undefined') return;
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

/**
 * Access favorites state and actions. Must be used within a
 * FavoritesProvider (mounted in main.jsx / App.jsx).
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
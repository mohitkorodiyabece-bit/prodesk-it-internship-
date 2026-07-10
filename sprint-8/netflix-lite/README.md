# Netflix Lite

A Netflix-style media discovery single-page app built with React and Vite. It consumes the TMDB API for movie data and the Gemini API for mood-based recommendations. Visual styling is intentionally minimal in this codebase — the CSS layer is owned by a separate design pass (Lovable).

## Tech Stack

- React 18 (functional components + hooks)
- Vite
- TMDB REST API
- Gemini API
- Native `IntersectionObserver`, `localStorage`, `fetch`, `AbortController` (no external libraries for scroll, debounce, or storage)

## Features

- **Popular movies** — loads TMDB's popular movies feed on start
- **Search** — debounced (500ms) search against TMDB, with stale-response protection via `AbortController`
- **Infinite scroll** — `IntersectionObserver`-driven pagination, deduplicated by movie ID
- **Favorites** — add/remove/toggle, persisted to `localStorage` under the key `netflix-lite-favorites`
- **Mood Matcher** — user enters a mood, Gemini returns one movie title, which is fed into TMDB search
- **Lazy-loaded posters** — native `loading="lazy"`, with fallback UI for missing/broken images

## Getting Started

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your own keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Then run:

```bash
npm run dev
```

## Project Structure

```
netflix-lite/
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── components/
    │   ├── Header.jsx
    │   ├── SearchBar.jsx
    │   ├── MoodMatcher.jsx
    │   ├── MovieGrid.jsx
    │   ├── MovieCard.jsx
    │   ├── RatingBadge.jsx
    │   ├── FavoriteButton.jsx
    │   ├── LoadingState.jsx
    │   ├── ErrorState.jsx
    │   ├── EmptyState.jsx
    │   └── InfiniteScrollSentinel.jsx
    │
    ├── context/
    │   └── FavoritesContext.jsx
    │
    ├── hooks/
    │   ├── useDebounce.js
    │   ├── useInfiniteScroll.js
    │   └── useMovies.js
    │
    ├── services/
    │   ├── tmdbApi.js
    │   └── geminiApi.js
    │
    └── utils/
        └── movieUtils.js
```

## Architecture Notes

- **`services/`** — all network calls (TMDB, Gemini) live here. Components never call `fetch` directly.
- **`hooks/`** — reusable stateful logic (debouncing, infinite scroll observation, movie fetching/pagination) is isolated from presentation.
- **`context/FavoritesContext.jsx`** — favorites state and `localStorage` sync, shared across the tree without prop drilling.
- **`utils/movieUtils.js`** — single source of truth for normalizing raw TMDB movie objects (poster URLs, release year, rating) and for deduplicating merged pages.
- **`App.jsx`** — the orchestration layer that wires hooks, context, and components together; it holds no fetch or storage logic itself.

## Styling

`src/index.css` contains only a structural baseline (layout, grid, semantic class hooks) — not a finished visual design. Components use predictable, semantic class names (`movie-card`, `search-bar`, `favorite-button`, etc.) so a separate styling pass can restyle the app without touching component logic.

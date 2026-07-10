import { useEffect, useRef } from 'react';

/**
 * Observes a sentinel DOM element and invokes `onIntersect` when it
 * becomes visible, provided the hook is currently enabled and not
 * already loading. Used to drive infinite scroll for movie grids.
 *
 * @param {Object} options
 * @param {Function} options.onIntersect - called when sentinel becomes visible
 * @param {boolean} options.enabled - whether observing should be active at all
 *   (e.g. false when there is no next page or in Favorites view)
 * @param {boolean} options.isLoading - prevents triggering while a fetch is in flight
 * @returns {React.RefObject} ref to attach to the sentinel element
 */
export function useInfiniteScroll({ onIntersect, enabled, isLoading }) {
  const sentinelRef = useRef(null);
  const onIntersectRef = useRef(onIntersect);

  // Keep the latest callback without re-creating the observer every render.
  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const sentinelNode = sentinelRef.current;

    if (!enabled || !sentinelNode) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          onIntersectRef.current?.();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(sentinelNode);

    return () => {
      observer.unobserve(sentinelNode);
      observer.disconnect();
    };
  }, [enabled, isLoading]);

  return sentinelRef;
}
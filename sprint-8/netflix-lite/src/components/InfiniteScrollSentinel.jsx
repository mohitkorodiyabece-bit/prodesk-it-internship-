import { forwardRef } from 'react';

/**
 * Invisible sentinel element rendered after the movie grid.
 * useInfiniteScroll attaches an IntersectionObserver to the
 * forwarded ref; when this element scrolls into view, the next
 * page of results is fetched.
 */
const InfiniteScrollSentinel = forwardRef(function InfiniteScrollSentinel(
  { isLoadingMore },
  ref
) {
  return (
    <div
      ref={ref}
      className="infinite-scroll-sentinel"
      aria-hidden="true"
      data-loading-more={isLoadingMore ? 'true' : 'false'}
    />
  );
});

export default InfiniteScrollSentinel;
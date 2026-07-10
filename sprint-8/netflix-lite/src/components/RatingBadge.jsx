export default function RatingBadge({ rating }) {
  if (rating === null || rating === undefined) {
    return (
      <span className="rating-badge rating-badge-unrated">N/A</span>
    );
  }

  return (
    <span className="rating-badge" aria-label={`Rating ${rating} out of 10`}>
      {rating.toFixed(1)}
    </span>
  );
}
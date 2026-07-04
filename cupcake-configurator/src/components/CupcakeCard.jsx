const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatCreatedAt(isoTimestamp) {
  try {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }
    return dateFormatter.format(date);
  } catch {
    return "Unknown date";
  }
}

function CupcakeCard({ cupcake, onDelete }) {
  const handleDeleteClick = () => {
    onDelete(cupcake.id);
  };

  const hasInstructions = Boolean(cupcake.specialInstructions);

  return (
    <article className="cupcake-card">
      <header className="cupcake-card-header">
        <h3 className="cupcake-card-name">{cupcake.customerName}</h3>
        <span className="cupcake-card-quantity">Qty: {cupcake.quantity}</span>
      </header>

      <dl className="cupcake-card-details">
        <div className="cupcake-card-detail">
          <dt>Flavor</dt>
          <dd>{cupcake.flavor}</dd>
        </div>
        <div className="cupcake-card-detail">
          <dt>Size</dt>
          <dd>{cupcake.size}</dd>
        </div>
        <div className="cupcake-card-detail">
          <dt>Frosting</dt>
          <dd>{cupcake.frosting}</dd>
        </div>
        <div className="cupcake-card-detail">
          <dt>Topping</dt>
          <dd>{cupcake.topping}</dd>
        </div>
      </dl>

      <p
        className={
          hasInstructions
            ? "cupcake-card-instructions"
            : "cupcake-card-instructions is-empty"
        }
      >
        <strong>Special Instructions:</strong>{" "}
        {hasInstructions ? cupcake.specialInstructions : "No special instructions"}
      </p>

      <footer className="cupcake-card-footer">
        <time className="cupcake-card-time" dateTime={cupcake.createdAt}>
          {formatCreatedAt(cupcake.createdAt)}
        </time>
        <button
          type="button"
          className="delete-button"
          onClick={handleDeleteClick}
          aria-label={`Delete ${cupcake.flavor} cupcake configuration for ${cupcake.customerName}`}
        >
          Delete Configuration
        </button>
      </footer>
    </article>
  );
}

export default CupcakeCard;
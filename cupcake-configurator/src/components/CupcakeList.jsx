import CupcakeCard from "./CupcakeCard";
import EmptyState from "./EmptyState";

function CupcakeList({ cupcakes, onDelete }) {
  if (cupcakes.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="cupcake-list">
      {cupcakes.map((cupcake) => (
        <li key={cupcake.id}>
          <CupcakeCard cupcake={cupcake} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

export default CupcakeList;
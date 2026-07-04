import { useState, useEffect } from "react";
import "./App.css";
import CupcakeForm from "./components/CupcakeForm";
import CupcakeList from "./components/CupcakeList";

const STORAGE_KEY = "artisanBakeryCupcakes";

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `cupcake-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadStoredCupcakes() {
  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsedData = JSON.parse(rawData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Failed to load cupcake configurations:", error);
    return [];
  }
}

function App() {
  // Lazy initialization avoids a hydration race condition where an
  // effect-based load could overwrite existing localStorage data with [].
  const [cupcakes, setCupcakes] = useState(loadStoredCupcakes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist configurations whenever the list changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cupcakes));
    } catch (error) {
      console.error("Failed to save cupcake configurations:", error);
    }
  }, [cupcakes]);

  const handleAddCupcake = (formValues) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    // Simulate an asynchronous save operation over a slow connection.
    const simulatedDelay = 800 + Math.random() * 400;

    new Promise((resolve) => {
      setTimeout(resolve, simulatedDelay);
    }).then(() => {
      const newCupcake = {
        id: generateId(),
        customerName: formValues.customerName,
        flavor: formValues.flavor,
        size: formValues.size,
        frosting: formValues.frosting,
        topping: formValues.topping,
        quantity: formValues.quantity,
        specialInstructions: formValues.specialInstructions,
        createdAt: new Date().toISOString(),
      };

      setCupcakes((previousCupcakes) => [newCupcake, ...previousCupcakes]);
      setIsSubmitting(false);

      console.log(
        "[Analytics] User interacted with Cupcake Configurator - Configuration Added"
      );
    });
  };

  const handleDeleteCupcake = (id) => {
    const cupcakeToDelete = cupcakes.find((cupcake) => cupcake.id === id);
    if (!cupcakeToDelete) {
      return;
    }

    setCupcakes((previousCupcakes) =>
      previousCupcakes.filter((cupcake) => cupcake.id !== id)
    );

    console.log(
      "[Analytics] User interacted with Cupcake Configurator - Configuration Deleted"
    );
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all cupcake configurations?"
    );
    if (!confirmed) {
      return;
    }
    setCupcakes([]);
    console.log(
      "[Analytics] User interacted with Cupcake Configurator - All Configurations Cleared"
    );
  };

  const totalConfigurations = cupcakes.length;
  const totalCupcakes = cupcakes.reduce(
    (sum, cupcake) => sum + Number(cupcake.quantity || 0),
    0
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="brand-label">Artisan Bakery</p>
        <h1 className="app-title">Cupcake Configurator</h1>
        <p className="app-description">
          Create and manage consistent cupcake configurations for bakery
          operations.
        </p>
      </header>

      <section className="summary-section" aria-label="Configuration summary">
        <div className="summary-card">
          <p className="summary-label">Total Configurations</p>
          <p className="summary-value">{totalConfigurations}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Total Cupcakes</p>
          <p className="summary-value">{totalCupcakes}</p>
        </div>
      </section>

      <main className="main-content">
        <section className="form-column" aria-label="Cupcake configuration form">
          <CupcakeForm onSubmit={handleAddCupcake} isSubmitting={isSubmitting} />
        </section>

        <section className="list-column" aria-label="Saved cupcake configurations">
          <div className="list-column-header">
            <h2 className="section-title">
              Saved Configurations ({totalConfigurations})
            </h2>
            {cupcakes.length > 0 && (
              <button
                type="button"
                className="clear-all-button"
                onClick={handleClearAll}
                aria-label="Clear all cupcake configurations"
              >
                Clear All
              </button>
            )}
          </div>
          <CupcakeList cupcakes={cupcakes} onDelete={handleDeleteCupcake} />
        </section>
      </main>
    </div>
  );
}

export default App;
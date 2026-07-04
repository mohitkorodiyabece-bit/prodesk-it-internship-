import { useState, useRef } from "react";
import { sanitizeInput } from "../utils/sanitizeInput";
import LoadingSpinner from "./LoadingSpinner";

const FLAVOR_OPTIONS = [
  "Chocolate",
  "Vanilla",
  "Red Velvet",
  "Lemon",
  "Strawberry",
  "Coffee",
];

const SIZE_OPTIONS = ["Mini", "Regular", "Large"];

const FROSTING_OPTIONS = [
  "Vanilla Buttercream",
  "Chocolate Buttercream",
  "Cream Cheese",
  "Strawberry",
  "Caramel",
  "No Frosting",
];

const TOPPING_OPTIONS = [
  "Sprinkles",
  "Chocolate Chips",
  "Nuts",
  "Fresh Fruit",
  "Cookie Crumbs",
  "No Topping",
];

const MAX_INSTRUCTIONS_LENGTH = 250;

const INITIAL_FORM_STATE = {
  customerName: "",
  flavor: "",
  size: "",
  frosting: "",
  topping: "",
  quantity: "",
  specialInstructions: "",
};

function validateForm(values) {
  const validationErrors = {};

  const trimmedName = values.customerName.trim();
  if (!trimmedName) {
    validationErrors.customerName = "Customer name is required.";
  } else if (trimmedName.length < 2) {
    validationErrors.customerName =
      "Customer name must be at least 2 characters.";
  } else if (trimmedName.length > 50) {
    validationErrors.customerName =
      "Customer name must be 50 characters or fewer.";
  }

  if (!values.flavor) {
    validationErrors.flavor = "Please select a flavor.";
  }

  if (!values.size) {
    validationErrors.size = "Please select a size.";
  }

  if (!values.frosting) {
    validationErrors.frosting = "Please select a frosting.";
  }

  if (!values.topping) {
    validationErrors.topping = "Please select a topping.";
  }

  const quantityNumber = Number(values.quantity);
  if (values.quantity === "" || Number.isNaN(quantityNumber)) {
    validationErrors.quantity = "Quantity is required.";
  } else if (!Number.isInteger(quantityNumber)) {
    validationErrors.quantity = "Quantity must be a whole number.";
  } else if (quantityNumber < 1) {
    validationErrors.quantity = "Quantity must be at least 1.";
  } else if (quantityNumber > 100) {
    validationErrors.quantity = "Quantity cannot exceed 100.";
  }

  if (values.specialInstructions.length > MAX_INSTRUCTIONS_LENGTH) {
    validationErrors.specialInstructions = `Special instructions must be ${MAX_INSTRUCTIONS_LENGTH} characters or fewer.`;
  }

  return validationErrors;
}

function CupcakeForm({ onSubmit, isSubmitting }) {
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  const customerNameRef = useRef(null);
  const flavorRef = useRef(null);
  const sizeRef = useRef(null);
  const frostingRef = useRef(null);
  const toppingRef = useRef(null);
  const quantityRef = useRef(null);

  const fieldRefs = {
    customerName: customerNameRef,
    flavor: flavorRef,
    size: sizeRef,
    frosting: frostingRef,
    topping: toppingRef,
    quantity: quantityRef,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    setErrors((previousErrors) => {
      if (!previousErrors[name]) {
        return previousErrors;
      }
      const updatedErrors = { ...previousErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const focusFirstInvalidField = (validationErrors) => {
    const fieldOrder = [
      "customerName",
      "flavor",
      "size",
      "frosting",
      "topping",
      "quantity",
    ];
    const firstInvalidField = fieldOrder.find(
      (field) => validationErrors[field]
    );
    if (firstInvalidField && fieldRefs[firstInvalidField].current) {
      fieldRefs[firstInvalidField].current.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors = validateForm(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstInvalidField(validationErrors);
      return;
    }

    const sanitizedValues = {
      customerName: sanitizeInput(formValues.customerName),
      flavor: formValues.flavor,
      size: formValues.size,
      frosting: formValues.frosting,
      topping: formValues.topping,
      quantity: Number(formValues.quantity),
      specialInstructions: sanitizeInput(formValues.specialInstructions),
    };

    onSubmit(sanitizedValues);
    setErrors({});
    setFormValues(INITIAL_FORM_STATE);
  };

  const remainingCharacters =
    MAX_INSTRUCTIONS_LENGTH - formValues.specialInstructions.length;

  return (
    <form className="cupcake-form" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">New Cupcake Configuration</h2>

      <div className="form-field">
        <label htmlFor="customerName">
          Customer Name <span className="required-marker">*</span>
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          ref={customerNameRef}
          value={formValues.customerName}
          onChange={handleChange}
          aria-invalid={Boolean(errors.customerName)}
          aria-describedby={
            errors.customerName ? "customerName-error" : undefined
          }
          aria-required="true"
          className={errors.customerName ? "input-error" : ""}
        />
        {errors.customerName && (
          <p id="customerName-error" className="field-error" role="alert">
            {errors.customerName}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="flavor">
          Flavor <span className="required-marker">*</span>
        </label>
        <select
          id="flavor"
          name="flavor"
          ref={flavorRef}
          value={formValues.flavor}
          onChange={handleChange}
          aria-invalid={Boolean(errors.flavor)}
          aria-describedby={errors.flavor ? "flavor-error" : undefined}
          aria-required="true"
          className={errors.flavor ? "input-error" : ""}
        >
          <option value="">Select a flavor</option>
          {FLAVOR_OPTIONS.map((flavor) => (
            <option key={flavor} value={flavor}>
              {flavor}
            </option>
          ))}
        </select>
        {errors.flavor && (
          <p id="flavor-error" className="field-error" role="alert">
            {errors.flavor}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="size">
          Size <span className="required-marker">*</span>
        </label>
        <select
          id="size"
          name="size"
          ref={sizeRef}
          value={formValues.size}
          onChange={handleChange}
          aria-invalid={Boolean(errors.size)}
          aria-describedby={errors.size ? "size-error" : undefined}
          aria-required="true"
          className={errors.size ? "input-error" : ""}
        >
          <option value="">Select a size</option>
          {SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {errors.size && (
          <p id="size-error" className="field-error" role="alert">
            {errors.size}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="frosting">
          Frosting <span className="required-marker">*</span>
        </label>
        <select
          id="frosting"
          name="frosting"
          ref={frostingRef}
          value={formValues.frosting}
          onChange={handleChange}
          aria-invalid={Boolean(errors.frosting)}
          aria-describedby={errors.frosting ? "frosting-error" : undefined}
          aria-required="true"
          className={errors.frosting ? "input-error" : ""}
        >
          <option value="">Select frosting</option>
          {FROSTING_OPTIONS.map((frosting) => (
            <option key={frosting} value={frosting}>
              {frosting}
            </option>
          ))}
        </select>
        {errors.frosting && (
          <p id="frosting-error" className="field-error" role="alert">
            {errors.frosting}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="topping">
          Topping <span className="required-marker">*</span>
        </label>
        <select
          id="topping"
          name="topping"
          ref={toppingRef}
          value={formValues.topping}
          onChange={handleChange}
          aria-invalid={Boolean(errors.topping)}
          aria-describedby={errors.topping ? "topping-error" : undefined}
          aria-required="true"
          className={errors.topping ? "input-error" : ""}
        >
          <option value="">Select topping</option>
          {TOPPING_OPTIONS.map((topping) => (
            <option key={topping} value={topping}>
              {topping}
            </option>
          ))}
        </select>
        {errors.topping && (
          <p id="topping-error" className="field-error" role="alert">
            {errors.topping}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="quantity">
          Quantity <span className="required-marker">*</span>
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          max="100"
          ref={quantityRef}
          value={formValues.quantity}
          onChange={handleChange}
          aria-invalid={Boolean(errors.quantity)}
          aria-describedby={errors.quantity ? "quantity-error" : undefined}
          aria-required="true"
          className={errors.quantity ? "input-error" : ""}
        />
        {errors.quantity && (
          <p id="quantity-error" className="field-error" role="alert">
            {errors.quantity}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="specialInstructions">Special Instructions</label>
        <textarea
          id="specialInstructions"
          name="specialInstructions"
          rows="4"
          maxLength={MAX_INSTRUCTIONS_LENGTH}
          value={formValues.specialInstructions}
          onChange={handleChange}
          aria-invalid={Boolean(errors.specialInstructions)}
          aria-describedby={
            errors.specialInstructions
              ? "specialInstructions-error specialInstructions-count"
              : "specialInstructions-count"
          }
          className={errors.specialInstructions ? "input-error" : ""}
        />
        <p id="specialInstructions-count" className="char-count">
          {remainingCharacters} characters remaining
        </p>
        {errors.specialInstructions && (
          <p
            id="specialInstructions-error"
            className="field-error"
            role="alert"
          >
            {errors.specialInstructions}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
        aria-label={
          isSubmitting
            ? "Saving cupcake configuration"
            : "Add Cupcake Configuration"
        }
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner />
            <span>Saving Configuration...</span>
          </>
        ) : (
          "Add Cupcake Configuration"
        )}
      </button>
    </form>
  );
}

export default CupcakeForm;
function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span className="field-error" id={id} role="alert">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M7 4V7.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="7" cy="9.6" r="0.9" fill="currentColor" />
      </svg>
      {message}
    </span>
  );
}

function PersonalInfoStep({ register, errors, touchedFields, isStepValid, onNext }) {
  const fieldState = (name) => {
    const hasError = Boolean(errors[name]);
    const isTouched = Boolean(touchedFields[name]);
    if (hasError) return "is-invalid";
    if (isTouched && !hasError) return "is-valid";
    return "";
  };

  return (
    <div className="step-panel">
      <div className="step-heading">
        <h2>Personal Information</h2>
        <p>Let's start with a few basic details about you.</p>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="fullName">Full Name</label>
          <div className={`input-shell ${fieldState("fullName")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle
                  cx="9"
                  cy="5.5"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M3 15.5C3 12.4624 5.68629 10 9 10C12.3137 10 15 12.4624 15 15.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              id="fullName"
              type="text"
              placeholder="Jordan Ellis"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              {...register("fullName")}
            />
          </div>
          <FieldError id="fullName-error" message={errors.fullName?.message} />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <div className={`input-shell ${fieldState("email")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2.25"
                  y="4"
                  width="13.5"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M3 5.5L9 10L15 5.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <div className={`input-shell ${fieldState("phone")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4.5 2.75H6.75L8 6.25L6.25 7.375C6.90 8.85 8.15 10.1 9.625 10.75L10.75 9L14.25 10.25V12.5C14.25 13.6 13.35 14.5 12.25 14.4C7.5 13.95 3.55 10 3.1 5.25C3 4.15 3.9 3.25 4.5 2.75Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone")}
            />
          </div>
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>

        <div className="form-field">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <div className={`input-shell ${fieldState("dateOfBirth")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2.5"
                  y="3.5"
                  width="13"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M2.5 7H15.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M6 2V4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M12 2V4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              id="dateOfBirth"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              aria-invalid={Boolean(errors.dateOfBirth)}
              aria-describedby={
                errors.dateOfBirth ? "dateOfBirth-error" : undefined
              }
              {...register("dateOfBirth")}
            />
          </div>
          <FieldError
            id="dateOfBirth-error"
            message={errors.dateOfBirth?.message}
          />
        </div>
      </div>

      <div className="step-actions step-actions-end">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!isStepValid}
          onClick={onNext}
        >
          Next Step
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.5 4L12.5 9L7.5 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PersonalInfoStep;
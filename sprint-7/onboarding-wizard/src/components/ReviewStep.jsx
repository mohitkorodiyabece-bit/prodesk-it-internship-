const ACCOUNT_TYPE_LABELS = {
  personal: "Personal",
  business: "Business",
  creator: "Creator",
  enterprise: "Enterprise",
};

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ReviewItem({ icon, label, value }) {
  return (
    <div className="review-item">
      <span className="review-item-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="review-item-text">
        <span className="review-item-label">{label}</span>
        <span className="review-item-value">{value || "—"}</span>
      </div>
    </div>
  );
}

function ReviewStep({ formValues, onBack, onSubmit, isSubmitting }) {
  const maskedPassword = "•".repeat(
    Math.max(8, Math.min(formValues.password?.length || 0, 16))
  );

  return (
    <div className="step-panel">
      <div className="step-heading">
        <h2>Review &amp; Submit</h2>
        <p>Please confirm your details before completing setup.</p>
      </div>

      <div className="review-cards">
        <section className="review-card">
          <h3 className="review-card-title">Personal Information</h3>
          <div className="review-card-grid">
            <ReviewItem
              label="Full Name"
              value={formValues.fullName}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M3 15.5C3 12.4624 5.68629 10 9 10C12.3137 10 15 12.4624 15 15.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <ReviewItem
              label="Email"
              value={formValues.email}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="2.25" y="4" width="13.5" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M3 5.5L9 10L15 5.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <ReviewItem
              label="Phone"
              value={formValues.phone}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4.5 2.75H6.75L8 6.25L6.25 7.375C6.9 8.85 8.15 10.1 9.625 10.75L10.75 9L14.25 10.25V12.5C14.25 13.6 13.35 14.5 12.25 14.4C7.5 13.95 3.55 10 3.1 5.25C3 4.15 3.9 3.25 4.5 2.75Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <ReviewItem
              label="Date of Birth"
              value={formatDate(formValues.dateOfBirth)}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="2.5" y="3.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M2.5 7H15.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              }
            />
          </div>
        </section>

        <section className="review-card">
          <h3 className="review-card-title">Account Details</h3>
          <div className="review-card-grid">
            <ReviewItem
              label="Username"
              value={formValues.username}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M3.5 15C3.9 12.2 6.2 10.3 9 10.3C11.8 10.3 14.1 12.2 14.5 15"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <ReviewItem
              label="Account Type"
              value={ACCOUNT_TYPE_LABELS[formValues.accountType]}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="2.5" y="4" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M2.5 7.5H15.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              }
            />
            <ReviewItem
              label="Password"
              value={maskedPassword}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="3.5" y="8" width="11" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M6 8V5.5C6 3.84 7.34 2.5 9 2.5C10.66 2.5 12 3.84 12 5.5V8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              }
            />
          </div>
        </section>
      </div>

      <div className="step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M10.5 4L5.5 9L10.5 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Completing Setup…" : "Complete Setup"}
          {!isSubmitting && (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M3.5 9.5L7 13L14.5 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default ReviewStep;
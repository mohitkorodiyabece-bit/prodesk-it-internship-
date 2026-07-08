function SuccessScreen({ fullName, onStartOver }) {
  const firstName = (fullName || "").trim().split(/\s+/)[0] || "there";

  return (
    <div className="success-panel">
      <div className="success-icon-wrap">
        <svg
          className="success-icon"
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="success-icon-circle"
            cx="36"
            cy="36"
            r="33"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="success-icon-check"
            d="M22 37L31.5 46.5L50 26"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="success-heading">Onboarding Complete!</h2>
      <p className="success-message">
        Welcome aboard, {firstName}. Your account has been set up successfully
        and you're all ready to get started.
      </p>

      <div className="success-summary">
        <span className="success-summary-dot" aria-hidden="true" />
        Thanks for completing your setup, {firstName}. A confirmation has been
        prepared for your records.
      </div>

      <button type="button" className="btn btn-primary" onClick={onStartOver}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M14.5 9C14.5 12.038 12.038 14.5 9 14.5C5.962 14.5 3.5 12.038 3.5 9C3.5 5.962 5.962 3.5 9 3.5C10.86 3.5 12.51 4.42 13.5 5.85"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M13.5 2.75V5.85H10.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Start Over
      </button>
    </div>
  );
}

export default SuccessScreen;
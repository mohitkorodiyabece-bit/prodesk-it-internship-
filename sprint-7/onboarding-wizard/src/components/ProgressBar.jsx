const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Account Details" },
  { id: 3, label: "Review" },
];

const PROGRESS_PERCENT = {
  1: 33,
  2: 66,
  3: 100,
};

function ProgressBar({ currentStep }) {
  const fillPercent = PROGRESS_PERCENT[currentStep] || 33;

  return (
    <div
      className="progress-wrapper"
      role="progressbar"
      aria-valuenow={fillPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Onboarding progress: step ${currentStep} of ${STEPS.length}`}
    >
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      <div className="progress-steps">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const stateClass = isCompleted
            ? "is-completed"
            : isActive
            ? "is-active"
            : "is-upcoming";

          return (
            <div
              className={`progress-step ${stateClass}`}
              key={step.id}
            >
              <span
                className="progress-circle"
                aria-current={isActive ? "step" : undefined}
              >
                {isCompleted ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 7.5L5.5 10.5L11.5 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </span>
              <span className="progress-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
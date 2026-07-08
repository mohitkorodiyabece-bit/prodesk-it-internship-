import { useState } from "react";

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

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M2 9C3.2 5.8 6 3.8 9 3.8C12 3.8 14.8 5.8 16 9C14.8 12.2 12 14.2 9 14.2C6 14.2 3.2 12.2 2 9Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 9C3.2 5.8 6 3.8 9 3.8C12 3.8 14.8 5.8 16 9C14.8 12.2 12 14.2 9 14.2C6 14.2 3.2 12.2 2 9Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3 15L15 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AccountDetailsStep({
  register,
  errors,
  touchedFields,
  watch,
  isStepValid,
  onNext,
  onBack,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValue = watch("password") || "";

  const fieldState = (name) => {
    const hasError = Boolean(errors[name]);
    const isTouched = Boolean(touchedFields[name]);
    if (hasError) return "is-invalid";
    if (isTouched && !hasError) return "is-valid";
    return "";
  };

  const passwordChecks = [
    { label: "At least 8 characters", met: passwordValue.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", met: /[a-z]/.test(passwordValue) },
    { label: "One number", met: /[0-9]/.test(passwordValue) },
    {
      label: "One special character",
      met: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`~]/.test(passwordValue),
    },
  ];

  return (
    <div className="step-panel">
      <div className="step-heading">
        <h2>Account Details</h2>
        <p>Choose your credentials and account type.</p>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <div className={`input-shell ${fieldState("username")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle
                  cx="9"
                  cy="6"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M3.5 15C3.9 12.2 6.2 10.3 9 10.3C11.8 10.3 14.1 12.2 14.5 15"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              id="username"
              type="text"
              placeholder="jordan_ellis"
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
              {...register("username")}
            />
          </div>
          <FieldError id="username-error" message={errors.username?.message} />
        </div>

        <div className="form-field">
          <label htmlFor="accountType">Account Type</label>
          <div className={`input-shell select-shell ${fieldState("accountType")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2.5"
                  y="4"
                  width="13"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M2.5 7.5H15.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </span>
            <select
              id="accountType"
              defaultValue=""
              aria-invalid={Boolean(errors.accountType)}
              aria-describedby={
                errors.accountType ? "accountType-error" : undefined
              }
              {...register("accountType")}
            >
              <option value="" disabled>
                Select account type
              </option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="creator">Creator</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <span className="select-chevron" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3.5 5.25L7 8.75L10.5 5.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <FieldError
            id="accountType-error"
            message={errors.accountType?.message}
          />
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="password">Password</label>
          <div className={`input-shell ${fieldState("password")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="3.5"
                  y="8"
                  width="11"
                  height="7.5"
                  rx="1.6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M6 8V5.5C6 3.84 7.34 2.5 9 2.5C10.66 2.5 12 3.84 12 5.5V8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-requirements password-error"
              {...register("password")}
            />
            <button
              type="button"
              className="input-toggle-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          <FieldError id="password-error" message={errors.password?.message} />

          <ul className="password-requirements" id="password-requirements">
            {passwordChecks.map((check) => (
              <li
                key={check.label}
                className={check.met ? "req-met" : "req-unmet"}
              >
                <span className="req-dot" aria-hidden="true">
                  {check.met ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.2L4.8 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="req-dot-empty" />
                  )}
                </span>
                {check.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className={`input-shell ${fieldState("confirmPassword")}`}>
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="3.5"
                  y="8"
                  width="11"
                  height="7.5"
                  rx="1.6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M6 8V5.5C6 3.84 7.34 2.5 9 2.5C10.66 2.5 12 3.84 12 5.5V8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="input-toggle-btn"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <EyeIcon visible={showConfirmPassword} />
            </button>
          </div>
          <FieldError
            id="confirmPassword-error"
            message={errors.confirmPassword?.message}
          />
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
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

export default AccountDetailsStep;
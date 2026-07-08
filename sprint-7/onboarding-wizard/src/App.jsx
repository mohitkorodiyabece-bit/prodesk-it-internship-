import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProgressBar from "./components/ProgressBar.jsx";
import PersonalInfoStep from "./components/PersonalInfoStep.jsx";
import AccountDetailsStep from "./components/AccountDetailsStep.jsx";
import ReviewStep from "./components/ReviewStep.jsx";
import SuccessScreen from "./components/SuccessScreen.jsx";
import {
  onboardingSchema,
  STEP_FIELDS,
  defaultOnboardingValues,
} from "./schemas/onboardingSchema.js";
import "./App.css";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    getValues,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: defaultOnboardingValues,
    mode: "onChange",
  });

  const watchedValues = watch();

  const isStep1Valid = useMemo(() => {
    return STEP_FIELDS[1].every(
      (field) => watchedValues[field] && !errors[field]
    );
  }, [watchedValues, errors]);

  const isStep2Valid = useMemo(() => {
    return STEP_FIELDS[2].every(
      (field) => watchedValues[field] && !errors[field]
    );
  }, [watchedValues, errors]);

  const goToNextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (!fieldsToValidate) return;

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onFinalSubmit = handleSubmit((data) => {
    setIsSubmitting(true);

    const finalData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      username: data.username,
      password: data.password,
      accountType: data.accountType,
      submittedAt: new Date().toISOString(),
    };

    // eslint-disable-next-line no-console
    console.log("Final Onboarding Payload:", finalData);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  });

  const handleStartOver = () => {
    reset(defaultOnboardingValues);
    setCurrentStep(1);
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="app-shell">
        <div className="success-stage">
          <SuccessScreen
            fullName={getValues("fullName")}
            onStartOver={handleStartOver}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="onboarding-layout">
        <aside className="brand-panel">
          <div className="brand-panel-glow brand-panel-glow-one" aria-hidden="true" />
          <div className="brand-panel-glow brand-panel-glow-two" aria-hidden="true" />
          <div className="brand-panel-grid" aria-hidden="true" />
          <div className="brand-panel-ring brand-panel-ring-one" aria-hidden="true" />
          <div className="brand-panel-ring brand-panel-ring-two" aria-hidden="true" />

          <div className="brand-panel-content">
            <div className="brand-logo-row">
              <span className="brand-logo-mark" aria-hidden="true">
                <span className="brand-logo-mark-inner" />
              </span>
              <span className="brand-name">Nexora</span>
            </div>

            <span className="brand-badge">
              <span className="brand-badge-dot" aria-hidden="true" />
              Secure Onboarding
            </span>

            <h1 className="brand-headline">Your journey starts here.</h1>
            <p className="brand-subtext">
              Set up your Nexora account in just a few guided steps and unlock
              a workspace built for how your team actually works.
            </p>

            <ul className="brand-benefits">
              <li>
                <span className="brand-benefit-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 2.5L14.5 4.75V8.75C14.5 12.05 12.15 14.9 9 15.5C5.85 14.9 3.5 12.05 3.5 8.75V4.75L9 2.5Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.5 9L8.25 10.75L11.5 7"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Secure account setup
              </li>
              <li>
                <span className="brand-benefit-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M9 5.5V9L11.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Takes less than 3 minutes
              </li>
              <li>
                <span className="brand-benefit-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="4" y="8" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M6.25 8V5.75C6.25 4.23 7.48 3 9 3C10.52 3 11.75 4.23 11.75 5.75V8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
                Your data stays protected
              </li>
            </ul>
          </div>
        </aside>

        <main className="wizard-panel">
          <div className="wizard-card">
            <ProgressBar currentStep={currentStep} />

            <div key={currentStep} className="step-transition">
              {currentStep === 1 && (
                <PersonalInfoStep
                  register={register}
                  errors={errors}
                  touchedFields={touchedFields}
                  isStepValid={isStep1Valid}
                  onNext={goToNextStep}
                />
              )}

              {currentStep === 2 && (
                <AccountDetailsStep
                  register={register}
                  errors={errors}
                  touchedFields={touchedFields}
                  watch={watch}
                  isStepValid={isStep2Valid}
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                />
              )}

              {currentStep === 3 && (
                <ReviewStep
                  formValues={watchedValues}
                  onBack={goToPreviousStep}
                  onSubmit={onFinalSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
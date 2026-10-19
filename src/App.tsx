import React, { useState, useCallback } from 'react';
import type {
  EyeKey,
  FieldKey,
  PrescriptionFormState,
  ValidationResult,
} from './types/prescription';
import {
  validatePrescription,
  createEmptyFormState,
} from './utils/validation';
import { EyeCard } from './components/EyeCard';
import { ErrorSummaryBanner } from './components/ErrorSummaryBanner';
import { SuccessBanner } from './components/SuccessBanner';
import { PresetsBar } from './components/PresetsBar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import './App.css';

export const App: React.FC = () => {
  const [formState, setFormState] = useState<PrescriptionFormState>(createEmptyFormState);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<EyeKey, Record<FieldKey, boolean>>>({
    od: { sph: false, cyl: false, axis: false },
    os: { sph: false, cyl: false, axis: false },
  });

  // Handle value change for an eye & field
  const handleFieldChange = useCallback(
    (eye: EyeKey, field: FieldKey, value: string) => {
      setFormState((prev) => {
        const nextState = {
          ...prev,
          [eye]: {
            ...prev[eye],
            [field]: value,
          },
        };

        // If the form has already been submitted at least once,
        // dynamically re-validate on change so the user sees errors clear as they type
        if (hasSubmitted) {
          const freshValidation = validatePrescription(nextState);
          setValidationResult(freshValidation);
        }

        return nextState;
      });
    },
    [hasSubmitted]
  );

  // Mark field as touched on blur
  const handleFieldBlur = useCallback((eye: EyeKey, field: FieldKey) => {
    setTouched((prev) => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: true,
      },
    }));
  }, []);

  // Form submission / Validation trigger
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Run independent reusable validation engine
    const result = validatePrescription(formState);
    setValidationResult(result);

    // Scroll to feedback if needed
    if (!result.isValid) {
      const summaryEl = document.getElementById('error-summary-anchor');
      if (summaryEl) {
        summaryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      const successEl = document.getElementById('success-summary-anchor');
      if (successEl) {
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Reset all fields and validation state
  const handleClear = () => {
    setFormState(createEmptyFormState());
    setValidationResult(null);
    setHasSubmitted(false);
    setTouched({
      od: { sph: false, cyl: false, axis: false },
      os: { sph: false, cyl: false, axis: false },
    });
  };

  // Load preset scenario
  const handleSelectPreset = (newState: PrescriptionFormState) => {
    setFormState(newState);
    setHasSubmitted(true);
    const result = validatePrescription(newState);
    setValidationResult(result);
  };

  const errors = validationResult?.errors ?? {};
  const errorCount = validationResult?.errorCount ?? 0;
  const isSuccess = validationResult?.isValid && validationResult.parsedData;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header__badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Clinical Optometry Suite
        </div>
        <h1 className="app-header__title">Prescription Input Validator</h1>
        <p className="app-header__subtitle">
          Verify and validate bilateral refractive error parameters (Sphere, Cylinder, and Axis)
          for eyeglasses with strict mathematical and clinical bounds checking.
        </p>
      </header>

      <main className="app-main">
        {/* Quick Scenario Preset Toolbar */}
        <PresetsBar onSelectPreset={handleSelectPreset} onClear={handleClear} />

        {/* Feedback Anchor: Error Summary */}
        <div id="error-summary-anchor">
          {hasSubmitted && validationResult && !validationResult.isValid && (
            <ErrorSummaryBanner errors={errors} errorCount={errorCount} />
          )}
        </div>

        {/* Feedback Anchor: Success Banner */}
        <div id="success-summary-anchor">
          {hasSubmitted && isSuccess && (
            <SuccessBanner
              data={validationResult.parsedData!}
              timestamp={validationResult.timestamp}
            />
          )}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} noValidate className="prescription-form">
          <div className="eyes-grid">
            {/* Right Eye (OD) */}
            <EyeCard
              eye="od"
              values={formState.od}
              errors={errors}
              touched={touched.od}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              hasSubmitted={hasSubmitted}
            />

            {/* Left Eye (OS) */}
            <EyeCard
              eye="os"
              values={formState.os}
              errors={errors}
              touched={touched.os}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              hasSubmitted={hasSubmitted}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn--primary btn--validate"
              id="validate-prescription-button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Validate Prescription</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="btn btn--secondary btn--clear"
              id="clear-form-button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear Form</span>
            </button>
          </div>
        </form>

        {/* Parameter Rules Reference Guide */}
        <section className="rules-reference">
          <h2 className="rules-reference__heading">Software Validation Rules & Limits</h2>
          <div className="rules-reference__grid">
            <div className="rules-reference__card">
              <div className="rules-reference__title">Sphere (SPH)</div>
              <div className="rules-reference__limit">-20.00 to +20.00 D</div>
              <div className="rules-reference__note">Decimals allowed (e.g. -2.25). Rejects empty or values exceeding ±20.00.</div>
            </div>
            <div className="rules-reference__card">
              <div className="rules-reference__title">Cylinder (CYL)</div>
              <div className="rules-reference__limit">-8.00 to +8.00 D</div>
              <div className="rules-reference__note">Decimals allowed (e.g. -0.75). Rejects empty or values exceeding ±8.00.</div>
            </div>
            <div className="rules-reference__card">
              <div className="rules-reference__title">Axis</div>
              <div className="rules-reference__limit">0 to 180° (Integers Only)</div>
              <div className="rules-reference__note">Whole numbers only. 0° is valid. Decimals (e.g. 45.5) or negatives are strictly rejected.</div>
            </div>
          </div>
        </section>

        {/* Medical / Optical Disclaimer */}
        <DisclaimerBanner />
      </main>

      <footer className="app-footer">
        <p>Prescription Input Validator • Senior Frontend Engineering Demonstration</p>
      </footer>
    </div>
  );
};

export default App;

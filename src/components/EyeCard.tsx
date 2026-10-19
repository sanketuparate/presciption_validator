import React from 'react';
import type {
  EyeKey,
  FieldKey,
  EyeFormState,
  ValidationErrorMap,
} from '../types/prescription';
import { EYE_METADATA, FIELD_METADATA } from '../types/prescription';

interface EyeCardProps {
  eye: EyeKey;
  values: EyeFormState;
  errors: ValidationErrorMap;
  touched: Record<FieldKey, boolean>;
  onChange: (eye: EyeKey, field: FieldKey, value: string) => void;
  onBlur: (eye: EyeKey, field: FieldKey) => void;
  hasSubmitted: boolean;
}

export const EyeCard: React.FC<EyeCardProps> = ({
  eye,
  values,
  errors,
  touched,
  onChange,
  onBlur,
  hasSubmitted,
}) => {
  const eyeMeta = EYE_METADATA[eye];
  const fields: FieldKey[] = ['sph', 'cyl', 'axis'];

  return (
    <div className={`eye-card eye-card--${eye}`} data-testid={`card-${eye}`}>
      <div className="eye-card__header">
        <div className="eye-card__badge-wrapper">
          <span className="eye-card__badge">{eyeMeta.badge}</span>
        </div>
        <div className="eye-card__titles">
          <h2 className="eye-card__english">{eyeMeta.englishName}</h2>
          <span className="eye-card__latin">{eyeMeta.latinName}</span>
        </div>
      </div>

      <div className="eye-card__fields">
        {fields.map((field) => {
          const fieldMeta = FIELD_METADATA[field];
          const errorKey = `${eye}.${field}` as const;
          const errorMsg = errors[errorKey];
          const isTouched = touched[field] || hasSubmitted;
          const hasError = isTouched && !!errorMsg;
          const isValid = isTouched && !errorMsg && values[field].trim() !== '';
          const inputId = `input-${eye}-${field}`;
          const errorId = `error-${eye}-${field}`;
          const helpId = `help-${eye}-${field}`;

          return (
            <div
              key={field}
              className={`field-group ${hasError ? 'field-group--error' : ''} ${
                isValid ? 'field-group--valid' : ''
              }`}
            >
              <div className="field-group__label-row">
                <label htmlFor={inputId} className="field-group__label">
                  <span className="field-group__name">{fieldMeta.shortLabel}</span>
                  <span className="field-group__unit">({fieldMeta.unit})</span>
                </label>
                <span className="field-group__range-tag">
                  {fieldMeta.min < 0 ? `${fieldMeta.min}` : `${fieldMeta.min}`} to{' '}
                  {fieldMeta.max > 0 ? `+${fieldMeta.max}` : `${fieldMeta.max}`}
                  {fieldMeta.unit}
                </span>
              </div>

              <div className="field-group__input-wrapper">
                <input
                  id={inputId}
                  name={`${eye}-${field}`}
                  type="text"
                  inputMode={field === 'axis' ? 'numeric' : 'decimal'}
                  value={values[field]}
                  placeholder={fieldMeta.placeholder}
                  onChange={(e) => onChange(eye, field, e.target.value)}
                  onBlur={() => onBlur(eye, field)}
                  aria-invalid={hasError}
                  aria-describedby={`${hasError ? errorId : ''} ${helpId}`}
                  className="field-group__input"
                  autoComplete="off"
                />
                <span className="field-group__unit-badge" aria-hidden="true">
                  {fieldMeta.unit}
                </span>

                {isValid && (
                  <span className="field-group__status-icon field-group__status-icon--valid" title="Valid">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </div>

              <span id={helpId} className="field-group__help">
                {fieldMeta.description}
              </span>

              {hasError && (
                <div
                  id={errorId}
                  role="alert"
                  className="field-group__error"
                  data-testid={`error-${eye}-${field}`}
                >
                  <svg
                    className="field-group__error-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="14"
                    height="14"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="field-group__error-text">{errorMsg}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

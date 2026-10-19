import type { ValidationErrorMap } from '../types/prescription';

interface ErrorSummaryBannerProps {
  errors: ValidationErrorMap;
  errorCount: number;
}

export const ErrorSummaryBanner: React.FC<ErrorSummaryBannerProps> = ({ errors, errorCount }) => {
  if (errorCount === 0) return null;

  const errorEntries = Object.entries(errors);

  return (
    <div
      className="error-summary-banner"
      role="alert"
      aria-live="assertive"
      data-testid="error-summary"
    >
      <div className="error-summary-banner__header">
        <div className="error-summary-banner__icon-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="error-summary-banner__title-group">
          <h3 className="error-summary-banner__title">
            Validation Failed: {errorCount} {errorCount === 1 ? 'Error' : 'Errors'} Found
          </h3>
          <p className="error-summary-banner__subtitle">
            Please correct the highlighted fields below to proceed with the prescription calculation.
          </p>
        </div>
        <div className="error-summary-banner__badge">
          {errorCount} {errorCount === 1 ? 'Issue' : 'Issues'}
        </div>
      </div>

      <ul className="error-summary-banner__list">
        {errorEntries.map(([path, message]) => {
          const inputId = `input-${path.replace('.', '-')}`;
          return (
            <li key={path} className="error-summary-banner__item">
              <a
                href={`#${inputId}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(inputId);
                  if (el) {
                    el.focus();
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="error-summary-banner__link"
              >
                <span className="error-summary-banner__bullet">•</span>
                <span>{message}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

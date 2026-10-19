import React from 'react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside className="disclaimer-banner" aria-label="Medical Disclaimer">
      <div className="disclaimer-banner__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>
      <div className="disclaimer-banner__content">
        <strong>Software Demonstration & Validation Notice:</strong> The numerical ranges enforced in this tool
        (SPH -20 to +20 D, CYL -8 to +8 D, Axis 0 to 180°) represent configurable software parameters for this exercise.
        Passing validation certifies syntactic correctness within configured parameters only and is <em>not</em> a substitute
        for licensed professional optometry or ophthalmology guidance.
      </div>
    </aside>
  );
};

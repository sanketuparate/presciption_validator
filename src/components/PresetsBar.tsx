import { getSamplePresets } from '../utils/validation';
import type { PrescriptionFormState } from '../types/prescription';

interface PresetsBarProps {
  onSelectPreset: (state: PrescriptionFormState) => void;
  onClear: () => void;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({ onSelectPreset, onClear }) => {
  const presets = getSamplePresets();

  return (
    <div className="presets-bar">
      <div className="presets-bar__label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span>Quick Test Scenarios:</span>
      </div>
      <div className="presets-bar__buttons">
        <button
          type="button"
          onClick={() => onSelectPreset(presets.userPrescription.state)}
          className="presets-bar__btn presets-bar__btn--primary"
          title={presets.userPrescription.description}
          id="btn-preset-user-case"
        >
          User Case (+1.50 / -1.00 / 105°)
        </button>
        <button
          type="button"
          onClick={() => onSelectPreset(presets.validStandard.state)}
          className="presets-bar__btn presets-bar__btn--primary"
          title={presets.validStandard.description}
        >
          Valid Standard
        </button>
        <button
          type="button"
          onClick={() => onSelectPreset(presets.validBoundary.state)}
          className="presets-bar__btn presets-bar__btn--secondary"
          title={presets.validBoundary.description}
        >
          Boundary Values (-20/+20, -8/+8, 0/180)
        </button>
        <button
          type="button"
          onClick={() => onSelectPreset(presets.invalidRanges.state)}
          className="presets-bar__btn presets-bar__btn--warning"
          title={presets.invalidRanges.description}
        >
          Out-of-Range & Decimal Axis
        </button>
        <button
          type="button"
          onClick={() => onSelectPreset(presets.invalidTypes.state)}
          className="presets-bar__btn presets-bar__btn--danger"
          title={presets.invalidTypes.description}
        >
          Non-Numeric & Negative Axis
        </button>
        <button
          type="button"
          onClick={onClear}
          className="presets-bar__btn presets-bar__btn--clear"
          title="Clear all fields to test empty submission"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

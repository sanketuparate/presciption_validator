import type { ParsedPrescription } from '../types/prescription';

interface SuccessBannerProps {
  data: ParsedPrescription;
  timestamp: string;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ data, timestamp }) => {
  const formatPower = (num: number) => {
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(2)} D`;
  };

  return (
    <div
      className="success-banner"
      role="status"
      aria-live="polite"
      data-testid="success-banner"
    >
      <div className="success-banner__header">
        <div className="success-banner__icon-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="success-banner__title-group">
          <h3 className="success-banner__title">
            Prescription Successfully Validated!
          </h3>
          <p className="success-banner__subtitle">
            All 6 ophthalmic parameters are within permitted clinical software bounds (Validated at {timestamp}).
          </p>
        </div>
        <div className="success-banner__status-badge">
          Valid Prescription
        </div>
      </div>

      <div className="prescription-receipt">
        <h4 className="prescription-receipt__heading">Validated Prescription Parameters</h4>
        <div className="prescription-receipt__grid">
          <div className="prescription-receipt__eye-card">
            <div className="prescription-receipt__eye-title">
              <span className="prescription-receipt__badge prescription-receipt__badge--od">OD</span>
              <span>Right Eye (Oculus Dexter)</span>
            </div>
            <div className="prescription-receipt__values">
              <div className="prescription-receipt__metric">
                <span className="prescription-receipt__metric-label">SPH</span>
                <span className="prescription-receipt__metric-val">{formatPower(data.od.sph)}</span>
              </div>
              <div className="prescription-receipt__metric">
                <span className="prescription-receipt__metric-label">CYL</span>
                <span className="prescription-receipt__metric-val">{formatPower(data.od.cyl)}</span>
              </div>
              <div className="prescription-receipt__metric">
                <span className="prescription-receipt__metric-label">Axis</span>
                <span className="prescription-receipt__metric-val">{data.od.axis}°</span>
              </div>
            </div>
          </div>

          <div className="prescription-receipt__eye-card">
            <div className="prescription-receipt__eye-title">
              <span className="prescription-receipt__badge prescription-receipt__badge--os">OS</span>
              <span>Left Eye (Oculus Sinister)</span>
            </div>
            <div className="prescription-receipt__values">
              <div className="prescription-receipt__metric">
                <span className="prescription-receipt__metric-label">SPH</span>
                <span className="prescription-receipt__metric-val">{formatPower(data.os.sph)}</span>
              </div>
              <div className="prescription-receipt__metric">
                <span className="prescription-receipt__metric-label">CYL</span>
                <span className="prescription-receipt__metric-val">{formatPower(data.os.cyl)}</span>
              </div>
              <div className="prescription-receipt__metric">
                <span className="prescription-receipt__metric-label">Axis</span>
                <span className="prescription-receipt__metric-val">{data.os.axis}°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

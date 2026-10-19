import type {
  EyeKey,
  FieldKey,
  PrescriptionFormState,
  ValidationConfig,
  ValidationResult,
  ValidationErrorMap,
  ParsedPrescription,
} from '../types/prescription';
import { EYE_METADATA, FIELD_METADATA } from '../types/prescription';

/**
 * Default configurable validation boundaries for eyeglass prescriptions.
 * Note: These are software validation ranges for this exercise,
 * not a replacement for professional optometry standards.
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  sph: {
    min: -20.0,
    max: 20.0,
    wholeNumbersOnly: false,
    unit: 'D',
  },
  cyl: {
    min: -8.0,
    max: 8.0,
    wholeNumbersOnly: false,
    unit: 'D',
  },
  axis: {
    min: 0,
    max: 180,
    wholeNumbersOnly: true,
    unit: '°',
  },
};

/**
 * Format a number nicely for display in validation messages (e.g. +20.00, -8.00, 180)
 */
export function formatBoundary(val: number, isAxis: boolean): string {
  if (isAxis) {
    return `${val}`;
  }
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}`;
}

export interface FieldValidationOutput {
  isValid: boolean;
  error?: string;
  parsedValue?: number;
}

/**
 * Pure reusable validator for a single prescription field.
 * Handles:
 * - Empty string detection (distinguishes empty from numeric 0)
 * - Strict non-numeric, NaN, and infinity rejection
 * - Strict integer-only rejection for Axis (rejecting any decimals)
 * - Boundary range validation
 * - Clear identification of eye (OD vs OS) and field name
 */
export function validateField(
  eye: EyeKey,
  field: FieldKey,
  rawValue: string,
  config: ValidationConfig = DEFAULT_VALIDATION_CONFIG
): FieldValidationOutput {
  const eyeMeta = EYE_METADATA[eye];
  const fieldMeta = FIELD_METADATA[field];
  const fieldConfig = config[field];
  const eyePrefix = `${eyeMeta.englishName} (${eyeMeta.badge})`;
  const fieldLabel = fieldMeta.shortLabel;

  // 1. Check for empty or missing value
  // Ensure that empty inputs are rejected and NOT silently converted to zero
  if (rawValue === undefined || rawValue === null || rawValue.trim() === '') {
    return {
      isValid: false,
      error: `${eyePrefix} ${fieldLabel} is required. Please enter a value.`,
    };
  }

  const trimmed = rawValue.trim();

  // 2. Strict Numeric Format Regex Check
  // Rejects invalid strings such as "abc", "--", "-.", "1..2", "NaN", "Infinity"
  const standardNumericRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
  if (!standardNumericRegex.test(trimmed)) {
    return {
      isValid: false,
      error: `${eyePrefix} ${fieldLabel} must be a valid number (e.g. ${fieldMeta.placeholder.split(' ')[1] || '0'}).`,
    };
  }

  // 3. Decimal and Integer Format check for Axis (whole numbers only)
  if (fieldConfig.wholeNumbersOnly) {
    // Check if user entered a decimal point (e.g. 45.5, 90.0, 0.2)
    if (trimmed.includes('.')) {
      return {
        isValid: false,
        error: `${eyePrefix} ${fieldLabel} must be a whole number (0 to 180°). Decimal values like "${trimmed}" are not permitted.`,
      };
    }

    // Reject negative signs (e.g. "-10", "-0") or non-integer characters
    if (!/^\+?\d+$/.test(trimmed)) {
      return {
        isValid: false,
        error: `${eyePrefix} ${fieldLabel} must be a non-negative whole number between 0 and 180°. Negative values are not permitted.`,
      };
    }
  }

  // 4. Parse floating point / integer
  const parsed = Number(trimmed);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return {
      isValid: false,
      error: `${eyePrefix} ${fieldLabel} must be a finite numerical value.`,
    };
  }

  // 5. Boundary Range Check
  if (parsed < fieldConfig.min || parsed > fieldConfig.max) {
    const minStr = formatBoundary(fieldConfig.min, !!fieldConfig.wholeNumbersOnly);
    const maxStr = formatBoundary(fieldConfig.max, !!fieldConfig.wholeNumbersOnly);
    const unitFormatted = fieldConfig.unit === '°' ? '°' : ` ${fieldConfig.unit}`;
    return {
      isValid: false,
      error: `${eyePrefix} ${fieldLabel} must be between ${minStr} and ${maxStr}${unitFormatted}. Entered: ${trimmed}${unitFormatted}.`,
    };
  }

  return {
    isValid: true,
    parsedValue: parsed,
  };
}

/**
 * Pure reusable function to validate the full prescription form.
 * Validates OD and OS independently, collecting all errors.
 * Returns a ValidationResult with total count, error map, and parsed data.
 */
export function validatePrescription(
  formState: PrescriptionFormState,
  config: ValidationConfig = DEFAULT_VALIDATION_CONFIG
): ValidationResult {
  const errors: ValidationErrorMap = {};
  let errorCount = 0;

  const parsedOd: Partial<ParsedPrescription['od']> = {};
  const parsedOs: Partial<ParsedPrescription['os']> = {};

  const eyes: EyeKey[] = ['od', 'os'];
  const fields: FieldKey[] = ['sph', 'cyl', 'axis'];

  for (const eye of eyes) {
    for (const field of fields) {
      const rawValue = formState[eye][field];
      const result = validateField(eye, field, rawValue, config);

      if (!result.isValid && result.error) {
        errors[`${eye}.${field}`] = result.error;
        errorCount++;
      } else if (result.isValid && result.parsedValue !== undefined) {
        if (eye === 'od') {
          parsedOd[field] = result.parsedValue;
        } else {
          parsedOs[field] = result.parsedValue;
        }
      }
    }
  }

  const isValid = errorCount === 0;

  let parsedData: ParsedPrescription | undefined = undefined;
  if (
    isValid &&
    parsedOd.sph !== undefined &&
    parsedOd.cyl !== undefined &&
    parsedOd.axis !== undefined &&
    parsedOs.sph !== undefined &&
    parsedOs.cyl !== undefined &&
    parsedOs.axis !== undefined
  ) {
    parsedData = {
      od: {
        sph: parsedOd.sph,
        cyl: parsedOd.cyl,
        axis: parsedOd.axis,
      },
      os: {
        sph: parsedOs.sph,
        cyl: parsedOs.cyl,
        axis: parsedOs.axis,
      },
    };
  }

  return {
    isValid,
    errors,
    errorCount,
    parsedData,
    timestamp: new Date().toLocaleTimeString(),
  };
}

/**
 * Helper to generate empty form state
 */
export function createEmptyFormState(): PrescriptionFormState {
  return {
    od: { sph: '', cyl: '', axis: '' },
    os: { sph: '', cyl: '', axis: '' },
  };
}

/**
 * Helper to generate a prefilled sample state for testing
 */
export function getSamplePresets(): Record<string, { label: string; description: string; state: PrescriptionFormState }> {
  return {
    userPrescription: {
      label: 'User Prescription (+1.50 / -1.00 / 105°)',
      description: 'Valid bilateral prescription with SPH +1.50, CYL -1.00, and Axis 105°',
      state: {
        od: { sph: '+1.50', cyl: '-1.00', axis: '105' },
        os: { sph: '+1.50', cyl: '-1.00', axis: '105' },
      },
    },
    validStandard: {
      label: 'Standard Valid Prescription',
      description: 'Typical mild myopia and astigmatism correction',
      state: {
        od: { sph: '-2.25', cyl: '-0.75', axis: '90' },
        os: { sph: '-1.75', cyl: '-1.00', axis: '105' },
      },
    },
    validBoundary: {
      label: 'Valid Boundary Values',
      description: 'Minimum (-20.00 SPH, -8.00 CYL, 0° Axis) and Maximum (+20.00 SPH, +8.00 CYL, 180° Axis)',
      state: {
        od: { sph: '-20.00', cyl: '-8.00', axis: '0' },
        os: { sph: '+20.00', cyl: '+8.00', axis: '180' },
      },
    },
    invalidRanges: {
      label: 'Out of Range & Decimal Axis',
      description: 'Demonstrates out of range SPH/CYL and decimal Axis rejection',
      state: {
        od: { sph: '-25.00', cyl: '+10.50', axis: '45.5' },
        os: { sph: '+22.00', cyl: '-9.00', axis: '190' },
      },
    },
    invalidTypes: {
      label: 'Non-Numeric & Negative Axis',
      description: 'Demonstrates text inputs and negative axis rejection',
      state: {
        od: { sph: 'invalid', cyl: '--', axis: '-15' },
        os: { sph: '+2.50', cyl: 'abc', axis: '180' },
      },
    },
  };
}

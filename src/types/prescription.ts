export type EyeKey = 'od' | 'os';
export type FieldKey = 'sph' | 'cyl' | 'axis';

export interface EyeLabels {
  key: EyeKey;
  latinName: string;
  englishName: string;
  badge: string;
}

export const EYE_METADATA: Record<EyeKey, EyeLabels> = {
  od: {
    key: 'od',
    latinName: 'Oculus Dexter',
    englishName: 'Right Eye',
    badge: 'OD',
  },
  os: {
    key: 'os',
    latinName: 'Oculus Sinister',
    englishName: 'Left Eye',
    badge: 'OS',
  },
};

export interface FieldMetadata {
  key: FieldKey;
  label: string;
  shortLabel: string;
  fullName: string;
  unit: string;
  placeholder: string;
  description: string;
  step?: string;
  min: number;
  max: number;
  wholeNumbersOnly?: boolean;
}

export const FIELD_METADATA: Record<FieldKey, FieldMetadata> = {
  sph: {
    key: 'sph',
    label: 'SPH (Sphere)',
    shortLabel: 'SPH',
    fullName: 'Sphere Power',
    unit: 'D',
    placeholder: 'e.g. -2.25 or +1.50',
    description: 'Refractive correction for nearsightedness (-) or farsightedness (+)',
    step: '0.25',
    min: -20.0,
    max: 20.0,
  },
  cyl: {
    key: 'cyl',
    label: 'CYL (Cylinder)',
    shortLabel: 'CYL',
    fullName: 'Cylinder Power',
    unit: 'D',
    placeholder: 'e.g. -1.00 or +0.75',
    description: 'Astigmatism correction power',
    step: '0.25',
    min: -8.0,
    max: 8.0,
  },
  axis: {
    key: 'axis',
    label: 'Axis (Orientation)',
    shortLabel: 'Axis',
    fullName: 'Cylinder Axis',
    unit: '°',
    placeholder: 'e.g. 90 or 180',
    description: 'Orientation of the astigmatism correction (whole numbers 0 to 180)',
    step: '1',
    min: 0,
    max: 180,
    wholeNumbersOnly: true,
  },
};

// Form state stores raw strings to prevent silent zeroes on empty fields
export interface EyeFormState {
  sph: string;
  cyl: string;
  axis: string;
}

export interface PrescriptionFormState {
  od: EyeFormState;
  os: EyeFormState;
}

// Clean parsed domain types
export interface ParsedEyePrescription {
  sph: number;
  cyl: number;
  axis: number;
}

export interface ParsedPrescription {
  od: ParsedEyePrescription;
  os: ParsedEyePrescription;
}

// Validation types
export type FormFieldPath = `${EyeKey}.${FieldKey}`;

export type ValidationErrorMap = Partial<Record<FormFieldPath, string>>;

export interface ValidationConfigItem {
  min: number;
  max: number;
  wholeNumbersOnly?: boolean;
  unit: string;
}

export interface ValidationConfig {
  sph: ValidationConfigItem;
  cyl: ValidationConfigItem;
  axis: ValidationConfigItem;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorMap;
  errorCount: number;
  parsedData?: ParsedPrescription;
  timestamp: string;
}

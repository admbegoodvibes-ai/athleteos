export type ConsentType = 'privacy_policy' | 'terms_of_service' | 'data_processing';

export interface ConsentRecord {
  id?: string;
  userId: string;
  consentType: ConsentType;
  version: string;
  acceptedAt: string;
}

export type DataSubjectRequestType = 'export' | 'delete' | 'modify';

export const CONSENT_VERSIONS = {
  PRIVACY_POLICY: '1.0.0',
  TERMS_OF_SERVICE: '1.0.0',
  DATA_PROCESSING: '1.0.0'
} as const;

export function getConsentVersion(type: ConsentType): string {
  switch (type) {
    case 'privacy_policy': return CONSENT_VERSIONS.PRIVACY_POLICY;
    case 'terms_of_service': return CONSENT_VERSIONS.TERMS_OF_SERVICE;
    case 'data_processing': return CONSENT_VERSIONS.DATA_PROCESSING;
  }
}

export function isMinor(dateOfBirth: Date | string): boolean {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age < 18;
}

export function requiresGuardianConsent(dateOfBirth: Date | string): boolean {
  return isMinor(dateOfBirth);
}

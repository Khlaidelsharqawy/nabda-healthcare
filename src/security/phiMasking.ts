/**
 * Enterprise Security Layer: Protected Health Information (PHI) Masking
 * Enforces HIPAA & GDPR-compliant de-identification on user interfaces and logs.
 */

/**
 * Masks National ID numbers (e.g. "28408140102938" -> "2840******2938").
 * Reveals only the first 4 and last 4 digits.
 */
export function maskNationalId(id: string): string {
  if (!id || typeof id !== 'string') return '';
  const clean = id.trim();
  if (clean.length <= 8) return '********';
  const first = clean.slice(0, 4);
  const last = clean.slice(-4);
  const maskedLength = Math.max(0, clean.length - 8);
  return `${first}${'*'.repeat(maskedLength)}${last}`;
}

/**
 * Masks Phone Numbers (e.g. "+20 100 123 4567" -> "+20 100 *** *567").
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  const clean = phone.trim();
  if (clean.length <= 6) return '***-***';
  const prefix = clean.slice(0, 7);
  const suffix = clean.slice(-3);
  return `${prefix} *** *${suffix}`;
}

/**
 * Masks Medical Record Numbers (MRN) for public or non-privileged displays (e.g. "#EG-8933" -> "#EG-***3").
 */
export function maskMrn(mrn: string): string {
  if (!mrn || typeof mrn !== 'string') return '';
  const clean = mrn.trim();
  if (clean.length <= 4) return '****';
  const prefix = clean.slice(0, 4);
  const suffix = clean.slice(-1);
  return `${prefix}***${suffix}`;
}

/**
 * Redacts PHI fields from any object for safe serialization, debugging, or logging.
 */
export function redactPhi<T extends Record<string, unknown>>(record: T): T {
  if (!record || typeof record !== 'object') return record;
  const redacted = { ...record };

  const phiKeys = [
    'nationalId',
    'national_id',
    'phone',
    'phoneNumber',
    'phone_number',
    'whatsapp_phone',
    'dateOfBirth',
    'date_of_birth',
    'emergencyContact',
    'emergency_contact_phone',
    'medicalRecordNumber',
    'mrn',
  ];

  for (const key of phiKeys) {
    if (key in redacted && redacted[key]) {
      if (typeof redacted[key] === 'string') {
        const val = redacted[key] as string;
        if (key.includes('national')) {
          redacted[key as keyof T] = maskNationalId(val) as unknown as T[keyof T];
        } else if (key.includes('phone')) {
          redacted[key as keyof T] = maskPhoneNumber(val) as unknown as T[keyof T];
        } else if (key.includes('mrn') || key.includes('medicalRecord')) {
          redacted[key as keyof T] = maskMrn(val) as unknown as T[keyof T];
        } else {
          redacted[key as keyof T] = '[REDACTED_PHI]' as unknown as T[keyof T];
        }
      }
    }
  }

  return redacted;
}

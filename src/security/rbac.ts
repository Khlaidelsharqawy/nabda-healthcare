/**
 * Enterprise Security Layer: Role-Based Access Control (RBAC) & Authority Enforcement
 * Strictly limits administrative powers, PHI access, and public visibility controls.
 */

export type UserRole = 'super_admin' | 'doctor' | 'assistant' | 'patient';

export type SecurityPermission =
  | 'MANAGE_PUBLIC_VISIBILITY'
  | 'PROVISION_TENANT'
  | 'VIEW_ALL_CLINICS'
  | 'MANAGE_INTEGRATIONS'
  | 'VIEW_PHI_PATIENT_RECORDS'
  | 'CREATE_CLINICAL_ENCOUNTER'
  | 'SIGN_PRESCRIPTION'
  | 'ORDER_LAB_TEST'
  | 'ACCESS_VOICE_SCRIBE'
  | 'TRIAGE_PATIENT_INTAKE'
  | 'CHECK_IN_PATIENT'
  | 'VIEW_OWN_MEDICAL_RECORD'
  | 'BOOK_APPOINTMENT';

const ROLE_PERMISSIONS: Record<UserRole, SecurityPermission[]> = {
  super_admin: [
    'MANAGE_PUBLIC_VISIBILITY',
    'PROVISION_TENANT',
    'VIEW_ALL_CLINICS',
    'MANAGE_INTEGRATIONS',
    'VIEW_PHI_PATIENT_RECORDS',
  ],
  doctor: [
    'VIEW_PHI_PATIENT_RECORDS',
    'CREATE_CLINICAL_ENCOUNTER',
    'SIGN_PRESCRIPTION',
    'ORDER_LAB_TEST',
    'ACCESS_VOICE_SCRIBE',
  ],
  assistant: [
    'TRIAGE_PATIENT_INTAKE',
    'CHECK_IN_PATIENT',
    'VIEW_PHI_PATIENT_RECORDS',
  ],
  patient: [
    'VIEW_OWN_MEDICAL_RECORD',
    'BOOK_APPOINTMENT',
  ],
};

/**
 * Checks if a user role has the required permission.
 */
export function hasPermission(role: UserRole | string, permission: SecurityPermission): boolean {
  const perms = ROLE_PERMISSIONS[role as UserRole];
  if (!perms) return false;
  return perms.includes(permission);
}

/**
 * Enforces permission check. Throws a SecurityError if unauthorized.
 */
export function assertPermission(role: UserRole | string, permission: SecurityPermission, context?: string): void {
  if (!hasPermission(role, permission)) {
    const detail = context ? ` during ${context}` : '';
    throw new Error(`[SECURITY_VIOLATION] Role '${role}' lacks permission '${permission}'${detail}`);
  }
}

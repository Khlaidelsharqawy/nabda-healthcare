import { UserRole, TenantId } from './types';

export type Permission =
  | 'manage_platform'
  | 'manage_integrations'
  | 'manage_tenants'
  | 'prescribe_medication'
  | 'sign_soap_notes'
  | 'order_diagnostics'
  | 'intake_patients'
  | 'view_assigned_patients'
  | 'view_own_health_records'
  | 'access_voice_scribe';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'super-admin': [
    'manage_platform',
    'manage_integrations',
    'manage_tenants',
    'order_diagnostics',
    'view_assigned_patients',
  ],
  super_admin: [
    'manage_platform',
    'manage_integrations',
    'manage_tenants',
    'order_diagnostics',
    'view_assigned_patients',
  ],
  'clinic-admin': [
    'manage_integrations',
    'intake_patients',
    'view_assigned_patients',
  ],
  doctor: [
    'prescribe_medication',
    'sign_soap_notes',
    'order_diagnostics',
    'view_assigned_patients',
    'access_voice_scribe',
  ],
  assistant: [
    'intake_patients',
    'order_diagnostics',
    'view_assigned_patients',
  ],
  patient: [
    'view_own_health_records',
  ],
};

/**
 * Check if a role has a specific business permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Enforce strict multi-tenant boundary
 * Throws security exception if user attempts cross-tenant access without super-admin role
 */
export function assertTenantScope(userTenantId: TenantId, targetTenantId: TenantId, role: UserRole): void {
  if (role === 'super-admin') return;
  if (userTenantId !== targetTenantId) {
    throw new Error(`SECURITY VIOLATION (403): Cross-tenant access denied. User tenant: ${userTenantId}, Target tenant: ${targetTenantId}`);
  }
}

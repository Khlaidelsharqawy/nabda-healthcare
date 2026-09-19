/**
 * Domain Value Objects & Strong Types
 * Pure domain logic independent of any external frameworks or libraries.
 */

export type TenantId = string;
export type UserId = string;
export type PatientId = string;
export type AppointmentId = string;
export type PrescriptionId = string;
export type EncounterId = string;
export type LabOrderId = string;
export type AuditLogId = string;

export type UserRole = 'super-admin' | 'super_admin' | 'clinic-admin' | 'doctor' | 'assistant' | 'patient';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'in-room'
  | 'completed'
  | 'cancelled';

export type PrescriptionStatus =
  | 'active'
  | 'completed'
  | 'discontinued'
  | 'refill-requested';

export type LabOrderStatus =
  | 'ordered'
  | 'accessioned'
  | 'processing'
  | 'completed'
  | 'recollection-required';

export type EncounterStatus =
  | 'draft'
  | 'in-review'
  | 'attested'
  | 'signed';

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
  recordedAt: string;
}

export interface MedicationGuidance {
  doseForm: 'tablet' | 'capsule' | 'drops' | 'injection' | 'inhaler' | 'topical';
  emojiBadge: string;
  timingEmoji: string;
  foodInstruction: 'before-meal' | 'after-meal' | 'with-meal' | 'empty-stomach' | 'anytime';
  waterInstruction: 'full-glass' | 'standard' | 'not-applicable';
  spokenInstructionsAr: string;
  spokenInstructionsEn: string;
}

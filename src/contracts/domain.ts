export type UserRole = 'doctor' | 'assistant' | 'patient' | 'super-admin' | 'public-clinic';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  branding?: { logoUrl?: string; primaryColor?: string };
}

export interface Patient {
  id: string;
  tenantId: string;
  displayName: string;
  medicalRecordNumber?: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  patientId?: string;
  status: 'scheduled' | 'checked-in' | 'in-room' | 'completed' | 'cancelled';
}

export interface AIDraft {
  id: string;
  tenantId: string;
  patientId?: string;
  reviewState: 'pending' | 'reviewed' | 'attested';
}

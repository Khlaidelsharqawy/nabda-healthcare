import { Patient, Appointment, Prescription, ClinicalEncounter, LabOrder } from './entities';
import { TenantId } from './types';

export interface DomainEvent<T = unknown> {
  eventId: string;
  eventType: string;
  tenantId: TenantId;
  occurredAt: string;
  payload: T;
}

export interface PatientCreatedPayload {
  patient: Patient;
  generatedAccount: {
    username: string;
    temporaryPassword: string;
    loginUrl: string;
  };
}

export interface AppointmentBookedPayload {
  appointment: Appointment;
  notificationTarget: {
    patientName: string;
    phone: string;
    language: 'ar' | 'en';
  };
}

export interface PrescriptionIssuedPayload {
  prescription: Prescription;
  patientPhone: string;
  patientName: string;
}

export interface SoapNoteAttestedPayload {
  encounter: ClinicalEncounter;
  anonymizedCorpusEntry?: {
    specialty: string;
    prompt: string;
    response: string;
  };
}

export interface LabOrderPlacedPayload {
  labOrder: LabOrder;
}

export function createDomainEvent<T>(eventType: string, tenantId: TenantId, payload: T): DomainEvent<T> {
  return {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    eventType,
    tenantId,
    occurredAt: new Date().toISOString(),
    payload,
  };
}

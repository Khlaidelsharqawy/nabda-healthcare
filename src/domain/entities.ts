import {
  TenantId,
  UserId,
  PatientId,
  AppointmentId,
  PrescriptionId,
  EncounterId,
  LabOrderId,
  AuditLogId,
  UserRole,
  AppointmentStatus,
  PrescriptionStatus,
  LabOrderStatus,
  EncounterStatus,
  VitalSigns,
  MedicationGuidance,
} from './types';

/**
 * Tenant Domain Entity - Multi-tenant isolation boundary
 */
export interface Tenant {
  id: TenantId;
  slug: string;
  name: string;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
  };
  isActive: boolean;
  createdAt: string;
}

/**
 * User Domain Entity
 */
export interface User {
  id: UserId;
  tenantId: TenantId;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  specialty?: string;
  nationalId?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Patient Domain Entity
 */
export interface Patient {
  id: PatientId;
  tenantId: TenantId;
  medicalRecordNumber: string; // e.g. #EG-8933
  nationalId: string;
  fullNameAr: string;
  fullNameEn: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phone: string;
  whatsappOptIn: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  latestVitals?: VitalSigns;
  status: 'stable' | 'follow-up' | 'awaiting-labs';
  createdAt: string;
}

/**
 * Appointment Domain Entity
 */
export interface Appointment {
  id: AppointmentId;
  tenantId: TenantId;
  patientId: PatientId;
  patientName: string;
  patientPhone: string;
  clinicianId: UserId;
  clinicianName: string;
  scheduledAt: string; // ISO string
  timeSlot: string; // e.g. "09:30 AM"
  dateFormatted: string; // e.g. "Tomorrow, May 15"
  visitType: 'scheduled' | 'walk-in' | 'lab-review' | 'follow-up';
  status: AppointmentStatus;
  room: string;
  clinicName: string;
  chiefComplaint?: string;
  estimatedWaitMinutes?: number;
  preparationChecklist: string[];
  createdAt: string;
}

/**
 * Prescription Item Domain Entity
 */
export interface PrescriptionItem {
  id: string;
  medicationName: string;
  medicationNameAr: string;
  dosage: string; // e.g. "10mg"
  frequency: string; // e.g. "Once Daily"
  timing: string; // e.g. "Morning"
  durationDays: number;
  instructions: string;
  instructionsAr: string;
  guidance: MedicationGuidance;
}

/**
 * Prescription Domain Entity
 */
export interface Prescription {
  id: PrescriptionId;
  tenantId: TenantId;
  patientId: PatientId;
  clinicianId: UserId;
  clinicianName: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  refillsAllowed: number;
  refillsUsed: number;
  diagnoses: string[];
  issuedAt: string;
  expiresAt: string;
}

/**
 * Clinical Encounter / SOAP Note Domain Entity
 */
export interface ClinicalEncounter {
  id: EncounterId;
  tenantId: TenantId;
  patientId: PatientId;
  clinicianId: UserId;
  appointmentId?: AppointmentId;
  status: EncounterStatus;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  aiScribeTranscript?: string;
  aiConfidenceScore?: number;
  doctorSignature?: {
    signedBy: string;
    signedAt: string;
    signatureHash: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Laboratory Order Domain Entity
 */
export interface LabOrder {
  id: LabOrderId;
  tenantId: TenantId;
  patientId: PatientId;
  patientName: string;
  patientMrn: string;
  orderingClinicianId: UserId;
  orderingClinicianName: string;
  orderNumber: string; // e.g. #ORD-2025-0811
  testType: string;
  specimenType: 'blood' | 'urine' | 'swab' | 'other';
  priority: 'routine' | 'urgent' | 'stat';
  status: LabOrderStatus;
  accessionNumber?: string;
  collectedAt?: string;
  resultsText?: string;
  isAbnormal?: boolean;
  createdAt: string;
}

/**
 * Immutable Audit Log Domain Entity
 */
export interface AuditLog {
  id: AuditLogId;
  tenantId: TenantId;
  actorId: UserId;
  actorRole: UserRole;
  action: string;
  entityType: 'patient' | 'appointment' | 'prescription' | 'encounter' | 'lab_order' | 'integration' | 'auth';
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

/**
 * Clinic Automation Integration Domain Entity
 */
export interface ClinicIntegration {
  id: string;
  tenantId: TenantId;
  integrationType: 'n8n_webhook' | 'whatsapp_business' | 'lis_gateway' | 'kms_encryption';
  serviceName: string;
  endpointUrl: string;
  eventsSubscribed: string[];
  isActive: boolean;
  lastPingStatus: 'healthy' | 'degraded' | 'unreachable';
  lastPingAt: string;
  createdAt: string;
}

/**
 * Public & Admin Clinic Entity
 */
export interface Clinic {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  address: string;
  addressAr: string;
  city: string;
  cityAr: string;
  district: string;
  districtAr: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  specialtiesAr: string[];
  operatingHours: string;
  operatingHoursAr: string;
  isVerified: boolean;
  badge?: string;
  badgeAr?: string;
  doctorCount: number;
  consultationFeeRange: string;
  consultationFeeRangeAr: string;
  emergencyAvailable: boolean;
  isDemo: boolean;
  showOnPublicSite?: boolean;
  isPublished?: boolean;
  mapCoordinates: {
    latApprox: number;
    lngApprox: number;
    label: string;
  };
}

/**
 * Doctor Profile Entity
 */
export interface Doctor {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  specialty: string;
  specialtyAr: string;
  clinicId: string;
  clinicName: string;
  clinicNameAr: string;
  city: string;
  cityAr: string;
  district: string;
  districtAr: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  availability: 'today' | 'tomorrow' | 'this-week';
  availabilityText: string;
  availabilityTextAr: string;
  languages: string[];
  consultationFee: number;
  bio: string;
  bioAr: string;
  badge: string;
  badgeAr: string;
  avatarLetter: string;
  availableSlots: string[];
  isDemo: boolean;
  showOnPublicSite?: boolean;
  isPublished?: boolean;
}

/**
 * Platform Service Entity
 */
export interface PlatformService {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  features: string[];
  featuresAr: string[];
  route: string;
  showOnPublicSite?: boolean;
  isPublished?: boolean;
}

/**
 * Specialty Taxonomy Item
 */
export interface SpecialtyItem {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  doctorCount: number;
  clinicCount: number;
}

/**
 * Geographic Location Item
 */
export interface LocationItem {
  id: string;
  city: string;
  cityAr: string;
  district: string;
  districtAr: string;
  clinicCount: number;
  doctorCount: number;
}

/**
 * Platform Global Analytics Stats
 */
export interface PlatformStats {
  clinics: number;
  doctors: number;
  specialties: number;
  appointments: number;
  locations: number;
  isDemo: boolean;
}

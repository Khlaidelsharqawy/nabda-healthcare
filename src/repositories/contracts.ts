import {
  Patient,
  Appointment,
  Prescription,
  LabOrder,
  AuditLog,
  ClinicIntegration,
  PatientId,
  AppointmentId,
  PrescriptionId,
  LabOrderId,
  TenantId,
  AppointmentStatus,
  LabOrderStatus,
  User,
  Clinic,
  Doctor,
  PlatformService,
  SpecialtyItem,
  LocationItem,
  PlatformStats,
} from '../domain';

export interface IPatientRepository {
  findById(id: PatientId, tenantId: TenantId): Promise<Patient | null>;
  findByMrn(mrn: string, tenantId: TenantId): Promise<Patient | null>;
  findByNationalId(nationalId: string, tenantId: TenantId): Promise<Patient | null>;
  list(tenantId: TenantId, query?: string): Promise<Patient[]>;
  save(patient: Patient): Promise<Patient>;
  update(patient: Patient): Promise<Patient>;
}

export interface IAppointmentRepository {
  findById(id: AppointmentId, tenantId: TenantId): Promise<Appointment | null>;
  listByTenant(tenantId: TenantId, date?: string): Promise<Appointment[]>;
  listByPatient(patientId: PatientId, tenantId: TenantId): Promise<Appointment[]>;
  listByClinician(clinicianId: string, tenantId: TenantId, date?: string): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<Appointment>;
  updateStatus(id: AppointmentId, status: AppointmentStatus, tenantId: TenantId): Promise<void>;
  checkConflict(clinicianId: string, scheduledAt: string, tenantId: TenantId): Promise<boolean>;
}

export interface IPrescriptionRepository {
  findById(id: PrescriptionId, tenantId: TenantId): Promise<Prescription | null>;
  listByPatient(patientId: PatientId, tenantId: TenantId): Promise<Prescription[]>;
  save(prescription: Prescription): Promise<Prescription>;
}

export interface ILabOrderRepository {
  findById(id: LabOrderId, tenantId: TenantId): Promise<LabOrder | null>;
  listByPatient(patientId: PatientId, tenantId: TenantId): Promise<LabOrder[]>;
  listPending(tenantId: TenantId): Promise<LabOrder[]>;
  save(order: LabOrder): Promise<LabOrder>;
  updateStatus(id: LabOrderId, status: LabOrderStatus, accessionNumber?: string, tenantId?: TenantId): Promise<void>;
}

export interface IAuditLogRepository {
  append(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  listByTenant(tenantId: TenantId, limit?: number): Promise<AuditLog[]>;
}

export interface IIntegrationRepository {
  list(tenantId: TenantId): Promise<ClinicIntegration[]>;
  save(integration: ClinicIntegration): Promise<ClinicIntegration>;
  delete(id: string, tenantId: TenantId): Promise<void>;
  findForEvent(eventType: string, tenantId: TenantId): Promise<ClinicIntegration[]>;
}

export interface IClinicRepository {
  list(): Promise<Clinic[]>;
  findById(id: string): Promise<Clinic | null>;
  save(clinic: Clinic): Promise<Clinic>;
  delete(id: string): Promise<void>;
  query(params: { searchQuery?: string; specialty?: string; city?: string; minRating?: number }): Promise<Clinic[]>;
}

export interface IDoctorRepository {
  list(): Promise<Doctor[]>;
  findById(id: string): Promise<Doctor | null>;
  findByClinic(clinicId: string): Promise<Doctor[]>;
  save(doctor: Doctor): Promise<Doctor>;
  query(params: { searchQuery?: string; specialty?: string; clinicId?: string; city?: string; minRating?: number }): Promise<Doctor[]>;
}

export interface IPlatformRepository {
  getServices(): Promise<PlatformService[]>;
  getSpecialties(): Promise<SpecialtyItem[]>;
  getLocations(): Promise<LocationItem[]>;
  getStats(): Promise<PlatformStats>;
}

export interface IUserRepository {
  list(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

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
import {
  IPatientRepository,
  IAppointmentRepository,
  IPrescriptionRepository,
  ILabOrderRepository,
  IAuditLogRepository,
  IIntegrationRepository,
  IClinicRepository,
  IDoctorRepository,
  IPlatformRepository,
  IUserRepository,
} from './contracts';
import {
  SEED_PATIENTS,
  SEED_APPOINTMENTS,
  SEED_PRESCRIPTIONS,
  SEED_LAB_ORDERS,
  SEED_USERS,
  SEED_SERVICES,
  SEED_SPECIALTIES,
  SEED_LOCATIONS,
  SEED_STATS,
} from '../data/mock/seeds';
import { getLiveClinics, getLiveDoctors } from '../data/mock';

// Local storage helper
function loadStore<T>(key: string, defaultValue: T[]): T[] {
  try {
    const raw = localStorage.getItem(`aegis_repo_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading store ${key}`, e);
  }
  return defaultValue;
}

function saveStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(`aegis_repo_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving store ${key}`, e);
  }
}

// ---------------------------------------------------------------------------
// In-Memory Patient Repository
// ---------------------------------------------------------------------------
export class InMemoryPatientRepository implements IPatientRepository {
  private patients: Patient[] = loadStore<Patient>('patients', SEED_PATIENTS);

  async findById(id: PatientId, tenantId: TenantId): Promise<Patient | null> {
    const p = this.patients.find((p) => p.id === id && p.tenantId === tenantId);
    return p ? { ...p } : null;
  }

  async findByMrn(mrn: string, tenantId: TenantId): Promise<Patient | null> {
    const p = this.patients.find((p) => p.medicalRecordNumber.toLowerCase() === mrn.toLowerCase() && p.tenantId === tenantId);
    return p ? { ...p } : null;
  }

  async findByNationalId(nationalId: string, tenantId: TenantId): Promise<Patient | null> {
    const p = this.patients.find((p) => p.nationalId === nationalId && p.tenantId === tenantId);
    return p ? { ...p } : null;
  }

  async list(tenantId: TenantId, query?: string): Promise<Patient[]> {
    let result = this.patients.filter((p) => p.tenantId === tenantId);
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.fullNameAr.toLowerCase().includes(q) ||
          p.fullNameEn.toLowerCase().includes(q) ||
          p.medicalRecordNumber.toLowerCase().includes(q) ||
          p.nationalId.includes(q) ||
          p.phone.includes(q)
      );
    }
    return result.map((p) => ({ ...p }));
  }

  async save(patient: Patient): Promise<Patient> {
    this.patients.unshift(patient);
    saveStore('patients', this.patients);
    return { ...patient };
  }

  async update(patient: Patient): Promise<Patient> {
    const idx = this.patients.findIndex((p) => p.id === patient.id && p.tenantId === patient.tenantId);
    if (idx >= 0) {
      this.patients[idx] = { ...patient };
      saveStore('patients', this.patients);
    }
    return { ...patient };
  }
}

// ---------------------------------------------------------------------------
// In-Memory Appointment Repository
// ---------------------------------------------------------------------------
export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = loadStore<Appointment>('appointments', SEED_APPOINTMENTS);

  async findById(id: AppointmentId, tenantId: TenantId): Promise<Appointment | null> {
    const a = this.appointments.find((a) => a.id === id && a.tenantId === tenantId);
    return a ? { ...a } : null;
  }

  async listByTenant(tenantId: TenantId, date?: string): Promise<Appointment[]> {
    let result = this.appointments.filter((a) => a.tenantId === tenantId);
    if (date) {
      result = result.filter((a) => a.dateFormatted.includes(date) || a.scheduledAt.startsWith(date));
    }
    return result.map((a) => ({ ...a }));
  }

  async listByPatient(patientId: PatientId, tenantId: TenantId): Promise<Appointment[]> {
    return this.appointments
      .filter((a) => a.patientId === patientId && a.tenantId === tenantId)
      .map((a) => ({ ...a }));
  }

  async listByClinician(clinicianId: string, tenantId: TenantId, date?: string): Promise<Appointment[]> {
    let result = this.appointments.filter((a) => a.clinicianId === clinicianId && a.tenantId === tenantId);
    if (date) {
      result = result.filter((a) => a.scheduledAt.startsWith(date));
    }
    return result.map((a) => ({ ...a }));
  }

  async save(appointment: Appointment): Promise<Appointment> {
    this.appointments.unshift(appointment);
    saveStore('appointments', this.appointments);
    return { ...appointment };
  }

  async updateStatus(id: AppointmentId, status: AppointmentStatus, tenantId: TenantId): Promise<void> {
    const a = this.appointments.find((a) => a.id === id && a.tenantId === tenantId);
    if (a) {
      a.status = status;
      saveStore('appointments', this.appointments);
    }
  }

  async checkConflict(clinicianId: string, scheduledAt: string, tenantId: TenantId): Promise<boolean> {
    return this.appointments.some(
      (a) => a.clinicianId === clinicianId && a.tenantId === tenantId && a.scheduledAt === scheduledAt && a.status !== 'cancelled'
    );
  }
}

// ---------------------------------------------------------------------------
// In-Memory Prescription Repository
// ---------------------------------------------------------------------------
export class InMemoryPrescriptionRepository implements IPrescriptionRepository {
  private prescriptions: Prescription[] = loadStore<Prescription>('prescriptions', SEED_PRESCRIPTIONS);

  async findById(id: PrescriptionId, tenantId: TenantId): Promise<Prescription | null> {
    const rx = this.prescriptions.find((p) => p.id === id && p.tenantId === tenantId);
    return rx ? { ...rx } : null;
  }

  async listByPatient(patientId: PatientId, tenantId: TenantId): Promise<Prescription[]> {
    return this.prescriptions
      .filter((p) => p.patientId === patientId && p.tenantId === tenantId)
      .map((p) => ({ ...p }));
  }

  async save(prescription: Prescription): Promise<Prescription> {
    this.prescriptions.unshift(prescription);
    saveStore('prescriptions', this.prescriptions);
    return { ...prescription };
  }
}

// ---------------------------------------------------------------------------
// In-Memory Lab Order Repository
// ---------------------------------------------------------------------------
export class InMemoryLabOrderRepository implements ILabOrderRepository {
  private labOrders: LabOrder[] = loadStore<LabOrder>('lab_orders', SEED_LAB_ORDERS);

  async findById(id: LabOrderId, tenantId: TenantId): Promise<LabOrder | null> {
    const lo = this.labOrders.find((l) => l.id === id && l.tenantId === tenantId);
    return lo ? { ...lo } : null;
  }

  async listByPatient(patientId: PatientId, tenantId: TenantId): Promise<LabOrder[]> {
    return this.labOrders
      .filter((l) => l.patientId === patientId && l.tenantId === tenantId)
      .map((l) => ({ ...l }));
  }

  async listPending(tenantId: TenantId): Promise<LabOrder[]> {
    return this.labOrders
      .filter((l) => l.tenantId === tenantId && (l.status === 'ordered' || l.status === 'accessioned'))
      .map((l) => ({ ...l }));
  }

  async save(order: LabOrder): Promise<LabOrder> {
    this.labOrders.unshift(order);
    saveStore('lab_orders', this.labOrders);
    return { ...order };
  }

  async updateStatus(id: LabOrderId, status: LabOrderStatus, accessionNumber?: string, tenantId?: TenantId): Promise<void> {
    const lo = this.labOrders.find((l) => l.id === id && (!tenantId || l.tenantId === tenantId));
    if (lo) {
      lo.status = status;
      if (accessionNumber) lo.accessionNumber = accessionNumber;
      saveStore('lab_orders', this.labOrders);
    }
  }
}

// ---------------------------------------------------------------------------
// In-Memory Audit Log Repository
// ---------------------------------------------------------------------------
export class InMemoryAuditLogRepository implements IAuditLogRepository {
  private logs: AuditLog[] = loadStore<AuditLog>('audit_logs', []);

  async append(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const entry: AuditLog = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(entry);
    saveStore('audit_logs', this.logs);
    return entry;
  }

  async listByTenant(tenantId: TenantId, limit = 100): Promise<AuditLog[]> {
    return this.logs
      .filter((l) => l.tenantId === tenantId)
      .slice(0, limit)
      .map((l) => ({ ...l }));
  }
}

// ---------------------------------------------------------------------------
// In-Memory Integration Repository
// ---------------------------------------------------------------------------
export class InMemoryIntegrationRepository implements IIntegrationRepository {
  private integrations: ClinicIntegration[] = loadStore<ClinicIntegration>('integrations', [
    {
      id: 'int-n8n-default',
      tenantId: 'tenant-demo-01',
      integrationType: 'n8n_webhook',
      serviceName: 'n8n Primary Operations Hub',
      endpointUrl: 'https://n8n.example.com/webhook/aegis-operations',
      eventsSubscribed: ['PATIENT_CREATED', 'APPOINTMENT_BOOKED', 'SOAP_NOTE_FINALIZED', 'LAB_RESULT_READY'],
      isActive: true,
      lastPingStatus: 'healthy',
      lastPingAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'int-whatsapp-default',
      tenantId: 'tenant-demo-01',
      integrationType: 'whatsapp_business',
      serviceName: 'WhatsApp Triage Dispatcher',
      endpointUrl: 'https://n8n.example.com/webhook/aegis-whatsapp-dispatch',
      eventsSubscribed: ['PATIENT_CREATED', 'APPOINTMENT_BOOKED', 'LAB_RESULT_READY'],
      isActive: true,
      lastPingStatus: 'healthy',
      lastPingAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]);

  async list(tenantId: TenantId): Promise<ClinicIntegration[]> {
    return this.integrations
      .filter((i) => i.tenantId === tenantId || i.tenantId === 'global')
      .map((i) => ({ ...i }));
  }

  async save(integration: ClinicIntegration): Promise<ClinicIntegration> {
    const idx = this.integrations.findIndex((i) => i.id === integration.id);
    if (idx >= 0) {
      this.integrations[idx] = { ...integration };
    } else {
      this.integrations.unshift(integration);
    }
    saveStore('integrations', this.integrations);
    return { ...integration };
  }

  async delete(id: string, tenantId: TenantId): Promise<void> {
    this.integrations = this.integrations.filter((i) => !(i.id === id && (i.tenantId === tenantId || tenantId === 'global')));
    saveStore('integrations', this.integrations);
  }

  async findForEvent(eventType: string, tenantId: TenantId): Promise<ClinicIntegration[]> {
    return this.integrations
      .filter((i) => i.isActive && (i.tenantId === tenantId || i.tenantId === 'global') && i.eventsSubscribed.includes(eventType))
      .map((i) => ({ ...i }));
  }
}

// ---------------------------------------------------------------------------
// In-Memory User Repository
// ---------------------------------------------------------------------------
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = loadStore<User>('users', SEED_USERS);

  async list(): Promise<User[]> {
    return this.users.map((u) => ({ ...u }));
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    return user ? { ...user } : null;
  }

  async save(user: User): Promise<User> {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      this.users[idx] = { ...user };
    } else {
      this.users.unshift(user);
    }
    saveStore('users', this.users);
    return { ...user };
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id);
    saveStore('users', this.users);
  }
}

// ---------------------------------------------------------------------------
// In-Memory Clinic Repository
// ---------------------------------------------------------------------------
export class InMemoryClinicRepository implements IClinicRepository {
  private clinics: Clinic[] = loadStore<Clinic>('clinics', getLiveClinics());

  async list(): Promise<Clinic[]> {
    return this.clinics.map((c) => ({ ...c }));
  }

  async findById(id: string): Promise<Clinic | null> {
    const clinic = this.clinics.find((c) => c.id === id);
    return clinic ? { ...clinic } : null;
  }

  async save(clinic: Clinic): Promise<Clinic> {
    const idx = this.clinics.findIndex((c) => c.id === clinic.id);
    if (idx >= 0) {
      this.clinics[idx] = { ...clinic };
    } else {
      this.clinics.unshift(clinic);
    }
    saveStore('clinics', this.clinics);
    return { ...clinic };
  }

  async delete(id: string): Promise<void> {
    this.clinics = this.clinics.filter((c) => c.id !== id);
    saveStore('clinics', this.clinics);
  }

  async query(params: { searchQuery?: string; specialty?: string; city?: string }): Promise<Clinic[]> {
    return this.clinics.filter((clinic) => {
      if (params.specialty && params.specialty !== 'all' && !clinic.specialties.includes(params.specialty)) {
        return false;
      }
      if (params.city && params.city !== 'all') {
        const cityNorm = params.city.toLowerCase();
        if (!clinic.city.toLowerCase().includes(cityNorm) && !clinic.cityAr.includes(params.city)) {
          return false;
        }
      }
      if (params.searchQuery && params.searchQuery.trim() !== '') {
        const q = params.searchQuery.toLowerCase().trim();
        const matchName = clinic.name.toLowerCase().includes(q) || clinic.nameAr.includes(q);
        const matchSpec = clinic.specialties.some(s => s.toLowerCase().includes(q)) || clinic.specialtiesAr.some(s => s.includes(q));
        const matchCity = clinic.city.toLowerCase().includes(q) || clinic.cityAr.includes(q);
        return matchName || matchSpec || matchCity;
      }
      return true;
    });
  }
}

// ---------------------------------------------------------------------------
// In-Memory Doctor Repository
// ---------------------------------------------------------------------------
export class InMemoryDoctorRepository implements IDoctorRepository {
  private doctors: Doctor[] = loadStore<Doctor>('doctors', getLiveDoctors());

  async list(clinicId?: string): Promise<Doctor[]> {
    if (clinicId) {
      return this.doctors.filter((d) => d.clinicId === clinicId).map((d) => ({ ...d }));
    }
    return this.doctors.map((d) => ({ ...d }));
  }

  async findById(id: string): Promise<Doctor | null> {
    const doctor = this.doctors.find((d) => d.id === id);
    return doctor ? { ...doctor } : null;
  }

  async findByClinic(clinicId: string): Promise<Doctor[]> {
    return this.doctors.filter((d) => d.clinicId === clinicId).map((d) => ({ ...d }));
  }

  async save(doctor: Doctor): Promise<Doctor> {
    const idx = this.doctors.findIndex((d) => d.id === doctor.id);
    if (idx >= 0) {
      this.doctors[idx] = { ...doctor };
    } else {
      this.doctors.unshift(doctor);
    }
    saveStore('doctors', this.doctors);
    return { ...doctor };
  }

  async query(params: {
    searchQuery?: string;
    specialty?: string;
    clinicId?: string;
    city?: string;
    minRating?: number;
  }): Promise<Doctor[]> {
    return this.doctors.filter((doc) => {
      if (params.specialty && params.specialty !== 'all' && doc.specialty !== params.specialty) {
        return false;
      }
      if (params.clinicId && params.clinicId !== 'all' && doc.clinicId !== params.clinicId) {
        return false;
      }
      if (params.city && params.city !== 'all') {
        const cityNorm = params.city.toLowerCase();
        if (!doc.city.toLowerCase().includes(cityNorm) && !doc.cityAr.includes(params.city)) {
          return false;
        }
      }
      if (params.minRating && doc.rating < params.minRating) {
        return false;
      }
      if (params.searchQuery && params.searchQuery.trim() !== '') {
        const q = params.searchQuery.toLowerCase().trim();
        const matchName = doc.name.toLowerCase().includes(q) || doc.nameAr.includes(q);
        const matchSpec = doc.specialty.toLowerCase().includes(q) || doc.specialtyAr.includes(q);
        const matchClinic = doc.clinicName.toLowerCase().includes(q) || doc.clinicNameAr.includes(q);
        const matchCity = doc.city.toLowerCase().includes(q) || doc.cityAr.includes(q);
        return matchName || matchSpec || matchClinic || matchCity;
      }
      return true;
    });
  }
}

// ---------------------------------------------------------------------------
// In-Memory Platform Repository
// ---------------------------------------------------------------------------
export class InMemoryPlatformRepository implements IPlatformRepository {
  private services: PlatformService[] = loadStore<PlatformService>('services', SEED_SERVICES);

  async getServices(): Promise<PlatformService[]> {
    return this.services.map((s) => ({ ...s }));
  }

  async saveService(service: PlatformService): Promise<PlatformService> {
    const idx = this.services.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      this.services[idx] = { ...service };
    } else {
      this.services.unshift(service);
    }
    saveStore('services', this.services);
    return { ...service };
  }

  async deleteService(id: string): Promise<void> {
    this.services = this.services.filter((s) => s.id !== id);
    saveStore('services', this.services);
  }

  async getSpecialties(): Promise<SpecialtyItem[]> {
    return SEED_SPECIALTIES.map((s) => ({ ...s }));
  }

  async getLocations(): Promise<LocationItem[]> {
    return SEED_LOCATIONS.map((l) => ({ ...l }));
  }

  async getStats(): Promise<PlatformStats> {
    return SEED_STATS;
  }
}

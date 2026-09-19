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
  InMemoryPatientRepository,
  InMemoryAppointmentRepository,
  InMemoryPrescriptionRepository,
  InMemoryLabOrderRepository,
  InMemoryAuditLogRepository,
  InMemoryIntegrationRepository,
  InMemoryClinicRepository,
  InMemoryDoctorRepository,
  InMemoryPlatformRepository,
  InMemoryUserRepository,
} from './inMemoryRepository';

export * from './contracts';
export * from './inMemoryRepository';

// Singleton Repository Instances
class RepositoryRegistry {
  private static instance: RepositoryRegistry;

  public readonly patients: IPatientRepository;
  public readonly appointments: IAppointmentRepository;
  public readonly prescriptions: IPrescriptionRepository;
  public readonly labOrders: ILabOrderRepository;
  public readonly auditLogs: IAuditLogRepository;
  public readonly integrations: IIntegrationRepository;
  public readonly clinics: IClinicRepository;
  public readonly doctors: IDoctorRepository;
  public readonly platform: IPlatformRepository;
  public readonly users: IUserRepository;

  private constructor() {
    // Uses the fault-tolerant, offline-first persistent in-memory repository
    this.patients = new InMemoryPatientRepository();
    this.appointments = new InMemoryAppointmentRepository();
    this.prescriptions = new InMemoryPrescriptionRepository();
    this.labOrders = new InMemoryLabOrderRepository();
    this.auditLogs = new InMemoryAuditLogRepository();
    this.integrations = new InMemoryIntegrationRepository();
    this.clinics = new InMemoryClinicRepository();
    this.doctors = new InMemoryDoctorRepository();
    this.platform = new InMemoryPlatformRepository();
    this.users = new InMemoryUserRepository();
  }

  public static getInstance(): RepositoryRegistry {
    if (!RepositoryRegistry.instance) {
      RepositoryRegistry.instance = new RepositoryRegistry();
    }
    return RepositoryRegistry.instance;
  }
}

export const repositories = RepositoryRegistry.getInstance();

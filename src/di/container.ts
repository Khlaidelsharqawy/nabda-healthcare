import { repositories } from '../repositories';
import {
  RegisterPatientUseCase,
  CreatePrescriptionUseCase,
  BookAppointmentUseCase,
  AttestSoapNoteUseCase,
  ProcessSpecimenIntakeUseCase,
} from '../application';

/**
 * Dependency Injection IoC Container
 * Provides assembled singletons adhering to SOLID principles
 */
class Container {
  private static instance: Container;

  public readonly registerPatientUseCase: RegisterPatientUseCase;
  public readonly createPrescriptionUseCase: CreatePrescriptionUseCase;
  public readonly bookAppointmentUseCase: BookAppointmentUseCase;
  public readonly attestSoapNoteUseCase: AttestSoapNoteUseCase;
  public readonly processSpecimenIntakeUseCase: ProcessSpecimenIntakeUseCase;

  private constructor() {
    this.registerPatientUseCase = new RegisterPatientUseCase(
      repositories.patients,
      repositories.auditLogs
    );

    this.createPrescriptionUseCase = new CreatePrescriptionUseCase(
      repositories.prescriptions,
      repositories.patients,
      repositories.auditLogs
    );

    this.bookAppointmentUseCase = new BookAppointmentUseCase(
      repositories.appointments,
      repositories.patients,
      repositories.auditLogs
    );

    this.attestSoapNoteUseCase = new AttestSoapNoteUseCase(
      repositories.patients,
      repositories.auditLogs
    );

    this.processSpecimenIntakeUseCase = new ProcessSpecimenIntakeUseCase(
      repositories.labOrders,
      repositories.auditLogs
    );
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}

export const container = Container.getInstance();

import { Patient, TenantId, UserId } from '../../domain';
import { IPatientRepository, IAuditLogRepository } from '../../repositories';
import { generateTemporaryPassword, dispatchWebhookEvent } from '../../services/webhookDispatcher';
import { recordClinicalInteraction } from '../../services/aiTrainingService';

export interface RegisterPatientCommand {
  tenantId: TenantId;
  actorId: UserId;
  fullNameAr: string;
  fullNameEn: string;
  nationalId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phone: string;
  whatsappOptIn: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  initialComplaint?: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weightKg?: number;
  };
}

export interface RegisterPatientResult {
  patient: Patient;
  generatedAccount: {
    username: string;
    temporaryPassword: string;
    loginUrl: string;
  };
  whatsappDispatched: boolean;
}

export class RegisterPatientUseCase {
  constructor(
    private patientRepo: IPatientRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async execute(command: RegisterPatientCommand): Promise<RegisterPatientResult> {
    // 1. Validation
    if (!command.fullNameAr && !command.fullNameEn) {
      throw new Error('Patient name is required in either Arabic or English.');
    }
    if (!command.phone) {
      throw new Error('Patient mobile number is required for WhatsApp onboarding.');
    }

    // 2. Generate Account Credentials
    const tempPassword = generateTemporaryPassword();
    const cleanPhone = command.phone.replace(/\D/g, '');
    const username = command.nationalId?.trim() || (cleanPhone ? `pt_${cleanPhone.slice(-8)}` : `pt_${Date.now().toString().slice(-6)}`);
    const newMrn = `#EG-${Math.floor(10000 + Math.random() * 90000)}`;

    // 3. Create Patient Entity
    const patient: Patient = {
      id: `pat-${Date.now()}`,
      tenantId: command.tenantId,
      medicalRecordNumber: newMrn,
      nationalId: command.nationalId || `DEMO-${Date.now()}`,
      fullNameAr: command.fullNameAr || command.fullNameEn,
      fullNameEn: command.fullNameEn || command.fullNameAr,
      dateOfBirth: command.dateOfBirth || '1985-01-01',
      gender: command.gender,
      phone: command.phone,
      whatsappOptIn: command.whatsappOptIn,
      emergencyContact: command.emergencyContact,
      allergies: [],
      chronicConditions: [],
      latestVitals: command.vitals
        ? {
            bloodPressure: command.vitals.bloodPressure,
            heartRate: command.vitals.heartRate,
            temperature: command.vitals.temperature,
            weightKg: command.vitals.weightKg,
            recordedAt: new Date().toISOString(),
          }
        : undefined,
      status: 'stable',
      createdAt: new Date().toISOString(),
    };

    // 4. Persist
    const savedPatient = await this.patientRepo.save(patient);

    // 5. Audit Log
    await this.auditRepo.append({
      tenantId: command.tenantId,
      actorId: command.actorId,
      actorRole: 'assistant',
      action: 'PATIENT_REGISTERED',
      entityType: 'patient',
      entityId: savedPatient.id,
      details: {
        mrn: savedPatient.medicalRecordNumber,
        phone: savedPatient.phone,
        whatsappOptIn: savedPatient.whatsappOptIn,
      },
    });

    // 6. Dispatch n8n Automation Webhook (WhatsApp Credentials)
    const loginUrl = `${window.location.origin}/login`;
    const dispatchRes = await dispatchWebhookEvent('PATIENT_CREATED', {
      patientName: savedPatient.fullNameAr,
      patientNameEn: savedPatient.fullNameEn,
      phone: savedPatient.phone,
      nationalId: savedPatient.nationalId,
      mrn: savedPatient.medicalRecordNumber,
      account: {
        username,
        tempPassword,
        loginUrl,
      },
    }, command.tenantId);

    // 7. Strip PII and Index Chief Complaint for AI Training
    if (command.initialComplaint) {
      recordClinicalInteraction({
        tenant_id: command.tenantId,
        source_type: 'intake_triage',
        specialty: 'Internal Medicine / Triage',
        clinical_context: `Intake Vitals: BP ${command.vitals?.bloodPressure || 'N/A'}, HR ${command.vitals?.heartRate || 'N/A'}.`,
        raw_text: command.initialComplaint,
      });
    }

    return {
      patient: savedPatient,
      generatedAccount: {
        username,
        temporaryPassword: tempPassword,
        loginUrl,
      },
      whatsappDispatched: dispatchRes.success,
    };
  }
}

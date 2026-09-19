import { ClinicalEncounter, TenantId, UserId, PatientId } from '../../domain';
import { IAuditLogRepository, IPatientRepository } from '../../repositories';
import { dispatchWebhookEvent } from '../../services/webhookDispatcher';
import { recordClinicalInteraction } from '../../services/aiTrainingService';

export interface AttestSoapNoteCommand {
  tenantId: TenantId;
  encounterId: string;
  patientId: PatientId;
  clinicianId: UserId;
  clinicianName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  specialty: string;
}

export class AttestSoapNoteUseCase {
  constructor(
    private patientRepo: IPatientRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async execute(command: AttestSoapNoteCommand): Promise<ClinicalEncounter> {
    const patient = await this.patientRepo.findById(command.patientId, command.tenantId);
    if (!patient) {
      throw new Error(`Patient not found: ${command.patientId}`);
    }

    const signatureHash = `SIG_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;

    const encounter: ClinicalEncounter = {
      id: command.encounterId || `enc-${Date.now()}`,
      tenantId: command.tenantId,
      patientId: command.patientId,
      clinicianId: command.clinicianId,
      status: 'signed',
      subjective: command.subjective,
      objective: command.objective,
      assessment: command.assessment,
      plan: command.plan,
      doctorSignature: {
        signedBy: command.clinicianName,
        signedAt: new Date().toISOString(),
        signatureHash,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Audit Log (Attestation)
    await this.auditRepo.append({
      tenantId: command.tenantId,
      actorId: command.clinicianId,
      actorRole: 'doctor',
      action: 'SOAP_NOTE_ATTESTED',
      entityType: 'encounter',
      entityId: encounter.id,
      details: {
        patientId: command.patientId,
        signedBy: command.clinicianName,
        signatureHash,
      },
    });

    // 2. Feed De-Identified Clinical Pair into AI Training Corpus
    if (command.assessment && command.plan) {
      recordClinicalInteraction({
        tenant_id: command.tenantId,
        source_type: 'soap_synthesis',
        specialty: command.specialty || 'Internal Medicine',
        clinical_context: `Subjective: ${command.subjective}. Objective: ${command.objective}`,
        raw_text: `Assessment: ${command.assessment}. Plan: ${command.plan}`,
      });
    }

    // 3. Dispatch n8n Automation
    await dispatchWebhookEvent('SOAP_NOTE_FINALIZED', {
      encounterId: encounter.id,
      patientId: patient.id,
      patientName: patient.fullNameAr,
      clinicianName: command.clinicianName,
      assessment: command.assessment,
      plan: command.plan,
    }, command.tenantId);

    return encounter;
  }
}

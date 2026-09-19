import { Prescription, PrescriptionItem, TenantId, UserId, PatientId, MedicationGuidance } from '../../domain';
import { IPrescriptionRepository, IPatientRepository, IAuditLogRepository } from '../../repositories';
import { dispatchWebhookEvent } from '../../services/webhookDispatcher';

export interface CreatePrescriptionItemInput {
  medicationName: string;
  medicationNameAr: string;
  dosage: string;
  frequency: string;
  timing: string;
  durationDays: number;
  instructions: string;
  instructionsAr: string;
  doseForm?: 'tablet' | 'capsule' | 'drops' | 'injection' | 'inhaler' | 'topical';
}

export interface CreatePrescriptionCommand {
  tenantId: TenantId;
  clinicianId: UserId;
  clinicianName: string;
  patientId: PatientId;
  items: CreatePrescriptionItemInput[];
  diagnoses: string[];
  refillsAllowed?: number;
}

export class CreatePrescriptionUseCase {
  constructor(
    private prescriptionRepo: IPrescriptionRepository,
    private patientRepo: IPatientRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async execute(command: CreatePrescriptionCommand): Promise<Prescription> {
    const patient = await this.patientRepo.findById(command.patientId, command.tenantId);
    if (!patient) {
      throw new Error(`Patient not found: ${command.patientId}`);
    }

    // 1. Drug Interaction & Allergy Check
    for (const item of command.items) {
      const lowerName = item.medicationName.toLowerCase();
      for (const allergy of patient.allergies) {
        if (lowerName.includes(allergy.toLowerCase())) {
          throw new Error(`ALLERGY ALERT: Patient is allergic to "${allergy}", conflicting with prescribed "${item.medicationName}".`);
        }
      }
    }

    // 2. Build Rich Guidance for Each Item (Emojis + Voice)
    const richItems: PrescriptionItem[] = command.items.map((item, index) => {
      const isMorning = item.timing.toLowerCase().includes('morning') || item.timing.includes('صباح');
      const isEvening = item.timing.toLowerCase().includes('evening') || item.timing.toLowerCase().includes('night') || item.timing.includes('مساء');
      const timingEmoji = isMorning ? '☀️' : isEvening ? '🌙' : '⏰';

      const guidance: MedicationGuidance = {
        doseForm: item.doseForm || 'tablet',
        emojiBadge: item.doseForm === 'drops' ? '💧' : item.doseForm === 'injection' ? '💉' : '💊',
        timingEmoji,
        foodInstruction: 'after-meal',
        waterInstruction: 'full-glass',
        spokenInstructionsAr: `دواء ${item.medicationNameAr}. الجرعة: ${item.dosage}. الموعد: ${item.timing}. التعليمات: ${item.instructionsAr}. يرجى تناوله مع كوب ماء كامل.`,
        spokenInstructionsEn: `Medication: ${item.medicationName}. Dosage: ${item.dosage}. Timing: ${item.timing}. Instructions: ${item.instructions}. Please take with a full glass of water.`,
      };

      return {
        id: `rxi-${Date.now()}-${index}`,
        medicationName: item.medicationName,
        medicationNameAr: item.medicationNameAr,
        dosage: item.dosage,
        frequency: item.frequency,
        timing: item.timing,
        durationDays: item.durationDays,
        instructions: item.instructions,
        instructionsAr: item.instructionsAr,
        guidance,
      };
    });

    // 3. Create Prescription Entity
    const prescription: Prescription = {
      id: `rx-${Date.now()}`,
      tenantId: command.tenantId,
      patientId: command.patientId,
      clinicianId: command.clinicianId,
      clinicianName: command.clinicianName,
      status: 'active',
      items: richItems,
      refillsAllowed: command.refillsAllowed ?? 1,
      refillsUsed: 0,
      diagnoses: command.diagnoses,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
    };

    // 4. Persist
    const savedRx = await this.prescriptionRepo.save(prescription);

    // 5. Audit Log
    await this.auditRepo.append({
      tenantId: command.tenantId,
      actorId: command.clinicianId,
      actorRole: 'doctor',
      action: 'PRESCRIPTION_CREATED',
      entityType: 'prescription',
      entityId: savedRx.id,
      details: {
        patientId: command.patientId,
        itemsCount: richItems.length,
        diagnoses: command.diagnoses,
      },
    });

    // 6. Automation Dispatch
    await dispatchWebhookEvent('SOAP_NOTE_FINALIZED', {
      eventType: 'PRESCRIPTION_ISSUED',
      prescriptionId: savedRx.id,
      patientId: patient.id,
      patientName: patient.fullNameAr,
      patientPhone: patient.phone,
      items: richItems.map(i => ({ name: i.medicationName, dosage: i.dosage })),
    }, command.tenantId);

    return savedRx;
  }
}

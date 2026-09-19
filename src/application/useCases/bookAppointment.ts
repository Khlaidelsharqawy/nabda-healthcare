import { Appointment, TenantId, UserId, PatientId } from '../../domain';
import { IAppointmentRepository, IPatientRepository, IAuditLogRepository } from '../../repositories';
import { dispatchWebhookEvent } from '../../services/webhookDispatcher';

export interface BookAppointmentCommand {
  tenantId: TenantId;
  actorId: UserId;
  patientId: PatientId;
  clinicianId: UserId;
  clinicianName: string;
  scheduledAt: string; // ISO String
  timeSlot: string;
  dateFormatted: string;
  visitType: 'scheduled' | 'walk-in' | 'lab-review' | 'follow-up';
  room: string;
  clinicName: string;
  chiefComplaint?: string;
}

export class BookAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private patientRepo: IPatientRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async execute(command: BookAppointmentCommand): Promise<Appointment> {
    const patient = await this.patientRepo.findById(command.patientId, command.tenantId);
    if (!patient) {
      throw new Error(`Patient not found: ${command.patientId}`);
    }

    // 1. Conflict Check
    const hasConflict = await this.appointmentRepo.checkConflict(
      command.clinicianId,
      command.scheduledAt,
      command.tenantId
    );
    if (hasConflict) {
      throw new Error('Appointment slot conflict: The selected physician already has an active appointment at this time.');
    }

    // 2. Create Appointment Entity
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      tenantId: command.tenantId,
      patientId: command.patientId,
      patientName: patient.fullNameAr,
      patientPhone: patient.phone,
      clinicianId: command.clinicianId,
      clinicianName: command.clinicianName,
      scheduledAt: command.scheduledAt,
      timeSlot: command.timeSlot,
      dateFormatted: command.dateFormatted,
      visitType: command.visitType,
      status: 'confirmed',
      room: command.room,
      clinicName: command.clinicName,
      chiefComplaint: command.chiefComplaint,
      preparationChecklist: [
        'يرجى الحضور قبل الموعد بـ 15 دقيقة لتسجيل القياسات الحيوية',
        'إحضار وثيقة الهوية أو بطاقة التأمين الطبي',
        'إحضار قائمة بالأدوية المستخدمة حالياً',
      ],
      createdAt: new Date().toISOString(),
    };

    // 3. Persist
    const saved = await this.appointmentRepo.save(appointment);

    // 4. Audit Log
    await this.auditRepo.append({
      tenantId: command.tenantId,
      actorId: command.actorId,
      actorRole: 'assistant',
      action: 'APPOINTMENT_BOOKED',
      entityType: 'appointment',
      entityId: saved.id,
      details: {
        patientId: command.patientId,
        clinicianId: command.clinicianId,
        timeSlot: command.timeSlot,
        room: command.room,
      },
    });

    // 5. Dispatch n8n Automation Webhook (WhatsApp Confirmation)
    await dispatchWebhookEvent('APPOINTMENT_BOOKED', {
      appointmentId: saved.id,
      patientName: patient.fullNameAr,
      patientPhone: patient.phone,
      clinicianName: command.clinicianName,
      date: command.dateFormatted,
      time: command.timeSlot,
      room: command.room,
      clinicName: command.clinicName,
    }, command.tenantId);

    return saved;
  }
}

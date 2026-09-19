import { LabOrder, TenantId, UserId, LabOrderId } from '../../domain';
import { ILabOrderRepository, IAuditLogRepository } from '../../repositories';
import { dispatchWebhookEvent } from '../../services/webhookDispatcher';

export interface ProcessSpecimenIntakeCommand {
  tenantId: TenantId;
  collectorStaffId: UserId;
  collectorName: string;
  orderId: LabOrderId;
  specimenType: 'blood' | 'urine' | 'swab' | 'other';
  qualityNotes?: string;
}

export class ProcessSpecimenIntakeUseCase {
  constructor(
    private labRepo: ILabOrderRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async execute(command: ProcessSpecimenIntakeCommand): Promise<LabOrder> {
    const order = await this.labRepo.findById(command.orderId, command.tenantId);
    if (!order) {
      throw new Error(`Diagnostic lab order not found: ${command.orderId}`);
    }

    const accessionNumber = `ACC-${Date.now().toString().slice(-6)}-${command.specimenType.charAt(0).toUpperCase()}`;

    // 1. Update Lab Order Status
    await this.labRepo.updateStatus(command.orderId, 'accessioned', accessionNumber, command.tenantId);
    order.status = 'accessioned';
    order.accessionNumber = accessionNumber;
    order.collectedAt = new Date().toISOString();

    // 2. Audit Log (Chain of Custody)
    await this.auditRepo.append({
      tenantId: command.tenantId,
      actorId: command.collectorStaffId,
      actorRole: 'assistant',
      action: 'SPECIMEN_ACCESSIONED',
      entityType: 'lab_order',
      entityId: order.id,
      details: {
        orderNumber: order.orderNumber,
        accessionNumber,
        specimenType: command.specimenType,
        qualityNotes: command.qualityNotes || 'Normal integrity verified at intake',
      },
    });

    // 3. Dispatch Automation Webhook
    await dispatchWebhookEvent('LAB_RESULT_READY', {
      eventType: 'SPECIMEN_COLLECTED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      accessionNumber,
      patientId: order.patientId,
      patientName: order.patientName,
      specimenType: command.specimenType,
    }, command.tenantId);

    return order;
  }
}

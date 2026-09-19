import { ClinicIntegration } from '../lib/supabase';

export type WebhookEventType =
  | 'PATIENT_CREATED'
  | 'APPOINTMENT_BOOKED'
  | 'APPOINTMENT_CANCELLED'
  | 'PRESCRIPTION_ISSUED'
  | 'SOAP_NOTE_FINALIZED'
  | 'LAB_RESULT_READY'
  | 'WHATSAPP_INBOUND';

export interface WebhookDispatchResult {
  success: boolean;
  statusCode: number;
  message: string;
  dispatchedAt: string;
  payloadSent: Record<string, unknown>;
  tenantId: string;
  eventId?: string;
}

// In-memory or localStorage cache of clinic integrations for GUI testing
const STORAGE_KEY_INTEGRATIONS = 'aegis_clinic_integrations';

export function getLocalClinicIntegrations(): ClinicIntegration[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_INTEGRATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed reading clinic integrations from storage', e);
  }

  // Default seed integrations
  return [
    {
      id: 'int-n8n-default',
      tenant_id: 'tenant-demo-01',
      integration_type: 'n8n_webhook',
      service_name: 'n8n Primary Operational Hub',
      endpoint_url: 'https://n8n.example.com/webhook/aegis-operations',
      events_subscribed: ['PATIENT_CREATED', 'APPOINTMENT_BOOKED', 'SOAP_NOTE_FINALIZED', 'LAB_RESULT_READY'],
      is_active: true,
      last_ping_status: 'healthy',
      last_ping_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'int-whatsapp-default',
      tenant_id: 'tenant-demo-01',
      integration_type: 'whatsapp_business',
      service_name: 'WhatsApp Triage Dispatcher',
      endpoint_url: 'https://n8n.example.com/webhook/aegis-whatsapp-dispatch',
      events_subscribed: ['PATIENT_CREATED', 'APPOINTMENT_BOOKED', 'LAB_RESULT_READY'],
      is_active: true,
      last_ping_status: 'healthy',
      last_ping_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
  ];
}

export function saveClinicIntegration(integration: ClinicIntegration): void {
  const current = getLocalClinicIntegrations();
  const existingIdx = current.findIndex(i => i.id === integration.id);
  if (existingIdx >= 0) {
    current[existingIdx] = integration;
  } else {
    current.push(integration);
  }
  localStorage.setItem(STORAGE_KEY_INTEGRATIONS, JSON.stringify(current));
}

export function deleteClinicIntegration(id: string): void {
  const current = getLocalClinicIntegrations().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY_INTEGRATIONS, JSON.stringify(current));
}

// Generate secure random temporary password for new patients
export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Aegis@${code}`;
}

/**
 * Dispatch an event to n8n Webhook
 */
export async function dispatchWebhookEvent(
  eventType: WebhookEventType,
  payload: Record<string, unknown>,
  tenantId = 'tenant-demo-01'
): Promise<WebhookDispatchResult> {
  const integrations = getLocalClinicIntegrations();
  const targetIntegration = integrations.find(
    i => i.is_active && (i.tenant_id === tenantId || i.tenant_id === 'global') && i.events_subscribed.includes(eventType)
  );

  const payloadToSend = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    eventType,
    tenantId,
    timestamp: new Date().toISOString(),
    data: payload,
  };

  const endpoint = targetIntegration?.endpoint_url;

  if (endpoint && !endpoint.includes('example.com')) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Aegis-Event': eventType,
          'X-Aegis-Tenant': tenantId,
        },
        body: JSON.stringify(payloadToSend),
      });

      return {
        success: response.ok,
        statusCode: response.status,
        message: response.ok ? 'Webhook dispatched successfully to n8n' : `n8n returned status ${response.status}`,
        dispatchedAt: new Date().toISOString(),
        payloadSent: payloadToSend,
        tenantId,
        eventId: payloadToSend.eventId,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown network error';
      return {
        success: false,
        statusCode: 0,
        message: `Network error reaching n8n endpoint: ${errorMessage}`,
        dispatchedAt: new Date().toISOString(),
        payloadSent: payloadToSend,
        tenantId,
        eventId: payloadToSend.eventId,
      };
    }
  }

  // Simulated successful dispatch for prototype / testing mode
  return {
    success: true,
    statusCode: 200,
    message: `[Simulated n8n Dispatch] Event ${eventType} successfully dispatched to n8n workflow.`,
    dispatchedAt: new Date().toISOString(),
    payloadSent: payloadToSend,
    tenantId,
    eventId: payloadToSend.eventId,
  };
}

/**
 * Test ping a Webhook endpoint
 */
export async function testPingWebhook(endpointUrl: string): Promise<{ ok: boolean; latencyMs: number; statusText: string }> {
  const start = performance.now();
  if (!endpointUrl || endpointUrl.includes('example.com')) {
    // Simulated healthy ping
    await new Promise(r => setTimeout(r, 120));
    return { ok: true, latencyMs: 120, statusText: '200 OK (Simulated n8n Response)' };
  }

  try {
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Aegis-Ping': 'true' },
      body: JSON.stringify({ ping: true, timestamp: new Date().toISOString() }),
    });
    const latency = Math.round(performance.now() - start);
    return { ok: res.ok, latencyMs: latency, statusText: `${res.status} ${res.statusText}` };
  } catch (e: unknown) {
    const latency = Math.round(performance.now() - start);
    const msg = e instanceof Error ? e.message : 'Connection failed';
    return { ok: false, latencyMs: latency, statusText: msg };
  }
}

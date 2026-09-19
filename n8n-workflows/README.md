# AegisHealth Enterprise n8n Automation Workflows

This directory contains the production-ready n8n workflow definition for integrating the AegisHealth healthcare platform with WhatsApp messaging, patient credential dispatch, appointment confirmations, prescription guidance, and AI clinical triage.

---

## 1. Overview

The master workflow file (`aegis_master_automation_workflow.json`) acts as an event-driven automation hub triggered via HTTP Webhook.

Supported Events:

1. **PATIENT_CREATED**:
   - Generates Medical Record Number (MRN), username, and temporary password.
   - Dispatches a welcome WhatsApp message containing login credentials, portal access link, and an interactive audio onboarding guide.

2. **APPOINTMENT_BOOKED**:
   - Formats clinic appointment details: doctor name, department, date, time, and room number.
   - Dispatches a WhatsApp confirmation with pre-visit instructions (e.g., fasting requirements, necessary lab documentation).

3. **PRESCRIPTION_ISSUED**:
   - Parses prescribed medications, dosages, routes of administration, and timing instructions.
   - Dispatches a structured WhatsApp medication guide with an audio consultation link for elderly or visually impaired patients.

4. **WHATSAPP_INBOUND**:
   - Ingests inbound WhatsApp queries from patients.
   - Executes an AI Clinical Triage router to determine whether the patient requires an appointment, medication refill, or emergency escalation.

---

## 2. Import Instructions

1. Open your n8n workspace (Cloud or Self-Hosted Docker).
2. Navigate to **Workflows** > **Add Workflow**.
3. From the top-right menu, select **Import from File** and choose `aegis_master_automation_workflow.json` (or copy and paste its raw JSON content).
4. Click on the **AegisHealth Webhook Ingestion** node to obtain the Production Webhook URL:
   Example: `https://n8n.yourclinic.com/webhook/aegis-healthcare-hub`
5. Open the AegisHealth Super Admin panel at `/admin/integrations`.
6. Paste the Webhook URL, enter the clinic WhatsApp phone number, and save the configuration.
7. Toggle the workflow to **Active** in n8n.

---

## 3. Environment Variables & Credentials

Configure the following environment variables or n8n credentials for Meta WhatsApp Cloud API:

- `WHATSAPP_PHONE_NUMBER_ID`: The Phone Number ID from the Meta Developer App Dashboard.
- `WHATSAPP_CLOUD_API_TOKEN`: System User Permanent Access Token with `whatsapp_business_messaging` permissions.

Alternative Providers:
To use Twilio, Infobip, or a local WhatsApp gateway (e.g., Baileys / WPPConnect), replace the HTTP Request node with the respective integration node.

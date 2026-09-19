# Future Frontend-Backend Contract

This document extracts future requirements only. It does not define or implement APIs, database models, authentication, workers, integrations, or AI providers.

## Contract Principles

- Derive `organization_id`/tenant scope from a validated authenticated context or validated public tenant slug.
- Require explicit tenant filters and backend authorization for every tenant-scoped operation.
- Enforce patient scope independently from UI visibility.
- Return sanitized errors and explicit state codes for loading, empty, disabled, unauthorized, and not-found conditions.
- Treat AI output as a draft or assistive result with scope, provenance, and review state.
- Record clinical and administrative mutations in an audit trail.

## Major Contracts

| Frontend capability | Needs | Scope/role | Future backend contract |
|---|---|---|---|
| Unified login/dispatch | credentials/identity provider response and role claims | all roles | authenticated session endpoint with strict issuer/audience/expiry/algorithm validation; role dispatch response |
| Account verification/recovery/reset | verification token, recovery token, password command | account | one-time token workflows, sanitized errors, rate limits, audit |
| Doctor dashboard | appointments, queue, active encounter, alerts, telemetry | current tenant + doctor | tenant-scoped dashboard query and command endpoints |
| Patient directory/profile | patient search and clinical summary | doctor/assistant, current tenant | authorized tenant patient query; patient access audit |
| Clinical notes/timeline | encounters, notes, history, attestation | doctor + patient scope | read/write/sign APIs with clinical authorization and audit |
| Files/documents | metadata and signed download | doctor/patient scope | tenant/patient-scoped file metadata and time-limited access |
| Prescriptions/medications | medication catalog, orders, prescriptions, refill | doctor/patient scope | medication/prescription commands with signature and audit |
| Lab/imaging orders | order catalog, create/review, specimen/result state | doctor/assistant/patient scope | order and result APIs with workflow state transitions |
| Appointments/queue | availability, appointment lifecycle, room queue | tenant + patient where relevant | appointment, availability, queue, room APIs |
| Assistant communications | messages, triage, draft, delivery status | tenant + patient/contact | channel-agnostic communications API and audit; WhatsApp adapter later |
| Public clinic | tenant slug, branding, doctors, services, availability | public tenant | published tenant read API; unknown/disabled tenant must be explicit |
| Booking | availability, patient contact, booking confirmation | public tenant + booking | idempotent booking command, consent and notification events later |
| Doctor AI | authorized patient context, tools, response/draft | doctor + tenant + patient | scoped AI run service, allowed tools, provenance, human-review state |
| Assistant AI | operational/communication context | assistant + tenant | bounded logistics/communication AI run service |
| Patient AI | patient-authorized context and history | patient + tenant + self | patient-scoped AI session and history; no cross-patient reasoning |
| Voice sessions | consent, audio/transcript, SOAP draft, review | doctor + tenant + patient | voice session lifecycle, transcript, draft, attestation, audit |
| Admin tenants | tenant create/config/status | super admin platform | tenancy/provisioning/config APIs with platform authorization |
| Admin staff/RBAC | users, roles, permissions, invites | super admin + tenant admin boundary per approved model | identity/staff/role APIs; do not create Clinic Admin without approval |
| Admin usage/subscriptions | quotas, meters, plans, billing state | super admin platform | usage/subscription APIs; payment provider later |
| Admin security/audit | events, key/isolation status, rekey command | super admin platform | immutable audit and security operations APIs |

## AI Boundary

```text
user -> role -> tenant -> patient scope -> authorized context
     -> allowed tools -> bounded response/draft -> human review/attestation
```

AI screens currently show suggestions, confidence, drafts, transcript, and review labels. They do not prove any provider integration or clinical safety enforcement. Future backend contracts must prevent autonomous diagnosis, prescribing, treatment, unrestricted patient access, and cross-tenant reasoning.

## Database Domain Mapping

The future persistence domains implied by the UI are: Tenancy, Identity, Staff, Patients, Clinical, Medication, Prescriptions, Orders, Appointments, Queue, Public Booking, AI, Voice, Communications, Files, Audit, and Administration. This phase creates none of these models.

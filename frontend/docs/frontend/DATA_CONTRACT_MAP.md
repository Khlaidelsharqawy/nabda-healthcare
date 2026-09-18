# Data and Clinical Contract Map

## Classification Rules

All values embedded in the HTML are classified as reference/demo data, UI copy, or future backend data. No static value is treated as a live record. No API is implemented.

| Frontend surface | Data domain | Read/write intent | Role | Tenant scope | Patient scope | Future entity/API |
|---|---|---|---|---|---|---|
| Doctor dashboard | shift metrics, appointments, queue, vitals, encounters | read; action intents | doctor | current tenant | active patient | appointments, queue, encounters, telemetry queries |
| Doctor patient roster | demographics, MRN, status | read/search | doctor | current tenant | selected patient list | patients query with tenant and clinical authorization |
| Doctor patient profile/history/timeline | demographics, allergies, history, encounters, vitals | read; notes/attestation implied | doctor | current tenant | selected patient | patient, encounter, observation, allergy, note APIs |
| Doctor notes/drafts | clinical narrative/SOAP/attestation | read/write/sign intent | doctor | current tenant | selected patient | clinical notes and audit commands |
| Doctor documents | clinical files and audit trail | read/download/audit intent | doctor | current tenant | selected patient | files, document metadata, signed download API |
| Doctor prescriptions/medications | medication, dosage, refill, prescription status | create/edit/review/sign | doctor | current tenant | selected patient | medications, prescriptions, authorization/audit |
| Doctor lab/imaging orders | order type, tests, priority, result context | create/review | doctor | current tenant | selected patient/encounter | orders, catalog, specimen/result APIs |
| Doctor AI workspace/draft | authorized clinical context, generated suggestions, draft SOAP | read/generate/edit/attest intent | doctor | current tenant | selected patient | scoped AI context, AI run, draft, attestation entities |
| Doctor voice sessions | consent, transcript, SOAP draft, review actions | create/read/edit/review | doctor | current tenant | selected patient | voice session, transcript, draft, consent, audit |
| Doctor communications | patient inquiry and suggested response | read/write/send intent | doctor | current tenant | selected patient | communications, AI draft, delivery/audit |
| Assistant registration/directory | demographics, contact, identifiers | create/read/update intent | assistant | current tenant | patient record | patient registration and duplicate-check API |
| Assistant appointments/queue | appointment status, waiting room, room assignment | read/write/dispatch | assistant | current tenant | queued patient | appointments, queue, room assignment APIs |
| Assistant lab accession | orders, specimen types, accession/barcode | read/update workflow | assistant | current tenant | patient/order | orders, specimens, accession API |
| Assistant WhatsApp/communications | inbound message, triage, booking context | read/write/triage | assistant | current tenant | patient/contact | communications, channel integration, audit |
| Assistant AI communications | authorized operational context, draft message | read/generate/edit/approve intent | assistant | current tenant | patient/contact when applicable | scoped AI draft and communication API |
| Patient dashboard/profile | own demographics, appointments, medications, labs, vitals | read; profile edit intent | patient | current tenant(s) | self only | patient self-service APIs |
| Patient appointments | own appointments and booking/intake | read/create/change intent | patient | tenant selected by appointment | self | appointments/public booking APIs |
| Patient labs/vitals/medications | own observations/results/medications | read; vitals submit intent | patient | current tenant | self | observation/result/medication APIs |
| Patient AI/context/history | own authorized context, prompts, response history | read/generate/history | patient | current tenant | self | patient-scoped AI context and audit |
| Public clinic booking | tenant identity, doctors, services, availability, contact | read/create booking intent | public | public tenant slug | prospective patient/booking | public tenant, availability, booking APIs |
| Admin tenant directory/detail | tenant identity, status, usage, config | read/update/provision intent | super admin | platform | no patient by default | tenancy/config/usage APIs |
| Admin users/RBAC | staff identity, roles, permissions | read/update/invite intent | super admin | platform + selected tenant | no patient | identity/staff/role APIs |
| Admin subscriptions/usage | plan, quota, meter, billing state | read/update quota intent | super admin | platform + tenant | no patient | subscription/usage APIs |
| Admin security/audit | audit events, keys/isolation claims, rekey action | read/action intent | super admin | platform + tenants | possible identifiers | audit/security/key-management APIs |

## Clinical Data Boundary

The clinical surfaces include demographics, medical history, allergies, vitals, notes, prescriptions, medications, laboratory orders/results, imaging orders, documents, encounters, appointments, queue, AI patient context, and voice sessions. The static screens display these domains but do not persist or authorize them.

## State Coverage

Represented in selected artifacts: loading skeleton, empty/filter result, error banner, success/confirmation, pending review, signed/verified, cancelled/disabled-looking controls, modal open/closed, draft, and completed/collected statuses. Inconsistently represented or absent: unauthorized backend response, tenant disabled, unknown tenant, incomplete configuration, no provider/service availability, conflict, stale record, and server failure.

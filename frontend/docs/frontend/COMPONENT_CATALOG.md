# Component Catalog

## Important Finding

There are no reusable source components in this repository. Each `code.html` is a standalone document containing its own markup, Tailwind configuration, styles, and sometimes inline JavaScript. The catalog therefore classifies repeated UI patterns as **embedded patterns**, not as existing components.

## Shared UI Primitive Candidates

| Embedded pattern | Evidence | Current status | Recommended future location | Backend dependency |
|---|---|---|---|---|
| Button/action control | repeated Tailwind button markup across all role screens | duplicated inline | shared UI primitives | none directly; authorization must be server-enforced |
| Input/select/textarea | auth, registration, order, profile, AI draft screens | embedded per screen | shared UI/forms | validated command/query contracts |
| Card/panel/table/badge | all portal and admin screens | embedded per screen | shared UI/data display | domain-specific data loaders |
| Modal/drawer | public booking, assistant intake, admin quotas, patient appointments | inline DOM toggles | shared UI/overlay | mutations require backend commands |
| Tabs/filter controls | auth, timeline, vitals, services, admin lists | inline handlers | shared UI/navigation | query/filter APIs later |
| Toast/alert/status | auth, clinical review, assistant queue, admin security | inline DOM/state | shared UI/feedback | audit/error contracts |

## Shared Application Candidates

| Pattern | Present in | Current status | Recommended future location |
|---|---|---|---|
| AegisHealth header/branding | brand, public, portals | copied markup and remote logo URLs | shared application shell |
| Role portal navigation | doctor, assistant, patient, admin artifacts | screen-local markup; no route registry | role layouts/navigation config |
| Patient context header | doctor clinical and AI screens | embedded and demo-bound | clinical domain component |
| Tenant/clinic identity | public and admin screens | hardcoded or demo text | tenant/public domain component |
| Language/RTL controls | auth and bilingual screens | local handlers/markup | shared localization boundary |
| Clinical AI scope/review indicator | doctor/patient/assistant AI screens | embedded statuses | AI domain components |

## Domain Pattern Candidates

| Pattern | Domains | Patient sensitive | Tenant sensitive | Recommended future location |
|---|---|---:|---:|---|
| Patient card/profile | patients, dashboard, clinical workspace | yes | yes | clinical/patients |
| Appointment card/schedule | doctor, assistant, patient, public booking | often | yes | appointments |
| Queue entry/room dispatch | assistant, doctor dashboard | yes | yes | queue |
| Clinical note/SOAP editor | doctor notes, draft review, voice review | yes | yes | clinical/notes |
| Medication/prescription editor | doctor writer, patient medications | yes | yes | medication/prescriptions |
| Lab/imaging order form | doctor orders, assistant accession | yes | yes | clinical/orders |
| Document row/audit preview | doctor documents, patient labs | yes | yes | files/documents |
| AI workspace/context/draft | doctor, assistant, patient | yes depending context | yes | AI domain |
| Voice session/transcript | doctor voice screens | yes | yes | voice domain |
| Public clinic booking | public Al-Nour screens | booking PII | yes | public clinic domain |
| Tenant directory/provisioning | admin screens | no patient scope | platform + tenant | administration/tenancy |
| Audit/security/KMS table | admin/company screens | may expose identifiers | platform | administration/audit |

## Role-Specific Embedded Patterns

- **Doctor:** clinical dashboard, patient context, orders, SOAP/note review, prescription writer, AI workspace, voice session review.
- **Assistant:** registration, patient directory, waiting-room queue, appointment operations, specimen accession, WhatsApp triage, communication draft.
- **Patient:** patient navigation, appointment cards, medication/lab/vitals presentation, bounded AI context/history.
- **Super Admin:** tenant directory/detail/provisioning, staff roster, usage, subscriptions, security, audit, platform operations.
- **Public:** clinic identity, doctor/service directory, booking flow, confirmation.

## Stateful vs UI-Only Classification

Inline JavaScript demonstrates local UI state only: tabs, toggles, modal visibility, filters, text insertion, print, and simulated feedback. No state survives a page reload, no state is shared across screens, and no network data layer exists. These handlers must not be mistaken for authentication, authorization, persistence, or business logic.

## Generated/Duplicate Review

- `aegishealth_clinical_ai_ecosystem` and `aegishealth_saas_platform_intelligent_healthcare_management_for_modern_clinics` are byte-identical HTML artifacts (same SHA-256); retain both pending product-owner decision.
- Two unified login artifacts exist and should be treated as variants until one canonical screen is selected.
- Two lab-order artifacts exist and should be compared visually before any deletion.
- Several portal variants overlap in subject matter. They are documented as separate artifacts, not deleted.
- No unused shared component can be proven because shared components do not exist.

## Recommended Final Application Boundary

When a runtime is introduced, keep `app/routes` or framework-native pages thin, place shared primitives in `shared/ui`, place cross-role domain patterns in `domains`, keep role shells in `roles`, and isolate Al-Nour reference data in `reference/al-nour`. That is a future recommendation, not an implementation in this phase.

## Batch 02 React Extraction

The first real React extraction is documented in [SHELL_ARCHITECTURE.md](SHELL_ARCHITECTURE.md) and [REACT_IMPLEMENTATION_MAP.md](REACT_IMPLEMENTATION_MAP.md). It implements the Doctor header, sidebar, shell, theme/direction foundation, and a representative dashboard slice. The remaining patterns stay in the Stitch reference adapter until their screen-specific evidence is converted.

# Navigation Forensic Map

## What Can Be Proven

There is no router, route registry, or shared navigation configuration. The audit therefore records literal absolute links, `data-path` markers, fragment/hash actions, and inline navigation-like handlers. A link is not considered valid merely because its target resembles the approved contract.

## Verified Route-Shaped Absolute Links

| Source artifact | Literal target | Context | Finding |
|---|---|---|---|
| `frontend/screens/auth/aegishealth_unified_secure_login_role_based_dispatch_login/code.html` | `/contact` | clinic onboarding CTA | target has no downloaded route artifact; runtime dependency |
| `frontend/screens/auth/authentication_account_verification/code.html` | `/login` | verification return | contract-aligned intent |
| `frontend/screens/auth/authentication_forgot_password_account_recovery/code.html` | `/login` | recovery return | contract-aligned intent |
| `frontend/screens/auth/authentication_session_expired/code.html` | `/login`, `/login?switch=true` | session recovery | contract-aligned intent; query behavior unimplemented |
| `frontend/screens/assistant/assistant_portal_operational_ai_workspace_assistant_ai/code.html` | `/assistant/ai/communications` | AI communication links | contract-aligned intent |
| `frontend/screens/assistant/assistant_portal_operational_patient_directory_assistant_patients/code.html` | `/assistant/patients/register` | registration CTA | contract-aligned intent |
| `frontend/screens/assistant/assistant_portal_operational_patient_directory_assistant_patients/code.html` | `/assistant/compliance` | policy link | no approved route/artifact; unresolved target |
| `frontend/screens/doctor/doctor_portal_active_voice_session_doctor_voice_sessions_id/code.html` | `/doctor/voice-sessions/VS-849204/review` | review CTA | concrete demo ID; runtime dynamic route not implemented |
| `frontend/screens/doctor/doctor_portal_clinical_orders_doctor_orders/code.html` | `/doctor/orders/lab/new` | lab order CTA | contract-aligned intent |
| `frontend/screens/doctor/doctor_portal_clinical_orders_doctor_orders/code.html` | `/doctor/orders/imaging/new` | imaging order CTA | contract-aligned intent |
| `frontend/screens/doctor/doctor_portal_patient_clinical_workspace_ai_scribe/code.html` | `#`/data path | clinical workspace CTA | no route target in markup evidence |
| `frontend/screens/doctor/doctor_portal_patient_clinical_notes_doctor_patients_id_notes/code.html` | `#`/export action | export | UI-only in static artifact |
| `frontend/screens/doctor/doctor_portal_patient_prescriptions_doctor_patients_id_prescriptions/code.html` | `/doctor/prescriptions/new` | new prescription CTA | contract-aligned intent |
| `frontend/screens/doctor/doctor_portal_patient_profile_overview_doctor_patients_id/code.html` | `/doctor/patients/4091/timeline` | patient timeline | concrete demo ID; contract-aligned shape |
| `frontend/screens/doctor/doctor_portal_patient_scoped_ai_workspace_doctor_ai_patient_id/code.html` | `/doctor/patients/PT-88429` | patient context return | concrete demo ID |
| `frontend/screens/doctor/doctor_portal_patient_scoped_ai_workspace_doctor_ai_patient_id/code.html` | `/doctor/ai/drafts/DF-99120` | AI draft CTA | concrete demo ID; contract-aligned shape |
| `frontend/screens/doctor/doctor_portal_voice_session_review_doctor_voice_sessions_id_review/code.html` | `/doctor/prescriptions/new?...&pt=88421` | AI medication suggestion | sensitive/demo data in query string; security risk for future runtime |
| `frontend/screens/doctor/doctor_portal_voice_session_review_doctor_voice_sessions_id_review/code.html` | `/doctor/orders/lab/new?...&pt=88421` | lab suggestion | sensitive/demo data in query string |
| `frontend/screens/patient/patient_portal_home_health_dashboard_patient_dashboard/code.html` | `/patient/ai`, `/patient/ai/context`, `/patient/ai/history` | AI quick links | contract-aligned intent |
| `frontend/screens/patient/patient_portal_vital_signs_self_reported_telemetry_patient_vitals/code.html` | `/patient/appointments` | appointment CTA | contract-aligned intent |

## `data-path` Navigation Markers

`data-path` is used heavily in the brand and portal artifacts, but no script or route resolver is present in the repository that turns these values into navigation. They are treated as Stitch metadata/placeholders. The values include platform overview, core solutions, AI/scribe, architecture/security, pricing, login, role portal paths, and clinical workspace labels.

## Inline Actions

Inline handlers demonstrate local interactions rather than navigation or backend operations: tabs, filters, modals, prompt insertion, print, alert messages, DOM removal, simulated rekey/export, draft approval, and scroll-to-section. They should be preserved as visual behavior in the source corpus but are not runtime navigation evidence.

## Audit Findings

- Dead-link status cannot be globally certified without a mounted runtime and an expected route list.
- `/assistant/compliance` is retained as a historical unresolved absolute target because it is absent from the approved current route contract and downloaded artifact list; it is documented as out-of-scope and not implemented.
- Login and brand links point to paths with no corresponding runtime implementation in this repository.
- No route guards, role redirects, breadcrumbs, or tenant-aware route resolution exist.
- Static exports use concrete IDs and some sensitive query parameters; future navigation should use opaque, authorized server-resolved resources.
- No navigation correction was made because changing links would alter downloaded UI behavior and exceed this phase.

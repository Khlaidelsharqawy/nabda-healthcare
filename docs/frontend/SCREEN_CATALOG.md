# Screen Catalog

## Catalog Method

Every `code.html` artifact is cataloged below by directory evidence and visible domain content. Because there is no runtime router, route values are **route intent**, not verified routes. `screen.png` is the adjacent Stitch preview when present. State coverage means states visibly represented in the artifact or its inline interaction code; it is not backend state support.

## Brand and Public Screens

| Screen ID | File | Route intent | Role | Tenant/patient scope | Purpose and data | State evidence |
|---|---|---|---|---|---|---|
| BR-01 | `frontend/screens/brand/aegishealth_clinical_ai_ecosystem/code.html` | `/` or platform overview | public/platform | platform | AegisHealth product and clinical AI ecosystem overview; demo clinical, tenant, AI, and security claims | success/presentation |
| BR-02 | `frontend/screens/brand/aegishealth_medical_ecosystem_logo/code.html` | component-level artifact | public | none | Logo/brand artifact | presentation |
| BR-03 | `frontend/screens/brand/aegishealth_saas_contact_us_clinic_onboarding_contact/code.html` | `/contact` intent | public/prospect | future tenant | Clinic onboarding/contact form presentation | form/presentation |
| BR-04 | `frontend/screens/brand/aegishealth_saas_platform_intelligent_healthcare_management_for_modern_clinics/code.html` | `/` or platform overview | public/platform | platform | Duplicate/near-duplicate ecosystem marketing screen | success/presentation |
| PUB-01 | `frontend/screens/public/public_clinic_al_nour_medical_center_booking/code.html` | `/clinic/al-nour` and booking flow | public | Al-Nour tenant; no patient session | Clinic landing, doctors, services, appointment booking, public AI drawer | selection/modal/booking states |
| PUB-02 | `frontend/screens/public/public_clinic_attending_doctors_directory_clinic_al_nour_doctors/code.html` | `/clinic/al-nour/doctors` | public | Al-Nour tenant | Public doctor directory and filters | default/filtered/empty filter |
| PUB-03 | `frontend/screens/public/public_clinic_booking_confirmation_clinic_al_nour_booking_confirmed/code.html` | `/clinic/al-nour/booking/confirmed` | public | Al-Nour tenant; booking record | Booking confirmation | confirmed |
| PUB-04 | `frontend/screens/public/public_clinic_medical_services_clinics_clinic_al_nour_services/code.html` | `/clinic/al-nour/services` | public | Al-Nour tenant | Public services/departments | default/filter |

## Authentication Screens

| Screen ID | File | Route intent | Role | Scope | Purpose/data | State evidence |
|---|---|---|---|---|---|---|
| AUTH-01 | `frontend/screens/auth/aegishealth_unified_secure_login_role_based_dispatch_login/code.html` | `/login` | all roles | tenant selected by future auth | Unified login and role selection/dispatch simulation | role tabs, login mode, OTP/test presets |
| AUTH-02 | `frontend/screens/auth/centralized_authentication_unified_secure_login_automatic_role_routing/code.html` | `/login` | all roles | platform/tenant | Alternate centralized login/role-routing screen | email/syndicate mode, OTP simulation |
| AUTH-03 | `frontend/screens/auth/authentication_account_verification/code.html` | `/verify` | all applicable users | account | Verification state showcase | input/loading/success |
| AUTH-04 | `frontend/screens/auth/authentication_forgot_password_account_recovery/code.html` | `/forgot-password` | all roles | account | Password recovery UI | form/error/language toggle |
| AUTH-05 | `frontend/screens/auth/authentication_reset_password/code.html` | `/reset-password` | all roles | account | Password reset UI | strength/mismatch/success/countdown |
| AUTH-06 | `frontend/screens/auth/authentication_session_expired/code.html` | `/session-expired` | authenticated users | prior session | Expired session notice and login actions | expired |
| AUTH-07 | `frontend/screens/auth/authentication_unauthorized_access_denied/code.html` | `/unauthorized` | all roles | permission | Access denied/session messaging | denied/countdown |

## Doctor Screens

| Screen ID | File | Route intent | Scope | Primary domains | State/data evidence |
|---|---|---|---|---|---|
| DOC-01 | `frontend/screens/doctor/doctor_portal_clinical_dashboard_practice_overview/code.html` | `/doctor/dashboard` | tenant + doctor shift | dashboard, appointments, queue, telemetry, AI scribe | shift metrics, active patient, queue, alerts |
| DOC-02 | `frontend/screens/doctor/doctor_portal_appointments_clinical_schedule/code.html` | `/doctor/appointments` | tenant + doctor | appointments | schedule and day operations |
| DOC-03 | `frontend/screens/doctor/doctor_portal_patient_registry_doctor_patients/code.html` | `/doctor/patients` | tenant | patients | roster, search, loading state toggle |
| DOC-04 | `frontend/screens/doctor/doctor_portal_patient_directory_emr_records/code.html` | patient directory/EMR variant | tenant | patients, records | alternate registry, export claim |
| DOC-05 | `frontend/screens/doctor/doctor_portal_patient_profile_overview_doctor_patients_id/code.html` | `/doctor/patients/[id]` | tenant + patient | demographics, overview, vitals | concrete demo patient and timeline link |
| DOC-06 | `frontend/screens/doctor/doctor_portal_patient_medical_history_doctor_patients_id_history/code.html` | `/doctor/patients/[id]/history` | tenant + patient | history, allergies, clinical | attestation banner/dismissal |
| DOC-07 | `frontend/screens/doctor/doctor_portal_patient_clinical_timeline_doctor_patients_id_timeline/code.html` | `/doctor/patients/[id]/timeline` | tenant + patient | encounters, timeline | expandable timeline nodes |
| DOC-08 | `frontend/screens/doctor/doctor_portal_longitudinal_patient_clinical_profile_medical_timeline/code.html` | timeline variant | tenant + patient | longitudinal EMR | timeline presentation |
| DOC-09 | `frontend/screens/doctor/doctor_portal_patient_clinical_notes_doctor_patients_id_notes/code.html` | `/doctor/patients/[id]/notes` | tenant + patient | clinical notes | note/export presentation |
| DOC-10 | `frontend/screens/doctor/doctor_portal_patient_documents_doctor_patients_id_documents/code.html` | `/doctor/patients/[id]/documents` | tenant + patient | files/documents | preview/download/audit handlers |
| DOC-11 | `frontend/screens/doctor/doctor_portal_patient_prescriptions_doctor_patients_id_prescriptions/code.html` | `/doctor/patients/[id]/prescriptions` | tenant + patient | prescriptions | prescription list and new link |
| DOC-12 | `frontend/screens/doctor/doctor_portal_prescription_writer_doctor_prescriptions_new/code.html` | `/doctor/prescriptions/new` | tenant + patient | medication/prescription | add/remove medication interactions |
| DOC-13 | `frontend/screens/doctor/doctor_portal_medication_details_doctor_medications_id/code.html` | `/doctor/medications/[id]` | tenant + patient | medication | medication details |
| DOC-14 | `frontend/screens/doctor/doctor_portal_clinical_orders_doctor_orders/code.html` | `/doctor/orders` | tenant + patient/encounter | lab/imaging orders | links to lab and imaging order screens |
| DOC-15 | `frontend/screens/doctor/doctor_portal_lab_order_doctor_orders_lab_new_1/code.html` | `/doctor/orders/lab/new` variant 1 | tenant + patient | lab orders | sample tests/add order interactions; no preview PNG |
| DOC-16 | `frontend/screens/doctor/doctor_portal_lab_order_doctor_orders_lab_new_2/code.html` | `/doctor/orders/lab/new` variant 2 | tenant + patient | lab orders | alternate lab order artifact |
| DOC-17 | `frontend/screens/doctor/doctor_portal_imaging_order_doctor_orders_imaging_new/code.html` | `/doctor/orders/imaging/new` | tenant + patient | imaging orders | order form |
| DOC-18 | `frontend/screens/doctor/doctor_portal_ai_workspace_doctor_ai/code.html` | `/doctor/ai` | tenant + doctor | scoped AI | assistant workspace and clinical context |
| DOC-19 | `frontend/screens/doctor/doctor_portal_patient_scoped_ai_workspace_doctor_ai_patient_id/code.html` | `/doctor/ai/patient/[id]` | tenant + patient | AI context | patient-scoped prompts and draft link |
| DOC-20 | `frontend/screens/doctor/doctor_portal_clinical_draft_review_doctor_ai_drafts_id/code.html` | `/doctor/ai/drafts/[id]` | tenant + patient + doctor | AI draft/clinical note | editable draft and export/attestation intent |
| DOC-21 | `frontend/screens/doctor/doctor_portal_patient_clinical_workspace_ai_scribe/code.html` | clinical workspace variant | tenant + patient | AI scribe, encounter, notes | listening/transcript/draft |
| DOC-22 | `frontend/screens/doctor/doctor_portal_new_voice_session_doctor_voice_sessions_new/code.html` | `/doctor/voice-sessions/new` | tenant + patient | voice/consent | consent gate and start interaction |
| DOC-23 | `frontend/screens/doctor/doctor_portal_active_voice_session_doctor_voice_sessions_id/code.html` | `/doctor/voice-sessions/[id]` | tenant + patient | voice/transcript | active session and review link |
| DOC-24 | `frontend/screens/doctor/doctor_portal_voice_session_review_doctor_voice_sessions_id_review/code.html` | `/doctor/voice-sessions/[id]/review` | tenant + patient | voice, SOAP, orders | SOAP/transcript/actions tabs and order links |
| DOC-25 | `frontend/screens/doctor/doctor_portal_voice_sessions_ambient_scribe_review/code.html` | voice-session list/review variant | tenant + doctor | voice/AI | review-oriented voice screen |
| DOC-26 | `frontend/screens/doctor/doctor_portal_clinical_inquiries_patient_triage_inbox_doctor_communications/code.html` | doctor communications variant | tenant + patient | communications/AI draft | apply/discard draft handlers |
| DOC-27 | `frontend/screens/doctor/doctor_portal_prescription_refill_approval_queue_doctor_refills/code.html` | refill queue variant | tenant + patient | prescriptions/refills | approval feedback/dismissal |

## Assistant Screens

| Screen ID | File | Route intent | Scope | Primary domains | State/data evidence |
|---|---|---|---|---|---|
| AST-01 | `frontend/screens/assistant/assistant_portal_patient_registration_reception_intake/code.html` | `/assistant/patients/register` | tenant + patient intake | demographics/registration | form/presentation |
| AST-02 | `frontend/screens/assistant/assistant_portal_operational_patient_directory_assistant_patients/code.html` | `/assistant/patients` | tenant | patients | roster, register link, compliance link |
| AST-03 | `frontend/screens/assistant/assistant_portal_operational_appointments_assistant_appointments/code.html` | `/assistant/appointments` | tenant | appointments | day schedule/export presentation |
| AST-04 | `frontend/screens/assistant/assistant_portal_live_reception_waiting_queue_room_dispatch/code.html` | `/assistant/queue` | tenant + patient | queue/rooms | room dispatch and alert handler |
| AST-05 | `frontend/screens/assistant/assistant_portal_communications_whatsapp_triage_hub/code.html` | `/assistant/communications` | tenant + patient | WhatsApp/communications | triage presentation |
| AST-06 | `frontend/screens/assistant/assistant_portal_operational_triage_whatsapp_queue/code.html` | WhatsApp queue variant | tenant + patient | queue/booking/WhatsApp | modal/open booking handler |
| AST-07 | `frontend/screens/assistant/assistant_portal_laboratory_specimen_collection_accession_intake_assistant/code.html` | laboratory accession variant | tenant + patient | lab specimens | order selection/manual modal |
| AST-08 | `frontend/screens/assistant/assistant_portal_operational_ai_workspace_assistant_ai/code.html` | `/assistant/ai` | tenant + operational context | assistant AI | communications links |
| AST-09 | `frontend/screens/assistant/assistant_portal_ai_communication_drafter_assistant_ai_communications/code.html` | `/assistant/ai/communications` | tenant + patient/communication | AI draft/communications | editor/approve stage interactions |

## Patient Screens

| Screen ID | File | Route intent | Scope | Primary domains | State/data evidence |
|---|---|---|---|---|---|
| PAT-01 | `frontend/screens/patient/patient_portal_home_health_dashboard_patient_dashboard/code.html` | `/patient/dashboard` | patient-scoped | overview, AI links, appointments | dashboard links to three AI surfaces |
| PAT-02 | `frontend/screens/patient/patient_portal_profile_account_settings_patient_profile/code.html` | `/patient/profile` | patient-scoped | demographics/profile | edit interaction |
| PAT-03 | `frontend/screens/patient/patient_portal_my_appointments_consultation_hub/code.html` | `/patient/appointments` | patient-scoped + tenant | appointments/intake | modal and prompt interactions |
| PAT-04 | `frontend/screens/patient/patient_portal_my_medications_digital_prescriptions/code.html` | `/patient/medications` | patient-scoped | medications/prescriptions | medication presentation |
| PAT-05 | `frontend/screens/patient/patient_portal_lab_results_diagnostic_reports/code.html` | `/patient/labs` | patient-scoped | lab results | share interaction |
| PAT-06 | `frontend/screens/patient/patient_portal_vital_signs_self_reported_telemetry_patient_vitals/code.html` | patient vitals variant | patient-scoped | vitals/telemetry | tabs, print, log form, appointments link |
| PAT-07 | `frontend/screens/patient/patient_portal_health_overview_digital_prescription/code.html` | prescription overview variant | patient-scoped | prescription/AI | prompt handlers |
| PAT-08 | `frontend/screens/patient/patient_portal_ai_health_workspace_patient_ai/code.html` | `/patient/ai` | patient-scoped | bounded AI | patient health assistant |
| PAT-09 | `frontend/screens/patient/patient_portal_ai_authorized_context_patient_ai_context/code.html` | `/patient/ai/context` | patient-scoped | AI context/consent | authorized context presentation |
| PAT-10 | `frontend/screens/patient/patient_portal_ai_interaction_history_patient_ai_history/code.html` | `/patient/ai/history` | patient-scoped | AI history | log/export presentation |

## Super Admin and Platform Screens

| Screen ID | File | Route intent | Scope | Primary domains | State/data evidence |
|---|---|---|---|---|---|
| ADM-01 | `frontend/screens/admin/super_admin_platform_dashboard_operations/code.html` | `/admin/dashboard` | platform | operations/usage/AI | query prompt interaction |
| ADM-02 | `frontend/screens/admin/super_admin_clinics_tenants_directory/code.html` | `/admin/clinics` | platform + tenants | tenancy | search/filter/script |
| ADM-03 | `frontend/screens/admin/super_admin_clinic_details_tenant_management/code.html` | `/admin/clinics/[id]` | platform + tenant | tenant management/audit | export presentation |
| ADM-04 | `frontend/screens/admin/super_admin_clinic_provisioning_tenant_setup/code.html` | `/admin/clinics/provision` | platform | tenant setup | form/script |
| ADM-05 | `frontend/screens/admin/super_admin_clinic_users_admin_clinics_id_users/code.html` | `/admin/clinics/[id]/users` | platform + tenant | staff/users/RBAC | invite/filter/export handlers |
| ADM-06 | `frontend/screens/admin/super_admin_clinic_usage_admin_clinics_id_usage/code.html` | `/admin/clinics/[id]/usage` | platform + tenant | usage/quotas | ledger presentation |
| ADM-07 | `frontend/screens/admin/super_admin_platform_users_rbac_permissions/code.html` | `/admin/users` | platform | identity/RBAC | user/permission presentation |
| ADM-08 | `frontend/screens/admin/super_admin_platform_security_kms_isolation_audit_logs/code.html` | `/admin/security` | platform + tenants | security/audit/KMS | export and rekey demo handlers |
| ADM-09 | `frontend/screens/admin/super_admin_subscriptions_billing_plans_metered_quotas/code.html` | `/admin/subscriptions` | platform + tenants | subscriptions/quotas | filters and quota modal |
| ADM-10 | `frontend/screens/admin/super_admin_platform_operations_tenant_provisioning/code.html` | provisioning variant | platform + tenant | operations/provisioning | export presentation |
| ADM-11 | `frontend/screens/admin/company_headquarters_remote_console_master_saas_operations_global_control_admin/code.html` | global console variant | platform | global operations | export/security presentation |

## Screen-Level Gaps

- No screen has a verified runtime route because no router exists.
- No screen has a shared component boundary; all UI is embedded in its own HTML document.
- Most screens show success/demo content; loading, empty, error, disabled, unauthorized, unknown-tenant, and incomplete-configuration states are inconsistently represented.
- Concrete patient, clinic, doctor, medication, and encounter data is mock/reference content until a backend contract exists.

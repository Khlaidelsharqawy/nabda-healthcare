# Route Map and Route Matrix

## Evidence Rule

This repository has no router or route declarations. A route below is marked **inferred** when its filename or markup names the approved route, and **linked** when an absolute `href` was found in HTML. A screen artifact is not treated as a working route merely because its directory name resembles a route.

## Approved Route Contract vs Downloaded Evidence

| Approved route | Downloaded artifact / final path | Evidence | Status |
|---|---|---|---|
| `/doctor/dashboard` | `frontend/screens/doctor/doctor_portal_clinical_dashboard_practice_overview/code.html` | directory name | inferred |
| `/doctor/appointments` | `frontend/screens/doctor/doctor_portal_appointments_clinical_schedule/code.html` | directory name | inferred |
| `/doctor/patients` | `frontend/screens/doctor/doctor_portal_patient_registry_doctor_patients/code.html` | directory name | inferred |
| `/doctor/patients/[id]` | `frontend/screens/doctor/doctor_portal_patient_profile_overview_doctor_patients_id/code.html` | directory name; concrete patient link exists | inferred/linked |
| `/doctor/patients/[id]/history` | `frontend/screens/doctor/doctor_portal_patient_medical_history_doctor_patients_id_history/code.html` | directory name | inferred |
| `/doctor/patients/[id]/timeline` | `frontend/screens/doctor/doctor_portal_patient_clinical_timeline_doctor_patients_id_timeline/code.html` | directory name; concrete patient link exists | inferred/linked |
| `/doctor/patients/[id]/notes` | `frontend/screens/doctor/doctor_portal_patient_clinical_notes_doctor_patients_id_notes/code.html` | directory name | inferred |
| `/doctor/patients/[id]/documents` | `frontend/screens/doctor/doctor_portal_patient_documents_doctor_patients_id_documents/code.html` | directory name | inferred |
| `/doctor/patients/[id]/prescriptions` | `frontend/screens/doctor/doctor_portal_patient_prescriptions_doctor_patients_id_prescriptions/code.html` | directory name | inferred |
| `/doctor/prescriptions/new` | `frontend/screens/doctor/doctor_portal_prescription_writer_doctor_prescriptions_new/code.html` | directory name; linked from orders/prescriptions | inferred/linked |
| `/doctor/medications/[id]` | `frontend/screens/doctor/doctor_portal_medication_details_doctor_medications_id/code.html` | directory name | inferred |
| `/doctor/orders` | `frontend/screens/doctor/doctor_portal_clinical_orders_doctor_orders/code.html` | directory name | inferred |
| `/doctor/orders/lab/new` | `frontend/screens/doctor/doctor_portal_lab_order_doctor_orders_lab_new_1/code.html`, `...lab_new_2/code.html` | duplicate-looking variants; linked from orders | split/duplicate review |
| `/doctor/orders/imaging/new` | `frontend/screens/doctor/doctor_portal_imaging_order_doctor_orders_imaging_new/code.html` | directory name; linked from orders | inferred/linked |
| `/doctor/ai` | `frontend/screens/doctor/doctor_portal_ai_workspace_doctor_ai/code.html` | directory name | inferred |
| `/doctor/ai/patient/[id]` | `frontend/screens/doctor/doctor_portal_patient_scoped_ai_workspace_doctor_ai_patient_id/code.html` | directory name; patient link | inferred/linked |
| `/doctor/ai/drafts/[id]` | `frontend/screens/doctor/doctor_portal_clinical_draft_review_doctor_ai_drafts_id/code.html` | directory name; patient AI link | inferred/linked |
| `/doctor/voice-sessions` | `frontend/screens/doctor/doctor_portal_voice_sessions_ambient_scribe_review/code.html` | directory name | inferred |
| `/doctor/voice-sessions/new` | `frontend/screens/doctor/doctor_portal_new_voice_session_doctor_voice_sessions_new/code.html` | directory name | inferred |
| `/doctor/voice-sessions/[id]` | `frontend/screens/doctor/doctor_portal_active_voice_session_doctor_voice_sessions_id/code.html` | directory name | inferred |
| `/doctor/voice-sessions/[id]/review` | `frontend/screens/doctor/doctor_portal_voice_session_review_doctor_voice_sessions_id_review/code.html` | directory name; absolute review link | inferred/linked |
| `/assistant/patients` | `frontend/screens/assistant/assistant_portal_operational_patient_directory_assistant_patients/code.html` | directory name; registration link | inferred/linked |
| `/assistant/patients/register` | `frontend/screens/assistant/assistant_portal_patient_registration_reception_intake/code.html` | directory name | inferred |
| `/assistant/appointments` | `frontend/screens/assistant/assistant_portal_operational_appointments_assistant_appointments/code.html` | directory name | inferred |
| `/assistant/queue` | `frontend/screens/assistant/assistant_portal_live_reception_waiting_queue_room_dispatch/code.html` | directory name | inferred |
| `/assistant/communications` | `frontend/screens/assistant/assistant_portal_communications_whatsapp_triage_hub/code.html` | directory name | inferred |
| `/assistant/ai` | `frontend/screens/assistant/assistant_portal_operational_ai_workspace_assistant_ai/code.html` | directory name; communication links | inferred/linked |
| `/assistant/ai/communications` | `frontend/screens/assistant/assistant_portal_ai_communication_drafter_assistant_ai_communications/code.html` | directory name; absolute links | inferred/linked |
| `/patient/dashboard` | `frontend/screens/patient/patient_portal_home_health_dashboard_patient_dashboard/code.html` | directory name | inferred |
| `/patient/profile` | `frontend/screens/patient/patient_portal_profile_account_settings_patient_profile/code.html` | directory name | inferred |
| `/patient/appointments` | `frontend/screens/patient/patient_portal_my_appointments_consultation_hub/code.html` | directory name; linked from vitals | inferred/linked |
| `/patient/medications` | `frontend/screens/patient/patient_portal_my_medications_digital_prescriptions/code.html` | directory name | inferred |
| `/patient/labs` | `frontend/screens/patient/patient_portal_lab_results_diagnostic_reports/code.html` | directory name | inferred |
| `/patient/ai` | `frontend/screens/patient/patient_portal_ai_health_workspace_patient_ai/code.html` | directory name; dashboard links | inferred/linked |
| `/patient/ai/context` | `frontend/screens/patient/patient_portal_ai_authorized_context_patient_ai_context/code.html` | directory name; dashboard link | inferred/linked |
| `/patient/ai/history` | `frontend/screens/patient/patient_portal_ai_interaction_history_patient_ai_history/code.html` | directory name; dashboard link | inferred/linked |
| `/admin/dashboard` | `frontend/screens/admin/super_admin_platform_dashboard_operations/code.html` | directory name | inferred |
| `/admin/clinics` | `frontend/screens/admin/super_admin_clinics_tenants_directory/code.html` | directory name | inferred |
| `/admin/clinics/[id]` | `frontend/screens/admin/super_admin_clinic_details_tenant_management/code.html` | directory name | inferred |
| `/admin/clinics/provision` | `frontend/screens/admin/super_admin_clinic_provisioning_tenant_setup/code.html` | directory name | inferred |
| `/admin/clinics/[id]/users` | `frontend/screens/admin/super_admin_clinic_users_admin_clinics_id_users/code.html` | directory name | inferred |
| `/admin/clinics/[id]/usage` | `frontend/screens/admin/super_admin_clinic_usage_admin_clinics_id_usage/code.html` | directory name | inferred |
| `/admin/users` | `frontend/screens/admin/super_admin_platform_users_rbac_permissions/code.html` | directory name | inferred |
| `/admin/security` | `frontend/screens/admin/super_admin_platform_security_kms_isolation_audit_logs/code.html` | directory name | inferred |
| `/admin/subscriptions` | `frontend/screens/admin/super_admin_subscriptions_billing_plans_metered_quotas/code.html` | directory name | inferred |
| `/login` | `frontend/screens/auth/aegishealth_unified_secure_login_role_based_dispatch_login/code.html`, `frontend/screens/auth/centralized_authentication_unified_secure_login_automatic_role_routing/code.html` | two login artifacts | duplicate/variant review |
| `/forgot-password` | `frontend/screens/auth/authentication_forgot_password_account_recovery/code.html` | directory name; login link | inferred/linked |
| `/reset-password` | `frontend/screens/auth/authentication_reset_password/code.html` | directory name | inferred |
| `/verify` | `frontend/screens/auth/authentication_account_verification/code.html` | directory name; login link | inferred/linked |
| `/session-expired` | `frontend/screens/auth/authentication_session_expired/code.html` | directory name; login links | inferred/linked |
| `/unauthorized` | `frontend/screens/auth/authentication_unauthorized_access_denied/code.html` | directory name | inferred |
| `/` | no route declaration; brand artifacts in `frontend/screens/brand/` | no router evidence | unknown |
| `/clinic/[slug]` | `frontend/screens/public/public_clinic_al_nour_medical_center_booking/code.html` | Al-Nour-specific directory | tenant-specific reference |
| `/clinic/[slug]/doctors` | `frontend/screens/public/public_clinic_attending_doctors_directory_clinic_al_nour_doctors/code.html` | Al-Nour-specific directory | tenant-specific reference |
| `/clinic/[slug]/services` | `frontend/screens/public/public_clinic_medical_services_clinics_clinic_al_nour_services/code.html` | Al-Nour-specific directory | tenant-specific reference |
| `/clinic/al-nour` | same booking artifact | Al-Nour-specific directory | reference tenant evidence |
| `/clinic/al-nour/doctors` | same doctors artifact | Al-Nour-specific directory | reference tenant evidence |
| `/clinic/al-nour/services` | same services artifact | Al-Nour-specific directory | reference tenant evidence |
| `/clinic/al-nour/booking/confirmed` | `frontend/screens/public/public_clinic_booking_confirmation_clinic_al_nour_booking_confirmed/code.html` | Al-Nour-specific directory | reference tenant evidence |

## Downloaded Artifacts Outside the Approved Route Contract

These are present and must not be silently deleted:

- `frontend/screens/assistant/assistant_portal_laboratory_specimen_collection_accession_intake_assistant/`: laboratory accession/intake surface.
- `frontend/screens/assistant/assistant_portal_operational_triage_whatsapp_queue/`: separate WhatsApp triage queue variant.
- `frontend/screens/doctor/doctor_portal_lab_order_doctor_orders_lab_new_1/` and `...lab_new_2/`: two lab-order variants.
- `frontend/screens/doctor/doctor_portal_patient_clinical_workspace_ai_scribe/`: doctor clinical workspace with AI scribe.
- `frontend/screens/doctor/doctor_portal_patient_directory_emr_records/`: alternate patient-directory/EMR surface.
- `frontend/screens/doctor/doctor_portal_prescription_refill_approval_queue_doctor_refills/`: refill approval queue.
- `frontend/screens/doctor/doctor_portal_voice_sessions_ambient_scribe_review/`: voice-session list/review variant.
- `frontend/screens/patient/patient_portal_health_overview_digital_prescription/`: patient prescription overview variant.
- `frontend/screens/patient/patient_portal_vital_signs_self_reported_telemetry_patient_vitals/`: patient vitals surface.
- `frontend/screens/admin/company_headquarters_remote_console_master_saas_operations_global_control_admin/`: company-headquarters/global console.
- `frontend/screens/admin/super_admin_platform_operations_tenant_provisioning/`: alternate platform provisioning surface.
- `frontend/screens/brand/`: ecosystem overview, logo, and clinic onboarding contact artifacts.

## Route Risks

- A static file path is not a route implementation.
- Concrete IDs in links (`4091`, `PT-88429`, `VS-849204`) are demo values, not dynamic route parameters.
- Query-string values in voice review links include medication, dose, and patient identifiers; future runtime handling must avoid exposing sensitive data in URLs.
- No route guard, redirect, 404, or unknown-tenant behavior is implemented.

## Batch 02 Runtime Status

The typed registry in `src/routeRegistry.ts` remains the route source for the runtime adapter. `/doctor/dashboard` is the first real React route using `DoctorShell`; `/doctor/dashboard?reference=stitch` directly mounts the frozen source reference. Other registered paths continue to use the reference adapter until their screen batch is implemented.

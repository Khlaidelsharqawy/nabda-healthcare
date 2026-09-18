export type ScreenRole = 'doctor' | 'assistant' | 'patient' | 'admin' | 'auth' | 'public' | 'brand';

export type ScreenRoute = {
  path: string;
  label: string;
  role: ScreenRole;
  source: string;
};

const screen = (path: string, label: string, role: ScreenRole, source: string): ScreenRoute => ({
  path,
  label,
  role,
  source: `/screens/${role}/${source}/code.html`,
});

export const screenRoutes: ScreenRoute[] = [
  screen('/', 'AegisHealth platform overview', 'brand', 'aegishealth_clinical_ai_ecosystem'),
  screen('/login', 'Unified secure login', 'auth', 'aegishealth_unified_secure_login_role_based_dispatch_login'),
  screen('/forgot-password', 'Account recovery', 'auth', 'authentication_forgot_password_account_recovery'),
  screen('/reset-password', 'Reset password', 'auth', 'authentication_reset_password'),
  screen('/verify', 'Account verification', 'auth', 'authentication_account_verification'),
  screen('/session-expired', 'Session expired', 'auth', 'authentication_session_expired'),
  screen('/unauthorized', 'Unauthorized access', 'auth', 'authentication_unauthorized_access_denied'),
  screen('/doctor/dashboard', 'Doctor dashboard', 'doctor', 'doctor_portal_clinical_dashboard_practice_overview'),
  screen('/doctor/appointments', 'Doctor appointments', 'doctor', 'doctor_portal_appointments_clinical_schedule'),
  screen('/doctor/patients', 'Doctor patient registry', 'doctor', 'doctor_portal_patient_registry_doctor_patients'),
  screen('/doctor/orders', 'Clinical orders', 'doctor', 'doctor_portal_clinical_orders_doctor_orders'),
  screen('/doctor/orders/lab/new', 'New laboratory order', 'doctor', 'doctor_portal_lab_order_doctor_orders_lab_new_1'),
  screen('/doctor/orders/imaging/new', 'New imaging order', 'doctor', 'doctor_portal_imaging_order_doctor_orders_imaging_new'),
  screen('/doctor/ai', 'Doctor AI workspace', 'doctor', 'doctor_portal_ai_workspace_doctor_ai'),
  screen('/doctor/voice-sessions', 'Voice sessions', 'doctor', 'doctor_portal_voice_sessions_ambient_scribe_review'),
  screen('/doctor/refills', 'Prescription refill approvals', 'doctor', 'doctor_portal_prescription_refill_approval_queue_doctor_refills'),
  screen('/doctor/communications', 'Doctor communications', 'doctor', 'doctor_portal_clinical_inquiries_patient_triage_inbox_doctor_communications'),
  screen('/assistant/patients', 'Assistant patient directory', 'assistant', 'assistant_portal_operational_patient_directory_assistant_patients'),
  screen('/assistant/patients/register', 'Patient registration', 'assistant', 'assistant_portal_patient_registration_reception_intake'),
  screen('/assistant/appointments', 'Assistant appointments', 'assistant', 'assistant_portal_operational_appointments_assistant_appointments'),
  screen('/assistant/queue', 'Waiting queue', 'assistant', 'assistant_portal_live_reception_waiting_queue_room_dispatch'),
  screen('/assistant/communications', 'Communications', 'assistant', 'assistant_portal_communications_whatsapp_triage_hub'),
  screen('/assistant/ai', 'Assistant AI workspace', 'assistant', 'assistant_portal_operational_ai_workspace_assistant_ai'),
  screen('/assistant/ai/communications', 'AI communication drafting', 'assistant', 'assistant_portal_ai_communication_drafter_assistant_ai_communications'),
  screen('/assistant/orders/intake', 'Laboratory specimen intake', 'assistant', 'assistant_portal_laboratory_specimen_collection_accession_intake_assistant'),
  screen('/patient/dashboard', 'Patient dashboard', 'patient', 'patient_portal_home_health_dashboard_patient_dashboard'),
  screen('/patient/profile', 'Patient profile', 'patient', 'patient_portal_profile_account_settings_patient_profile'),
  screen('/patient/appointments', 'Patient appointments', 'patient', 'patient_portal_my_appointments_consultation_hub'),
  screen('/patient/medications', 'Patient medications', 'patient', 'patient_portal_my_medications_digital_prescriptions'),
  screen('/patient/labs', 'Patient laboratory results', 'patient', 'patient_portal_lab_results_diagnostic_reports'),
  screen('/patient/ai', 'Patient AI workspace', 'patient', 'patient_portal_ai_health_workspace_patient_ai'),
  screen('/patient/ai/context', 'Patient AI context', 'patient', 'patient_portal_ai_authorized_context_patient_ai_context'),
  screen('/patient/ai/history', 'Patient AI history', 'patient', 'patient_portal_ai_interaction_history_patient_ai_history'),
  screen('/patient/vitals', 'Patient vitals', 'patient', 'patient_portal_vital_signs_self_reported_telemetry_patient_vitals'),
  screen('/admin/dashboard', 'Platform dashboard', 'admin', 'super_admin_platform_dashboard_operations'),
  screen('/admin/clinics', 'Clinic directory', 'admin', 'super_admin_clinics_tenants_directory'),
  screen('/admin/clinics/provision', 'Clinic provisioning', 'admin', 'super_admin_clinic_provisioning_tenant_setup'),
  screen('/admin/users', 'Platform users and permissions', 'admin', 'super_admin_platform_users_rbac_permissions'),
  screen('/admin/security', 'Platform security', 'admin', 'super_admin_platform_security_kms_isolation_audit_logs'),
  screen('/admin/subscriptions', 'Subscriptions', 'admin', 'super_admin_subscriptions_billing_plans_metered_quotas'),
  screen('/admin/remote-console', 'Remote operations console', 'admin', 'company_headquarters_remote_console_master_saas_operations_global_control_admin'),
  screen('/clinic/al-nour', 'Al-Nour public clinic', 'public', 'public_clinic_al_nour_medical_center_booking'),
  screen('/clinic/al-nour/doctors', 'Al-Nour doctors', 'public', 'public_clinic_attending_doctors_directory_clinic_al_nour_doctors'),
  screen('/clinic/al-nour/services', 'Al-Nour services', 'public', 'public_clinic_medical_services_clinics_clinic_al_nour_services'),
  screen('/clinic/al-nour/booking/confirmed', 'Booking confirmation', 'public', 'public_clinic_booking_confirmation_clinic_al_nour_booking_confirmed'),
];

const dynamicRoutes: ScreenRoute[] = [
  screen('/doctor/patients/[id]', 'Doctor patient profile', 'doctor', 'doctor_portal_patient_profile_overview_doctor_patients_id'),
  screen('/doctor/patients/[id]/history', 'Patient medical history', 'doctor', 'doctor_portal_patient_medical_history_doctor_patients_id_history'),
  screen('/doctor/patients/[id]/timeline', 'Patient clinical timeline', 'doctor', 'doctor_portal_patient_clinical_timeline_doctor_patients_id_timeline'),
  screen('/doctor/patients/[id]/notes', 'Patient clinical notes', 'doctor', 'doctor_portal_patient_clinical_notes_doctor_patients_id_notes'),
  screen('/doctor/patients/[id]/documents', 'Patient documents', 'doctor', 'doctor_portal_patient_documents_doctor_patients_id_documents'),
  screen('/doctor/patients/[id]/prescriptions', 'Patient prescriptions', 'doctor', 'doctor_portal_patient_prescriptions_doctor_patients_id_prescriptions'),
  screen('/doctor/prescriptions/new', 'New prescription', 'doctor', 'doctor_portal_prescription_writer_doctor_prescriptions_new'),
  screen('/doctor/medications/[id]', 'Medication details', 'doctor', 'doctor_portal_medication_details_doctor_medications_id'),
  screen('/doctor/ai/patient/[id]', 'Patient-scoped doctor AI', 'doctor', 'doctor_portal_patient_scoped_ai_workspace_doctor_ai_patient_id'),
  screen('/doctor/ai/drafts/[id]', 'Doctor AI draft review', 'doctor', 'doctor_portal_clinical_draft_review_doctor_ai_drafts_id'),
  screen('/doctor/voice-sessions/new', 'New voice session', 'doctor', 'doctor_portal_new_voice_session_doctor_voice_sessions_new'),
  screen('/doctor/voice-sessions/[id]', 'Active voice session', 'doctor', 'doctor_portal_active_voice_session_doctor_voice_sessions_id'),
  screen('/doctor/voice-sessions/[id]/review', 'Voice session review', 'doctor', 'doctor_portal_voice_session_review_doctor_voice_sessions_id_review'),
  screen('/admin/clinics/[id]', 'Clinic details', 'admin', 'super_admin_clinic_details_tenant_management'),
  screen('/admin/clinics/[id]/users', 'Clinic users', 'admin', 'super_admin_clinic_users_admin_clinics_id_users'),
  screen('/admin/clinics/[id]/usage', 'Clinic usage', 'admin', 'super_admin_clinic_usage_admin_clinics_id_usage'),
];

const allRoutes = [...screenRoutes, ...dynamicRoutes];

const routePattern = (path: string): RegExp => new RegExp(`^${path.replaceAll('[id]', '[^/]+')}$`);

export const resolveScreenRoute = (pathname: string): ScreenRoute | undefined => {
  const directRoute = screenRoutes.find((route) => route.path === pathname);
  if (directRoute) return directRoute;
  return dynamicRoutes.find((route) => routePattern(route.path).test(pathname));
};

export const knownRoutes = allRoutes.map((route) => route.path);

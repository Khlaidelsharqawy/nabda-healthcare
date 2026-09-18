# Tenant Architecture and Al-Nour Analysis

## Current Representation

Tenant identity is represented only as presentation content in static HTML. Al-Nour appears directly in public directory names and visible booking/doctor/service content. Admin screens contain clinic names, slugs, usage, subscription, security, and provisioning examples. There is no tenant context provider, URL resolver, tenant object module, or backend request scope.

## Generic Model Required Later

```text
AegisHealth platform
  -> tenant identified by trusted session or public slug
      -> branding, doctors, services, booking configuration
      -> staff and patient data
      -> clinical, communication, AI, file, audit, and usage scope
```

The generic public contract should be `/clinic/[slug]`, `/clinic/[slug]/doctors`, and `/clinic/[slug]/services`. Al-Nour is one reference tenant and must not become the fallback for unknown slugs.

## Tenant Matrix

| Domain | Tenant scoped | Patient scoped | Public scoped | Platform scoped | Evidence |
|---|---:|---:|---:|---:|---|
| Patients | yes | record | no | aggregate/admin | doctor/assistant artifacts |
| Encounters/notes | yes | yes | no | audit only | doctor clinical artifacts |
| Prescriptions/medications | yes | yes | no | aggregate/audit | doctor/patient artifacts |
| Lab/imaging orders | yes | yes | no | aggregate/audit | doctor/assistant/patient artifacts |
| Appointments | yes | yes where personal | public booking | aggregate | all role groups |
| Queue | yes | yes | no | aggregate | assistant/doctor artifacts |
| AI | yes | yes for clinical/patient scopes | limited public assistant claim | platform governance | AI artifacts |
| Communications | yes | yes | contact/booking | audit/config | assistant/doctor artifacts |
| Documents/files | yes | yes | no | audit | doctor/patient artifacts |
| Doctors | yes | no | public directory | platform admin | public/admin artifacts |
| Services | yes | no | public directory | platform config | public/admin artifacts |
| Subscriptions | tenant | no | no | platform | admin artifacts |
| Usage/quotas | tenant | no | no | platform | admin artifacts |
| Public clinic configuration | tenant | no | yes via slug | platform provisioning | public/admin artifacts |

## Al-Nour-Specific Dependencies

1. `frontend/screens/public/public_clinic_al_nour_medical_center_booking/code.html`: hardcoded clinic identity, doctors, specialties, appointment slots, public AI copy, booking flow, and likely booking confirmation assumptions.
2. `frontend/screens/public/public_clinic_attending_doctors_directory_clinic_al_nour_doctors/code.html`: hardcoded doctor directory and filters.
3. `frontend/screens/public/public_clinic_medical_services_clinics_clinic_al_nour_services/code.html`: hardcoded service/department content.
4. `frontend/screens/public/public_clinic_booking_confirmation_clinic_al_nour_booking_confirmed/code.html`: hardcoded confirmation presentation.
5. `frontend/screens/admin/super_admin_platform_security_kms_isolation_audit_logs/code.html`: demo tenant identifiers include `alnour-cairo-01`.
6. `frontend/screens/admin/super_admin_subscriptions_billing_plans_metered_quotas/code.html`: visible Al-Nour subscription/quota sample.
7. Brand/clinical overview artifacts contain demo tenant node, clinic, patient, and provider content.

## Future Backend Dependencies

- Resolve public tenant by slug and return published/disabled/not-found state.
- Return tenant branding, services, doctors, booking policy, and availability.
- Scope staff, patient, clinical, files, communication, AI, usage, and audit queries by tenant.
- Deny cross-tenant IDs even when a client changes a URL.
- Keep tenant identifier out of trust decisions based solely on hidden UI state.

## Missing States to Document, Not Implement Here

Unknown tenant, disabled tenant, unpublished clinic, incomplete public configuration, booking disabled, no doctors, no services, and unavailable slots are not consistently implemented in the static screens.

# Role and Access Map

## Access Interpretation

The tables below describe intended frontend audience based on artifact naming and visible content. They are not authorization. Future backend enforcement must independently validate identity, role, tenant, patient scope, and clinical permissions.

| Feature/domain | Doctor | Assistant | Patient | Super Admin | Public |
|---|---:|---:|---:|---:|---:|
| Clinical dashboard | yes | no | no | aggregate only | no |
| Appointments | manage clinical schedule | operational schedule | own appointments | tenant/platform reporting | public booking only |
| Patient directory | tenant read/clinical work | tenant operational work | own record only | administrative tenant users, not clinical by default | no |
| Patient demographics | authorized tenant patient scope | registration/operational scope | own scope | administrative need-to-know | booking fields only |
| History/timeline/notes | read/write with clinical authorization | operational read only where allowed | own read scope as exposed | audit/admin only | no |
| Documents/labs | clinical read/write as allowed | specimen/operational workflow | own results | audit/admin metadata only | no |
| Prescriptions/medications | create/review/sign as authorized | operational/refill workflow only if granted | own read | platform reporting only | no |
| Lab/imaging orders | create/review | accession/collection workflow | own result visibility | aggregate/admin | no |
| Queue/room dispatch | view/clinical handoff | manage | own status visibility | aggregate | no |
| Communications/WhatsApp | clinical communications | operational triage | own communications | platform audit/config | public contact only |
| Doctor AI | patient-scoped assistive workspace | no | no | aggregate/platform operations only | no |
| Assistant AI | no | logistics/communication-scoped | no | platform operations only | no |
| Patient AI | no | no | own authorized context/history | no clinical cross-tenant reasoning | no |
| Voice sessions | create/review/attest | no unless explicitly delegated | no | audit metadata only | no |
| Tenant provisioning/config | no | no | no | yes platform scope | no |
| Subscriptions/usage/security | no | no | no | yes platform scope | no |
| Public doctors/services/booking | no internal access implied | no internal access implied | public use | tenant config/admin | yes |

## Screen Access Groups

- Authentication screens are public entry points but future APIs must validate credentials and claims.
- Doctor artifacts are intended for clinicians within a current tenant and, for patient pages, an authorized patient scope.
- Assistant artifacts are intended for reception/coordination staff within a current tenant.
- Patient artifacts are patient-scoped; visibility must never be inferred from a client-side menu.
- Admin artifacts are platform-level and must not become a clinic-admin role. The downloaded user roster includes an `ADMIN` filter label, which requires product clarification rather than automatic creation of a Clinic Admin role.
- Public Al-Nour artifacts are reference tenant pages, not proof that all tenants resolve to Al-Nour.

## Authentication Expectations

The UI represents login, verification, reset, recovery, expired-session, and unauthorized states. It does not implement sessions, cookies, JWT validation, role dispatch, logout, route guards, tenant resolution, or server permission checks.

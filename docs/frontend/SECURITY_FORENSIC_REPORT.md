# Security Forensic Report

## Verdict

The static corpus contains no production credential handling or API client, but it contains several assumptions that require backend enforcement later. Frontend controls are presentation only and must never be treated as security boundaries.

## Findings

| Finding | Classification | Evidence | Required future control |
|---|---|---|---|
| No authentication runtime | unknown/expected gap | login, verification, reset, expired, unauthorized screens only | validated session, strict JWT issuer/audience/expiry/algorithm/key checks, secure cookie/token handling |
| No role enforcement | frontend-only UX | role tabs and role-specific screens | backend RBAC and route/resource authorization |
| Patient IDs in route paths | needs backend enforcement | doctor patient and AI links use concrete IDs | verify tenant and patient scope for every resource request |
| Tenant IDs/names in visible content | needs backend enforcement | admin/security screens show tenant samples | derive tenant from trusted context; explicit tenant filters and RLS later |
| Sensitive query strings | security risk | voice review links include medication, dose, and patient ID | avoid clinical/PII query parameters; use authorized opaque resource IDs |
| Hidden controls/statuses | frontend-only UX | disabled-looking buttons, role tabs, state toggles | enforce permissions server-side and return 403/404 appropriately |
| Hardcoded demo clinical data | unsafe if mistaken for real data | names, MRNs, vitals, diagnoses, medications, transcripts | isolate reference data; prohibit production data in static exports |
| External CDN dependencies | supply-chain/runtime risk | Tailwind and Google Fonts URLs in every artifact | pin/host assets and apply CSP in runtime application |
| Al-Nour hardcoding | tenant isolation risk | public paths and visible clinic/demo identifiers | resolve tenant explicitly; unknown tenant must not fall back |
| Client-side export/print/download claims | needs backend enforcement | export buttons and handlers | authorized signed downloads and audit events |
| Inline scripts | browser behavior only | DOM mutation, alerts, simulated actions | replace with framework code only when runtime is implemented; validate inputs |
| No local storage credentials found | observed safe gap | repository-wide search found no `localStorage`/`sessionStorage` credential use | retain server-managed session approach later |
| No exposed API key found | observed safe gap | no local config or API client files | keep provider secrets server-side |

## Zero-Trust Requirements for Future Runtime

- Validate authentication claims, token issuer, audience, expiry, signing algorithm, and signing key before trusting tenant or role claims.
- Derive tenant/organization identity from validated identity context; never trust a client-provided tenant ID alone.
- Pass the authenticated context into request-scoped data access and apply explicit tenant predicates plus database RLS where applicable.
- Do not use service-role credentials on user routes.
- Mask PII by default and reveal only for an authorized role and patient scope.
- Sanitize errors and avoid returning cross-tenant existence signals.
- Audit clinical reads, writes, exports, AI runs, draft approvals, signatures, and administrative mutations.

## Not Implemented

No authentication, authorization, JWT, refresh token, RLS, storage access, API, provider, or integration was added. Findings are requirements and risks only.

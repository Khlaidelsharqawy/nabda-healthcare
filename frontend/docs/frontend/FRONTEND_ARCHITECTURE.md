# AegisHealth Frontend Architecture

## Executive Verdict

**PASS WITH EXPLICIT GAPS** for forensic understanding and documentation.

The downloaded repository is a static Stitch screen corpus, not an application runtime. It contains 72 standalone HTML screen artifacts, 70 adjacent PNG previews, and one design-system document. No package manifest, lockfile, framework entrypoint, router implementation, local component module, stylesheet, data file, or environment configuration was found.

The existing UI source is preserved as downloaded. No backend, API, authentication runtime, database, RBAC runtime, RLS runtime, AI provider, or integration is implemented in this phase.

## Framework and Runtime

- Source corpus framework: none detected; the Stitch artifacts remain unchanged.
- Production runtime: Vite + React + TypeScript foundation added at the repository root.
- Build system: Vite with TypeScript project references.
- Routing: typed route registry with a Stitch-screen adapter and browser-history synchronization. Only routes backed by documented screen evidence are registered.
- Styling: inline Tailwind CDN plus per-screen inline configuration and CSS. Fonts and Material Symbols are loaded from Google Fonts.
- Runtime state: local DOM state inside the mounted Stitch documents; no backend or shared domain state exists yet.
- Data: hardcoded demo/reference content embedded in HTML and inline scripts.
- Assets: one `screen.png` preview in most screen directories. No shared asset pipeline exists.
- External dependencies: Google Fonts and Tailwind CDN URLs are embedded in HTML. These are runtime network dependencies when opened in a browser.

## Repository Inventory

| Item | Observed |
|---|---:|
| HTML screen artifacts | 72 |
| PNG preview assets | 70 |
| Markdown documents before reorganization | 1 (`clinical_integrity/DESIGN.md`) |
| Other source/config files | 0 |
| Local application entrypoints | 0 |
| Package/build manifests | 0 |
| Shared component modules | 0 |
| Local route declarations | 0 |

The 72 HTML files are distributed across role, authentication, public, platform, and brand/demo directories. `clinical_integrity/DESIGN.md` is a design-system specification, not executable application code.

## Product Model Represented by the Corpus

AegisHealth is represented as a multi-tenant healthcare SaaS concept with these frontend-facing areas:

- Doctor: clinical dashboard, appointments, patient records, clinical notes/history/timeline/documents/prescriptions, medications, orders, AI workspaces, and voice sessions.
- Assistant: patient registration and directory, appointment operations, waiting-room dispatch, laboratory accession, communications, WhatsApp triage, and assistant AI.
- Patient: dashboard, profile, appointments, medications, laboratory results, vitals, prescriptions, and patient-scoped AI surfaces.
- Super Admin/platform operations: tenant directory, tenant details, provisioning, users, usage, subscriptions, platform security, RBAC, and operational consoles.
- Authentication: unified login/role dispatch, verification, password recovery/reset, session expiry, and unauthorized states.
- Public clinic: Al-Nour reference clinic landing/booking, doctor directory, services, and booking confirmation.
- Brand/marketing: AegisHealth ecosystem overview, logo artifact, and clinic onboarding contact.

This is a conceptual product representation in static screens. It is not evidence of implemented multi-tenancy, authorization, persistence, or integrations.

## Approved Baseline Comparison

The current executable route registry is in `src/routeRegistry.ts` and consists of 45 static screen entries and 16 dynamic route patterns, for 61 registered route patterns total. Historical product references that describe a larger conceptual baseline remain documented as legacy context rather than current runtime counts.

Observed differences are documented rather than normalized:

- **72 artifacts vs 61 current route patterns:** the corpus includes likely duplicates, alternate designs, supporting states, brand pages, and screens outside the current executable route contract.
- **Legacy baseline awareness:** historical route counts such as the 54-route product baseline are retained as historical product context, not as a current source-of-truth runtime registry.
- **Additional artifacts:** lab-order variants, refill approval, voice-scribe review variants, patient vitals, patient prescription overview, assistant laboratory accession, platform operations, and company-headquarters console are not all represented by the approved current route contract.
- **Missing/unknown route evidence:** an artifact name can suggest a route, but filenames are not treated as route proof.
- **Navigation counts:** only the executable registry and audited runtime behavior are treated as authoritative for this repository state.

## Architecture Boundaries for Future Work

The corpus should later be implemented behind explicit boundaries:

- tenant identity resolved by trusted backend session context, not by visible HTML or client-only route values;
- patient scope enforced by backend authorization, not hidden controls;
- clinical writes represented as auditable commands with role and tenant checks;
- AI represented as bounded, scoped assistance with human review states;
- public clinic pages resolved from a tenant slug without silently falling back to Al-Nour;
- reference/demo data separated from future API responses;
- external integrations treated as future adapters, not browser-side assumptions.

## Structural Decision

Because the files are self-contained and have no local imports, moving whole screen directories is behavior-neutral for their current use as standalone artifacts. The reorganization groups the original directories by responsibility and keeps each `code.html` and its adjacent `screen.png` together. No HTML content, inline script, route string, asset file, or design token is rewritten.

The detailed route, screen, component, navigation, data, tenant, role, security, backend-contract, and move manifests are in the companion documents in this directory. The first implementation batch adds only a runtime adapter; it does not convert or rewrite the Stitch screen corpus.

## Status

- Frontend status: analyzed + structurally organized.
- UI status: preserved.
- Backend status: not implemented.
- Database status: not implemented in this phase.
- Auth/RBAC/RLS status: not implemented.
- AI/integrations status: not implemented.

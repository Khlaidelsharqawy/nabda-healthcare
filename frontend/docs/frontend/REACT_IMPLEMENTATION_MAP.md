# React Implementation Map

## Batch 02

| Source evidence | React implementation | Status |
|---|---|---|
| Doctor global header | `src/components/navigation/DoctorHeader.tsx` | implemented |
| Doctor sidebar/navigation | `src/components/navigation/DoctorSidebar.tsx` | implemented |
| Doctor role shell | `src/layouts/DoctorShell.tsx` | implemented |
| Doctor dashboard representative slice | `src/features/doctor/DoctorDashboardPage.tsx` | implemented |
| Theme/direction foundation | `src/theme/ThemeProvider.tsx`, `src/theme/tokens.css` | implemented |
| Exact Doctor shell strings | `src/i18n/messages.ts` | implemented |
| Frontend domain contracts | `src/contracts/domain.ts` | partial, frontend-only |
| Stitch reference adapter | `src/app.tsx` | preserved |

## Not Yet Converted

All other screens remain served through the Stitch reference adapter. No screen is counted as a React implementation merely because its route is present in `src/routeRegistry.ts`.

## Boundaries

No API client, persistence, authentication protocol, backend RBAC, RLS, AI provider, WhatsApp integration, billing integration, or fake network behavior was added.

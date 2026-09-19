# Shared Shell Architecture

## Evidence

Doctor screens repeatedly show a shared global header, a pale clinical sidebar, Doctor Workspace/attestation context, bilingual navigation, theme/language controls, notification affordance, and a constrained clinical content canvas. Batch 02 extracts those patterns into real React code without modifying the Stitch references.

## Implemented

- `src/layouts/DoctorShell.tsx`
- `src/components/navigation/DoctorHeader.tsx`
- `src/components/navigation/DoctorSidebar.tsx`
- `src/features/doctor/DoctorDashboardPage.tsx`
- `src/theme/ThemeProvider.tsx`
- `src/theme/tokens.css`
- `src/i18n/messages.ts`

`/doctor/dashboard` uses the real React shell. `/doctor/dashboard?reference=stitch` remains the direct visual reference adapter.

## Shell Status

| Shell | Evidence | Batch 02 status |
|---|---|---|
| DoctorShell | 27 Doctor artifacts with recurring header/sidebar/navigation | implemented for dashboard slice |
| AssistantShell | 9 Assistant artifacts | contract identified; not implemented |
| PatientShell | 10 Patient artifacts | contract identified; not implemented |
| AdminShell | 11 platform artifacts | contract identified; not implemented |
| PublicClinicShell | 4 Al-Nour public artifacts | contract identified; not implemented |
| AuthShell | 7 authentication artifacts | contract identified; not implemented |

No shell is treated as a backend authorization boundary. Role and tenant enforcement remain future backend responsibilities.

## Navigation Boundary

The existing route registry remains authoritative. The Doctor shell uses existing route-shaped links for the documented Doctor navigation. Placeholder `#` links in Stitch references remain reference behavior and are not silently reinterpreted.

# React Architecture Foundation

AegisHealth frontend operates as an independent, production-grade React application.

- `theme/`: extracted design tokens (color, typography, radius, elevation, dark mode, RTL/LTR).
- `i18n/`: bilingual symmetrical dictionary architecture (`messages.ts`) supporting Arabic (RTL) and English (LTR).
- `components/`: shared UI primitives, Material Symbols integration, and navigation primitives.
- `layouts/`: role-specific shells (`DoctorShell`, `AssistantShell`, `PatientShell`, `AdminShell`, `PublicClinicShell`, `AuthShell`).
- `features/`: domain feature pages covering Doctor, Assistant, Patient, Admin, Public Clinic, Brand, and Auth.
- `contracts/`: frontend-only domain interfaces (`domain.ts`).
- `routeRegistry.ts`: typed route registry covering all 47 canonical product routes and dynamic patterns.

All routes are implemented natively in React with zero iframe or prototype runtime dependencies.

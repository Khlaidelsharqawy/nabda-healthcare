# React Architecture Foundation

Batch 02 introduces shared runtime architecture without changing `frontend/screens/**`.

- `theme/`: extracted Stitch color, typography, radius, shadow, light/dark, and direction tokens.
- `i18n/`: exact shell strings observed in the Doctor Stitch screens; no new translations are introduced.
- `components/navigation/`: Doctor header and sidebar extracted from repeated Doctor shell markup.
- `layouts/`: role shell boundary.
- `features/doctor/`: first real React route slice.
- `contracts/`: frontend-only domain interfaces; no backend models or persistence.
- `routeRegistry.ts`: evidence-backed route registry from Batch 01.

The Stitch iframe adapter remains available for direct reference comparison through `?reference=stitch`.

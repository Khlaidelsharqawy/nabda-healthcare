# Complete File Inventory

## Inventory Scope

The inventory covers the downloaded frontend corpus after structural organization. The frozen corpus remains limited to the entries below; the production runtime now lives outside `frontend/` at the repository root.

| File class | Count | Classification |
|---|---:|---|
| `frontend/screens/**/code.html` | 72 | standalone Stitch screen artifact; UI/static/demo data; inline CSS/Tailwind; some inline JS |
| `frontend/screens/**/screen.png` | 70 | Stitch preview/reference asset; adjacent to its screen directory |
| `frontend/design/clinical_integrity/DESIGN.md` | 1 | design-system specification; not executable |
| Build/package/config/source modules inside frozen corpus | 0 | intentionally not added to `frontend/` |
| JSON/mock-data/constants/hooks/providers/layout modules | 0 | not found as separate files |
| Tests | 0 | not found |
| README/environment files inside frozen corpus | 0 | runtime documentation remains under `docs/frontend/` |

## Production Runtime Outside the Frozen Corpus

The first implementation batch added `package.json`, `package-lock.json`, TypeScript/Vite configuration, `index.html`, and `src/` runtime files at the repository root. These files do not alter or replace any Stitch artifact.

## HTML File Classification

All 72 `code.html` files are cataloged individually in [SCREEN_CATALOG.md](SCREEN_CATALOG.md). For every HTML file:

- **Type:** standalone HTML document.
- **Purpose:** one Stitch-exported screen or screen variant.
- **Domain/role:** derived from directory prefix and visible screen content; see screen IDs.
- **Imported by/imports:** none. No local import or module graph exists.
- **Reusable:** no as source code; repeated markup is embedded and duplicated.
- **Stateful:** only locally, where inline JavaScript mutates the DOM.
- **UI-only/data-related:** UI-only presentation of hardcoded reference/demo data; future backend data is not connected.
- **Generated:** yes, Stitch-exported artifact.
- **Duplicate/variant:** some are likely duplicates or variants; none were deleted without proof.
- **Safe to move:** yes, as an intact directory; verified before reorganization.

## PNG File Classification

Each of the 70 PNG files is named `screen.png` and remains next to its source HTML directory. They are reference/preview assets, not imported by a shared application asset pipeline. Two HTML directories have no adjacent PNG: the top-level clinical AI ecosystem artifact and lab-order variant 1. Those omissions are documented, not repaired.

## Design File Classification

`frontend/design/clinical_integrity/DESIGN.md` defines colors, typography, spacing, elevation, shapes, component guidance, AI review visual language, and RTL guidance. It is a design reference only. No runtime CSS or token module consumes it.

## Unknowns Requiring Manual Review

- Whether near-duplicate Stitch screens are intended alternates or superseded exports.
- Whether each `screen.png` is a preview of the adjacent `code.html` or a separately generated capture.
- Which `data-path` markers were intended for a future Stitch preview shell.
- Which approved baseline touchpoints map to supporting variants rather than canonical routes.

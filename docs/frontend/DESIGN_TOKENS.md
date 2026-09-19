# Extracted Design Tokens

These values are extracted from `frontend/design/clinical_integrity/DESIGN.md` and recurring Doctor screen Tailwind configuration. They are implementation tokens, not a new design system.

## Color Tokens

| Token | Value |
|---|---|
| `surface` | `#f9f9ff` |
| `surface-container-low` | `#f0f3ff` |
| `surface-container` | `#eaeefa` |
| `surface-container-high` | `#e4e8f4` |
| `surface-container-highest` | `#dee2ee` |
| `surface-container-lowest` | `#ffffff` |
| `on-surface` | `#171c24` |
| `on-surface-variant` | `#3f4941` |
| `primary` | `#005932` |
| `primary-container` | `#087443` |
| `secondary` | `#4347d9` |
| `secondary-container` | `#5d62f3` |
| `tertiary` | `#873100` |
| `error` | `#ba1a1a` |

Dark values are defined in `src/theme/tokens.css` from the documented dark semantic palette.

## Typography

- Display/headings: Plus Jakarta Sans.
- Body/data/controls: Inter.
- Arabic fallback: Noto Sans Arabic, then Inter.
- Clinical data and micro-copy preserve the documented compact hierarchy.

## Shape and Elevation

- Small radius: `4px`.
- Medium radius: `8px`.
- Large radius: `12px`.
- Small shadow: `0 1px 3px rgb(16 24 40 / 0.06), 0 1px 2px rgb(16 24 40 / 0.04)`.
- Medium shadow: `0 4px 8px -2px rgb(16 24 40 / 0.08), 0 2px 4px -2px rgb(16 24 40 / 0.04)`.

No inconsistent screen-specific values were normalized globally. The React shell only extracts values supported by multiple Doctor references or the design specification.

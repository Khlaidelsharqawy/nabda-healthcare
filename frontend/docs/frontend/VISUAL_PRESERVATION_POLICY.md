# AegisHealth Frontend Visual Preservation Policy

## Visual Source of Truth

**Existing Stitch screens are frozen visual references.** The downloaded HTML screens are the authoritative visual source of truth for AegisHealth.

Any future frontend implementation must reproduce the existing Stitch visual design rather than redesigning it. Future developers must compare every implementation against the original Stitch HTML and its adjacent `screen.png` reference before accepting visual changes.

## Frozen Surface

The following must remain unchanged unless an explicit product decision authorizes a visual revision:

- HTML structure and rendered content
- CSS, Tailwind classes, inline styles, and layout rules
- typography, spacing, colors, borders, radii, shadows, backgrounds, and responsive behavior
- icons, images, logos, illustrations, and their dimensions/positions
- navigation appearance, headers, footers, forms, tables, cards, sidebars, and controls
- visible English and Arabic text
- light/dark mode, RTL/LTR presentation, animations, transitions, hover/focus states
- loading, empty, error, disabled, and screen-specific states

Unusual, inconsistent, redundant, or non-preferred visual choices are preserved as source truth. They are not corrected during analysis or structural organization.

## Allowed Changes in This Phase

- read-only inspection and forensic documentation;
- moving intact files/directories when their contents and internal relationships remain valid;
- creating documentation under `docs/frontend/`.

No screen is converted to React, rewritten, restyled, simplified, combined, split, or connected to a runtime in this phase. No duplicate candidate is deleted automatically.

## Move Verification Protocol

Before moving any existing HTML or visual asset in future work:

1. enumerate the exact source files;
2. calculate and record SHA-256 for every moved HTML and asset;
3. move the files without content edits;
4. calculate SHA-256 at the destination;
5. require exact before/after equality;
6. stop immediately and report the affected file if any hash differs.

The current corpus baseline can be regenerated with:

```powershell
Get-ChildItem frontend -Recurse -File |
  Where-Object { $_.Extension -in '.html', '.png' } |
  Get-FileHash -Algorithm SHA256
```

## Current Evidence and Limitation

The current organized corpus contains 72 HTML screens and 70 PNG assets. A post-organization SHA-256 manifest can prove the present bytes and can protect future changes. The original move was completed before a persisted before-move manifest was created, so this repository cannot independently prove the historical before/after hash equality for that earlier move. No HTML or asset content was intentionally edited, and the current file counts and content hashes are recorded by the final validation command.

## Runtime Preservation Rule

When a future application runtime is eventually introduced, it must treat the Stitch screens as visual regression fixtures. Runtime extraction, componentization, route wiring, backend integration, authentication, tenant resolution, and AI integration must not alter visual output without an explicit visual review and approval.

Batch 02 follows this rule: the Doctor React shell is compared against the Doctor dashboard reference, while the original screen remains available through the reference adapter. React differences are corrected in React; the Stitch files are not modified.

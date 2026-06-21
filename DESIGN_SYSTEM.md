# Design System

## Student And Parent UI
- Source of truth: Stitch `Cheerful Learning` and `Vibrant Quest`.
- Font: Be Vietnam Pro.
- Background: light, warm, and low eye strain with subtle tonal/pattern layers.
- Cards: white, 24px radius, 2px soft border, 4-8px tactile bottom edge.
- Buttons: large touch targets, bold labels, 3D bottom border, pressed state via `transform`.
- Progress: thick rounded bars, 12-16px height, blue/green gradient fill.
- Icons: Material Symbols for UI controls and game actions.
- Motion: use `transform`/`opacity`; always support `prefers-reduced-motion`.

## Admin UI
- Source of truth: Stitch `Học Vui Admin`.
- Style: modern SaaS, dense but friendly, clear filters/tables/actions.
- Cards: 24px radius, soft shadow, restrained blue/yellow accents.
- Tables: generous row height, pill status badges, clear bulk actions.

## Accessibility
- Icon-only buttons need `aria-label` or `title`.
- Buttons inside client components should use `type="button"` unless submitting a form.
- Text must fit on mobile; avoid negative letter spacing on user-facing screens.

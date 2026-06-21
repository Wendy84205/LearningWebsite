# Design System

Synced from Stitch project **Học Vui Learning Platform** (`9227577490891885848`).

## Stitch Screen Map
| App route | Stitch screen |
|-----------|---------------|
| `/learning/[gradeSlug]` | Trang chủ Học sinh - Tổng quan (Branded) |
| `/learning/[gradeSlug]/games` | Trung tâm Học tập & Kiểm tra (Branded) |
| `/learning/[gradeSlug]/achievements` | Thành tích & Huy hiệu (Synchronized) |
| `/parent-dashboard` | Dashboard Phụ huynh - Gamified |
| `/admin` (questions tab) | Ngân hàng Câu hỏi |
| `/game-choose-1-of-2` | Lớp 1 - Chọn 1 trong 2 |

Reference: `.stitch/project.json`, `src/lib/stitch-screens.js`

## Parent Gamified Theme (Stitch Vibrant Quest)
- Primary accent: `#58cc02` (green), secondary `#1cb0f6`, tertiary `#ffc800`
- Font: Nunito Sans on parent dashboard; Be Vietnam Pro on student surfaces
- Cards: `gamified-card` — 2px border, 4px bottom edge, white background, 24px radius
- Buttons: `pressed-button-primary` — 4px bottom shadow, translateY on active
- Layout: sticky sidebar (264px) + scrollable main on desktop

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

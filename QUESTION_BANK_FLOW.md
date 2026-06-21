# Question Bank Flow

## Current Stack
- Prisma model: `CustomQuestion`.
- Admin APIs:
  - `GET /api/admin/questions`
  - `POST /api/admin/questions`
  - `GET /api/admin/questions/:id`
  - `PUT /api/admin/questions/:id`
  - `DELETE /api/admin/questions/:id`
- Student API:
  - `GET /api/questions`
- Shared helpers:
  - `src/lib/question-bank.js`
  - `src/lib/question-distribution.js`

## Data Flow
```txt
Admin Dashboard
  -> /api/admin/questions
  -> CustomQuestion rows
  -> question-distribution service
  -> /api/questions
  -> Student game/lesson/test UI
```

## Rules
- Only `status = "published"` questions can reach students.
- Draft/review/archived questions stay admin-only.
- `gameTypes` is the current usage flag field:
  - `choose_1_of_2`
  - `multiple_choice`
  - `quiz`
  - `matching`
  - `listen_select`
  - `drag_drop`
- If Question Bank has too few questions, the distribution service may include CMS/static fallback content.

## Required Next Migration
When the product needs full tests/history/analytics, add tables for:
- question options
- tests and test attempts
- student answers
- game sessions
- progress records
- badges and student badges
- notifications

Until then, do not force a destructive schema change.

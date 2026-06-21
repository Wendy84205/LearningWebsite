# AI Rules

## Product
- Học Vui is a grade 1-5 learning platform for students, parents, and admins.
- Do not break existing routes, auth, Prisma models, or progress storage unless a migration is explicitly planned.
- Use real data from Prisma/Postgres whenever available. Static grade data is a fallback and must remain labeled as fallback in code or docs.

## Engineering
- Keep server-owned authorization. Never trust `parentId`, `studentId`, or ownership fields sent by the client.
- Prefer service modules in `src/lib` for business rules and keep route handlers thin.
- Keep UI components aligned with the Stitch design systems: `Cheerful Learning` for student/parent surfaces and `Học Vui Admin` for CMS.
- Add loading, empty, error, and success states for new user-facing pages.
- Do not commit `.env`, `.next`, `node_modules`, local database files, or generated caches.

## Verification
- Run `npm run lint` and `npm run build` before deploy.
- `npm run typecheck` and `npm run test` are required only after scripts are added to the project.
- Run `git diff --check` before commit.

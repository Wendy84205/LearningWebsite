# Testing Checklist

## Question Bank
- Admin can create a question.
- Admin can publish/archive a question.
- Filters work for grade, subject, topic, skill, difficulty, type, and status.
- Draft/review/archived questions do not appear in `/api/questions`.
- `gameTypes` controls whether a question can appear in a game.

## Distribution Engine
- `getQuestionsForGame` returns published Question Bank questions first.
- CMS/static fallback works when the bank is sparse.
- Matching/listen/choose shapes are filtered correctly.
- Boss levels can draw from all levels in a world.

## Student Game
- Game loads questions from `/api/questions`.
- Correct answers increase score.
- Wrong answers show feedback.
- Completion posts to `/api/progress`.
- Result page links back to the right grade map/dashboard.

## Parent Report
- Dashboard loads `/api/dashboard`.
- Parent cannot choose another `parentId` from the client.
- Progress handles old numeric `completedLevels` and new `w1-l1` tokens.

## Build And Deploy
- `git diff --check`
- `npm run lint`
- `npm run test`
- `npm run build`
- `vercel --prod`

## Known Gaps
- Full test attempt/game session history requires normalized tables beyond `AdminCmsItem`.

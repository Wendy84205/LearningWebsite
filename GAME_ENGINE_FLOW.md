# Game Engine Flow

## Engine Modules
- `src/lib/games/engine/game-types.js`
- `src/lib/games/engine/question-adapter.js`
- `src/lib/games/engine/game-session.js`
- `src/lib/games/engine/scoring.js`
- `src/lib/games/use-game-page.js` — shared client hook
- `src/lib/games/GenericQuizGame.js`

## Game Routes
- Hub: `/learning/[gradeSlug]/games`
- `/game-quiz-adventure`
- `/game-math-battle`
- `/game-word-match`
- `/game-memory-card`
- `/game-choose-1-of-2`
- `/game-listen-and-select`
- `/game-simple-matching`
- `/game-results`

## Shared Flow
```txt
Game page
  -> GET /api/questions?grade&world&level&game
  -> question-distribution service
  -> Question Bank + CMS + static fallback
  -> question-adapter
  -> game-session / use-game-page
  -> POST /api/student/submit
  -> /game-results
  -> parent dashboard summary
```

## Scoring
- Shared scoring helpers live in `src/lib/scoring-service.js`.
- XP formula:
```txt
XP = baseXP + difficultyBonus + streakBonus + comboBonus
```

## Student Sub-routes
- `/learning/[gradeSlug]/practice`
- `/learning/[gradeSlug]/achievements`
- `/learning/[gradeSlug]/report`
- `/learning/[gradeSlug]/test`

## Parent Dashboard Tabs
- Overview, Progress, Notifications, Settings on `/parent-dashboard`

## Next Schema Step
Add `game_sessions` table when full attempt history is required beyond `AdminCmsItem`.

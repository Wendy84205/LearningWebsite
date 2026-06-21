# Game Engine Flow

## Current Games
- `src/app/game-choose-1-of-2`
- `src/app/game-listen-and-select`
- `src/app/game-simple-matching`
- `src/app/game-results`

## Shared Flow
```txt
Game page
  -> GET /api/questions?grade&world&level&game
  -> question-distribution service
  -> Question Bank + CMS + static fallback
  -> game adapter shape
  -> student answers
  -> POST /api/progress
  -> result screen
  -> parent dashboard summary
```

## Scoring
- Shared scoring helpers live in `src/lib/scoring-service.js`.
- XP formula:
```txt
XP = baseXP + difficultyBonus + streakBonus + comboBonus
```
- Existing progress storage still uses `Progress.stars`, `Progress.streak`, and `Progress.completedLevels`.

## Game Adapter Shapes
- Choose/quiz:
  - `q`
  - `options`
  - `correct`
  - `emoji`
- Listen:
  - `word`
  - `options`
  - `correct`
  - `audioUrl`
- Matching:
  - `left`
  - `right`

## Next Engine Modules
Build new reusable games under `src/lib/games` or `src/app/games` only after the schema for `game_sessions` is added.

const DIFFICULTY_BONUS = {
  easy: 0,
  medium: 5,
  hard: 12,
  '1': 0,
  '2': 5,
  '3': 12,
}

const BADGES = [
  { id: 'first_lesson', name: 'First Lesson', condition: stats => stats.completedActivities >= 1 },
  { id: 'first_test', name: 'First Test', condition: stats => stats.completedTests >= 1 },
  { id: 'three_days_streak', name: '3 Days Streak', condition: stats => stats.streak >= 3 },
  { id: 'math_rookie', name: 'Math Rookie', condition: stats => stats.mathCorrect >= 10 },
  { id: 'quiz_master', name: 'Quiz Master', condition: stats => stats.correctAnswers >= 50 },
  { id: 'perfect_score', name: 'Perfect Score', condition: stats => stats.lastScorePct === 100 },
  { id: 'game_champion', name: 'Game Champion', condition: stats => stats.completedGames >= 5 },
  { id: 'daily_hero', name: 'Daily Hero', condition: stats => stats.completedDailyMissions >= 1 },
]

export function scoreAnswer({ selected, correctAnswer, isMultiple = false }) {
  const normalize = value => Array.isArray(value)
    ? value.map(item => String(item)).sort().join('|')
    : String(value ?? '')

  const isCorrect = isMultiple
    ? normalize(selected) === normalize(correctAnswer)
    : String(selected ?? '') === String(correctAnswer ?? '')

  return { isCorrect, points: isCorrect ? 1 : 0 }
}

export function calculateXp({
  baseXP = 10,
  difficulty = 'easy',
  streak = 0,
  combo = 0,
  isCorrect = true,
} = {}) {
  if (!isCorrect) return 1
  const difficultyBonus = DIFFICULTY_BONUS[String(difficulty)] ?? 0
  const streakBonus = Math.min(Number(streak || 0), 7)
  const comboBonus = Math.min(Number(combo || 0) * 2, 20)
  return baseXP + difficultyBonus + streakBonus + comboBonus
}

export function calculateSessionResult({ answers = [], streak = 0, combo = 0 } = {}) {
  const correct = answers.filter(answer => answer.isCorrect).length
  const total = answers.length
  const scorePct = total ? Math.round((correct / total) * 100) : 0
  const xp = answers.reduce((sum, answer, index) => sum + calculateXp({
    baseXP: 10,
    difficulty: answer.difficulty,
    streak,
    combo: answer.isCorrect ? combo + index : 0,
    isCorrect: answer.isCorrect,
  }), 0)

  return {
    correct,
    total,
    scorePct,
    stars: scorePct === 100 ? 3 : scorePct >= 60 ? 2 : 1,
    xp,
  }
}

export function levelFromXp(xp = 0) {
  const safeXp = Math.max(0, Number(xp || 0))
  const level = Math.floor(Math.sqrt(safeXp / 80)) + 1
  const currentLevelStart = 80 * Math.pow(level - 1, 2)
  const nextLevelStart = 80 * Math.pow(level, 2)
  const progressPct = Math.round(((safeXp - currentLevelStart) / (nextLevelStart - currentLevelStart)) * 100)

  return {
    level,
    xp: safeXp,
    nextLevelXp: nextLevelStart,
    progressPct: Math.max(0, Math.min(100, progressPct)),
  }
}

export function unlockBadges(stats = {}, existingBadgeIds = []) {
  const owned = new Set(existingBadgeIds)
  return BADGES
    .filter(badge => !owned.has(badge.id) && badge.condition(stats))
    .map(({ id, name }) => ({ id, name, unlockedAt: new Date().toISOString() }))
}

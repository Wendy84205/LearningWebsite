import { levelFromXp } from '@/lib/scoring-service'
import { buildActivityStats } from '@/lib/activity-service'

export { levelFromXp }

export async function getStudentProgressSummary(profileId) {
  const stats = await buildActivityStats(profileId)
  return {
    level: stats.level,
    xp: stats.totalXp,
    streak: stats.streak,
    averageScore: stats.averageScore,
    completedGames: stats.completedGames,
    completedTests: stats.completedTests,
    weakSkills: stats.weakSkills,
    badges: stats.badges,
    attempts: stats.attempts,
  }
}

export function computeLevelProgress(xp = 0) {
  return levelFromXp(xp)
}

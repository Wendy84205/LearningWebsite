import { unlockBadges, levelFromXp } from '@/lib/scoring-service'
import { buildActivityStats } from '@/lib/activity-service'
import { BADGE_CATALOG } from '@/lib/badge-catalog'

export { BADGE_CATALOG }

export async function getStudentAchievements(profileId) {
  const stats = await buildActivityStats(profileId)
  const earned = new Set((stats.badges || []).map(b => b.id))

  return {
    level: stats.level || levelFromXp(stats.totalXp),
    badges: BADGE_CATALOG.map(badge => ({
      ...badge,
      earned: earned.has(badge.id),
      unlockedAt: stats.badges?.find(b => b.id === badge.id)?.unlockedAt,
    })),
    stats: {
      totalXp: stats.totalXp,
      streak: stats.streak,
      completedGames: stats.completedGames,
      completedTests: stats.completedTests,
      averageScore: stats.averageScore,
    },
  }
}

export function evaluateNewBadges(stats, existingBadgeIds = []) {
  return unlockBadges(stats, existingBadgeIds)
}

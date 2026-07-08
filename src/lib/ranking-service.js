import prisma from '@/lib/db'
import { levelFromXp } from '@/lib/scoring-service'
import { getSlug } from '@/lib/progress-summary'

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export async function buildStudentRanking({
  parentId,
  grade = '',
  profileId = '',
  limit = 10,
} = {}) {
  if (!parentId) return { scope: 'none', items: [], current: null }

  const gradeSlug = grade ? getSlug(grade) : ''
  const allProfiles = await prisma.childProfile.findMany({
    where: { parentId },
    include: { progress: true, badges: true },
    orderBy: { createdAt: 'asc' },
  })
  const profiles = gradeSlug
    ? allProfiles.filter(profile => getSlug(profile.grade || 'lop-1') === gradeSlug)
    : allProfiles

  if (!profiles.length) return { scope: gradeSlug || 'family', items: [], current: null }

  const profileIds = profiles.map(profile => profile.id)
  const attemptGroups = await prisma.learningAttempt.groupBy({
    by: ['profileId'],
    where: { parentId, profileId: { in: profileIds } },
    _sum: { xp: true, stars: true, correct: true, total: true },
    _count: { _all: true },
  })
  const attemptsByProfile = new Map(attemptGroups.map(group => [group.profileId, group]))

  const items = profiles
    .map(profile => {
      const aggregate = attemptsByProfile.get(profile.id)
      const xp = toNumber(aggregate?._sum?.xp)
      const stars = toNumber(profile.progress?.stars) || toNumber(aggregate?._sum?.stars)
      const correct = toNumber(aggregate?._sum?.correct)
      const total = toNumber(aggregate?._sum?.total)
      const accuracy = total ? Math.round((correct / total) * 100) : 0
      const attempts = toNumber(aggregate?._count?._all)
      const level = levelFromXp(xp)
      const score = xp + stars * 12 + toNumber(profile.progress?.streak) * 20 + attempts * 8 + accuracy

      return {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        grade: profile.grade,
        xp,
        stars,
        streak: toNumber(profile.progress?.streak),
        attempts,
        accuracy,
        badges: profile.badges.length,
        level: level.level,
        score,
      }
    })
    .sort((a, b) => b.score - a.score || b.xp - a.xp || b.accuracy - a.accuracy)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      tier: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'rising',
    }))

  return {
    scope: gradeSlug || 'family',
    items: items.slice(0, limit),
    current: items.find(item => item.id === profileId) || null,
  }
}

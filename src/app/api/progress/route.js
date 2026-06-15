import prisma from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import {
  getNormalLevelPosition,
  normalizeCompletedLevelToken,
  parseCompletedLevels,
} from '@/lib/progress-summary'

// GET /api/progress?profileId=...
export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const profileId = searchParams.get('profileId')
    if (!profileId) return Response.json({ error: 'profileId required' }, { status: 400 })

    const profile = await prisma.childProfile.findFirst({
      where: { id: profileId, parentId: session.parentId },
      include: { progress: true },
    })
    if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

    return Response.json(profile.progress)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/progress - Update progress after game completion
export async function POST(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { profileId, completedLevel, starsEarned } = await request.json()
    if (!profileId) return Response.json({ error: 'profileId required' }, { status: 400 })

    const profile = await prisma.childProfile.findFirst({
      where: { id: profileId, parentId: session.parentId },
      include: { progress: true },
    })
    if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

    const current = profile.progress || await prisma.nurseryProgress.create({
      data: { profileId, currentLevel: 1 },
    })

    const completedArr = parseCompletedLevels(current.completedLevels)
    const normalizedCompletedLevel = normalizeCompletedLevelToken(completedLevel)

    if (completedLevel && !normalizedCompletedLevel) {
      return Response.json({ error: 'Invalid completedLevel' }, { status: 400 })
    }

    if (normalizedCompletedLevel && !completedArr.includes(normalizedCompletedLevel)) {
      completedArr.push(normalizedCompletedLevel)
    }

    const completedPosition = getNormalLevelPosition(normalizedCompletedLevel)
    const nextLevel = completedPosition
      ? Math.max(current.currentLevel || 1, completedPosition + 1)
      : current.currentLevel
    const earnedStars = Number.isFinite(Number(starsEarned)) ? Number(starsEarned) : 0

    const updated = await prisma.nurseryProgress.update({
      where: { profileId },
      data: {
        completedLevels: completedArr.join(','),
        currentLevel: nextLevel,
        stars: current.stars + earnedStars,
        streak: current.streak + 1,
      },
    })
    return Response.json(updated)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

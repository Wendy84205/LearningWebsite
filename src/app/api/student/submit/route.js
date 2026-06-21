import { getSessionUser } from '@/lib/auth'
import { getOwnedProfile, recordActivityAttempt } from '@/lib/activity-service'

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 })
}

export async function POST(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const profileId = String(body.profileId || '').trim()
    if (!profileId) return badRequest('profileId required')

    const profile = await getOwnedProfile({
      profileId,
      parentId: session.parentId,
      includeProgress: true,
    })
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    const result = await recordActivityAttempt({
      profile,
      activityType: body.activityType || 'game',
      title: body.title || body.gameTitle || 'Hoạt động học tập',
      grade: body.grade || profile.grade,
      subject: body.subject || '',
      topic: body.topic || '',
      skill: body.skill || '',
      difficulty: body.difficulty || '',
      gameType: body.gameType || '',
      completedLevel: body.completedLevel || '',
      worldId: body.worldId,
      levelId: body.levelId,
      isBoss: body.isBoss,
      answers: Array.isArray(body.answers) ? body.answers : [],
      correct: body.correct,
      total: body.total,
      starsEarned: body.starsEarned,
    })

    return Response.json({
      success: true,
      progress: result.progress,
      result: result.result,
      attemptId: result.attempt.id,
    })
  } catch (err) {
    const status = err.message === 'Invalid completedLevel' ? 400 : 500
    return Response.json({ error: err.message }, { status })
  }
}

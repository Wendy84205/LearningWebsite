import { getSessionUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { getCmsLearningMap } from '@/lib/cms-content'
import { buildProgressSummary, getSlug } from '@/lib/progress-summary'

// GET /api/dashboard
export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parent = await prisma.parent.findUnique({
      where: { id: session.parentId },
      include: {
        profiles: {
          include: { progress: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!parent) {
      return Response.json({ error: 'Parent not found' }, { status: 404 })
    }

    const learningMapByGrade = {}
    await Promise.all(parent.profiles.map(async (profile) => {
      const grade = getSlug(profile.grade || 'lop-1')
      if (learningMapByGrade[grade]) return
      learningMapByGrade[grade] = await getCmsLearningMap(grade)
    }))

    const profiles = parent.profiles.map(profile => {
      const gradeSlug = getSlug(profile.grade || 'lop-1')
      const learningMap = learningMapByGrade[gradeSlug]
      const summary = buildProgressSummary(profile.progress, profile.grade, {
        worlds: learningMap?.worlds,
      })

      return {
        id: profile.id,
        name: profile.name,
        grade: profile.grade,
        avatar: profile.avatar,
        mascotId: profile.mascotId,
        mascotName: profile.mascotName,
        mascotImage: profile.mascotImage,
        progress: profile.progress,
        summary,
        worldProgress: summary.worldProgress,
        focusRecommendation: summary.focusRecommendation,
        cms: {
          learningMapItems: learningMap?.cmsItems?.length || 0,
          source: learningMap?.cmsItems?.length ? 'cms' : 'static-fallback'
        }
      }
    })

    return Response.json({
      parentEmail: parent.email,
      profiles,
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

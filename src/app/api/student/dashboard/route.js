import { getSessionUser } from '@/lib/auth'
import { buildActivityStats, getOwnedProfile } from '@/lib/activity-service'
import { getCmsLearningMap } from '@/lib/cms-content'
import { buildProgressSummary, getSlug } from '@/lib/progress-summary'
import { getQuestionsForDailyMission, getReviewQuestions } from '@/lib/question-distribution'

export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const profileId = searchParams.get('profileId')
    if (!profileId) {
      return Response.json({ error: 'profileId required' }, { status: 400 })
    }

    const profile = await getOwnedProfile({
      profileId,
      parentId: session.parentId,
      includeProgress: true,
    })
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    const gradeSlug = getSlug(profile.grade || searchParams.get('grade') || 'lop-1')
    const [learningMap, stats] = await Promise.all([
      getCmsLearningMap(gradeSlug),
      buildActivityStats(profile.id),
    ])

    const summary = buildProgressSummary(profile.progress, profile.grade, {
      worlds: learningMap?.worlds,
    })
    const dailyMissionQuestions = await getQuestionsForDailyMission({
      studentId: profile.id,
      grade: gradeSlug,
      limit: 5,
    })
    const reviewQuestions = await getReviewQuestions({
      studentId: profile.id,
      grade: gradeSlug,
      weakSkills: stats.weakSkills.map(item => item.skill),
      limit: 5,
    })

    return Response.json({
      profile: {
        id: profile.id,
        name: profile.name,
        grade: profile.grade,
        avatar: profile.avatar,
        mascotName: profile.mascotName,
        mascotImage: profile.mascotImage,
      },
      progress: profile.progress,
      summary,
      activityStats: stats,
      missions: {
        daily: {
          title: 'Nhiệm vụ hôm nay',
          count: dailyMissionQuestions.length,
          href: `/learning/${gradeSlug}/test?mode=daily`,
        },
        review: {
          title: 'Ôn tập điểm cần cố gắng',
          count: reviewQuestions.length,
          href: `/learning/${gradeSlug}/test?mode=review`,
        },
      },
      learningMap: {
        worlds: learningMap?.worlds || [],
        source: learningMap?.cmsItems?.length ? 'cms' : 'static-fallback',
      },
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

import { getSessionUser } from '@/lib/auth'
import { getOwnedProfile } from '@/lib/activity-service'
import {
  getQuestionsForDailyMission,
  getQuestionsForTest,
  getReviewQuestions,
} from '@/lib/question-distribution'
import { getSlug } from '@/lib/progress-summary'

function mapQuestionForTest(question, index) {
  const options = Array.isArray(question.options) ? question.options : []
  return {
    id: question.id || `q-${index}`,
    question: question.q || question.word || question.left || '',
    options,
    correct: question.correct ?? 0,
    explanation: question.explanation || '',
    subject: question.subject || '',
    topic: question.topic || '',
    skill: question.skill || '',
    difficulty: question.difficulty || 'easy',
    emoji: question.emoji || '❓',
    source: question.source || 'question_bank',
  }
}

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
      includeProgress: false,
    })
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    const grade = getSlug(searchParams.get('grade') || profile.grade || 'lop-1')
    const subject = searchParams.get('subject') || ''
    const chapter = searchParams.get('chapter') || ''
    const mode = searchParams.get('mode') || 'test'
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10)

    let questions
    if (mode === 'daily') {
      questions = await getQuestionsForDailyMission({
        studentId: profile.id,
        grade,
        subject,
        limit,
      })
    } else if (mode === 'review') {
      questions = await getReviewQuestions({
        studentId: profile.id,
        grade,
        weakSkills: searchParams.get('weakSkills')?.split(',').filter(Boolean) || [],
        limit,
      })
    } else {
      questions = await getQuestionsForTest({
        grade,
        subject,
        chapter,
        limit,
      })
    }

    return Response.json({
      mode,
      grade,
      subject,
      chapter,
      questions: questions.map(mapQuestionForTest),
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

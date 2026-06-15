import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { getGradeData } from '@/lib/data'

function checkAdminAccess(request) {
  const session = getAdminSession(request)
  return !!session
}

// GET /api/admin/questions?grade=...&world=...&level=...
export async function GET(request) {
  if (!checkAdminAccess(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const grade = searchParams.get('grade') || 'lop-1'
    const worldId = parseInt(searchParams.get('world') || '1', 10)
    const levelId = parseInt(searchParams.get('level') || '1', 10)

    // Load static data
    const gradeData = getGradeData(grade)
    
    // Filter static questions by world and level
    const staticChoose = (gradeData.CHOOSE_QUESTIONS || [])
      .filter(q => q.world === worldId && q.level === levelId)
      .map((q, idx) => ({ ...q, id: `static-choose-${idx}`, isStatic: true, type: 'choose' }))

    const staticListen = (gradeData.LISTEN_QUESTIONS || [])
      .filter(q => q.world === worldId && q.level === levelId)
      .map((q, idx) => ({ ...q, id: `static-listen-${idx}`, isStatic: true, type: 'listen' }))

    const staticMatching = (gradeData.MATCHING_PAIRS_ALL || [])
      .filter(q => q.world === worldId && q.level === levelId)
      .map((q, idx) => ({ ...q, id: `static-matching-${idx}`, isStatic: true, type: 'matching' }))

    const staticQuestions = [...staticChoose, ...staticListen, ...staticMatching]

    // Load custom database questions
    const customQuestions = await prisma.customQuestion.findMany({
      where: {
        grade,
        worldId,
        levelId
      },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json({
      staticQuestions,
      customQuestions: customQuestions.map(q => ({ ...q, isStatic: false }))
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/questions - Create custom question
export async function POST(request) {
  if (!checkAdminAccess(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { grade, worldId, levelId, type, q, options, correct, emoji, subject, topic } = body

    if (!grade || !worldId || !levelId || !q) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const customQuestion = await prisma.customQuestion.create({
      data: {
        grade,
        worldId: parseInt(worldId, 10),
        levelId: parseInt(levelId, 10),
        type: type || 'choose',
        q,
        options: options || '',
        correct: parseInt(correct, 10) || 0,
        emoji: emoji || '❓',
        subject: subject || 'Chung',
        topic: topic || 'Chung'
      }
    })

    return Response.json(customQuestion, { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/admin/questions - Update custom question
export async function PUT(request) {
  if (!checkAdminAccess(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, q, options, correct, emoji, subject, topic } = body

    if (!id || !q) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updated = await prisma.customQuestion.update({
      where: { id },
      data: {
        q,
        options,
        correct: parseInt(correct, 10) || 0,
        emoji,
        subject,
        topic
      }
    })

    return Response.json(updated)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/questions - Delete custom question
export async function DELETE(request) {
  if (!checkAdminAccess(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Missing question ID' }, { status: 400 })
    }

    await prisma.customQuestion.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

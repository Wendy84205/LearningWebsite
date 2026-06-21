import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { getGradeData } from '@/lib/data/index'
import {
  normalizeQuestionPayload,
  normalizeQuestionTypeForAdmin,
  normalizeQuestionTypeForStorage,
  serializeQuestionRecord
} from '@/lib/question-bank'

async function checkAdminAccess(request) {
  const session = await getAdminSession(request)
  return !!session
}

function normalizeString(value, fallback = '') {
  return String(value ?? fallback).trim()
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function getStaticQuestionText(question) {
  return question.q || question.word || question.left || ''
}

function getStaticQuestionOptions(question) {
  if (question.type === 'matching') return [question.options || question.right || '']
  if (Array.isArray(question.options)) return question.options
  if (Array.isArray(question.options_array)) return question.options_array
  return []
}

function serializeStaticQuestion(question, fallback = {}) {
  const storageType = normalizeQuestionTypeForStorage(question.type || fallback.type)
  const options = getStaticQuestionOptions({ ...question, type: storageType })
  const adminType = normalizeQuestionTypeForAdmin(storageType, options)

  return {
    ...question,
    ...fallback,
    id: fallback.id || question.id,
    isStatic: true,
    storageType,
    type: adminType,
    q: getStaticQuestionText(question),
    question: getStaticQuestionText(question),
    options,
    answers: options.map((text, index) => ({
      id: String.fromCharCode(65 + index),
      text,
      isCorrect: index === toInt(question.correct, 0)
    })),
    correctAnswer: String.fromCharCode(65 + toInt(question.correct, 0)),
    subject: question.subject || fallback.subject || 'Chung',
    topic: question.topic || question.skill || fallback.topic || 'Chung',
    skill: question.skill || fallback.skill || '',
    difficulty: String(question.difficulty || fallback.difficulty || '1'),
    status: 'published',
    gameTypes: fallback.gameTypes || [adminType]
  }
}

function containsText(question, query) {
  if (!query) return true
  const haystack = [
    question.q,
    question.question,
    question.subject,
    question.topic,
    question.skill,
    question.difficulty,
    question.status,
    question.tags,
    question.explanation,
    ...(Array.isArray(question.options) ? question.options : [])
  ].join(' ').toLowerCase()
  return haystack.includes(query)
}

function matchesFilters(question, filters) {
  if (filters.type && question.type !== filters.type && question.storageType !== filters.type) return false
  if (filters.subject && question.subject !== filters.subject) return false
  if (filters.topic && question.topic !== filters.topic) return false
  if (filters.skill && question.skill !== filters.skill) return false
  if (filters.difficulty && String(question.difficulty) !== String(filters.difficulty)) return false
  if (filters.status && question.status !== filters.status) return false
  return containsText(question, filters.q)
}

function buildFilterOptions(questions) {
  const unique = (field) => Array.from(new Set(questions.map(item => item[field]).filter(Boolean))).sort()
  return {
    subjects: unique('subject'),
    topics: unique('topic'),
    skills: unique('skill'),
    difficulties: unique('difficulty'),
    statuses: unique('status'),
    types: unique('type')
  }
}

// GET /api/admin/questions?grade=...&world=...&level=...
export async function GET(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const grade = searchParams.get('grade') || 'lop-1'
    const worldId = toInt(searchParams.get('world') || searchParams.get('worldId'), 1)
    const levelId = toInt(searchParams.get('level') || searchParams.get('levelId'), 1)
    const includeStatic = searchParams.get('includeStatic') !== 'false'
    const filters = {
      q: normalizeString(searchParams.get('q')).toLowerCase(),
      type: normalizeString(searchParams.get('type')),
      subject: normalizeString(searchParams.get('subject')),
      topic: normalizeString(searchParams.get('topic')),
      skill: normalizeString(searchParams.get('skill')),
      difficulty: normalizeString(searchParams.get('difficulty')),
      status: normalizeString(searchParams.get('status'))
    }

    const gradeData = getGradeData(grade)
    const staticChoose = (gradeData.CHOOSE_QUESTIONS || [])
      .filter(question => question.world === worldId && question.level === levelId)
      .map((question, index) => serializeStaticQuestion(question, {
        id: `static-choose-${index}`,
        type: 'choose',
        subject: question.subject || 'Toán',
        topic: question.topic || 'Chung',
        gameTypes: ['choose_1_of_2', 'quiz']
      }))

    const staticListen = (gradeData.LISTEN_QUESTIONS || [])
      .filter(question => question.world === worldId && question.level === levelId)
      .map((question, index) => serializeStaticQuestion(question, {
        id: `static-listen-${index}`,
        type: 'listen',
        subject: question.subject || 'Tiếng Việt',
        topic: question.topic || 'Nghe và chọn',
        audioUrl: question.audioUrl || '',
        gameTypes: ['listen_select']
      }))

    const staticMatching = (gradeData.MATCHING_PAIRS_ALL || [])
      .filter(question => question.world === worldId && question.level === levelId)
      .map((question, index) => serializeStaticQuestion(question, {
        id: `static-matching-${index}`,
        type: 'matching',
        subject: question.subject || 'Toán',
        topic: question.topic || 'Ghép đôi',
        gameTypes: ['matching']
      }))

    const staticQuestions = includeStatic
      ? [...staticChoose, ...staticListen, ...staticMatching].filter(question => matchesFilters(question, filters))
      : []

    const customWhere = {
      grade,
      worldId,
      levelId,
      ...(filters.subject ? { subject: filters.subject } : {}),
      ...(filters.topic ? { topic: filters.topic } : {}),
      ...(filters.skill ? { skill: filters.skill } : {}),
      ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.type ? { type: normalizeQuestionTypeForStorage(filters.type) } : {})
    }

    const customRecords = await prisma.customQuestion.findMany({
      where: customWhere,
      orderBy: { createdAt: 'desc' }
    })

    const customQuestions = customRecords
      .map(question => serializeQuestionRecord(question, { isStatic: false }))
      .filter(question => containsText(question, filters.q))

    const allQuestions = [...customQuestions, ...staticQuestions]

    return Response.json({
      questions: allQuestions,
      staticQuestions,
      customQuestions,
      filterOptions: buildFilterOptions(allQuestions),
      meta: {
        grade,
        worldId,
        levelId,
        total: allQuestions.length,
        custom: customQuestions.length,
        static: staticQuestions.length
      }
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/questions - Create custom question
export async function POST(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const items = Array.isArray(body.items) ? body.items : null

    if (items) {
      const normalizedItems = items
        .map(item => normalizeQuestionPayload(item))
        .filter(item => item.q && item.grade && item.worldId && item.levelId)

      if (normalizedItems.length === 0) {
        return Response.json({ error: 'No valid questions to import' }, { status: 400 })
      }

      const created = await prisma.customQuestion.createMany({
        data: normalizedItems
      })

      return Response.json({ success: true, count: created.count }, { status: 201 })
    }

    const question = normalizeQuestionPayload(body)

    if (!question.grade || !question.worldId || !question.levelId || !question.q) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const customQuestion = await prisma.customQuestion.create({
      data: question
    })

    return Response.json(serializeQuestionRecord(customQuestion, { isStatic: false }), { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/admin/questions - Backward-compatible update endpoint
export async function PUT(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = normalizeString(body.id)

    if (!id) {
      return Response.json({ error: 'Missing question ID' }, { status: 400 })
    }

    const current = await prisma.customQuestion.findUnique({ where: { id } })
    if (!current) {
      return Response.json({ error: 'Question not found' }, { status: 404 })
    }

    const question = normalizeQuestionPayload(body, current)
    if (!question.q) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updated = await prisma.customQuestion.update({
      where: { id },
      data: question
    })

    return Response.json(serializeQuestionRecord(updated, { isStatic: false }))
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/questions - Backward-compatible delete endpoint
export async function DELETE(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')
    const ids = normalizeString(searchParams.get('ids'))
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    if (!id && ids.length === 0) {
      return Response.json({ error: 'Missing question ID' }, { status: 400 })
    }

    if (ids.length > 0) {
      const deleted = await prisma.customQuestion.deleteMany({
        where: { id: { in: ids } }
      })
      return Response.json({ success: true, count: deleted.count })
    }

    await prisma.customQuestion.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

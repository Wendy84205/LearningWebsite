import prisma from '@/lib/db'
import { getGradeData } from '@/lib/data'
import { getCmsQuestionsForGame, getGameQuestionType } from '@/lib/cms-content'

const GAME_TO_FLAG = {
  'choose-1-of-2': 'choose_1_of_2',
  'choose_1_of_2': 'choose_1_of_2',
  quiz: 'quiz',
  'listen-and-select': 'listen_select',
  listen_select: 'listen_select',
  'simple-matching': 'matching',
  matching: 'matching',
  'drag-drop': 'drag_drop',
  drag_drop: 'drag_drop',
}

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch {}
    return value.split(/[|,]/).map(item => item.trim()).filter(Boolean)
  }
  return [value]
}

function normalizeGrade(grade) {
  if (!grade) return 'lop-1'
  const value = String(grade).trim()
  if (/^\d+$/.test(value)) return `lop-${value}`
  return value
}

function storageTypeForGame(game) {
  return getGameQuestionType(game) || ''
}

function usageFlagForGame(game) {
  return GAME_TO_FLAG[String(game || '').trim()] || GAME_TO_FLAG[storageTypeForGame(game)] || ''
}

function matchesGameShape(question, questionType) {
  if (!questionType) return true
  if (questionType === 'matching') return Boolean(question.left && question.right)
  if (questionType === 'listen') return Boolean(question.word && Array.isArray(question.options))
  return Boolean(question.q && Array.isArray(question.options))
}

function mapDbQuestion(question) {
  const options = toArray(question.options)

  if (question.type === 'matching') {
    return {
      id: question.id,
      left: question.q,
      right: options[0] || question.options,
      explanation: question.explanation,
      difficulty: question.difficulty,
      skill: question.skill,
      subject: question.subject,
      topic: question.topic,
      world: question.worldId,
      level: question.levelId,
      source: 'question_bank',
    }
  }

  if (question.type === 'listen') {
    return {
      id: question.id,
      word: question.q,
      options,
      correct: question.correct,
      explanation: question.explanation,
      difficulty: question.difficulty,
      skill: question.skill,
      subject: question.subject,
      topic: question.topic,
      world: question.worldId,
      level: question.levelId,
      audioUrl: question.audioUrl,
      source: 'question_bank',
    }
  }

  return {
    id: question.id,
    q: question.q,
    options,
    correct: question.correct,
    emoji: question.emoji,
    explanation: question.explanation,
    difficulty: question.difficulty,
    skill: question.skill,
    subject: question.subject,
    topic: question.topic,
    world: question.worldId,
    level: question.levelId,
    imageUrl: question.imageUrl,
    source: 'question_bank',
  }
}

function questionBankWhere(filters = {}) {
  const grade = normalizeGrade(filters.grade)
  const questionType = filters.type || storageTypeForGame(filters.game)
  const gameUsage = usageFlagForGame(filters.game)

  return {
    grade,
    status: 'published',
    ...(filters.world ? { worldId: Number(filters.world) } : {}),
    ...(filters.level && !filters.isBoss ? { levelId: Number(filters.level) } : {}),
    ...(filters.subject ? { subject: filters.subject } : {}),
    ...(filters.topic ? { topic: filters.topic } : {}),
    ...(filters.skill ? { skill: filters.skill } : {}),
    ...(filters.difficulty ? { difficulty: String(filters.difficulty) } : {}),
    ...(questionType ? { type: questionType } : {}),
    ...(gameUsage ? { gameTypes: { contains: gameUsage } } : {}),
  }
}

async function getQuestionBankQuestions(filters = {}) {
  const records = await prisma.customQuestion.findMany({
    where: questionBankWhere(filters),
    orderBy: { createdAt: 'desc' },
    take: filters.take || 50,
  })

  return records.map(mapDbQuestion)
}

function getStaticGameQuestions({ grade, world, level, isBoss }) {
  const gradeData = getGradeData(normalizeGrade(grade))
  if (!gradeData || typeof gradeData.getQuestionsForGame !== 'function') return []
  return gradeData.getQuestionsForGame(Number(world || 1), Number(level || 1), Boolean(isBoss))
    .map(question => ({ ...question, source: 'static_fallback' }))
}

export async function getQuestionsForGame({
  grade = 'lop-1',
  world = 1,
  level = 1,
  isBoss = false,
  game = '',
  subject = '',
  difficulty = '',
  limit,
} = {}) {
  const questionType = storageTypeForGame(game)
  const bankQuestions = await getQuestionBankQuestions({
    grade,
    world,
    level,
    isBoss,
    game,
    subject,
    difficulty,
    type: questionType,
  })

  const cmsQuestions = await getCmsQuestionsForGame({ grade: normalizeGrade(grade), world: Number(world), level: Number(level), isBoss, game })
  const staticQuestions = getStaticGameQuestions({ grade, world, level, isBoss })
  const max = limit || (isBoss ? 8 : 5)

  return shuffle([...bankQuestions, ...cmsQuestions, ...staticQuestions])
    .filter(question => matchesGameShape(question, questionType))
    .slice(0, max)
}

export async function getQuestionsForLesson({
  grade = 'lop-1',
  subject = '',
  lessonId = '',
  difficulty = '',
  limit = 5,
} = {}) {
  const questions = await getQuestionBankQuestions({
    grade,
    subject,
    topic: lessonId,
    difficulty,
    game: 'quiz',
    take: limit * 2,
  })

  return shuffle(questions).slice(0, limit)
}

export async function getQuestionsForTest({
  grade = 'lop-1',
  subject = '',
  chapter = '',
  difficultyMix = { easy: 0.5, medium: 0.35, hard: 0.15 },
  limit = 10,
} = {}) {
  const buckets = await Promise.all(Object.entries(difficultyMix).map(async ([difficulty, ratio]) => {
    const count = Math.max(1, Math.round(limit * ratio))
    const questions = await getQuestionBankQuestions({
      grade,
      subject,
      topic: chapter,
      difficulty,
      game: 'quiz',
      take: count * 2,
    })
    return shuffle(questions).slice(0, count)
  }))

  return shuffle(buckets.flat()).slice(0, limit)
}

export async function getQuestionsForDailyMission({
  studentId,
  grade = 'lop-1',
  subject = '',
  limit = 5,
} = {}) {
  return getQuestionsForTest({
    grade,
    subject,
    difficultyMix: { easy: 0.7, medium: 0.3 },
    limit,
    studentId,
  })
}

export async function getReviewQuestions({
  studentId,
  grade = 'lop-1',
  weakSkills = [],
  limit = 5,
} = {}) {
  const skills = Array.isArray(weakSkills) ? weakSkills.filter(Boolean) : []
  const pools = await Promise.all((skills.length ? skills : ['']).map(skill => getQuestionBankQuestions({
    grade,
    skill,
    game: 'quiz',
    take: limit,
    studentId,
  })))

  return shuffle(pools.flat()).slice(0, limit)
}

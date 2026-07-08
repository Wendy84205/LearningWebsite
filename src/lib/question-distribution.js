import prisma from '@/lib/db'
import { getGradeData } from '@/lib/data'
import { getCmsQuestionsForGame, getGameQuestionType } from '@/lib/cms-content'

const GAME_TO_FLAG = {
  'choose-1-of-2': 'choose_1_of_2',
  'choose_1_of_2': 'choose_1_of_2',
  'quiz-runner-3d': 'quiz',
  'math-treasure': 'quiz',
  'spelling-sprint': 'quiz',
  'science-lab': 'quiz',
  'history-map': 'quiz',
  'english-quest': 'quiz',
  quiz: 'quiz',
  'listen-and-select': 'listen_select',
  listen_select: 'listen_select',
  'simple-matching': 'matching',
  matching: 'matching',
  'drag-drop': 'drag_drop',
  drag_drop: 'drag_drop',
}

const DIFFICULTY_ALIASES = {
  easy: ['easy', '1'],
  '1': ['1', 'easy'],
  medium: ['medium', '2'],
  '2': ['2', 'medium'],
  hard: ['hard', '3'],
  '3': ['3', 'hard'],
}

const STATIC_BANK_BY_GAME = {
  quiz: ['CHOOSE_QUESTIONS'],
  choose: ['CHOOSE_QUESTIONS'],
  'choose-1-of-2': ['CHOOSE_QUESTIONS'],
  'quiz-runner-3d': ['CHOOSE_QUESTIONS'],
  'math-treasure': ['CHOOSE_QUESTIONS'],
  'spelling-sprint': ['CHOOSE_QUESTIONS'],
  'science-lab': ['CHOOSE_QUESTIONS'],
  'history-map': ['CHOOSE_QUESTIONS'],
  'english-quest': ['CHOOSE_QUESTIONS', 'LISTEN_QUESTIONS'],
  choose_1_of_2: ['CHOOSE_QUESTIONS'],
  'listen-and-select': ['LISTEN_QUESTIONS'],
  listen_select: ['LISTEN_QUESTIONS'],
  matching: ['MATCHING_PAIRS_ALL'],
  'simple-matching': ['MATCHING_PAIRS_ALL'],
}

const SUBJECT_ALIASES = {
  math: ['math', 'toan', 'toán', 'Toán'],
  toan: ['math', 'toan', 'toán', 'Toán'],
  'toán': ['math', 'toan', 'toán', 'Toán'],
  vietnamese: ['vietnamese', 'tieng viet', 'tiếng việt', 'Tiếng Việt'],
  'tieng viet': ['vietnamese', 'tieng viet', 'tiếng việt', 'Tiếng Việt'],
  'tiếng việt': ['vietnamese', 'tieng viet', 'tiếng việt', 'Tiếng Việt'],
  science: ['science', 'khoa học', 'Khoa học', 'tu nhien', 'tự nhiên', 'Tự nhiên', 'tự nhiên & xã hội', 'Tự nhiên & Xã hội'],
  'khoa học': ['science', 'khoa học', 'Khoa học', 'tu nhien', 'tự nhiên', 'Tự nhiên', 'tự nhiên & xã hội', 'Tự nhiên & Xã hội'],
  history: ['history', 'lich su', 'lịch sử', 'Lịch sử', 'lịch sử & địa lí', 'Lịch sử & Địa lí'],
  'lịch sử': ['history', 'lich su', 'lịch sử', 'Lịch sử', 'lịch sử & địa lí', 'Lịch sử & Địa lí'],
  geography: ['geography', 'dia li', 'địa lí', 'Địa lí', 'lịch sử & địa lí', 'Lịch sử & Địa lí'],
  'địa lí': ['geography', 'dia li', 'địa lí', 'Địa lí', 'lịch sử & địa lí', 'Lịch sử & Địa lí'],
  'lịch sử & địa lí': ['history', 'geography', 'lịch sử', 'Lịch sử', 'địa lí', 'Địa lí', 'lịch sử & địa lí', 'Lịch sử & Địa lí'],
  english: ['english', 'tieng anh', 'tiếng anh', 'Tiếng Anh'],
  'tiếng anh': ['english', 'tieng anh', 'tiếng anh', 'Tiếng Anh'],
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

function normalizeText(value) {
  return String(value || '').trim()
}

function normalizeComparableText(value) {
  return normalizeText(value).toLowerCase()
}

function getSubjectAliases(subject) {
  const normalized = normalizeComparableText(subject)
  const aliases = SUBJECT_ALIASES[normalized] || (normalized ? [subject] : [])
  return Array.from(new Set(aliases))
}

function getDifficultyAliases(value) {
  const key = normalizeText(value).toLowerCase()
  return DIFFICULTY_ALIASES[key] || (key ? [key] : [])
}

function matchesDifficulty(questionDifficulty, requestedDifficulty) {
  const aliases = getDifficultyAliases(requestedDifficulty)
  if (!aliases.length) return true
  return aliases.includes(normalizeText(questionDifficulty).toLowerCase())
}

function matchesTextFilter(value, filter) {
  const normalizedFilter = normalizeComparableText(filter)
  if (!normalizedFilter) return true
  return normalizeComparableText(value) === normalizedFilter
}

function matchesSubjectFilter(value, filter) {
  const aliases = getSubjectAliases(filter)
  if (!aliases.length) return true
  return aliases.includes(normalizeComparableText(value))
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

function matchesQuestionFilters(question, filters = {}) {
  return matchesSubjectFilter(question.subject, filters.subject)
    && matchesTextFilter(question.topic, filters.topic)
    && matchesTextFilter(question.skill, filters.skill)
    && matchesDifficulty(question.difficulty, filters.difficulty)
}

function dedupeQuestions(questions) {
  const seen = new Set()
  return questions.filter(question => {
    const key = [
      question.id,
      question.q,
      question.word,
      question.left,
      question.right,
      question.subject,
      question.topic,
      question.skill
    ].filter(Boolean).join('|')

    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
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
  const difficultyValues = getDifficultyAliases(filters.difficulty)
  const subjectValues = getSubjectAliases(filters.subject)

  return {
    grade,
    status: 'published',
    ...(filters.world ? { worldId: Number(filters.world) } : {}),
    ...(filters.level && !filters.isBoss ? { levelId: Number(filters.level) } : {}),
    ...(subjectValues.length ? { OR: subjectValues.map(subject => ({ subject })) } : {}),
    ...(filters.topic ? { topic: filters.topic } : {}),
    ...(filters.skill ? { skill: filters.skill } : {}),
    ...(difficultyValues.length ? { difficulty: { in: difficultyValues } } : {}),
    ...(questionType ? { type: questionType } : {}),
    ...(gameUsage ? { gameTypes: { contains: gameUsage } } : {}),
  }
}

async function getQuestionBankQuestions(filters = {}) {
  try {
    const records = await prisma.customQuestion.findMany({
      where: questionBankWhere(filters),
      orderBy: { createdAt: 'desc' },
      take: filters.take || 50,
    })

    return records.map(mapDbQuestion)
  } catch (err) {
    console.warn('[question-distribution] question bank unavailable, using fallback:', err.message)
    return []
  }
}

function getStaticGameQuestions({ grade, world, level, isBoss }) {
  const gradeData = getGradeData(normalizeGrade(grade))
  if (!gradeData || typeof gradeData.getQuestionsForGame !== 'function') return []
  return gradeData.getQuestionsForGame(Number(world || 1), Number(level || 1), Boolean(isBoss))
    .map((question, index) => ({
      id: question.id || `static-${normalizeGrade(grade)}-w${Number(world || 1)}-${isBoss ? 'boss' : `l${Number(level || 1)}`}-${index}`,
      ...question,
      difficulty: question.difficulty || '1',
      source: 'static_fallback'
    }))
}

async function getCmsQuestionsForGameSafe(filters) {
  try {
    return await getCmsQuestionsForGame(filters)
  } catch (err) {
    console.warn('[question-distribution] CMS questions unavailable, using fallback:', err.message)
    return []
  }
}

function mapStaticQuestion(question, sourceKey, index) {
  if (sourceKey === 'LISTEN_QUESTIONS') {
    return {
      id: question.id || `static-listen-${index}`,
      word: question.word || question.q || '',
      options: toArray(question.options),
      correct: question.correct ?? 0,
      explanation: question.explanation || '',
      difficulty: question.difficulty || '1',
      skill: question.skill || '',
      subject: question.subject || '',
      topic: question.topic || '',
      world: question.world,
      level: question.level,
      audioUrl: question.audioUrl || '',
      source: 'static_fallback',
    }
  }

  if (sourceKey === 'MATCHING_PAIRS_ALL') {
    return {
      id: question.id || `static-matching-${index}`,
      left: question.left || question.q || '',
      right: question.right || toArray(question.options)[0] || '',
      explanation: question.explanation || '',
      difficulty: question.difficulty || '1',
      skill: question.skill || '',
      subject: question.subject || '',
      topic: question.topic || '',
      world: question.world,
      level: question.level,
      source: 'static_fallback',
    }
  }

  return {
    id: question.id || `static-choose-${index}`,
    q: question.q || question.question || '',
    options: toArray(question.options),
    correct: question.correct ?? 0,
    emoji: question.emoji || '❓',
    explanation: question.explanation || '',
    difficulty: question.difficulty || '1',
    skill: question.skill || '',
    subject: question.subject || '',
    topic: question.topic || '',
    world: question.world,
    level: question.level,
    imageUrl: question.imageUrl || '',
    source: 'static_fallback',
  }
}

function getStaticQuestionPool({
  grade,
  game = 'quiz',
  subject = '',
  topic = '',
  skill = '',
  difficulty = '',
  questionType = '',
} = {}) {
  const gradeData = getGradeData(normalizeGrade(grade))
  const sourceKeys = STATIC_BANK_BY_GAME[game] || STATIC_BANK_BY_GAME[questionType] || STATIC_BANK_BY_GAME.quiz

  return sourceKeys
    .flatMap(sourceKey => (gradeData[sourceKey] || []).map((question, index) => mapStaticQuestion(question, sourceKey, index)))
    .filter(question => matchesGameShape(question, questionType || storageTypeForGame(game)))
    .filter(question => matchesQuestionFilters(question, { subject, topic, skill, difficulty }))
}

function fillFromStatic({ current, limit, staticPool }) {
  if (current.length >= limit) return current.slice(0, limit)
  return dedupeQuestions([...current, ...shuffle(staticPool)]).slice(0, limit)
}

async function getWeakSkillsForStudent(studentId, limit = 3) {
  if (!studentId) return []

  let answers = []
  try {
    answers = await prisma.studentAnswer.findMany({
      where: {
        skill: { not: '' },
        isCorrect: false,
        attempt: { profileId: studentId },
      },
      select: { skill: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
  } catch (err) {
    console.warn('[question-distribution] student answer history unavailable:', err.message)
    return []
  }

  const counts = new Map()
  answers.forEach(answer => {
    counts.set(answer.skill, (counts.get(answer.skill) || 0) + 1)
  })

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([skill]) => skill)
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

  const cmsQuestions = await getCmsQuestionsForGameSafe({ grade: normalizeGrade(grade), world: Number(world), level: Number(level), isBoss, game })
  const staticQuestions = getStaticGameQuestions({ grade, world, level, isBoss })
  const max = limit || (isBoss ? 8 : 5)
  const questionPool = dedupeQuestions([...bankQuestions, ...cmsQuestions, ...staticQuestions])
  const filteredPool = shuffle(questionPool)
    .filter(question => matchesGameShape(question, questionType))
    .filter(question => matchesQuestionFilters(question, { subject, difficulty }))

  return fillFromStatic({
    current: filteredPool,
    limit: max,
    staticPool: getStaticQuestionPool({ grade, game, subject, difficulty, questionType })
  })
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

  return fillFromStatic({
    current: shuffle(questions),
    limit,
    staticPool: getStaticQuestionPool({ grade, subject, topic: lessonId, difficulty, game: 'quiz' })
  })
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
    return fillFromStatic({
      current: shuffle(questions),
      limit: count,
      staticPool: getStaticQuestionPool({ grade, subject, topic: chapter, difficulty, game: 'quiz' })
    })
  }))

  return dedupeQuestions(shuffle(buckets.flat())).slice(0, limit)
}

export async function getQuestionsForDailyMission({
  studentId,
  grade = 'lop-1',
  subject = '',
  limit = 5,
} = {}) {
  const weakSkills = await getWeakSkillsForStudent(studentId, 2)
  const skillPools = weakSkills.length
    ? await Promise.all(weakSkills.map(skill => getQuestionBankQuestions({
      grade,
      subject,
      skill,
      game: 'quiz',
      take: limit,
    })))
    : []

  const weakSkillFallback = weakSkills.flatMap(skill => getStaticQuestionPool({
    grade,
    subject,
    skill,
    game: 'quiz',
  }))

  if (skillPools.length || weakSkillFallback.length) {
    return fillFromStatic({
      current: shuffle(skillPools.flat()),
      limit,
      staticPool: weakSkillFallback,
    })
  }

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
  const detectedSkills = await getWeakSkillsForStudent(studentId, limit)
  const skills = Array.from(new Set([
    ...(Array.isArray(weakSkills) ? weakSkills.filter(Boolean) : []),
    ...detectedSkills
  ]))

  const pools = await Promise.all((skills.length ? skills : ['']).map(skill => getQuestionBankQuestions({
    grade,
    skill,
    game: 'quiz',
    take: limit,
    studentId,
  })))

  const staticPool = (skills.length ? skills : ['']).flatMap(skill => getStaticQuestionPool({
    grade,
    skill,
    game: 'quiz',
  }))

  return fillFromStatic({
    current: shuffle(pools.flat()),
    limit,
    staticPool,
  })
}

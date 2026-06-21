export const QUESTION_TYPES = [
  'choose_1_of_2',
  'multiple_choice',
  'matching',
  'listen_select',
  'drag_drop'
]

export const QUESTION_STATUSES = ['draft', 'review', 'published', 'archived']

const TYPE_TO_STORAGE = {
  choose: 'choose',
  choice: 'choose',
  'choose-1-of-2': 'choose',
  choose_1_of_2: 'choose',
  multiple_choice: 'choose',
  quiz: 'choose',
  matching: 'matching',
  listen: 'listen',
  listen_select: 'listen',
  'listen-and-select': 'listen',
  drag_drop: 'drag-drop',
  'drag-drop': 'drag-drop',
  typing: 'typing'
}

const TYPE_TO_ADMIN = {
  choose: 'choose_1_of_2',
  matching: 'matching',
  listen: 'listen_select',
  'drag-drop': 'drag_drop',
  typing: 'drag_drop'
}

const DEFAULT_GAME_TYPES = {
  choose_1_of_2: ['choose_1_of_2', 'quiz'],
  multiple_choice: ['multiple_choice', 'quiz'],
  matching: ['matching'],
  listen_select: ['listen_select'],
  drag_drop: ['drag_drop']
}

function normalizeString(value, fallback = '') {
  return String(value ?? fallback).trim()
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function toArray(value) {
  if (Array.isArray(value)) return value.filter(item => item != null && item !== '')
  if (value == null || value === '') return []
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter(item => item != null && item !== '')
    } catch {}
    return value.split(/[|,]/).map(item => item.trim()).filter(Boolean)
  }
  return [value]
}

export function normalizeQuestionTypeForStorage(type) {
  return TYPE_TO_STORAGE[normalizeString(type)] || 'choose'
}

export function normalizeQuestionTypeForAdmin(type, options = []) {
  const storageType = normalizeQuestionTypeForStorage(type)
  if (storageType === 'choose' && toArray(options).length > 2) return 'multiple_choice'
  return TYPE_TO_ADMIN[storageType] || 'choose_1_of_2'
}

export function getDefaultGameTypes(type) {
  const adminType = QUESTION_TYPES.includes(type) ? type : normalizeQuestionTypeForAdmin(type)
  return DEFAULT_GAME_TYPES[adminType] || [adminType]
}

export function normalizeStatus(value) {
  const status = normalizeString(value || 'published')
  return QUESTION_STATUSES.includes(status) ? status : 'published'
}

export function normalizeGameTypes(value, fallbackType = 'choose_1_of_2') {
  const gameTypes = toArray(value).map(item => normalizeString(item)).filter(Boolean)
  return gameTypes.length ? gameTypes : getDefaultGameTypes(fallbackType)
}

export function parseQuestionOptions(value, type = 'choose') {
  if (normalizeQuestionTypeForStorage(type) === 'matching' && typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch {}
    return value ? [value] : []
  }

  return toArray(value).map(item => {
    if (typeof item === 'object' && item !== null) return normalizeString(item.text ?? item.value)
    return normalizeString(item)
  }).filter(Boolean)
}

export function answersFromOptions(options, correct = 0) {
  return parseQuestionOptions(options).map((text, index) => ({
    id: String.fromCharCode(65 + index),
    text,
    isCorrect: index === toInt(correct, 0)
  }))
}

function optionsFromAnswers(body, storageType) {
  if (Array.isArray(body.answers) && body.answers.length) {
    const answers = body.answers
      .map((answer, index) => ({
        id: normalizeString(answer.id || String.fromCharCode(65 + index)),
        text: normalizeString(answer.text ?? answer.value),
        isCorrect: Boolean(answer.isCorrect)
      }))
      .filter(answer => answer.text)

    const correctIndex = Math.max(0, answers.findIndex(answer => answer.isCorrect))
    if (storageType === 'matching') {
      return {
        options: answers[0]?.text || normalizeString(body.optionB || body.right),
        correct: 0
      }
    }

    return {
      options: JSON.stringify(answers.map(answer => answer.text)),
      correct: correctIndex >= 0 ? correctIndex : 0
    }
  }

  if (typeof body.options === 'string') {
    return {
      options: body.options,
      correct: toInt(body.correct ?? body.correctAnswer, 0)
    }
  }

  if (Array.isArray(body.options)) {
    return {
      options: storageType === 'matching'
        ? normalizeString(body.options[0])
        : JSON.stringify(body.options.map(option => typeof option === 'object' ? option.text : option).filter(Boolean)),
      correct: toInt(body.correct ?? body.correctAnswer, 0)
    }
  }

  return {
    options: storageType === 'matching'
      ? normalizeString(body.optionB || body.right)
      : JSON.stringify([body.optionA, body.optionB].map(item => normalizeString(item)).filter(Boolean)),
    correct: toInt(body.correct ?? body.correctAnswer, 0)
  }
}

export function normalizeQuestionPayload(body, defaults = {}) {
  const storageType = normalizeQuestionTypeForStorage(body.type ?? defaults.type)
  const adminType = normalizeQuestionTypeForAdmin(body.type ?? defaults.type)
  const normalizedOptions = optionsFromAnswers(body, storageType)
  const questionText = normalizeString(body.q || body.question || body.word || body.left || defaults.q)
  const gameTypes = normalizeGameTypes(body.gameTypes ?? defaults.gameTypes, adminType)

  return {
    grade: normalizeString(body.grade ?? defaults.grade, 'lop-1'),
    worldId: toInt(body.worldId ?? body.world ?? defaults.worldId, 1),
    levelId: toInt(body.levelId ?? body.level ?? defaults.levelId, 1),
    type: storageType,
    q: questionText,
    options: normalizedOptions.options,
    correct: normalizedOptions.correct,
    emoji: normalizeString(body.emoji ?? defaults.emoji, '❓') || '❓',
    subject: normalizeString(body.subject ?? defaults.subject, 'Chung') || 'Chung',
    topic: normalizeString(body.topic ?? defaults.topic, 'Chung') || 'Chung',
    skill: normalizeString(body.skill ?? defaults.skill),
    difficulty: normalizeString(body.difficulty ?? defaults.difficulty, '1') || '1',
    tags: normalizeString(body.tags ?? defaults.tags),
    imageUrl: normalizeString(body.imageUrl ?? defaults.imageUrl),
    audioUrl: normalizeString(body.audioUrl ?? defaults.audioUrl),
    explanation: normalizeString(body.explanation ?? defaults.explanation),
    gameTypes: gameTypes.join(','),
    status: normalizeStatus(body.status ?? defaults.status)
  }
}

export function serializeQuestionRecord(question, extra = {}) {
  const options = parseQuestionOptions(question.options, question.type)
  const adminType = normalizeQuestionTypeForAdmin(question.type, options)
  const answers = answersFromOptions(options, question.correct)

  return {
    ...question,
    ...extra,
    type: adminType,
    storageType: question.type,
    q: question.q,
    question: question.q,
    options,
    answers,
    correctAnswer: answers.find(answer => answer.isCorrect)?.id || answers[0]?.id || 'A',
    gameTypes: normalizeGameTypes(question.gameTypes, adminType),
    status: normalizeStatus(question.status),
    createdAt: question.createdAt?.toISOString?.() || question.createdAt
  }
}

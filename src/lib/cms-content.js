import prisma from '@/lib/db'
import { getGradeData } from '@/lib/data'
import { isDeliverableCmsItem } from '@/lib/cms-governance'

const MODULE_ALIASES = {
  content: ['content', 'curriculum'],
  curriculum: ['content', 'curriculum'],
  games: ['games'],
  'learning-map': ['learning-map'],
  assignments: ['assignments'],
  tests: ['tests', 'assessments'],
  assessments: ['tests', 'assessments'],
  achievements: ['achievements'],
  reports: ['reports'],
  'ai-studio': ['ai-studio', 'ai'],
  ai: ['ai-studio', 'ai'],
  media: ['media'],
  settings: ['settings', 'roles'],
  roles: ['settings', 'roles'],
}

const GRADE_LABELS = {
  'lop-1': 'Lớp 1',
  'lop-2': 'Lớp 2',
  'lop-3': 'Lớp 3',
  'lop-4': 'Lớp 4',
  'lop-5': 'Lớp 5',
}

const GAME_TYPE_MAP = {
  choose: 'choose',
  'choose-1-of-2': 'choose',
  choice: 'choose',
  listen: 'listen',
  'listen-and-select': 'listen',
  matching: 'matching',
  'simple-matching': 'matching',
}

function normalizeString(value) {
  return String(value || '').trim()
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function safeJson(value, fallback = null) {
  if (value == null || value === '') return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function toArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    const parsed = safeJson(value)
    if (Array.isArray(parsed)) return parsed
    return value.split(/[|,]/).map(item => item.trim()).filter(Boolean)
  }
  return []
}

function gradeWhere(grade) {
  const normalized = normalizeString(grade)
  if (!normalized) return {}
  const label = GRADE_LABELS[normalized] || normalized
  return {
    OR: [
      { grade: null },
      { grade: '' },
      { grade: normalized },
      { grade: label },
    ]
  }
}

function serializeItem(item) {
  return {
    ...item,
    data: item.data || {},
    createdAt: item.createdAt?.toISOString?.() || item.createdAt,
    updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt,
  }
}

export function resolveCmsModule(moduleKey) {
  const normalized = normalizeString(moduleKey)
  return MODULE_ALIASES[normalized] || [normalized]
}

export function getGameQuestionType(game) {
  return GAME_TYPE_MAP[normalizeString(game)] || ''
}

export async function getActiveCmsItems(moduleKey, filters = {}) {
  const aliases = resolveCmsModule(moduleKey)
  const type = normalizeString(filters.type)
  const q = normalizeString(filters.q).toLowerCase()

  const items = await prisma.adminCmsItem.findMany({
    where: {
      module: { in: aliases },
      status: 'active',
      ...gradeWhere(filters.grade),
      ...(type ? { type } : {}),
      ...(filters.subject ? { subject: normalizeString(filters.subject) } : {}),
      ...(filters.topic ? { topic: normalizeString(filters.topic) } : {}),
      ...(filters.skill ? { skill: normalizeString(filters.skill) } : {}),
    },
    orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }, { createdAt: 'desc' }]
  })

  const filtered = q
    ? items.filter(item => [
      item.title, item.type, item.grade, item.subject, item.topic, item.skill, item.difficulty,
      item.data?.description, item.data?.content, item.data?.tags
    ].some(value => String(value || '').toLowerCase().includes(q)))
    : items

  return filtered.filter(item => isDeliverableCmsItem(item)).map(serializeItem)
}

function getWorldIdFromItem(item, fallback) {
  return toInt(
    item.data?.worldId ||
    item.data?.world ||
    item.data?.worldNumber ||
    item.data?.id ||
    item.order,
    fallback
  )
}

function getLevelIdFromItem(item, fallback) {
  return toInt(
    item.data?.levelId ||
    item.data?.level ||
    item.data?.levelNumber ||
    item.data?.id ||
    item.order,
    fallback
  )
}

function defaultWorld(id, item) {
  return {
    id,
    name: item.title,
    desc: item.data?.description || item.data?.content || 'Thế giới học tập từ CMS',
    icon: item.data?.icon || item.data?.emoji || '📚',
    medal: item.data?.medal || '⭐',
    bgColor: item.data?.bgColor || item.data?.backgroundColor || '#e0f2fe',
    borderColor: item.data?.borderColor || item.data?.color || '#2563eb',
    textColor: item.data?.textColor || '#0f172a',
    levels: [],
    bossName: item.data?.bossName || `Boss ${item.title}`,
    bossDesc: item.data?.bossDesc || 'Vượt thử thách cuối thế giới',
    bossGame: item.data?.bossGame || `/game-choose-1-of-2?world=${id}&level=1&boss=true`,
  }
}

function mergeWorldRecord(world, item) {
  return {
    ...world,
    name: item.title || world.name,
    desc: item.data?.description || item.data?.content || world.desc,
    icon: item.data?.icon || item.data?.emoji || world.icon,
    medal: item.data?.medal || world.medal,
    bgColor: item.data?.bgColor || item.data?.backgroundColor || world.bgColor,
    borderColor: item.data?.borderColor || item.data?.color || world.borderColor,
    textColor: item.data?.textColor || world.textColor,
    bossName: item.data?.bossName || world.bossName,
    bossDesc: item.data?.bossDesc || world.bossDesc,
    bossGame: item.data?.bossGame || world.bossGame,
  }
}

function levelFromItem(item, worldId, fallbackId) {
  const id = getLevelIdFromItem(item, fallbackId)
  return {
    id,
    title: item.title,
    desc: item.data?.description || item.data?.content || 'Bài học từ CMS',
    game: item.data?.game || item.data?.gameRoute || `/game-choose-1-of-2?world=${worldId}&level=${id}`,
    xp: toInt(item.data?.xp, 0),
    coin: toInt(item.data?.coin, 0),
    stars: toInt(item.data?.stars, 3),
  }
}

export async function getCmsLearningMap(gradeSlug) {
  const baseWorlds = JSON.parse(JSON.stringify(getGradeData(gradeSlug).WORLDS || []))
  const cmsItems = await getActiveCmsItems('learning-map', { grade: gradeSlug })
  const worlds = [...baseWorlds]

  cmsItems.filter(item => item.type === 'world').forEach((item, index) => {
    const id = getWorldIdFromItem(item, worlds.length + index + 1)
    const existingIndex = worlds.findIndex(world => world.id === id)
    if (existingIndex >= 0) {
      worlds[existingIndex] = mergeWorldRecord(worlds[existingIndex], item)
    } else {
      worlds.push(defaultWorld(id, item))
    }
  })

  cmsItems.filter(item => item.type === 'level' || item.type === 'stage').forEach(item => {
    const worldId = getWorldIdFromItem(item, 1)
    let world = worlds.find(entry => entry.id === worldId)
    if (!world) {
      world = defaultWorld(worldId, { ...item, title: `World ${worldId}`, data: {} })
      worlds.push(world)
    }

    const level = levelFromItem(item, worldId, (world.levels?.length || 0) + 1)
    const existingIndex = (world.levels || []).findIndex(entry => entry.id === level.id)
    if (existingIndex >= 0) {
      world.levels[existingIndex] = { ...world.levels[existingIndex], ...level }
    } else {
      world.levels = [...(world.levels || []), level].sort((a, b) => a.id - b.id)
    }
  })

  cmsItems.filter(item => item.type === 'boss').forEach(item => {
    const worldId = getWorldIdFromItem(item, 1)
    const world = worlds.find(entry => entry.id === worldId)
    if (!world) return
    world.bossName = item.title || world.bossName
    world.bossDesc = item.data?.description || item.data?.content || world.bossDesc
    world.bossGame = item.data?.game || item.data?.gameRoute || world.bossGame
    world.medal = item.data?.medal || world.medal
  })

  return {
    worlds: worlds.sort((a, b) => a.id - b.id),
    cmsItems,
  }
}

function extractQuestionsFromItem(item) {
  const data = item.data || {}
  const questions = Array.isArray(data.questions)
    ? data.questions
    : Array.isArray(data.items)
      ? data.items
      : [data]

  return questions
    .map((question, index) => normalizeCmsQuestion(question, item, index))
    .filter(Boolean)
}

function normalizeCmsQuestion(question, item, index) {
  const data = question || {}
  const type = normalizeString(data.type || data.questionType || item.data?.questionType || item.type)
  const id = `${item.id}-${index}`
  const subject = data.subject || item.subject || 'Chung'
  const topic = data.topic || item.topic || item.title
  const world = toInt(
    data.worldId || data.world || item.data?.worldId || item.data?.world,
    toInt(item.data?.worldId || item.data?.world, 0)
  )
  const level = toInt(
    data.levelId || data.level || item.data?.levelId || item.data?.level,
    toInt(item.data?.levelId || item.data?.level, 0)
  )

  if (['matching', 'pair', 'match'].includes(type) || data.left || data.right) {
    const left = data.left || data.q || data.question || item.title
    const right = data.right || data.answer || toArray(data.options)[0] || data.correctAnswer
    if (!left || !right) return null
    return { id, left, right, subject, topic, world, level }
  }

  if (['listen', 'audio'].includes(type) || data.word || data.audioUrl) {
    const word = data.word || data.q || data.question || item.title
    const options = toArray(data.options || item.data?.options)
    if (!word || options.length < 2) return null
    return {
      id,
      word,
      options,
      correct: toInt(data.correct, 0),
      subject,
      topic,
      world,
      level,
      audioUrl: data.audioUrl || item.data?.audioUrl || '',
    }
  }

  const q = data.q || data.question || data.prompt || item.title
  const options = toArray(data.options || item.data?.options)
  if (!q || options.length < 2) return null
  return {
    id,
    q,
    options,
    correct: toInt(data.correct, 0),
    emoji: data.emoji || item.data?.emoji || item.data?.icon || '❓',
    subject,
    topic,
    world,
    level,
  }
}

function questionMatchesGame(question, questionType) {
  if (!questionType) return true
  if (questionType === 'matching') return Boolean(question.left && question.right)
  if (questionType === 'listen') return Boolean(question.word && Array.isArray(question.options))
  return Boolean(question.q && Array.isArray(question.options))
}

function questionMatchesLevel(question, world, level, isBoss) {
  if (question.world && question.world !== world) return false
  if (!isBoss && question.level && question.level !== level) return false
  return true
}

export async function getCmsQuestionsForGame({ grade, world, level, isBoss = false, game = '' }) {
  const questionType = getGameQuestionType(game)
  const pools = await Promise.all([
    getActiveCmsItems('games', { grade }),
    getActiveCmsItems('content', { grade }),
  ])
  const items = pools.flat().filter(item => [
    'question',
    'question-pool',
    'practice',
    'quiz',
    'lesson',
    'game-config'
  ].includes(item.type))

  return items
    .flatMap(extractQuestionsFromItem)
    .filter(question => questionMatchesGame(question, questionType))
    .filter(question => questionMatchesLevel(question, world, level, isBoss))
}

function parseSettingValue(value) {
  const parsed = safeJson(value)
  return parsed ?? value
}

export async function getCmsSettingsConfig(filters = {}) {
  const items = await getActiveCmsItems('settings', filters)
  const config = items.reduce((acc, item) => {
    const key = normalizeString(item.data?.settingKey || item.data?.key || item.title)
    if (!key) return acc
    acc[key] = parseSettingValue(item.data?.settingValue ?? item.data?.value ?? item.data?.content)
    return acc
  }, {})

  return { items, config }
}

export async function getCmsBootstrapBundle(gradeSlug = 'lop-1') {
  const [
    learningMap,
    settings,
    achievements,
    media,
    assignments,
    tests,
    reports,
    games
  ] = await Promise.all([
    getCmsLearningMap(gradeSlug),
    getCmsSettingsConfig({ grade: gradeSlug }),
    getActiveCmsItems('achievements', { grade: gradeSlug }),
    getActiveCmsItems('media', { grade: gradeSlug }),
    getActiveCmsItems('assignments', { grade: gradeSlug }),
    getActiveCmsItems('tests', { grade: gradeSlug }),
    getActiveCmsItems('reports', { grade: gradeSlug }),
    getActiveCmsItems('games', { grade: gradeSlug }),
  ])

  return {
    grade: gradeSlug,
    learningMap,
    settings,
    achievements: {
      badges: achievements.filter(item => item.type === 'badge'),
      medals: achievements.filter(item => item.type === 'medal'),
      rewards: achievements.filter(item => ['reward', 'unlock-condition'].includes(item.type)),
      items: achievements,
    },
    media,
    assignments,
    tests,
    reports,
    games,
    health: {
      activeItems: [
        learningMap.cmsItems,
        settings.items,
        achievements,
        media,
        assignments,
        tests,
        reports,
        games
      ].flat().length,
      hasCmsLearningMap: learningMap.cmsItems.length > 0,
      hasSettings: settings.items.length > 0,
      hasRewards: achievements.length > 0,
    }
  }
}

import prisma from '@/lib/db'
import { getGradeData } from '@/lib/data/index'
import {
  CMS_SYSTEM_MODULE,
  CONTENT_TYPE_DEFINITIONS,
  createSlug,
  enrichCmsData,
  validateCmsPayload
} from '@/lib/cms-governance'

const MODULE_DEFINITIONS = [
  {
    key: 'curriculum',
    module: 'content',
    aliases: ['content', 'curriculum'],
    title: 'Curriculum',
    primaryTypes: ['grade', 'subject', 'topic', 'skill', 'lesson']
  },
  {
    key: 'games',
    module: 'games',
    aliases: ['games'],
    title: 'Games',
    primaryTypes: ['game', 'question-pool', 'game-config', 'reward-rule']
  },
  {
    key: 'learningMap',
    module: 'learning-map',
    aliases: ['learning-map'],
    title: 'Learning Map',
    primaryTypes: ['world', 'stage', 'level', 'boss', 'reward', 'unlock-rule']
  },
  {
    key: 'assignments',
    module: 'assignments',
    aliases: ['assignments'],
    title: 'Assignments',
    primaryTypes: ['assignment', 'assignment-template', 'target-group', 'homework-policy']
  },
  {
    key: 'tests',
    module: 'tests',
    aliases: ['tests', 'assessments'],
    title: 'Tests',
    primaryTypes: ['practice', 'quiz', 'chapter-test', 'semester-test', 'assessment-rule']
  },
  {
    key: 'achievements',
    module: 'achievements',
    aliases: ['achievements'],
    title: 'Achievements',
    primaryTypes: ['badge', 'medal', 'unlock-condition', 'reward']
  },
  {
    key: 'reports',
    module: 'reports',
    aliases: ['reports'],
    title: 'Reports',
    primaryTypes: ['student-report', 'learning-report', 'question-report', 'parent-report', 'export-template']
  },
  {
    key: 'aiGenerator',
    module: 'ai-studio',
    aliases: ['ai-studio', 'ai'],
    title: 'AI Generator',
    primaryTypes: ['question-generator', 'lesson-generator', 'exam-generator', 'ai-review', 'ai-draft']
  },
  {
    key: 'media',
    module: 'media',
    aliases: ['media'],
    title: 'Media Library',
    primaryTypes: ['image', 'audio', 'video', 'sticker', 'badge', 'mascot', 'folder', 'tag']
  },
  {
    key: 'settings',
    module: 'settings',
    aliases: ['settings', 'roles'],
    title: 'Settings',
    primaryTypes: ['system', 'gamification', 'notification', 'security', 'role', 'permission']
  }
]

const GRADE_SLUGS = ['lop-1', 'lop-2', 'lop-3', 'lop-4', 'lop-5']
const GRADE_LABELS = {
  'lop-1': 'Lớp 1',
  'lop-2': 'Lớp 2',
  'lop-3': 'Lớp 3',
  'lop-4': 'Lớp 4',
  'lop-5': 'Lớp 5'
}
const STATIC_SYNC_SOURCE = 'hoc-vui-static-curriculum'

function normalizeString(value) {
  return String(value || '').trim()
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function httpError(message, status = 400) {
  const error = new Error(message)
  error.status = status
  return error
}

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value))))
}

function normalizeData(value) {
  if (value == null || value === '') return null
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return { content: value }
    }
  }

  return JSON.parse(JSON.stringify(value))
}

function gradeLabel(gradeSlug) {
  return GRADE_LABELS[gradeSlug] || gradeSlug
}

function subjectForWorld(worldId) {
  if ([1, 4].includes(Number(worldId))) return 'Toán'
  if (Number(worldId) === 2) return 'Tiếng Việt'
  if (Number(worldId) === 3) return 'Toán & Tiếng Việt'
  return 'Tự nhiên & Xã hội'
}

function normalizedGameRoute(route = '') {
  return String(route).split('?')[0].replace(/^\//, '') || 'game-choose-1-of-2'
}

function questionPoolsFromGradeData(gradeData) {
  return [
    ...(Array.isArray(gradeData.CHOOSE_QUESTIONS) ? gradeData.CHOOSE_QUESTIONS : []),
    ...(Array.isArray(gradeData.LISTEN_QUESTIONS) ? gradeData.LISTEN_QUESTIONS : []),
    ...(Array.isArray(gradeData.MATCHING_PAIRS_ALL) ? gradeData.MATCHING_PAIRS_ALL : [])
  ]
}

function countStaticQuestions(gradeData, worldId, levelId = null) {
  return questionPoolsFromGradeData(gradeData).filter(question => {
    const questionWorld = toNumber(question.world ?? question.worldId)
    const questionLevel = toNumber(question.level ?? question.levelId)
    if (questionWorld !== Number(worldId)) return false
    if (levelId != null && questionLevel !== Number(levelId)) return false
    return true
  }).length
}

function staticKey(parts) {
  return ['static', ...parts].join(':')
}

function makeSeedItem({
  module,
  type,
  title,
  status,
  grade = null,
  subject = null,
  topic = null,
  skill = null,
  difficulty = null,
  order = 0,
  data = {}
}) {
  return {
    module,
    type,
    title,
    status,
    grade,
    subject,
    topic,
    skill,
    difficulty,
    order,
    data: {
      source: STATIC_SYNC_SOURCE,
      ...data
    }
  }
}

async function createMissingSeedItems(desiredItems, modules = []) {
  const scopedModules = modules.length ? modules : unique(desiredItems.map(item => item.module))
  const existingItems = await prisma.adminCmsItem.findMany({
    where: { module: { in: scopedModules } },
    select: { data: true }
  })
  const existingKeys = new Set(existingItems.map(item => item.data?.sourceKey).filter(Boolean))
  const missingItems = desiredItems.filter(item => item.data?.sourceKey && !existingKeys.has(item.data.sourceKey))

  if (missingItems.length > 0) {
    await prisma.adminCmsItem.createMany({ data: missingItems })
  }

  return {
    count: missingItems.length,
    skipped: desiredItems.length - missingItems.length,
    total: desiredItems.length,
    modules: scopedModules
  }
}

function buildOperationalTemplateItems(gradeSlug) {
  const grade = normalizeString(gradeSlug) || 'lop-1'
  const now = new Date().toISOString()

  return [
    makeSeedItem({
      module: 'assignments',
      type: 'assignment-template',
      title: `Mẫu giao bài ${gradeLabel(grade)}`,
      status: 'active',
      grade,
      subject: 'Toán',
      topic: 'Ôn tập tuần',
      skill: 'Luyện tập cá nhân',
      order: 10,
      data: {
        sourceKey: staticKey([grade, 'assignment-template', 'weekly-practice']),
        description: 'Mẫu giao bài tuần, có thể nhân bản để giao cho học sinh thật.',
        targetGroup: 'Theo lớp hoặc theo nhóm học sinh',
        deadlinePolicy: '7 ngày sau khi giao',
        scoringRule: 'Tính hoàn thành theo sao/progress của game.',
        syncedAt: now
      }
    }),
    makeSeedItem({
      module: 'tests',
      type: 'practice',
      title: `Practice Test ${gradeLabel(grade)}`,
      status: 'active',
      grade,
      subject: 'Toán',
      topic: 'Ôn tập tổng hợp',
      skill: 'Kiểm tra nhanh',
      order: 10,
      data: {
        sourceKey: staticKey([grade, 'test-template', 'practice']),
        description: 'Mẫu bài kiểm tra nhanh đọc từ question bank và CMS question pool.',
        questionCount: 10,
        timerMinutes: 10,
        passScore: 70,
        randomize: true,
        syncedAt: now
      }
    }),
    makeSeedItem({
      module: 'reports',
      type: 'export-template',
      title: `Mẫu báo cáo phụ huynh ${gradeLabel(grade)}`,
      status: 'active',
      grade,
      order: 10,
      data: {
        sourceKey: staticKey([grade, 'report-template', 'parent-summary']),
        description: 'Mẫu xuất báo cáo tiến độ cho phụ huynh.',
        reportScope: 'student-progress',
        cadence: 'weekly',
        exportFormat: 'pdf,csv',
        syncedAt: now
      }
    }),
    makeSeedItem({
      module: 'ai-studio',
      type: 'question-generator',
      title: `Prompt tạo câu hỏi ${gradeLabel(grade)}`,
      status: 'active',
      grade,
      order: 10,
      data: {
        sourceKey: staticKey([grade, 'ai-template', 'question-generator']),
        description: 'Prompt nền để sinh câu hỏi theo lớp, thế giới và ải.',
        prompt: `Tạo câu hỏi cho học sinh ${gradeLabel(grade)}, văn phong ngắn gọn, vui vẻ, đúng chương trình.`,
        outputCount: 5,
        tone: 'Thân thiện, rõ ràng, phù hợp học sinh lớp 1',
        syncedAt: now
      }
    })
  ]
}

function buildContentTypeDefinitionItems() {
  return Object.entries(CONTENT_TYPE_DEFINITIONS).map(([key, definition], index) => {
    const [module, type] = key.split(':')
    return makeSeedItem({
      module: CMS_SYSTEM_MODULE,
      type: 'content-type',
      title: definition.label,
      status: 'active',
      order: index + 1,
      data: {
        sourceKey: `content-type:${key}`,
        key,
        module,
        type,
        label: definition.label,
        required: definition.required,
        fields: definition.fields,
        description: `Content type definition for ${definition.label}`,
        syncedAt: new Date().toISOString()
      }
    })
  })
}

async function seedContentTypeDefinitions() {
  const desiredItems = buildContentTypeDefinitionItems()
  const result = await createMissingSeedItems(desiredItems, [CMS_SYSTEM_MODULE])

  return {
    message: result.count
      ? `Đã seed ${result.count} content type definitions`
      : 'Content type definitions đã sẵn sàng',
    count: result.count,
    skipped: result.skipped,
    total: result.total
  }
}

async function modernizeCmsGovernance() {
  const items = await prisma.adminCmsItem.findMany({
    where: { module: { not: CMS_SYSTEM_MODULE } },
    orderBy: [{ createdAt: 'asc' }]
  })
  const targets = items.filter(item => {
    const data = item.data || {}
    return !data.slug || !data.version || !data.workflowStatus || !data.governance || !data.seo
  })

  let updated = 0
  for (const item of targets) {
    const governedData = enrichCmsData({
      current: {
        ...item,
        data: {
          ...(item.data || {}),
          slug: item.data?.slug || createSlug(item.title, item.id),
          version: item.data?.version || 0
        }
      },
      payload: {
        ...item,
        data: item.data || {}
      },
      action: 'modernize',
      actor: 'admin'
    })

    await prisma.adminCmsItem.update({
      where: { id: item.id },
      data: { data: governedData }
    })
    updated += 1
  }

  return {
    message: updated ? `Đã modernize governance cho ${updated} CMS records` : 'Tất cả CMS records đã có governance metadata',
    count: updated,
    total: items.length
  }
}

async function createCmsQualityReport() {
  const items = await prisma.adminCmsItem.findMany({
    where: { module: { not: CMS_SYSTEM_MODULE } },
    orderBy: [{ module: 'asc' }, { type: 'asc' }, { order: 'asc' }]
  })
  const checks = items.map(item => {
    const validation = validateCmsPayload(item)
    const data = item.data || {}
    const warnings = [
      !data.slug ? 'missing-slug' : '',
      !data.seo?.title ? 'missing-seo-title' : '',
      !data.workflowStatus ? 'missing-workflow-status' : '',
      !data.version ? 'missing-version' : '',
      validation.valid ? '' : `missing-required:${validation.missing.join('|')}`
    ].filter(Boolean)

    return {
      id: item.id,
      module: item.module,
      type: item.type,
      title: item.title,
      status: item.status,
      warnings
    }
  })
  const issues = checks.filter(check => check.warnings.length > 0)
  const score = checks.length ? clampPercent(((checks.length - issues.length) / checks.length) * 100) : 100
  const report = await prisma.adminCmsItem.create({
    data: {
      module: 'reports',
      type: 'cms-quality-report',
      title: `CMS Quality Report ${new Date().toLocaleDateString('vi-VN')}`,
      status: 'active',
      order: 0,
      data: normalizeData({
        description: 'Báo cáo chất lượng CMS theo chuẩn modern CMS.',
        score,
        totalItems: checks.length,
        issueCount: issues.length,
        issues: issues.slice(0, 100),
        generatedAt: new Date().toISOString()
      })
    }
  })

  return {
    message: `CMS quality score ${score}% (${issues.length}/${checks.length} items cần rà soát)`,
    count: issues.length,
    item: serializeItem(report)
  }
}

function buildStaticCurriculumItems(gradeSlug, status) {
  const gradeData = getGradeData(gradeSlug)
  const worlds = gradeData.WORLDS || []
  const label = gradeLabel(gradeSlug)
  const subjects = unique(worlds.map(world => subjectForWorld(world.id)))
  const now = new Date().toISOString()
  const items = [
    makeSeedItem({
      module: 'content',
      type: 'grade',
      title: label,
      status,
      grade: gradeSlug,
      order: 1,
      data: {
        sourceKey: staticKey([gradeSlug, 'grade']),
        label,
        description: `Chương trình học ${label} đang dùng trên Học Vui.`,
        syncedAt: now,
        worldCount: worlds.length,
        levelCount: worlds.reduce((sum, world) => sum + (world.levels?.length || 0), 0)
      }
    })
  ]

  subjects.forEach((subject, index) => {
    items.push(makeSeedItem({
      module: 'content',
      type: 'subject',
      title: subject,
      status,
      grade: gradeSlug,
      subject,
      order: 10 + index,
      data: {
        sourceKey: staticKey([gradeSlug, 'subject', subject]),
        description: `${subject} trong chương trình ${label}.`,
        syncedAt: now
      }
    }))
  })

  worlds.forEach((world, worldIndex) => {
    const subject = subjectForWorld(world.id)
    const worldOrder = (worldIndex + 1) * 100
    const questionCount = countStaticQuestions(gradeData, world.id)

    items.push(makeSeedItem({
      module: 'content',
      type: 'topic',
      title: world.name,
      status,
      grade: gradeSlug,
      subject,
      topic: world.name,
      order: worldOrder,
      data: {
        sourceKey: staticKey([gradeSlug, `w${world.id}`, 'topic']),
        worldId: world.id,
        icon: world.icon,
        description: world.desc,
        syncedAt: now,
        levelCount: world.levels?.length || 0,
        questionCount
      }
    }))

    items.push(makeSeedItem({
      module: 'learning-map',
      type: 'world',
      title: world.name,
      status,
      grade: gradeSlug,
      subject,
      topic: world.name,
      order: worldOrder,
      data: {
        sourceKey: staticKey([gradeSlug, `w${world.id}`, 'world']),
        worldId: world.id,
        icon: world.icon,
        description: world.desc,
        color: world.color,
        textColor: world.textColor,
        bgColor: world.bgColor,
        borderColor: world.borderColor,
        medal: world.medal,
        medalName: world.medalName,
        bossName: world.bossName,
        bossDesc: world.bossDesc,
        bossGame: world.bossGame,
        syncedAt: now,
        levelCount: world.levels?.length || 0,
        questionCount
      }
    }))

    items.push(makeSeedItem({
      module: 'learning-map',
      type: 'boss',
      title: world.bossName || `Boss ${world.name}`,
      status,
      grade: gradeSlug,
      subject,
      topic: world.name,
      difficulty: 'boss',
      order: worldOrder + 99,
      data: {
        sourceKey: staticKey([gradeSlug, `w${world.id}`, 'boss']),
        worldId: world.id,
        token: `w${world.id}-boss`,
        description: world.bossDesc,
        game: world.bossGame,
        gameRoute: world.bossGame,
        medal: world.medal,
        medalName: world.medalName,
        syncedAt: now,
        questionCount
      }
    }))

    items.push(makeSeedItem({
      module: 'achievements',
      type: 'medal',
      title: world.medalName || `Huy chương ${world.name}`,
      status,
      grade: gradeSlug,
      subject,
      topic: world.name,
      order: worldOrder,
      data: {
        sourceKey: staticKey([gradeSlug, `w${world.id}`, 'medal']),
        worldId: world.id,
        icon: world.medal,
        unlockCondition: `Hoàn thành boss w${world.id}-boss`,
        description: `Phần thưởng khi hoàn thành ${world.name}.`,
        syncedAt: now
      }
    }))

    ;(world.levels || []).forEach((level, levelIndex) => {
      const levelOrder = worldOrder + levelIndex + 1
      const gameSlug = normalizedGameRoute(level.game)
      const levelQuestionCount = countStaticQuestions(gradeData, world.id, level.id)

      items.push(makeSeedItem({
        module: 'content',
        type: 'skill',
        title: level.title,
        status,
        grade: gradeSlug,
        subject,
        topic: world.name,
        skill: level.title,
        difficulty: level.stages > 5 ? 'medium' : 'easy',
        order: levelOrder,
        data: {
          sourceKey: staticKey([gradeSlug, `w${world.id}`, `l${level.id}`, 'skill']),
          worldId: world.id,
          levelId: level.id,
          token: `w${world.id}-l${level.id}`,
          description: level.desc,
          stages: level.stages,
          syncedAt: now,
          questionCount: levelQuestionCount
        }
      }))

      items.push(makeSeedItem({
        module: 'content',
        type: 'lesson',
        title: level.title,
        status,
        grade: gradeSlug,
        subject,
        topic: world.name,
        skill: level.title,
        difficulty: level.stages > 5 ? 'medium' : 'easy',
        order: levelOrder,
        data: {
          sourceKey: staticKey([gradeSlug, `w${world.id}`, `l${level.id}`, 'lesson']),
          worldId: world.id,
          levelId: level.id,
          token: `w${world.id}-l${level.id}`,
          description: level.desc,
          content: `${level.title}: ${level.desc}`,
          game: level.game,
          miniGame: gameSlug,
          estimatedMinutes: String(Math.max(5, level.stages || 5)),
          syncedAt: now,
          questionCount: levelQuestionCount
        }
      }))

      items.push(makeSeedItem({
        module: 'learning-map',
        type: 'level',
        title: level.title,
        status,
        grade: gradeSlug,
        subject,
        topic: world.name,
        skill: level.title,
        difficulty: level.stages > 5 ? 'medium' : 'easy',
        order: levelOrder,
        data: {
          sourceKey: staticKey([gradeSlug, `w${world.id}`, `l${level.id}`, 'level']),
          worldId: world.id,
          levelId: level.id,
          token: `w${world.id}-l${level.id}`,
          description: level.desc,
          stages: level.stages,
          game: level.game,
          gameRoute: level.game,
          questionPool: staticKey([gradeSlug, `w${world.id}`, `l${level.id}`, 'pool']),
          xp: 10,
          coin: 5,
          stars: 3,
          syncedAt: now,
          questionCount: levelQuestionCount
        }
      }))

      items.push(makeSeedItem({
        module: 'games',
        type: 'question-pool',
        title: `${level.title} - Question Pool`,
        status,
        grade: gradeSlug,
        subject,
        topic: world.name,
        skill: level.title,
        difficulty: level.stages > 5 ? 'medium' : 'easy',
        order: levelOrder,
        data: {
          sourceKey: staticKey([gradeSlug, `w${world.id}`, `l${level.id}`, 'pool']),
          worldId: world.id,
          levelId: level.id,
          game: gameSlug,
          gameRoute: level.game,
          description: `Pool metadata cho ${level.title}. Câu hỏi thật hiện lấy từ static bank, CustomQuestion và CMS question records.`,
          syncedAt: now,
          questionCount: levelQuestionCount
        }
      }))
    })
  })

  const games = [
    ['choose-1-of-2', 'Choose 1 of 2', '/game-choose-1-of-2', 'choose'],
    ['listen-and-select', 'Listen & Select', '/game-listen-and-select', 'listen'],
    ['simple-matching', 'Simple Matching', '/game-simple-matching', 'matching']
  ]
  games.forEach(([slug, title, route, questionType], index) => {
    items.push(makeSeedItem({
      module: 'games',
      type: 'game-config',
      title,
      status,
      grade: gradeSlug,
      order: 10 + index,
      data: {
        sourceKey: staticKey([gradeSlug, 'game', slug]),
        gameSlug: slug,
        gameRoute: route,
        questionType,
        rewardRule: 'Hoàn thành màn chơi nhận sao, coin và cập nhật tiến độ.',
        syncedAt: now
      }
    }))
  })

  return items
}

function serializeItem(item) {
  return {
    ...item,
    data: item.data || {},
    createdAt: item.createdAt?.toISOString?.() || item.createdAt,
    updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt
  }
}

function countBy(items, field) {
  return items.reduce((acc, item) => {
    const key = normalizeString(item[field]) || 'unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

function countTypes(items, types) {
  return types.reduce((acc, type) => {
    acc[type] = items.filter(item => item.type === type).length
    return acc
  }, {})
}

function averageDataField(items, field) {
  const values = items
    .map(item => toNumber(item.data?.[field]))
    .filter(value => value > 0)

  if (!values.length) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function getCurriculumBaseline() {
  return GRADE_SLUGS.reduce((acc, slug) => {
    try {
      const grade = getGradeData(slug)
      const worlds = grade.WORLDS || []
      acc.worlds += worlds.length
      acc.levels += worlds.reduce((sum, world) => sum + (world.levels?.length || 0), 0)
      acc.questions += (grade.CHOOSE_QUESTIONS || []).length
      acc.questions += (grade.LISTEN_QUESTIONS || []).length
      acc.questions += (grade.MATCHING_PAIRS_ALL || []).length
    } catch {
      // Missing grade data should not block the admin CMS payload.
    }
    return acc
  }, { worlds: 0, levels: 0, questions: 0 })
}

function buildRewardMeters(items) {
  return [
    { label: 'XP per level', value: clampPercent(averageDataField(items, 'xp')) },
    { label: 'Coins per win', value: clampPercent(averageDataField(items, 'coin')) },
    { label: 'Stars threshold', value: clampPercent(averageDataField(items, 'stars')) }
  ]
}

function buildFocusFromProgress(completionByWorld) {
  if (!completionByWorld.length) {
    return { label: 'Chưa có dữ liệu tiến độ', value: 0 }
  }

  const weakest = completionByWorld.reduce((min, item) => (
    item.percent < min.percent ? item : min
  ), completionByWorld[0])

  return {
    label: `${weakest.label} cần hỗ trợ`,
    value: Math.max(0, 100 - toNumber(weakest.percent))
  }
}

function hasWorldProgress(completedLevels, worldId) {
  const tokens = String(completedLevels || '')
    .split(',')
    .map(token => token.trim())
    .filter(Boolean)

  if (worldId === 1 && tokens.some(token => /^\d+$/.test(token))) {
    return true
  }

  return tokens.some(token => token.startsWith(`w${worldId}-`))
}

function buildModuleMetrics(config, items, context) {
  const statusCounts = countBy(items, 'status')
  const typeCounts = countTypes(items, config.primaryTypes)
  const baseline = config.key === 'curriculum' || config.key === 'learningMap'
    ? getCurriculumBaseline()
    : { worlds: 0, levels: 0, questions: 0 }
  const mediaWithUrls = items.filter(item => item.data?.fileUrl || item.data?.mediaUrl || item.data?.audioUrl || item.data?.imageUrl).length

  return {
    totalItems: items.length,
    activeItems: statusCounts.active || 0,
    draftItems: statusCounts.draft || 0,
    disabledItems: statusCounts.disabled || 0,
    archivedItems: statusCounts.archived || 0,
    typeCounts,
    statusCounts,
    totalParents: context.totalParents,
    totalStudents: context.totalStudents,
    totalQuestions: baseline.questions + context.totalCustomQuestions,
    totalCustomQuestions: context.totalCustomQuestions,
    totalStars: context.totalStars,
    avgStreak: context.avgStreak,
    active7Days: context.active7Days,
    active30Days: context.active30Days,
    curriculumWorlds: baseline.worlds,
    curriculumLevels: baseline.levels,
    rewardMeters: buildRewardMeters(items),
    storageUsagePercent: items.length ? clampPercent((mediaWithUrls / items.length) * 100) : 0,
    configuredSettings: items.filter(item => item.status === 'active').length,
    recentUpdatedAt: items[0]?.updatedAt?.toISOString?.() || null
  }
}

function activeItemCount(items) {
  return items.filter(item => item.status === 'active').length
}

function buildModuleHealth(config, items) {
  const total = items.length
  const draft = items.filter(item => item.status === 'draft').length
  const active = activeItemCount(items)
  const archived = items.filter(item => item.status === 'archived').length
  const missingMeta = items.filter(item => (
    !normalizeString(item.title) ||
    !normalizeString(item.data?.description || item.data?.content)
  )).length

  return {
    score: total ? clampPercent(((active * 2) + (total - missingMeta)) / (total * 3) * 100) : 0,
    total,
    active,
    draft,
    archived,
    missingMeta,
    recommendation: draft > 0
      ? `Có ${draft} bản nháp cần duyệt trong ${config.title}.`
      : missingMeta > 0
        ? `Có ${missingMeta} mục thiếu mô tả/nội dung trong ${config.title}.`
        : `${config.title} đang ổn định.`
  }
}

function buildCompletionByWorld(progresses, totalStudents) {
  return [1, 2, 3].map(worldId => {
    const completedProfiles = progresses.filter(progress => hasWorldProgress(progress.completedLevels, worldId)).length
    return {
      label: `World ${worldId}`,
      percent: totalStudents ? Math.round((completedProfiles / totalStudents) * 100) : 0,
      completedProfiles
    }
  })
}

export function resolveAdminModule(value) {
  const moduleKey = normalizeString(value)
  const config = MODULE_DEFINITIONS.find(item => (
    item.key === moduleKey || item.module === moduleKey || item.aliases.includes(moduleKey)
  ))

  if (!config) {
    throw httpError(`Unknown admin module: ${moduleKey || '(empty)'}`, 400)
  }

  return config
}

export function getAdminModuleAliases(value) {
  return resolveAdminModule(value).aliases
}

export function getPrimaryAdminModule(value) {
  return resolveAdminModule(value).module
}

export async function getAdminModulePayload(moduleKey) {
  const config = resolveAdminModule(moduleKey)
  const where = { module: { in: config.aliases } }

  const [
    items,
    totalParents,
    totalStudents,
    totalCustomQuestions,
    progressStats,
    progresses,
    latestStudents,
    latestQuestions
  ] = await Promise.all([
    prisma.adminCmsItem.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }]
    }),
    prisma.parent.count(),
    prisma.childProfile.count(),
    prisma.customQuestion.count(),
    prisma.progress.aggregate({ _sum: { stars: true }, _avg: { streak: true } }),
    prisma.progress.findMany({ select: { completedLevels: true, updatedAt: true } }),
    prisma.childProfile.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        parent: { select: { email: true } },
        progress: true
      }
    }),
    prisma.customQuestion.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        q: true,
        grade: true,
        subject: true,
        topic: true,
        worldId: true,
        levelId: true,
        createdAt: true
      }
    })
  ])

  const active7Days = progresses.filter(progress => progress.updatedAt >= daysAgo(7)).length
  const active30Days = progresses.filter(progress => progress.updatedAt >= daysAgo(30)).length
  const completionByWorld = buildCompletionByWorld(progresses, totalStudents)
  const context = {
    totalParents,
    totalStudents,
    totalCustomQuestions,
    totalStars: progressStats._sum.stars || 0,
    avgStreak: Math.round(progressStats._avg.streak || 0),
    active7Days,
    active30Days
  }

  return {
    key: config.key,
    module: config.module,
    modules: config.aliases,
    title: config.title,
    metrics: buildModuleMetrics(config, items, context),
    counts: {
      byType: countBy(items, 'type'),
      byStatus: countBy(items, 'status'),
      byGrade: countBy(items, 'grade'),
      bySubject: countBy(items, 'subject')
    },
    items: items.map(serializeItem),
    recentItems: items.slice(0, 8).map(serializeItem),
    health: buildModuleHealth(config, items),
    focus: buildFocusFromProgress(completionByWorld),
    related: {
      students: latestStudents.map(student => ({
        id: student.id,
        name: student.name,
        grade: student.grade,
        avatar: student.avatar,
        parentEmail: student.parent?.email || '',
        stars: student.progress?.stars || 0,
        streak: student.progress?.streak || 0
      })),
      questions: latestQuestions.map(question => ({
        ...question,
        createdAt: question.createdAt?.toISOString?.() || question.createdAt
      })),
      progress: {
        totalStars: context.totalStars,
        avgStreak: context.avgStreak,
        active7Days,
        active30Days,
        completionByWorld
      }
    },
    actions: unique([
      'complete-cms-bootstrap',
      'seed-content-types',
      'modernize-cms-governance',
      'create-cms-quality-report',
      'create-from-template',
      'duplicate-item',
      'publish-item',
      'archive-item',
      'publish-all-drafts',
      'archive-disabled',
      ['curriculum', 'learningMap', 'games', 'achievements'].includes(config.key) ? 'sync-static-curriculum' : '',
      config.key === 'assignments' ? 'create-assignment-plan' : '',
      config.key === 'tests' ? 'create-test-blueprint' : '',
      config.key === 'reports' ? 'create-report-snapshot' : '',
      config.key === 'media' ? 'seed-media-library' : '',
      config.key === 'settings' ? 'seed-default-settings' : '',
      config.key === 'achievements' ? 'generate-achievement-rules' : '',
      config.key === 'aiGenerator' ? 'generate-ai-draft' : ''
    ])
  }
}

async function getScopedItem(id, config) {
  const itemId = normalizeString(id)
  if (!itemId) throw httpError('id is required', 400)

  const item = await prisma.adminCmsItem.findUnique({ where: { id: itemId } })
  if (!item) throw httpError('CMS item not found', 404)
  if (!config.aliases.includes(item.module)) {
    throw httpError(`CMS item does not belong to ${config.title}`, 403)
  }

  return item
}

function buildCmsCreateData(config, body) {
  const type = normalizeString(body.type) || config.primaryTypes[0] || 'item'
  const title = normalizeString(body.title)

  if (!title) throw httpError('title is required', 400)

  return {
    module: getPrimaryAdminModule(body.module || config.module),
    type,
    title,
    status: normalizeString(body.status) || 'draft',
    grade: normalizeString(body.grade) || null,
    subject: normalizeString(body.subject) || null,
    topic: normalizeString(body.topic) || null,
    skill: normalizeString(body.skill) || null,
    difficulty: normalizeString(body.difficulty) || null,
    order: Number.parseInt(body.order, 10) || 0,
    data: normalizeData(body.data)
  }
}

async function syncStaticCurriculum(body) {
  const grade = normalizeString(body.grade) || 'lop-1'
  const status = normalizeString(body.status) || 'active'
  const desiredItems = buildStaticCurriculumItems(grade, status)
  const modules = unique(desiredItems.map(item => item.module))
  const result = await createMissingSeedItems(desiredItems, modules)

  return {
    message: result.count
      ? `Đã đồng bộ ${result.count} CMS records cho ${gradeLabel(grade)}`
      : `${gradeLabel(grade)} đã có đủ CMS records từ chương trình hiện tại`,
    count: result.count,
    skipped: result.skipped,
    total: result.total,
    modules
  }
}

async function createAssignmentPlan(body) {
  const grade = normalizeString(body.grade) || 'lop-1'
  const gradeLabelValue = gradeLabel(grade)
  const students = await prisma.childProfile.findMany({
    where: { OR: [{ grade }, { grade: gradeLabelValue }] },
    take: 80,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, grade: true }
  })
  const lesson = await prisma.adminCmsItem.findFirst({
    where: {
      module: { in: ['content', 'curriculum'] },
      status: 'active',
      grade: { in: [grade, gradeLabelValue] },
      type: { in: ['lesson', 'skill', 'topic'] }
    },
    orderBy: [{ updatedAt: 'desc' }, { order: 'asc' }]
  })

  const item = await prisma.adminCmsItem.create({
    data: {
      module: 'assignments',
      type: 'assignment',
      title: normalizeString(body.title) || `Bài tập nhanh ${gradeLabelValue}`,
      status: 'active',
      grade,
      subject: lesson?.subject || 'Toán',
      topic: lesson?.topic || lesson?.title || 'Ôn tập',
      skill: lesson?.skill || lesson?.title || 'Luyện tập',
      difficulty: 'easy',
      order: 0,
      data: normalizeData({
        description: `Bài tập tạo nhanh từ CMS cho ${students.length} học sinh ${gradeLabelValue}.`,
        targetProfileIds: students.map(student => student.id),
        targetStudentNames: students.map(student => student.name),
        sourceLessonId: lesson?.id || null,
        sourceLessonTitle: lesson?.title || null,
        deadline: body.deadline || null,
        scoringRule: 'Hoàn thành bài luyện và cập nhật progress/stars theo game.',
        createdByAction: 'create-assignment-plan',
        createdAt: new Date().toISOString()
      })
    }
  })

  return { message: `Đã tạo bài tập cho ${students.length} học sinh`, item: serializeItem(item) }
}

async function createTestBlueprint(body) {
  const grade = normalizeString(body.grade) || 'lop-1'
  const world = Number.parseInt(body.world || '1', 10) || 1
  const level = Number.parseInt(body.level || '1', 10) || 1
  const customQuestions = await prisma.customQuestion.findMany({
    where: { grade, worldId: world, levelId: level },
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: { id: true, q: true, subject: true, topic: true, type: true, difficulty: true }
  })
  const gradeData = getGradeData(grade)
  const worldData = (gradeData.WORLDS || []).find(item => item.id === world)
  const levelData = worldData?.levels?.find(item => item.id === level)
  const item = await prisma.adminCmsItem.create({
    data: {
      module: 'tests',
      type: 'quiz',
      title: normalizeString(body.title) || `Quiz ${gradeLabel(grade)} W${world}-L${level}`,
      status: 'draft',
      grade,
      subject: customQuestions[0]?.subject || subjectForWorld(world),
      topic: levelData?.title || worldData?.name || 'Kiểm tra nhanh',
      skill: levelData?.title || null,
      difficulty: customQuestions.some(question => question.difficulty === 'hard') ? 'medium' : 'easy',
      order: world * 100 + level,
      data: normalizeData({
        description: `Đề kiểm tra nháp từ question bank và chương trình hiện có.`,
        worldId: world,
        levelId: level,
        questionCount: customQuestions.length || countStaticQuestions(gradeData, world, level),
        customQuestionIds: customQuestions.map(question => question.id),
        customQuestionPreview: customQuestions.slice(0, 5).map(question => question.q),
        timerMinutes: body.timerMinutes || 10,
        passScore: body.passScore || 70,
        randomize: true,
        createdByAction: 'create-test-blueprint',
        createdAt: new Date().toISOString()
      })
    }
  })

  return { message: 'Đã tạo quiz blueprint từ ngân hàng câu hỏi', item: serializeItem(item) }
}

async function createReportSnapshot() {
  const [
    totalParents,
    totalStudents,
    totalQuestions,
    progressStats,
    activeCms,
    draftCms
  ] = await Promise.all([
    prisma.parent.count(),
    prisma.childProfile.count(),
    prisma.customQuestion.count(),
    prisma.progress.aggregate({ _sum: { stars: true }, _avg: { streak: true } }),
    prisma.adminCmsItem.count({ where: { status: 'active' } }),
    prisma.adminCmsItem.count({ where: { status: 'draft' } })
  ])

  const item = await prisma.adminCmsItem.create({
    data: {
      module: 'reports',
      type: 'system-snapshot',
      title: `System Snapshot ${new Date().toLocaleDateString('vi-VN')}`,
      status: 'active',
      order: 0,
      data: normalizeData({
        description: 'Ảnh chụp dữ liệu hệ thống tại thời điểm tạo báo cáo.',
        totalParents,
        totalStudents,
        totalQuestions,
        totalStars: progressStats._sum.stars || 0,
        avgStreak: Math.round(progressStats._avg.streak || 0),
        activeCms,
        draftCms,
        capturedAt: new Date().toISOString()
      })
    }
  })

  return { message: 'Đã tạo snapshot báo cáo hệ thống', item: serializeItem(item) }
}

async function seedMediaLibrary(body) {
  const grade = normalizeString(body.grade) || 'lop-1'
  const now = new Date().toISOString()
  const desiredItems = [
    makeSeedItem({
      module: 'media',
      type: 'folder',
      title: 'Audio Tiếng Việt',
      status: 'active',
      grade,
      subject: 'Tiếng Việt',
      order: 10,
      data: {
        sourceKey: staticKey([grade, 'media', 'audio-tv']),
        description: 'Thư mục audio phát âm cho Listen & Select.',
        folder: 'audio/tieng-viet',
        syncedAt: now
      }
    }),
    makeSeedItem({
      module: 'media',
      type: 'folder',
      title: 'Hình minh họa bài học',
      status: 'active',
      grade,
      order: 20,
      data: {
        sourceKey: staticKey([grade, 'media', 'lesson-images']),
        description: 'Thư mục ảnh dùng trong lesson, game và reward.',
        folder: 'images/lessons',
        syncedAt: now
      }
    }),
    makeSeedItem({
      module: 'media',
      type: 'mascot',
      title: 'Mascot Học Vui',
      status: 'active',
      grade,
      order: 30,
      data: {
        sourceKey: staticKey([grade, 'media', 'mascot']),
        description: 'Mascot mặc định dùng trong feedback và dashboard.',
        altText: 'Mascot Học Vui',
        syncedAt: now
      }
    })
  ]
  const result = await createMissingSeedItems(desiredItems, ['media'])

  return {
    message: result.count ? `Đã seed ${result.count} media records` : 'Media library đã có seed records',
    count: result.count
  }
}

async function seedDefaultSettings() {
  const now = new Date().toISOString()
  const desiredItems = [
    makeSeedItem({
      module: 'settings',
      type: 'website',
      title: 'Website Identity',
      status: 'active',
      order: 10,
      data: {
        sourceKey: 'settings:website-identity',
        settingKey: 'website.identity',
        settingValue: 'Học Vui',
        description: 'Tên, nhận diện và trạng thái cơ bản của website.',
        syncedAt: now
      }
    }),
    makeSeedItem({
      module: 'settings',
      type: 'gamification',
      title: 'Gamification Defaults',
      status: 'active',
      order: 20,
      data: {
        sourceKey: 'settings:gamification-defaults',
        settingKey: 'gamification.defaults',
        settingValue: JSON.stringify({ starsPerLevel: 3, xpPerLevel: 10, coinPerLevel: 5 }),
        description: 'Cấu hình thưởng mặc định cho game.',
        syncedAt: now
      }
    }),
    makeSeedItem({
      module: 'settings',
      type: 'security',
      title: 'Admin Session Policy',
      status: 'active',
      order: 30,
      data: {
        sourceKey: 'settings:admin-session-policy',
        settingKey: 'security.adminSession',
        settingValue: '7 days',
        description: 'Chính sách phiên đăng nhập admin hiện tại.',
        syncedAt: now
      }
    })
  ]
  const result = await createMissingSeedItems(desiredItems, ['settings', 'roles'])

  return {
    message: result.count ? `Đã seed ${result.count} settings records` : 'Settings mặc định đã sẵn sàng',
    count: result.count
  }
}

async function generateAchievementRules(body) {
  const grade = normalizeString(body.grade) || 'lop-1'
  const rules = [
    ['badge', 'Chăm học 3 ngày', 'Hoàn thành streak 3 ngày', 3],
    ['badge', 'Chăm học 7 ngày', 'Hoàn thành streak 7 ngày', 7],
    ['reward', 'Siêu sao 30 sao', 'Đạt tổng 30 sao', 30]
  ]
  const desiredItems = rules.map(([type, title, condition, threshold], index) => ({
      module: 'achievements',
      type,
      title,
      status: 'draft',
      grade,
      order: 500 + index,
      data: normalizeData({
        source: STATIC_SYNC_SOURCE,
        sourceKey: staticKey([grade, 'achievement-rule', type, threshold]),
        description: condition,
        unlockCondition: condition,
        threshold,
        generatedAt: new Date().toISOString(),
        createdByAction: 'generate-achievement-rules'
      })
    }))
  const result = await createMissingSeedItems(desiredItems, ['achievements'])

  return { message: `Đã tạo ${result.count} achievement rules dạng draft`, count: result.count }
}

async function seedOperationalTemplates(body) {
  const grade = normalizeString(body.grade) || 'lop-1'
  const desiredItems = buildOperationalTemplateItems(grade)
  const result = await createMissingSeedItems(desiredItems)

  return {
    message: result.count
      ? `Đã seed ${result.count} workflow templates`
      : 'Workflow templates đã sẵn sàng',
    count: result.count,
    skipped: result.skipped,
    total: result.total
  }
}

async function completeCmsBootstrap(body) {
  const grade = normalizeString(body.grade) || 'lop-1'
  const results = await Promise.all([
    syncStaticCurriculum({ ...body, grade, status: 'active' }),
    seedMediaLibrary({ ...body, grade }),
    seedDefaultSettings(body),
    generateAchievementRules({ ...body, grade }),
    seedOperationalTemplates({ ...body, grade }),
    seedContentTypeDefinitions(),
    modernizeCmsGovernance()
  ])
  const count = results.reduce((sum, result) => sum + (result.count || 0), 0)

  return {
    message: count
      ? `Đã hoàn thiện CMS: thêm ${count} records nền cho ${gradeLabel(grade)}`
      : `CMS ${gradeLabel(grade)} đã đủ records nền`,
    count,
    results
  }
}

export async function runAdminModuleAction(body) {
  const action = normalizeString(body.action)
  const config = resolveAdminModule(body.module || body.moduleKey)

  if (action === 'complete-cms-bootstrap') {
    return completeCmsBootstrap(body)
  }

  if (action === 'seed-content-types') {
    return seedContentTypeDefinitions()
  }

  if (action === 'modernize-cms-governance') {
    return modernizeCmsGovernance()
  }

  if (action === 'create-cms-quality-report') {
    return createCmsQualityReport()
  }

  if (action === 'sync-static-curriculum') {
    if (!['curriculum', 'learningMap', 'games', 'achievements'].includes(config.key)) {
      throw httpError('Module này không hỗ trợ đồng bộ chương trình tĩnh', 400)
    }

    return syncStaticCurriculum(body)
  }

  if (action === 'publish-all-drafts') {
    const updated = await prisma.adminCmsItem.updateMany({
      where: {
        module: { in: config.aliases },
        status: 'draft'
      },
      data: { status: 'active' }
    })

    return { message: `Đã xuất bản ${updated.count} bản nháp trong ${config.title}`, count: updated.count }
  }

  if (action === 'archive-disabled') {
    const updated = await prisma.adminCmsItem.updateMany({
      where: {
        module: { in: config.aliases },
        status: 'disabled'
      },
      data: { status: 'archived' }
    })

    return { message: `Đã lưu trữ ${updated.count} item disabled trong ${config.title}`, count: updated.count }
  }

  if (action === 'create-assignment-plan') {
    if (config.key !== 'assignments') throw httpError('Action chỉ dùng cho Assignments', 400)
    return createAssignmentPlan(body)
  }

  if (action === 'create-test-blueprint') {
    if (config.key !== 'tests') throw httpError('Action chỉ dùng cho Tests', 400)
    return createTestBlueprint(body)
  }

  if (action === 'create-report-snapshot') {
    if (config.key !== 'reports') throw httpError('Action chỉ dùng cho Reports', 400)
    return createReportSnapshot(body)
  }

  if (action === 'seed-media-library') {
    if (config.key !== 'media') throw httpError('Action chỉ dùng cho Media Library', 400)
    return seedMediaLibrary(body)
  }

  if (action === 'seed-default-settings') {
    if (config.key !== 'settings') throw httpError('Action chỉ dùng cho Settings', 400)
    return seedDefaultSettings(body)
  }

  if (action === 'generate-achievement-rules') {
    if (config.key !== 'achievements') throw httpError('Action chỉ dùng cho Achievements', 400)
    return generateAchievementRules(body)
  }

  if (action === 'duplicate-item') {
    const source = await getScopedItem(body.id || body.itemId, config)
    const item = await prisma.adminCmsItem.create({
      data: {
        module: config.module,
        type: source.type,
        title: `${source.title} (copy)`,
        status: 'draft',
        grade: source.grade,
        subject: source.subject,
        topic: source.topic,
        skill: source.skill,
        difficulty: source.difficulty,
        order: source.order + 1,
        data: normalizeData({
          ...(source.data || {}),
          duplicatedFrom: source.id,
          duplicatedAt: new Date().toISOString()
        })
      }
    })

    return { message: 'Đã nhân bản CMS item', item: serializeItem(item) }
  }

  if (['publish-item', 'archive-item', 'disable-item', 'toggle-status'].includes(action)) {
    const source = await getScopedItem(body.id || body.itemId, config)
    const nextStatus = action === 'publish-item'
      ? 'active'
      : action === 'archive-item'
        ? 'archived'
        : action === 'disable-item'
          ? 'disabled'
          : source.status === 'active'
            ? 'draft'
            : 'active'

    const item = await prisma.adminCmsItem.update({
      where: { id: source.id },
      data: { status: nextStatus }
    })

    return { message: `Đã chuyển trạng thái sang ${nextStatus}`, item: serializeItem(item) }
  }

  if (action === 'create-from-template') {
    const item = await prisma.adminCmsItem.create({
      data: buildCmsCreateData(config, body)
    })

    return { message: 'Đã tạo CMS item từ template', item: serializeItem(item) }
  }

  if (action === 'generate-ai-draft') {
    const title = normalizeString(body.title) || `AI draft ${new Date().toLocaleString('vi-VN')}`
    const prompt = normalizeString(body.prompt || body.data?.prompt)
    const item = await prisma.adminCmsItem.create({
      data: {
        module: 'ai-studio',
        type: 'ai-draft',
        title,
        status: 'draft',
        grade: normalizeString(body.grade) || 'lop-1',
        subject: normalizeString(body.subject) || 'Tiếng Việt',
        topic: normalizeString(body.topic) || null,
        skill: normalizeString(body.skill) || null,
        difficulty: normalizeString(body.difficulty) || 'easy',
        data: normalizeData({
          prompt,
          generatedAt: new Date().toISOString(),
          outputMode: normalizeString(body.outputMode) || 'draft-only',
          content: prompt
            ? `Bản nháp được tạo từ prompt: ${prompt}`
            : 'Bản nháp AI đang chờ admin bổ sung prompt và duyệt nội dung.'
        })
      }
    })

    return { message: 'Đã tạo AI draft trong DB', item: serializeItem(item) }
  }

  if (action === 'bulk-import-cms') {
    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw httpError('items must be a non-empty array', 400)
    }

    const created = await prisma.adminCmsItem.createMany({
      data: body.items.map(item => buildCmsCreateData(config, { ...item, module: config.module }))
    })

    return { message: `Đã import ${created.count} CMS items`, count: created.count }
  }

  throw httpError(`Unsupported module action: ${action || '(empty)'}`, 400)
}

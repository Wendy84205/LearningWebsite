export const CMS_SYSTEM_MODULE = 'cms-system'

export const CMS_WORKFLOW_STATUSES = [
  'draft',
  'in_review',
  'scheduled',
  'active',
  'disabled',
  'archived'
]

export const CONTENT_TYPE_DEFINITIONS = {
  'content:lesson': {
    label: 'Lesson',
    required: ['title', 'grade', 'subject', 'topic'],
    fields: ['description', 'content', 'theory', 'example', 'mediaUrl', 'miniGame']
  },
  'learning-map:world': {
    label: 'Learning World',
    required: ['title', 'grade'],
    fields: ['worldId', 'icon', 'description', 'color', 'medal', 'bossName']
  },
  'learning-map:level': {
    label: 'Learning Level',
    required: ['title', 'grade'],
    fields: ['worldId', 'levelId', 'description', 'gameRoute', 'questionPool']
  },
  'games:question-pool': {
    label: 'Question Pool',
    required: ['title', 'grade'],
    fields: ['worldId', 'levelId', 'game', 'questionCount', 'questions']
  },
  'assignments:assignment': {
    label: 'Assignment',
    required: ['title', 'grade'],
    fields: ['targetProfileIds', 'deadline', 'scoringRule']
  },
  'tests:quiz': {
    label: 'Quiz',
    required: ['title', 'grade'],
    fields: ['questionCount', 'timerMinutes', 'passScore', 'randomize']
  },
  'media:image': {
    label: 'Image Asset',
    required: ['title'],
    fields: ['fileUrl', 'altText', 'license', 'tags']
  },
  'media:audio': {
    label: 'Audio Asset',
    required: ['title'],
    fields: ['fileUrl', 'altText', 'license', 'tags']
  },
  'settings:website': {
    label: 'Website Setting',
    required: ['title'],
    fields: ['settingKey', 'settingValue']
  }
}

function normalizeString(value) {
  return String(value || '').trim()
}

function removeVietnameseTone(value) {
  return normalizeString(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, match => (match === 'Đ' ? 'D' : 'd'))
}

export function createSlug(value, fallback = 'cms-item') {
  const slug = removeVietnameseTone(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || fallback
}

export function getContentTypeDefinition(moduleName, type) {
  return CONTENT_TYPE_DEFINITIONS[`${moduleName}:${type}`] || {
    label: type || 'CMS Item',
    required: ['title'],
    fields: ['description', 'content']
  }
}

export function validateCmsPayload(payload) {
  const moduleName = normalizeString(payload.module)
  const type = normalizeString(payload.type)
  const title = normalizeString(payload.title)
  const data = payload.data || {}
  const definition = getContentTypeDefinition(moduleName, type)
  const missing = []

  definition.required.forEach(field => {
    if (field === 'title' && !title) missing.push('title')
    else if (field !== 'title' && !normalizeString(payload[field] ?? data[field])) missing.push(field)
  })

  return {
    valid: missing.length === 0,
    missing,
    definition
  }
}

export function enrichCmsData({ current = null, payload, action = 'save', actor = 'admin' }) {
  const now = new Date().toISOString()
  const previousData = current?.data || {}
  const incomingData = payload.data || {}
  const status = normalizeString(payload.status ?? current?.status) || 'draft'
  const title = normalizeString(payload.title ?? current?.title)
  const slug = createSlug(incomingData.slug || previousData.slug || title, current?.id || 'cms-item')
  const currentVersion = Number(previousData.version || 0)
  const nextVersion = action === 'create' ? 1 : currentVersion + 1
  const scheduledAt = incomingData.scheduledAt || previousData.scheduledAt || null
  const publishedAt = status === 'active'
    ? previousData.publishedAt || now
    : previousData.publishedAt || null

  return {
    ...previousData,
    ...incomingData,
    slug,
    locale: incomingData.locale || previousData.locale || 'vi-VN',
    version: nextVersion,
    workflowStatus: status,
    scheduledAt,
    publishedAt,
    seo: {
      title: incomingData.seo?.title || incomingData.seoTitle || previousData.seo?.title || title,
      description: incomingData.seo?.description || incomingData.seoDescription || previousData.seo?.description || incomingData.description || previousData.description || ''
    },
    governance: {
      ...(previousData.governance || {}),
      lastAction: action,
      updatedBy: actor,
      updatedAt: now,
      createdBy: previousData.governance?.createdBy || actor,
      createdAt: previousData.governance?.createdAt || current?.createdAt?.toISOString?.() || now
    }
  }
}

export function isDeliverableCmsItem(item, now = new Date()) {
  if (!item || item.status !== 'active') return false
  const scheduledAt = item.data?.scheduledAt
  if (!scheduledAt) return true
  const scheduledDate = new Date(scheduledAt)
  return Number.isNaN(scheduledDate.getTime()) || scheduledDate <= now
}

export function buildAuditRecord({ action, item, before = null, after = null, actor = 'admin' }) {
  const now = new Date().toISOString()
  const title = `${action}: ${after?.title || item?.title || before?.title || 'CMS item'}`

  return {
    module: CMS_SYSTEM_MODULE,
    type: 'audit-log',
    title,
    status: 'active',
    grade: after?.grade || item?.grade || before?.grade || null,
    subject: after?.subject || item?.subject || before?.subject || null,
    topic: after?.topic || item?.topic || before?.topic || null,
    skill: after?.skill || item?.skill || before?.skill || null,
    difficulty: null,
    order: 0,
    data: {
      action,
      actor,
      itemId: item?.id || after?.id || before?.id || null,
      module: after?.module || item?.module || before?.module || null,
      type: after?.type || item?.type || before?.type || null,
      before: before ? compactCmsSnapshot(before) : null,
      after: after ? compactCmsSnapshot(after) : null,
      createdAt: now
    }
  }
}

export function buildRevisionRecord({ item, snapshot, action, actor = 'admin' }) {
  const version = Number(snapshot?.data?.version || item?.data?.version || 1)
  return {
    module: CMS_SYSTEM_MODULE,
    type: 'revision',
    title: `${item.title} · v${version}`,
    status: 'active',
    grade: item.grade,
    subject: item.subject,
    topic: item.topic,
    skill: item.skill,
    difficulty: item.difficulty,
    order: version,
    data: {
      itemId: item.id,
      itemModule: item.module,
      itemType: item.type,
      version,
      action,
      actor,
      snapshot: compactCmsSnapshot(snapshot || item),
      createdAt: new Date().toISOString()
    }
  }
}

export function compactCmsSnapshot(item) {
  if (!item) return null
  return {
    id: item.id,
    module: item.module,
    type: item.type,
    title: item.title,
    status: item.status,
    grade: item.grade,
    subject: item.subject,
    topic: item.topic,
    skill: item.skill,
    difficulty: item.difficulty,
    order: item.order,
    data: item.data || {},
    createdAt: item.createdAt?.toISOString?.() || item.createdAt || null,
    updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt || null
  }
}

import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { getAdminModuleAliases } from '@/lib/admin-module-data'
import {
  CMS_SYSTEM_MODULE,
  CMS_WORKFLOW_STATUSES,
  CONTENT_TYPE_DEFINITIONS,
  buildAuditRecord,
  buildRevisionRecord,
  enrichCmsData,
  validateCmsPayload
} from '@/lib/cms-governance'

async function getAdminAccess(request) {
  const session = await getAdminSession(request)
  return session
}

const normalizeString = (value) => String(value || '').trim()

function normalizeData(value) {
  if (!value) return null
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return { note: value }
    }
  }
  return value
}

function serializeItem(item) {
  return {
    ...item,
    data: item.data || {},
    createdAt: item.createdAt?.toISOString?.() || item.createdAt,
    updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt
  }
}

function adminActor(session) {
  return session?.role || 'admin'
}

function moduleAliasesFor(moduleKey) {
  if (moduleKey === CMS_SYSTEM_MODULE || moduleKey === 'system') {
    return [CMS_SYSTEM_MODULE]
  }

  return moduleKey ? getAdminModuleAliases(moduleKey) : []
}

export async function GET(request) {
  const session = await getAdminAccess(request)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const moduleKey = normalizeString(searchParams.get('module'))
    const type = normalizeString(searchParams.get('type'))
    const q = normalizeString(searchParams.get('q')).toLowerCase()
    const historyFor = normalizeString(searchParams.get('historyFor'))
    const contentTypes = searchParams.get('contentTypes') === 'true'

    if (contentTypes) {
      return Response.json({
        contentTypes: CONTENT_TYPE_DEFINITIONS,
        workflowStatuses: CMS_WORKFLOW_STATUSES
      })
    }

    if (historyFor) {
      const [revisions, auditLogs] = await Promise.all([
        prisma.adminCmsItem.findMany({
          where: {
            module: CMS_SYSTEM_MODULE,
            type: 'revision',
            data: { path: ['itemId'], equals: historyFor }
          },
          orderBy: [{ order: 'desc' }, { createdAt: 'desc' }]
        }),
        prisma.adminCmsItem.findMany({
          where: {
            module: CMS_SYSTEM_MODULE,
            type: 'audit-log',
            data: { path: ['itemId'], equals: historyFor }
          },
          orderBy: [{ createdAt: 'desc' }]
        })
      ])

      return Response.json({
        itemId: historyFor,
        revisions: revisions.map(serializeItem),
        auditLogs: auditLogs.map(serializeItem)
      })
    }

    const moduleAliases = moduleAliasesFor(moduleKey)
    const items = await prisma.adminCmsItem.findMany({
      where: {
        ...(moduleKey ? { module: { in: moduleAliases } } : {}),
        ...(!moduleKey ? { module: { not: CMS_SYSTEM_MODULE } } : {}),
        ...(type ? { type } : {})
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })

    const filtered = q
      ? items.filter(item => [
        item.title, item.grade, item.subject, item.topic, item.skill, item.difficulty, item.status
      ].some(value => String(value || '').toLowerCase().includes(q)))
      : items

    return Response.json(filtered.map(serializeItem))
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 })
  }
}

export async function POST(request) {
  const session = await getAdminAccess(request)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const moduleKey = normalizeString(body.module)
    const type = normalizeString(body.type)
    const title = normalizeString(body.title)

    if (!moduleKey || !type || !title) {
      return Response.json({ error: 'module, type and title are required' }, { status: 400 })
    }
    if (body.status && !CMS_WORKFLOW_STATUSES.includes(normalizeString(body.status))) {
      return Response.json({ error: 'Invalid CMS workflow status' }, { status: 400 })
    }

    const validation = validateCmsPayload({ ...body, module: moduleKey, type, title, data: normalizeData(body.data) || {} })
    if (!validation.valid) {
      return Response.json({
        error: `Missing required fields: ${validation.missing.join(', ')}`,
        contentType: validation.definition
      }, { status: 400 })
    }

    const data = enrichCmsData({
      payload: { ...body, module: moduleKey, type, title, data: normalizeData(body.data) || {} },
      action: 'create',
      actor: adminActor(session)
    })

    const item = await prisma.adminCmsItem.create({
      data: {
        module: moduleKey,
        type,
        title,
        status: normalizeString(body.status) || 'draft',
        grade: normalizeString(body.grade) || null,
        subject: normalizeString(body.subject) || null,
        topic: normalizeString(body.topic) || null,
        skill: normalizeString(body.skill) || null,
        difficulty: normalizeString(body.difficulty) || null,
        order: Number.parseInt(body.order, 10) || 0,
        data
      }
    })
    await prisma.adminCmsItem.createMany({
      data: [
        buildRevisionRecord({ item, snapshot: item, action: 'create', actor: adminActor(session) }),
        buildAuditRecord({ action: 'create', item, after: item, actor: adminActor(session) })
      ]
    })

    return Response.json(serializeItem(item), { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request) {
  const session = await getAdminAccess(request)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = normalizeString(body.id)

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 })
    }
    if (body.status && !CMS_WORKFLOW_STATUSES.includes(normalizeString(body.status))) {
      return Response.json({ error: 'Invalid CMS workflow status' }, { status: 400 })
    }

    const before = await prisma.adminCmsItem.findUnique({ where: { id } })
    if (!before) {
      return Response.json({ error: 'CMS item not found' }, { status: 404 })
    }
    const nextPayload = {
      ...before,
      ...body,
      module: body.module !== undefined ? normalizeString(body.module) : before.module,
      type: body.type !== undefined ? normalizeString(body.type) : before.type,
      title: body.title !== undefined ? normalizeString(body.title) : before.title,
      status: body.status !== undefined ? normalizeString(body.status) : before.status,
      grade: body.grade !== undefined ? normalizeString(body.grade) || null : before.grade,
      subject: body.subject !== undefined ? normalizeString(body.subject) || null : before.subject,
      topic: body.topic !== undefined ? normalizeString(body.topic) || null : before.topic,
      skill: body.skill !== undefined ? normalizeString(body.skill) || null : before.skill,
      difficulty: body.difficulty !== undefined ? normalizeString(body.difficulty) || null : before.difficulty,
      order: body.order !== undefined ? Number.parseInt(body.order, 10) || 0 : before.order,
      data: body.data !== undefined ? normalizeData(body.data) || {} : before.data || {}
    }
    const validation = validateCmsPayload(nextPayload)
    if (!validation.valid) {
      return Response.json({
        error: `Missing required fields: ${validation.missing.join(', ')}`,
        contentType: validation.definition
      }, { status: 400 })
    }
    const governedData = enrichCmsData({
      current: before,
      payload: nextPayload,
      action: 'update',
      actor: adminActor(session)
    })

    const item = await prisma.adminCmsItem.update({
      where: { id },
      data: {
        ...(body.module !== undefined ? { module: normalizeString(body.module) } : {}),
        ...(body.type !== undefined ? { type: normalizeString(body.type) } : {}),
        ...(body.title !== undefined ? { title: normalizeString(body.title) } : {}),
        ...(body.status !== undefined ? { status: normalizeString(body.status) || 'active' } : {}),
        ...(body.grade !== undefined ? { grade: normalizeString(body.grade) || null } : {}),
        ...(body.subject !== undefined ? { subject: normalizeString(body.subject) || null } : {}),
        ...(body.topic !== undefined ? { topic: normalizeString(body.topic) || null } : {}),
        ...(body.skill !== undefined ? { skill: normalizeString(body.skill) || null } : {}),
        ...(body.difficulty !== undefined ? { difficulty: normalizeString(body.difficulty) || null } : {}),
        ...(body.order !== undefined ? { order: Number.parseInt(body.order, 10) || 0 } : {}),
        data: governedData
      }
    })
    await prisma.adminCmsItem.createMany({
      data: [
        buildRevisionRecord({ item, snapshot: item, action: 'update', actor: adminActor(session) }),
        buildAuditRecord({ action: 'update', item, before, after: item, actor: adminActor(session) })
      ]
    })

    return Response.json(serializeItem(item))
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const session = await getAdminAccess(request)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = normalizeString(request.nextUrl.searchParams.get('id'))

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 })
    }

    const before = await prisma.adminCmsItem.findUnique({ where: { id } })
    if (!before) {
      return Response.json({ error: 'CMS item not found' }, { status: 404 })
    }
    await prisma.adminCmsItem.delete({ where: { id } })
    await prisma.adminCmsItem.create({
      data: buildAuditRecord({ action: 'delete', item: before, before, actor: adminActor(session) })
    })
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { normalizeQuestionPayload, serializeQuestionRecord } from '@/lib/question-bank'

async function checkAdminAccess(request) {
  const session = await getAdminSession(request)
  return !!session
}

async function getQuestionId(context) {
  const params = await context.params
  return params.id
}

export async function GET(request, context) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = await getQuestionId(context)
    const question = await prisma.customQuestion.findUnique({ where: { id } })

    if (!question) {
      return Response.json({ error: 'Question not found' }, { status: 404 })
    }

    return Response.json(serializeQuestionRecord(question, { isStatic: false }))
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request, context) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = await getQuestionId(context)
    const current = await prisma.customQuestion.findUnique({ where: { id } })

    if (!current) {
      return Response.json({ error: 'Question not found' }, { status: 404 })
    }

    const body = await request.json()
    const payload = normalizeQuestionPayload(body, current)

    if (!payload.q) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updated = await prisma.customQuestion.update({
      where: { id },
      data: payload
    })

    return Response.json(serializeQuestionRecord(updated, { isStatic: false }))
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = await getQuestionId(context)
    await prisma.customQuestion.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

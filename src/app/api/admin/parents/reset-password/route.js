import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { hashPassword, isSameOriginRequest } from '@/lib/auth'
import { databaseUnavailableResponse, isDatabaseConnectionError } from '@/lib/db-errors'

export async function POST(request) {
  try {
    if (!isSameOriginRequest(request)) {
      return Response.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const session = await getAdminSession(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, password } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const nextPassword = String(password || '')

    if (!normalizedEmail || !nextPassword) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (nextPassword.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const parent = await prisma.parent.update({
      where: { email: normalizedEmail },
      data: { password: hashPassword(nextPassword) },
      include: { profiles: { select: { id: true, name: true, grade: true } } },
    })

    return Response.json({
      success: true,
      parent: {
        id: parent.id,
        email: parent.email,
        profiles: parent.profiles,
      },
    })
  } catch (err) {
    if (isDatabaseConnectionError(err)) {
      return databaseUnavailableResponse(err)
    }
    if (err?.code === 'P2025') {
      return Response.json({ error: 'Parent not found' }, { status: 404 })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

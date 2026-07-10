import prisma from '@/lib/db'
import { comparePassword, getSessionCookieOptions, isSameOriginRequest, signJWT } from '@/lib/auth'
import { databaseUnavailableResponse, isDatabaseConnectionError } from '@/lib/db-errors'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { cookies } from 'next/headers'

// POST /api/auth/login
export async function POST(request) {
  try {
    if (!isSameOriginRequest(request)) {
      return Response.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const rateLimit = checkRateLimit(request, {
      key: 'parent-login',
      limit: 10,
      windowMs: 15 * 60 * 1000,
    })
    if (!rateLimit.ok) return rateLimitResponse(rateLimit)

    const { email, password } = await request.json()
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }
    const parent = await prisma.parent.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      include: { profiles: true },
    })
    if (!parent || !comparePassword(password, parent.password)) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signJWT({ parentId: parent.id, email: parent.email })

    const cookieStore = await cookies()
    cookieStore.set('hocvui_token', token, getSessionCookieOptions())

    return Response.json({
      id: parent.id,
      email: parent.email,
      profiles: parent.profiles,
    })
  } catch (err) {
    if (isDatabaseConnectionError(err)) {
      return databaseUnavailableResponse(err)
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

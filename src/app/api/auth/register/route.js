import prisma from '@/lib/db'
import { getSessionCookieOptions, hashPassword, isSameOriginRequest, signJWT } from '@/lib/auth'
import { databaseUnavailableResponse, isDatabaseConnectionError } from '@/lib/db-errors'
import { cookies } from 'next/headers'

// POST /api/auth/register
export async function POST(request) {
  try {
    if (!isSameOriginRequest(request)) {
      return Response.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const { email, password } = await request.json()
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }
    const normalizedEmail = String(email).trim().toLowerCase()
    if (String(password).length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existing = await prisma.parent.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return Response.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = hashPassword(password)
    const parent = await prisma.parent.create({
      data: { email: normalizedEmail, password: hashedPassword },
    })

    const token = signJWT({ parentId: parent.id, email: parent.email })
    
    const cookieStore = await cookies()
    cookieStore.set('hocvui_token', token, getSessionCookieOptions())

    return Response.json({ id: parent.id, email: parent.email }, { status: 201 })
  } catch (err) {
    if (isDatabaseConnectionError(err)) {
      return databaseUnavailableResponse(err)
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

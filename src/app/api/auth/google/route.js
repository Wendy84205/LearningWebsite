import prisma from '@/lib/db'
import { getSessionCookieOptions, hashPassword, isSameOriginRequest, signJWT } from '@/lib/auth'
import { databaseUnavailableResponse, isDatabaseConnectionError } from '@/lib/db-errors'
import { verifyGoogleIdToken } from '@/lib/google-id-token'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

// POST /api/auth/google
export async function POST(request) {
  try {
    if (!isSameOriginRequest(request)) {
      return Response.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const { credential } = await request.json()
    if (!credential) {
      return Response.json({ error: 'Google credential required' }, { status: 400 })
    }

    const decoded = await verifyGoogleIdToken(credential)
    if (!decoded || !decoded.email) {
      return Response.json({ error: 'Invalid Google credential token' }, { status: 400 })
    }

    const email = String(decoded.email).trim().toLowerCase()

    // Find or create Parent in database
    let parent = await prisma.parent.findUnique({
      where: { email },
      include: { profiles: true }
    })

    if (!parent) {
      // Create new parent with random password since they login via Google
      const randomPassword = randomUUID()
      parent = await prisma.parent.create({
        data: {
          email,
          password: hashPassword(randomPassword)
        },
        include: { profiles: true }
      })
    }

    // Sign session token
    const token = signJWT({ parentId: parent.id, email: parent.email })

    // Set HTTP-only Cookie
    const cookieStore = await cookies()
    cookieStore.set('hocvui_token', token, getSessionCookieOptions())

    return Response.json({
      id: parent.id,
      email: parent.email,
      profiles: parent.profiles
    })
  } catch (err) {
    if (isDatabaseConnectionError(err)) {
      return databaseUnavailableResponse(err)
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

import prisma from '@/lib/db'
import { comparePassword, signJWT } from '@/lib/auth'
import { databaseUnavailableResponse, isDatabaseConnectionError } from '@/lib/db-errors'
import { cookies } from 'next/headers'

// POST /api/auth/login
export async function POST(request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }
    const parent = await prisma.parent.findUnique({
      where: { email },
      include: { profiles: true },
    })
    if (!parent || !comparePassword(password, parent.password)) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signJWT({ parentId: parent.id, email: parent.email })

    const cookieStore = await cookies()
    cookieStore.set('hocvui_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

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

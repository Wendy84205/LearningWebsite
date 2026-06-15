import prisma from '@/lib/db'
import { signJWT } from '@/lib/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

// POST /api/auth/google
export async function POST(request) {
  try {
    const { credential } = await request.json()
    if (!credential) {
      return Response.json({ error: 'Google credential required' }, { status: 400 })
    }

    // Decode Google ID Token (JWT)
    const decoded = jwt.decode(credential)
    if (!decoded || !decoded.email) {
      return Response.json({ error: 'Invalid Google credential token' }, { status: 400 })
    }

    const email = decoded.email

    // Find or create Parent in database
    let parent = await prisma.parent.findUnique({
      where: { email },
      include: { profiles: true }
    })

    if (!parent) {
      // Create new parent with random password since they login via Google
      const randomPassword = Math.random().toString(36).substring(2, 15)
      parent = await prisma.parent.create({
        data: {
          email,
          password: randomPassword // We can hash it but since it's random and they use Google, they won't use it directly
        },
        include: { profiles: true }
      })
    }

    // Sign session token
    const token = signJWT({ parentId: parent.id, email: parent.email })

    // Set HTTP-only Cookie
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
      profiles: parent.profiles
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

import { getSessionUser } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/auth/me
export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const parent = await prisma.parent.findUnique({
      where: { id: session.parentId },
      include: { profiles: true },
    })
    if (!parent) {
      return Response.json({ error: 'Parent not found' }, { status: 404 })
    }
    return Response.json({
      id: parent.id,
      email: parent.email,
      profiles: parent.profiles,
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

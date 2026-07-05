import prisma from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { getGradeName } from '@/lib/grades'

// GET /api/profile or ?profileId=...
export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const profileId = searchParams.get('profileId')

    if (profileId) {
      const profile = await prisma.childProfile.findFirst({
        where: { id: profileId, parentId: session.parentId },
        include: { progress: true },
      })
      if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })
      return Response.json(profile)
    }

    const profiles = await prisma.childProfile.findMany({
      where: { parentId: session.parentId },
      include: { progress: true },
    })
    return Response.json(profiles)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/profile - Create or update a child profile
export async function POST(request) {
  try {
    const body = await request.json()
    const { id, name, grade, avatar, mascotId, mascotName, mascotImage } = body
    
    const session = getSessionUser(request)
    if (!session?.parentId) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (!name) {
      return Response.json({ error: 'Profile name is required' }, { status: 400 })
    }

    const normalizedGrade = getGradeName(grade || 'Lớp 1')
    let profile
    if (id) {
      const current = await prisma.childProfile.findFirst({
        where: { id, parentId: session.parentId },
      })
      if (!current) return Response.json({ error: 'Profile not found' }, { status: 404 })

      profile = await prisma.childProfile.update({
        where: { id },
        data: { name, grade: normalizedGrade, avatar, mascotId, mascotName, mascotImage },
      })
    } else {
      profile = await prisma.childProfile.create({
        data: { name, grade: normalizedGrade, avatar: avatar || '🐱', parentId: session.parentId },
      })
      // Create initial progress record
      await prisma.progress.create({
        data: { profileId: profile.id, currentLevel: 1 },
      })
    }
    return Response.json(profile, { status: id ? 200 : 201 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

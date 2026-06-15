import prisma from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// GET /api/profile?parentId=... or ?profileId=...
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl
    const parentId = searchParams.get('parentId')
    const profileId = searchParams.get('profileId')

    if (profileId) {
      const profile = await prisma.childProfile.findUnique({
        where: { id: profileId },
        include: { progress: true },
      })
      if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })
      return Response.json(profile)
    }

    if (!parentId) {
      const session = getSessionUser(request)
      if (!session) return Response.json({ error: 'parentId or authorization required' }, { status: 400 })
      const profiles = await prisma.childProfile.findMany({
        where: { parentId: session.parentId },
        include: { progress: true },
      })
      return Response.json(profiles)
    }

    const profiles = await prisma.childProfile.findMany({
      where: { parentId },
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
    
    // Securly get parentId from JWT
    const session = getSessionUser(request)
    const parentId = session?.parentId || body.parentId

    if (!parentId) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (!name) {
      return Response.json({ error: 'Profile name is required' }, { status: 400 })
    }

    let profile
    if (id) {
      profile = await prisma.childProfile.update({
        where: { id },
        data: { name, grade, avatar, mascotId, mascotName, mascotImage },
      })
    } else {
      profile = await prisma.childProfile.create({
        data: { name, grade: grade || 'Lớp 1', avatar: avatar || '🐱', parentId },
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


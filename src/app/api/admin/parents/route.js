import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

function checkAdminAccess(request) {
  const session = getAdminSession(request)
  return !!session
}

// GET /api/admin/parents - Get all parents with child counts + profiles
export async function GET(request) {
  if (!checkAdminAccess(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const parents = await prisma.parent.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        _count: {
          select: { profiles: true }
        },
        profiles: {
          select: {
            id: true,
            name: true,
            grade: true,
            avatar: true,
            progress: {
              select: { stars: true, streak: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(parents)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/parents - Delete a parent account (cascades to profiles & progress)
export async function DELETE(request) {
  if (!checkAdminAccess(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Parent ID is required' }, { status: 400 })
    }

    await prisma.parent.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

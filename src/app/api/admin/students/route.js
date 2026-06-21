import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

// Helper to check admin access (async)
async function checkAdminAccess(request) {
  const session = await getAdminSession(request)
  return !!session
}

// GET /api/admin/students - List all students
export async function GET(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const students = await prisma.childProfile.findMany({
      include: {
        parent: {
          select: { email: true }
        },
        progress: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(students)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/admin/students - Update a student's profile and progress
export async function PUT(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, grade, stars, streak, resetProgress } = body

    if (!id) {
      return Response.json({ error: 'Student ID is required' }, { status: 400 })
    }

    const progressData = resetProgress
      ? { stars: 0, streak: 0, currentLevel: 1, completedLevels: '' }
      : { stars: parseInt(stars, 10) || 0, streak: parseInt(streak, 10) || 0 }

    // Update ChildProfile
    const updatedProfile = await prisma.childProfile.update({
      where: { id },
      data: {
        name,
        grade,
        progress: {
          upsert: {
            create: { ...progressData, currentLevel: 1 },
            update: progressData
          }
        }
      },
      include: {
        progress: true
      }
    })

    return Response.json(updatedProfile)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/students - Delete a student profile
export async function DELETE(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Student ID is required' }, { status: 400 })
    }

    await prisma.childProfile.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

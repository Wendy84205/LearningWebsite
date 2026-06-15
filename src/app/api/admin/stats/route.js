import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

function checkAdminAccess(request) {
  const session = getAdminSession(request)
  return !!session
}

// GET /api/admin/stats - System statistics and overview data
export async function GET(request) {
  if (!checkAdminAccess(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Total counts
    const totalParents = await prisma.parent.count()
    const totalStudents = await prisma.childProfile.count()
    const totalCustomQuestions = await prisma.customQuestion.count()

    // 2. Grade distribution
    const grades = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5']
    const gradeDistribution = await Promise.all(
      grades.map(async (gradeName) => {
        const count = await prisma.childProfile.count({
          where: { grade: gradeName }
        })
        return { grade: gradeName, count }
      })
    )

    // 3. Top 5 outstanding students
    const topStudents = await prisma.childProfile.findMany({
      take: 5,
      include: {
        parent: { select: { email: true } },
        progress: true
      },
      orderBy: [
        { progress: { stars: 'desc' } },
        { progress: { streak: 'desc' } }
      ]
    })

    // 4. Sum of all stars
    const progressStats = await prisma.progress.aggregate({
      _sum: {
        stars: true
      },
      _avg: {
        streak: true
      }
    })

    return Response.json({
      totalParents,
      totalStudents,
      totalCustomQuestions,
      totalStars: progressStats._sum.stars || 0,
      avgStreak: Math.round(progressStats._avg.streak || 0),
      gradeDistribution,
      topStudents: topStudents.map(student => ({
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        grade: student.grade,
        parentEmail: student.parent?.email || 'N/A',
        stars: student.progress?.stars || 0,
        streak: student.progress?.streak || 0
      }))
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

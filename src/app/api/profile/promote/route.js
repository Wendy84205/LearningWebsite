import prisma from '@/lib/db'

// POST /api/profile/promote - Promote a child to the next grade
export async function POST(request) {
  try {
    const { profileId } = await request.json()
    if (!profileId) {
      return Response.json({ error: 'profileId is required' }, { status: 400 })
    }

    const profile = await prisma.childProfile.findUnique({
      where: { id: profileId },
      include: { progress: true }
    })

    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    const currentGrade = profile.grade
    
    // Map current grade to next grade name and slug
    const promotionMap = {
      'Lớp 1': { name: 'Lớp 2', slug: 'lop-2' },
      'Lớp 2': { name: 'Lớp 3', slug: 'lop-3' },
      'Lớp 3': { name: 'Lớp 4', slug: 'lop-4' },
      'Lớp 4': { name: 'Lớp 5', slug: 'lop-5' }
    }

    const nextGradeInfo = promotionMap[currentGrade]
    if (!nextGradeInfo) {
      return Response.json({ error: 'Đã đạt cấp học cao nhất, không thể lên lớp tiếp theo.' }, { status: 400 })
    }

    // 1. Update the grade of the child profile
    const updatedProfile = await prisma.childProfile.update({
      where: { id: profileId },
      data: {
        grade: nextGradeInfo.name
      }
    })

    // 2. Reset the progress to start fresh for the new grade
    // Preserve total stars and streak but clear completedLevels and reset currentLevel
    if (profile.progress) {
      await prisma.progress.update({
        where: { profileId },
        data: {
          completedLevels: '',
          currentLevel: 1
        }
      })
    } else {
      await prisma.progress.create({
        data: {
          profileId,
          completedLevels: '',
          currentLevel: 1,
          stars: 0,
          streak: 0
        }
      })
    }

    return Response.json({
      success: true,
      nextGradeName: nextGradeInfo.name,
      nextGradeSlug: nextGradeInfo.slug
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

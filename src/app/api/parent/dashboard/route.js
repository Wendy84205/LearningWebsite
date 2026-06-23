import { getSessionUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { buildActivityStats } from '@/lib/activity-service'
import { buildProgressSummary, getSlug } from '@/lib/progress-summary'
import { levelFromXp } from '@/lib/scoring-service'

// Tính số phút học trong một ngày cụ thể từ LearningAttempts
function getDayMinutes(attempts, targetDate) {
  const start = new Date(targetDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(targetDate)
  end.setHours(23, 59, 59, 999)

  const dayAttempts = attempts.filter(a => {
    const d = new Date(a.createdAt)
    return d >= start && d <= end
  })

  // Ước tính ~3 phút mỗi câu (nếu không có duration)
  return dayAttempts.reduce((sum, a) => sum + Math.max(3, Math.round(a.total * 1.5)), 0)
}

// Tạo suggestions dựa trên weakSkills
function buildSuggestions(weakSkills, profileName) {
  const defaultSuggestions = [
    { icon: 'calculate', color: '#ffc800', shadow: '#cc9a00', title: 'Ôn tập Toán cơ bản', sub: `Giúp ${profileName} củng cố kiến thức nền tảng.` },
    { icon: 'translate', color: '#1cb0f6', shadow: '#1899d6', title: 'Luyện từ vựng Tiếng Anh', sub: `Giúp ${profileName} ghi nhớ từ mới mỗi ngày.` },
    { icon: 'lightbulb', color: '#58cc02', shadow: '#46a302', title: 'Thử thách Khoa học vui', sub: `Khám phá kiến thức mới cùng ${profileName}.` },
  ]

  if (!weakSkills || weakSkills.length === 0) return defaultSuggestions

  const iconMap = {
    'toán': { icon: 'calculate', color: '#ffc800', shadow: '#cc9a00' },
    'tiếng việt': { icon: 'history_edu', color: '#ff4b4b', shadow: '#cc2222' },
    'tiếng anh': { icon: 'translate', color: '#1cb0f6', shadow: '#1899d6' },
    'khoa học': { icon: 'biotech', color: '#fea250', shadow: '#cc7a00' },
    'default': { icon: 'lightbulb', color: '#58cc02', shadow: '#46a302' },
  }

  return weakSkills.slice(0, 3).map(ws => {
    const key = Object.keys(iconMap).find(k =>
      (ws.subject || ws.skill || '').toLowerCase().includes(k)
    ) || 'default'
    const style = iconMap[key]
    return {
      ...style,
      title: `Ôn tập: ${ws.skill || ws.subject || 'Kỹ năng cần luyện'}`,
      sub: `${profileName} đang ở ${ws.accuracy ?? 0}% độ chính xác. Cần luyện thêm!`,
    }
  })
}

// GET /api/parent/dashboard
export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parent = await prisma.parent.findUnique({
      where: { id: session.parentId },
      include: {
        profiles: {
          include: { progress: true, badges: { orderBy: { unlockedAt: 'desc' }, take: 3 } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!parent) {
      return Response.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Số thông báo chưa đọc
    const unreadCount = await prisma.parentNotification.count({
      where: { parentId: session.parentId, read: false },
    })

    // Build data cho từng profile
    const profiles = await Promise.all(parent.profiles.map(async (profile) => {
      const gradeSlug = getSlug(profile.grade || 'lop-1')

      // Lấy 7 ngày gần nhất LearningAttempts
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const [activityStats, recentAttempts] = await Promise.all([
        buildActivityStats(profile.id),
        prisma.learningAttempt.findMany({
          where: {
            profileId: profile.id,
            createdAt: { gte: sevenDaysAgo },
          },
          orderBy: { createdAt: 'asc' },
        }),
      ])

      // Weekly minutes - 7 ngày (T2→CN)
      const weeklyMinutes = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        weeklyMinutes.push(getDayMinutes(recentAttempts, d))
      }

      // Hôm nay study minutes
      const todayMinutes = weeklyMinutes[weeklyMinutes.length - 1]

      // Mục tiêu 30 phút mỗi ngày
      const todayGoalPct = Math.min(100, Math.round((todayMinutes / 30) * 100))

      // Level từ XP
      const levelInfo = activityStats.level || { level: 1, xp: 0, progressPct: 0 }

      // Weekly XP (7 ngày gần nhất)
      const weeklyXp = recentAttempts.reduce((sum, a) => sum + (a.xp || 0), 0)

      // Suggestions từ weakSkills
      const suggestions = buildSuggestions(activityStats.weakSkills, profile.name)

      // Badge mới nhất
      const latestBadge = profile.badges[0] || null

      // Activity summary
      const progress = profile.progress

      return {
        id: profile.id,
        name: profile.name,
        grade: profile.grade,
        gradeSlug,
        avatar: profile.avatar,
        todayGoalPct,
        stats: {
          studyMinutesToday: todayMinutes,
          streak: progress?.streak ?? 0,
          level: levelInfo.level,
          xp: levelInfo.xp,
          weeklyXp,
          stars: progress?.stars ?? 0,
          totalAttempts: activityStats.totalAttempts,
          averageScore: activityStats.averageScore,
          gameCount: activityStats.gameCount,
          testCount: activityStats.testCount,
        },
        weeklyMinutes,
        weakSkills: activityStats.weakSkills,
        suggestions,
        latestBadge,
        recentActivities: activityStats.attempts.slice(0, 5),
        scoreTrend: activityStats.scoreTrend,
      }
    }))

    return Response.json({
      parentEmail: parent.email,
      parentName: parent.email.split('@')[0],
      profiles,
      unreadCount,
    })
  } catch (err) {
    console.error('[parent/dashboard]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

import prisma from '@/lib/db'
import {
  getNormalLevelPosition,
  normalizeCompletedLevelToken,
  parseCompletedLevels,
} from '@/lib/progress-summary'
import {
  calculateSessionResult,
  levelFromXp,
  unlockBadges,
} from '@/lib/scoring-service'

const ACTIVITY_MODULE = 'student-progress'
const ACTIVITY_TYPE = 'activity-attempt'

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function normalizeAnswer(answer = {}) {
  const isCorrect = Boolean(answer.isCorrect)
  return {
    questionId: String(answer.questionId || answer.id || ''),
    selected: answer.selected ?? answer.selectedAnswer ?? '',
    correctAnswer: answer.correctAnswer ?? answer.correct ?? '',
    isCorrect,
    difficulty: String(answer.difficulty || 'easy'),
    subject: String(answer.subject || ''),
    topic: String(answer.topic || ''),
    skill: String(answer.skill || ''),
  }
}

export async function getOwnedProfile({ profileId, parentId, includeProgress = true }) {
  if (!profileId || !parentId) return null

  return prisma.childProfile.findFirst({
    where: { id: profileId, parentId },
    include: includeProgress ? { progress: true } : undefined,
  })
}

export async function updateProgressForAttempt({
  profile,
  completedLevel,
  starsEarned = 0,
}) {
  const current = profile.progress || await prisma.progress.create({
    data: { profileId: profile.id, currentLevel: 1 },
  })

  const completedArr = parseCompletedLevels(current.completedLevels, profile.grade)
  const normalizedCompletedLevel = normalizeCompletedLevelToken(completedLevel, profile.grade)

  if (completedLevel && !normalizedCompletedLevel) {
    throw new Error('Invalid completedLevel')
  }

  if (normalizedCompletedLevel && !completedArr.includes(normalizedCompletedLevel)) {
    completedArr.push(normalizedCompletedLevel)
  }

  const completedPosition = getNormalLevelPosition(normalizedCompletedLevel, profile.grade)
  const nextLevel = completedPosition
    ? Math.max(current.currentLevel || 1, completedPosition + 1)
    : current.currentLevel

  return prisma.progress.update({
    where: { profileId: profile.id },
    data: {
      completedLevels: completedArr.join(','),
      currentLevel: nextLevel,
      stars: current.stars + clamp(toNumber(starsEarned), 0, 3),
      streak: current.streak + 1,
    },
  })
}

export async function recordActivityAttempt({
  profile,
  activityType = 'game',
  title = 'Hoạt động học tập',
  grade,
  subject = '',
  topic = '',
  skill = '',
  difficulty = '',
  gameType = '',
  completedLevel = '',
  worldId,
  levelId,
  isBoss = false,
  answers = [],
  correct: submittedCorrect = 0,
  total: submittedTotal = 0,
  starsEarned,
}) {
  const normalizedAnswers = answers.map(normalizeAnswer)
  const calculated = calculateSessionResult({
    answers: normalizedAnswers,
    streak: profile.progress?.streak || 0,
  })
  const total = normalizedAnswers.length || toNumber(submittedTotal, 0)
  const correct = normalizedAnswers.length
    ? calculated.correct
    : toNumber(submittedCorrect, 0)
  const scorePct = normalizedAnswers.length
    ? calculated.scorePct
    : total ? Math.round((correct / total) * 100) : 0
  const stars = starsEarned == null
    ? calculated.stars
    : clamp(toNumber(starsEarned), 0, 3)
  const xp = normalizedAnswers.length ? calculated.xp : Math.max(1, correct * 10)

  const updatedProgress = await updateProgressForAttempt({
    profile,
    completedLevel,
    starsEarned: stars,
  })

  const attempt = await prisma.adminCmsItem.create({
    data: {
      module: ACTIVITY_MODULE,
      type: ACTIVITY_TYPE,
      title,
      status: 'active',
      grade: grade || profile.grade,
      subject,
      topic,
      skill,
      difficulty: String(difficulty || ''),
      data: {
        profileId: profile.id,
        parentId: profile.parentId,
        activityType,
        gameType,
        completedLevel,
        worldId: toNumber(worldId, null),
        levelId: toNumber(levelId, null),
        isBoss: Boolean(isBoss),
        correct,
        total,
        scorePct,
        stars,
        xp,
        answers: normalizedAnswers,
      },
    },
  })

  let learningAttempt = null
  try {
    learningAttempt = await prisma.learningAttempt.create({
      data: {
        profileId: profile.id,
        parentId: profile.parentId,
        activityType,
        title,
        grade: grade || profile.grade,
        subject,
        topic,
        skill,
        difficulty: String(difficulty || ''),
        gameType: String(gameType || ''),
        completedLevel: String(completedLevel || ''),
        worldId: worldId == null ? null : toNumber(worldId, null),
        levelId: levelId == null ? null : toNumber(levelId, null),
        isBoss: Boolean(isBoss),
        correct,
        total,
        scorePct,
        stars,
        xp,
        answers: normalizedAnswers.length ? {
          create: normalizedAnswers.map(answer => ({
            questionId: answer.questionId,
            selected: String(answer.selected ?? ''),
            correctAnswer: String(answer.correctAnswer ?? ''),
            isCorrect: answer.isCorrect,
            difficulty: answer.difficulty,
            subject: answer.subject,
            topic: answer.topic,
            skill: answer.skill,
          })),
        } : undefined,
      },
    })

    await prisma.parentNotification.create({
      data: {
        parentId: profile.parentId,
        profileId: profile.id,
        type: 'activity',
        title: `${profile.name} hoàn thành: ${title}`,
        body: `${correct}/${total} đúng · ${scorePct}% · +${xp} XP`,
      },
    })
  } catch (err) {
    console.error('Normalized activity write failed:', err.message)
  }

  const stats = await buildActivityStats(profile.id)
  const existingBadgeIds = stats.badges.map(badge => badge.id)
  const newBadges = unlockBadges({
    completedActivities: stats.totalAttempts,
    completedTests: stats.testCount,
    completedGames: stats.gameCount,
    completedDailyMissions: stats.dailyMissionCount,
    correctAnswers: stats.correctAnswers,
    mathCorrect: stats.mathCorrect,
    streak: updatedProgress.streak,
    lastScorePct: scorePct,
  }, existingBadgeIds)

  if (newBadges.length) {
    try {
      await prisma.studentBadge.createMany({
        data: newBadges.map(badge => ({
          profileId: profile.id,
          badgeId: badge.id,
          name: badge.name,
          unlockedAt: new Date(badge.unlockedAt),
        })),
        skipDuplicates: true,
      })
      await prisma.parentNotification.createMany({
        data: newBadges.map(badge => ({
          parentId: profile.parentId,
          profileId: profile.id,
          type: 'badge',
          title: `${profile.name} đạt huy hiệu mới`,
          body: badge.name,
        })),
      })
    } catch (err) {
      console.error('Badge persistence failed:', err.message)
    }
  }

  const level = levelFromXp(stats.totalXp)

  return {
    attempt,
    learningAttempt,
    progress: updatedProgress,
    result: {
      correct,
      total,
      scorePct,
      stars,
      xp,
      level,
      newBadges,
    },
  }
}

export async function getActivityAttempts(profileId, limit = 40) {
  let normalizedRows = []
  try {
    normalizedRows = await prisma.learningAttempt.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { answers: true },
    })
  } catch (_) {
    normalizedRows = []
  }

  const fromNormalized = normalizedRows.map(row => ({
    id: row.id,
    title: row.title,
    grade: row.grade,
    subject: row.subject,
    topic: row.topic,
    skill: row.skill,
    difficulty: row.difficulty,
    activityType: row.activityType,
    gameType: row.gameType,
    correct: row.correct,
    total: row.total,
    scorePct: row.scorePct,
    stars: row.stars,
    xp: row.xp,
    answers: row.answers,
    createdAt: row.createdAt?.toISOString?.() || row.createdAt,
  }))

  if (fromNormalized.length >= limit) return fromNormalized

  const legacyRows = await prisma.adminCmsItem.findMany({
    where: { module: ACTIVITY_MODULE, type: ACTIVITY_TYPE },
    orderBy: { createdAt: 'desc' },
    take: Math.max(limit * 3, 60),
  })

  const legacy = legacyRows
    .filter(row => row.data?.profileId === profileId)
    .slice(0, limit - fromNormalized.length)
    .map(row => ({
      id: row.id,
      title: row.title,
      grade: row.grade,
      subject: row.subject,
      topic: row.topic,
      skill: row.skill,
      difficulty: row.difficulty,
      createdAt: row.createdAt?.toISOString?.() || row.createdAt,
      ...row.data,
    }))

  return [...fromNormalized, ...legacy].slice(0, limit)
}

export async function buildActivityStats(profileId) {
  const attempts = await getActivityAttempts(profileId, 120)
  const totalAttempts = attempts.length
  const totalXp = attempts.reduce((sum, item) => sum + toNumber(item.xp), 0)
  const totalStars = attempts.reduce((sum, item) => sum + toNumber(item.stars), 0)
  const totalQuestions = attempts.reduce((sum, item) => sum + toNumber(item.total), 0)
  const correctAnswers = attempts.reduce((sum, item) => sum + toNumber(item.correct), 0)
  const averageScore = totalAttempts
    ? Math.round(attempts.reduce((sum, item) => sum + toNumber(item.scorePct), 0) / totalAttempts)
    : 0

  const answerRows = attempts.flatMap(item => Array.isArray(item.answers) ? item.answers : [])
  const skillMap = new Map()
  for (const answer of answerRows) {
    const key = answer.skill || answer.topic || answer.subject || 'Tổng hợp'
    const current = skillMap.get(key) || { skill: key, total: 0, correct: 0, subject: answer.subject || '' }
    current.total += 1
    if (answer.isCorrect) current.correct += 1
    skillMap.set(key, current)
  }

  const weakSkills = Array.from(skillMap.values())
    .map(item => ({
      ...item,
      accuracy: item.total ? Math.round((item.correct / item.total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, 5)

  const mathCorrect = answerRows.filter(answer =>
    answer.isCorrect && String(answer.subject || '').toLowerCase().includes('toán')
  ).length

  const statsForBadges = {
    completedActivities: totalAttempts,
    completedTests: attempts.filter(item => item.activityType === 'test').length,
    completedGames: attempts.filter(item => item.activityType === 'game').length,
    completedDailyMissions: attempts.filter(item => item.activityType === 'daily_mission').length,
    correctAnswers,
    mathCorrect,
    streak: 0,
    lastScorePct: attempts[0]?.scorePct || 0,
  }

  let persistedBadges = []
  try {
    persistedBadges = await prisma.studentBadge.findMany({
      where: { profileId },
      orderBy: { unlockedAt: 'desc' },
    })
  } catch (_) {
    persistedBadges = []
  }

  const badges = persistedBadges.length
    ? persistedBadges.map(b => ({ id: b.badgeId, name: b.name, unlockedAt: b.unlockedAt.toISOString() }))
    : unlockBadges(statsForBadges, [])

  return {
    attempts: attempts.slice(0, 12),
    totalAttempts,
    totalXp,
    totalStars,
    totalQuestions,
    correctAnswers,
    averageScore,
    gameCount: statsForBadges.completedGames,
    testCount: statsForBadges.completedTests,
    dailyMissionCount: statsForBadges.completedDailyMissions,
    mathCorrect,
    weakSkills,
    badges,
    level: levelFromXp(totalXp),
    scoreTrend: attempts.slice(0, 8).reverse().map((item, index) => ({
      label: `Lần ${index + 1}`,
      scorePct: item.scorePct,
      activityType: item.activityType,
    })),
  }
}

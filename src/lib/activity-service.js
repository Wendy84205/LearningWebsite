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

  const stats = await buildActivityStats(profile.id)
  const newBadges = unlockBadges({
    completedActivities: stats.totalAttempts,
    completedTests: stats.testCount,
    completedGames: stats.gameCount,
    completedDailyMissions: stats.dailyMissionCount,
    correctAnswers: stats.correctAnswers,
    mathCorrect: stats.mathCorrect,
    streak: updatedProgress.streak,
    lastScorePct: scorePct,
  }, stats.badges.map(badge => badge.id))

  const level = levelFromXp(stats.totalXp)

  return {
    attempt,
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
  const rows = await prisma.adminCmsItem.findMany({
    where: {
      module: ACTIVITY_MODULE,
      type: ACTIVITY_TYPE,
    },
    orderBy: { createdAt: 'desc' },
    take: Math.max(limit * 3, 60),
  })

  return rows
    .filter(row => row.data?.profileId === profileId)
    .slice(0, limit)
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

  const badges = unlockBadges(statsForBadges, [])

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

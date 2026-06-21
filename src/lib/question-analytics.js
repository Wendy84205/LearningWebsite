import prisma from '@/lib/db'

export async function getQuestionMissAnalytics({ limit = 10 } = {}) {
  const rows = await prisma.studentAnswer.groupBy({
    by: ['questionId'],
    where: {
      questionId: { not: '' },
      isCorrect: false,
    },
    _count: { _all: true },
  })

  const sorted = rows
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, limit)

  const questionIds = sorted.map(r => r.questionId).filter(Boolean)
  const questions = questionIds.length
    ? await prisma.customQuestion.findMany({ where: { id: { in: questionIds } } })
    : []
  const questionMap = new Map(questions.map(q => [q.id, q]))

  const wrongCounts = await Promise.all(sorted.map(async (row) => {
    const total = await prisma.studentAnswer.count({
      where: { questionId: row.questionId },
    })
    const q = questionMap.get(row.questionId)
    return {
      questionId: row.questionId,
      wrongCount: row._count._all,
      totalAttempts: total,
      missRate: total ? Math.round((row._count._all / total) * 100) : 0,
      question: q ? {
        q: q.q,
        subject: q.subject,
        grade: q.grade,
        difficulty: q.difficulty,
        status: q.status,
      } : null,
    }
  }))

  return wrongCounts
}

export async function getQuestionBankAnalytics() {
  const [published, draft, archived, bySubject, byGrade, byDifficulty, mostMissed] = await Promise.all([
    prisma.customQuestion.count({ where: { status: 'published' } }),
    prisma.customQuestion.count({ where: { status: { in: ['draft', 'review'] } } }),
    prisma.customQuestion.count({ where: { status: 'archived' } }),
    prisma.customQuestion.groupBy({ by: ['subject'], _count: { _all: true } }),
    prisma.customQuestion.groupBy({ by: ['grade'], _count: { _all: true } }),
    prisma.customQuestion.groupBy({ by: ['difficulty'], _count: { _all: true } }),
    getQuestionMissAnalytics({ limit: 8 }),
  ])

  return {
    totals: {
      published,
      draft,
      archived,
      all: published + draft + archived,
    },
    bySubject: bySubject.map(r => ({ subject: r.subject, count: r._count._all })),
    byGrade: byGrade.map(r => ({ grade: r.grade, count: r._count._all })),
    byDifficulty: byDifficulty.map(r => ({ difficulty: r.difficulty, count: r._count._all })),
    mostMissed,
    needsImprovement: mostMissed.filter(item => item.missRate >= 50).slice(0, 5),
  }
}

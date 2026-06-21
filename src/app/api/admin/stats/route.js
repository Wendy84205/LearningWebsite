import prisma from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { getGradeData } from '@/lib/data/index'
import {
  CMS_SYSTEM_MODULE,
  CONTENT_TYPE_DEFINITIONS,
  validateCmsPayload
} from '@/lib/cms-governance'

async function checkAdminAccess(request) {
  const session = await getAdminSession(request)
  return !!session
}

const gradeSlugs = ['lop-1', 'lop-2', 'lop-3', 'lop-4', 'lop-5']
const defaultGames = ['choose-1-of-2', 'simple-matching', 'listen-and-select', 'drag-drop', 'memory-card']

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

function hasWorldProgress(completedLevels, worldId) {
  const tokens = String(completedLevels || '')
    .split(',')
    .map(token => token.trim())
    .filter(Boolean)

  if (worldId === 1 && tokens.some(token => /^\d+$/.test(token))) {
    return true
  }

  return tokens.some(token => token.startsWith(`w${worldId}-`))
}

function getCurriculumStats() {
  return gradeSlugs.reduce((acc, slug) => {
    const grade = getGradeData(slug)
    const worlds = grade.WORLDS || []
    acc.lessons += worlds.reduce((sum, world) => sum + (world.levels?.length || 0), 0)
    acc.learningMaps += worlds.length
    acc.questions += (grade.CHOOSE_QUESTIONS || []).length
    acc.questions += (grade.LISTEN_QUESTIONS || []).length
    acc.questions += (grade.MATCHING_PAIRS_ALL || []).length
    return acc
  }, { lessons: 0, learningMaps: 0, questions: 0 })
}

function toIsoDate(value) {
  return value?.toISOString?.() || value || null
}

function dateRank(value) {
  const time = new Date(value || 0).getTime()
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time
}

function compactCmsListItem(item) {
  const data = item.data || {}

  return {
    id: item.id,
    title: item.title,
    module: item.module,
    type: item.type,
    status: item.status,
    grade: item.grade,
    subject: item.subject,
    topic: item.topic,
    slug: data.slug || null,
    version: data.version || null,
    scheduledAt: data.scheduledAt || null,
    updatedAt: toIsoDate(item.updatedAt),
    createdAt: toIsoDate(item.createdAt)
  }
}

// GET /api/admin/stats - System statistics and overview data
export async function GET(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Total counts
    const totalParents = await prisma.parent.count()
    const totalStudents = await prisma.childProfile.count()
    const totalCustomQuestions = await prisma.customQuestion.count()
    const curriculumStats = getCurriculumStats()
    const [
      cmsLessons,
      cmsGames,
      cmsLearningMaps,
      cmsTests,
      cmsBadges,
      cmsSubjects,
      cmsTopics,
      cmsSkills,
      active7Days,
      active30Days,
      active90Days,
      progresses,
      recentStudents,
      recentCmsItems,
      recentQuestions,
      customQuestionSubjects,
      allCmsItems,
      contentTypeCount,
      revisionCount,
      auditLogCount,
      editorialItems,
      systemFeed,
      contentTypeItems
    ] = await Promise.all([
      prisma.adminCmsItem.count({ where: { OR: [
        { module: 'content', type: 'lesson' },
        { module: 'curriculum', type: 'lesson' }
      ] } }),
      prisma.adminCmsItem.count({ where: { OR: [
        { module: 'games', type: 'game' },
        { module: 'learning-map', type: { in: ['level', 'boss'] } }
      ] } }),
      prisma.adminCmsItem.count({ where: { module: 'learning-map', type: { in: ['world', 'level', 'boss'] } } }),
      prisma.adminCmsItem.count({ where: { OR: [
        { module: 'assessments', type: { in: ['practice', 'quiz', 'chapter-test', 'semester-test'] } },
        { module: 'tests', type: { in: ['quick-test', 'topic-test', 'chapter-test', 'semester-test', 'test'] } }
      ] } }),
      prisma.adminCmsItem.count({ where: { OR: [
        { module: 'media', type: { in: ['badge', 'badge-asset'] } },
        { module: 'learning-map', type: 'reward' },
        { module: 'achievements', type: { in: ['badge', 'medal'] } }
      ] } }),
      prisma.adminCmsItem.count({ where: { OR: [
        { module: 'content', type: 'subject' },
        { module: 'curriculum', type: 'subject' }
      ] } }),
      prisma.adminCmsItem.count({ where: { OR: [
        { module: 'content', type: 'topic' },
        { module: 'curriculum', type: 'topic' }
      ] } }),
      prisma.adminCmsItem.count({ where: { OR: [
        { module: 'content', type: 'skill' },
        { module: 'curriculum', type: 'skill' }
      ] } }),
      prisma.progress.count({ where: { updatedAt: { gte: daysAgo(7) } } }),
      prisma.progress.count({ where: { updatedAt: { gte: daysAgo(30) } } }),
      prisma.progress.count({ where: { updatedAt: { gte: daysAgo(90) } } }),
      prisma.progress.findMany({ select: { completedLevels: true, updatedAt: true } }),
      prisma.childProfile.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { name: true, grade: true, createdAt: true }
      }),
      prisma.adminCmsItem.findMany({
        take: 12,
        where: { module: { not: CMS_SYSTEM_MODULE } },
        orderBy: { createdAt: 'desc' },
        select: { title: true, module: true, type: true, createdAt: true }
      }),
      prisma.customQuestion.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { q: true, subject: true, topic: true, createdAt: true }
      }),
      prisma.customQuestion.findMany({ select: { subject: true } }),
      prisma.adminCmsItem.findMany({
        where: { module: { not: CMS_SYSTEM_MODULE } },
        select: {
          id: true,
          module: true,
          type: true,
          title: true,
          status: true,
          grade: true,
          subject: true,
          topic: true,
          skill: true,
          data: true,
          updatedAt: true
        }
      }),
      prisma.adminCmsItem.count({ where: { module: CMS_SYSTEM_MODULE, type: 'content-type' } }),
      prisma.adminCmsItem.count({ where: { module: CMS_SYSTEM_MODULE, type: 'revision' } }),
      prisma.adminCmsItem.count({ where: { module: CMS_SYSTEM_MODULE, type: 'audit-log' } }),
      prisma.adminCmsItem.findMany({
        where: { module: { not: CMS_SYSTEM_MODULE } },
        take: 120,
        orderBy: [{ updatedAt: 'desc' }],
        select: {
          id: true,
          module: true,
          type: true,
          title: true,
          status: true,
          grade: true,
          subject: true,
          topic: true,
          data: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.adminCmsItem.findMany({
        where: { module: CMS_SYSTEM_MODULE, type: { in: ['audit-log', 'revision'] } },
        take: 24,
        orderBy: [{ createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          type: true,
          data: true,
          createdAt: true
        }
      }),
      prisma.adminCmsItem.findMany({
        where: { module: CMS_SYSTEM_MODULE, type: 'content-type' },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, title: true, data: true, order: true }
      })
    ])

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
    const subjectCounts = {
      'Toán': Math.round(curriculumStats.questions * 0.45),
      'Tiếng Việt': Math.round(curriculumStats.questions * 0.35),
      'Tiếng Anh': Math.round(curriculumStats.questions * 0.12),
      'Khoa học': Math.round(curriculumStats.questions * 0.08)
    }

    customQuestionSubjects.forEach(question => {
      const subject = question.subject || 'Chung'
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
    })

    const subjectActivity = Object.entries(subjectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([label, value]) => ({ label, value }))

    const completionByWorld = [1, 2, 3].map(worldId => {
      const completedProfiles = progresses.filter(progress => hasWorldProgress(progress.completedLevels, worldId)).length
      return {
        label: `World ${worldId}`,
        percent: totalStudents ? Math.round((completedProfiles / totalStudents) * 100) : 0,
        completedProfiles
      }
    })

    const cmsStatusCounts = allCmsItems.reduce((acc, item) => {
      const status = item.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
    const cmsModuleCounts = allCmsItems.reduce((acc, item) => {
      acc[item.module] = (acc[item.module] || 0) + 1
      return acc
    }, {})
    const cmsQualityIssues = allCmsItems.map(item => {
      const validation = validateCmsPayload(item)
      const data = item.data || {}
      const warnings = [
        !data.slug ? 'missing slug' : '',
        !data.version ? 'missing version' : '',
        !data.workflowStatus ? 'missing workflow' : '',
        !data.seo?.title ? 'missing SEO title' : '',
        validation.valid ? '' : `missing ${validation.missing.join(', ')}`
      ].filter(Boolean)

      return warnings.length ? {
        id: item.id,
        title: item.title,
        module: item.module,
        type: item.type,
        warnings
      } : null
    }).filter(Boolean)
    const cmsGovernedItems = allCmsItems.filter(item => item.data?.governance && item.data?.slug && item.data?.version).length
    const cmsSeoItems = allCmsItems.filter(item => item.data?.seo?.title).length
    const scheduledCmsItems = allCmsItems.filter(item => item.status === 'scheduled' || item.data?.scheduledAt).length
    const cmsQualityScore = allCmsItems.length
      ? Math.round(((allCmsItems.length - cmsQualityIssues.length) / allCmsItems.length) * 100)
      : 100
    const contentTypeCoverage = Math.round((contentTypeCount / Math.max(Object.keys(CONTENT_TYPE_DEFINITIONS).length, 1)) * 100)
    const editorialStatuses = ['draft', 'in_review', 'scheduled', 'active', 'disabled', 'archived']
    const editorialBoard = editorialStatuses.map(status => ({
      status,
      count: cmsStatusCounts[status] || 0,
      items: editorialItems
        .filter(item => item.status === status)
        .slice(0, 5)
        .map(compactCmsListItem)
    }))
    const contentCalendar = editorialItems
      .filter(item => item.status === 'scheduled' || item.data?.scheduledAt)
      .sort((a, b) => dateRank(a.data?.scheduledAt || a.updatedAt) - dateRank(b.data?.scheduledAt || b.updatedAt))
      .slice(0, 8)
      .map(item => ({
        ...compactCmsListItem(item),
        scheduledAt: item.data?.scheduledAt || toIsoDate(item.updatedAt)
      }))
    const activityFeed = systemFeed
      .slice(0, 8)
      .map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        action: item.data?.action || item.type,
        actor: item.data?.actor || 'admin',
        itemTitle: item.data?.after?.title || item.data?.snapshot?.title || item.data?.before?.title || item.title,
        module: item.data?.module || item.data?.itemModule || item.data?.after?.module || item.data?.snapshot?.module || null,
        createdAt: toIsoDate(item.createdAt)
      }))
    const seededContentModels = contentTypeItems.map(item => ({
      id: item.id,
      key: item.data?.key || `${item.data?.module || ''}:${item.data?.type || ''}`,
      label: item.data?.label || item.title,
      module: item.data?.module || null,
      type: item.data?.type || null,
      required: item.data?.required || [],
      fields: item.data?.fields || [],
      source: 'cms-system'
    }))
    const fallbackContentModels = Object.entries(CONTENT_TYPE_DEFINITIONS).map(([key, definition]) => {
      const [moduleName, type] = key.split(':')
      return {
        id: key,
        key,
        label: definition.label,
        module: moduleName,
        type,
        required: definition.required,
        fields: definition.fields,
        source: 'definition'
      }
    })
    const contentModels = seededContentModels.length ? seededContentModels : fallbackContentModels

    const latestLesson = recentCmsItems.find(item => ['content', 'curriculum'].includes(item.module) && item.type === 'lesson')
    const latestTest = recentCmsItems.find(item => ['assessments', 'tests'].includes(item.module))
    const latestQuestion = recentQuestions[0]
    const latestStudent = recentStudents[0]
    const recentActivity = [
      {
        label: 'Học sinh mới',
        value: recentStudents.length,
        meta: latestStudent ? `${latestStudent.name} · ${latestStudent.grade}` : 'Chưa có hồ sơ mới'
      },
      {
        label: 'Bài học mới',
        value: recentCmsItems.filter(item => ['content', 'curriculum'].includes(item.module) && item.type === 'lesson').length,
        meta: latestLesson ? latestLesson.title : 'Chưa có lesson CMS mới'
      },
      {
        label: 'Câu hỏi mới',
        value: recentQuestions.length,
        meta: latestQuestion ? `${latestQuestion.subject} · ${latestQuestion.topic}` : 'Chưa có câu hỏi mới'
      },
      {
        label: 'Kiểm tra mới',
        value: recentCmsItems.filter(item => ['assessments', 'tests'].includes(item.module)).length,
        meta: latestTest ? latestTest.title : 'Chưa có assessment mới'
      }
    ]

    return Response.json({
      totalParents,
      totalStudents,
      totalCustomQuestions,
      totalQuestions: curriculumStats.questions + totalCustomQuestions,
      totalLessons: curriculumStats.lessons + cmsLessons,
      totalTests: cmsTests,
      totalGames: Math.max(defaultGames.length, cmsGames),
      totalLearningMaps: curriculumStats.learningMaps + cmsLearningMaps,
      totalBadges: cmsBadges,
      totalSubjects: cmsSubjects,
      totalTopics: cmsTopics,
      totalSkills: cmsSkills,
      totalStars: progressStats._sum.stars || 0,
      avgStreak: Math.round(progressStats._avg.streak || 0),
      active7Days,
      active30Days,
      active90Days,
      mostStudiedSubject: subjectActivity[0]?.label || 'Toán',
      weakestTopic: completionByWorld.length
        ? `${completionByWorld.reduce((min, item) => item.percent < min.percent ? item : min, completionByWorld[0]).label} cần hỗ trợ`
        : 'Chưa có dữ liệu tiến độ',
      subjectActivity,
      completionByWorld,
      recentActivity,
      cmsDashboard: {
        totalItems: allCmsItems.length,
        statusCounts: cmsStatusCounts,
        moduleCounts: cmsModuleCounts,
        qualityScore: cmsQualityScore,
        qualityIssues: cmsQualityIssues.slice(0, 8),
        governedItems: cmsGovernedItems,
        governanceCoverage: allCmsItems.length ? Math.round((cmsGovernedItems / allCmsItems.length) * 100) : 100,
        seoCoverage: allCmsItems.length ? Math.round((cmsSeoItems / allCmsItems.length) * 100) : 100,
        contentTypeCount,
        contentTypeTotal: Object.keys(CONTENT_TYPE_DEFINITIONS).length,
        contentTypeCoverage,
        revisionCount,
        auditLogCount,
        scheduledItems: scheduledCmsItems,
        editorialBoard,
        contentCalendar,
        activityFeed,
        contentModels,
        moduleHealth: Object.entries(cmsModuleCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([moduleName, count]) => ({
            module: moduleName,
            count,
            percent: allCmsItems.length ? Math.round((count / allCmsItems.length) * 100) : 0
          }))
      },
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

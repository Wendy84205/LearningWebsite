import {
  getActiveCmsItems,
  getCmsBootstrapBundle,
  getCmsLearningMap,
  getCmsQuestionsForGame,
  getCmsSettingsConfig,
} from '@/lib/cms-content'

function normalizeString(value) {
  return String(value || '').trim()
}

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl
    const moduleKey = normalizeString(searchParams.get('module') || 'content')
    const grade = normalizeString(searchParams.get('grade') || 'lop-1')
    const type = normalizeString(searchParams.get('type'))
    const q = normalizeString(searchParams.get('q'))

    if (['bootstrap', 'bundle', 'system'].includes(moduleKey)) {
      const payload = await getCmsBootstrapBundle(grade)
      return Response.json({ module: moduleKey, ...payload })
    }

    if (moduleKey === 'learning-map') {
      const payload = await getCmsLearningMap(grade)
      return Response.json({
        module: moduleKey,
        grade,
        worlds: payload.worlds,
        items: payload.cmsItems,
      })
    }

    if (moduleKey === 'questions') {
      const world = Number.parseInt(searchParams.get('world') || '1', 10)
      const level = Number.parseInt(searchParams.get('level') || '1', 10)
      const isBoss = searchParams.get('boss') === 'true'
      const game = normalizeString(searchParams.get('game'))
      const questions = await getCmsQuestionsForGame({ grade, world, level, isBoss, game })
      return Response.json({ module: moduleKey, grade, world, level, questions })
    }

    if (moduleKey === 'settings') {
      const payload = await getCmsSettingsConfig({ grade, type, q })
      return Response.json({ module: moduleKey, grade, ...payload })
    }

    const items = await getActiveCmsItems(moduleKey, {
      grade,
      type,
      q,
      subject: searchParams.get('subject'),
      topic: searchParams.get('topic'),
      skill: searchParams.get('skill'),
    })

    return Response.json({ module: moduleKey, grade, items })
  } catch (err) {
    return Response.json(
      { error: err.message || 'Cannot load CMS content' },
      { status: err.status || 500 }
    )
  }
}

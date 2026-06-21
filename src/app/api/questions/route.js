import { getQuestionsForGame } from '@/lib/question-distribution'

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl
    const grade = searchParams.get('grade') || 'lop-1'
    const world = Number.parseInt(searchParams.get('world') || '1', 10)
    const level = Number.parseInt(searchParams.get('level') || '1', 10)
    const isBoss = searchParams.get('boss') === 'true'
    const game = searchParams.get('game') || ''
    const subject = searchParams.get('subject') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const limit = Number.parseInt(searchParams.get('limit') || '', 10)

    const questions = await getQuestionsForGame({
      grade,
      world,
      level,
      isBoss,
      game,
      subject,
      difficulty,
      limit: Number.isFinite(limit) ? limit : undefined,
    })

    return Response.json(questions)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

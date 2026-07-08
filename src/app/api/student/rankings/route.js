import { getSessionUser } from '@/lib/auth'
import { buildStudentRanking } from '@/lib/ranking-service'

export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const ranking = await buildStudentRanking({
      parentId: session.parentId,
      profileId: searchParams.get('profileId') || '',
      grade: searchParams.get('grade') || '',
      limit: Math.min(20, Math.max(3, Number.parseInt(searchParams.get('limit') || '10', 10))),
    })

    return Response.json(ranking)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

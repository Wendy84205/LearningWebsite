import { getSessionUser } from '@/lib/auth'
import { getParentNotifications } from '@/lib/notification-service'

export async function GET(request) {
  try {
    const session = getSessionUser(request)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const profileId = searchParams.get('profileId') || undefined
    const notifications = await getParentNotifications(session.parentId, { profileId })

    return Response.json({ notifications })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

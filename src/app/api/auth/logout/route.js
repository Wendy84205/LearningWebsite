import { cookies } from 'next/headers'
import { isSameOriginRequest } from '@/lib/auth'

// POST /api/auth/logout
export async function POST(request) {
  try {
    if (!isSameOriginRequest(request)) {
      return Response.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const cookieStore = await cookies()
    cookieStore.delete('hocvui_token')
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
export async function GET(request) {
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}

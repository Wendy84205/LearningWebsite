import { cookies } from 'next/headers'

// POST /api/auth/logout
export async function POST(request) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('hocvui_token')
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
export async function GET(request) {
  // Support GET logout for simplicity
  try {
    const cookieStore = await cookies()
    cookieStore.delete('hocvui_token')
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

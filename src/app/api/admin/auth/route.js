import { signAdminToken, getAdminSession } from '@/lib/admin-auth'
import { isDefaultAdminLoginEnabled } from '@/lib/admin-config'
import { isSameOriginRequest } from '@/lib/auth'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'

// POST /api/admin/auth - Admin Login
export async function POST(request) {
  try {
    if (!isSameOriginRequest(request)) {
      return Response.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const rateLimit = checkRateLimit(request, {
      key: 'admin-auth',
      limit: 5,
      windowMs: 15 * 60 * 1000,
    })
    if (!rateLimit.ok) return rateLimitResponse(rateLimit)

    const { email, username, password } = await request.json()
    const loginName = String(username || email || '').trim().toLowerCase()
    const expectedUsername = String(process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin').trim().toLowerCase()
    const expectedPassword = String(process.env.ADMIN_PASSWORD || 'admin')
    const defaultAdminEnabled = isDefaultAdminLoginEnabled()

    const isConfiguredAdmin = loginName === expectedUsername && password === expectedPassword
    const isDefaultAdmin = defaultAdminEnabled && loginName === 'admin' && password === 'admin'

    if (isConfiguredAdmin || isDefaultAdmin) {
      const token = await signAdminToken()
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Set-Cookie': `hocvui_admin_token=${token}; Path=/; HttpOnly; Max-Age=604800; SameSite=Lax${secure}`,
          'Content-Type': 'application/json'
        }
      })
    }

    return Response.json({ error: 'Tài khoản hoặc mật khẩu quản trị không chính xác' }, { status: 401 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// GET /api/admin/auth - Check admin status
export async function GET(request) {
  const session = await getAdminSession(request)
  if (!session) {
    return Response.json({ authenticated: false }, { status: 401 })
  }
  return Response.json({ authenticated: true })
}

// DELETE /api/admin/auth - Admin Logout
export async function DELETE() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Set-Cookie': `hocvui_admin_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${secure}`,
      'Content-Type': 'application/json'
    }
  })
}

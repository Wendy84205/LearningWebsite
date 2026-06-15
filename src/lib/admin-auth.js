import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'hoc-vui-secret-key-998877'

export function signAdminJWT() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' })
}

export function verifyAdminJWT(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded && decoded.role === 'admin' ? decoded : null
  } catch (err) {
    return null
  }
}

export function getAdminSession(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=')
      return [parts[0], parts.slice(1).join('=')]
    })
  )
  const token = cookies['hocvui_admin_token']
  if (!token) return null
  return verifyAdminJWT(token)
}

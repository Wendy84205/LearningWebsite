// Admin Auth – dùng Web Crypto API (không cần thư viện, tương thích Edge/Vercel)

const SECRET = process.env.ADMIN_SECRET || 'hocvui-admin-secret-2024'
const SEPARATOR = '.'

// Chuyển string → ArrayBuffer
function strToBuffer(str) {
  return new TextEncoder().encode(str)
}

// ArrayBuffer → hex string
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Tạo HMAC-SHA256 signature
async function sign(payload) {
  const key = await crypto.subtle.importKey(
    'raw', strToBuffer(SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, strToBuffer(payload))
  return bufToHex(sig)
}

// Verify HMAC-SHA256
async function verify(payload, sigHex) {
  const expected = await sign(payload)
  // Constant-time comparison để tránh timing attack
  if (expected.length !== sigHex.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sigHex.charCodeAt(i)
  return diff === 0
}

// ─── Public API ───────────────────────────────────────────

export async function signAdminToken() {
  const payload = JSON.stringify({ role: 'admin', ts: Date.now() })
  const encoded = Buffer.from(payload).toString('base64url')
  const sig = await sign(encoded)
  return `${encoded}${SEPARATOR}${sig}`
}

export async function verifyAdminToken(token) {
  if (!token || !token.includes(SEPARATOR)) return null
  const [encoded, sig] = token.split(SEPARATOR)
  if (!encoded || !sig) return null
  const valid = await verify(encoded, sig)
  if (!valid) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString())
    // Token hết hạn sau 7 ngày
    if (Date.now() - payload.ts > 7 * 24 * 60 * 60 * 1000) return null
    return payload
  } catch {
    return null
  }
}

export async function getAdminSession(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=')
      return [parts[0], parts.slice(1).join('=')]
    })
  )
  const token = cookies['hocvui_admin_token']
  if (!token) return null
  return verifyAdminToken(token)
}

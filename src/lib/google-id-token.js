import { createPublicKey, createVerify } from 'crypto'

const GOOGLE_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com'])
const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs'
const CLOCK_SKEW_SECONDS = 60

let cachedKeys = null
let cacheExpiresAt = 0

function base64UrlDecode(value) {
  return Buffer.from(String(value || ''), 'base64url').toString('utf8')
}

function parseJwt(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT shape')

  return {
    header: JSON.parse(base64UrlDecode(parts[0])),
    payload: JSON.parse(base64UrlDecode(parts[1])),
    signingInput: `${parts[0]}.${parts[1]}`,
    signature: Buffer.from(parts[2], 'base64url'),
  }
}

function getMaxAgeSeconds(cacheControl = '') {
  const match = cacheControl.match(/max-age=(\d+)/i)
  return match ? Number(match[1]) : 3600
}

async function getGoogleKeys() {
  const now = Date.now()
  if (cachedKeys && now < cacheExpiresAt) return cachedKeys

  const res = await fetch(GOOGLE_JWKS_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error('Unable to fetch Google JWKS')

  const body = await res.json()
  const keys = new Map((body.keys || []).map(key => [key.kid, key]))
  cachedKeys = keys
  cacheExpiresAt = now + getMaxAgeSeconds(res.headers.get('cache-control') || '') * 1000
  return keys
}

function verifySignature({ header, signingInput, signature }, jwk) {
  if (header.alg !== 'RS256') return false
  const publicKey = createPublicKey({ key: jwk, format: 'jwk' })
  const verifier = createVerify('RSA-SHA256')
  verifier.update(signingInput)
  verifier.end()
  return verifier.verify(publicKey, signature)
}

export async function verifyGoogleIdToken(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!clientId) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is required')

  let parsed
  try {
    parsed = parseJwt(credential)
  } catch {
    return null
  }
  if (!parsed.header?.kid) return null

  const keys = await getGoogleKeys()
  const jwk = keys.get(parsed.header.kid)
  if (!jwk) return null
  if (!verifySignature(parsed, jwk)) return null

  const now = Math.floor(Date.now() / 1000)
  const payload = parsed.payload || {}

  if (!GOOGLE_ISSUERS.has(payload.iss)) return null
  if (payload.aud !== clientId) return null
  if (!payload.exp || Number(payload.exp) < now - CLOCK_SKEW_SECONDS) return null
  if (payload.iat && Number(payload.iat) > now + CLOCK_SKEW_SECONDS) return null
  if (!payload.sub || !payload.email || payload.email_verified !== true) return null

  return payload
}

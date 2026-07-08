import bcrypt from 'bcryptjs'
import { createHash } from 'crypto'
import jwt from 'jsonwebtoken'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (secret && secret.length >= 32) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production')
  }
  return createHash('sha256').update(`hoc-vui:${process.cwd()}`).digest('base64url')
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    priority: 'high',
  }
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    const requestUrl = new URL(request.url)
    const originUrl = new URL(origin)
    return originUrl.protocol === requestUrl.protocol && originUrl.host === requestUrl.host
  } catch {
    return false
  }
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

export function comparePassword(password, hashed) {
  try {
    return bcrypt.compareSync(password, hashed)
  } catch (err) {
    return false
  }
}

export function signJWT(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '7d',
    issuer: 'hoc-vui',
    audience: 'hoc-vui-parent',
  })
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, getJwtSecret(), {
      issuer: 'hoc-vui',
      audience: 'hoc-vui-parent',
    })
  } catch (err) {
    return null
  }
}

export function getSessionUser(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=')
      return [parts[0], parts.slice(1).join('=')]
    })
  )
  const token = cookies['hocvui_token']
  if (!token) return null
  return verifyJWT(token)
}

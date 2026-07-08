import { NextResponse } from 'next/server'

const PROTECTED_PATHS = [
  '/learning',
  '/game-choose-1-of-2',
  '/game-listen-and-select',
  '/game-simple-matching',
  '/game-quiz-adventure',
  '/game-math-battle',
  '/game-word-match',
  '/game-memory-card',
  '/game-quiz-runner-3d',
  '/game-daily-mission',
  '/game-math-treasure',
  '/game-spelling-sprint',
  '/game-science-lab',
  '/game-history-map',
  '/game-english-quest',
  '/game-results',
  '/kids-closet',
  '/parent-dashboard',
  '/add-profile',
  '/choose-companion',
]

function isPathMatch(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

function buildContentSecurityPolicy(isDev = false) {
  const scriptSrc = ["'self'", "'unsafe-inline'", 'https://accounts.google.com', isDev ? "'unsafe-eval'" : ''].filter(Boolean)
  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co https://*.vercel.app https://accounts.google.com https://oauth2.googleapis.com",
    "frame-src 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; ')
}

function applySecurityHeaders(response, request) {
  const isDev = process.env.NODE_ENV !== 'production'

  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy(isDev))
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'browsing-topics=()',
  ].join(', '))
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  if (request.nextUrl.protocol === 'https:' || process.env.VERCEL) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return response
}

export function proxy(request) {
  const token = request.cookies.get('hocvui_token')?.value
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(path => isPathMatch(pathname, path))

  if (isProtected && !token) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL('/parent-login', request.url)),
      request
    )
  }

  return applySecurityHeaders(NextResponse.next(), request)
}

export const config = {
  matcher: [
    '/',
    '/parent-login',
    '/learning/:path*',
    '/game-choose-1-of-2/:path*',
    '/game-listen-and-select/:path*',
    '/game-simple-matching/:path*',
    '/game-quiz-adventure/:path*',
    '/game-math-battle/:path*',
    '/game-word-match/:path*',
    '/game-memory-card/:path*',
    '/game-quiz-runner-3d/:path*',
    '/game-daily-mission/:path*',
    '/game-math-treasure/:path*',
    '/game-spelling-sprint/:path*',
    '/game-science-lab/:path*',
    '/game-history-map/:path*',
    '/game-english-quest/:path*',
    '/game-results/:path*',
    '/kids-closet/:path*',
    '/parent-dashboard/:path*',
    '/add-profile/:path*',
    '/choose-companion/:path*'
  ]
}

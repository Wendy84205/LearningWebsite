import { NextResponse } from 'next/server'

export function proxy(request) {
  const token = request.cookies.get('hocvui_token')?.value
  const { pathname } = request.nextUrl

  const isProtected = [
    '/learning',
    '/game-choose-1-of-2',
    '/game-listen-and-select',
    '/game-simple-matching',
    '/game-quiz-adventure',
    '/game-math-battle',
    '/game-word-match',
    '/game-memory-card',
    '/game-results',
    '/kids-closet',
    '/parent-dashboard',
    '/add-profile',
    '/choose-companion'
  ].some(path => pathname === path || pathname.startsWith(`${path}/`))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/parent-login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/learning/:path*',
    '/game-choose-1-of-2/:path*',
    '/game-listen-and-select/:path*',
    '/game-simple-matching/:path*',
    '/game-quiz-adventure/:path*',
    '/game-math-battle/:path*',
    '/game-word-match/:path*',
    '/game-memory-card/:path*',
    '/game-results/:path*',
    '/kids-closet/:path*',
    '/parent-dashboard/:path*',
    '/add-profile/:path*',
    '/choose-companion/:path*'
  ]
}

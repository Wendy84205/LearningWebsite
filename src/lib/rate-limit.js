const DEFAULT_WINDOW_MS = 15 * 60 * 1000

function getStore() {
  if (!globalThis.__hocVuiRateLimitStore) {
    globalThis.__hocVuiRateLimitStore = new Map()
  }
  return globalThis.__hocVuiRateLimitStore
}

function cleanup(store, now) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key)
  }
}

export function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export function checkRateLimit(request, {
  key = 'global',
  limit = 10,
  windowMs = DEFAULT_WINDOW_MS,
} = {}) {
  const now = Date.now()
  const store = getStore()
  cleanup(store, now)

  const clientKey = `${key}:${getClientIp(request)}`
  const current = store.get(clientKey)

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(clientKey, { count: 1, resetAt })
    return {
      ok: true,
      remaining: Math.max(limit - 1, 0),
      resetAt,
      retryAfter: 0,
    }
  }

  current.count += 1
  store.set(clientKey, current)

  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
  return {
    ok: current.count <= limit,
    remaining: Math.max(limit - current.count, 0),
    resetAt: current.resetAt,
    retryAfter,
  }
}

export function rateLimitResponse(result) {
  return Response.json(
    {
      error: 'Quá nhiều lần thử. Vui lòng chờ một chút rồi thử lại.',
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    }
  )
}

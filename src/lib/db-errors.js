const CONNECTION_ERROR_CODES = new Set([
  'ENOTFOUND',
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'XX000',
])

export function isDatabaseConnectionError(err) {
  const message = String(err?.message || '').toLowerCase()
  return CONNECTION_ERROR_CODES.has(err?.code)
    || message.includes('tenant/user')
    || message.includes('database')
    || message.includes('connection')
    || message.includes('getaddrinfo')
    || message.includes('prisma')
}

export function databaseUnavailableResponse(err) {
  console.error('[database-unavailable]', err)
  return Response.json(
    {
      error: 'Không thể kết nối cơ sở dữ liệu. Vui lòng kiểm tra DATABASE_URL/Supabase rồi thử lại.',
      code: 'DATABASE_UNAVAILABLE',
    },
    { status: 503 }
  )
}

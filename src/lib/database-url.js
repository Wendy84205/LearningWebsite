export function normalizeDatabaseUrl(value = process.env.DATABASE_URL) {
  const raw = String(value || '').trim()
  const unquoted = raw.replace(/^['"]|['"]$/g, '').trim()
  return unquoted
}

export function getDatabaseUrl() {
  return normalizeDatabaseUrl() || 'file:./dev.db'
}

export function getDatabaseProvider(url = getDatabaseUrl()) {
  return url.startsWith('file:') ? 'sqlite' : 'postgresql'
}

export function getSafeDatabaseDiagnostics(value = process.env.DATABASE_URL) {
  const normalized = normalizeDatabaseUrl(value)
  const diagnostics = {
    configured: Boolean(normalized),
    provider: normalized ? getDatabaseProvider(normalized) : 'missing',
    host: '',
    userPresent: false,
  }

  if (normalized && !normalized.startsWith('file:')) {
    try {
      const parsed = new URL(normalized)
      diagnostics.host = parsed.hostname
      diagnostics.userPresent = Boolean(parsed.username)
    } catch {
      diagnostics.host = 'invalid-url'
    }
  }

  return diagnostics
}

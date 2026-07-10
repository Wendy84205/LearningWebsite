export function isDefaultAdminLoginEnabled(env = process.env) {
  if (env.ENABLE_DEFAULT_ADMIN_LOGIN === 'true') return true
  if (env.NODE_ENV === 'production') return false
  return env.DISABLE_DEFAULT_ADMIN_LOGIN !== 'true'
}

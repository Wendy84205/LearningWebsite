const { Client } = require('pg')
require('dotenv').config()

function maskConnectionString(value = '') {
  return value
    .replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2')
    .replace(/(password|secret|key|token)=([^&]+)/gi, '$1=***')
}

async function check(name, connectionString) {
  if (!connectionString) {
    console.log(`${name}: missing`)
    return false
  }

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 8000,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    const result = await client.query('select current_database() as db, current_user as "user"')
    console.log(`${name}: OK`, result.rows[0])
    return true
  } catch (err) {
    console.error(`${name}: FAIL`, err.code || '', err.message)
    console.error(`  ${maskConnectionString(connectionString)}`)
    return false
  } finally {
    try {
      await client.end()
    } catch {}
  }
}

async function main() {
  const ok = await check('DATABASE_URL', process.env.DATABASE_URL)
  if (process.env.DIRECT_URL) {
    await check('DIRECT_URL', process.env.DIRECT_URL)
  }

  if (!ok) {
    process.exitCode = 1
  }
}

main()

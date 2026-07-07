import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { getDatabaseUrl } from '@/lib/database-url'

const globalForPrisma = globalThis
const { Pool } = pg

function getPgPoolMax() {
  const configured = Number(process.env.PRISMA_PG_POOL_MAX || process.env.PGPOOL_MAX)
  if (Number.isInteger(configured) && configured > 0) return configured

  // Vercel/serverless can spin up many instances. Keeping each instance to one
  // DB session avoids exhausting Supabase session-pooler limits.
  return process.env.VERCEL ? 1 : 2
}

function createPostgresAdapter(databaseUrl) {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: getPgPoolMax(),
    min: 0,
    idleTimeoutMillis: process.env.VERCEL ? 1_000 : 5_000,
    connectionTimeoutMillis: 5_000,
    maxUses: process.env.VERCEL ? 100 : 750,
    allowExitOnIdle: true,
    application_name: process.env.VERCEL
      ? `hoc-vui-vercel-${process.env.VERCEL_REGION || 'global'}`
      : 'hoc-vui-local',
  })

  pool.on('error', (err) => {
    console.error('[postgres-pool-error]', {
      message: err?.message,
      code: err?.code,
    })
  })

  return new PrismaPg(pool, { disposeExternalPool: true })
}

if (!globalForPrisma.prisma) {
  const databaseUrl = getDatabaseUrl()
  const adapter = databaseUrl.startsWith('file:')
    ? new PrismaBetterSqlite3({ url: databaseUrl })
    : createPostgresAdapter(databaseUrl)

  globalForPrisma.prisma = new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma

export default prisma

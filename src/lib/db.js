import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaPg } from '@prisma/adapter-pg'
import { getDatabaseUrl } from '@/lib/database-url'

const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  const databaseUrl = getDatabaseUrl()
  const adapter = databaseUrl.startsWith('file:')
    ? new PrismaBetterSqlite3({ url: databaseUrl })
    : new PrismaPg({ connectionString: databaseUrl })

  globalForPrisma.prisma = new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma

export default prisma

import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
  const adapter = databaseUrl.startsWith('file:')
    ? new PrismaBetterSqlite3({ url: databaseUrl })
    : new PrismaPg({ connectionString: databaseUrl })

  globalForPrisma.prisma = new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma

export default prisma

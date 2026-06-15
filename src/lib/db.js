import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')

const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
  globalForPrisma.prisma = new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma

export default prisma


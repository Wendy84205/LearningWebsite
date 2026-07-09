import prisma from '@/lib/db'
import { getSafeDatabaseDiagnostics } from '@/lib/database-url'

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production'

  try {
    await prisma.parent.count()

    if (isProduction) {
      return Response.json({ ok: true })
    }

    return Response.json({
      ok: true,
      database: getSafeDatabaseDiagnostics(),
    })
  } catch (err) {
    const body = isProduction
      ? {
          ok: false,
          error: 'Database health check failed',
        }
      : {
          ok: false,
          error: {
            message: err?.message,
            code: err?.code,
            name: err?.name,
          },
          database: getSafeDatabaseDiagnostics(),
        }

    return Response.json(
      body,
      { status: 503 }
    )
  }
}

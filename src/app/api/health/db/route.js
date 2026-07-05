import prisma from '@/lib/db'
import { getSafeDatabaseDiagnostics } from '@/lib/database-url'

export async function GET() {
  try {
    await prisma.parent.count()
    return Response.json({
      ok: true,
      database: getSafeDatabaseDiagnostics(),
    })
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: {
          message: err?.message,
          code: err?.code,
          name: err?.name,
        },
        database: getSafeDatabaseDiagnostics(),
      },
      { status: 503 }
    )
  }
}

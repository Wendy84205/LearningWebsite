import { getAdminSession } from '@/lib/admin-auth'
import {
  getAdminModulePayload,
  runAdminModuleAction
} from '@/lib/admin-module-data'

async function checkAdminAccess(request) {
  const session = await getAdminSession(request)
  return !!session
}

function normalizeString(value) {
  return String(value || '').trim()
}

export async function GET(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const moduleKey = normalizeString(request.nextUrl.searchParams.get('module'))
    if (!moduleKey) {
      return Response.json({ error: 'module is required' }, { status: 400 })
    }

    const payload = await getAdminModulePayload(moduleKey)
    return Response.json(payload)
  } catch (err) {
    return Response.json(
      { error: err.message || 'Cannot load admin module' },
      { status: err.status || 500 }
    )
  }
}

export async function POST(request) {
  if (!(await checkAdminAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await runAdminModuleAction(body)
    return Response.json(result)
  } catch (err) {
    return Response.json(
      { error: err.message || 'Cannot run admin module action' },
      { status: err.status || 500 }
    )
  }
}

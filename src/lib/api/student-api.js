/** Client-side API for student flows */

export async function getStudentDashboard(profileId, grade) {
  const qs = new URLSearchParams({ profileId, grade: grade || '' }).toString()
  const res = await fetch(`/api/student/dashboard?${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load student dashboard')
  return res.json()
}

export async function saveAnswer(payload) {
  return saveActivityResult(payload)
}

export async function saveTestResult(payload) {
  return saveActivityResult({ ...payload, activityType: payload.activityType || 'test' })
}

export async function saveGameResult(payload) {
  return saveActivityResult({ ...payload, activityType: payload.activityType || 'game' })
}

async function saveActivityResult(payload) {
  const res = await fetch('/api/student/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save result')
  return res.json()
}

export async function getProgress(profileId) {
  const res = await fetch(`/api/progress?profileId=${profileId}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load progress')
  return res.json()
}

/** Client-side API for question bank operations */

export async function getQuestionBank(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/admin/questions?${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load question bank')
  return res.json()
}

export async function createQuestion(payload) {
  const res = await fetch('/api/admin/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create question')
  return res.json()
}

export async function updateQuestion(id, payload) {
  const res = await fetch(`/api/admin/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update question')
  return res.json()
}

export async function publishQuestion(id, status = 'published') {
  return updateQuestion(id, { status })
}

export async function getQuestionsForGame(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/questions?${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load questions')
  return res.json()
}

export async function getQuestionsForTest(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/student/test?${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load test questions')
  return res.json()
}

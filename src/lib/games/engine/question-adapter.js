/**
 * Adapts Question Bank / API question shapes into unified GameQuestion format.
 */

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch {}
    return value.split(/[|,]/).map(item => item.trim()).filter(Boolean)
  }
  return [value]
}

/**
 * @param {Record<string, unknown>} raw
 * @returns {import('./game-types').GameQuestion | null}
 */
export function adaptQuestionForGame(raw) {
  if (!raw || !raw.id) return null

  const type = String(raw.type || '').toLowerCase()

  if (type === 'matching' || (raw.left && raw.right)) {
    return {
      id: String(raw.id),
      prompt: String(raw.left || raw.q || ''),
      choices: [String(raw.right || '')],
      answer: String(raw.right || ''),
      explanation: raw.explanation ? String(raw.explanation) : undefined,
      difficulty: raw.difficulty || 'easy',
      skill: raw.skill ? String(raw.skill) : undefined,
      subject: raw.subject ? String(raw.subject) : undefined,
      topic: raw.topic ? String(raw.topic) : undefined,
      meta: { shape: 'matching', left: raw.left, right: raw.right },
    }
  }

  if (type === 'listen' || (raw.word && raw.options)) {
    const options = toArray(raw.options)
    const correctIdx = Number(raw.correct ?? 0)
    return {
      id: String(raw.id),
      prompt: String(raw.word || raw.q || ''),
      choices: options.map(String),
      answer: String(options[correctIdx] ?? options[0] ?? ''),
      explanation: raw.explanation ? String(raw.explanation) : undefined,
      difficulty: raw.difficulty || 'easy',
      skill: raw.skill ? String(raw.skill) : undefined,
      subject: raw.subject ? String(raw.subject) : undefined,
      topic: raw.topic ? String(raw.topic) : undefined,
      meta: { shape: 'listen', audioUrl: raw.audioUrl },
    }
  }

  const options = toArray(raw.options)
  const correctIdx = Number(raw.correct ?? 0)

  return {
    id: String(raw.id),
    prompt: String(raw.q || raw.title || raw.content || ''),
    choices: options.map(String),
    answer: String(options[correctIdx] ?? raw.correctAnswer ?? ''),
    explanation: raw.explanation ? String(raw.explanation) : undefined,
    difficulty: raw.difficulty || 'easy',
    skill: raw.skill ? String(raw.skill) : undefined,
    subject: raw.subject ? String(raw.subject) : undefined,
    topic: raw.topic ? String(raw.topic) : undefined,
    meta: { shape: 'choice', correctIndex: correctIdx },
  }
}

/**
 * @param {Record<string, unknown>[]} questions
 */
export function adaptQuestionsForGame(questions = []) {
  return questions
    .map(adaptQuestionForGame)
    .filter(Boolean)
}

/**
 * Build memory-card pairs from matching/vocabulary questions.
 */
export function buildMemoryPairs(questions = [], limit = 6) {
  const adapted = adaptQuestionsForGame(questions).slice(0, limit)
  const pairs = []

  adapted.forEach((q) => {
    if (q.meta?.shape === 'matching') {
      pairs.push({ id: `${q.id}-a`, label: q.prompt, pairId: q.id })
      pairs.push({ id: `${q.id}-b`, label: q.answer, pairId: q.id })
    } else if (q.choices?.length) {
      pairs.push({ id: `${q.id}-a`, label: q.prompt, pairId: q.id })
      pairs.push({ id: `${q.id}-b`, label: q.answer, pairId: q.id })
    }
  })

  return pairs
}

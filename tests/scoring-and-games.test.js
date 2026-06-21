import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  scoreAnswer,
  calculateXp,
  calculateSessionResult,
  levelFromXp,
} from '../src/lib/scoring-service.js'
import { adaptQuestionForGame, buildMemoryPairs } from '../src/lib/games/engine/question-adapter.js'

describe('scoring-service', () => {
  it('scores single choice answers', () => {
    const result = scoreAnswer({ selected: 1, correctAnswer: 1 })
    assert.equal(result.isCorrect, true)
    assert.equal(result.points, 1)
  })

  it('calculates XP with bonuses', () => {
    const xp = calculateXp({ baseXP: 10, difficulty: 'hard', streak: 3, combo: 4, isCorrect: true })
    assert.ok(xp > 10)
  })

  it('derives level from XP', () => {
    const level = levelFromXp(200)
    assert.ok(level.level >= 2)
    assert.ok(level.progressPct >= 0 && level.progressPct <= 100)
  })

  it('calculates session result', () => {
    const result = calculateSessionResult({
      answers: [
        { isCorrect: true, difficulty: 'easy' },
        { isCorrect: false, difficulty: 'easy' },
      ],
    })
    assert.equal(result.correct, 1)
    assert.equal(result.total, 2)
    assert.equal(result.scorePct, 50)
  })
})

describe('question-adapter', () => {
  it('adapts choose question shape', () => {
    const adapted = adaptQuestionForGame({
      id: 'q1',
      q: '2 + 2 = ?',
      options: ['3', '4'],
      correct: 1,
      difficulty: 'easy',
    })
    assert.equal(adapted.prompt, '2 + 2 = ?')
    assert.equal(adapted.answer, '4')
  })

  it('builds memory pairs', () => {
    const pairs = buildMemoryPairs([
      { id: 'm1', left: 'cat', right: 'mèo', type: 'matching' },
    ], 1)
    assert.equal(pairs.length, 2)
  })
})

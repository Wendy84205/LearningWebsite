import { GAME_CONFIG } from './game-types'
import { adaptQuestionsForGame } from './question-adapter'
import { calculateSessionResult, calculateXp } from './scoring'

/**
 * @param {import('./game-types').GameType} gameType
 * @param {Record<string, unknown>[]} rawQuestions
 */
export function createGameSession(gameType, rawQuestions = []) {
  const config = GAME_CONFIG[gameType] || GAME_CONFIG['quiz-adventure']
  const questions = adaptQuestionsForGame(rawQuestions)

  return {
    gameType,
    config,
    questions,
    index: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    hearts: config.hearts ?? null,
    answers: [],
    status: questions.length ? 'playing' : 'finished',
    startedAt: Date.now(),
  }
}

export function getCurrentQuestion(session) {
  return session.questions[session.index] || null
}

export function submitGameAnswer(session, selected) {
  const question = getCurrentQuestion(session)
  if (!question || session.status !== 'playing') {
    return { session, result: null }
  }

  const normalize = (v) => String(v ?? '').trim().toLowerCase()
  const isCorrect = normalize(selected) === normalize(question.answer)
  const combo = isCorrect ? session.combo + 1 : 0
  const maxCombo = Math.max(session.maxCombo, combo)

  const answerRecord = {
    questionId: question.id,
    selected,
    correctAnswer: question.answer,
    isCorrect,
    difficulty: question.difficulty,
    subject: question.subject || '',
    topic: question.topic || '',
    skill: question.skill || '',
  }

  let hearts = session.hearts
  if (!isCorrect && hearts != null) {
    hearts = Math.max(0, hearts - 1)
  }

  const nextIndex = session.index + 1
  const finished = nextIndex >= session.questions.length || hearts === 0

  const nextSession = {
    ...session,
    index: finished ? session.index : nextIndex,
    score: session.score + (isCorrect ? 1 : 0),
    combo,
    maxCombo,
    hearts,
    answers: [...session.answers, answerRecord],
    status: finished ? 'finished' : 'playing',
  }

  return {
    session: nextSession,
    result: {
      isCorrect,
      selected,
      explanation: question.explanation,
      xp: calculateXp({
        baseXP: session.config.xpBase || 10,
        difficulty: question.difficulty,
        combo,
        isCorrect,
      }),
    },
  }
}

export function finalizeGameSession(session) {
  const sessionResult = calculateSessionResult({
    answers: session.answers,
    combo: session.maxCombo,
  })

  return {
    ...sessionResult,
    maxCombo: session.maxCombo,
    heartsLeft: session.hearts,
    durationMs: Date.now() - session.startedAt,
  }
}

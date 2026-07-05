/** @typedef {'quiz-adventure' | 'math-battle' | 'word-match' | 'memory-card' | 'daily-mission' | 'quiz-runner-3d' | 'choose-1-of-2' | 'listen-and-select' | 'simple-matching'} GameType */

/** @typedef {'easy' | 'medium' | 'hard'} Difficulty */

/**
 * @typedef {Object} GameQuestion
 * @property {string} id
 * @property {string} prompt
 * @property {string[]} [choices]
 * @property {string|string[]} answer
 * @property {string} [explanation]
 * @property {Difficulty} difficulty
 * @property {string} [skill]
 * @property {string} [subject]
 * @property {string} [topic]
 * @property {Record<string, unknown>} [meta]
 */

/**
 * @typedef {Object} GameSessionState
 * @property {GameType} gameType
 * @property {GameQuestion[]} questions
 * @property {number} index
 * @property {number} score
 * @property {number} combo
 * @property {number} maxCombo
 * @property {number} hearts
 * @property {Array<{questionId: string, selected: unknown, isCorrect: boolean}>} answers
 * @property {'idle' | 'playing' | 'paused' | 'finished'} status
 */

export const GAME_CONFIG = {
  'quiz-adventure': { hearts: 3, timer: null, xpBase: 12, apiGame: 'quiz' },
  'math-battle': { hearts: 5, timer: 60, xpBase: 15, apiGame: 'choose-1-of-2', subject: 'Toán' },
  'word-match': { hearts: 3, timer: 90, xpBase: 10, apiGame: 'matching' },
  'memory-card': { hearts: null, timer: null, xpBase: 8, apiGame: 'matching' },
  'daily-mission': { hearts: null, timer: null, xpBase: 20, apiGame: 'quiz' },
  'quiz-runner-3d': { hearts: 3, timer: null, xpBase: 18, apiGame: 'quiz' },
}

export const GAME_LABELS = {
  'quiz-adventure': 'Phiêu lưu Quiz',
  'math-battle': 'Đấu Toán',
  'word-match': 'Ghép Từ',
  'memory-card': 'Thẻ Nhớ',
  'daily-mission': 'Nhiệm vụ ngày',
  'quiz-runner-3d': 'Quiz Runner 3D',
}

/** @typedef {'quiz-adventure' | 'math-battle' | 'word-match' | 'memory-card' | 'daily-mission' | 'quiz-runner-3d' | 'choose-1-of-2' | 'listen-and-select' | 'simple-matching' | 'math-treasure' | 'spelling-sprint' | 'science-lab' | 'history-map' | 'english-quest'} GameType */

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
  'math-treasure': { hearts: 4, timer: 90, xpBase: 16, apiGame: 'quiz', subject: 'Toán' },
  'spelling-sprint': { hearts: 3, timer: 75, xpBase: 14, apiGame: 'quiz', subject: 'Tiếng Việt' },
  'science-lab': { hearts: 4, timer: null, xpBase: 15, apiGame: 'quiz', subject: 'Khoa học' },
  'history-map': { hearts: 4, timer: null, xpBase: 15, apiGame: 'quiz', subject: 'Lịch sử & Địa lí' },
  'english-quest': { hearts: 3, timer: 80, xpBase: 14, apiGame: 'quiz', subject: 'Tiếng Anh' },
}

export const GAME_LABELS = {
  'quiz-adventure': 'Phiêu lưu Quiz',
  'math-battle': 'Đấu Toán',
  'word-match': 'Ghép Từ',
  'memory-card': 'Thẻ Nhớ',
  'daily-mission': 'Nhiệm vụ ngày',
  'quiz-runner-3d': 'Quiz Runner 3D',
  'math-treasure': 'Kho báu Toán',
  'spelling-sprint': 'Sprint Tiếng Việt',
  'science-lab': 'Phòng thí nghiệm',
  'history-map': 'Bản đồ Việt Nam',
  'english-quest': 'English Quest',
}

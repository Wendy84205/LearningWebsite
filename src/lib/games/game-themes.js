/** Stitch-inspired visual themes per game route */

export const GAME_THEMES = {
  'quiz-adventure': {
    id: 'quiz-adventure',
    label: 'Phiêu lưu Quiz',
    emoji: '🗺️',
    icon: 'map',
    tagline: 'Trả lời đúng để đi tiếp trên bản đồ!',
    accent: '#1cb0f6',
    accentDark: '#1899d6',
    secondary: '#58cc02',
    gradient: 'linear-gradient(165deg, #c8e6ff 0%, #fbf9f8 42%, #fff8e1 100%)',
    pattern: 'adventure',
  },
  'math-battle': {
    id: 'math-battle',
    label: 'Đấu Toán',
    emoji: '⚔️',
    icon: 'calculate',
    tagline: 'Đánh bại đối thủ bằng tốc độ và combo!',
    accent: '#ff6b35',
    accentDark: '#e85a2a',
    secondary: '#ffc800',
    gradient: 'linear-gradient(165deg, #ffe8dc 0%, #fff5f0 40%, #fff8e1 100%)',
    pattern: 'battle',
  },
  'word-match': {
    id: 'word-match',
    label: 'Ghép Từ',
    emoji: '🔤',
    icon: 'spellcheck',
    tagline: 'Ghép từ với nghĩa — càng nhanh càng nhiều điểm!',
    accent: '#8b5cf6',
    accentDark: '#7c3aed',
    secondary: '#ff319f',
    gradient: 'linear-gradient(165deg, #ede9fe 0%, #fdf4ff 45%, #fbf9f8 100%)',
    pattern: 'match',
  },
  'memory-card': {
    id: 'memory-card',
    label: 'Thẻ Nhớ',
    emoji: '🃏',
    icon: 'grid_view',
    tagline: 'Lật thẻ và tìm cặp giống nhau!',
    accent: '#f59e0b',
    accentDark: '#d97706',
    secondary: '#1cb0f6',
    gradient: 'linear-gradient(165deg, #fef3c7 0%, #fffbeb 42%, #f0f9ff 100%)',
    pattern: 'memory',
  },
  'choose-1-of-2': {
    id: 'choose-1-of-2',
    label: 'Chọn 1 trong 2',
    emoji: '🎯',
    icon: 'touch_app',
    tagline: 'Chọn đáp án đúng nhanh nhất!',
    accent: '#006590',
    accentDark: '#004883',
    secondary: '#f7e61a',
    gradient: 'linear-gradient(180deg, #e0f2fe 0%, #f8f9fa 48%, #fff8e1 100%)',
    pattern: 'classic',
  },
  'listen-and-select': {
    id: 'listen-and-select',
    label: 'Nghe & Chọn',
    emoji: '🎧',
    icon: 'hearing',
    tagline: 'Luyện nghe và chọn từ đúng!',
    accent: '#ec4899',
    accentDark: '#db2777',
    secondary: '#1cb0f6',
    gradient: 'linear-gradient(165deg, #fce7f3 0%, #fdf2f8 40%, #fbf9f8 100%)',
    pattern: 'listen',
  },
  'simple-matching': {
    id: 'simple-matching',
    label: 'Ghép đôi',
    emoji: '🧩',
    icon: 'extension',
    tagline: 'Ghép cặp nhanh tay!',
    accent: '#14b8a6',
    accentDark: '#0d9488',
    secondary: '#58cc02',
    gradient: 'linear-gradient(165deg, #ccfbf1 0%, #f0fdfa 45%, #fbf9f8 100%)',
    pattern: 'match',
  },
}

export function getGameTheme(gameType) {
  return GAME_THEMES[gameType] || GAME_THEMES['quiz-adventure']
}

export const HUB_GAMES = Object.values(GAME_THEMES).map(t => ({
  ...t,
  href: t.id.startsWith('choose') || t.id.includes('listen') || t.id.includes('matching')
    ? `/game-${t.id}`
    : `/game-${t.id}`,
}))

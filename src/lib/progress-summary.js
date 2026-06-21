import { getGradeData } from '@/lib/data'

export const GRADE_SLUGS = {
  'Nhà trẻ': 'nha-tre',
  'Mầm non': 'mam-non',
  'Lớp 1': 'lop-1',
  'Lớp 2': 'lop-2',
  'Lớp 3': 'lop-3',
  'Lớp 4': 'lop-4',
  'Lớp 5': 'lop-5',
}

export const FOCUS_RECOMMENDATIONS = {
  1: {
    icon: '🔢',
    title: 'Củng cố số học & so sánh số',
    desc: 'Tiến trình Số Học của bé còn chậm. Phụ huynh nên dùng que đếm hoặc các món đồ chơi nhỏ ở nhà để cùng bé đếm số từ 1-10 và rèn luyện so sánh "nhiều hơn - ít hơn".',
    subject: 'Ngôi làng Số Học 🏡'
  },
  2: {
    icon: '📖',
    title: 'Luyện nghe đọc chữ cái & ghép âm',
    desc: 'Bé đang gặp một số lỗi nhận diện phụ âm/nguyên âm. Hãy mở giọng phát âm chuẩn tiếng Việt cho bé nghe và khuyên khích bé đọc to cùng bố mẹ khi làm bài.',
    subject: 'Khu rừng Chữ Cái 📖'
  },
  3: {
    icon: '🧩',
    title: 'Rèn luyện trí nhớ và liên kết hình ảnh',
    desc: 'Tiến độ ghép đôi hình ảnh - từ vựng cần được rèn luyện thêm. Bố mẹ có thể in các tấm thẻ từ vựng dán lên các đồ vật quen thuộc trong nhà để giúp bé ghi nhớ tốt hơn.',
    subject: 'Vương quốc Ghép Đôi 🧩'
  },
  4: {
    icon: '➕',
    title: 'Tập trung tính nhẩm phạm vi 10 & 20',
    desc: 'Phép tính cộng trừ của bé chưa thực sự thuần thục. Hãy kể các câu chuyện giải toán đố vui ngắn để bé hứng thú cộng trừ tự nhiên hơn.',
    subject: 'Thành phố Toán Học ➕'
  },
  5: {
    icon: '🌎',
    title: 'Tìm hiểu tự nhiên, gia đình & xã hội',
    desc: 'Bé chưa hoàn thành nhiều bài học về khám phá thế giới xung quanh. Bố mẹ hãy hỏi đố bé về tên các loài cây, các bộ phận cơ thể và luật giao thông khi đi trên đường.',
    subject: 'Hành tinh Khám Phá 🌎'
  }
}

// Utility to get grade slug from grade name or slug
export function getSlug(gradeOrSlug) {
  if (!gradeOrSlug) return 'lop-1'
  return GRADE_SLUGS[gradeOrSlug] || String(gradeOrSlug).toLowerCase()
}

function getWorldsForSummary(gradeOrSlug, options = {}) {
  if (Array.isArray(options.worlds)) return options.worlds
  const slug = getSlug(gradeOrSlug)
  const gradeData = getGradeData(slug)
  return gradeData.WORLDS || []
}

function getNormalLevelTokens(worlds) {
  return worlds.flatMap(world =>
    (world.levels || []).map(level => `w${world.id}-l${level.id}`)
  )
}

export function parseCompletedLevels(completedLevels, gradeOrSlug = 'lop-1', options = {}) {
  if (!completedLevels) return []

  const slug = getSlug(gradeOrSlug)
  const worlds = getWorldsForSummary(slug, options)
  const normalized = String(completedLevels)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => normalizeCompletedLevelToken(item, slug, { worlds }))
    .filter(Boolean)

  return [...new Set(normalized)]
}

export function normalizeCompletedLevelToken(completedLevel, gradeOrSlug = 'lop-1', options = {}) {
  if (completedLevel === null || completedLevel === undefined) return null

  const raw = String(completedLevel).trim()
  if (!raw) return null

  if (/^w\d+-(l\d+|boss)$/.test(raw)) return raw

  if (/^\d+$/.test(raw)) {
    const legacyIndex = Number(raw) - 1
    const slug = getSlug(gradeOrSlug)
    const worlds = getWorldsForSummary(slug, options)
    const normalLevelTokens = getNormalLevelTokens(worlds)
    return normalLevelTokens[legacyIndex] || null
  }

  return null
}

export function getNormalLevelPosition(completedLevel, gradeOrSlug = 'lop-1', options = {}) {
  const slug = getSlug(gradeOrSlug)
  const worlds = getWorldsForSummary(slug, options)
  const normalized = normalizeCompletedLevelToken(completedLevel, slug, { worlds })
  const normalLevelTokens = getNormalLevelTokens(worlds)
  const index = normalLevelTokens.indexOf(normalized)

  return index >= 0 ? index + 1 : null
}

export function buildProgressSummary(progress, gradeOrSlug = 'lop-1', options = {}) {
  const slug = getSlug(gradeOrSlug)
  const gradeData = getGradeData(slug)
  const worlds = getWorldsForSummary(slug, options)
  const normalLevelTokens = getNormalLevelTokens(worlds)
  const totalNormalLevels = normalLevelTokens.length

  const completedList = parseCompletedLevels(progress?.completedLevels, slug, { worlds })
  const medalCount = completedList.filter(item => item.endsWith('-boss')).length
  const normalLevelsCompleted = completedList.filter(item => item.includes('-l')).length
  const progressPct = totalNormalLevels > 0
    ? Math.round((normalLevelsCompleted / totalNormalLevels) * 100)
    : 0

  const worldProgress = worlds.map(world => {
    const levels = world.levels || []
    const completedLevelsCount = levels.filter(level =>
      completedList.includes(`w${world.id}-l${level.id}`)
    ).length
    const totalLevelsCount = levels.length
    const bossCompleted = completedList.includes(`w${world.id}-boss`)
    const pct = totalLevelsCount > 0
      ? Math.round((completedLevelsCount / totalLevelsCount) * 100)
      : 0

    return {
      id: world.id,
      name: world.name,
      icon: world.icon,
      borderColor: world.borderColor,
      medal: world.medal,
      medalName: world.medalName,
      completedLevelsCount,
      totalLevelsCount,
      bossCompleted,
      pct
    }
  })

  const weakestWorld = [...worldProgress].sort((a, b) => {
    if (a.bossCompleted !== b.bossCompleted) {
      return a.bossCompleted ? 1 : -1
    }
    if (a.pct !== b.pct) return a.pct - b.pct
    return a.id - b.id
  })[0]

  const focusRecommendations = options.focusRecommendations || gradeData.FOCUS_RECOMMENDATIONS || FOCUS_RECOMMENDATIONS

  return {
    stars: progress?.stars ?? 0,
    streak: progress?.streak ?? 0,
    medalCount,
    totalMedals: worlds.length,
    normalLevelsCompleted,
    totalNormalLevels,
    progressPct,
    completedLevels: completedList,
    worldProgress,
    weakestWorldId: weakestWorld?.id ?? worlds[0]?.id ?? null,
    focusRecommendation: weakestWorld
      ? focusRecommendations[weakestWorld.id] || buildDefaultFocusRecommendation(weakestWorld)
      : focusRecommendations[worlds[0]?.id]
  }
}

function buildDefaultFocusRecommendation(world) {
  if (!world) return null
  return {
    icon: world.icon || 'menu_book',
    title: `Ôn tập ${world.name}`,
    desc: world.desc || 'Bé nên luyện thêm các bài trong thế giới này để củng cố kiến thức.',
    subject: `${world.name} ${world.icon || ''}`.trim()
  }
}

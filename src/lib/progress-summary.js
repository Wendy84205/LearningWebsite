import { WORLDS } from '@/lib/grade1-data'

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

const NORMAL_LEVEL_TOKENS = WORLDS.flatMap(world =>
  world.levels.map(level => `w${world.id}-l${level.id}`)
)

export const TOTAL_NORMAL_LEVELS = NORMAL_LEVEL_TOKENS.length

export function parseCompletedLevels(completedLevels) {
  if (!completedLevels) return []

  const normalized = String(completedLevels)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(normalizeCompletedLevelToken)
    .filter(Boolean)

  return [...new Set(normalized)]
}

export function normalizeCompletedLevelToken(completedLevel) {
  if (completedLevel === null || completedLevel === undefined) return null

  const raw = String(completedLevel).trim()
  if (!raw) return null

  if (/^w\d+-(l\d+|boss)$/.test(raw)) return raw

  if (/^\d+$/.test(raw)) {
    const legacyIndex = Number(raw) - 1
    return NORMAL_LEVEL_TOKENS[legacyIndex] || null
  }

  return null
}

export function getNormalLevelPosition(completedLevel) {
  const normalized = normalizeCompletedLevelToken(completedLevel)
  const index = NORMAL_LEVEL_TOKENS.indexOf(normalized)

  return index >= 0 ? index + 1 : null
}

export function buildProgressSummary(progress) {
  const completedList = parseCompletedLevels(progress?.completedLevels)
  const medalCount = completedList.filter(item => item.endsWith('-boss')).length
  const normalLevelsCompleted = completedList.filter(item => item.includes('-l')).length
  const progressPct = TOTAL_NORMAL_LEVELS > 0
    ? Math.round((normalLevelsCompleted / TOTAL_NORMAL_LEVELS) * 100)
    : 0

  const worldProgress = WORLDS.map(world => {
    const completedLevelsCount = world.levels.filter(level =>
      completedList.includes(`w${world.id}-l${level.id}`)
    ).length
    const totalLevelsCount = world.levels.length
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

  return {
    stars: progress?.stars ?? 0,
    streak: progress?.streak ?? 0,
    medalCount,
    totalMedals: WORLDS.length,
    normalLevelsCompleted,
    totalNormalLevels: TOTAL_NORMAL_LEVELS,
    progressPct,
    completedLevels: completedList,
    worldProgress,
    weakestWorldId: weakestWorld?.id ?? WORLDS[0]?.id ?? null,
    focusRecommendation: weakestWorld
      ? FOCUS_RECOMMENDATIONS[weakestWorld.id]
      : FOCUS_RECOMMENDATIONS[WORLDS[0]?.id]
  }
}

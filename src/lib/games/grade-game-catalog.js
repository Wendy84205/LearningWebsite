import { GAME_THEMES } from './game-themes.js'

const GAME_ROUTES = {
  'quiz-runner-3d': '/game-quiz-runner-3d',
  'quiz-adventure': '/game-quiz-adventure',
  'math-battle': '/game-math-battle',
  'word-match': '/game-word-match',
  'memory-card': '/game-memory-card',
  'choose-1-of-2': '/game-choose-1-of-2',
  'listen-and-select': '/game-listen-and-select',
  'simple-matching': '/game-simple-matching',
  'daily-mission': '/game-daily-mission',
  'math-treasure': '/game-math-treasure',
  'spelling-sprint': '/game-spelling-sprint',
  'science-lab': '/game-science-lab',
  'history-map': '/game-history-map',
  'english-quest': '/game-english-quest',
}

const DEFAULT_ROTATION = [
  { label: 'Khởi động', icon: 'wb_sunny', text: 'Câu ngắn, phản hồi nhanh' },
  { label: 'Tập trung', icon: 'psychology', text: 'Một kỹ năng trọng tâm' },
  { label: 'Đổi nhịp', icon: 'extension', text: 'Ghép, nghe hoặc nhớ' },
  { label: 'Thử thách', icon: 'emoji_events', text: 'Combo, XP và huy hiệu' },
]

function game(id, options = {}) {
  return {
    id,
    theme: GAME_THEMES[id],
    href: GAME_ROUTES[id],
    badge: options.badge || '',
    focus: options.focus || '',
    reason: options.reason || '',
    duration: options.duration || '3-5 phút',
    intensity: options.intensity || 'Vừa',
    world: options.world,
    level: options.level,
    boss: options.boss || false,
  }
}

export const GRADE_GAME_CATALOG = {
  'lop-1': {
    label: 'Lớp 1',
    headline: 'Nghe, chọn, ghép và nhớ',
    summary: 'Ưu tiên thao tác đơn giản, chữ to, phản hồi nhanh để bé không bị quá tải.',
    rotation: DEFAULT_ROTATION,
    categories: [
      {
        id: 'starter',
        title: 'Bắt đầu nhẹ nhàng',
        subtitle: 'Phù hợp khi bé mới vào bài',
        items: [
          game('choose-1-of-2', { badge: 'Cơ bản', focus: 'Đếm, so sánh, nhận biết', reason: 'Ít lựa chọn, dễ thắng sớm', world: 1, level: 1 }),
          game('listen-and-select', { badge: 'Nghe', focus: 'Âm, vần, từ quen thuộc', reason: 'Tốt cho Tiếng Việt lớp 1', world: 2, level: 1 }),
        ],
      },
      {
        id: 'playful',
        title: 'Đổi nhịp không chán',
        subtitle: 'Dùng sau 5-7 phút học liên tục',
        items: [
          game('simple-matching', { badge: 'Ghép', focus: 'Chữ, hình, số lượng', reason: 'Tăng nhận diện bằng thao tác kéo chọn', world: 3, level: 1 }),
          game('memory-card', { badge: 'Nhớ', focus: 'Trí nhớ hình ảnh', reason: 'Ngắn, vui, ít áp lực' }),
          game('math-treasure', { badge: 'Kho báu', focus: 'Số và phép tính nhỏ', reason: 'Tạo cảm giác mở thưởng sau câu đúng', world: 1, level: 2 }),
          game('daily-mission', { badge: 'Ngày', focus: 'Ôn nhanh', reason: 'Giữ thói quen học đều' }),
        ],
      },
    ],
  },
  'lop-2': {
    label: 'Lớp 2',
    headline: 'Tính nhanh, đọc hiểu, ghép logic',
    summary: 'Bắt đầu tăng tốc độ và combo, xen kẽ game nghe/ghép để giảm mệt.',
    rotation: DEFAULT_ROTATION,
    categories: [
      {
        id: 'math-speed',
        title: 'Tốc độ Toán',
        subtitle: 'Cộng trừ có nhớ, nhân chia cơ bản',
        items: [
          game('math-battle', { badge: 'Hot', focus: 'Tính nhẩm', reason: 'Tạo cảm giác thi đấu vừa phải', world: 2, level: 1 }),
          game('quiz-runner-3d', { badge: '3D', focus: 'Chọn đáp án khi di chuyển', reason: 'Đổi cảm giác từ quiz phẳng sang vận động 3D', world: 2, level: 1 }),
          game('choose-1-of-2', { badge: 'Chuẩn', focus: 'Bài toán một bước', reason: 'Củng cố trước khi vào game nhanh', world: 2, level: 2 }),
        ],
      },
      {
        id: 'language-iq',
        title: 'Tiếng Việt & IQ',
        subtitle: 'Đọc câu, từ loại, dấu câu và trí nhớ',
        items: [
          game('listen-and-select', { badge: 'Nghe', focus: 'Từ/câu Tiếng Việt', reason: 'Rèn nghe hiểu trước khi đọc dài', world: 3, level: 1 }),
          game('word-match', { badge: 'Ghép', focus: 'Từ và nghĩa', reason: 'Đổi kiểu tư duy so với trắc nghiệm', world: 3, level: 5 }),
          game('spelling-sprint', { badge: 'Sprint', focus: 'Chính tả và dấu câu', reason: 'Tạo thử thách ngắn cho Tiếng Việt', world: 3, level: 4 }),
          game('memory-card', { badge: 'Nhớ', focus: 'IQ, cặp logic', reason: 'Nghỉ não nhưng vẫn học' }),
        ],
      },
    ],
  },
  'lop-3': {
    label: 'Lớp 3',
    headline: 'Combo kỹ năng và nhiệm vụ ngắn',
    summary: 'Lớp 3 cần thay đổi nhịp giữa tính toán, đọc hiểu, logic và khám phá.',
    rotation: DEFAULT_ROTATION,
    categories: [
      {
        id: 'mission',
        title: 'Nhiệm vụ chính',
        subtitle: 'Phù hợp cho buổi học 10-15 phút',
        items: [
          game('quiz-adventure', { badge: 'Map', focus: 'Ôn theo chủ đề', reason: 'Có cảm giác đi tiếp qua từng câu', world: 1, level: 1 }),
          game('quiz-runner-3d', { badge: '3D', focus: 'Phản xạ + kiến thức', reason: 'Tạo nhịp vận động cho câu hỏi lớp 3', world: 2, level: 1 }),
          game('math-battle', { badge: 'Combo', focus: 'Nhân chia, chu vi', reason: 'Tăng động lực luyện tốc độ', world: 2, level: 3 }),
        ],
      },
      {
        id: 'deepening',
        title: 'Đào sâu & nghỉ não',
        subtitle: 'Dùng khi cần đổi dạng câu hỏi',
        items: [
          game('word-match', { badge: 'TV', focus: 'Từ ngữ, đoạn văn', reason: 'Giúp nhớ khái niệm bằng ghép cặp', world: 4, level: 5 }),
          game('simple-matching', { badge: 'Logic', focus: 'Cặp kiến thức', reason: 'Hợp với IQ và phân loại', world: 6, level: 4 }),
          game('science-lab', { badge: 'Lab', focus: 'Tự nhiên & xã hội', reason: 'Biến kiến thức môi trường/cơ thể thành khám phá', world: 5, level: 1 }),
          game('daily-mission', { badge: 'Ngày', focus: 'Ôn yếu điểm', reason: 'Ngắn và đều' }),
        ],
      },
    ],
  },
  'lop-4': {
    label: 'Lớp 4',
    headline: 'Chiến thuật, phân số, đọc hiểu dài',
    summary: 'Lớp 4 cần game có áp lực vừa đủ, nhiều dạng tư duy và ít lặp lại.',
    rotation: DEFAULT_ROTATION,
    categories: [
      {
        id: 'strategy',
        title: 'Thử thách chiến thuật',
        subtitle: 'Dành cho phân số, hình học, khoa học',
        items: [
          game('quiz-runner-3d', { badge: '3D', focus: 'Chọn nhanh đáp án', reason: 'Tạo áp lực nhẹ cho kiến thức khó', world: 2, level: 2 }),
          game('math-battle', { badge: 'Đấu', focus: 'Phân số, biểu thức', reason: 'Tăng cảm giác chinh phục', world: 2, level: 4 }),
          game('quiz-adventure', { badge: 'Quest', focus: 'Chuỗi câu theo chủ đề', reason: 'Hợp với bài dài và tổng hợp', world: 5, level: 1 }),
        ],
      },
      {
        id: 'concept',
        title: 'Nắm chắc khái niệm',
        subtitle: 'Phù hợp khi học từ loại, địa lí, khoa học',
        items: [
          game('word-match', { badge: 'Ghép', focus: 'Từ loại, khái niệm', reason: 'Giảm học vẹt bằng cặp nghĩa', world: 4, level: 3 }),
          game('simple-matching', { badge: 'Sử Địa', focus: 'Danh lam, bản đồ', reason: 'Học bằng liên kết hình ảnh', world: 6, level: 3 }),
          game('history-map', { badge: 'Map', focus: 'Địa danh Việt Nam', reason: 'Tạo tuyến khám phá cho lịch sử và địa lí', world: 6, level: 3 }),
          game('memory-card', { badge: 'Nhớ', focus: 'Ôn cặp kiến thức', reason: 'Đổi nhịp sau bài tính' }),
        ],
      },
    ],
  },
  'lop-5': {
    label: 'Lớp 5',
    headline: 'Tổng hợp, phản xạ và chuẩn bị chuyển cấp',
    summary: 'Lớp 5 cần thử thách dài hơn, nhưng vẫn xen kẽ game nhanh để tránh quá tải.',
    rotation: DEFAULT_ROTATION,
    categories: [
      {
        id: 'mastery',
        title: 'Luyện thành thạo',
        subtitle: 'Số thập phân, phần trăm, hình học',
        items: [
          game('quiz-runner-3d', { badge: '3D', focus: 'Tổng hợp nhanh', reason: 'Tạo cảm giác mới cho câu hỏi khó', world: 1, level: 3 }),
          game('math-battle', { badge: 'Boss', focus: 'Tính toán nâng cao', reason: 'Phù hợp luyện phản xạ trước kiểm tra', world: 2, level: 3 }),
          game('quiz-adventure', { badge: 'Quest', focus: 'Chuỗi nhiệm vụ', reason: 'Hợp với ôn tập nhiều chủ đề', world: 6, level: 1 }),
        ],
      },
      {
        id: 'review',
        title: 'Ôn sâu không mệt',
        subtitle: 'Tiếng Việt, khoa học, lịch sử và địa lí',
        items: [
          game('word-match', { badge: 'TV', focus: 'Từ đồng nghĩa, trái nghĩa', reason: 'Ghi nhớ bằng liên kết nghĩa', world: 4, level: 2 }),
          game('simple-matching', { badge: 'Sử Địa', focus: 'Nhân vật, địa danh', reason: 'Hợp với kiến thức nhiều dữ kiện', world: 6, level: 4 }),
          game('english-quest', { badge: 'EN', focus: 'Từ vựng và phản xạ', reason: 'Theo định hướng tăng cường tiếng Anh giai đoạn mới', world: 4, level: 3 }),
          game('science-lab', { badge: 'Lab', focus: 'Năng lượng, môi trường', reason: 'Hợp với câu hỏi khoa học lớp 5', world: 5, level: 3 }),
          game('daily-mission', { badge: 'Ngày', focus: 'Ôn đều', reason: 'Giữ streak trước khi lên lớp 6' }),
        ],
      },
    ],
  },
}

export function getGradeGameCatalog(gradeSlug = 'lop-1') {
  return GRADE_GAME_CATALOG[gradeSlug] || GRADE_GAME_CATALOG['lop-1']
}

export function buildGameHref(item, gradeSlug) {
  const params = new URLSearchParams({ grade: gradeSlug })
  if (item.world) params.set('world', String(item.world))
  if (item.level) params.set('level', String(item.level))
  if (item.boss) params.set('boss', 'true')
  return `${item.href}?${params}`
}

/**
 * lop-1.js
 * Ngân hàng câu hỏi chuẩn chương trình Lớp 1 Việt Nam theo từng Thế giới (Worlds)
 * Môn: Toán | Tiếng Việt | Tự nhiên & Xã hội
 */

// ─── ĐỊNH NGHĨA CÁC THẾ GIỚI (WORLDS) ─────────────────────────────────────────
export const WORLDS = [
  {
    id: 1,
    name: "Ngôi làng Số Học",
    icon: "🏡",
    color: "#005da7",
    textColor: "#005da7",
    bgColor: "#d0e4ff",
    borderColor: "#005da7",
    medal: "🥉",
    medalName: "Huy chương Đồng",
    desc: "Đếm số, so sánh lớn bé và số thứ tự trong phạm vi 10.",
    levels: [
      { id: 1, title: "Đếm số 1-10", desc: "Đếm hoa quả, con vật và đồ chơi", stages: 5, game: "/game-choose-1-of-2?world=1&level=1" },
      { id: 2, title: "So sánh số", desc: "Nhiều hơn, ít hơn, bằng nhau", stages: 5, game: "/game-choose-1-of-2?world=1&level=2" },
      { id: 3, title: "Số thứ tự", desc: "Xác định thứ hạng, vị trí đứng", stages: 5, game: "/game-choose-1-of-2?world=1&level=3" }
    ],
    bossName: "Thử thách làng Số Học",
    bossDesc: "Câu hỏi tổng hợp nhận Huy chương Đồng",
    bossGame: "/game-choose-1-of-2?world=1&boss=true"
  },
  {
    id: 2,
    name: "Khu rừng Chữ Cái",
    icon: "📖",
    color: "#2976c7",
    textColor: "#5c4a00",
    bgColor: "#fef9c3",
    borderColor: "#686000",
    medal: "🥈",
    medalName: "Huy chương Bạc",
    desc: "Nguyên âm, phụ âm, ghép âm và đọc từ vựng tiếng Việt.",
    levels: [
      { id: 1, title: "Nguyên âm", desc: "Nhận biết âm a, ă, â, e, ê, i, o, ô, ơ, u, ư, y", stages: 6, game: "/game-listen-and-select?world=2&level=1" },
      { id: 2, title: "Phụ âm", desc: "Nhận biết âm b, c, d, đ, g, h, k, l, m, n...", stages: 6, game: "/game-listen-and-select?world=2&level=2" },
      { id: 3, title: "Ghép âm", desc: "Đọc âm đơn ghép: ba, bé, bò, cá, gà...", stages: 6, game: "/game-listen-and-select?world=2&level=3" },
      { id: 4, title: "Đọc từ", desc: "Nghe phát âm và chọn từ có nghĩa đúng", stages: 6, game: "/game-listen-and-select?world=2&level=4" }
    ],
    bossName: "Thử thách Rừng Chữ Cái",
    bossDesc: "Đọc hiểu nhanh nhận Huy chương Bạc",
    bossGame: "/game-listen-and-select?world=2&boss=true"
  },
  {
    id: 3,
    name: "Vương quốc Ghép Đôi",
    icon: "🧩",
    color: "#686000",
    textColor: "#5b21b6",
    bgColor: "#ede9fe",
    borderColor: "#7c3aed",
    medal: "⭐",
    medalName: "Sao Thông Minh",
    desc: "Luyện trí nhớ bằng cách ghép nối chữ cái, hình ảnh và nghề nghiệp.",
    levels: [
      { id: 1, title: "Ghép chữ cái", desc: "Ghép chữ hoa với chữ thường tương ứng (A-a)", stages: 5, game: "/game-simple-matching?world=3&level=1" },
      { id: 2, title: "Ghép hình & từ", desc: "Ghép hình ảnh con vật với tên tiếng Việt", stages: 5, game: "/game-simple-matching?world=3&level=2" },
      { id: 3, title: "Ghép nghề nghiệp", desc: "Ghép nghề nghiệp với đồ dùng, nơi làm việc", stages: 5, game: "/game-simple-matching?world=3&level=3" }
    ],
    bossName: "Siêu trí nhớ 30 Thẻ",
    bossDesc: "Ghép đôi tốc độ nhận Sao Thông Minh",
    bossGame: "/game-simple-matching?world=3&boss=true"
  },
  {
    id: 4,
    name: "Thành phố Toán Học",
    icon: "➕",
    color: "#7f5300",
    textColor: "#7f5300",
    bgColor: "#ffe0b2",
    borderColor: "#e65100",
    medal: "💎",
    medalName: "Viên ngọc Toán Học",
    desc: "Phép cộng trừ trong phạm vi 10, 20 và giải toán có lời văn.",
    levels: [
      { id: 1, title: "Cộng trong phạm vi 10", desc: "Luyện các phép tính cộng cơ bản dưới 10", stages: 5, game: "/game-choose-1-of-2?world=4&level=1" },
      { id: 2, title: "Trừ trong phạm vi 10", desc: "Luyện các phép tính trừ dưới 10", stages: 5, game: "/game-choose-1-of-2?world=4&level=2" },
      { id: 3, title: "Cộng trong phạm vi 20", desc: "Phép cộng có nhớ và không nhớ từ 10-20", stages: 5, game: "/game-choose-1-of-2?world=4&level=3" },
      { id: 4, title: "Trừ trong phạm vi 20", desc: "Phép trừ có nhớ và không nhớ từ 10-20", stages: 5, game: "/game-choose-1-of-2?world=4&level=4" },
      { id: 5, title: "Toán có lời văn", desc: "Đọc đề bài ngắn và tìm kết quả phép tính", stages: 5, game: "/game-choose-1-of-2?world=4&level=5" }
    ],
    bossName: "Cao thủ Tính Nhẩm",
    bossDesc: "Giải toán thần tốc nhận Viên ngọc Toán Học",
    bossGame: "/game-choose-1-of-2?world=4&boss=true"
  },
  {
    id: 5,
    name: "Hành tinh Khám Phá",
    icon: "🌎",
    color: "#0060ac",
    textColor: "#166534",
    bgColor: "#dcfce7",
    borderColor: "#16a34a",
    medal: "🌟",
    medalName: "Nhà Khám Phá Nhí",
    desc: "Tìm hiểu bản thân, gia đình, nhà trường, động thực vật và an toàn giao thông.",
    levels: [
      { id: 1, title: "Bản thân em", desc: "Bộ phận cơ thể và thói quen giữ vệ sinh", stages: 5, game: "/game-choose-1-of-2?world=5&level=1" },
      { id: 2, title: "Gia đình yêu thương", desc: "Nhận biết các thành viên và cách xưng hô", stages: 5, game: "/game-choose-1-of-2?world=5&level=2" },
      { id: 3, title: "Mái trường mến yêu", desc: "Lớp học, đồ dùng học tập, thầy cô và bạn bè", stages: 5, game: "/game-choose-1-of-2?world=5&level=3" },
      { id: 4, title: "Thế giới động vật", desc: "Phân biệt động vật nuôi và động vật hoang dã", stages: 5, game: "/game-choose-1-of-2?world=5&level=4" },
      { id: 5, title: "Thực vật quanh ta", desc: "Tên gọi các loài hoa, lá và quả thường gặp", stages: 5, game: "/game-choose-1-of-2?world=5&level=5" },
      { id: 6, title: "An toàn giao thông", desc: "Nhận biết đèn tín hiệu và cách qua đường an toàn", stages: 5, game: "/game-choose-1-of-2?world=5&level=6" }
    ],
    bossName: "Nhà thông thái Nhí",
    bossDesc: "Hỏi đáp tự nhiên xã hội nhận danh hiệu Nhà Khám Phá Nhí",
    bossGame: "/game-choose-1-of-2?world=5&boss=true"
  }
]

const findWorld = (id) => WORLDS.find(world => world.id === id)

findWorld(1)?.levels.push(
  { id: 4, title: "Số đến 20", desc: "Đọc, đếm, viết và so sánh các số trong phạm vi 20", stages: 5, game: "/game-choose-1-of-2?world=1&level=4" },
  { id: 5, title: "Số đến 100", desc: "Nhận biết chục, đơn vị và thứ tự số đến 100", stages: 5, game: "/game-choose-1-of-2?world=1&level=5" },
  { id: 6, title: "Hình học quanh em", desc: "Nhận biết hình vuông, tròn, tam giác, chữ nhật và khối quen thuộc", stages: 5, game: "/game-choose-1-of-2?world=1&level=6" }
)

findWorld(2)?.levels.push(
  { id: 5, title: "Dấu thanh", desc: "Nghe và phân biệt thanh ngang, huyền, sắc, hỏi, ngã, nặng", stages: 6, game: "/game-listen-and-select?world=2&level=5" },
  { id: 6, title: "Vần cơ bản", desc: "Nhận biết vần an, at, en, em, ong, inh trong tiếng quen thuộc", stages: 6, game: "/game-listen-and-select?world=2&level=6" },
  { id: 7, title: "Câu ngắn", desc: "Nghe hiểu câu ngắn về gia đình, lớp học và đồ vật", stages: 6, game: "/game-listen-and-select?world=2&level=7" }
)

findWorld(3)?.levels.push(
  { id: 4, title: "Ghép số & lượng", desc: "Ghép số với nhóm đồ vật tương ứng", stages: 5, game: "/game-simple-matching?world=3&level=4" },
  { id: 5, title: "Ghép hình học", desc: "Ghép hình khối với đồ vật quen thuộc trong đời sống", stages: 5, game: "/game-simple-matching?world=3&level=5" },
  { id: 6, title: "Ghép câu & ý nghĩa", desc: "Ghép câu ngắn với hình ảnh hoặc hành động phù hợp", stages: 5, game: "/game-simple-matching?world=3&level=6" }
)

findWorld(4)?.levels.push(
  { id: 6, title: "Cộng trừ đến 100", desc: "Tính nhẩm cộng trừ không nhớ trong phạm vi 100", stages: 5, game: "/game-choose-1-of-2?world=4&level=6" },
  { id: 7, title: "Đo độ dài", desc: "So sánh dài ngắn và đọc số đo xăng-ti-mét đơn giản", stages: 5, game: "/game-choose-1-of-2?world=4&level=7" },
  { id: 8, title: "Thời gian & tuần lễ", desc: "Nhận biết hôm qua, hôm nay, ngày mai, giờ đúng và ngày trong tuần", stages: 5, game: "/game-choose-1-of-2?world=4&level=8" }
)

findWorld(5)?.levels.push(
  { id: 7, title: "Cộng đồng quanh em", desc: "Nhận biết nghề nghiệp, nơi công cộng và cách ứng xử lịch sự", stages: 5, game: "/game-choose-1-of-2?world=5&level=7" },
  { id: 8, title: "Thời tiết & mùa", desc: "Quan sát nắng, mưa, nóng, lạnh và chọn trang phục phù hợp", stages: 5, game: "/game-choose-1-of-2?world=5&level=8" },
  { id: 9, title: "Bảo vệ môi trường", desc: "Giữ vệ sinh, tiết kiệm nước và chăm sóc cây xanh", stages: 5, game: "/game-choose-1-of-2?world=5&level=9" }
)

// Định nghĩa MAP_LEVELS cũ để tương thích ngược nếu cần
export const MAP_LEVELS = WORLDS.map(w => ({
  id: w.id,
  title: w.name,
  subject: w.id === 1 || w.id === 4 ? "Toán" : w.id === 2 ? "Tiếng Việt" : w.id === 3 ? "Toán & TV" : "Tự nhiên",
  icon: w.icon,
  desc: w.desc,
  game: w.levels[0].game
}))

// ─── GAME 1, 4, 5: CHỌN ĐÚNG (1 trong 2) ──────────────────────────────────────
export const CHOOSE_QUESTIONS = [
  // === WORLD 1: NGÔI LÀNG SỐ HỌC ===
  // Level 1: Đếm số 1-10
  { q: "Có mấy quả táo ở đây? 🍎🍎🍎", options: ["3 quả táo", "5 quả táo"], correct: 0, emoji: "🍎", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Hãy đếm số con mèo! 🐱🐱", options: ["2 con mèo", "4 con mèo"], correct: 0, emoji: "🐱", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Có bao nhiêu bút chì màu? ✏️✏️✏️✏️✏️", options: ["3 cây bút", "5 cây bút"], correct: 1, emoji: "✏️", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Đếm xem có bao nhiêu viên kẹo? 🍭🍭🍭🍭🍭🍭", options: ["6 viên kẹo", "8 viên kẹo"], correct: 0, emoji: "🍭", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Có mấy bông hoa xinh đẹp? 🌸🌸🌸🌸", options: ["4 bông hoa", "2 bông hoa"], correct: 0, emoji: "🌸", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Hãy đếm số cá vàng đang bơi! 🐟🐟🐟🐟🐟🐟🐟", options: ["7 con cá", "9 con cá"], correct: 0, emoji: "🐟", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Có mấy quả bóng đá? ⚽⚽⚽⚽⚽⚽⚽⚽", options: ["6 quả bóng", "8 quả bóng"], correct: 1, emoji: "⚽", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },

  // Level 2: So sánh số
  { q: "Số nào lớn hơn?", options: ["7", "4"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số nào nhỏ hơn?", options: ["2", "9"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số nào lớn hơn?", options: ["5", "8"], correct: 1, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số nào nhỏ hơn?", options: ["6", "3"], correct: 1, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số nào lớn hơn?", options: ["10", "1"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số nào nhỏ hơn?", options: ["4", "7"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số nào bằng số 5?", options: ["5", "6"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },

  // Level 3: Số thứ tự
  { q: "Con mèo đứng thứ mấy từ trái sang? 🐶🐱🐭", options: ["Thứ hai", "Thứ ba"], correct: 0, emoji: "🐱", subject: "Toán", topic: "Số thứ tự", world: 1, level: 3 },
  { q: "Chú chuột nhắt đứng thứ mấy từ trái sang? 🐶🐱🐭", options: ["Thứ ba", "Thứ nhất"], correct: 0, emoji: "🐭", subject: "Toán", topic: "Số thứ tự", world: 1, level: 3 },
  { q: "Hình ngôi sao đứng thứ mấy từ trái sang? ⭕⭐🔷", options: ["Thứ hai", "Thứ nhất"], correct: 0, emoji: "⭐", subject: "Toán", topic: "Số thứ tự", world: 1, level: 3 },
  { q: "Mặt cười đứng thứ mấy từ trái sang? 😊🦊🐻🐶", options: ["Thứ nhất", "Thứ tư"], correct: 0, emoji: "😊", subject: "Toán", topic: "Số thứ tự", world: 1, level: 3 },
  { q: "Chú gấu đứng thứ mấy từ trái sang? 😊🦊🐻🐶", options: ["Thứ ba", "Thứ hai"], correct: 0, emoji: "🐻", subject: "Toán", topic: "Số thứ tự", world: 1, level: 3 },
  { q: "Hình tròn đứng thứ mấy từ trái sang? 🔺⭕⬛", options: ["Thứ hai", "Thứ ba"], correct: 0, emoji: "⭕", subject: "Toán", topic: "Số thứ tự", world: 1, level: 3 },

  // === WORLD 4: THÀNH PHỐ TOÁN HỌC ===
  // Level 1: Cộng trong phạm vi 10
  { q: "3 + 2 = ?", options: ["5", "6"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 10", world: 4, level: 1 },
  { q: "4 + 4 = ?", options: ["7", "8"], correct: 1, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 10", world: 4, level: 1 },
  { q: "5 + 3 = ?", options: ["8", "9"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 10", world: 4, level: 1 },
  { q: "6 + 2 = ?", options: ["7", "8"], correct: 1, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 10", world: 4, level: 1 },
  { q: "7 + 1 = ?", options: ["8", "9"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 10", world: 4, level: 1 },
  { q: "2 + 2 = ?", options: ["4", "3"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 10", world: 4, level: 1 },

  // Level 2: Trừ trong phạm vi 10
  { q: "8 - 3 = ?", options: ["5", "6"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 10", world: 4, level: 2 },
  { q: "9 - 4 = ?", options: ["5", "4"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 10", world: 4, level: 2 },
  { q: "10 - 6 = ?", options: ["4", "5"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 10", world: 4, level: 2 },
  { q: "7 - 2 = ?", options: ["5", "6"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 10", world: 4, level: 2 },
  { q: "6 - 4 = ?", options: ["2", "3"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 10", world: 4, level: 2 },
  { q: "5 - 1 = ?", options: ["4", "3"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 10", world: 4, level: 2 },

  // Level 3: Cộng trong phạm vi 20
  { q: "12 + 3 = ?", options: ["15", "14"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 20", world: 4, level: 3 },
  { q: "10 + 7 = ?", options: ["17", "16"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 20", world: 4, level: 3 },
  { q: "15 + 4 = ?", options: ["19", "18"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 20", world: 4, level: 3 },
  { q: "11 + 5 = ?", options: ["16", "17"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 20", world: 4, level: 3 },
  { q: "13 + 6 = ?", options: ["19", "18"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng phạm vi 20", world: 4, level: 3 },

  // Level 4: Trừ trong phạm vi 20
  { q: "15 - 3 = ?", options: ["12", "13"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 20", world: 4, level: 4 },
  { q: "17 - 5 = ?", options: ["12", "11"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phrep trừ phạm vi 20", world: 4, level: 4 },
  { q: "19 - 7 = ?", options: ["12", "13"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 20", world: 4, level: 4 },
  { q: "16 - 4 = ?", options: ["12", "14"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 20", world: 4, level: 4 },
  { q: "20 - 10 = ?", options: ["10", "12"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ phạm vi 20", world: 4, level: 4 },

  // Level 5: Toán có lời văn
  { q: "Lan có 5 quả táo. Mẹ cho thêm 2 quả. Hỏi Lan có tất cả bao nhiêu quả?", options: ["7 quả", "6 quả"], correct: 0, emoji: "🍎", subject: "Toán", topic: "Lời văn", world: 4, level: 5 },
  { q: "Nam có 8 viên kẹo. Nam cho bạn 3 viên. Hỏi Nam còn lại bao nhiêu viên kẹo?", options: ["5 viên", "6 viên"], correct: 0, emoji: "🍬", subject: "Toán", topic: "Lời văn", world: 4, level: 5 },
  { q: "Có 4 chú chim trên cành. Có 3 chú nữa bay đến. Hỏi có tất cả bao nhiêu chú chim?", options: ["7 con", "6 con"], correct: 0, emoji: "🐦", subject: "Toán", topic: "Lời văn", world: 4, level: 5 },
  { q: "Trong rổ có 10 quả cam. Mẹ lấy đi 4 quả. Hỏi trong rổ còn lại bao nhiêu quả cam?", options: ["6 quả", "5 quả"], correct: 0, emoji: "🍊", subject: "Toán", topic: "Lời văn", world: 4, level: 5 },
  { q: "Bố có 6 cây bút. Bố mua thêm 3 cây nữa. Hỏi bố có tất cả bao nhiêu cây bút?", options: ["9 cây", "8 cây"], correct: 0, emoji: "✏️", subject: "Toán", topic: "Lời văn", world: 4, level: 5 },

  // === WORLD 5: HÀNH TINH KHÁM PHÁ ===
  // Level 1: Bản thân em
  { q: "Bộ phận nào giúp chúng ta nghe được âm thanh xung quanh?", options: ["Tai", "Mắt"], correct: 0, emoji: "👂", subject: "Tự nhiên", topic: "Bản thân", world: 5, level: 1 },
  { q: "Chúng ta nên đánh răng khi nào để bảo vệ răng miệng?", options: ["Trước khi đi ngủ & sau khi thức dậy", "Khi đang ngủ"], correct: 0, emoji: "🦷", subject: "Tự nhiên", topic: "Bản thân", world: 5, level: 1 },
  { q: "Bộ phận nào trên gương mặt giúp chúng ta ngửi thấy mùi hương thơm?", options: ["Mũi", "Miệng"], correct: 0, emoji: "👃", subject: "Tự nhiên", topic: "Bản thân", world: 5, level: 1 },
  { q: "Chúng ta nên rửa tay bằng gì để làm sạch vi khuẩn gây hại?", options: ["Xà phòng và nước sạch", "Chỉ cần lau giấy khô"], correct: 0, emoji: "🧼", subject: "Tự nhiên", topic: "Bản thân", world: 5, level: 1 },
  { q: "Bộ phận nào giúp cơ thể đi lại, chạy nhảy hàng ngày?", options: ["Đôi chân", "Đôi tay"], correct: 0, emoji: "🦵", subject: "Tự nhiên", topic: "Bản thân", world: 5, level: 1 },

  // Level 2: Gia đình yêu thương
  { q: "Bố của bố mình thì em gọi bằng gì?", options: ["Ông nội", "Ông ngoại"], correct: 0, emoji: "👴", subject: "Tự nhiên", topic: "Gia đình", world: 5, level: 2 },
  { q: "Mẹ của mẹ mình thì em gọi bằng gì?", options: ["Bà ngoại", "Bà nội"], correct: 0, emoji: "👵", subject: "Tự nhiên", topic: "Gia đình", world: 5, level: 2 },
  { q: "Em của bố thì mình sẽ xưng hô bằng gì?", options: ["Cô hoặc Chú", "Dì hoặc Cậu"], correct: 0, emoji: "👨", subject: "Tự nhiên", topic: "Gia đình", world: 5, level: 2 },
  { q: "Khi đi học về hoặc có người lớn đến nhà, em cần làm gì đầu tiên?", options: ["Chào hỏi lễ phép", "Im lặng đi vào phòng chơi"], correct: 0, emoji: "🙇", subject: "Tự nhiên", topic: "Gia đình", world: 5, level: 2 },
  { q: "Chúng ta nên thể hiện sự yêu thương bố mẹ như thế nào?", options: ["Giúp việc nhà và chăm học", "Đòi mua thật nhiều đồ chơi"], correct: 0, emoji: "❤️", subject: "Tự nhiên", topic: "Gia đình", world: 5, level: 2 },

  // Level 3: Mái trường mến yêu
  { q: "Ai là người trực tiếp giảng dạy và yêu thương chăm sóc học sinh ở lớp?", options: ["Thầy cô giáo", "Bác bảo vệ"], correct: 0, emoji: "👩‍🏫", subject: "Tự nhiên", topic: "Trường học", world: 5, level: 3 },
  { q: "Đồ dùng nào được các em học sinh dùng để đựng sách vở mang tới lớp?", options: ["Cái ba lô", "Hộp bút"], correct: 0, emoji: "🎒", subject: "Tự nhiên", topic: "Trường học", world: 5, level: 3 },
  { q: "Khi muốn phát biểu ý kiến hoặc trả lời bài trong lớp, em cần làm gì?", options: ["Giơ tay xin phép", "Nói to tự do luôn"], correct: 0, emoji: "🙋", subject: "Tự nhiên", topic: "Trường học", world: 5, level: 3 },
  { q: "Trong giờ ra chơi ở sân trường, chúng ta nên chơi với ai?", options: ["Chơi vui vẻ cùng bạn bè", "Một mình không chơi với ai"], correct: 0, emoji: "🤝", subject: "Tự nhiên", topic: "Trường học", world: 5, level: 3 },
  { q: "Chúng ta cần giữ vệ sinh lớp học như thế nào?", options: ["Vứt rác đúng nơi quy định", "Vứt rác ngay dưới gầm bàn"], correct: 0, emoji: "🧹", subject: "Tự nhiên", topic: "Trường học", world: 5, level: 3 },

  // Level 4: Thế giới động vật
  { q: "Con vật nào cất tiếng gáy 'ò ó o' mỗi buổi sáng sớm thức giấc?", options: ["Con gà trống", "Con gà mái"], correct: 0, emoji: "🐔", subject: "Tự nhiên", topic: "Động vật", world: 5, level: 4 },
  { q: "Con vật nào thường được nuôi trong nhà với mục đích trông giữ nhà?", options: ["Con chó", "Con mèo"], correct: 0, emoji: "🐕", subject: "Tự nhiên", topic: "Động vật", world: 5, level: 4 },
  { q: "Con vật nào là loài động vật hoang dã hung dữ sống trong rừng sâu?", options: ["Con hổ", "Con heo"], correct: 0, emoji: "🐅", subject: "Tự nhiên", topic: "Động vật", world: 5, level: 4 },
  { q: "Con vật nào nổi tiếng với chiếc cổ siêu dài giúp ăn lá cây trên cao?", options: ["Hươu cao cổ", "Con voi"], correct: 0, emoji: "🦒", subject: "Tự nhiên", topic: "Động vật", world: 5, level: 4 },
  { q: "Con vật nào có tai dài, đuôi ngắn, chạy nhanh và rất thích ăn cà rốt?", options: ["Con thỏ", "Con chuột"], correct: 0, emoji: "🐇", subject: "Tự nhiên", topic: "Động vật", world: 5, level: 4 },

  // Level 5: Thực vật quanh ta
  { q: "Để cây cối có thể sống khỏe mạnh và tươi tốt, cây cần có điều gì?", options: ["Được tưới nước và có ánh nắng", "Bánh kẹo ngọt"], correct: 0, emoji: "🌱", subject: "Tự nhiên", topic: "Thực vật", world: 5, level: 5 },
  { q: "Bộ phận nào của cây nằm sâu dưới đất có nhiệm vụ hút nước nuôi cây?", options: ["Rễ cây", "Lá cây"], correct: 0, emoji: "🌿", subject: "Tự nhiên", topic: "Thực vật", world: 5, level: 5 },
  { q: "Hoa hướng dương xinh đẹp khi nở luôn quay mặt về phía nào?", options: ["Phía mặt trời mọc", "Phía có gió lớn"], correct: 0, emoji: "🌻", subject: "Tự nhiên", topic: "Thực vật", world: 5, level: 5 },
  { q: "Quả nào có màu vàng, hình dáng cong cong và là món ăn yêu thích của khỉ?", options: ["Quả chuối", "Quả táo"], correct: 0, emoji: "🍌", subject: "Tự nhiên", topic: "Thực vật", world: 5, level: 5 },
  { q: "Quả dưa hấu có vỏ màu gì và ruột màu gì?", options: ["Vỏ xanh ruột đỏ", "Vỏ đỏ ruột vàng"], correct: 0, emoji: "🍉", subject: "Tự nhiên", topic: "Thực vật", world: 5, level: 5 },

  // Level 6: An toàn giao thông
  { q: "Khi gặp tín hiệu đèn giao thông màu đỏ, các phương tiện phải làm gì?", options: ["Dừng lại hẳn", "Đi thật nhanh qua"], correct: 0, emoji: "🔴", subject: "Tự nhiên", topic: "Giao thông", world: 5, level: 6 },
  { q: "Tín hiệu đèn giao thông màu xanh báo hiệu các phương tiện được làm gì?", options: ["Được phép di chuyển", "Dừng lại chờ"], correct: 0, emoji: "🟢", subject: "Tự nhiên", topic: "Giao thông", world: 5, level: 6 },
  { q: "Khi đi bộ sang bên kia đường, chúng ta nên đi ở khu vực nào?", options: ["Vạch kẻ trắng dành riêng cho người đi bộ", "Đi chéo qua xe cộ bất kỳ đâu"], correct: 0, emoji: "🚶", subject: "Tự nhiên", topic: "Giao thông", world: 5, level: 6 },
  { q: "Khi tham gia giao thông bằng xe máy cùng bố mẹ, bé cần đội gì?", options: ["Mũ bảo hiểm", "Chỉ cần đội mũ vải thường"], correct: 0, emoji: "🪖", subject: "Tự nhiên", topic: "Giao thông", world: 5, level: 6 },
  { q: "Khi đi trên vỉa hè hoặc sang đường, trẻ em nên đi cùng ai?", options: ["Nắm tay người lớn đi cùng", "Tự chạy nhảy một mình"], correct: 0, emoji: "🧑‍🤝‍🧑", subject: "Tự nhiên", topic: "Giao thông", world: 5, level: 6 }
]

// ─── GAME 2: NGHE VÀ CHỌN (4 lựa chọn) ──────────────────────────────────────
export const LISTEN_QUESTIONS = [
  // === WORLD 2: KHU RỪNG CHỮ CÁI ===
  // Level 1: Nguyên âm
  { word: "a", options: ["🅰️ Chữ a", "🅱️ Chữ b", "🆎 Chữ c", "🆑 Chữ d"], correct: 0, subject: "Tiếng Việt", topic: "Nguyên âm", world: 2, level: 1 },
  { word: "e", options: ["🅰️ Chữ a", "🇪 Chữ e", "🇮 Chữ i", "🅾️ Chữ o"], correct: 1, subject: "Tiếng Việt", topic: "Nguyên âm", world: 2, level: 1 },
  { word: "o", options: ["🇺 Chữ u", "🇾 Chữ y", "🅾️ Chữ o", "🇪 Chữ e"], correct: 2, subject: "Tiếng Việt", topic: "Nguyên âm", world: 2, level: 1 },
  { word: "u", options: ["🇺 Chữ u", "🇪 Chữ e", "🇮 Chữ i", "🅾️ Chữ o"], correct: 0, subject: "Tiếng Việt", topic: "Nguyên âm", world: 2, level: 1 },
  { word: "i", options: ["🅰️ Chữ a", "🇮 Chữ i", "🇺 Chữ u", "🇾 Chữ y"], correct: 1, subject: "Tiếng Việt", topic: "Nguyên âm", world: 2, level: 1 },
  { word: "y", options: ["🅰️ Chữ a", "🇮 Chữ i", "🇺 Chữ u", "🇾 Chữ y"], correct: 3, subject: "Tiếng Việt", topic: "Nguyên âm", world: 2, level: 1 },
  { word: "ơ", options: ["🅰️ Chữ a", "🅾️ Chữ o", "🆎 Chữ ơ", "🇪 Chữ e"], correct: 2, subject: "Tiếng Việt", topic: "Nguyên âm", world: 2, level: 1 },

  // Level 2: Phụ âm
  { word: "b", options: ["🅱️ Chữ b", "🆎 Chữ c", "🆑 Chữ d", "🆑 Chữ đ"], correct: 0, subject: "Tiếng Việt", topic: "Phụ âm", world: 2, level: 2 },
  { word: "c", options: ["🅱️ Chữ b", "🆎 Chữ c", "🆑 Chữ d", "🆑 Chữ đ"], correct: 1, subject: "Tiếng Việt", topic: "Phụ âm", world: 2, level: 2 },
  { word: "d", options: ["🅱️ Chữ b", "🆎 Chữ c", "🆑 Chữ d", "🆑 Chữ đ"], correct: 2, subject: "Tiếng Việt", topic: "Phụ âm", world: 2, level: 2 },
  { word: "đ", options: ["🅱️ Chữ b", "🆎 Chữ c", "🆑 Chữ d", "🆑 Chữ đ"], correct: 3, subject: "Tiếng Việt", topic: "Phụ âm", world: 2, level: 2 },
  { word: "g", options: ["🇬 Chữ g", "🇭 Chữ h", "🇰 Chữ k", "🇱 Chữ l"], correct: 0, subject: "Tiếng Việt", topic: "Phụ âm", world: 2, level: 2 },
  { word: "h", options: ["🇬 Chữ g", "🇭 Chữ h", "🇰 Chữ k", "🇱 Chữ l"], correct: 1, subject: "Tiếng Việt", topic: "Phụ âm", world: 2, level: 2 },
  { word: "l", options: ["🇬 Chữ g", "🇭 Chữ h", "🇰 Chữ k", "🇱 Chữ l"], correct: 3, subject: "Tiếng Việt", topic: "Phụ âm", world: 2, level: 2 },

  // Level 3: Ghép âm
  { word: "ba", options: ["👨 Ba", "🐶 Chó", "🐱 Mèo", "🐔 Gà"], correct: 0, subject: "Tiếng Việt", topic: "Ghép âm", world: 2, level: 3 },
  { word: "bé", options: ["👶 Bé", "🐮 Bò", "🐸 Ếch", "🐟 Cá"], correct: 0, subject: "Tiếng Việt", topic: "Ghép âm", world: 2, level: 3 },
  { word: "bò", options: ["👶 Bé", "🐮 Bò", "🐸 Ếch", "🐟 Cá"], correct: 1, subject: "Tiếng Việt", topic: "Ghép âm", world: 2, level: 3 },
  { word: "cá", options: ["👶 Bé", "🐮 Bò", "🐸 Ếch", "🐟 Cá"], correct: 3, subject: "Tiếng Việt", topic: "Ghép âm", world: 2, level: 3 },
  { word: "gà", options: ["🦆 Vịt", "🐶 Chó", "🐔 Gà", "🐸 Ếch"], correct: 2, subject: "Tiếng Việt", topic: "Ghép âm", world: 2, level: 3 },
  { word: "me", options: ["🥭 Xoài", "🍈 Dưa", "🍇 Nho", "🌿 Me chua"], correct: 3, subject: "Tiếng Việt", topic: "Ghép âm", world: 2, level: 3 },

  // Level 4: Đọc từ
  { word: "quả táo", options: ["🍌 Chuối", "🍎 Táo", "🍊 Cam", "🍇 Nho"], correct: 1, subject: "Tiếng Việt", topic: "Đọc từ", world: 2, level: 4 },
  { word: "quả chuối", options: ["🍌 Chuối", "🍎 Táo", "🍉 Dưa hấu", "🍊 Cam"], correct: 0, subject: "Tiếng Việt", topic: "Đọc từ", world: 2, level: 4 },
  { word: "quyển sách", options: ["📚 Sách", "✏️ Bút chì", "📐 Thước", "🎒 Ba lô"], correct: 0, subject: "Tiếng Việt", topic: "Đọc từ", world: 2, level: 4 },
  { word: "cái thước", options: ["📚 Sách", "✏️ Bút chì", "📐 Thước", "🎒 Ba lô"], correct: 2, subject: "Tiếng Việt", topic: "Đọc từ", world: 2, level: 4 },
  { word: "màu đỏ", options: ["🔴 Đỏ", "🔵 Xanh dương", "🟢 Xanh lá", "🟡 Vàng"], correct: 0, subject: "Tiếng Việt", topic: "Đọc từ", world: 2, level: 4 },
  { word: "màu vàng", options: ["🔴 Đỏ", "🔵 Xanh dương", "⚫ Đen", "🟡 Vàng"], correct: 3, subject: "Tiếng Việt", topic: "Đọc từ", world: 2, level: 4 }
]

// ─── GAME 3: GHÉP ĐÔI ────────────────────────────────────────────────────────
export const MATCHING_PAIRS_ALL = [
  // === WORLD 3: VƯƠNG QUỐC GHÉP ĐÔI ===
  // Level 1: Ghép chữ cái hoa-thường
  { id: 1, left: "A", right: "a", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },
  { id: 2, left: "B", right: "b", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },
  { id: 3, left: "C", right: "c", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },
  { id: 4, left: "D", right: "d", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },
  { id: 5, left: "E", right: "e", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },
  { id: 6, left: "G", right: "g", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },
  { id: 7, left: "H", right: "h", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },
  { id: 8, left: "I", right: "i", subject: "Tiếng Việt", topic: "Chữ cái", world: 3, level: 1 },

  // Level 2: Ghép hình & từ con vật/quả
  { id: 9, left: "🐱", right: "Con mèo", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },
  { id: 10, left: "🐶", right: "Con chó", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },
  { id: 11, left: "🐮", right: "Con bò", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },
  { id: 12, left: "🐸", right: "Con ếch", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },
  { id: 13, left: "🐟", right: "Con cá", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },
  { id: 14, left: "🐔", right: "Con gà", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },
  { id: 15, left: "🍎", right: "Quả táo", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },
  { id: 16, left: "🍌", right: "Quả chuối", subject: "Tiếng Việt", topic: "Ghép hình", world: 3, level: 2 },

  // Level 3: Ghép nghề nghiệp, đồ vật tương ứng
  { id: 17, left: "👨‍⚕️ Bác sĩ", right: "🏥 Bệnh viện", subject: "Tự nhiên", topic: "Nghề nghiệp", world: 3, level: 3 },
  { id: 18, left: "👩‍🏫 Cô giáo", right: "🏫 Trường học", subject: "Tự nhiên", topic: "Nghề nghiệp", world: 3, level: 3 },
  { id: 19, left: "👮 Công an", right: "🚓 Đồn công an", subject: "Tự nhiên", topic: "Nghề nghiệp", world: 3, level: 3 },
  { id: 20, left: "👨‍🚒 Cứu hỏa", right: "🚒 Xe cứu hỏa", subject: "Tự nhiên", topic: "Nghề nghiệp", world: 3, level: 3 },
  { id: 21, left: "📚 Sách vở", right: "✏️ Bút chì", subject: "Tự nhiên", topic: "Đồ dùng", world: 3, level: 3 },
  { id: 22, left: "🎒 Ba lô", right: "📐 Thước kẻ", subject: "Tự nhiên", topic: "Đồ dùng", world: 3, level: 3 },
  { id: 23, left: "🎨 Bảng màu", right: "🖌️ Cây cọ vẽ", subject: "Tự nhiên", topic: "Đồ dùng", world: 3, level: 3 }
]

CHOOSE_QUESTIONS.push(
  { q: "Sau số 12 là số nào?", options: ["13", "11"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 20", world: 1, level: 4 },
  { q: "Số nào gồm 1 chục và 5 đơn vị?", options: ["15", "51"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Số đến 20", world: 1, level: 4 },
  { q: "Số nào lớn hơn?", options: ["18", "14"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 20", world: 1, level: 4 },
  { q: "Số nào nhỏ hơn?", options: ["16", "19"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 20", world: 1, level: 4 },
  { q: "Đếm thêm 1 từ 19 ta được số nào?", options: ["20", "18"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 20", world: 1, level: 4 },
  { q: "Số 17 gồm mấy chục và mấy đơn vị?", options: ["1 chục 7 đơn vị", "7 chục 1 đơn vị"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Số đến 20", world: 1, level: 4 },
  { q: "Số 42 gồm mấy chục và mấy đơn vị?", options: ["4 chục 2 đơn vị", "2 chục 4 đơn vị"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Số đến 100", world: 1, level: 5 },
  { q: "Số nào lớn hơn?", options: ["68", "59"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 100", world: 1, level: 5 },
  { q: "Số liền sau của 79 là số nào?", options: ["80", "78"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 100", world: 1, level: 5 },
  { q: "Số liền trước của 50 là số nào?", options: ["49", "51"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 100", world: 1, level: 5 },
  { q: "Số nào có 7 chục và 3 đơn vị?", options: ["73", "37"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Số đến 100", world: 1, level: 5 },
  { q: "Trong các số sau, số nào bé hơn?", options: ["24", "42"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số đến 100", world: 1, level: 5 },
  { q: "Bánh xe thường có dạng hình gì?", options: ["Hình tròn", "Hình tam giác"], correct: 0, emoji: "⭕", subject: "Toán", topic: "Hình học", world: 1, level: 6 },
  { q: "Mặt bàn học thường gần giống hình gì?", options: ["Hình chữ nhật", "Hình tròn"], correct: 0, emoji: "▭", subject: "Toán", topic: "Hình học", world: 1, level: 6 },
  { q: "Biển báo nguy hiểm thường có dạng hình gì?", options: ["Hình tam giác", "Hình vuông"], correct: 0, emoji: "🔺", subject: "Toán", topic: "Hình học", world: 1, level: 6 },
  { q: "Viên xúc xắc gần giống khối nào?", options: ["Khối lập phương", "Khối cầu"], correct: 0, emoji: "🎲", subject: "Toán", topic: "Hình học", world: 1, level: 6 },
  { q: "Quả bóng gần giống khối nào?", options: ["Khối cầu", "Khối hộp chữ nhật"], correct: 0, emoji: "⚽", subject: "Toán", topic: "Hình học", world: 1, level: 6 },
  { q: "Khung ảnh có 4 cạnh bằng nhau thường là hình gì?", options: ["Hình vuông", "Hình tròn"], correct: 0, emoji: "⬛", subject: "Toán", topic: "Hình học", world: 1, level: 6 },
  { q: "30 + 20 = ?", options: ["50", "40"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng trừ đến 100", world: 4, level: 6 },
  { q: "45 + 3 = ?", options: ["48", "75"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng trừ đến 100", world: 4, level: 6 },
  { q: "60 - 20 = ?", options: ["40", "80"], correct: 0, emoji: "➖", subject: "Toán", topic: "Cộng trừ đến 100", world: 4, level: 6 },
  { q: "78 - 5 = ?", options: ["73", "83"], correct: 0, emoji: "➖", subject: "Toán", topic: "Cộng trừ đến 100", world: 4, level: 6 },
  { q: "52 + 6 = ?", options: ["58", "56"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng trừ đến 100", world: 4, level: 6 },
  { q: "90 - 30 = ?", options: ["60", "70"], correct: 0, emoji: "➖", subject: "Toán", topic: "Cộng trừ đến 100", world: 4, level: 6 },
  { q: "Cái bút dài 12 cm, cái tẩy dài 4 cm. Vật nào dài hơn?", options: ["Cái bút", "Cái tẩy"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đo độ dài", world: 4, level: 7 },
  { q: "Đơn vị xăng-ti-mét viết tắt là gì?", options: ["cm", "kg"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đo độ dài", world: 4, level: 7 },
  { q: "Sợi dây 8 cm và que tính 10 cm. Vật nào ngắn hơn?", options: ["Sợi dây", "Que tính"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đo độ dài", world: 4, level: 7 },
  { q: "Muốn đo chiều dài quyển vở, em dùng gì?", options: ["Thước kẻ", "Cốc nước"], correct: 0, emoji: "📐", subject: "Toán", topic: "Đo độ dài", world: 4, level: 7 },
  { q: "5 cm và 7 cm, số đo nào dài hơn?", options: ["7 cm", "5 cm"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đo độ dài", world: 4, level: 7 },
  { q: "Hai đoạn thẳng cùng dài 6 cm thì chúng như thế nào?", options: ["Dài bằng nhau", "Một đoạn dài hơn"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đo độ dài", world: 4, level: 7 },
  { q: "Sau thứ Hai là thứ mấy?", options: ["Thứ Ba", "Chủ nhật"], correct: 0, emoji: "📅", subject: "Toán", topic: "Thời gian", world: 4, level: 8 },
  { q: "Một tuần có mấy ngày?", options: ["7 ngày", "5 ngày"], correct: 0, emoji: "📅", subject: "Toán", topic: "Thời gian", world: 4, level: 8 },
  { q: "Kim dài của đồng hồ chỉ số 12, kim ngắn chỉ số 7 là mấy giờ?", options: ["7 giờ", "12 giờ"], correct: 0, emoji: "🕖", subject: "Toán", topic: "Thời gian", world: 4, level: 8 },
  { q: "Hôm nay là thứ Sáu, ngày mai là thứ mấy?", options: ["Thứ Bảy", "Thứ Năm"], correct: 0, emoji: "📅", subject: "Toán", topic: "Thời gian", world: 4, level: 8 },
  { q: "Buổi sáng em thường làm gì?", options: ["Thức dậy đi học", "Đi ngủ qua đêm"], correct: 0, emoji: "🌤️", subject: "Toán", topic: "Thời gian", world: 4, level: 8 },
  { q: "Đồng hồ chỉ đúng 3 giờ thì kim ngắn chỉ số mấy?", options: ["3", "6"], correct: 0, emoji: "🕒", subject: "Toán", topic: "Thời gian", world: 4, level: 8 },
  { q: "Người chữa bệnh cho mọi người là ai?", options: ["Bác sĩ", "Người bán bánh"], correct: 0, emoji: "👩‍⚕️", subject: "Tự nhiên", topic: "Cộng đồng", world: 5, level: 7 },
  { q: "Khi đến thư viện, em nên làm gì?", options: ["Nói nhỏ và giữ trật tự", "Chạy nhảy thật to"], correct: 0, emoji: "📚", subject: "Tự nhiên", topic: "Cộng đồng", world: 5, level: 7 },
  { q: "Người giữ gìn an toàn giao thông là ai?", options: ["Chú công an", "Cầu thủ bóng đá"], correct: 0, emoji: "👮", subject: "Tự nhiên", topic: "Cộng đồng", world: 5, level: 7 },
  { q: "Khi gặp người lớn tuổi, em nên làm gì?", options: ["Chào hỏi lễ phép", "Quay đi không nói gì"], correct: 0, emoji: "🙇", subject: "Tự nhiên", topic: "Cộng đồng", world: 5, level: 7 },
  { q: "Ở công viên, em nên bỏ rác vào đâu?", options: ["Thùng rác", "Bãi cỏ"], correct: 0, emoji: "🗑️", subject: "Tự nhiên", topic: "Cộng đồng", world: 5, level: 7 },
  { q: "Trời mưa, em nên mang theo gì?", options: ["Áo mưa hoặc ô", "Kính râm đi biển"], correct: 0, emoji: "🌧️", subject: "Tự nhiên", topic: "Thời tiết", world: 5, level: 8 },
  { q: "Trời nắng gắt, em nên làm gì khi ra ngoài?", options: ["Đội mũ", "Không cần che nắng"], correct: 0, emoji: "☀️", subject: "Tự nhiên", topic: "Thời tiết", world: 5, level: 8 },
  { q: "Khi trời lạnh, em nên mặc gì?", options: ["Áo ấm", "Áo mỏng đi biển"], correct: 0, emoji: "🧥", subject: "Tự nhiên", topic: "Thời tiết", world: 5, level: 8 },
  { q: "Dấu hiệu nào cho biết trời sắp mưa?", options: ["Mây đen kéo đến", "Trời trong xanh mãi"], correct: 0, emoji: "☁️", subject: "Tự nhiên", topic: "Thời tiết", world: 5, level: 8 },
  { q: "Sau cơn mưa, đường có thể như thế nào?", options: ["Trơn ướt", "Luôn khô ráo"], correct: 0, emoji: "🌧️", subject: "Tự nhiên", topic: "Thời tiết", world: 5, level: 8 },
  { q: "Để lớp học sạch đẹp, em cần làm gì?", options: ["Bỏ rác đúng nơi", "Xé giấy vứt xuống sàn"], correct: 0, emoji: "🧹", subject: "Tự nhiên", topic: "Môi trường", world: 5, level: 9 },
  { q: "Khi đánh răng, để tiết kiệm nước em nên làm gì?", options: ["Khóa vòi khi không dùng", "Mở vòi liên tục"], correct: 0, emoji: "🚰", subject: "Tự nhiên", topic: "Môi trường", world: 5, level: 9 },
  { q: "Cây xanh cần gì để lớn lên?", options: ["Nước, ánh sáng và chăm sóc", "Rác bẩn"], correct: 0, emoji: "🌱", subject: "Tự nhiên", topic: "Môi trường", world: 5, level: 9 },
  { q: "Việc nào giúp bảo vệ môi trường?", options: ["Trồng và chăm sóc cây", "Bẻ cành cây"], correct: 0, emoji: "🌳", subject: "Tự nhiên", topic: "Môi trường", world: 5, level: 9 },
  { q: "Pin cũ và đồ sắc nhọn nên để ở đâu?", options: ["Nơi thu gom an toàn", "Trong hộp đồ chơi"], correct: 0, emoji: "♻️", subject: "Tự nhiên", topic: "Môi trường", world: 5, level: 9 }
)

LISTEN_QUESTIONS.push(
  { word: "ma", options: ["ma", "má", "mà", "mạ"], correct: 0, subject: "Tiếng Việt", topic: "Dấu thanh", world: 2, level: 5 },
  { word: "má", options: ["ma", "má", "mà", "mả"], correct: 1, subject: "Tiếng Việt", topic: "Dấu thanh", world: 2, level: 5 },
  { word: "mà", options: ["má", "mà", "mã", "mạ"], correct: 1, subject: "Tiếng Việt", topic: "Dấu thanh", world: 2, level: 5 },
  { word: "mả", options: ["mả", "mã", "ma", "má"], correct: 0, subject: "Tiếng Việt", topic: "Dấu thanh", world: 2, level: 5 },
  { word: "mã", options: ["mà", "mạ", "mã", "ma"], correct: 2, subject: "Tiếng Việt", topic: "Dấu thanh", world: 2, level: 5 },
  { word: "mạ", options: ["má", "mạ", "mả", "mã"], correct: 1, subject: "Tiếng Việt", topic: "Dấu thanh", world: 2, level: 5 },
  { word: "bàn", options: ["bàn", "bát", "bên", "bông"], correct: 0, subject: "Tiếng Việt", topic: "Vần cơ bản", world: 2, level: 6 },
  { word: "mắt", options: ["mẹ", "mắt", "mông", "minh"], correct: 1, subject: "Tiếng Việt", topic: "Vần cơ bản", world: 2, level: 6 },
  { word: "sen", options: ["sam", "sen", "sông", "sinh"], correct: 1, subject: "Tiếng Việt", topic: "Vần cơ bản", world: 2, level: 6 },
  { word: "kem", options: ["kim", "kem", "cong", "can"], correct: 1, subject: "Tiếng Việt", topic: "Vần cơ bản", world: 2, level: 6 },
  { word: "bông", options: ["bên", "bông", "ban", "bát"], correct: 1, subject: "Tiếng Việt", topic: "Vần cơ bản", world: 2, level: 6 },
  { word: "xinh", options: ["xanh", "xong", "xinh", "xem"], correct: 2, subject: "Tiếng Việt", topic: "Vần cơ bản", world: 2, level: 6 },
  { word: "Bé đi học.", options: ["👧🎒 Bé đi học", "🐟 Cá đang bơi", "🍎 Quả táo", "🌧️ Trời mưa"], correct: 0, subject: "Tiếng Việt", topic: "Câu ngắn", world: 2, level: 7 },
  { word: "Mẹ bế em.", options: ["👩‍🍼 Mẹ bế em", "🚌 Xe buýt", "🐔 Con gà", "📚 Quyển sách"], correct: 0, subject: "Tiếng Việt", topic: "Câu ngắn", world: 2, level: 7 },
  { word: "Con mèo nằm ngủ.", options: ["🐱💤 Mèo ngủ", "🐶 Chó chạy", "👧 Bé đọc sách", "🌳 Cây xanh"], correct: 0, subject: "Tiếng Việt", topic: "Câu ngắn", world: 2, level: 7 },
  { word: "Bố đọc sách.", options: ["👨📖 Bố đọc sách", "👩 Nấu cơm", "🚲 Đi xe", "🌧️ Mưa rơi"], correct: 0, subject: "Tiếng Việt", topic: "Câu ngắn", world: 2, level: 7 },
  { word: "Bạn Lan vẽ hoa.", options: ["👧🎨 Vẽ hoa", "👦 Đá bóng", "🐟 Bơi dưới nước", "🍌 Ăn chuối"], correct: 0, subject: "Tiếng Việt", topic: "Câu ngắn", world: 2, level: 7 },
  { word: "Cả lớp hát vui.", options: ["👧👦🎵 Cả lớp hát", "🏥 Bệnh viện", "🚦 Đèn đỏ", "🧹 Quét nhà"], correct: 0, subject: "Tiếng Việt", topic: "Câu ngắn", world: 2, level: 7 }
)

MATCHING_PAIRS_ALL.push(
  { id: 24, left: "1", right: "🍎", subject: "Toán", topic: "Số và lượng", world: 3, level: 4 },
  { id: 25, left: "2", right: "⭐⭐", subject: "Toán", topic: "Số và lượng", world: 3, level: 4 },
  { id: 26, left: "3", right: "🐟🐟🐟", subject: "Toán", topic: "Số và lượng", world: 3, level: 4 },
  { id: 27, left: "4", right: "🌸🌸🌸🌸", subject: "Toán", topic: "Số và lượng", world: 3, level: 4 },
  { id: 28, left: "5", right: "✏️✏️✏️✏️✏️", subject: "Toán", topic: "Số và lượng", world: 3, level: 4 },
  { id: 29, left: "6", right: "🍬🍬🍬🍬🍬🍬", subject: "Toán", topic: "Số và lượng", world: 3, level: 4 },
  { id: 30, left: "⭕ Hình tròn", right: "⚽ Quả bóng", subject: "Toán", topic: "Hình học", world: 3, level: 5 },
  { id: 31, left: "⬛ Hình vuông", right: "🪟 Ô cửa vuông", subject: "Toán", topic: "Hình học", world: 3, level: 5 },
  { id: 32, left: "🔺 Hình tam giác", right: "⚠️ Biển báo", subject: "Toán", topic: "Hình học", world: 3, level: 5 },
  { id: 33, left: "▭ Hình chữ nhật", right: "📘 Quyển sách", subject: "Toán", topic: "Hình học", world: 3, level: 5 },
  { id: 34, left: "🎲 Khối lập phương", right: "Xúc xắc", subject: "Toán", topic: "Hình học", world: 3, level: 5 },
  { id: 35, left: "🥫 Khối trụ", right: "Lon sữa", subject: "Toán", topic: "Hình học", world: 3, level: 5 },
  { id: 36, left: "Bé chào cô.", right: "🙋‍♀️ Chào hỏi", subject: "Tiếng Việt", topic: "Câu và ý", world: 3, level: 6 },
  { id: 37, left: "Em rửa tay.", right: "🧼 Giữ sạch", subject: "Tiếng Việt", topic: "Câu và ý", world: 3, level: 6 },
  { id: 38, left: "Bạn đọc sách.", right: "📖 Học bài", subject: "Tiếng Việt", topic: "Câu và ý", world: 3, level: 6 },
  { id: 39, left: "Mẹ tưới cây.", right: "🌱 Chăm cây", subject: "Tiếng Việt", topic: "Câu và ý", world: 3, level: 6 },
  { id: 40, left: "Bố nấu cơm.", right: "🍚 Chuẩn bị bữa ăn", subject: "Tiếng Việt", topic: "Câu và ý", world: 3, level: 6 },
  { id: 41, left: "Em bỏ rác.", right: "🗑️ Đúng nơi", subject: "Tiếng Việt", topic: "Câu và ý", world: 3, level: 6 }
)

// ─── UTILITIES ────────────────────────────────────────────────────────────────
/** Xáo trộn mảng (Fisher-Yates) */
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Lấy n câu ngẫu nhiên, có thể lọc theo subject */
export function pickRandom(arr, n, subjectFilter = null) {
  const pool = subjectFilter ? arr.filter(q => q.subject === subjectFilter) : arr
  return shuffle(pool).slice(0, n)
}

/** Lấy ngân hàng câu hỏi động dựa trên thế giới và level */
export function getQuestionsForGame(worldId, levelId, isBoss = false) {
  const wId = parseInt(worldId, 10)
  const lId = parseInt(levelId, 10)

  // --- World 1: Ngôi làng Số Học (Game: Choose 1 of 2) ---
  if (wId === 1) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 1)
    if (isBoss) {
      return shuffle(pool).slice(0, 10) // 10 câu cho trận trùm số học
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 5) // 5 câu mỗi phiên chơi
  }

  // --- World 2: Khu rừng Chữ Cái (Game: Listen & Select) ---
  if (wId === 2) {
    const pool = LISTEN_QUESTIONS.filter(q => q.world === 2)
    if (isBoss) {
      return shuffle(pool).slice(0, 10) // 10 câu cho trận trùm tiếng Việt
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 6) // 6 câu mỗi phiên chơi
  }

  // --- World 3: Vương quốc Ghép Đôi (Game: Simple Matching) ---
  if (wId === 3) {
    const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 3)
    if (isBoss) {
      // Trận đấu Boss cần ghép 8 cặp ngẫu nhiên (tổng cộng 16 thẻ)
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 5) // 5 cặp cho mỗi level thường
  }

  // --- World 4: Thành phố Toán Học (Game: Choose 1 of 2) ---
  if (wId === 4) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 4)
    if (isBoss) {
      return shuffle(pool).slice(0, 12) // 12 câu cho trận trùm toán nâng cao
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 5) // 5 câu mỗi phiên chơi
  }

  // --- World 5: Hành tinh Khám Phá (Game: Choose 1 of 2) ---
  if (wId === 5) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 5)
    if (isBoss) {
      return shuffle(pool).slice(0, 15) // 15 câu cho trận trùm thế giới tự nhiên
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 5) // 5 câu mỗi phiên chơi
  }

  return []
}

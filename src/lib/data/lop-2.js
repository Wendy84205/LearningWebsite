/**
 * lop-2.js
 * Ngân hàng câu hỏi chuẩn chương trình Lớp 2 Việt Nam theo từng Thế giới (Worlds)
 * Môn: Toán | Tiếng Việt | Tự nhiên & Xã hội | IQ | Kỹ năng sống
 */

export const WORLDS = [
  {
    id: 1,
    name: "Vương quốc Số Học",
    icon: "🏰",
    color: "#005da7",
    textColor: "#005da7",
    bgColor: "#d0e4ff",
    borderColor: "#005da7",
    medal: "🥉",
    medalName: "Huy hiệu Số Học",
    desc: "Đếm số đến 1000, so sánh lớn bé, sắp xếp số và hình học phẳng.",
    levels: [
      { id: 1, title: "Đếm số đến 1000", desc: "Học đếm các số từ 100 đến 1000", stages: 5, game: "/game-choose-1-of-2?world=1&level=1" },
      { id: 2, title: "So sánh số", desc: "So sánh lớn hơn, nhỏ hơn hoặc bằng nhau", stages: 5, game: "/game-choose-1-of-2?world=1&level=2" },
      { id: 3, title: "Sắp xếp số", desc: "Sắp xếp theo thứ tự tăng dần hoặc giảm dần", stages: 5, game: "/game-choose-1-of-2?world=1&level=3" },
      { id: 4, title: "Hình học phẳng", desc: "Nhận biết hình vuông, hình chữ nhật, hình tam giác, hình tròn", stages: 5, game: "/game-choose-1-of-2?world=1&level=4" }
    ],
    bossName: "Thử thách Làng Số Học",
    bossDesc: "Hỏi đáp tổng hợp để nhận Huy hiệu Số Học",
    bossGame: "/game-choose-1-of-2?world=1&boss=true"
  },
  {
    id: 2,
    name: "Thành phố Phép Tính",
    icon: "➕",
    color: "#b71c1c",
    textColor: "#b71c1c",
    bgColor: "#ffebee",
    borderColor: "#ffcdd2",
    medal: "💎",
    medalName: "Viên Ngọc Toán Học",
    desc: "Phép cộng, trừ có nhớ, bảng nhân chia và giải toán có lời văn.",
    levels: [
      { id: 1, title: "Cộng có nhớ", desc: "Phép tính cộng có nhớ trong phạm vi 100", stages: 5, game: "/game-choose-1-of-2?world=2&level=1" },
      { id: 2, title: "Trừ có nhớ", desc: "Phép tính trừ có nhớ trong phạm vi 100", stages: 5, game: "/game-choose-1-of-2?world=2&level=2" },
      { id: 3, title: "Bảng nhân 2", desc: "Học thuộc lòng bảng nhân 2", stages: 5, game: "/game-choose-1-of-2?world=2&level=3" },
      { id: 4, title: "Bảng nhân 3", desc: "Học thuộc lòng bảng nhân 3", stages: 5, game: "/game-choose-1-of-2?world=2&level=4" },
      { id: 5, title: "Bảng nhân 4", desc: "Học thuộc lòng bảng nhân 4", stages: 5, game: "/game-choose-1-of-2?world=2&level=5" },
      { id: 6, title: "Phép chia cơ bản", desc: "Bảng chia 2, 3 và 4 cơ bản", stages: 5, game: "/game-choose-1-of-2?world=2&level=6" },
      { id: 7, title: "Toán có lời văn", desc: "Bài toán giải lời văn đơn giản", stages: 5, game: "/game-choose-1-of-2?world=2&level=7" }
    ],
    bossName: "Trận chiến tính nhẩm",
    bossDesc: "Câu hỏi phép tính tổng hợp cực kỳ gay cấn",
    bossGame: "/game-choose-1-of-2?world=2&boss=true"
  },
  {
    id: 3,
    name: "Thư viện Tiếng Việt",
    icon: "📖",
    color: "#4a148c",
    textColor: "#4a148c",
    bgColor: "#f3e5f5",
    borderColor: "#e1bee7",
    medal: "📚",
    medalName: "Nhà Đọc Sách",
    desc: "Đọc hiểu câu văn ngắn, sửa lỗi chính tả, từ và câu, dấu câu.",
    levels: [
      { id: 1, title: "Đọc từ vựng", desc: "Nghe phát âm từ vựng tiếng Việt lớp 2 và chọn đúng", stages: 5, game: "/game-listen-and-select?world=3&level=1" },
      { id: 2, title: "Đọc câu dài", desc: "Nghe đọc câu dài và chọn hình ảnh phù hợp", stages: 5, game: "/game-listen-and-select?world=3&level=2" },
      { id: 3, title: "Đọc hiểu đoạn văn", desc: "Đọc đoạn văn ngắn và trả lời câu hỏi", stages: 5, game: "/game-choose-1-of-2?world=3&level=3" },
      { id: 4, title: "Chính tả tiếng Việt", desc: "Điền âm tr/ch, s/x, g/gh còn thiếu vào từ", stages: 5, game: "/game-choose-1-of-2?world=3&level=4" },
      { id: 5, title: "Từ và Câu", desc: "Phân loại Danh từ, Động từ, Từ chỉ đặc điểm", stages: 5, game: "/game-simple-matching?world=3&level=5" },
      { id: 6, title: "Dấu câu tiếng Việt", desc: "Cách dùng dấu chấm, dấu phẩy, dấu hỏi, dấu chấm than", stages: 5, game: "/game-choose-1-of-2?world=3&level=6" },
      { id: 7, title: "Sắp xếp câu & Kể chuyện", desc: "Sắp xếp thứ tự các câu để tạo thành đoạn văn kể chuyện hợp lý", stages: 5, game: "/game-choose-1-of-2?world=3&level=7" }
    ],
    bossName: "Trạng nguyên nhí",
    bossDesc: "Hỏi đáp từ vựng & ngữ pháp nâng cao",
    bossGame: "/game-choose-1-of-2?world=3&boss=true"
  },
  {
    id: 4,
    name: "Nhà khoa học Nhí",
    icon: "🔬",
    color: "#1b5e20",
    textColor: "#1b5e20",
    bgColor: "#e8f5e9",
    borderColor: "#c8e6c9",
    medal: "🧪",
    medalName: "Nhà Khoa Học Nhí",
    desc: "Khám phá cơ thể, gia đình, nhà trường, sinh vật và môi trường.",
    levels: [
      { id: 1, title: "Cơ thể em", desc: "Các cơ quan vận động, tiêu hóa của con người và vệ sinh", stages: 5, game: "/game-choose-1-of-2?world=4&level=1" },
      { id: 2, title: "Gia đình yêu thương", desc: "Xưng hô đúng với ông bà, họ hàng và vai trò thành viên", stages: 5, game: "/game-choose-1-of-2?world=4&level=2" },
      { id: 3, title: "Trường học mến yêu", desc: "Các hoạt động học tập, thầy cô và bạn bè thân thiết", stages: 5, game: "/game-choose-1-of-2?world=4&level=3" },
      { id: 4, title: "Thế giới động vật", desc: "Nơi sống và phân loại động vật nuôi, hoang dã", stages: 5, game: "/game-choose-1-of-2?world=4&level=4" },
      { id: 5, title: "Thực vật quanh em", desc: "Các bộ phận của cây và lợi ích của cây xanh", stages: 5, game: "/game-choose-1-of-2?world=4&level=5" },
      { id: 6, title: "Thời tiết bốn mùa", desc: "Đặc điểm của thời tiết nắng, mưa, gió, bão quanh em", stages: 5, game: "/game-choose-1-of-2?world=4&level=6" },
      { id: 7, title: "Bảo vệ môi trường", desc: "Cách phân loại rác và giữ gìn môi trường sống xanh", stages: 5, game: "/game-choose-1-of-2?world=4&level=7" }
    ],
    bossName: "Nhà nghiên cứu tài ba",
    bossDesc: "Thử thách hiểu biết thế giới xung quanh",
    bossGame: "/game-choose-1-of-2?world=4&boss=true"
  },
  {
    id: 5,
    name: "Thử thách IQ",
    icon: "🧠",
    color: "#e65100",
    textColor: "#e65100",
    bgColor: "#fff3e0",
    borderColor: "#ffe0b2",
    medal: "⭐",
    medalName: "Bộ Não Vàng",
    desc: "Rèn luyện tư duy logic, tìm quy luật và trí nhớ ngắn hạn.",
    levels: [
      { id: 1, title: "Tìm hình khác biệt", desc: "Tìm một hình không thuộc nhóm còn lại", stages: 5, game: "/game-choose-1-of-2?world=5&level=1" },
      { id: 2, title: "Tìm quy luật số", desc: "Điền số tiếp theo vào chuỗi quy luật số học", stages: 5, game: "/game-choose-1-of-2?world=5&level=2" },
      { id: 3, title: "Tìm đường mê cung", desc: "Chọn hướng đi đúng để thoát khỏi mê cung", stages: 5, game: "/game-choose-1-of-2?world=5&level=3" },
      { id: 4, title: "Ghép hình logic", desc: "Tìm mảnh ghép còn thiếu của bức tranh", stages: 5, game: "/game-simple-matching?world=5&level=4" },
      { id: 5, title: "Thử thách trí nhớ", desc: "Nhớ nhanh vị trí các cặp thẻ ẩn", stages: 5, game: "/game-simple-matching?world=5&level=5" }
    ],
    bossName: "Đỉnh cao trí tuệ",
    bossDesc: "Vượt qua thử thách IQ siêu tốc nhận Bộ Não Vàng",
    bossGame: "/game-simple-matching?world=5&boss=true"
  },
  {
    id: 6,
    name: "Kỹ năng & Thực tế",
    icon: "🏆",
    color: "#0060ac",
    textColor: "#0d47a1",
    bgColor: "#e3f2fd",
    borderColor: "#bbdefb",
    medal: "🌟",
    medalName: "Công Dân Nhỏ",
    desc: "Giao tiếp lịch sự, tự lập, an toàn và bài toán thực tế đời sống.",
    levels: [
      { id: 1, title: "Giao tiếp & Hợp tác", desc: "Chào hỏi lịch sự, biết cảm ơn, xin lỗi và chia sẻ cùng bạn bè", stages: 5, game: "/game-choose-1-of-2?world=6&level=1" },
      { id: 2, title: "Kỹ năng tự phục vụ", desc: "Chuẩn bị sách vở, giữ gìn đồ dùng học tập sạch sẽ", stages: 5, game: "/game-choose-1-of-2?world=6&level=2" },
      { id: 3, title: "Phòng tránh nguy hiểm", desc: "Tránh nguy hiểm từ điện, lửa, vật sắc nhọn ở nhà", stages: 5, game: "/game-choose-1-of-2?world=6&level=3" },
      { id: 4, title: "Siêu thị & Tiền tệ", desc: "Sử dụng tiền Việt Nam và phép tính mua sắm đơn giản", stages: 5, game: "/game-choose-1-of-2?world=6&level=4" },
      { id: 5, title: "Đo lường cơ bản", desc: "Làm quen đơn vị đo cm, m, kg, lít nước", stages: 5, game: "/game-choose-1-of-2?world=6&level=5" },
      { id: 6, title: "Đồng hồ & Lịch", desc: "Đọc xem giờ đúng, giờ rưỡi và thứ ngày tháng", stages: 5, game: "/game-choose-1-of-2?world=6&level=6" },
      { id: 7, title: "An toàn giao thông", desc: "Quy tắc an toàn khi đi bộ, đi xe máy cùng người lớn", stages: 5, game: "/game-choose-1-of-2?world=6&level=7" }
    ],
    bossName: "Công dân thông thái",
    bossDesc: "Vận dụng kiến thức thực tế vào các tình huống",
    bossGame: "/game-choose-1-of-2?world=6&boss=true"
  },
  {
    id: 7,
    name: "Tháp Tri Thức",
    icon: "👑",
    color: "#ffd600",
    textColor: "#f57f17",
    bgColor: "#fffde7",
    borderColor: "#fff9c4",
    medal: "👑",
    medalName: "Vua Tri Thức Lớp 2",
    desc: "Đấu trường đỉnh cao tổng hợp kiến thức Lớp 2.",
    levels: [
      { id: 1, title: "Toán học tổng hợp", desc: "Ôn tập phép tính, lời văn và hình học lớp 2", stages: 5, game: "/game-choose-1-of-2?world=7&level=1" },
      { id: 2, title: "Tiếng Việt tổng hợp", desc: "Ôn tập ngữ pháp, chính tả và dấu câu lớp 2", stages: 5, game: "/game-choose-1-of-2?world=7&level=2" },
      { id: 3, title: "Kỹ năng & IQ tổng hợp", desc: "Các thử thách ứng xử và quy luật hình ảnh logic", stages: 5, game: "/game-choose-1-of-2?world=7&level=3" }
    ],
    bossName: "Chiến binh đỉnh tháp",
    bossDesc: "Vượt qua thử thách hỗn hợp 20 câu hỏi để đăng quang",
    bossGame: "/game-choose-1-of-2?world=7&boss=true"
  }
]

// ─── GAME CHOOSE QUESTIONS ───
export const CHOOSE_QUESTIONS = [
  // === WORLD 1: VƯƠNG QUỐC SỐ HỌC ===
  // Level 1: Đếm số đến 1000
  { q: "Số gồm 2 trăm, 3 chục và 5 đơn vị là số nào?", options: ["235", "532"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Số gồm 5 trăm, 0 chục và 8 đơn vị là số nào?", options: ["508", "580"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Số liền sau của số 499 là số nào?", options: ["500", "498"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Số liền trước của số 300 là số nào?", options: ["299", "301"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Số bảy trăm hai mươi mốt được viết là gì?", options: ["721", "712"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },
  { q: "Số 895 gồm mấy trăm, chục và đơn vị?", options: ["8 trăm, 9 chục, 5 đơn vị", "9 trăm, 8 chục, 5 đơn vị"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Đếm số", world: 1, level: 1 },

  // Level 2: So sánh số
  { q: "567 ... 432. Điền dấu thích hợp vào chỗ trống:", options: [">", "<"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh", world: 1, level: 2 },
  { q: "899 ... 901. Điền dấu thích hợp vào chỗ trống:", options: ["<", ">"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh", world: 1, level: 2 },
  { q: "450 ... 405. Điền dấu thích hợp vào chỗ trống:", options: [">", "<"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh", world: 1, level: 2 },
  { q: "777 ... 777. Điền dấu thích hợp vào chỗ trống:", options: ["=", ">"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh", world: 1, level: 2 },
  { q: "Trong hai số 620 và 602, số nào lớn hơn?", options: ["620", "602"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh", world: 1, level: 2 },

  // Level 3: Sắp xếp số
  { q: "Sắp xếp các số sau theo thứ tự TĂNG dần: 123, 876, 452", options: ["123, 452, 876", "876, 452, 123"], correct: 0, emoji: "📈", subject: "Toán", topic: "Sắp xếp", world: 1, level: 3 },
  { q: "Sắp xếp các số sau theo thứ tự GIẢM dần: 300, 700, 500", options: ["700, 500, 300", "300, 500, 700"], correct: 0, emoji: "📉", subject: "Toán", topic: "Sắp xếp", world: 1, level: 3 },
  { q: "Số nào lớn nhất trong dãy số sau: 432, 452, 412?", options: ["452", "432"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Sắp xếp", world: 1, level: 3 },
  { q: "Số nào bé nhất trong dãy số sau: 980, 890, 908?", options: ["890", "908"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Sắp xếp", world: 1, level: 3 },

  // Level 4: Hình học phẳng
  { q: "Hình có 4 cạnh bằng nhau và 4 góc vuông là hình gì?", options: ["Hình vuông", "Hình tam giác"], correct: 0, emoji: "⬛", subject: "Toán", topic: "Hình học", world: 1, level: 4 },
  { q: "Biển báo giao thông nguy hiểm thường có dạng hình gì?", options: ["Hình tam giác", "Hình chữ nhật"], correct: 0, emoji: "🔺", subject: "Toán", topic: "Hình học", world: 1, level: 4 },
  { q: "Bánh xe ô tô hay xe máy có dạng hình gì hả bé?", options: ["Hình tròn", "Hình vuông"], correct: 0, emoji: "⭕", subject: "Toán", topic: "Hình học", world: 1, level: 4 },
  { q: "Mặt bảng lớp học của em thường là hình gì?", options: ["Hình chữ nhật", "Hình tròn"], correct: 0, emoji: "▭", subject: "Toán", topic: "Hình học", world: 1, level: 4 },

  // === WORLD 2: THÀNH PHỐ PHÉP TÍNH ===
  // Level 1: Cộng có nhớ
  { q: "28 + 15 = ?", options: ["43", "33"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng có nhớ", world: 2, level: 1 },
  { q: "47 + 26 = ?", options: ["73", "63"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng có nhớ", world: 2, level: 1 },
  { q: "59 + 8 = ?", options: ["67", "57"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng có nhớ", world: 2, level: 1 },
  { q: "36 + 18 = ?", options: ["54", "44"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng có nhớ", world: 2, level: 1 },

  // Level 2: Trừ có nhớ
  { q: "54 - 27 = ?", options: ["27", "37"], correct: 0, emoji: "➖", subject: "Toán", topic: "Trừ có nhớ", world: 2, level: 2 },
  { q: "82 - 35 = ?", options: ["47", "57"], correct: 0, emoji: "➖", subject: "Toán", topic: "Trừ có nhớ", world: 2, level: 2 },
  { q: "61 - 9 = ?", options: ["52", "42"], correct: 0, emoji: "➖", subject: "Toán", topic: "Trừ có nhớ", world: 2, level: 2 },
  { q: "70 - 24 = ?", options: ["46", "56"], correct: 0, emoji: "➖", subject: "Toán", topic: "Trừ có nhớ", world: 2, level: 2 },

  // Level 3: Bảng nhân 2
  { q: "2 x 5 = ?", options: ["10", "12"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 2", world: 2, level: 3 },
  { q: "2 x 8 = ?", options: ["16", "18"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 2", world: 2, level: 3 },
  { q: "Mỗi con thỏ có 2 cái tai. Hỏi 6 con thỏ có bao nhiêu cái tai?", options: ["12 cái tai", "10 cái tai"], correct: 0, emoji: "🐰", subject: "Toán", topic: "Nhân 2", world: 2, level: 3 },
  { q: "2 x 9 = ?", options: ["18", "16"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 2", world: 2, level: 3 },

  // Level 4: Bảng nhân 3
  { q: "3 x 4 = ?", options: ["12", "15"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 3", world: 2, level: 4 },
  { q: "3 x 7 = ?", options: ["21", "24"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 3", world: 2, level: 4 },
  { q: "Mỗi chiếc xe ba bánh có 3 cái bánh. Hỏi 5 chiếc xe có mấy bánh?", options: ["15 cái bánh", "12 cái bánh"], correct: 0, emoji: "🚲", subject: "Toán", topic: "Nhân 3", world: 2, level: 4 },
  { q: "3 x 9 = ?", options: ["27", "30"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 3", world: 2, level: 4 },

  // Level 5: Bảng nhân 4
  { q: "4 x 3 = ?", options: ["12", "16"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 4", world: 2, level: 5 },
  { q: "4 x 6 = ?", options: ["24", "20"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 4", world: 2, level: 5 },
  { q: "Mỗi chiếc bàn có 4 cái chân. Hỏi 4 chiếc bàn có bao nhiêu chân?", options: ["16 cái chân", "12 cái chân"], correct: 0, emoji: "🪑", subject: "Toán", topic: "Nhân 4", world: 2, level: 5 },
  { q: "4 x 8 = ?", options: ["32", "36"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Nhân 4", world: 2, level: 5 },

  // Level 6: Phép chia
  { q: "12 : 2 = ?", options: ["6", "5"], correct: 0, emoji: "➗", subject: "Toán", topic: "Chia", world: 2, level: 6 },
  { q: "15 : 3 = ?", options: ["5", "6"], correct: 0, emoji: "➗", subject: "Toán", topic: "Chia", world: 2, level: 6 },
  { q: "Có 20 cái kẹo chia đều cho 4 bạn. Hỏi mỗi bạn được mấy cái?", options: ["5 cái kẹo", "4 cái kẹo"], correct: 0, emoji: "🍬", subject: "Toán", topic: "Chia", world: 2, level: 6 },
  { q: "16 : 4 = ?", options: ["4", "6"], correct: 0, emoji: "➗", subject: "Toán", topic: "Chia", world: 2, level: 6 },

  // Level 7: Toán có lời văn
  { q: "Lan có 15 cái kẹo. Lan cho Nam 6 cái. Hỏi Lan còn lại bao nhiêu cái kẹo?", options: ["9 cái kẹo", "8 cái kẹo"], correct: 0, emoji: "🍬", subject: "Toán", topic: "Lời văn", world: 2, level: 7 },
  { q: "Có 8 bạn đang chơi bóng, sau đó 7 bạn chạy đến chơi cùng. Hỏi có tất cả bao nhiêu bạn?", options: ["15 bạn", "16 bạn"], correct: 0, emoji: "⚽", subject: "Toán", topic: "Lời văn", world: 2, level: 7 },
  { q: "Mỗi ngăn tủ đựng được 4 quyển truyện. Hỏi 5 ngăn tủ đựng được bao nhiêu quyển?", options: ["20 quyển", "18 quyển"], correct: 0, emoji: "📚", subject: "Toán", topic: "Lời văn", world: 2, level: 7 },
  { q: "Mẹ có 12 quả táo chia đều cho 2 anh em. Hỏi mỗi người được mấy quả?", options: ["6 quả táo", "5 quả táo"], correct: 0, emoji: "🍎", subject: "Toán", topic: "Lời văn", world: 2, level: 7 },

  // === WORLD 3: THƯ VIỆN TIẾNG VIỆT ===
  // Level 3: Đọc hiểu
  { q: "Đoạn văn: 'Lan có một chú mèo trắng tên Miu. Miu rất thích bắt chuột.' Câu hỏi: Mèo Miu có màu gì?", options: ["Màu trắng", "Màu đen"], correct: 0, emoji: "🐱", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 3, level: 3 },
  { q: "Đoạn văn: 'Nhà Nam trồng một cây bưởi sai trĩu quả. Cây bưởi ra hoa vào mùa xuân.' Câu hỏi: Cây bưởi nhà Nam ra hoa vào mùa nào?", options: ["Mùa xuân", "Mùa hè"], correct: 0, emoji: "🌳", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 3, level: 3 },
  { q: "Đoạn văn: 'Hôm nay lớp bé Mai học vẽ. Mai vẽ một bông hoa hướng dương vàng rực.' Câu hỏi: Bé Mai vẽ hoa gì?", options: ["Hoa hướng dương", "Hoa hồng"], correct: 0, emoji: "🌻", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 3, level: 3 },

  // Level 4: Chính tả
  { q: "Điền âm thích hợp vào chỗ trống: 'con ... chó'", options: ["ch", "tr"], correct: 0, emoji: "🐶", subject: "Tiếng Việt", topic: "Chính tả", world: 3, level: 4 },
  { q: "Điền âm thích hợp vào chỗ trống: 'quả ...anh'", options: ["ch", "tr"], correct: 0, emoji: "🍋", subject: "Tiếng Việt", topic: "Chính tả", world: 3, level: 4 },
  { q: "Điền âm thích hợp vào chỗ trống: 'quyển ...ách'", options: ["s", "x"], correct: 0, emoji: "📚", subject: "Tiếng Việt", topic: "Chính tả", world: 3, level: 4 },
  { q: "Điền âm thích hợp vào chỗ trống: 'xinh ...ắn'", options: ["x", "s"], correct: 0, emoji: "👧", subject: "Tiếng Việt", topic: "Chính tả", world: 3, level: 4 },
  { q: "Điền âm thích hợp vào chỗ trống: 'con ...à trống'", options: ["g", "gh"], correct: 0, emoji: "🐔", subject: "Tiếng Việt", topic: "Chính tả", world: 3, level: 4 },

  // Level 6: Dấu câu
  { q: "Câu sau dùng dấu gì ở cuối: 'Hôm nay em đi học về muộn...'", options: ["Dấu chấm (.)", "Dấu hỏi (?)"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Dấu câu", world: 3, level: 6 },
  { q: "Câu sau dùng dấu gì ở cuối: 'Bé mấy tuổi rồi...'", options: ["Dấu hỏi (?)", "Dấu chấm (.)"], correct: 0, emoji: "❓", subject: "Tiếng Việt", topic: "Dấu câu", world: 3, level: 6 },
  { q: "Câu sau dùng dấu gì ở cuối: 'Ôi, bông hoa đẹp quá...'", options: ["Dấu chấm than (!)", "Dấu hỏi (?)"], correct: 0, emoji: "❗", subject: "Tiếng Việt", topic: "Dấu câu", world: 3, level: 6 },
  { q: "Điền dấu thích hợp giữa hai từ trong liệt kê: 'Bút... thước... sách đều ở trong cặp.'", options: ["Dấu phẩy (,)", "Dấu chấm (.)"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Dấu câu", world: 3, level: 6 },

  // Level 7: Sắp xếp câu & Kể chuyện
  { q: "Sắp xếp các câu sau thành một đoạn văn hợp lý:\n(1) Chim én bay lượn.\n(2) Mùa xuân đã về.\n(3) Cây cối đâm chồi nảy lộc.", options: ["(2) -> (3) -> (1)", "(3) -> (1) -> (2)"], correct: 0, emoji: "🌸", subject: "Tiếng Việt", topic: "Kể chuyện", world: 3, level: 7 },
  { q: "Để viết một đoạn văn ngắn kể về bạn thân của mình, bé nên làm gì trước?", options: ["Giới thiệu tên, tuổi của bạn", "Kể về sở thích ăn uống của bạn"], correct: 0, emoji: "🤝", subject: "Tiếng Việt", topic: "Viết đoạn", world: 3, level: 7 },
  { q: "Bức tranh 1 vẽ gieo hạt, tranh 2 vẽ tưới nước, tranh 3 vẽ cây nở hoa. Thứ tự câu chuyện đúng là:", options: ["Tranh 1 -> Tranh 2 -> Tranh 3", "Tranh 2 -> Tranh 3 -> Tranh 1"], correct: 0, emoji: "🌱", subject: "Tiếng Việt", topic: "Kể chuyện", world: 3, level: 7 },
  { q: "Khi kể chuyện về một bạn nhỏ đang quét dọn sân trường, câu nào mô tả đúng nhất?", options: ["Bạn nhỏ đang quét dọn sân trường sạch sẽ.", "Bạn nhỏ đang chơi đá bóng cùng các bạn."], correct: 0, emoji: "🧹", subject: "Tiếng Việt", topic: "Kể chuyện", world: 3, level: 7 },


  // === WORLD 4: NHÀ KHOA HỌC NHÍ ===
  // Level 1: Cơ thể em
  { q: "Cơ quan vận động của cơ thể người bao gồm bộ phận nào?", options: ["Xương và Cơ", "Dạ dày và Ruột"], correct: 0, emoji: "💪", subject: "Khoa học", topic: "Cơ thể", world: 4, level: 1 },
  { q: "Cơ quan nào sau đây đóng vai trò tiêu hóa thức ăn chúng ta ăn hàng ngày?", options: ["Dạ dày, ruột", "Tim, phổi"], correct: 0, emoji: "🍔", subject: "Khoa học", topic: "Cơ thể", world: 4, level: 1 },
  { q: "Để phòng tránh sâu răng và bảo vệ răng miệng, bé cần làm gì?", options: ["Đánh răng ít nhất 2 lần/ngày", "Ăn nhiều kẹo ngọt trước khi ngủ"], correct: 0, emoji: "🦷", subject: "Khoa học", topic: "Cơ thể", world: 4, level: 1 },

  // Level 2: Gia đình yêu thương
  { q: "Em của mẹ mình thì bé sẽ xưng hô bằng gì?", options: ["Dì hoặc Cậu", "Cô hoặc Chú"], correct: 0, emoji: "👩", subject: "Khoa học", topic: "Gia đình", world: 4, level: 2 },
  { q: "Anh trai của bố mình thì bé gọi là gì?", options: ["Bác", "Chú"], correct: 0, emoji: "👨", subject: "Khoa học", topic: "Gia đình", world: 4, level: 2 },
  { q: "Mỗi thành viên trong gia đình cần có trách nhiệm gì?", options: ["Yêu thương, chia sẻ, giúp đỡ nhau", "Chỉ làm việc của riêng mình"], correct: 0, emoji: "❤️", subject: "Khoa học", topic: "Gia đình", world: 4, level: 2 },

  // Level 3: Trường học mến yêu
  { q: "Khi ở trường học, hành động nào sau đây của em giúp đảm bảo an toàn?", options: ["Đi đứng nhẹ nhàng, không xô đẩy", "Đu bám, trượt lan can cầu thang"], correct: 0, emoji: "🏫", subject: "Khoa học", topic: "Trường học", world: 4, level: 3 },
  { q: "Thầy cô giáo ở trường đóng vai trò gì đối với học sinh?", options: ["Dạy dỗ học thức và chăm sóc bé", "Chỉ đến trông lớp"], correct: 0, emoji: "👩‍🏫", subject: "Khoa học", topic: "Trường học", world: 4, level: 3 },

  // Level 4: Thế giới động vật
  { q: "Động vật sống dưới nước thở bằng gì hả bé?", options: ["Mang", "Phổi"], correct: 0, emoji: "🐟", subject: "Khoa học", topic: "Động vật", world: 4, level: 4 },
  { q: "Đâu là loài động vật hoang dã sống ở trong rừng sâu cần bảo vệ?", options: ["Hổ, Sư tử", "Chó, Mèo nuôi"], correct: 0, emoji: "🐅", subject: "Khoa học", topic: "Động vật", world: 4, level: 4 },

  // Level 5: Thực vật quanh em
  { q: "Phần nào của cây có chức năng hút nước và chất dinh dưỡng nuôi cây?", options: ["Rễ cây", "Lá cây"], correct: 0, emoji: "🌱", subject: "Khoa học", topic: "Thực vật", world: 4, level: 5 },
  { q: "Cây xanh có ích lợi lớn gì đối với bầu không khí?", options: ["Cung cấp oxy và làm mát không khí", "Làm ô nhiễm không khí"], correct: 0, emoji: "🌳", subject: "Khoa học", topic: "Thực vật", world: 4, level: 5 },

  // Level 6: Thời tiết bốn mùa
  { q: "Khi trời mưa giông bão lớn sấm sét, em nên làm gì?", options: ["Ở trong nhà, đóng kín cửa", "Chạy ra gốc cây to đứng trú"], correct: 0, emoji: "⛈️", subject: "Khoa học", topic: "Thời tiết", world: 4, level: 6 },
  { q: "Thời tiết mùa hè nóng bức chói chang, khi ra đường bé cần mang gì?", options: ["Đội mũ nón, che ô", "Không cần che chắn"], correct: 0, emoji: "☀️", subject: "Khoa học", topic: "Thời tiết", world: 4, level: 6 },

  // Level 7: Bảo vệ môi trường
  { q: "Việc phân loại rác thải hữu cơ giúp ích gì cho môi trường?", options: ["Làm phân bón tái chế tốt", "Làm đầy các bãi chôn lấp"], correct: 0, emoji: "🗑️", subject: "Khoa học", topic: "Môi trường", world: 4, level: 7 },
  { q: "Khi tắm rửa xong, để bảo vệ tài nguyên nước sạch, bé nên làm gì?", options: ["Tắt vòi nước cẩn thận", "Cứ mở vòi để chảy tràn"], correct: 0, emoji: "🚰", subject: "Khoa học", topic: "Môi trường", world: 4, level: 7 },

  // === WORLD 5: THỬ THÁCH IQ ===
  // Level 1: Tìm hình khác biệt
  { q: "Trong các hình sau, hình nào khác biệt nhất: 🍎, 🍌, 🍉, 🚗?", options: ["Chiếc ô tô 🚗", "Quả chuối 🍌"], correct: 0, emoji: "🚗", subject: "IQ", topic: "Khác biệt", world: 5, level: 1 },
  { q: "Tìm hình khác biệt trong nhóm sau: 🐶, 🐱, 🐔, 🏠?", options: ["Ngôi nhà 🏠", "Con mèo 🐱"], correct: 0, emoji: "🏠", subject: "IQ", topic: "Khác biệt", world: 5, level: 1 },

  // Level 2: Tìm quy luật số
  { q: "Dãy số: 2, 4, 6, 8, ... Số tiếp theo là số mấy?", options: ["10", "9"], correct: 0, emoji: "🔢", subject: "IQ", topic: "Quy luật", world: 5, level: 2 },
  { q: "Dãy số: 5, 10, 15, 20, ... Số tiếp theo là số mấy?", options: ["25", "30"], correct: 0, emoji: "🔢", subject: "IQ", topic: "Quy luật", world: 5, level: 2 },

  // Level 3: Tìm đường mê cung
  { q: "Gặp ngã rẽ có vách đá đổ, em nên đi hướng nào?", options: ["Quay lại đi đường tránh an toàn", "Trèo vượt qua vách đá"], correct: 0, emoji: "🧱", subject: "IQ", topic: "Mê cung", world: 5, level: 3 },
  { q: "Muốn ra khỏi mê cung tối nhanh, em nên tìm gì?", options: ["Biển chỉ dẫn lối ra Exit", "Cứ chạy vòng quanh tự do"], correct: 0, emoji: "🚪", subject: "IQ", topic: "Mê cung", world: 5, level: 3 },

  // === WORLD 6: KỸ NĂNG & THỰC TẾ ===
  // Level 1: Giao tiếp & Hợp tác
  { q: "Khi được người khác giúp đỡ hoặc tặng quà, em cần nói gì?", options: ["Cháu xin cảm ơn ạ", "Cháu im lặng cầm luôn"], correct: 0, emoji: "🙇", subject: "Kỹ năng", topic: "Giao tiếp", world: 6, level: 1 },
  { q: "Khi lỡ làm hỏng đồ dùng của bạn, em nên ứng xử thế nào?", options: ["Nói lời xin lỗi chân thành", "Chối bay không nhận lỗi"], correct: 0, emoji: "😢", subject: "Kỹ năng", topic: "Giao tiếp", world: 6, level: 1 },
  { q: "Khi làm việc nhóm vẽ tranh, bạn Lan muốn mượn màu vẽ của em. Em nên làm gì?", options: ["Vui vẻ chia sẻ màu vẽ với bạn", "Giữ màu vẽ riêng không cho bạn mượn"], correct: 0, emoji: "🎨", subject: "Kỹ năng", topic: "Hợp tác", world: 6, level: 1 },
  { q: "Khi thảo luận nhóm phát biểu ý kiến, một bạn có ý kiến khác em. Em ứng xử thế nào?", options: ["Lắng nghe ý kiến của bạn rồi cùng bàn bạc", "Tức giận và bắt bạn phải nghe theo ý mình"], correct: 0, emoji: "🗣️", subject: "Kỹ năng", topic: "Hợp tác", world: 6, level: 1 },
  { q: "Khi tham gia trò chơi kéo co cùng cả lớp, làm sao để chiến thắng?", options: ["Đoàn kết và kéo chung một nhịp theo hiệu lệnh", "Mỗi bạn tự kéo theo sức và nhịp của mình"], correct: 0, emoji: "🤝", subject: "Kỹ năng", topic: "Hợp tác", world: 6, level: 1 },

  // Level 2: Kỹ năng tự phục vụ
  { q: "Để chuẩn bị cho ngày học hôm sau tốt nhất, em nên làm gì?", options: ["Tự xếp sách vở theo thời khóa biểu", "Nhờ bố mẹ soạn sách vở hộ"], correct: 0, emoji: "🎒", subject: "Kỹ năng", topic: "Tự lập", world: 6, level: 2 },
  { q: "Khi dùng xong bút thước học tập, bé nên để ở đâu?", options: ["Cất gọn vào hộp bút cẩn thận", "Vứt lung tung trên bàn học"], correct: 0, emoji: "✏️", subject: "Kỹ năng", topic: "Tự lập", world: 6, level: 2 },

  // Level 3: Phòng tránh nguy hiểm
  { q: "Ổ cắm điện trong nhà có điện rất nguy hiểm, bé tuyệt đối không nên làm gì?", options: ["Chọc tay hoặc vật sắc nhọn vào", "Nhìn ngắm từ xa"], correct: 0, emoji: "⚡", subject: "Kỹ năng", topic: "An toàn", world: 6, level: 3 },
  { q: "Bếp lửa đang đun nấu nóng đỏ, bé có nên nghịch ngợm không?", options: ["Không, vì rất dễ gây bỏng da nặng", "Có thể sờ thử nghịch lửa"], correct: 0, emoji: "🔥", subject: "Kỹ năng", topic: "An toàn", world: 6, level: 3 },

  // Level 4: Siêu thị & Tiền tệ
  { q: "Quả táo giá 10.000đ, quả cam giá 15.000đ. Bé mua cả hai quả hết bao nhiêu tiền?", options: ["25.000đ", "20.000đ"], correct: 0, emoji: "💵", subject: "Thực tế", topic: "Siêu thị", world: 6, level: 4 },
  { q: "Bé có 30.000đ. Bé mua quyển vở hết 20.000đ. Bé còn lại bao nhiêu tiền thừa?", options: ["10.000đ", "15.000đ"], correct: 0, emoji: "💵", subject: "Thực tế", topic: "Siêu thị", world: 6, level: 4 },

  // Level 5: Đo lường cơ bản
  { q: "Đơn vị nào sau đây dùng để đo độ dài ngắn của vật?", options: ["Xăng-ti-mét (cm)", "Ki-lô-gam (kg)"], correct: 0, emoji: "📏", subject: "Thực tế", topic: "Đo lường", world: 6, level: 5 },
  { q: "Đơn vị nào dùng để cân đo khối lượng nặng nhẹ của túi gạo?", options: ["Ki-lô-gam (kg)", "Lít (l)"], correct: 0, emoji: "⚖️", subject: "Thực tế", topic: "Đo lường", world: 6, level: 5 },
  { q: "Lít (l) là đơn vị dùng để đo đại lượng nào?", options: ["Dung tích nước trong chai", "Chiều dài bàn học"], correct: 0, emoji: "🥛", subject: "Thực tế", topic: "Đo lường", world: 6, level: 5 },

  // Level 6: Đồng hồ & Lịch
  { q: "Kim ngắn đồng hồ chỉ số 9, kim dài chỉ số 12. Hỏi lúc đó là mấy giờ?", options: ["9 giờ đúng", "12 giờ đúng"], correct: 0, emoji: "9️⃣", subject: "Thực tế", topic: "Thời gian", world: 6, level: 6 },
  { q: "Đồng hồ chỉ 3 giờ rưỡi thì kim dài chỉ vào số mấy?", options: ["Số 6", "Số 12"], correct: 0, emoji: "🕞", subject: "Thực tế", topic: "Thời gian", world: 6, level: 6 },
  { q: "Một tuần có bao nhiêu ngày hả bé?", options: ["7 ngày", "5 ngày"], correct: 0, emoji: "📅", subject: "Thực tế", topic: "Thời gian", world: 6, level: 6 },

  // Level 7: An toàn giao thông
  { q: "Khi đi bộ qua đường lớn không có cầu vượt, bé cần làm gì?", options: ["Đi trên vạch kẻ trắng cùng người lớn", "Chạy băng ngang qua xe cộ"], correct: 0, emoji: "🚶", subject: "Thực tế", topic: "Giao thông", world: 6, level: 7 },
  { q: "Khi ngồi trên xe máy cùng bố mẹ, bé cần tuân thủ quy tắc nào?", options: ["Đội mũ bảo hiểm và bám chắc", "Đứng tự do trên yên xe nghịch"], correct: 0, emoji: "🪖", subject: "Thực tế", topic: "Giao thông", world: 6, level: 7 },

  // === WORLD 7: THÁP TRI THỨC ===
  // Level 1: Toán học tổng hợp
  { q: "Số lớn nhất có 3 chữ số là số nào?", options: ["999", "100"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Tổng hợp", world: 7, level: 1 },
  { q: "Phép tính nào dưới đây có kết quả bằng 100?", options: ["75 + 25", "60 + 30"], correct: 0, emoji: "💯", subject: "Toán", topic: "Tổng hợp", world: 7, level: 1 },

  // Level 2: Tiếng Việt tổng hợp
  { q: "Từ nào viết đúng chính tả tiếng Việt?", options: ["chăm chỉ", "trăm chỉ"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Tổng hợp", world: 7, level: 2 },
  { q: "Đâu là một câu hỏi trong các câu sau?", options: ["Bé mấy tuổi rồi?", "Bé đang học bài."], correct: 0, emoji: "❓", subject: "Tiếng Việt", topic: "Tổng hợp", world: 7, level: 2 },

  // Level 3: Logic & IQ tổng hợp
  { q: "Hình tam giác có mấy cạnh hả bé yêu?", options: ["3 cạnh", "4 cạnh"], correct: 0, emoji: "🔺", subject: "IQ", topic: "Tổng hợp", world: 7, level: 3 },
  { q: "Chuỗi hình: 🔺, 🔵, 🔺, 🔵, ... Hình tiếp theo là gì?", options: ["Hình tam giác 🔺", "Hình vuông ⬛"], correct: 0, emoji: "🔺", subject: "IQ", topic: "Tổng hợp", world: 7, level: 3 }
]

// ─── GAME LISTEN QUESTIONS ───
export const LISTEN_QUESTIONS = [
  // === WORLD 3: THƯ VIỆN TIẾNG VIỆT ===
  // Level 1: Đọc từ vựng
  { word: "học sinh", options: ["🎒 Học sinh", "👩‍🏫 Giáo viên", "🏫 Trường học", "📚 Quyển sách"], correct: 0, subject: "Tiếng Việt", topic: "Đọc từ", world: 3, level: 1 },
  { word: "thầy giáo", options: ["👩‍🏫 Cô giáo", "👨‍🏫 Thầy giáo", "🎒 Ba lô", "✏️ Bút chì"], correct: 1, subject: "Tiếng Việt", topic: "Đọc từ", world: 3, level: 1 },
  { word: "gia đình", options: ["🏠 Nhà cửa", "👨‍👩‍👧‍👦 Gia đình", "🌳 Cây xanh", "🚗 Xe hơi"], correct: 1, subject: "Tiếng Việt", topic: "Đọc từ", world: 3, level: 1 },
  { word: "bác sĩ", options: ["👮 Công an", "👨‍🚒 Cứu hỏa", "👩‍⚕️ Bác sĩ", "👨‍🍳 Đầu bếp"], correct: 2, subject: "Tiếng Việt", topic: "Đọc từ", world: 3, level: 1 },

  // Level 2: Đọc câu dài
  { word: "Con mèo đang ngủ ngon dưới gầm giường.", options: ["🐱💤 Mèo ngủ gầm giường", "🐕 Chó đang chạy", "🐔 Gà gáy sớm", "🐟 Cá bơi bể nước"], correct: 0, subject: "Tiếng Việt", topic: "Đọc câu", world: 3, level: 2 },
  { word: "Bé Mai đi học mang chiếc ba lô màu đỏ.", options: ["👧🎒 Bé mang ba lô đỏ", "👦⚽ Nam đá bóng", "👩‍🍳 Mẹ nấu ăn ngon", "👨‍⚕️ Bác sĩ khám bệnh"], correct: 0, subject: "Tiếng Việt", topic: "Đọc câu", world: 3, level: 2 },
  { word: "Bố em đang đọc tờ báo sáng nay.", options: ["👨📰 Bố đọc báo sáng", "👧🎨 Bé vẽ bức tranh", "🐮 Bò ăn cỏ xanh", "🦆 Vịt bơi ao hồ"], correct: 0, subject: "Tiếng Việt", topic: "Đọc câu", world: 3, level: 2 }
]

// ─── GAME MATCHING PAIRS ───
export const MATCHING_PAIRS_ALL = [
  // === WORLD 3: THƯ VIỆN TIẾNG VIỆT ===
  // Level 5: Từ và câu (Danh từ, động từ, từ chỉ đặc điểm)
  { id: 1, left: "con mèo", right: "Danh từ", subject: "Tiếng Việt", topic: "Từ loại", world: 3, level: 5 },
  { id: 2, left: "quyển sách", right: "Danh từ", subject: "Tiếng Việt", topic: "Từ loại", world: 3, level: 5 },
  { id: 3, left: "chạy nhảy", right: "Động từ", subject: "Tiếng Việt", topic: "Từ loại", world: 3, level: 5 },
  { id: 4, left: "đọc viết", right: "Động từ", subject: "Tiếng Việt", topic: "Từ loại", world: 3, level: 5 },
  { id: 5, left: "màu đỏ rực", right: "Từ chỉ đặc điểm", subject: "Tiếng Việt", topic: "Từ loại", world: 3, level: 5 },
  { id: 6, left: "siêng năng", right: "Từ chỉ đặc điểm", subject: "Tiếng Việt", topic: "Từ loại", world: 3, level: 5 },

  // === WORLD 5: THỨ THÁCH IQ ===
  // Level 4: Ghép hình logic
  { id: 10, left: "🐱 Con mèo", right: "🐟 Thích ăn cá", subject: "IQ", topic: "Ghép hình", world: 5, level: 4 },
  { id: 11, left: "🐶 Con chó", right: "🦴 Thích gặm xương", subject: "IQ", topic: "Ghép hình", world: 5, level: 4 },
  { id: 12, left: "🐰 Con thỏ", right: "🥕 Thích ăn cà rốt", subject: "IQ", topic: "Ghép hình", world: 5, level: 4 },
  { id: 13, left: "🐵 Con khỉ", right: "🍌 Thích ăn chuối", subject: "IQ", topic: "Ghép hình", world: 5, level: 4 },

  // Level 5: Thử thách trí nhớ
  { id: 20, left: "100", right: "Một trăm", subject: "IQ", topic: "Trí nhớ", world: 5, level: 5 },
  { id: 21, left: "500", right: "Năm trăm", subject: "IQ", topic: "Trí nhớ", world: 5, level: 5 },
  { id: 22, left: "1000", right: "Một nghìn", subject: "IQ", topic: "Trí nhớ", world: 5, level: 5 },
  { id: 23, left: "700", right: "Bảy trăm", subject: "IQ", topic: "Trí nhớ", world: 5, level: 5 }
]

const shuffle = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Lấy ngân hàng câu hỏi động dựa trên thế giới và level cho Lớp 2 */
export function getQuestionsForGame(worldId, levelId, isBoss = false) {
  const wId = parseInt(worldId, 10)
  const lId = parseInt(levelId, 10)

  // --- World 1: Vương quốc Số Học ---
  if (wId === 1) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 1)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 5)
  }

  // --- World 2: Thành phố Phép Tính ---
  if (wId === 2) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 2)
    if (isBoss) {
      return shuffle(pool).slice(0, 10)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 3: Thư viện Tiếng Việt ---
  if (wId === 3) {
    if (lId === 1 || lId === 2) {
      const pool = LISTEN_QUESTIONS.filter(q => q.world === 3 && q.level === lId)
      return shuffle(pool).slice(0, 3)
    }
    if (lId === 3 || lId === 4 || lId === 6 || lId === 7) {
      const pool = CHOOSE_QUESTIONS.filter(q => q.world === 3 && q.level === lId)
      return shuffle(pool).slice(0, 3)
    }
    if (lId === 5) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 3 && q.level === 5)
      return shuffle(pool).slice(0, 4)
    }
    if (isBoss) {
      const pool = CHOOSE_QUESTIONS.filter(q => q.world === 3)
      return shuffle(pool).slice(0, 6)
    }
  }

  // --- World 4: Nhà khoa học Nhí ---
  if (wId === 4) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 4)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 5: Thử thách IQ ---
  if (wId === 5) {
    if (lId === 1 || lId === 2 || lId === 3) {
      const pool = CHOOSE_QUESTIONS.filter(q => q.world === 5 && q.level === lId)
      return shuffle(pool).slice(0, 3)
    }
    if (lId === 4 || lId === 5) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 5 && q.level === lId)
      return shuffle(pool).slice(0, 4)
    }
    if (isBoss) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 5)
      return shuffle(pool).slice(0, 6)
    }
  }

  // --- World 6: Kỹ năng & Thực tế ---
  if (wId === 6) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 6)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 7: Tháp Tri Thức ---
  if (wId === 7) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 7)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 3)
  }

  return []
}

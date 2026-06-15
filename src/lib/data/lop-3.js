/**
 * lop-3.js
 * Ngân hàng câu hỏi chuẩn chương trình Lớp 3 Việt Nam theo từng Thế giới (Worlds)
 * Môn: Toán | Tiếng Việt | Khoa học | Kỹ năng sống & IQ
 * Bám sát tài liệu Grade3_Master_Plan_HocVui.docx
 */

export const WORLDS = [
  {
    id: 1,
    name: "Vương Quốc Số Học",
    icon: "🏰",
    color: "#005da7",
    textColor: "#005da7",
    bgColor: "#d0e4ff",
    borderColor: "#005da7",
    medal: "🥉",
    medalName: "Huy chương Số Học Lớp 3",
    desc: "Làm chủ các số đến 10.000, so sánh lớn bé, làm tròn số và dãy số quy luật.",
    levels: [
      { id: 1, title: "Số đến 10.000", desc: "Đọc, viết, nhận diện các chữ số hàng nghìn, trăm, chục, đơn vị", stages: 5, game: "/game-choose-1-of-2?world=1&level=1" },
      { id: 2, title: "So sánh số", desc: "So sánh các số trong phạm vi 10.000", stages: 5, game: "/game-choose-1-of-2?world=1&level=2" },
      { id: 3, title: "Làm tròn số", desc: "Làm tròn số đến hàng chục, hàng trăm, hàng nghìn", stages: 5, game: "/game-choose-1-of-2?world=1&level=3" },
      { id: 4, title: "Dãy số quy luật", desc: "Điền số tiếp theo vào dãy số có quy luật cho trước", stages: 5, game: "/game-choose-1-of-2?world=1&level=4" }
    ],
    bossName: "Boss Số Học",
    bossDesc: "Hỏi đáp tổng hợp về số học để mở khóa thành tựu",
    bossGame: "/game-choose-1-of-2?world=1&boss=true"
  },
  {
    id: 2,
    name: "Thành Phố Phép Tính",
    icon: "➕",
    color: "#b71c1c",
    textColor: "#b71c1c",
    bgColor: "#ffebee",
    borderColor: "#ffcdd2",
    medal: "🥈",
    medalName: "Huy chương Phép Tính Lớp 3",
    desc: "Thực hiện phép tính cộng, trừ, nhân, chia và giải toán lời văn nâng cao.",
    levels: [
      { id: 1, title: "Phép cộng", desc: "Phép cộng trong phạm vi 10.000 (có nhớ)", stages: 5, game: "/game-choose-1-of-2?world=2&level=1" },
      { id: 2, title: "Phép trừ", desc: "Phép trừ trong phạm vi 10.000 (có nhớ)", stages: 5, game: "/game-choose-1-of-2?world=2&level=2" },
      { id: 3, title: "Phép nhân", desc: "Nhân số có hai, ba chữ số với số có một chữ số", stages: 5, game: "/game-choose-1-of-2?world=2&level=3" },
      { id: 4, title: "Phép chia", desc: "Chia số có hai, ba chữ số cho số có một chữ số", stages: 5, game: "/game-choose-1-of-2?world=2&level=4" },
      { id: 5, title: "Toán lời văn", desc: "Giải các bài toán đố thực tế nhiều bước tính", stages: 5, game: "/game-choose-1-of-2?world=2&level=5" }
    ],
    bossName: "Boss Phép Tính",
    bossDesc: "Chiến đấu tính nhẩm để vượt qua Thành Phố Phép Tính",
    bossGame: "/game-choose-1-of-2?world=2&boss=true"
  },
  {
    id: 3,
    name: "Nhà Thám Hiểm Đo Lường",
    icon: "📏",
    color: "#e65100",
    textColor: "#e65100",
    bgColor: "#fff3e0",
    borderColor: "#ffe0b2",
    medal: "🥇",
    medalName: "Huy chương Đo Lường Lớp 3",
    desc: "Khám phá các đại lượng đo độ dài, khối lượng, thời gian và tiền tệ.",
    levels: [
      { id: 1, title: "Đo độ dài", desc: "Đơn vị đo độ dài mm, cm, m, km và quy đổi", stages: 5, game: "/game-choose-1-of-2?world=3&level=1" },
      { id: 2, title: "Khối lượng", desc: "Đơn vị đo khối lượng g, kg và quy đổi", stages: 5, game: "/game-choose-1-of-2?world=3&level=2" },
      { id: 3, title: "Thời gian", desc: "Xem đồng hồ chính xác đến từng phút, xem lịch năm/tháng", stages: 5, game: "/game-choose-1-of-2?world=3&level=3" },
      { id: 4, title: "Tiền Việt Nam", desc: "Nhận biết mệnh giá tiền Việt Nam và tính tiền thừa khi mua sắm", stages: 5, game: "/game-choose-1-of-2?world=3&level=4" }
    ],
    bossName: "Nhà Đo Lường Tài Ba",
    bossDesc: "Thử thách đo lường thực tế tổng hợp",
    bossGame: "/game-choose-1-of-2?world=3&boss=true"
  },
  {
    id: 4,
    name: "Thư Viện Tiếng Việt",
    icon: "📚",
    color: "#4a148c",
    textColor: "#4a148c",
    bgColor: "#f3e5f5",
    borderColor: "#e1bee7",
    medal: "📖",
    medalName: "Huy chương Tiếng Việt Lớp 3",
    desc: "Đọc hiểu văn bản, sửa lỗi chính tả chính xác, nhận diện từ loại và tập làm văn.",
    levels: [
      { id: 1, title: "Đọc hiểu", desc: "Đọc các đoạn văn ngắn và chọn câu trả lời đúng nhất", stages: 5, game: "/game-choose-1-of-2?world=4&level=1" },
      { id: 2, title: "Chính tả", desc: "Phân biệt s/x, ch/tr, d/gi, l/n nâng cao", stages: 5, game: "/game-choose-1-of-2?world=4&level=2" },
      { id: 3, title: "Từ vựng", desc: "Nghe phát âm từ vựng và chọn cách viết đúng", stages: 5, game: "/game-listen-and-select?world=4&level=3" },
      { id: 4, title: "Dấu câu", desc: "Sử dụng dấu chấm, dấu phẩy, dấu hai chấm, dấu gạch ngang", stages: 5, game: "/game-choose-1-of-2?world=4&level=4" },
      { id: 5, title: "Tập làm văn", desc: "Ghép các câu, liên từ để tạo thành đoạn văn mô tả hoàn chỉnh", stages: 5, game: "/game-simple-matching?world=4&level=5" }
    ],
    bossName: "Thần Thư Viện",
    bossDesc: "Thử thách ngữ pháp và chính tả tổng hợp",
    bossGame: "/game-choose-1-of-2?world=4&boss=true"
  },
  {
    id: 5,
    name: "Nhà Khoa Học Nhí",
    icon: "🌿",
    color: "#1b5e20",
    textColor: "#1b5e20",
    bgColor: "#e8f5e9",
    borderColor: "#c8e6c9",
    medal: "🔬",
    medalName: "Huy chương Khoa Học Lớp 3",
    desc: "Khám phá cơ thể người, phân loại động thực vật và ý thức bảo vệ môi trường.",
    levels: [
      { id: 1, title: "Con người", desc: "Tìm hiểu cơ quan tiêu hóa, tuần hoàn, thần kinh và cách chăm sóc", stages: 5, game: "/game-choose-1-of-2?world=5&level=1" },
      { id: 2, title: "Động vật", desc: "Nơi sống, đặc điểm sinh sản, động vật có xương sống và côn trùng", stages: 5, game: "/game-choose-1-of-2?world=5&level=2" },
      { id: 3, title: "Thực vật", desc: "Các bộ phận chính của cây (rễ, thân, lá, hoa, quả) và ích lợi", stages: 5, game: "/game-choose-1-of-2?world=5&level=3" },
      { id: 4, title: "Môi trường", desc: "Tiết kiệm nước, điện, phân loại rác thải bảo vệ thiên nhiên", stages: 5, game: "/game-choose-1-of-2?world=5&level=4" }
    ],
    bossName: "Nhà Tự Nhiên Học",
    bossDesc: "Thử thách tổng hợp về thế giới tự nhiên xung quanh ta",
    bossGame: "/game-choose-1-of-2?world=5&boss=true"
  },
  {
    id: 6,
    name: "Trung Tâm IQ",
    icon: "🧠",
    color: "#0d47a1",
    textColor: "#0d47a1",
    bgColor: "#e3f2fd",
    borderColor: "#bbdefb",
    medal: "👑",
    medalName: "Huy chương Trí Tuệ Lớp 3",
    desc: "Rèn luyện tư duy logic quy luật số hình, vượt mê cung và rèn luyện trí nhớ.",
    levels: [
      { id: 1, title: "Quy luật số & hình", desc: "Tìm số hoặc hình tiếp theo trong chuỗi quy luật logic", stages: 5, game: "/game-choose-1-of-2?world=6&level=1" },
      { id: 2, title: "Tư duy logic", desc: "Các bài toán suy luận logic lý thú cho trẻ", stages: 5, game: "/game-choose-1-of-2?world=6&level=2" },
      { id: 3, title: "Mê cung", desc: "Lựa chọn phương hướng thoát hiểm và đi đúng lối", stages: 5, game: "/game-choose-1-of-2?world=6&level=3" },
      { id: 4, title: "Trí nhớ", desc: "Trò chơi lật thẻ ghi nhớ hình ảnh/từ vựng tương ứng", stages: 5, game: "/game-simple-matching?world=6&level=4" }
    ],
    bossName: "Vua Trí Tuệ",
    bossDesc: "Thử thách IQ tổng hợp đỉnh cao",
    bossGame: "/game-simple-matching?world=6&boss=true"
  }
]

// ─── GAME CHOOSE QUESTIONS ───
export const CHOOSE_QUESTIONS = [
  // === WORLD 1: VƯƠNG QUỐC SỐ HỌC ===
  // Level 1: Số đến 10.000
  { q: "Số 3456 gồm mấy nghìn?", options: ["3 nghìn", "4 nghìn"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số học", world: 1, level: 1 },
  { q: "Số gồm 8 nghìn, 5 trăm, 3 đơn vị viết là:", options: ["8.503", "8.530"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số học", world: 1, level: 1 },
  { q: "Số chín nghìn bảy trăm bốn mươi viết là gì?", options: ["9.740", "9.470"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số học", world: 1, level: 1 },
  { q: "Số liền trước của số 10.000 là số nào?", options: ["9.999", "10.001"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số học", world: 1, level: 1 },

  // Level 2: So sánh số
  { q: "Điền dấu thích hợp: 8.452 ... 8.542", options: ["<", ">"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số nào lớn hơn trong hai số: 9.099 và 9.100?", options: ["9.100", "9.099"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Sắp xếp dãy số sau theo thứ tự tăng dần: 5231, 5132, 5321", options: ["5132, 5231, 5321", "5321, 5231, 5132"], correct: 0, emoji: "📈", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },

  // Level 3: Làm tròn số
  { q: "Làm tròn số 4.567 đến hàng trăm gần nhất:", options: ["4.600", "4.500"], correct: 0, emoji: "🎯", subject: "Toán", topic: "Làm tròn số", world: 1, level: 3 },
  { q: "Làm tròn số 8.124 đến hàng chục gần nhất:", options: ["8.120", "8.130"], correct: 0, emoji: "🎯", subject: "Toán", topic: "Làm tròn số", world: 1, level: 3 },
  { q: "Làm tròn số 9.870 đến hàng nghìn gần nhất:", options: ["10.000", "9.000"], correct: 0, emoji: "🎯", subject: "Toán", topic: "Làm tròn số", world: 1, level: 3 },

  // Level 4: Dãy số
  { q: "Cho dãy số: 1000, 2000, 3000, 4000, ... Số tiếp theo là?", options: ["5000", "4100"], correct: 0, emoji: "📈", subject: "Toán", topic: "Dãy số", world: 1, level: 4 },
  { q: "Điền số thích hợp vào chỗ trống: 2, 4, 8, 16, ...", options: ["32", "24"], correct: 0, emoji: "📈", subject: "Toán", topic: "Dãy số", world: 1, level: 4 },
  { q: "Điền số thích hợp: 9900, 9800, 9700, ...", options: ["9600", "9500"], correct: 0, emoji: "📉", subject: "Toán", topic: "Dãy số", world: 1, level: 4 },

  // === WORLD 2: THÀNH PHỐ PHÉP TÍNH ===
  // Level 1: Cộng
  { q: "4.500 + 3.200 = ?", options: ["7.700", "7.500"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng", world: 2, level: 1 },
  { q: "5.682 + 1.259 = ?", options: ["6.941", "6.841"], correct: 0, emoji: "➕", subject: "Toán", topic: "Phép cộng", world: 2, level: 1 },

  // Level 2: Trừ
  { q: "8.900 - 3.500 = ?", options: ["5.400", "5.500"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ", world: 2, level: 2 },
  { q: "7.240 - 2.890 = ?", options: ["4.350", "4.450"], correct: 0, emoji: "➖", subject: "Toán", topic: "Phép trừ", world: 2, level: 2 },

  // Level 3: Nhân
  { q: "45 x 3 = ?", options: ["135", "125"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Phép nhân", world: 2, level: 3 },
  { q: "124 x 4 = ?", options: ["496", "486"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Phép nhân", world: 2, level: 3 },

  // Level 4: Chia
  { q: "84 : 4 = ?", options: ["21", "22"], correct: 0, emoji: "➗", subject: "Toán", topic: "Phép chia", world: 2, level: 4 },
  { q: "455 : 5 = ?", options: ["91", "81"], correct: 0, emoji: "➗", subject: "Toán", topic: "Phép chia", world: 2, level: 4 },

  // Level 5: Toán lời văn
  { q: "Lan có 15 quả táo, Lan cho bạn 4 quả. Hỏi Lan còn lại bao nhiêu quả?", options: ["11 quả", "10 quả"], correct: 0, emoji: "🍎", subject: "Toán", topic: "Toán lời văn", world: 2, level: 5 },
  { q: "Một hàng ghế có 8 ghế. Hỏi 6 hàng ghế như vậy có bao nhiêu ghế?", options: ["48 ghế", "42 ghế"], correct: 0, emoji: "🪑", subject: "Toán", topic: "Toán lời văn", world: 2, level: 5 },
  { q: "Mẹ mua 3 hộp sữa hết 30.000đ. Hỏi mua 5 hộp sữa cùng loại hết bao nhiêu tiền?", options: ["50.000đ", "45.000đ"], correct: 0, emoji: "💵", subject: "Toán", topic: "Toán lời văn", world: 2, level: 5 },

  // === WORLD 3: NHÀ THÁM HIỂM ĐO LƯỜNG ===
  // Level 1: Độ dài
  { q: "1 mét (m) bằng bao nhiêu mi-li-mét (mm)?", options: ["1.000 mm", "100 mm"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đo độ dài", world: 3, level: 1 },
  { q: "Một tấm bảng dài 2m 5cm, quy đổi ra xăng-ti-mét (cm) là:", options: ["205 cm", "250 cm"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đo độ dài", world: 3, level: 1 },

  // Level 2: Khối lượng
  { q: "1 ki-lô-gam (kg) bằng bao nhiêu gam (g)?", options: ["1.000 g", "100 g"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "Khối lượng", world: 3, level: 2 },
  { q: "Hộp bánh cân nặng 400g, hộp sữa cân nặng 250g. Cả hai hộp cân nặng là:", options: ["650g", "600g"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "Khối lượng", world: 3, level: 2 },

  // Level 3: Thời gian
  { q: "Tháng 1 có bao nhiêu ngày?", options: ["31 ngày", "30 ngày"], correct: 0, emoji: "📅", subject: "Toán", topic: "Thời gian", world: 3, level: 3 },
  { q: "Kim ngắn đồng hồ chỉ giữa số 4 và số 5, kim dài chỉ số 6. Lúc này là:", options: ["4 giờ 30 phút", "5 giờ 30 phút"], correct: 0, emoji: "🕟", subject: "Toán", topic: "Thời gian", world: 3, level: 3 },

  // Level 4: Tiền Việt Nam
  { q: "Bé mua bút hết 7.000đ. Bé đưa cô bán hàng tờ 10.000đ. Cô bán hàng trả lại bé bao nhiêu tiền?", options: ["3.000đ", "2.000đ"], correct: 0, emoji: "💵", subject: "Toán", topic: "Tiền tệ", world: 3, level: 4 },
  { q: "Bạn An có 2 tờ tiền mệnh giá 5.000đ. Tổng số tiền An có là:", options: ["10.000đ", "7.000đ"], correct: 0, emoji: "💵", subject: "Toán", topic: "Tiền tệ", world: 3, level: 4 },

  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 1: Đọc hiểu
  { q: "Đoạn văn: 'Sáng nay, mèo con thức dậy thật sớm. Nó chạy ra sân tập thể dục rồi bắt một chú bướm vàng.' Câu hỏi: Mèo con đã làm gì sau khi tập thể dục?", options: ["Bắt chú bướm vàng", "Đi ngủ tiếp"], correct: 0, emoji: "🐱", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 4, level: 1 },
  { q: "Đoạn văn: 'Hoa hồng nở rực rỡ dưới nắng mai. Hương thơm thoang thoảng bay khắp khu vườn.' Câu hỏi: Hương hoa hồng bay đi đâu?", options: ["Khắp khu vườn", "Vào trong nhà"], correct: 0, emoji: "🌹", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 4, level: 1 },

  // Level 2: Chính tả
  { q: "Từ nào viết đúng chính tả tiếng Việt?", options: ["chia sẻ", "chia xẻ"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Chính tả", world: 4, level: 2 },
  { q: "Điền âm thích hợp vào chỗ trống: 'trung ...ực'", options: ["th", "tr"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Chính tả", world: 4, level: 2 },

  // Level 4: Dấu câu
  { q: "Điền dấu câu thích hợp vào cuối câu hỏi sau: 'Bé mấy tuổi rồi...'", options: ["Dấu hỏi (?)", "Dấu chấm (.)"], correct: 0, emoji: "❓", subject: "Tiếng Việt", topic: "Dấu câu", world: 4, level: 4 },
  { q: "Đặt dấu gì để ngăn cách các liệt kê: 'Em thích ăn táo... lê... xoài.'", options: ["Dấu phẩy (,)", "Dấu chấm (.)"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Dấu câu", world: 4, level: 4 },
  { q: "Điền dấu câu thích hợp vào cuối câu sau: 'Mẹ em đang nấu cơm ở trong bếp...'", options: ["Dấu chấm (.)", "Dấu hỏi (?)"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Dấu câu", world: 4, level: 4 },

  // === WORLD 5: NHÀ KHOA HỌC NHÍ ===
  // Level 1: Con người
  { q: "Cơ quan tuần hoàn gồm những bộ phận nào chính?", options: ["Tim và các mạch máu", "Dạ dày và ruột"], correct: 0, emoji: "❤️", subject: "Khoa học", topic: "Con người", world: 5, level: 1 },
  { q: "Bộ não và tủy sống thuộc cơ quan nào trong cơ thể?", options: ["Cơ quan thần kinh", "Cơ quan tiêu hóa"], correct: 0, emoji: "🧠", subject: "Khoa học", topic: "Con người", world: 5, level: 1 },

  // Level 2: Động vật
  { q: "Đâu là loài động vật có xương sống?", options: ["Con cá", "Con giun"], correct: 0, emoji: "🐟", subject: "Khoa học", topic: "Động vật", world: 5, level: 2 },
  { q: "Từ nào sau đây chỉ tên một con vật có 6 chân?", options: ["Con ong", "Con nhện"], correct: 0, emoji: "🐝", subject: "Khoa học", topic: "Động vật", world: 5, level: 2 },
  { q: "Trong các từ sau, từ nào là tên con vật?", options: ["Con mèo", "Cái bàn"], correct: 0, emoji: "🐱", subject: "Khoa học", topic: "Động vật", world: 5, level: 2 },

  // Level 3: Thực vật
  { q: "Phần nào của cây có chức năng hút nước nâng đỡ?", options: ["Rễ cây", "Lá cây"], correct: 0, emoji: "🌳", subject: "Khoa học", topic: "Thực vật", world: 5, level: 3 },
  { q: "Hoa và quả có vai trò gì chính đối với thực vật?", options: ["Sinh sản", "Hô hấp"], correct: 0, emoji: "🌸", subject: "Khoa học", topic: "Thực vật", world: 5, level: 3 },

  // Level 4: Môi trường
  { q: "Hành động nào sau đây giúp giữ gìn sạch sẽ môi trường xung quanh?", options: ["Phân loại rác thải đúng nơi quy định", "Xả rác xuống lòng đường"], correct: 0, emoji: "♻️", subject: "Khoa học", topic: "Môi trường", world: 5, level: 4 },
  { q: "Để tiết kiệm điện năng cho gia đình, bé nên làm gì?", options: ["Tắt bóng đèn khi ra khỏi phòng", "Để tivi chạy cả ngày"], correct: 0, emoji: "💡", subject: "Khoa học", topic: "Môi trường", world: 5, level: 4 },

  // === WORLD 6: TRUNG TÂM IQ ===
  // Level 1: Quy luật số & hình
  { q: "Chuỗi số: 3, 6, 9, 12, ... Số tiếp theo là số mấy?", options: ["15", "14"], correct: 0, emoji: "🔢", subject: "IQ", topic: "Quy luật", world: 6, level: 1 },
  { q: "Hình nào khác biệt trong các hình sau: 🔺, 🔵, ⬛, 🚗?", options: ["Chiếc ô tô 🚗", "Hình tròn 🔵"], correct: 0, emoji: "🚗", subject: "IQ", topic: "Quy luật", world: 6, level: 1 },

  // Level 2: Tư duy logic
  { q: "Có 3 bạn xếp hàng. Nam đứng sau Lan, Bình đứng sau Nam. Ai đứng đầu hàng?", options: ["Lan", "Bình"], correct: 0, emoji: "🧒", subject: "IQ", topic: "Tư duy", world: 6, level: 2 },
  { q: "Nếu ngày mai là thứ Tư, thì hôm nay là thứ mấy?", options: ["Thứ Ba", "Thứ Năm"], correct: 0, emoji: "📅", subject: "IQ", topic: "Tư duy", world: 6, level: 2 },

  // Level 3: Mê cung
  { q: "Để thoát khỏi mê cung tối, bé nên đi theo hướng nào?", options: ["Đi theo biển chỉ dẫn", "Cứ chạy tự do"], correct: 0, emoji: "🚪", subject: "IQ", topic: "Mê cung", world: 6, level: 3 }
]

// ─── GAME LISTEN QUESTIONS ───
export const LISTEN_QUESTIONS = [
  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 3: Từ vựng
  { word: "trung thực", options: ["🙏 Trung thực", "😡 Giận dữ", "🏃 Chạy trốn", "🚗 Đi chơi"], correct: 0, subject: "Tiếng Việt", topic: "Đọc từ", world: 4, level: 3 },
  { word: "đoàn kết", options: ["🤝 Đoàn kết", "📖 Đọc sách", "🍎 Quả táo", "🏠 Trường học"], correct: 0, subject: "Tiếng Việt", topic: "Đọc từ", world: 4, level: 3 },
  { word: "sáng tạo", options: ["💡 Sáng tạo", "😴 Ngủ ngon", "😿 Buồn bã", "🔑 Chìa khóa"], correct: 0, subject: "Tiếng Việt", topic: "Đọc từ", world: 4, level: 3 }
]

// ─── GAME MATCHING PAIRS ───
export const MATCHING_PAIRS_ALL = [
  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 5: Tập làm văn
  { id: 1, left: "Đầu tiên,", right: "em chuẩn bị đầy đủ sách vở.", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 5 },
  { id: 2, left: "Tiếp theo,", right: "em kiểm tra lại hộp bút.", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 5 },
  { id: 3, left: "Cuối cùng,", right: "em khóa cặp lại thật cẩn thận.", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 5 },

  // === WORLD 6: TRUNG TÂM IQ ===
  // Level 4: Trí nhớ
  { id: 10, left: "🐱 Mèo con", right: "🐟 Thích ăn cá", subject: "IQ", topic: "Trí nhớ", world: 6, level: 4 },
  { id: 11, left: "🐶 Chó vàng", right: "🦴 Thích gặm xương", subject: "IQ", topic: "Trí nhớ", world: 6, level: 4 },
  { id: 12, left: "🐒 Khỉ nâu", right: "🍌 Thích ăn chuối", subject: "IQ", topic: "Trí nhớ", world: 6, level: 4 },
  { id: 13, left: "🐰 Thỏ trắng", right: "🥕 Thích ăn cà rốt", subject: "IQ", topic: "Trí nhớ", world: 6, level: 4 }
]

const shuffle = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Lấy ngân hàng câu hỏi động dựa trên thế giới và level cho Lớp 3 */
export function getQuestionsForGame(worldId, levelId, isBoss = false) {
  const wId = parseInt(worldId, 10)
  const lId = parseInt(levelId, 10)

  // --- World 1: Vương Quốc Số Học ---
  if (wId === 1) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 1)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 2: Thành Phố Phép Tính ---
  if (wId === 2) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 2)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 3: Nhà Thám Hiểm Đo Lường ---
  if (wId === 3) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 3)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 4: Thư Viện Tiếng Việt ---
  if (wId === 4) {
    if (lId === 1 || lId === 2 || lId === 4) {
      const pool = CHOOSE_QUESTIONS.filter(q => q.world === 4 && q.level === lId)
      return shuffle(pool).slice(0, 3)
    }
    if (lId === 3) {
      const pool = LISTEN_QUESTIONS.filter(q => q.world === 4 && q.level === 3)
      return shuffle(pool).slice(0, 3)
    }
    if (lId === 5) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 4 && q.level === 5)
      return shuffle(pool).slice(0, 3)
    }
    if (isBoss) {
      const pool = CHOOSE_QUESTIONS.filter(q => q.world === 4)
      return shuffle(pool).slice(0, 6)
    }
  }

  // --- World 5: Nhà Khoa Học Nhí ---
  if (wId === 5) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 5)
    if (isBoss) {
      return shuffle(pool).slice(0, 8)
    }
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 6: Trung Tâm IQ ---
  if (wId === 6) {
    if (lId === 1 || lId === 2 || lId === 3) {
      const pool = CHOOSE_QUESTIONS.filter(q => q.world === 6 && q.level === lId)
      return shuffle(pool).slice(0, 3)
    }
    if (lId === 4) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 6 && q.level === 4)
      return shuffle(pool).slice(0, 4)
    }
    if (isBoss) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 6)
      return shuffle(pool).slice(0, 4)
    }
  }

  return []
}

// ─── FOCUS RECOMMENDATIONS FOR GRADE 3 ───
export const FOCUS_RECOMMENDATIONS = {
  1: {
    icon: '🏰',
    title: 'Củng cố nhận diện số lớn đến 10.000',
    desc: 'Bé cần làm quen thêm với cấu trúc số hàng nghìn. Bố mẹ nên đố vui về các con số trên các biển báo hoặc số trang sách để bé phản xạ nhanh hơn.',
    subject: 'Vương Quốc Số Học 🏰'
  },
  2: {
    icon: '➕',
    title: 'Luyện tập các phép tính cộng trừ nhân chia',
    desc: 'Kỹ năng nhân chia của bé đang còn chậm. Hãy khuyến khích bé chơi trò chơi đố vui tính nhẩm nhanh các phép tính hằng ngày.',
    subject: 'Thành Phố Phép Tính ➕'
  },
  3: {
    icon: '📏',
    title: 'Thực hành đo lường và tiền tệ thực tế',
    desc: 'Đo lường và thời gian cần thực hành thực tế. Hãy cho bé tự cầm thước đo các đồ vật hoặc tính tiền thừa khi mua sắm nhỏ.',
    subject: 'Nhà Thám Hiểm Đo Lường 📏'
  },
  4: {
    icon: '📚',
    title: 'Rèn luyện đọc hiểu và đặt câu',
    desc: 'Đoạn văn đọc hiểu tiếng Việt lớp 3 dài hơn. Bố mẹ hãy cùng bé đọc sách truyện mỗi tối và hỏi bé về ý nghĩa các tình tiết.',
    subject: 'Thư Viện Tiếng Việt 📚'
  },
  5: {
    icon: '🌿',
    title: 'Tìm hiểu về khoa học và thế giới tự nhiên',
    desc: 'Kiến thức về cơ thể và thực vật còn mới lạ. Bố mẹ có thể cho bé quan sát thiên nhiên thực tế hoặc xem hình ảnh sinh động để dễ nhớ.',
    subject: 'Nhà Khoa Học Nhí 🌿'
  },
  6: {
    icon: '🧠',
    title: 'Tăng cường tư duy logic quy luật',
    desc: 'Các dạng bài toán quy luật hình ảnh cần sự liên tưởng. Bố mẹ có thể cho bé giải các câu đố logic hoặc tìm điểm khác biệt.',
    subject: 'Trung Tâm IQ 🧠'
  }
}

/**
 * lop-5.js
 * Ngân hàng câu hỏi chuẩn chương trình Lớp 5 Việt Nam theo từng Thế giới (Worlds)
 * Môn: Toán (Số thập phân, Tỉ số phần trăm, Hình học) | Tiếng Việt | Khoa học | Lịch sử & Địa lý
 * Bám sát định hướng của Grade5_Full_Curriculum_HocVui
 */

export const WORLDS = [
  {
    id: 1,
    name: "Số Thập Phân",
    icon: "🔢",
    color: "#005da7",
    textColor: "#005da7",
    bgColor: "#d0e4ff",
    borderColor: "#005da7",
    medal: "🥇",
    medalName: "Huy chương Số Thập Phân Lớp 5",
    desc: "Đọc, viết, so sánh và thực hiện phép tính cộng, trừ, nhân, chia số thập phân.",
    levels: [
      { id: 1, title: "Đọc và viết số thập phân", desc: "Cách đọc, viết số thập phân và nhận biết giá trị theo hàng", stages: 5, game: "/game-choose-1-of-2?world=1&level=1" },
      { id: 2, title: "So sánh số thập phân", desc: "So sánh hai số thập phân, sắp xếp theo thứ tự", stages: 5, game: "/game-choose-1-of-2?world=1&level=2" },
      { id: 3, title: "Tính toán số thập phân", desc: "Thực hiện phép tính cộng, trừ, nhân, chia số thập phân", stages: 5, game: "/game-choose-1-of-2?world=1&level=3" }
    ],
    bossName: "Boss Thập Phân",
    bossDesc: "Thử thách số thập phân tổng hợp",
    bossGame: "/game-choose-1-of-2?world=1&boss=true"
  },
  {
    id: 2,
    name: "Tỉ Số và Phần Trăm",
    icon: "📊",
    color: "#b71c1c",
    textColor: "#b71c1c",
    bgColor: "#ffebee",
    borderColor: "#ffcdd2",
    medal: "💎",
    medalName: "Viên Ngọc Phần Trăm Lớp 5",
    desc: "Làm quen với khái niệm tỉ số, tỉ số phần trăm và giải các bài toán thực tế.",
    levels: [
      { id: 1, title: "Khái niệm tỉ số", desc: "Hiểu về tỉ số giữa hai đại lượng và viết tỉ số", stages: 5, game: "/game-choose-1-of-2?world=2&level=1" },
      { id: 2, title: "Tỉ số phần trăm", desc: "Tìm tỉ số phần trăm của hai số và chuyển đổi", stages: 5, game: "/game-choose-1-of-2?world=2&level=2" },
      { id: 3, title: "Bài toán phần trăm", desc: "Giải toán thực tế tìm giá trị phần trăm hoặc cả số", stages: 5, game: "/game-choose-1-of-2?world=2&level=3" }
    ],
    bossName: "Boss Phần Trăm",
    bossDesc: "Chiến thắng Thành phố phần trăm",
    bossGame: "/game-choose-1-of-2?world=2&boss=true"
  },
  {
    id: 3,
    name: "Hình Học Lớp 5",
    icon: "📐",
    color: "#e65100",
    textColor: "#e65100",
    bgColor: "#fff3e0",
    borderColor: "#ffe0b2",
    medal: "📐",
    medalName: "Huy chương Hình Học Lớp 5",
    desc: "Tính chu vi, diện tích hình tròn, hình thang; thể tích hình hộp chữ nhật và hình lập phương.",
    levels: [
      { id: 1, title: "Chu vi hình tròn & tam giác", desc: "Tính chu vi hình tròn, tam giác, hình hộp", stages: 5, game: "/game-choose-1-of-2?world=3&level=1" },
      { id: 2, title: "Diện tích hình tròn & thang", desc: "Tính diện tích hình tròn, diện tích hình thang", stages: 5, game: "/game-choose-1-of-2?world=3&level=2" },
      { id: 3, title: "Thể tích hộp chữ nhật", desc: "Công thức và tính toán thể tích hình hộp chữ nhật", stages: 5, game: "/game-choose-1-of-2?world=3&level=3" },
      { id: 4, title: "Thể tích hình lập phương", desc: "Tính thể tích hình lập phương và các bài toán liên quan", stages: 5, game: "/game-choose-1-of-2?world=3&level=4" }
    ],
    bossName: "Boss Hình Học",
    bossDesc: "Thử thách tổng hợp kiến thức hình học lớp 5",
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
    medalName: "Huy chương Tiếng Việt Lớp 5",
    desc: "Nâng cao kỹ năng đọc hiểu văn bản, luyện từ và câu chính xác và viết tập làm văn hay.",
    levels: [
      { id: 1, title: "Đọc hiểu", desc: "Đọc hiểu các văn bản nghệ thuật và khoa học lớp 5", stages: 5, game: "/game-choose-1-of-2?world=4&level=1" },
      { id: 2, title: "Luyện từ và câu", desc: "Từ đồng nghĩa, trái nghĩa, từ đồng âm, từ nhiều nghĩa", stages: 5, game: "/game-choose-1-of-2?world=4&level=2" },
      { id: 3, title: "Chính tả", desc: "Nghe phát âm từ vựng khó lớp 5 và chọn cách viết đúng", stages: 5, game: "/game-listen-and-select?world=4&level=3" },
      { id: 4, title: "Tập làm văn", desc: "Sắp xếp cấu trúc bài văn tả cảnh, tả người hoặc kể chuyện", stages: 5, game: "/game-simple-matching?world=4&level=4" }
    ],
    bossName: "Boss Tiếng Việt",
    bossDesc: "Thử thách Thần Thư Viện Lớp 5",
    bossGame: "/game-choose-1-of-2?world=4&boss=true"
  },
  {
    id: 5,
    name: "Nhà Khoa Học",
    icon: "🔬",
    color: "#1b5e20",
    textColor: "#1b5e20",
    bgColor: "#e8f5e9",
    borderColor: "#c8e6c9",
    medal: "🔬",
    medalName: "Huy chương Khoa Học Lớp 5",
    desc: "Tìm hiểu sự phát triển cơ thể người, dinh dưỡng, các dạng năng lượng và môi trường.",
    levels: [
      { id: 1, title: "Cơ thể người", desc: "Sự thụ tinh, sự lớn lên của cơ thể, giới tính và dậy thì", stages: 5, game: "/game-choose-1-of-2?world=5&level=1" },
      { id: 2, title: "Dinh dưỡng & Sức khỏe", desc: "Chất béo, chất đạm, phòng bệnh còi xương, suy dinh dưỡng", stages: 5, game: "/game-choose-1-of-2?world=5&level=2" },
      { id: 3, title: "Năng lượng", desc: "Nguồn năng lượng mặt trời, gió, nước và chất đốt dầu mỏ", stages: 5, game: "/game-choose-1-of-2?world=5&level=3" },
      { id: 4, title: "Môi trường", desc: "Tác động con người đến môi trường đất, nước và tài nguyên", stages: 5, game: "/game-choose-1-of-2?world=5&level=4" }
    ],
    bossName: "Boss Khoa Học",
    bossDesc: "Thử thách nhà khoa học tổng hợp",
    bossGame: "/game-choose-1-of-2?world=5&boss=true"
  },
  {
    id: 6,
    name: "Lịch Sử & Địa Lý",
    icon: "🗺️",
    color: "#0d47a1",
    textColor: "#0d47a1",
    bgColor: "#e3f2fd",
    borderColor: "#bbdefb",
    medal: "🇻🇳",
    medalName: "Huy chương Sử Địa Lớp 5",
    desc: "Chinh phục kiến thức lịch sử, địa lý và biển đảo của Việt Nam.",
    levels: [
      { id: 1, title: "Lịch sử Việt Nam", desc: "Lịch sử cận đại và hiện đại tiêu biểu của đất nước", stages: 5, game: "/game-choose-1-of-2?world=6&level=1" },
      { id: 2, title: "Nhân vật lịch sử", desc: "Các anh hùng dân tộc giải phóng đất nước và dựng nước", stages: 5, game: "/game-choose-1-of-2?world=6&level=2" },
      { id: 3, title: "Địa lý Việt Nam", desc: "Đặc điểm vị trí, sông ngòi, khí hậu, vùng miền nước ta", stages: 5, game: "/game-choose-1-of-2?world=6&level=3" },
      { id: 4, title: "Biển đảo Việt Nam", desc: "Tìm hiểu về Biển Đông, quần đảo Hoàng Sa và Trường Sa", stages: 5, game: "/game-simple-matching?world=6&level=4" }
    ],
    bossName: "Boss Sử Địa",
    bossDesc: "Thử thách Nhà Sử Địa Tài Ba tổng hợp",
    bossGame: "/game-choose-1-of-2?world=6&boss=true"
  }
]

// ─── GAME CHOOSE QUESTIONS ───
export const CHOOSE_QUESTIONS = [
  // === WORLD 1: SỐ THẬP PHÂN ===
  // Level 1: Đọc và viết số thập phân
  { q: "Số thập phân 5,08 đọc là gì?", options: ["Năm phẩy không tám", "Năm phẩy tám"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số thập phân", world: 1, level: 1 },
  { q: "Số gồm chín đơn vị, ba phần mười và hai phần trăm viết là:", options: ["9,32", "9,032"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số thập phân", world: 1, level: 1 },
  { q: "Giá trị của chữ số 7 trong số 12,574 là bao nhiêu?", options: ["7/100 (Bảy phần trăm)", "7/10 (Bảy phần mười)"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số thập phân", world: 1, level: 1 },
  { q: "Số thập phân gồm không đơn vị, sáu phần nghìn viết là:", options: ["0,006", "0,06"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số thập phân", world: 1, level: 1 },

  // Level 2: So sánh số thập phân
  { q: "So sánh: 3,45 ... 3,450. Điền dấu thích hợp:", options: ["=", ">"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh số thập phân", world: 1, level: 2 },
  { q: "Sắp xếp theo thứ tự giảm dần: 5,4; 5,39; 5,42", options: ["5,42; 5,4; 5,39", "5,39; 5,4; 5,42"], correct: 0, emoji: "📉", subject: "Toán", topic: "So sánh số thập phân", world: 1, level: 2 },
  { q: "Số thập phân nhỏ nhất trong các số: 0,12; 0,021; 0,201 là:", options: ["0,021", "0,12"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số thập phân", world: 1, level: 2 },
  { q: "Số tự nhiên x thỏa mãn: 2,5 < x < 3,1 là:", options: ["3", "2"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số thập phân", world: 1, level: 2 },

  // Level 3: Cộng, trừ, nhân, chia số thập phân
  { q: "Tính: 12,5 + 7,85 = ?", options: ["20,35", "19,35"], correct: 0, emoji: "➕", subject: "Toán", topic: "Tính số thập phân", world: 1, level: 3 },
  { q: "Tính: 20 - 4,6 = ?", options: ["15,4", "16,4"], correct: 0, emoji: "➖", subject: "Toán", topic: "Tính số thập phân", world: 1, level: 3 },
  { q: "Tính: 1,5 x 0,4 = ?", options: ["0,6", "6"], correct: 0, emoji: "✖️", subject: "Toán", topic: "Tính số thập phân", world: 1, level: 3 },
  { q: "Tính: 4,5 : 0,5 = ?", options: ["9", "0,9"], correct: 0, emoji: "➗", subject: "Toán", topic: "Tính số thập phân", world: 1, level: 3 },

  // === WORLD 2: TỈ SỐ VÀ PHẦN TRĂM ===
  // Level 1: Khái niệm tỉ số
  { q: "Số nam là 15 và số nữ là 20. Tỉ số của số nam và số nữ là:", options: ["3/4", "4/3"], correct: 0, emoji: "📊", subject: "Toán", topic: "Tỉ số", world: 2, level: 1 },
  { q: "Trên bản đồ tỉ lệ 1:1.000, khoảng cách 1cm tương ứng ngoài thực tế là bao nhiêu mét?", options: ["10 m", "1 m"], correct: 0, emoji: "🗺️", subject: "Toán", topic: "Tỉ số", world: 2, level: 1 },
  { q: "Một rổ có 5 quả cam và 7 quả quýt. Tỉ số của số quýt và số cam là:", options: ["7/5", "5/7"], correct: 0, emoji: "🍊", subject: "Toán", topic: "Tỉ số", world: 2, level: 1 },

  // Level 2: Tỉ số phần trăm
  { q: "Viết số thập phân 0,45 dưới dạng tỉ số phần trăm:", options: ["45%", "4,5%"], correct: 0, emoji: "📊", subject: "Toán", topic: "Tỉ số phần trăm", world: 2, level: 2 },
  { q: "Tỉ số phần trăm của 3 và 5 là bao nhiêu?", options: ["60%", "15%"], correct: 0, emoji: "📊", subject: "Toán", topic: "Tỉ số phần trăm", world: 2, level: 2 },
  { q: "Phân số 1/4 viết dưới dạng tỉ số phần trăm là:", options: ["25%", "40%"], correct: 0, emoji: "📊", subject: "Toán", topic: "Tỉ số phần trăm", world: 2, level: 2 },

  // Level 3: Bài toán phần trăm
  { q: "Tìm 15% của 200:", options: ["30", "15"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Toán phần trăm", world: 2, level: 3 },
  { q: "Lớp 5A có 40 học sinh, trong đó có 25% học sinh đạt loại giỏi. Hỏi lớp có bao nhiêu học sinh giỏi?", options: ["10 học sinh", "15 học sinh"], correct: 0, emoji: "🧑‍🎓", subject: "Toán", topic: "Toán phần trăm", world: 2, level: 3 },
  { q: "Mua một cuốn sách giá 50.000đ được giảm giá 10%. Hỏi phải trả bao nhiêu tiền?", options: ["45.000đ", "40.000đ"], correct: 0, emoji: "💵", subject: "Toán", topic: "Toán phần trăm", world: 2, level: 3 },

  // === WORLD 3: HÌNH HỌC LỚP 5 ===
  // Level 1: Chu vi hình tròn & tam giác
  { q: "Tính chu vi hình tròn có bán kính 5cm:", options: ["31,4 cm", "15,7 cm"], correct: 0, emoji: "🔵", subject: "Toán", topic: "Chu vi", world: 3, level: 1 },
  { q: "Chu vi hình tròn có đường kính 6cm là bao nhiêu?", options: ["18,84 cm", "9,42 cm"], correct: 0, emoji: "🔵", subject: "Toán", topic: "Chu vi", world: 3, level: 1 },
  { q: "Một hình tam giác đều có cạnh 8cm. Chu vi của nó là:", options: ["24 cm", "16 cm"], correct: 0, emoji: "🔺", subject: "Toán", topic: "Chu vi", world: 3, level: 1 },

  // Level 2: Diện tích hình tròn & thang
  { q: "Tính diện tích hình tròn có bán kính 3cm:", options: ["28,26 cm²", "18,84 cm²"], correct: 0, emoji: "⚪", subject: "Toán", topic: "Diện tích", world: 3, level: 2 },
  { q: "Diện tích hình thang có đáy lớn 10cm, đáy bé 6cm, chiều cao 4cm là:", options: ["32 cm²", "64 cm²"], correct: 0, emoji: "📐", subject: "Toán", topic: "Diện tích", world: 3, level: 2 },
  { q: "Bán kính hình tròn tăng lên 2 lần thì diện tích hình tròn tăng lên mấy lần?", options: ["4 lần", "2 lần"], correct: 0, emoji: "⚪", subject: "Toán", topic: "Diện tích", world: 3, level: 2 },

  // Level 3: Thể tích hộp chữ nhật
  { q: "Thể tích hình hộp chữ nhật có chiều dài 6dm, rộng 5dm, cao 4dm là:", options: ["120 dm³", "60 dm³"], correct: 0, emoji: "📦", subject: "Toán", topic: "Thể tích", world: 3, level: 3 },
  { q: "Công thức tính thể tích hình hộp chữ nhật (a, b, c là các kích thước) là gì?", options: ["V = a x b x c", "V = (a + b) x c"], correct: 0, emoji: "📦", subject: "Toán", topic: "Thể tích", world: 3, level: 3 },
  { q: "Bể nước có thể tích 2 m³. Đổi ra đề-xi-mét khối (dm³) là:", options: ["2.000 dm³", "200 dm³"], correct: 0, emoji: "💧", subject: "Toán", topic: "Thể tích", world: 3, level: 3 },

  // Level 4: Thể tích hình lập phương
  { q: "Tính thể tích hình lập phương có cạnh 4cm:", options: ["64 cm³", "16 cm³"], correct: 0, emoji: "🧊", subject: "Toán", topic: "Thể tích", world: 3, level: 4 },
  { q: "Một hình lập phương có diện tích toàn phần là 96 cm². Thể tích của nó là:", options: ["64 cm³", "96 cm³"], correct: 0, emoji: "🧊", subject: "Toán", topic: "Thể tích", world: 3, level: 4 },
  { q: "Cạnh hình lập phương là 5dm. Thể tích là bao nhiêu?", options: ["125 dm³", "150 dm³"], correct: 0, emoji: "🧊", subject: "Toán", topic: "Thể tích", world: 3, level: 4 },

  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 1: Đọc hiểu
  { q: "Đoạn thơ: 'Thân gầy guộc, lá mong manh / Mà sao nên luỹ nên thành tre ơi?' Câu thơ trên ca ngợi những phẩm chất gì?", options: ["Sức sống mãnh liệt, sự đùm bọc, đoàn kết", "Sự yếu ớt và dễ bị gục ngã"], correct: 0, emoji: "🎋", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 4, level: 1 },
  { q: "Đoạn văn: 'Hồ Ba Bể nằm giữa những dãy núi đá vôi dựng đứng của tỉnh Bắc Kạn. Mặt hồ phẳng lặng như một tấm gương soi bóng núi non.' Hồ Ba Bể nằm ở tỉnh nào?", options: ["Tỉnh Bắc Kạn", "Tỉnh Lào Cai"], correct: 0, emoji: "🏞️", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 4, level: 1 },

  // Level 2: Luyện từ và câu
  { q: "Từ nào sau đây đồng nghĩa với từ 'hoà bình'?", options: ["thanh bình", "chiến tranh"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Luyện từ", world: 4, level: 2 },
  { q: "Từ nào sau đây trái nghĩa với từ 'hèn nhát'?", options: ["dũng cảm", "yếu đuối"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Luyện từ", world: 4, level: 2 },
  { q: "Trong câu: 'Mẹ em rất hiền hậu.', từ 'hiền hậu' thuộc từ loại nào?", options: ["Tính từ", "Danh từ"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Luyện từ", world: 4, level: 2 },
  { q: "Từ 'đường' trong 'đường đi' và 'đường ăn' có quan hệ gì?", options: ["Từ đồng âm", "Từ nhiều nghĩa"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Luyện từ", world: 4, level: 2 },

  // === WORLD 5: NHÀ KHOA HỌC ===
  // Level 1: Cơ thể người
  { q: "Trứng đã được thụ tinh gọi là gì?", options: ["Hợp tử", "Phôi"], correct: 0, emoji: "🧫", subject: "Khoa học", topic: "Cơ thể người", world: 5, level: 1 },
  { q: "Quá trình tinh trùng kết hợp với trứng gọi là gì?", options: ["Sự thụ tinh", "Sự phân chia"], correct: 0, emoji: "🧫", subject: "Khoa học", topic: "Cơ thể người", world: 5, level: 1 },
  { q: "Tuổi dậy thì ở con trai thường bắt đầu trong khoảng độ tuổi nào?", options: ["13 đến 17 tuổi", "10 đến 13 tuổi"], correct: 0, emoji: "🧒", subject: "Khoa học", topic: "Cơ thể người", world: 5, level: 1 },

  // Level 2: Dinh dưỡng & Sức khỏe
  { q: "Nhóm chất dinh dưỡng nào giúp cơ thể xây dựng tế bào, phát triển cơ bắp?", options: ["Chất đạm", "Chất béo"], correct: 0, emoji: "🥩", subject: "Khoa học", topic: "Dinh dưỡng", world: 5, level: 2 },
  { q: "Để phòng tránh bệnh sốt rét, chúng ta nên làm gì?", options: ["Mắc màn khi ngủ, diệt muỗi và lăng quăng", "Uống nhiều nước đá"], correct: 0, emoji: "🦟", subject: "Khoa học", topic: "Sức khỏe", world: 5, level: 2 },
  { q: "Bệnh còi xương ở trẻ em thường do thiếu hụt vitamin nào?", options: ["Vitamin D", "Vitamin C"], correct: 0, emoji: "🦴", subject: "Khoa học", topic: "Sức khỏe", world: 5, level: 2 },

  // Level 3: Năng lượng
  { q: "Năng lượng mặt trời, năng lượng gió thuộc loại năng lượng nào?", options: ["Năng lượng tái tạo (sạch)", "Năng lượng không tái tạo"], correct: 0, emoji: "☀️", subject: "Khoa học", topic: "Năng lượng", world: 5, level: 3 },
  { q: "Để sản xuất điện từ năng lượng nước chảy, người ta xây dựng công trình gì?", options: ["Nhà máy thủy điện", "Nhà máy nhiệt điện"], correct: 0, emoji: "🌊", subject: "Khoa học", topic: "Năng lượng", world: 5, level: 3 },
  { q: "Việc sử dụng chất đốt (than đá, dầu mỏ) quá mức gây ra tác hại gì cho môi trường?", options: ["Ô nhiễm không khí và biến đổi khí hậu", "Làm sạch bầu khí quyển"], correct: 0, emoji: "🏭", subject: "Khoa học", topic: "Năng lượng", world: 5, level: 3 },

  // Level 4: Môi trường
  { q: "Hoạt động nào sau đây của con người góp phần bảo vệ tài nguyên rừng?", options: ["Trồng rừng và ngăn chặn phá rừng bừa bãi", "Đốt rừng làm nương rẫy"], correct: 0, emoji: "🌳", subject: "Khoa học", topic: "Môi trường", world: 5, level: 4 },
  { q: "Rác thải nhựa nếu chôn lấp dưới đất sẽ gây ra tác hại gì cho môi trường?", options: ["Làm ô nhiễm đất và mất hàng trăm năm mới phân hủy", "Làm đất màu mỡ hơn"], correct: 0, emoji: "♻️", subject: "Khoa học", topic: "Môi trường", world: 5, level: 4 },
  { q: "Tài nguyên nào sau đây không thể phục hồi được nếu bị khai thác cạn kiệt?", options: ["Quặng kim loại và than đá", "Nước mưa"], correct: 0, emoji: "⛏️", subject: "Khoa học", topic: "Môi trường", world: 5, level: 4 },

  // === WORLD 6: LỊCH SỬ & ĐỊA LÝ ===
  // Level 1: Lịch sử Việt Nam
  { q: "Đảng Cộng sản Việt Nam ra đời vào ngày, tháng, năm nào?", options: ["3/2/1930", "2/9/1945"], correct: 0, emoji: "🇻🇳", subject: "Lịch sử", topic: "Lịch sử VN", world: 6, level: 1 },
  { q: "Ngày 2 tháng 9 năm 1945 đã diễn ra sự kiện lịch sử trọng đại nào của dân tộc?", options: ["Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình", "Chiến thắng Điện Biên Phủ"], correct: 0, emoji: "🏛️", subject: "Lịch sử", topic: "Lịch sử VN", world: 6, level: 1 },
  { q: "Phong trào Đông Du do ai lãnh đạo để đưa thanh niên sang Nhật học tập?", options: ["Phan Bội Châu", "Phan Châu Trinh"], correct: 0, emoji: "⛵", subject: "Lịch sử", topic: "Lịch sử VN", world: 6, level: 1 },

  // Level 2: Nhân vật lịch sử
  { q: "Người đã lấy thân mình chèn lưng pháo trong chiến dịch Điện Biên Phủ là ai?", options: ["Tô Vĩnh Diện", "Phan Đình Giót"], correct: 0, emoji: "⚔️", subject: "Lịch sử", topic: "Nhân vật LS", world: 6, level: 2 },
  { q: "Vị anh hùng trẻ tuổi nào đã lấy thân mình lấp lỗ châu mai?", options: ["Phan Đình Giót", "Bế Văn Đàn"], correct: 0, emoji: "⚔️", subject: "Lịch sử", topic: "Nhân vật LS", world: 6, level: 2 },
  { q: "Nguyễn Tất Thành (Bác Hồ) ra đi tìm đường cứu nước vào ngày 5/6/1911 tại địa điểm nào?", options: ["Bến Nhà Rồng (Sài Gòn)", "Cảng Hải Phòng"], correct: 0, emoji: "🚢", subject: "Lịch sử", topic: "Nhân vật LS", world: 6, level: 2 },

  // Level 3: Địa lý Việt Nam
  { q: "Nước ta nằm ở phía nào của bán đảo Đông Dương?", options: ["Phía đông", "Phía tây"], correct: 0, emoji: "🗺️", subject: "Địa lý", topic: "Địa lý VN", world: 6, level: 3 },
  { q: "Đất nước Việt Nam trên bản đồ thế giới có hình dáng giống chữ cái nào?", options: ["Chữ S", "Chữ L"], correct: 0, emoji: "🗺️", subject: "Địa lý", topic: "Địa lý VN", world: 6, level: 3 },
  { q: "Phần đất liền của nước ta tiếp giáp với những quốc gia nào?", options: ["Trung Quốc, Lào, Cam-pu-chia", "Thái Lan, Lào, Cam-pu-chia"], correct: 0, emoji: "🗺️", subject: "Địa lý", topic: "Địa lý VN", world: 6, level: 3 }
]

// ─── GAME LISTEN QUESTIONS ───
export const LISTEN_QUESTIONS = [
  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 3: Chính tả
  { word: "nhiệm vụ", options: ["📝 Nhiệm vụ", "❌ Nhiệm vụ", "😴 Ngủ quên", "🍔 Ăn bánh"], correct: 0, subject: "Tiếng Việt", topic: "Chính tả", world: 4, level: 3 },
  { word: "truyền thống", options: ["🇻🇳 Truyền thống", "❌ Truyền thống", "🚗 Đi chơi", "🎮 Trò chơi"], correct: 0, subject: "Tiếng Việt", topic: "Chính tả", world: 4, level: 3 },
  { word: "trung hậu", options: ["🙏 Trung hậu", "❌ Trung hậu", "😡 Tức giận", "😴 Lười biếng"], correct: 0, subject: "Tiếng Việt", topic: "Chính tả", world: 4, level: 3 }
]

// ─── GAME MATCHING PAIRS ───
export const MATCHING_PAIRS_ALL = [
  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 4: Tập làm văn (Ghép nối bài văn tả cảnh)
  { id: 100, left: "Mở bài", right: "Giới thiệu cảnh định tả (ví dụ: công viên buổi sáng)", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 4 },
  { id: 101, left: "Thân bài", right: "Tả chi tiết cảnh vật theo trình tự thời gian/không gian", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 4 },
  { id: 102, left: "Kết bài", right: "Nêu cảm nghĩ, tình cảm của em đối với cảnh vật đó", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 4 },

  // === WORLD 6: LỊCH SỬ & ĐỊA LÝ ===
  // Level 4: Biển đảo Việt Nam (Ghép địa danh)
  { id: 200, left: "Huyện đảo Hoàng Sa", right: "Thành phố Đà Nẵng", subject: "Địa lý", topic: "Biển đảo", world: 6, level: 4 },
  { id: 201, left: "Huyện đảo Trường Sa", right: "Tỉnh Khánh Hòa", subject: "Địa lý", topic: "Biển đảo", world: 6, level: 4 },
  { id: 202, left: "Đảo Phú Quốc", right: "Tỉnh Kiên Giang", subject: "Địa lý", topic: "Biển đảo", world: 6, level: 4 },
  { id: 203, left: "Côn Đảo", right: "Tỉnh Bà Rịa - Vũng Tàu", subject: "Địa lý", topic: "Biển đảo", world: 6, level: 4 }
]

const shuffle = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Lấy ngân hàng câu hỏi động dựa trên thế giới và level cho Lớp 5 */
export function getQuestionsForGame(worldId, levelId, isBoss = false) {
  const wId = parseInt(worldId, 10)
  const lId = parseInt(levelId, 10)

  // --- World 1: Số Thập Phân ---
  if (wId === 1) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 1)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 2: Tỉ Số và Phần Trăm ---
  if (wId === 2) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 2)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 3: Hình Học Lớp 5 ---
  if (wId === 3) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 3)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 4: Thư Viện Tiếng Việt ---
  if (wId === 4) {
    if (lId === 3) {
      const pool = LISTEN_QUESTIONS.filter(q => q.world === 4 && q.level === 3)
      return shuffle(pool).slice(0, 3)
    }
    if (lId === 4) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 4 && q.level === 4)
      return shuffle(pool).slice(0, 3)
    }
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 4)
    if (isBoss) return shuffle(pool).slice(0, 6)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 3)
  }

  // --- World 5: Nhà Khoa Học ---
  if (wId === 5) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 5)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 6: Lịch Sử & Địa Lý ---
  if (wId === 6) {
    if (lId === 4) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 6 && q.level === 4)
      return shuffle(pool).slice(0, 4)
    }
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 6)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  return []
}

// ─── FOCUS RECOMMENDATIONS FOR GRADE 5 ───
export const FOCUS_RECOMMENDATIONS = {
  1: {
    icon: '🔢',
    title: 'Củng cố tính toán số thập phân',
    desc: 'Số thập phân là nền tảng tính toán của lớp 5. Bố mẹ nên cho bé luyện cộng, trừ, nhân, chia số thập phân qua các phép tính hàng ngày (ví dụ như đi chợ cùng mẹ).',
    subject: 'Số Thập Phân 🔢'
  },
  2: {
    icon: '📊',
    title: 'Luyện tập giải toán tỉ số phần trăm',
    desc: 'Tìm tỉ số phần trăm có nhiều ứng dụng thực tế. Bố mẹ có thể hướng dẫn bé tính số tiền được giảm giá khi mua quần áo, đồ chơi để bé nắm chắc lý thuyết.',
    subject: 'Tỉ Số và Phần Trăm 📊'
  },
  3: {
    icon: '📐',
    title: 'Nắm vững hình học phẳng và hình khối',
    desc: 'Lớp 5 bé bắt đầu làm quen diện tích hình tròn, hình thang và thể tích hình lập phương, hình hộp chữ nhật. Hãy cùng bé tìm các đồ vật hình hộp quanh nhà để thực hành đo đạc.',
    subject: 'Hình Học Lớp 5 📐'
  },
  4: {
    icon: '📚',
    title: 'Rèn luyện từ nhiều nghĩa và cảm thụ văn học',
    desc: 'Luyện từ và câu lớp 5 có các kiến thức sâu hơn về từ đồng nghĩa, trái nghĩa, từ nhiều nghĩa. Bố mẹ khích lệ bé đọc truyện ngắn và ghi chép lại các từ vựng hay.',
    subject: 'Thư Viện Tiếng Việt 📚'
  },
  5: {
    icon: '🔬',
    title: 'Phát triển tư duy khoa học và bảo vệ môi trường',
    desc: 'Kiến thức khoa học lớp 5 liên quan đến cơ thể người, dậy thì và các dạng năng lượng sạch. Bố mẹ hãy trò chuyện cởi mở về thay đổi thể chất và thói quen tiết kiệm năng lượng cùng bé.',
    subject: 'Nhà Khoa Học 🔬'
  },
  6: {
    icon: '🗺️',
    title: 'Tìm hiểu sâu về lịch sử, địa lý và biển đảo quê hương',
    desc: 'Được học về lịch sử cận hiện đại, danh lam thắng cảnh và chủ quyền biển đảo. Bố mẹ có thể cho bé xem phim tư liệu lịch sử hoặc giới thiệu bản đồ biển đảo Việt Nam.',
    subject: 'Lịch Sử & Địa Lý 🗺️'
  }
}

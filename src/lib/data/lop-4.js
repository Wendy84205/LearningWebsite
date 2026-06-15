/**
 * lop-4.js
 * Ngân hàng câu hỏi chuẩn chương trình Lớp 4 Việt Nam theo từng Thế giới (Worlds)
 * Môn: Toán (Số tự nhiên, Phân số, Hình học) | Tiếng Việt | Khoa học | Địa lý & Lịch sử
 * Bám sát tài liệu Grade4_Master_Plan_HocVui.docx
 */

export const WORLDS = [
  {
    id: 1,
    name: "Vương Quốc Số Tự Nhiên",
    icon: "🏰",
    color: "#005da7",
    textColor: "#005da7",
    bgColor: "#d0e4ff",
    borderColor: "#005da7",
    medal: "🥇",
    medalName: "Huy chương Số Học Lớp 4",
    desc: "Làm chủ các số tự nhiên lớn, so sánh sắp xếp, làm tròn số và biểu thức số.",
    levels: [
      { id: 1, title: "Số tự nhiên lớn", desc: "Đọc, viết số đến hàng trăm triệu, nhận biết giá trị chữ số", stages: 5, game: "/game-choose-1-of-2?world=1&level=1" },
      { id: 2, title: "So sánh và sắp xếp số", desc: "So sánh các số tự nhiên nhiều chữ số, sắp xếp tăng/giảm dần", stages: 5, game: "/game-choose-1-of-2?world=1&level=2" },
      { id: 3, title: "Làm tròn số", desc: "Làm tròn số đến hàng nghìn, hàng chục nghìn, hàng trăm nghìn", stages: 5, game: "/game-choose-1-of-2?world=1&level=3" },
      { id: 4, title: "Biểu thức số", desc: "Tính giá trị biểu thức có ngoặc và nhiều phép tính", stages: 5, game: "/game-choose-1-of-2?world=1&level=4" }
    ],
    bossName: "Boss Số Học",
    bossDesc: "Thử thách tổng hợp về số tự nhiên lớn",
    bossGame: "/game-choose-1-of-2?world=1&boss=true"
  },
  {
    id: 2,
    name: "Thành Phố Phân Số",
    icon: "➗",
    color: "#b71c1c",
    textColor: "#b71c1c",
    bgColor: "#ffebee",
    borderColor: "#ffcdd2",
    medal: "💎",
    medalName: "Viên Ngọc Phân Số Lớp 4",
    desc: "Khám phá thế giới phân số: khái niệm, so sánh, rút gọn và phép tính cộng trừ.",
    levels: [
      { id: 1, title: "Khái niệm phân số", desc: "Nhận biết phân số, tử số, mẫu số và ý nghĩa phân số", stages: 5, game: "/game-choose-1-of-2?world=2&level=1" },
      { id: 2, title: "Phân số bằng nhau", desc: "Rút gọn phân số và tìm phân số bằng nhau", stages: 5, game: "/game-simple-matching?world=2&level=2" },
      { id: 3, title: "So sánh phân số", desc: "So sánh hai phân số cùng mẫu và khác mẫu", stages: 5, game: "/game-choose-1-of-2?world=2&level=3" },
      { id: 4, title: "Cộng trừ phân số", desc: "Phép cộng trừ phân số cùng mẫu và khác mẫu đơn giản", stages: 5, game: "/game-choose-1-of-2?world=2&level=4" }
    ],
    bossName: "Boss Phân Số",
    bossDesc: "Chinh phục mọi bài toán phân số nâng cao",
    bossGame: "/game-choose-1-of-2?world=2&boss=true"
  },
  {
    id: 3,
    name: "Học Viện Hình Học",
    icon: "📐",
    color: "#e65100",
    textColor: "#e65100",
    bgColor: "#fff3e0",
    borderColor: "#ffe0b2",
    medal: "📐",
    medalName: "Huy chương Hình Học Lớp 4",
    desc: "Tìm hiểu các loại góc, đường thẳng, hình bình hành và tính diện tích chu vi.",
    levels: [
      { id: 1, title: "Góc", desc: "Nhận biết góc nhọn, góc vuông, góc tù, góc bẹt", stages: 5, game: "/game-choose-1-of-2?world=3&level=1" },
      { id: 2, title: "Đường thẳng", desc: "Đường thẳng song song và đường thẳng vuông góc", stages: 5, game: "/game-choose-1-of-2?world=3&level=2" },
      { id: 3, title: "Hình bình hành", desc: "Nhận biết và tính chất hình bình hành, hình thoi", stages: 5, game: "/game-choose-1-of-2?world=3&level=3" },
      { id: 4, title: "Diện tích và chu vi", desc: "Tính chu vi và diện tích hình chữ nhật, hình bình hành, hình thoi", stages: 5, game: "/game-choose-1-of-2?world=3&level=4" }
    ],
    bossName: "Boss Hình Học",
    bossDesc: "Thử thách tổng hợp kiến thức hình học lớp 4",
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
    medalName: "Huy chương Tiếng Việt Lớp 4",
    desc: "Đọc hiểu văn bản dài, phân biệt từ ghép từ láy, nhận diện từ loại và tập làm văn.",
    levels: [
      { id: 1, title: "Đọc hiểu", desc: "Đọc các đoạn văn và chọn câu trả lời đọc hiểu chính xác", stages: 5, game: "/game-choose-1-of-2?world=4&level=1" },
      { id: 2, title: "Từ ghép và từ láy", desc: "Phân biệt từ ghép (đồng nghĩa, trái nghĩa) và từ láy (âm, vần)", stages: 5, game: "/game-choose-1-of-2?world=4&level=2" },
      { id: 3, title: "Danh từ - Động từ - Tính từ", desc: "Nhận diện và phân loại các từ loại chính trong câu", stages: 5, game: "/game-simple-matching?world=4&level=3" },
      { id: 4, title: "Tập làm văn", desc: "Sắp xếp ý, viết đoạn văn miêu tả đồ vật, cây cối, con vật", stages: 5, game: "/game-choose-1-of-2?world=4&level=4" }
    ],
    bossName: "Boss Tiếng Việt",
    bossDesc: "Thử thách ngữ pháp và đọc hiểu tổng hợp lớp 4",
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
    medalName: "Huy chương Khoa Học Lớp 4",
    desc: "Khám phá cơ thể người, dinh dưỡng sức khỏe, thế giới động thực vật và vật chất năng lượng.",
    levels: [
      { id: 1, title: "Con người và sức khỏe", desc: "Dinh dưỡng, phòng bệnh, vệ sinh an toàn thực phẩm", stages: 5, game: "/game-choose-1-of-2?world=5&level=1" },
      { id: 2, title: "Thực vật", desc: "Cấu tạo, quang hợp, vai trò và bảo vệ thực vật", stages: 5, game: "/game-choose-1-of-2?world=5&level=2" },
      { id: 3, title: "Động vật", desc: "Phân loại động vật có xương sống và không xương sống", stages: 5, game: "/game-choose-1-of-2?world=5&level=3" },
      { id: 4, title: "Vật chất và năng lượng", desc: "Nước, không khí, ánh sáng, nhiệt và âm thanh", stages: 5, game: "/game-choose-1-of-2?world=5&level=4" }
    ],
    bossName: "Boss Khoa Học",
    bossDesc: "Thử thách kiến thức khoa học tự nhiên tổng hợp",
    bossGame: "/game-choose-1-of-2?world=5&boss=true"
  },
  {
    id: 6,
    name: "Khám Phá Việt Nam",
    icon: "🗺️",
    color: "#0d47a1",
    textColor: "#0d47a1",
    bgColor: "#e3f2fd",
    borderColor: "#bbdefb",
    medal: "🇻🇳",
    medalName: "Nhà Khám Phá Việt Nam Lớp 4",
    desc: "Tìm hiểu địa lý, bản đồ, danh lam thắng cảnh và lịch sử Việt Nam.",
    levels: [
      { id: 1, title: "Địa lý Việt Nam", desc: "Các vùng miền, sông ngòi, đồng bằng, cao nguyên Việt Nam", stages: 5, game: "/game-choose-1-of-2?world=6&level=1" },
      { id: 2, title: "Bản đồ", desc: "Đọc bản đồ, ký hiệu bản đồ và phương hướng", stages: 5, game: "/game-choose-1-of-2?world=6&level=2" },
      { id: 3, title: "Danh lam thắng cảnh", desc: "Các di sản thiên nhiên và văn hóa tiêu biểu Việt Nam", stages: 5, game: "/game-simple-matching?world=6&level=3" },
      { id: 4, title: "Lịch sử Việt Nam", desc: "Các sự kiện lịch sử tiêu biểu và anh hùng dân tộc", stages: 5, game: "/game-choose-1-of-2?world=6&level=4" }
    ],
    bossName: "Boss Khám Phá",
    bossDesc: "Thử thách kiến thức địa lý và lịch sử Việt Nam",
    bossGame: "/game-choose-1-of-2?world=6&boss=true"
  }
]

// ─── GAME CHOOSE QUESTIONS ───
export const CHOOSE_QUESTIONS = [
  // === WORLD 1: VƯƠNG QUỐC SỐ TỰ NHIÊN ===
  // Level 1: Số tự nhiên lớn
  { q: "Số 45.678.123 đọc là gì?", options: ["Bốn mươi lăm triệu sáu trăm bảy mươi tám nghìn một trăm hai mươi ba", "Bốn mươi năm triệu sáu trăm bảy tám nghìn một hai ba"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số tự nhiên lớn", world: 1, level: 1 },
  { q: "Trong số 83.295.146, chữ số 2 thuộc hàng nào?", options: ["Hàng trăm nghìn", "Hàng chục nghìn"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số tự nhiên lớn", world: 1, level: 1 },
  { q: "Số gồm 7 triệu, 5 trăm nghìn, 3 nghìn, 8 trăm viết là:", options: ["7.503.800", "7.530.800"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số tự nhiên lớn", world: 1, level: 1 },
  { q: "Giá trị của chữ số 6 trong số 16.450.000 là bao nhiêu?", options: ["6.000.000", "600.000"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Số tự nhiên lớn", world: 1, level: 1 },

  // Level 2: So sánh và sắp xếp số
  { q: "So sánh: 9.875.432 ... 9.857.432. Điền dấu thích hợp:", options: [">", "<"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Số lớn nhất trong các số sau là: 5.678.901; 5.687.901; 5.678.910", options: ["5.687.901", "5.678.910"], correct: 0, emoji: "🔢", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },
  { q: "Sắp xếp theo thứ tự tăng dần: 245.000; 254.000; 245.500", options: ["245.000; 245.500; 254.000", "254.000; 245.500; 245.000"], correct: 0, emoji: "📈", subject: "Toán", topic: "So sánh số", world: 1, level: 2 },

  // Level 3: Làm tròn số
  { q: "Làm tròn số 456.789 đến hàng nghìn gần nhất:", options: ["457.000", "456.000"], correct: 0, emoji: "🎯", subject: "Toán", topic: "Làm tròn số", world: 1, level: 3 },
  { q: "Làm tròn số 1.234.567 đến hàng chục nghìn gần nhất:", options: ["1.230.000", "1.240.000"], correct: 0, emoji: "🎯", subject: "Toán", topic: "Làm tròn số", world: 1, level: 3 },
  { q: "Làm tròn số 78.450 đến hàng trăm gần nhất:", options: ["78.500", "78.400"], correct: 0, emoji: "🎯", subject: "Toán", topic: "Làm tròn số", world: 1, level: 3 },

  // Level 4: Biểu thức số
  { q: "Tính: 125 + 75 x 2 = ?", options: ["275", "400"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Biểu thức", world: 1, level: 4 },
  { q: "Tính: (120 + 80) x 3 = ?", options: ["600", "360"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Biểu thức", world: 1, level: 4 },
  { q: "Tính: 500 - 200 : 4 = ?", options: ["450", "75"], correct: 0, emoji: "🧮", subject: "Toán", topic: "Biểu thức", world: 1, level: 4 },

  // === WORLD 2: THÀNH PHỐ PHÂN SỐ ===
  // Level 1: Khái niệm phân số
  { q: "Phân số nào lớn hơn: 1/2 hay 1/3?", options: ["1/2", "1/3"], correct: 0, emoji: "🍕", subject: "Toán", topic: "Phân số", world: 2, level: 1 },
  { q: "Trong phân số 3/5, tử số là bao nhiêu?", options: ["3", "5"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Phân số", world: 2, level: 1 },
  { q: "Phân số 4/4 bằng bao nhiêu?", options: ["1", "4"], correct: 0, emoji: "🔢", subject: "Toán", topic: "Phân số", world: 2, level: 1 },
  { q: "Một cái bánh chia 8 phần bằng nhau. Bé ăn 3 phần. Phân số chỉ phần bé đã ăn là:", options: ["3/8", "5/8"], correct: 0, emoji: "🍰", subject: "Toán", topic: "Phân số", world: 2, level: 1 },

  // Level 3: So sánh phân số
  { q: "So sánh hai phân số: 3/7 và 5/7. Phân số nào lớn hơn?", options: ["5/7", "3/7"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh phân số", world: 2, level: 3 },
  { q: "So sánh: 2/3 và 3/4. Phân số nào lớn hơn?", options: ["3/4", "2/3"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh phân số", world: 2, level: 3 },
  { q: "So sánh: 1/2 và 2/5. Phân số nào lớn hơn?", options: ["1/2", "2/5"], correct: 0, emoji: "⚖️", subject: "Toán", topic: "So sánh phân số", world: 2, level: 3 },

  // Level 4: Cộng trừ phân số
  { q: "Tính: 2/5 + 1/5 = ?", options: ["3/5", "3/10"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng trừ phân số", world: 2, level: 4 },
  { q: "Tính: 5/8 - 3/8 = ?", options: ["2/8 = 1/4", "8/8 = 1"], correct: 0, emoji: "➖", subject: "Toán", topic: "Cộng trừ phân số", world: 2, level: 4 },
  { q: "Tính: 1/3 + 1/6 = ?", options: ["3/6 = 1/2", "2/9"], correct: 0, emoji: "➕", subject: "Toán", topic: "Cộng trừ phân số", world: 2, level: 4 },

  // === WORLD 3: HỌC VIỆN HÌNH HỌC ===
  // Level 1: Góc
  { q: "Góc vuông có số đo bằng bao nhiêu độ?", options: ["90°", "180°"], correct: 0, emoji: "📐", subject: "Toán", topic: "Góc", world: 3, level: 1 },
  { q: "Góc nhọn là góc có số đo như thế nào?", options: ["Nhỏ hơn 90°", "Lớn hơn 90°"], correct: 0, emoji: "📐", subject: "Toán", topic: "Góc", world: 3, level: 1 },
  { q: "Góc tù là góc có số đo nằm trong khoảng nào?", options: ["Lớn hơn 90° và nhỏ hơn 180°", "Nhỏ hơn 90°"], correct: 0, emoji: "📐", subject: "Toán", topic: "Góc", world: 3, level: 1 },
  { q: "Góc bẹt có số đo bao nhiêu độ?", options: ["180°", "360°"], correct: 0, emoji: "📐", subject: "Toán", topic: "Góc", world: 3, level: 1 },

  // Level 2: Đường thẳng
  { q: "Hai đường thẳng vuông góc tạo với nhau góc bao nhiêu độ?", options: ["90°", "180°"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đường thẳng", world: 3, level: 2 },
  { q: "Hai đường thẳng song song có đặc điểm gì?", options: ["Không bao giờ cắt nhau", "Luôn cắt nhau tại một điểm"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đường thẳng", world: 3, level: 2 },
  { q: "Hai cạnh đối diện của hình chữ nhật có quan hệ gì?", options: ["Song song với nhau", "Vuông góc với nhau"], correct: 0, emoji: "📏", subject: "Toán", topic: "Đường thẳng", world: 3, level: 2 },

  // Level 3: Hình bình hành
  { q: "Hình bình hành có bao nhiêu cặp cạnh đối song song?", options: ["2 cặp", "1 cặp"], correct: 0, emoji: "▱", subject: "Toán", topic: "Hình bình hành", world: 3, level: 3 },
  { q: "Hình thoi có đặc điểm gì về cạnh?", options: ["4 cạnh bằng nhau", "2 cặp cạnh bằng nhau"], correct: 0, emoji: "♦️", subject: "Toán", topic: "Hình bình hành", world: 3, level: 3 },

  // Level 4: Diện tích và chu vi
  { q: "Tính diện tích hình chữ nhật có chiều dài 8cm, chiều rộng 5cm:", options: ["40 cm²", "26 cm²"], correct: 0, emoji: "📏", subject: "Toán", topic: "Diện tích", world: 3, level: 4 },
  { q: "Tính chu vi hình chữ nhật có chiều dài 12cm, chiều rộng 7cm:", options: ["38 cm", "84 cm"], correct: 0, emoji: "📏", subject: "Toán", topic: "Chu vi", world: 3, level: 4 },
  { q: "Diện tích hình bình hành bằng bao nhiêu?", options: ["Đáy x Chiều cao", "Đáy x Đáy"], correct: 0, emoji: "📏", subject: "Toán", topic: "Diện tích", world: 3, level: 4 },
  { q: "Hình vuông có cạnh 9cm. Diện tích hình vuông đó là:", options: ["81 cm²", "36 cm²"], correct: 0, emoji: "⬛", subject: "Toán", topic: "Diện tích", world: 3, level: 4 },

  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 1: Đọc hiểu
  { q: "Đoạn văn: 'Mùa thu, bầu trời xanh ngắt như được rửa sạch sau mùa mưa. Không khí trong lành, mát mẻ. Lũ chim sẻ ríu rít trên cành phượng vĩ.' Câu hỏi: Bầu trời mùa thu được miêu tả như thế nào?", options: ["Xanh ngắt như được rửa sạch", "Xám xịt và u ám"], correct: 0, emoji: "🍂", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 4, level: 1 },
  { q: "Đoạn văn: 'Dòng sông Hương hiền hòa chảy qua thành phố Huế. Hai bên bờ sông, những hàng cây xanh soi bóng xuống mặt nước trong veo.' Câu hỏi: Dòng sông Hương chảy qua thành phố nào?", options: ["Thành phố Huế", "Thành phố Hà Nội"], correct: 0, emoji: "🏞️", subject: "Tiếng Việt", topic: "Đọc hiểu", world: 4, level: 1 },

  // Level 2: Từ ghép và từ láy
  { q: "Từ nào sau đây là từ láy?", options: ["lấp lánh", "xe đạp"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Từ láy", world: 4, level: 2 },
  { q: "Từ nào sau đây là từ ghép?", options: ["nhà cửa", "long lanh"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Từ ghép", world: 4, level: 2 },
  { q: "Từ 'mênh mông' thuộc loại từ nào?", options: ["Từ láy", "Từ ghép"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Từ láy", world: 4, level: 2 },
  { q: "Từ 'quần áo' thuộc loại từ nào?", options: ["Từ ghép", "Từ láy"], correct: 0, emoji: "✏️", subject: "Tiếng Việt", topic: "Từ ghép", world: 4, level: 2 },

  // Level 4: Tập làm văn
  { q: "Khi viết văn miêu tả con mèo, em nên bắt đầu bằng phần nào?", options: ["Giới thiệu con mèo (tên, nguồn gốc)", "Kể chuyện con mèo bắt chuột"], correct: 0, emoji: "🐱", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 4 },
  { q: "Trong bài văn miêu tả cây phượng, phần nào cần thiết nhất?", options: ["Tả hình dáng, hoa, lá, thân cây", "Kể chuyện lịch sử của cây"], correct: 0, emoji: "🌳", subject: "Tiếng Việt", topic: "Tập làm văn", world: 4, level: 4 },

  // === WORLD 5: NHÀ KHOA HỌC ===
  // Level 1: Con người và sức khỏe
  { q: "Nhóm thức ăn nào cung cấp nhiều chất đạm nhất cho cơ thể?", options: ["Thịt, cá, trứng, sữa", "Cơm, bánh mì, khoai"], correct: 0, emoji: "🥩", subject: "Khoa học", topic: "Sức khỏe", world: 5, level: 1 },
  { q: "Bệnh sốt xuất huyết do loài vật nào truyền bệnh?", options: ["Muỗi vằn", "Chuột"], correct: 0, emoji: "🦟", subject: "Khoa học", topic: "Phòng bệnh", world: 5, level: 1 },
  { q: "Vitamin C có nhiều trong loại thực phẩm nào?", options: ["Trái cây có vị chua (cam, chanh, bưởi)", "Thịt bò, thịt gà"], correct: 0, emoji: "🍊", subject: "Khoa học", topic: "Dinh dưỡng", world: 5, level: 1 },

  // Level 2: Thực vật
  { q: "Quá trình quang hợp của cây xanh cần điều kiện gì?", options: ["Ánh sáng mặt trời và khí CO₂", "Nước mưa và phân bón"], correct: 0, emoji: "🌿", subject: "Khoa học", topic: "Thực vật", world: 5, level: 2 },
  { q: "Bộ phận nào của cây có chức năng quang hợp chủ yếu?", options: ["Lá cây", "Rễ cây"], correct: 0, emoji: "🍃", subject: "Khoa học", topic: "Thực vật", world: 5, level: 2 },

  // Level 3: Động vật
  { q: "Đâu là động vật có xương sống?", options: ["Con ếch", "Con ốc sên"], correct: 0, emoji: "🐸", subject: "Khoa học", topic: "Động vật", world: 5, level: 3 },
  { q: "Đâu là động vật không xương sống?", options: ["Con bướm", "Con rắn"], correct: 0, emoji: "🦋", subject: "Khoa học", topic: "Động vật", world: 5, level: 3 },
  { q: "Loài nào là động vật có vú?", options: ["Cá heo", "Cá mập"], correct: 0, emoji: "🐬", subject: "Khoa học", topic: "Động vật", world: 5, level: 3 },

  // Level 4: Vật chất và năng lượng
  { q: "Nước tồn tại ở mấy thể?", options: ["3 thể (rắn, lỏng, khí)", "2 thể (rắn, lỏng)"], correct: 0, emoji: "💧", subject: "Khoa học", topic: "Vật chất", world: 5, level: 4 },
  { q: "Âm thanh truyền qua môi trường nào nhanh nhất?", options: ["Chất rắn", "Chất khí"], correct: 0, emoji: "🔊", subject: "Khoa học", topic: "Năng lượng", world: 5, level: 4 },
  { q: "Không khí gồm những thành phần chính nào?", options: ["Khí ni-tơ và khí ô-xy", "Khí CO₂ và khí hydro"], correct: 0, emoji: "🌬️", subject: "Khoa học", topic: "Vật chất", world: 5, level: 4 },

  // === WORLD 6: KHÁM PHÁ VIỆT NAM ===
  // Level 1: Địa lý Việt Nam
  { q: "Thủ đô của Việt Nam là gì?", options: ["Hà Nội", "Thành phố Hồ Chí Minh"], correct: 0, emoji: "🏛️", subject: "Địa lý", topic: "Địa lý VN", world: 6, level: 1 },
  { q: "Sông nào dài nhất Việt Nam?", options: ["Sông Mê Kông (Cửu Long)", "Sông Hồng"], correct: 0, emoji: "🏞️", subject: "Địa lý", topic: "Địa lý VN", world: 6, level: 1 },
  { q: "Đồng bằng lớn nhất Việt Nam là đồng bằng nào?", options: ["Đồng bằng sông Cửu Long", "Đồng bằng sông Hồng"], correct: 0, emoji: "🌾", subject: "Địa lý", topic: "Địa lý VN", world: 6, level: 1 },

  // Level 2: Bản đồ
  { q: "Trên bản đồ, hướng Bắc thường nằm ở vị trí nào?", options: ["Phía trên", "Phía dưới"], correct: 0, emoji: "🧭", subject: "Địa lý", topic: "Bản đồ", world: 6, level: 2 },
  { q: "Tỷ lệ bản đồ 1:100.000 nghĩa là gì?", options: ["1 cm trên bản đồ = 1 km ngoài thực tế", "1 cm trên bản đồ = 100 m ngoài thực tế"], correct: 0, emoji: "🗺️", subject: "Địa lý", topic: "Bản đồ", world: 6, level: 2 },

  // Level 4: Lịch sử Việt Nam
  { q: "Hai Bà Trưng khởi nghĩa chống giặc nào?", options: ["Giặc Hán (nhà Hán)", "Giặc Nguyên Mông"], correct: 0, emoji: "⚔️", subject: "Lịch sử", topic: "Lịch sử VN", world: 6, level: 4 },
  { q: "Vua Lý Thái Tổ dời đô từ Hoa Lư về đâu?", options: ["Thăng Long (Hà Nội)", "Phú Xuân (Huế)"], correct: 0, emoji: "🏯", subject: "Lịch sử", topic: "Lịch sử VN", world: 6, level: 4 },
  { q: "Chiến thắng Bạch Đằng năm 938 do ai lãnh đạo?", options: ["Ngô Quyền", "Trần Hưng Đạo"], correct: 0, emoji: "⚔️", subject: "Lịch sử", topic: "Lịch sử VN", world: 6, level: 4 }
]

// ─── GAME LISTEN QUESTIONS ───
export const LISTEN_QUESTIONS = [
  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Dùng cho phần từ vựng nếu cần mở rộng
  { word: "trung thực", options: ["🙏 Trung thực", "😡 Tức giận", "😴 Lười biếng", "🏃 Chạy trốn"], correct: 0, subject: "Tiếng Việt", topic: "Từ vựng", world: 4, level: 2 },
  { word: "dũng cảm", options: ["💪 Dũng cảm", "😰 Sợ hãi", "😊 Vui vẻ", "😢 Buồn bã"], correct: 0, subject: "Tiếng Việt", topic: "Từ vựng", world: 4, level: 2 },
  { word: "cần cù", options: ["📝 Cần cù", "🎮 Ham chơi", "💤 Ngủ nướng", "🍔 Ăn uống"], correct: 0, subject: "Tiếng Việt", topic: "Từ vựng", world: 4, level: 2 }
]

// ─── GAME MATCHING PAIRS ───
export const MATCHING_PAIRS_ALL = [
  // === WORLD 2: THÀNH PHỐ PHÂN SỐ ===
  // Level 2: Phân số bằng nhau
  { id: 1, left: "1/2", right: "2/4", subject: "Toán", topic: "Phân số bằng nhau", world: 2, level: 2 },
  { id: 2, left: "2/3", right: "4/6", subject: "Toán", topic: "Phân số bằng nhau", world: 2, level: 2 },
  { id: 3, left: "3/4", right: "6/8", subject: "Toán", topic: "Phân số bằng nhau", world: 2, level: 2 },
  { id: 4, left: "1/5", right: "2/10", subject: "Toán", topic: "Phân số bằng nhau", world: 2, level: 2 },

  // === WORLD 4: THƯ VIỆN TIẾNG VIỆT ===
  // Level 3: Danh từ - Động từ - Tính từ
  { id: 10, left: "học sinh", right: "Danh từ", subject: "Tiếng Việt", topic: "Từ loại", world: 4, level: 3 },
  { id: 11, left: "ngôi trường", right: "Danh từ", subject: "Tiếng Việt", topic: "Từ loại", world: 4, level: 3 },
  { id: 12, left: "chạy nhảy", right: "Động từ", subject: "Tiếng Việt", topic: "Từ loại", world: 4, level: 3 },
  { id: 13, left: "suy nghĩ", right: "Động từ", subject: "Tiếng Việt", topic: "Từ loại", world: 4, level: 3 },
  { id: 14, left: "xinh đẹp", right: "Tính từ", subject: "Tiếng Việt", topic: "Từ loại", world: 4, level: 3 },
  { id: 15, left: "rộng lớn", right: "Tính từ", subject: "Tiếng Việt", topic: "Từ loại", world: 4, level: 3 },

  // === WORLD 6: KHÁM PHÁ VIỆT NAM ===
  // Level 3: Danh lam thắng cảnh
  { id: 20, left: "🏖️ Vịnh Hạ Long", right: "Quảng Ninh", subject: "Địa lý", topic: "Danh lam", world: 6, level: 3 },
  { id: 21, left: "🏛️ Cố đô Huế", right: "Thừa Thiên Huế", subject: "Địa lý", topic: "Danh lam", world: 6, level: 3 },
  { id: 22, left: "🏮 Phố cổ Hội An", right: "Quảng Nam", subject: "Địa lý", topic: "Danh lam", world: 6, level: 3 },
  { id: 23, left: "🗻 Sa Pa", right: "Lào Cai", subject: "Địa lý", topic: "Danh lam", world: 6, level: 3 }
]

const shuffle = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Lấy ngân hàng câu hỏi động dựa trên thế giới và level cho Lớp 4 */
export function getQuestionsForGame(worldId, levelId, isBoss = false) {
  const wId = parseInt(worldId, 10)
  const lId = parseInt(levelId, 10)

  // --- World 1: Vương Quốc Số Tự Nhiên ---
  if (wId === 1) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 1)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 2: Thành Phố Phân Số ---
  if (wId === 2) {
    if (lId === 2) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 2 && q.level === 2)
      return shuffle(pool).slice(0, 4)
    }
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 2)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 3: Học Viện Hình Học ---
  if (wId === 3) {
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 3)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  // --- World 4: Thư Viện Tiếng Việt ---
  if (wId === 4) {
    if (lId === 3) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 4 && q.level === 3)
      return shuffle(pool).slice(0, 4)
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

  // --- World 6: Khám Phá Việt Nam ---
  if (wId === 6) {
    if (lId === 3) {
      const pool = MATCHING_PAIRS_ALL.filter(q => q.world === 6 && q.level === 3)
      return shuffle(pool).slice(0, 4)
    }
    const pool = CHOOSE_QUESTIONS.filter(q => q.world === 6)
    if (isBoss) return shuffle(pool).slice(0, 8)
    const filtered = pool.filter(q => q.level === lId)
    return shuffle(filtered).slice(0, 4)
  }

  return []
}

// ─── FOCUS RECOMMENDATIONS FOR GRADE 4 ───
export const FOCUS_RECOMMENDATIONS = {
  1: {
    icon: '🏰',
    title: 'Củng cố nhận diện số tự nhiên lớn',
    desc: 'Bé cần luyện thêm kỹ năng đọc viết số đến hàng trăm triệu. Bố mẹ có thể dùng các số trên biên lai, hóa đơn để đố vui cùng bé.',
    subject: 'Vương Quốc Số Tự Nhiên 🏰'
  },
  2: {
    icon: '➗',
    title: 'Rèn luyện phân số cơ bản',
    desc: 'Phân số là kiến thức mới quan trọng ở lớp 4. Bố mẹ hãy dùng bánh pizza hoặc trái cây để minh họa phân số giúp bé dễ hiểu.',
    subject: 'Thành Phố Phân Số ➗'
  },
  3: {
    icon: '📐',
    title: 'Thực hành nhận diện góc và hình',
    desc: 'Góc và đường thẳng song song, vuông góc xuất hiện nhiều trong cuộc sống. Chỉ cho bé các góc nhọn, tù trong đồ vật quanh nhà.',
    subject: 'Học Viện Hình Học 📐'
  },
  4: {
    icon: '📚',
    title: 'Nâng cao đọc hiểu và từ vựng',
    desc: 'Từ ghép, từ láy và phân loại từ loại là nền tảng ngữ pháp lớp 4. Khuyến khích bé đọc sách và gạch chân các từ láy thú vị.',
    subject: 'Thư Viện Tiếng Việt 📚'
  },
  5: {
    icon: '🔬',
    title: 'Khám phá kiến thức khoa học tự nhiên',
    desc: 'Bé đang học về dinh dưỡng, động thực vật và năng lượng. Hãy cho bé xem các video khoa học thú vị hoặc thí nghiệm đơn giản tại nhà.',
    subject: 'Nhà Khoa Học 🔬'
  },
  6: {
    icon: '🗺️',
    title: 'Tìm hiểu địa lý và lịch sử Việt Nam',
    desc: 'Kiến thức địa lý lịch sử giúp bé yêu quê hương hơn. Bố mẹ có thể kể chuyện lịch sử hoặc xem bản đồ Việt Nam cùng bé mỗi tối.',
    subject: 'Khám Phá Việt Nam 🗺️'
  }
}

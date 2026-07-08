/**
 * Supplemental learning content for grades 2-5.
 *
 * The scope follows Vietnam's current CT GDPT 2018 primary direction:
 * Math, Vietnamese, Natural/Social sciences, Science, History & Geography,
 * plus Hoc Vui-friendly IQ/life-skill games.
 */

export const SUPPLEMENTAL_GRADE_CONTENT = {
  'lop-2': {
    curriculumFocus: [
      { subject: 'Toán', topics: ['Số đến 1000', 'Cộng trừ có nhớ', 'Bảng nhân/chia cơ bản', 'Đo lường và tiền Việt Nam'], gameTypes: ['choose_1_of_2', 'matching'] },
      { subject: 'Tiếng Việt', topics: ['Đọc từ và câu', 'Đọc hiểu đoạn ngắn', 'Chính tả', 'Từ chỉ sự vật, hoạt động, đặc điểm', 'Dấu câu'], gameTypes: ['listen_select', 'choose_1_of_2', 'matching'] },
      { subject: 'Tự nhiên & Xã hội', topics: ['Gia đình', 'Trường học', 'Cơ thể', 'Động vật', 'Thực vật', 'Môi trường'], gameTypes: ['choose_1_of_2'] },
      { subject: 'Kỹ năng', topics: ['An toàn', 'Giao tiếp', 'Tự phục vụ', 'Tiền tệ đời sống'], gameTypes: ['choose_1_of_2'] }
    ],
    chooseQuestions: [
      { q: 'Số 640 gồm mấy trăm và mấy chục?', options: ['6 trăm, 4 chục', '4 trăm, 6 chục'], correct: 0, emoji: '🔢', subject: 'Toán', topic: 'Cấu tạo số', skill: 'place_value_1000', difficulty: '1', world: 1, level: 1, explanation: '640 có 6 trăm, 4 chục và 0 đơn vị.' },
      { q: 'Số nào là số chẵn?', options: ['728', '735'], correct: 0, emoji: '🔢', subject: 'Toán', topic: 'Số chẵn lẻ', skill: 'even_odd', difficulty: '1', world: 1, level: 2, explanation: 'Số có chữ số tận cùng là 0, 2, 4, 6, 8 là số chẵn.' },
      { q: 'Tính: 46 + 27 = ?', options: ['73', '63'], correct: 0, emoji: '➕', subject: 'Toán', topic: 'Cộng có nhớ', skill: 'add_within_100', difficulty: '2', world: 2, level: 1, explanation: '46 + 27 = 73.' },
      { q: 'Tính: 92 - 48 = ?', options: ['44', '54'], correct: 0, emoji: '➖', subject: 'Toán', topic: 'Trừ có nhớ', skill: 'subtract_within_100', difficulty: '2', world: 2, level: 2, explanation: '92 - 48 = 44.' },
      { q: '5 x 6 = ?', options: ['30', '25'], correct: 0, emoji: '✖️', subject: 'Toán', topic: 'Bảng nhân 5', skill: 'multiply_by_5', difficulty: '2', world: 2, level: 5, explanation: '5 lấy 6 lần bằng 30.' },
      { q: '20 : 5 = ?', options: ['4', '5'], correct: 0, emoji: '➗', subject: 'Toán', topic: 'Phép chia', skill: 'divide_by_5', difficulty: '2', world: 2, level: 6, explanation: '20 chia đều thành 5 phần thì mỗi phần là 4.' },
      { q: 'Câu nào là câu hỏi?', options: ['Bạn tên là gì?', 'Bạn tên là Lan.'], correct: 0, emoji: '❓', subject: 'Tiếng Việt', topic: 'Dấu câu', skill: 'question_mark', difficulty: '1', world: 3, level: 6, explanation: 'Câu hỏi thường kết thúc bằng dấu hỏi.' },
      { q: 'Từ nào chỉ hoạt động?', options: ['chạy', 'bông hoa'], correct: 0, emoji: '🏃', subject: 'Tiếng Việt', topic: 'Từ loại', skill: 'verb_identification', difficulty: '1', world: 3, level: 5, explanation: 'Chạy là từ chỉ hoạt động.' },
      { q: 'Điền âm đúng: "...ăm học mới"', options: ['n', 'l'], correct: 0, emoji: '✏️', subject: 'Tiếng Việt', topic: 'Chính tả', skill: 'n_l_spelling', difficulty: '2', world: 3, level: 4, explanation: 'Viết đúng là năm học mới.' },
      { q: 'Bộ phận nào giúp cây hút nước?', options: ['Rễ cây', 'Hoa'], correct: 0, emoji: '🌱', subject: 'Tự nhiên & Xã hội', topic: 'Thực vật', skill: 'plant_parts', difficulty: '1', world: 4, level: 5, explanation: 'Rễ cây hút nước và muối khoáng từ đất.' },
      { q: 'Khi gặp ổ điện bị hở dây, em nên làm gì?', options: ['Báo người lớn', 'Tự chạm tay vào kiểm tra'], correct: 0, emoji: '⚡', subject: 'Kỹ năng', topic: 'An toàn', skill: 'electrical_safety', difficulty: '1', world: 6, level: 3, explanation: 'Không chạm vào nguồn điện nguy hiểm, cần báo người lớn.' },
      { q: 'Bé mua bút 4.000đ, đưa 10.000đ. Cần nhận lại bao nhiêu?', options: ['6.000đ', '4.000đ'], correct: 0, emoji: '💵', subject: 'Toán', topic: 'Tiền tệ', skill: 'money_change', difficulty: '2', world: 6, level: 4, explanation: '10.000 - 4.000 = 6.000.' }
    ],
    listenQuestions: [
      { word: 'chăm chỉ', options: ['📚 Chăm chỉ', '😴 Lười biếng', '🏃 Chạy nhanh', '🍎 Quả táo'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng phẩm chất', skill: 'vocabulary_trait', difficulty: '1', world: 3, level: 1 },
      { word: 'Em giúp mẹ gấp quần áo.', options: ['👕 Giúp mẹ gấp quần áo', '⚽ Đá bóng ngoài sân', '🐟 Cho cá ăn', '📖 Đọc truyện'], correct: 0, subject: 'Tiếng Việt', topic: 'Nghe hiểu câu', skill: 'sentence_listening', difficulty: '1', world: 3, level: 2 },
      { word: 'bảo vệ môi trường', options: ['♻️ Bảo vệ môi trường', '🗑️ Xả rác bừa bãi', '🔥 Đốt rác trong lớp', '🚗 Đi chơi'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng đời sống', skill: 'life_vocabulary', difficulty: '2', world: 3, level: 1 }
    ],
    matchingPairs: [
      { id: 2201, left: '1 m', right: '100 cm', subject: 'Toán', topic: 'Đo độ dài', skill: 'length_units', difficulty: '1', world: 6, level: 5 },
      { id: 2202, left: '1 kg', right: '1000 g', subject: 'Toán', topic: 'Khối lượng', skill: 'mass_units', difficulty: '1', world: 6, level: 5 },
      { id: 2203, left: 'dũng cảm', right: 'Từ chỉ đặc điểm', subject: 'Tiếng Việt', topic: 'Từ loại', skill: 'adjective_identification', difficulty: '1', world: 3, level: 5 },
      { id: 2204, left: 'học bài', right: 'Từ chỉ hoạt động', subject: 'Tiếng Việt', topic: 'Từ loại', skill: 'verb_identification', difficulty: '1', world: 3, level: 5 },
      { id: 2205, left: '🐝 Con ong', right: 'Bay và hút mật hoa', subject: 'Tự nhiên & Xã hội', topic: 'Động vật', skill: 'animal_feature', difficulty: '1', world: 4, level: 4 },
      { id: 2206, left: '🌳 Cây xanh', right: 'Cho bóng mát và không khí trong lành', subject: 'Tự nhiên & Xã hội', topic: 'Thực vật', skill: 'plant_benefits', difficulty: '1', world: 4, level: 5 }
    ]
  },

  'lop-3': {
    curriculumFocus: [
      { subject: 'Toán', topics: ['Số đến 10.000', 'Cộng trừ nhân chia', 'Làm tròn', 'Đo lường', 'Chu vi hình cơ bản'], gameTypes: ['choose_1_of_2', 'matching'] },
      { subject: 'Tiếng Việt', topics: ['Đọc hiểu', 'Chính tả', 'Từ ngữ theo chủ điểm', 'Dấu câu', 'Viết đoạn văn'], gameTypes: ['choose_1_of_2', 'listen_select', 'matching'] },
      { subject: 'Tự nhiên & Xã hội', topics: ['Cơ thể người', 'Động vật', 'Thực vật', 'Môi trường'], gameTypes: ['choose_1_of_2'] },
      { subject: 'IQ', topics: ['Quy luật số', 'Suy luận', 'Trí nhớ'], gameTypes: ['choose_1_of_2', 'matching'] }
    ],
    chooseQuestions: [
      { q: 'Số 7.305 gồm mấy nghìn?', options: ['7 nghìn', '3 nghìn'], correct: 0, emoji: '🔢', subject: 'Toán', topic: 'Số đến 10.000', skill: 'place_value_10000', difficulty: '1', world: 1, level: 1, explanation: 'Chữ số 7 ở hàng nghìn.' },
      { q: 'Làm tròn 6.482 đến hàng trăm gần nhất được số nào?', options: ['6.500', '6.400'], correct: 0, emoji: '🎯', subject: 'Toán', topic: 'Làm tròn số', skill: 'round_to_hundred', difficulty: '2', world: 1, level: 3, explanation: '82 gần 100 hơn 0 nên 6.482 làm tròn thành 6.500.' },
      { q: 'Tính: 248 x 3 = ?', options: ['744', '724'], correct: 0, emoji: '✖️', subject: 'Toán', topic: 'Phép nhân', skill: 'multiply_3_digit_by_1_digit', difficulty: '2', world: 2, level: 3, explanation: '248 x 3 = 744.' },
      { q: 'Tính: 936 : 3 = ?', options: ['312', '321'], correct: 0, emoji: '➗', subject: 'Toán', topic: 'Phép chia', skill: 'divide_3_digit_by_1_digit', difficulty: '2', world: 2, level: 4, explanation: '936 chia 3 bằng 312.' },
      { q: 'Chu vi hình chữ nhật dài 8cm, rộng 5cm là bao nhiêu?', options: ['26 cm', '40 cm'], correct: 0, emoji: '📏', subject: 'Toán', topic: 'Chu vi', skill: 'rectangle_perimeter', difficulty: '2', world: 3, level: 1, explanation: '(8 + 5) x 2 = 26 cm.' },
      { q: '1 giờ 15 phút bằng bao nhiêu phút?', options: ['75 phút', '115 phút'], correct: 0, emoji: '⏰', subject: 'Toán', topic: 'Thời gian', skill: 'time_conversion', difficulty: '2', world: 3, level: 3, explanation: '1 giờ = 60 phút, 60 + 15 = 75 phút.' },
      { q: 'Trong câu "Bầu trời xanh thẳm", từ nào chỉ đặc điểm?', options: ['xanh thẳm', 'bầu trời'], correct: 0, emoji: '✏️', subject: 'Tiếng Việt', topic: 'Từ loại', skill: 'adjective_identification', difficulty: '1', world: 4, level: 2, explanation: 'Xanh thẳm là từ chỉ đặc điểm của bầu trời.' },
      { q: 'Câu nào dùng dấu hai chấm hợp lý?', options: ['Mẹ dặn: "Con nhớ học bài."', 'Mẹ dặn "Con nhớ học bài":'], correct: 0, emoji: '✏️', subject: 'Tiếng Việt', topic: 'Dấu câu', skill: 'colon_usage', difficulty: '2', world: 4, level: 4, explanation: 'Dấu hai chấm đặt trước lời nói trực tiếp.' },
      { q: 'Cơ quan nào giúp máu lưu thông khắp cơ thể?', options: ['Cơ quan tuần hoàn', 'Cơ quan tiêu hóa'], correct: 0, emoji: '❤️', subject: 'Tự nhiên & Xã hội', topic: 'Con người', skill: 'circulatory_system', difficulty: '1', world: 5, level: 1, explanation: 'Tim và mạch máu thuộc cơ quan tuần hoàn.' },
      { q: 'Hành động nào tiết kiệm nước?', options: ['Khóa vòi sau khi dùng', 'Mở vòi nước chảy liên tục'], correct: 0, emoji: '💧', subject: 'Tự nhiên & Xã hội', topic: 'Môi trường', skill: 'save_water', difficulty: '1', world: 5, level: 4, explanation: 'Khóa vòi sau khi dùng giúp tiết kiệm nước.' },
      { q: 'Dãy số 5, 10, 15, 20, ... số tiếp theo là?', options: ['25', '30'], correct: 0, emoji: '🧠', subject: 'IQ', topic: 'Quy luật số', skill: 'number_pattern', difficulty: '1', world: 6, level: 1, explanation: 'Mỗi số tăng thêm 5.' },
      { q: 'Lan đứng trước Nam, Nam đứng trước Bình. Ai đứng sau cùng?', options: ['Bình', 'Lan'], correct: 0, emoji: '🧩', subject: 'IQ', topic: 'Suy luận', skill: 'ordering_logic', difficulty: '1', world: 6, level: 2, explanation: 'Thứ tự là Lan, Nam, Bình nên Bình đứng sau cùng.' }
    ],
    listenQuestions: [
      { word: 'kiên trì', options: ['💪 Kiên trì', '😴 Bỏ cuộc', '🍎 Quả táo', '🏠 Ngôi nhà'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng phẩm chất', skill: 'trait_vocabulary', difficulty: '1', world: 4, level: 3 },
      { word: 'sáng kiến', options: ['💡 Sáng kiến', '📦 Hộp quà', '🌧️ Cơn mưa', '🚲 Xe đạp'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng học tập', skill: 'academic_vocabulary', difficulty: '2', world: 4, level: 3 },
      { word: 'bảo tồn thiên nhiên', options: ['🌿 Bảo tồn thiên nhiên', '🗑️ Vứt rác', '🔥 Đốt rừng', '🎮 Chơi game'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng môi trường', skill: 'environment_vocabulary', difficulty: '2', world: 4, level: 3 }
    ],
    matchingPairs: [
      { id: 3301, left: '1 km', right: '1000 m', subject: 'Toán', topic: 'Đo độ dài', skill: 'length_units', difficulty: '1', world: 3, level: 1 },
      { id: 3302, left: '1 kg', right: '1000 g', subject: 'Toán', topic: 'Khối lượng', skill: 'mass_units', difficulty: '1', world: 3, level: 2 },
      { id: 3303, left: 'Mở đoạn', right: 'Giới thiệu ý chính', subject: 'Tiếng Việt', topic: 'Viết đoạn văn', skill: 'paragraph_structure', difficulty: '2', world: 4, level: 5 },
      { id: 3304, left: 'Thân đoạn', right: 'Nêu các ý triển khai', subject: 'Tiếng Việt', topic: 'Viết đoạn văn', skill: 'paragraph_structure', difficulty: '2', world: 4, level: 5 },
      { id: 3305, left: 'Lá cây', right: 'Quang hợp', subject: 'Tự nhiên & Xã hội', topic: 'Thực vật', skill: 'plant_function', difficulty: '1', world: 5, level: 3 },
      { id: 3306, left: 'Tim', right: 'Bơm máu đi khắp cơ thể', subject: 'Tự nhiên & Xã hội', topic: 'Con người', skill: 'organ_function', difficulty: '1', world: 5, level: 1 }
    ]
  },

  'lop-4': {
    curriculumFocus: [
      { subject: 'Toán', topics: ['Số tự nhiên lớn', 'Trung bình cộng', 'Phân số', 'Góc và đường thẳng', 'Diện tích'], gameTypes: ['choose_1_of_2', 'matching'] },
      { subject: 'Tiếng Việt', topics: ['Đọc hiểu', 'Từ ghép và từ láy', 'Danh từ, động từ, tính từ', 'Chủ ngữ vị ngữ', 'Văn miêu tả'], gameTypes: ['choose_1_of_2', 'matching'] },
      { subject: 'Khoa học', topics: ['Dinh dưỡng', 'Nước và không khí', 'Âm thanh, ánh sáng, nhiệt', 'Thực vật và động vật'], gameTypes: ['choose_1_of_2'] },
      { subject: 'Lịch sử & Địa lí', topics: ['Bản đồ', 'Vùng miền Việt Nam', 'Danh lam thắng cảnh', 'Nhân vật lịch sử tiêu biểu'], gameTypes: ['choose_1_of_2', 'matching'] }
    ],
    chooseQuestions: [
      { q: 'Số 12.345.678 có chữ số 3 thuộc hàng nào?', options: ['Hàng trăm nghìn', 'Hàng chục nghìn'], correct: 0, emoji: '🔢', subject: 'Toán', topic: 'Số tự nhiên lớn', skill: 'large_number_place_value', difficulty: '2', world: 1, level: 1, explanation: 'Trong 12.345.678, chữ số 3 ở hàng trăm nghìn.' },
      { q: 'Trung bình cộng của 12, 18 và 24 là bao nhiêu?', options: ['18', '20'], correct: 0, emoji: '🧮', subject: 'Toán', topic: 'Trung bình cộng', skill: 'average', difficulty: '2', world: 1, level: 4, explanation: '(12 + 18 + 24) : 3 = 18.' },
      { q: 'Phân số nào bằng 3/4?', options: ['6/8', '4/6'], correct: 0, emoji: '➗', subject: 'Toán', topic: 'Phân số bằng nhau', skill: 'equivalent_fractions', difficulty: '2', world: 2, level: 2, explanation: '3/4 nhân cả tử và mẫu với 2 được 6/8.' },
      { q: 'Tính: 3/9 + 4/9 = ?', options: ['7/9', '7/18'], correct: 0, emoji: '➕', subject: 'Toán', topic: 'Cộng phân số', skill: 'add_like_denominators', difficulty: '2', world: 2, level: 4, explanation: 'Cùng mẫu số 9 nên cộng tử số: 3 + 4 = 7.' },
      { q: 'Hai đường thẳng cắt nhau tạo thành góc vuông gọi là gì?', options: ['Vuông góc', 'Song song'], correct: 0, emoji: '📐', subject: 'Toán', topic: 'Đường thẳng', skill: 'perpendicular_lines', difficulty: '1', world: 3, level: 2, explanation: 'Hai đường thẳng tạo góc vuông là hai đường thẳng vuông góc.' },
      { q: 'Diện tích hình bình hành có đáy 9cm, chiều cao 4cm là bao nhiêu?', options: ['36 cm²', '26 cm²'], correct: 0, emoji: '📏', subject: 'Toán', topic: 'Diện tích', skill: 'parallelogram_area', difficulty: '2', world: 3, level: 4, explanation: 'Diện tích = đáy x chiều cao = 9 x 4 = 36 cm².' },
      { q: 'Từ nào là từ láy?', options: ['lung linh', 'bàn ghế'], correct: 0, emoji: '✏️', subject: 'Tiếng Việt', topic: 'Từ láy', skill: 'reduplicative_word', difficulty: '1', world: 4, level: 2, explanation: 'Lung linh là từ láy.' },
      { q: 'Trong câu "Những bông hoa nở rực rỡ.", chủ ngữ là gì?', options: ['Những bông hoa', 'nở rực rỡ'], correct: 0, emoji: '📚', subject: 'Tiếng Việt', topic: 'Chủ ngữ vị ngữ', skill: 'subject_predicate', difficulty: '2', world: 4, level: 3, explanation: 'Chủ ngữ trả lời câu hỏi ai/cái gì/con gì.' },
      { q: 'Nhóm thức ăn nào cung cấp nhiều vitamin?', options: ['Rau xanh và trái cây', 'Nước ngọt có gas'], correct: 0, emoji: '🥦', subject: 'Khoa học', topic: 'Dinh dưỡng', skill: 'nutrition_groups', difficulty: '1', world: 5, level: 1, explanation: 'Rau xanh và trái cây cung cấp nhiều vitamin, chất khoáng.' },
      { q: 'Không khí cần cho quá trình nào của con người?', options: ['Hô hấp', 'Viết chữ'], correct: 0, emoji: '🌬️', subject: 'Khoa học', topic: 'Không khí', skill: 'air_and_breathing', difficulty: '1', world: 5, level: 4, explanation: 'Con người cần không khí để hô hấp.' },
      { q: 'Trên bản đồ, kí hiệu thường dùng để làm gì?', options: ['Biểu thị đối tượng địa lí', 'Trang trí bản đồ'], correct: 0, emoji: '🗺️', subject: 'Địa lí', topic: 'Bản đồ', skill: 'map_symbols', difficulty: '1', world: 6, level: 2, explanation: 'Kí hiệu giúp đọc và hiểu các đối tượng trên bản đồ.' },
      { q: 'Cố đô Huế gắn với triều đại nào sau đây?', options: ['Triều Nguyễn', 'Triều Lý'], correct: 0, emoji: '🏛️', subject: 'Lịch sử', topic: 'Di sản lịch sử', skill: 'history_landmark', difficulty: '2', world: 6, level: 4, explanation: 'Cố đô Huế là kinh đô của triều Nguyễn.' }
    ],
    listenQuestions: [
      { word: 'trách nhiệm', options: ['🤝 Trách nhiệm', '😴 Thờ ơ', '🍎 Quả táo', '🚲 Xe đạp'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng phẩm chất', skill: 'trait_vocabulary', difficulty: '2', world: 4, level: 2 },
      { word: 'quan sát', options: ['🔎 Quan sát', '🏃 Chạy trốn', '🍜 Bát phở', '🌧️ Cơn mưa'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng khoa học', skill: 'science_vocabulary', difficulty: '1', world: 4, level: 1 },
      { word: 'di sản văn hóa', options: ['🏛️ Di sản văn hóa', '🎮 Trò chơi', '🧃 Hộp sữa', '🧸 Gấu bông'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng xã hội', skill: 'social_vocabulary', difficulty: '2', world: 4, level: 1 }
    ],
    matchingPairs: [
      { id: 4401, left: '3/5', right: '6/10', subject: 'Toán', topic: 'Phân số bằng nhau', skill: 'equivalent_fractions', difficulty: '1', world: 2, level: 2 },
      { id: 4402, left: '4/7', right: '8/14', subject: 'Toán', topic: 'Phân số bằng nhau', skill: 'equivalent_fractions', difficulty: '1', world: 2, level: 2 },
      { id: 4403, left: 'Danh từ', right: 'chỉ sự vật', subject: 'Tiếng Việt', topic: 'Từ loại', skill: 'word_classes', difficulty: '1', world: 4, level: 3 },
      { id: 4404, left: 'Động từ', right: 'chỉ hoạt động, trạng thái', subject: 'Tiếng Việt', topic: 'Từ loại', skill: 'word_classes', difficulty: '1', world: 4, level: 3 },
      { id: 4405, left: 'Vịnh Hạ Long', right: 'Quảng Ninh', subject: 'Địa lí', topic: 'Danh lam thắng cảnh', skill: 'landmark_location', difficulty: '1', world: 6, level: 3 },
      { id: 4406, left: 'Phố cổ Hội An', right: 'Quảng Nam', subject: 'Địa lí', topic: 'Danh lam thắng cảnh', skill: 'landmark_location', difficulty: '1', world: 6, level: 3 }
    ]
  },

  'lop-5': {
    curriculumFocus: [
      { subject: 'Toán', topics: ['Số thập phân', 'Tỉ số phần trăm', 'Đổi đơn vị đo', 'Diện tích hình tròn/hình thang', 'Thể tích hình hộp'], gameTypes: ['choose_1_of_2', 'matching'] },
      { subject: 'Tiếng Việt', topics: ['Đọc hiểu', 'Từ đồng nghĩa/trái nghĩa', 'Từ đồng âm/nhiều nghĩa', 'Quan hệ từ', 'Văn tả cảnh và tả người'], gameTypes: ['choose_1_of_2', 'listen_select', 'matching'] },
      { subject: 'Khoa học', topics: ['Tuổi dậy thì', 'Sức khỏe', 'Năng lượng', 'Môi trường và tài nguyên'], gameTypes: ['choose_1_of_2'] },
      { subject: 'Lịch sử & Địa lí', topics: ['Lịch sử Việt Nam hiện đại', 'Nhân vật lịch sử', 'Địa lí Việt Nam', 'Biển đảo'], gameTypes: ['choose_1_of_2', 'matching'] }
    ],
    chooseQuestions: [
      { q: 'Số 7,305 có chữ số 3 thuộc hàng nào?', options: ['Phần mười', 'Phần trăm'], correct: 0, emoji: '🔢', subject: 'Toán', topic: 'Số thập phân', skill: 'decimal_place_value', difficulty: '2', world: 1, level: 1, explanation: 'Trong 7,305, chữ số 3 ở hàng phần mười.' },
      { q: 'Tính: 3,6 x 2,5 = ?', options: ['9', '8,1'], correct: 0, emoji: '✖️', subject: 'Toán', topic: 'Tính số thập phân', skill: 'decimal_multiplication', difficulty: '2', world: 1, level: 3, explanation: '3,6 x 2,5 = 9.' },
      { q: '25% của 80 là bao nhiêu?', options: ['20', '25'], correct: 0, emoji: '📊', subject: 'Toán', topic: 'Tỉ số phần trăm', skill: 'find_percent_value', difficulty: '2', world: 2, level: 3, explanation: '25% = 1/4, một phần tư của 80 là 20.' },
      { q: 'Một lớp có 12 bạn nữ và 18 bạn nam. Tỉ số nữ so với nam là:', options: ['2/3', '3/2'], correct: 0, emoji: '📊', subject: 'Toán', topic: 'Tỉ số', skill: 'ratio_simplify', difficulty: '2', world: 2, level: 1, explanation: '12/18 rút gọn bằng 2/3.' },
      { q: 'Diện tích hình tròn bán kính 4cm là bao nhiêu? Lấy π = 3,14.', options: ['50,24 cm²', '25,12 cm²'], correct: 0, emoji: '⚪', subject: 'Toán', topic: 'Diện tích hình tròn', skill: 'circle_area', difficulty: '2', world: 3, level: 2, explanation: 'S = 4 x 4 x 3,14 = 50,24 cm².' },
      { q: 'Thể tích hình lập phương cạnh 6cm là bao nhiêu?', options: ['216 cm³', '36 cm³'], correct: 0, emoji: '🧊', subject: 'Toán', topic: 'Thể tích', skill: 'cube_volume', difficulty: '2', world: 3, level: 4, explanation: '6 x 6 x 6 = 216 cm³.' },
      { q: 'Từ nào trái nghĩa với "tiết kiệm"?', options: ['hoang phí', 'dành dụm'], correct: 0, emoji: '✏️', subject: 'Tiếng Việt', topic: 'Từ trái nghĩa', skill: 'antonym', difficulty: '1', world: 4, level: 2, explanation: 'Hoang phí trái nghĩa với tiết kiệm.' },
      { q: 'Trong câu "Vì trời mưa nên em mang áo mưa", cặp quan hệ từ là gì?', options: ['Vì... nên...', 'trời... mưa...'], correct: 0, emoji: '📚', subject: 'Tiếng Việt', topic: 'Quan hệ từ', skill: 'conjunction_pair', difficulty: '2', world: 4, level: 2, explanation: 'Vì... nên... biểu thị quan hệ nguyên nhân - kết quả.' },
      { q: 'Nguồn năng lượng nào là năng lượng tái tạo?', options: ['Năng lượng gió', 'Than đá'], correct: 0, emoji: '🌬️', subject: 'Khoa học', topic: 'Năng lượng', skill: 'renewable_energy', difficulty: '1', world: 5, level: 3, explanation: 'Gió là nguồn năng lượng tái tạo.' },
      { q: 'Việc nào giúp bảo vệ môi trường đất?', options: ['Phân loại và giảm rác thải nhựa', 'Chôn nhiều túi ni-lông xuống đất'], correct: 0, emoji: '♻️', subject: 'Khoa học', topic: 'Môi trường', skill: 'protect_soil', difficulty: '1', world: 5, level: 4, explanation: 'Giảm rác thải nhựa giúp hạn chế ô nhiễm đất.' },
      { q: 'Sự kiện ngày 2/9/1945 gắn với địa điểm nào?', options: ['Quảng trường Ba Đình', 'Bến Nhà Rồng'], correct: 0, emoji: '🇻🇳', subject: 'Lịch sử', topic: 'Lịch sử Việt Nam', skill: 'historical_event_place', difficulty: '2', world: 6, level: 1, explanation: 'Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.' },
      { q: 'Quần đảo Trường Sa hiện thuộc tỉnh/thành nào quản lý?', options: ['Khánh Hòa', 'Đà Nẵng'], correct: 0, emoji: '🗺️', subject: 'Địa lí', topic: 'Biển đảo', skill: 'island_geography', difficulty: '2', world: 6, level: 4, explanation: 'Huyện đảo Trường Sa thuộc tỉnh Khánh Hòa.' }
    ],
    listenQuestions: [
      { word: 'tự trọng', options: ['🧭 Tự trọng', '😴 Lười biếng', '🍉 Dưa hấu', '🚗 Ô tô'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng phẩm chất', skill: 'trait_vocabulary', difficulty: '1', world: 4, level: 3 },
      { word: 'trách nhiệm công dân', options: ['🤝 Trách nhiệm công dân', '🎮 Trò chơi điện tử', '🌧️ Cơn mưa', '🧃 Hộp sữa'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng xã hội', skill: 'civic_vocabulary', difficulty: '2', world: 4, level: 3 },
      { word: 'năng lượng tái tạo', options: ['☀️ Năng lượng tái tạo', '🏭 Khói bụi', '🗑️ Bãi rác', '🍔 Bữa ăn'], correct: 0, subject: 'Tiếng Việt', topic: 'Từ vựng khoa học', skill: 'science_vocabulary', difficulty: '2', world: 4, level: 3 }
    ],
    matchingPairs: [
      { id: 5501, left: '0,25', right: '25%', subject: 'Toán', topic: 'Tỉ số phần trăm', skill: 'decimal_percent', difficulty: '1', world: 2, level: 2 },
      { id: 5502, left: '1/5', right: '20%', subject: 'Toán', topic: 'Tỉ số phần trăm', skill: 'fraction_percent', difficulty: '1', world: 2, level: 2 },
      { id: 5503, left: 'Mở bài', right: 'Giới thiệu cảnh hoặc người định tả', subject: 'Tiếng Việt', topic: 'Tập làm văn', skill: 'essay_structure', difficulty: '1', world: 4, level: 4 },
      { id: 5504, left: 'Kết bài', right: 'Nêu cảm nghĩ của người viết', subject: 'Tiếng Việt', topic: 'Tập làm văn', skill: 'essay_structure', difficulty: '1', world: 4, level: 4 },
      { id: 5505, left: 'Hoàng Sa', right: 'Đà Nẵng', subject: 'Địa lí', topic: 'Biển đảo', skill: 'island_geography', difficulty: '2', world: 6, level: 4 },
      { id: 5506, left: 'Trường Sa', right: 'Khánh Hòa', subject: 'Địa lí', topic: 'Biển đảo', skill: 'island_geography', difficulty: '2', world: 6, level: 4 }
    ]
  }
}

const ENGLISH_FOUNDATION_BY_GRADE = {
  'lop-2': [
    { q: 'Từ "cat" nghĩa là gì?', options: ['con mèo', 'con chó'], correct: 0, emoji: '🐱', subject: 'Tiếng Anh', topic: 'Từ vựng con vật', skill: 'animal_vocabulary', difficulty: '1', world: 3, level: 1, explanation: 'Cat nghĩa là con mèo.' },
    { q: 'Chọn lời chào buổi sáng:', options: ['Good morning', 'Good night'], correct: 0, emoji: '🌤️', subject: 'Tiếng Anh', topic: 'Chào hỏi', skill: 'greetings', difficulty: '1', world: 3, level: 2, explanation: 'Good morning dùng để chào buổi sáng.' },
  ],
  'lop-3': [
    { q: 'Từ nào chỉ màu xanh lá?', options: ['green', 'red'], correct: 0, emoji: '🟢', subject: 'Tiếng Anh', topic: 'Màu sắc', skill: 'color_vocabulary', difficulty: '1', world: 4, level: 3, explanation: 'Green là màu xanh lá.' },
    { q: 'Câu "I am happy" nghĩa là gì?', options: ['Tôi vui', 'Tôi đói'], correct: 0, emoji: '😊', subject: 'Tiếng Anh', topic: 'Cảm xúc', skill: 'emotion_sentence', difficulty: '1', world: 4, level: 3, explanation: 'Happy nghĩa là vui.' },
  ],
  'lop-4': [
    { q: 'Từ nào nghĩa là "thư viện"?', options: ['library', 'market'], correct: 0, emoji: '📚', subject: 'Tiếng Anh', topic: 'Địa điểm', skill: 'place_vocabulary', difficulty: '1', world: 4, level: 1, explanation: 'Library nghĩa là thư viện.' },
    { q: 'Chọn câu đúng:', options: ['She likes apples.', 'She like apples.'], correct: 0, emoji: '🍎', subject: 'Tiếng Anh', topic: 'Câu đơn', skill: 'simple_present', difficulty: '2', world: 4, level: 2, explanation: 'Với she/he/it, động từ thường thêm s/es.' },
  ],
  'lop-5': [
    { q: 'Từ nào nghĩa là "năng lượng"?', options: ['energy', 'history'], correct: 0, emoji: '⚡', subject: 'Tiếng Anh', topic: 'Từ vựng khoa học', skill: 'science_vocabulary_en', difficulty: '2', world: 4, level: 3, explanation: 'Energy nghĩa là năng lượng.' },
    { q: 'Câu nào dùng "because" đúng?', options: ['I stay home because it rains.', 'Because I stay home it rains.'], correct: 0, emoji: '☔', subject: 'Tiếng Anh', topic: 'Liên từ', skill: 'because_clause', difficulty: '2', world: 4, level: 3, explanation: 'Because nối nguyên nhân với kết quả.' },
  ],
}

const ENGLISH_FOCUS = {
  subject: 'Tiếng Anh',
  topics: ['Chào hỏi', 'Từ vựng quen thuộc', 'Câu đơn ngắn', 'Nghe và phản xạ'],
  gameTypes: ['choose_1_of_2', 'listen_select'],
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function getSupplementalContent(gradeSlug) {
  const content = SUPPLEMENTAL_GRADE_CONTENT[gradeSlug]
  if (content) {
    return {
      ...content,
      curriculumFocus: [
        ...(content.curriculumFocus || []),
        ...(ENGLISH_FOUNDATION_BY_GRADE[gradeSlug] ? [ENGLISH_FOCUS] : []),
      ],
      chooseQuestions: [
        ...(content.chooseQuestions || []),
        ...(ENGLISH_FOUNDATION_BY_GRADE[gradeSlug] || []),
      ],
    }
  }

  return {
    curriculumFocus: [],
    chooseQuestions: [],
    listenQuestions: [],
    matchingPairs: []
  }
}

export function getSupplementalQuestionsForGame(gradeSlug, worldId, levelId, isBoss = false) {
  const content = getSupplementalContent(gradeSlug)
  const wId = toInt(worldId, 1)
  const lId = toInt(levelId, 1)
  const matchesScope = (question) => question.world === wId && (isBoss || question.level === lId)

  return [
    ...(content.chooseQuestions || []),
    ...(content.listenQuestions || []),
    ...(content.matchingPairs || [])
  ].filter(matchesScope)
}

# 🌟 Học Vui – Nền tảng học tập tương tác cho trẻ em

**Học Vui** là ứng dụng web học tập game hoá dành cho học sinh tiểu học Lớp 1-5 tại Việt Nam.
Được xây dựng bằng **Next.js 16**, **Prisma ORM** và cơ sở dữ liệu qua `DATABASE_URL`, ứng dụng cung cấp lộ trình học theo lớp, trò chơi tương tác, CMS quản trị, dashboard học sinh/phụ huynh và theo dõi tiến độ realtime.

---

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| 🎮 Trò chơi học tập | 3 loại game: ghép đôi, chọn 1/2, nghe và chọn |
| 🗺️ Bản đồ thế giới | Lộ trình động theo `gradeSlug` cho Lớp 1-5 |
| 🐾 Nhân vật bạn đồng hành | Trẻ chọn mascot yêu thích khi tạo hồ sơ |
| 👗 Tủ đồ | Dùng sao kiếm được để mở khoá phụ kiện |
| 📊 Báo cáo phụ huynh | Theo dõi tiến độ, kỹ năng yếu, hoạt động 7 ngày và huy hiệu |
| 👑 CMS Admin | Quản lý học sinh, phụ huynh, câu hỏi, game, learning map và báo cáo |
| 🔐 Đăng nhập phụ huynh | Email/mật khẩu hoặc Google OAuth |

---

## 🏗️ Kiến trúc

```
src/
├── app/                        # Next.js App Router (tất cả các trang)
│   ├── page.js                 # Trang chủ (chọn cấp lớp)
│   ├── learning/
│   │   └── [gradeSlug]/        # Trang landing theo lớp (lop-1 ... lop-5)
│   │       ├── page.js
│   │       └── map/page.js     # Bản đồ thế giới theo lớp
│   ├── game-choose-1-of-2/     # Trò chơi chọn 1 trong 2
│   ├── game-listen-and-select/ # Trò chơi nghe và chọn
│   ├── game-simple-matching/   # Trò chơi ghép đôi
│   ├── game-results/           # Trang kết quả sau mỗi màn
│   ├── kids-closet/            # Tủ đồ trẻ em
│   ├── parent-dashboard/       # Báo cáo phụ huynh
│   ├── parent-login/           # Đăng nhập phụ huynh
│   ├── profile-select/         # Chọn hồ sơ trẻ
│   ├── add-profile/            # Tạo hồ sơ mới
│   ├── choose-companion/       # Chọn nhân vật
│   └── api/                    # API Routes
│       ├── auth/               # Đăng nhập phụ huynh, Google OAuth, cookie session
│       ├── profile/            # CRUD hồ sơ trẻ
│       ├── progress/           # Lưu và đọc tiến độ
│       ├── questions/          # Phân phối câu hỏi động từ CMS/Question Bank/fallback
│       ├── student/            # Dashboard, test và submit kết quả học sinh
│       ├── parent/             # Dashboard phụ huynh
│       ├── admin/              # API CMS Admin
│       └── closet/             # Lưu trang phục
├── lib/
│   ├── data/                   # Dữ liệu câu hỏi theo cấp lớp
│   │   ├── index.js            # Registry – getGradeData(gradeSlug)
│   │   ├── lop-1.js            # Lớp 1
│   │   ├── lop-2.js            # Lớp 2
│   │   ├── lop-3.js            # Lớp 3
│   │   ├── lop-4.js            # Lớp 4
│   │   └── lop-5.js            # Lớp 5
│   ├── auth.js                 # JWT session helper
│   ├── db.js                   # Prisma client singleton
│   ├── question-distribution.js# Phân phối câu hỏi thích ứng
│   ├── scoring-service.js      # XP, streak, level và kết quả phiên học
│   └── progress-summary.js     # Tổng hợp tiến độ học
prisma/
│   └── schema.prisma           # Parent, ChildProfile, Progress, Question Bank, Attempts
```

---

## 🚀 Bắt đầu nhanh

### Yêu cầu
- Node.js ≥ 18
- npm ≥ 9

### Cài đặt

```bash
# 1. Clone repository
git clone https://github.com/Wendy84205/LearningWebsite.git
cd LearningWebsite

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env (xem DEPLOY.md để biết chi tiết)
cp .env.example .env   # hoặc tạo tay

# 4. Khởi tạo database
npx prisma db push

# 5. Chạy server phát triển
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Biến môi trường

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `DATABASE_URL` | ✅ | Local mặc định `file:./dev.db`; production dùng PostgreSQL URL |
| `DIRECT_URL` | Tùy chọn | Kết nối trực tiếp khi dùng PostgreSQL provider yêu cầu |
| `JWT_SECRET` | ✅ | Chuỗi bí mật ký session phụ huynh |
| `ADMIN_SECRET` | ✅ | Chuỗi bí mật ký session admin |
| `ADMIN_PASSWORD` | Tùy chọn | Mật khẩu admin CMS |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Tùy chọn | Client ID Google OAuth hiển thị phía client |

---

## 🗂️ Thêm cấp lớp mới

1. Tạo file `src/lib/data/<ten-lop>.js` với cấu trúc `{ WORLDS, getQuestionsForGame }`.
2. Đăng ký slug trong `src/lib/data/index.js`.
3. Thêm lớp vào danh sách trên trang chủ `src/app/page.js`.
4. Các trang game, dashboard và bản đồ tự động nhận dữ liệu qua `gradeSlug`.

---

## 🛠️ Scripts hữu ích

```bash
npm run dev          # Chạy server phát triển
npm run build        # Build sản xuất
npx prisma studio    # Giao diện quản lý DB
npx prisma db push   # Đồng bộ schema → DB
npm run db:check     # Kiểm tra database đang kết nối được
npm run db:sqlite    # Chuyển schema/client sang SQLite local
npm run db:postgres  # Chuyển schema/client sang PostgreSQL production
```

---

## 📄 Giấy phép

MIT © 2024 Học Vui Team

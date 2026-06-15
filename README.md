# 🌟 Học Vui – Nền tảng học tập tương tác cho trẻ em

**Học Vui** là ứng dụng web học tập game hoá dành cho trẻ em mầm non và tiểu học tại Việt Nam.  
Được xây dựng bằng **Next.js 15**, **Prisma ORM** và **SQLite**, ứng dụng cung cấp các trò chơi học tập theo từng cấp lớp với hệ thống nhân vật, tủ đồ và theo dõi tiến độ.

---

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| 🎮 Trò chơi học tập | 3 loại game: ghép đôi, chọn 1/2, nghe và chọn |
| 🗺️ Bản đồ thế giới | Mỗi cấp lớp có nhiều thế giới và màn chơi |
| 🐾 Nhân vật bạn đồng hành | Trẻ chọn mascot yêu thích khi tạo hồ sơ |
| 👗 Tủ đồ | Dùng sao kiếm được để mở khoá phụ kiện |
| 📊 Báo cáo phụ huynh | Theo dõi tiến độ học tập của con |
| 🔐 Đăng nhập phụ huynh | Email/mật khẩu hoặc Google OAuth |

---

## 🏗️ Kiến trúc

```
src/
├── app/                        # Next.js App Router (tất cả các trang)
│   ├── page.js                 # Trang chủ (chọn cấp lớp)
│   ├── learning/
│   │   └── [gradeSlug]/        # Trang landing theo lớp (lop-1, mam-non, nha-tre…)
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
│       ├── auth/               # NextAuth (Google + Credentials)
│       ├── profile/            # CRUD hồ sơ trẻ
│       ├── progress/           # Lưu và đọc tiến độ
│       └── closet/             # Lưu trang phục
├── lib/
│   ├── data/                   # Dữ liệu câu hỏi theo cấp lớp
│   │   ├── index.js            # Registry – getGradeData(gradeSlug)
│   │   ├── lop-1.js            # Lớp 1
│   │   ├── mam-non.js          # Mẫu giáo
│   │   └── nha-tre.js          # Nhà trẻ
│   ├── auth.js                 # NextAuth config
│   ├── db.js                   # Prisma client singleton
│   └── progress-summary.js     # Tổng hợp tiến độ học
prisma/
│   └── schema.prisma           # Schema DB (User, ChildProfile, Progress)
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
| `DATABASE_URL` | ✅ | Đường dẫn SQLite, ví dụ `file:./dev.db` |
| `NEXTAUTH_SECRET` | ✅ | Chuỗi bí mật JWT (tạo bằng `openssl rand -hex 32`) |
| `NEXTAUTH_URL` | ✅ | URL gốc của ứng dụng, ví dụ `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Tùy chọn | Client ID Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Tùy chọn | Client Secret Google OAuth |

---

## 🗂️ Thêm cấp lớp mới

1. Tạo file `src/lib/data/<ten-lop>.js` với cấu trúc `{ WORLDS, getQuestions }`.
2. Đăng ký slug trong `src/lib/data/index.js`.
3. Thêm lớp vào danh sách trên trang chủ `src/app/page.js`.
4. Các trang game và bản đồ tự động nhận dữ liệu qua `gradeSlug` – **không cần sửa thêm**.

---

## 🛠️ Scripts hữu ích

```bash
npm run dev          # Chạy server phát triển
npm run build        # Build sản xuất
npx prisma studio    # Giao diện quản lý DB
npx prisma db push   # Đồng bộ schema → DB
```

---

## 📄 Giấy phép

MIT © 2024 Học Vui Team

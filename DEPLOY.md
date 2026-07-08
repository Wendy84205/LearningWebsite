# 🚀 Hướng dẫn triển khai – Học Vui

Tài liệu này mô tả cách triển khai **Học Vui** lên môi trường sản xuất.  
Khuyến nghị: **Vercel** (đơn giản nhất) hoặc bất kỳ VPS/server nào chạy Node.js.

---

## 📋 Mục lục

1. [Triển khai trên Vercel](#1-triển-khai-trên-vercel)
2. [Triển khai thủ công (VPS)](#2-triển-khai-thủ-công-vps)
3. [Cấu hình Google OAuth](#3-cấu-hình-google-oauth)
4. [Biến môi trường đầy đủ](#4-biến-môi-trường-đầy-đủ)
5. [Database trong môi trường sản xuất](#5-database-trong-môi-trường-sản-xuất)
6. [Xử lý sự cố thường gặp](#6-xử-lý-sự-cố-thường-gặp)

---

## 1. Triển khai trên Vercel

### 1.1. Cài đặt lần đầu

```bash
# Cài Vercel CLI
npm i -g vercel

# Đăng nhập
vercel login

# Triển khai từ thư mục dự án
cd "Học Vui"
vercel --prod
```

### 1.2. Biến môi trường trên Vercel

Vào **Vercel Dashboard → Settings → Environment Variables** và thêm:

| Tên biến | Giá trị mẫu |
|---|---|
| `DATABASE_URL` | Local: `file:./dev.db`; Production: PostgreSQL URL |
| `DIRECT_URL` | PostgreSQL direct URL nếu provider yêu cầu |
| `JWT_SECRET` | Chuỗi bí mật session phụ huynh |
| `ADMIN_SECRET` | Chuỗi bí mật session admin |
| `ADMIN_USERNAME` | Tên đăng nhập CMS admin, mặc định `admin` |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập CMS admin |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID từ Google Cloud Console |

> ⚠️ **Lưu ý:** SQLite chỉ phù hợp chạy local/demo. Production trên Vercel nên dùng PostgreSQL.

### 1.3. Chạy migration sau deploy

```bash
vercel env pull .env.production.local
npm run db:postgres
npm run db:check
npx prisma db push
```

---

## 2. Triển khai thủ công (VPS)

```bash
# 1. Clone code
git clone https://github.com/Wendy84205/LearningWebsite.git
cd LearningWebsite

# 2. Cài dependencies
npm ci --production

# 3. Tạo file .env
nano .env

# 4. Build
npm run build

# 5. Chạy với PM2
npm install -g pm2
pm2 start "npm run start" --name hoc-vui
pm2 save
pm2 startup
```

---

## 3. Cấu hình Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Chọn dự án → **API & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**.
3. Application type: **Web application**.
4. Thêm domain ứng dụng vào **Authorized JavaScript origins**:
   - Môi trường dev: `http://localhost:3000`
   - Môi trường prod: `https://your-domain.com`
5. Sao chép **Client ID** vào file `.env`:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   ```

> ✅ **Quan trọng:** Email tài khoản Google Console phải khớp với email GitHub để Vercel auto-deploy hoạt động.

---

## 4. Biến môi trường đầy đủ

Tạo file `.env` ở thư mục gốc dự án:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/hocvui"
DIRECT_URL="postgresql://user:pass@host:5432/hocvui"

# Auth
JWT_SECRET="thay-bang-chuoi-32-byte-ngau-nhien"
ADMIN_SECRET="thay-bang-chuoi-32-byte-ngau-nhien"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="doi-mat-khau-admin"

# Google OAuth (tùy chọn nhưng khuyến nghị)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
```

Tạo secret mạnh:
```bash
openssl rand -hex 32
```

---

## 5. Database trong môi trường sản xuất

Dự án mặc định chạy local với **SQLite** để login, hồ sơ, dashboard và game hoạt động ngay cả khi chưa có Supabase/Postgres.

### Chuyển sang PostgreSQL (khuyến nghị cho production)

1. Chuyển Prisma schema/client sang PostgreSQL:
   ```bash
   npm run db:postgres
   ```
2. Cập nhật `DATABASE_URL` trong `.env` hoặc Vercel env:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/hocvui"
   ```
3. Kiểm tra kết nối:
   ```bash
   npm run db:check
   ```
4. Đồng bộ schema:
   ```bash
   npx prisma db push
   ```

Quay lại local SQLite:
```bash
npm run db:sqlite
npx prisma db push
```

---

## 6. Xử lý sự cố thường gặp

### ❌ Lỗi `invalid_client` khi đăng nhập Google

- Kiểm tra `NEXT_PUBLIC_GOOGLE_CLIENT_ID` trong `.env`.
- Đảm bảo JavaScript origin đã được thêm vào Google Cloud Console, ví dụ `https://learning-website-virid.vercel.app`.
- Xác nhận ứng dụng OAuth đã được **publish** (không còn ở trạng thái Testing nếu dùng email ngoài whitelist).

### ❌ Lỗi session không giữ đăng nhập

- Kiểm tra `JWT_SECRET` không bị thay đổi giữa các lần deploy.
- Kiểm tra cookie không bị trình duyệt chặn ở domain production.

### ❌ Database lỗi sau deploy

```bash
npx prisma db push --accept-data-loss
```

### ❌ Build lỗi `Module not found`

```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📁 Cấu trúc Git

```
main          ← Nhánh chính, luôn deployable
└── dev       ← Phát triển tính năng mới
```

Commit và push để tự động deploy lên Vercel:
```bash
git add .
git commit -m "feat: mô tả thay đổi"
git push origin main
```

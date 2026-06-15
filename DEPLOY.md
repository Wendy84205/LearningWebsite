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
| `DATABASE_URL` | `file:./prod.db` (hoặc PostgreSQL URL nếu dùng Vercel Postgres) |
| `NEXTAUTH_SECRET` | Chuỗi ngẫu nhiên 32 byte |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | Từ Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Từ Google Cloud Console |

> ⚠️ **Lưu ý:** SQLite không hoạt động tốt trên Vercel (serverless). Hãy dùng **Vercel Postgres** hoặc **PlanetScale** và cập nhật `DATABASE_URL` + provider trong `prisma/schema.prisma`.

### 1.3. Chạy migration sau deploy

```bash
vercel env pull .env.production.local
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
4. Thêm **Authorized redirect URIs**:
   - Môi trường dev: `http://localhost:3000/api/auth/callback/google`
   - Môi trường prod: `https://your-domain.com/api/auth/callback/google`
5. Sao chép **Client ID** và **Client Secret** vào file `.env`:
   ```env
   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxx
   ```

> ✅ **Quan trọng:** Email tài khoản Google Console phải khớp với email GitHub để Vercel auto-deploy hoạt động.

---

## 4. Biến môi trường đầy đủ

Tạo file `.env` ở thư mục gốc dự án:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="thay-bang-chuoi-32-byte-ngau-nhien"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (tùy chọn nhưng khuyến nghị)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
```

Tạo `NEXTAUTH_SECRET` mạnh:
```bash
openssl rand -hex 32
```

---

## 5. Database trong môi trường sản xuất

Dự án hiện dùng **SQLite** (file `dev.db`) – phù hợp phát triển và demo.

### Nâng cấp lên PostgreSQL (khuyến nghị cho production)

1. Sửa `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Cập nhật `DATABASE_URL` trong `.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/hocvui"
   ```
3. Chạy migration:
   ```bash
   npx prisma migrate deploy
   ```

---

## 6. Xử lý sự cố thường gặp

### ❌ Lỗi `invalid_client` khi đăng nhập Google

- Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` trong `.env`.
- Đảm bảo URI redirect đã được thêm vào Google Cloud Console.
- Xác nhận ứng dụng OAuth đã được **publish** (không còn ở trạng thái Testing nếu dùng email ngoài whitelist).

### ❌ Lỗi `NEXTAUTH_URL` không khớp

- `NEXTAUTH_URL` phải là URL chính xác của ứng dụng (không có dấu `/` ở cuối).
- Trên Vercel: đặt `NEXTAUTH_URL` = `https://ten-app.vercel.app`.

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

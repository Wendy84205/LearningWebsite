# Hướng Dẫn Triển Khai & Phát Hành Học Vui (Deployment Guide)

Tài liệu này hướng dẫn cách cấu hình, chuẩn hóa và phát hành ứng dụng **Học Vui** lên mạng nội bộ (Wi-Fi) hoặc internet công cộng (Vercel, Render, Railway, Supabase).

---

## 🗺️ PHÂN PHỐI 1: Trải nghiệm trên iPad/Máy tính bảng qua Mạng nội bộ (Wi-Fi)
Để trẻ chơi game trên iPad hoặc các thiết bị di động khác trong nhà, bạn có thể chạy server trên máy tính và kết nối qua địa chỉ IP nội bộ:

### Bước 1: Tìm địa chỉ IP của máy tính (Mac)
Mở Terminal và chạy lệnh sau để tìm IP trong mạng Wi-Fi:
```bash
ipconfig getifaddr en0
```
*(Ví dụ kết quả: `192.168.1.5`)*

### Bước 2: Khởi chạy máy chủ nội bộ
Chạy lệnh sau trên máy tính (sử dụng cổng `3000` và lắng nghe tất cả các thiết bị):
```bash
npm run dev:network
# Hoặc chạy bản build tối ưu:
# npm run build && npm run start:network
```

### Bước 3: Truy cập từ thiết bị khác
Trên iPad, máy tính bảng hoặc điện thoại kết nối cùng mạng Wi-Fi, mở trình duyệt và truy cập:
`http://192.168.1.5:3000` *(thay thế bằng IP của bạn)*

---

## ☁️ PHÂN PHỐI 2: Đưa lên Internet công cộng

Next.js sử dụng Prisma làm ORM. Tùy thuộc vào dịch vụ lưu trữ bạn chọn, chúng ta có 2 cách tiếp cận cơ bản:

### Phương án A: Máy chủ ảo / PaaS có Lưu trữ tệp tin (Render, Railway, Fly.io)
**Dành cho việc tiếp tục sử dụng SQLite (`dev.db`).** SQLite là một tệp cơ sở dữ liệu vật lý nên cần máy chủ có phân vùng nhớ lưu trữ bền vững (Persistent Volume) để dữ liệu không bị xóa khi khởi động lại máy chủ.

1. **Chuẩn bị file cấu hình `Dockerfile`** (nếu nền tảng yêu cầu):
   Next.js có thể dễ dàng chạy trên docker.
2. **Cấu hình biến môi trường trên PaaS**:
   - `DATABASE_URL`: `file:/data/dev.db` *(Đường dẫn trỏ đến Persistent Volume đã mount)*
   - `JWT_SECRET`: Chuỗi khóa bí mật ngẫu nhiên để mã hóa cookie phiên đăng nhập.
3. **Kịch bản chạy lúc deploy**:
   - Trước khi ứng dụng khởi chạy (`start`), cần chạy lệnh khởi tạo DB:
     ```bash
     npx prisma db push
     ```

---

### Phương án B: Serverless (Vercel) + Cơ sở dữ liệu đám mây (Supabase / Neon PostgreSQL)
**Khuyên dùng cho hiệu năng cao nhất, miễn phí hoàn toàn.** Vercel không hỗ trợ lưu trữ tệp SQLite lâu dài, do đó ta cần kết nối Next.js với một cơ sở dữ liệu PostgreSQL đám mây (như Supabase hoặc Neon).

#### Bước 1: Tạo cơ sở dữ liệu
1. Đăng ký tài khoản miễn phí tại [Supabase](https://supabase.com/) hoặc [Neon](https://neon.tech/).
2. Tạo một project mới và sao chép **Connection String** (Chuỗi kết nối cơ sở dữ liệu).
   *(Định dạng: `postgresql://postgres:password@db-host:5432/postgres`)*

#### Bước 2: Chuyển đổi Prisma sang PostgreSQL
Bạn có thể chạy script tự động để chuyển đổi database provider:
```bash
node scripts/use-db.js postgresql
```
*(Nếu muốn quay lại cấu hình SQLite cho môi trường lập trình nội bộ local, chỉ cần chạy: `node scripts/use-db.js sqlite`)*

#### Bước 3: Đưa cơ sở dữ liệu lên đám mây
Chạy lệnh sau trên máy tính để tạo bảng trên Supabase/Neon:
```bash
npx prisma db push
```

#### Bước 4: Deploy lên Vercel
1. Cài đặt Vercel CLI hoặc kết nối GitHub Repository với [Vercel Dashboard](https://vercel.com).
2. Thêm các **Environment Variables** (Biến môi trường) sau trên Vercel:
   - `DATABASE_URL`: *[Connection String của Supabase/Neon]*
   - `JWT_SECRET`: *[Chuỗi khóa bí mật ngẫu nhiên]*
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: *[Google Client ID của bạn để đăng nhập bằng Google]*
3. Nhấp **Deploy**! Vercel sẽ tự động build và cấp phát URL công cộng (dạng `https://hoc-vui.vercel.app`).

---

## 🔒 Khuyến nghị Bảo mật Sản phẩm (Production Security)
1. **JWT_SECRET**: Thay đổi giá trị mặc định của `JWT_SECRET` trong `.env` thành chuỗi dài ngẫu nhiên:
   ```bash
   openssl rand -base64 32
   ```
2. **Google OAuth**: Thay thế `NEXT_PUBLIC_GOOGLE_CLIENT_ID` demo bằng Client ID thuộc Google Cloud Console của chính bạn, cấu hình chính xác redirect URI trỏ về trang web thực tế của bạn.

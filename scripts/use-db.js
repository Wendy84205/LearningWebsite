const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const provider = process.argv[2];

if (!provider || (provider !== 'sqlite' && provider !== 'postgresql')) {
  console.error('Vui lòng chỉ định database provider: "sqlite" hoặc "postgresql"');
  console.log('Ví dụ: node scripts/use-db.js postgresql');
  process.exit(1);
}

try {
  let content = fs.readFileSync(schemaPath, 'utf8');
  
  // Thay đổi dòng provider trong datasource db
  const regex = /datasource db \{\s*provider\s*=\s*"[^"]+"\s*\}/;
  const newDatasource = `datasource db {\n  provider = "${provider}"\n}`;
  
  if (regex.test(content)) {
    content = content.replace(regex, newDatasource);
    fs.writeFileSync(schemaPath, content, 'utf8');
    console.log(`✅ Đã chuyển đổi thành công Prisma provider sang: "${provider}"`);
    console.log('Bây giờ bạn có thể chạy:');
    if (provider === 'postgresql') {
      console.log('  1. Cấu hình DATABASE_URL trong .env trỏ đến Supabase');
      console.log('  2. Chạy "npx prisma db push" để cập nhật schema lên Supabase');
    } else {
      console.log('  1. Đảm bảo DATABASE_URL trong .env là "file:./dev.db"');
      console.log('  2. Chạy "npx prisma generate" để cập nhật client cho SQLite');
    }
  } else {
    console.error('❌ Không tìm thấy khối "datasource db" hợp lệ trong schema.prisma');
  }
} catch (err) {
  console.error('❌ Lỗi khi xử lý file schema.prisma:', err.message);
}

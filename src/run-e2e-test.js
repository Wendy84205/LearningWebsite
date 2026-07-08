const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to make HTTP requests and preserve cookies
function request(path, method, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(responseBody);
        } catch (e) {
          parsed = responseBody;
        }

        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(dataString);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 KHỞI CHẠY HỆ THỐNG KIỂM TRA THỬ NGHIỆM TỰ ĐỘNG...');
  
  const email = `parent_test_${Math.floor(Math.random() * 100000)}@gmail.com`;
  const password = process.env.E2E_TEST_PASSWORD || `HocVuiTest-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  let sessionCookie = '';

  try {
    // 1. Đăng ký tài khoản
    console.log(`\n1. Đăng ký tài khoản mới: ${email}...`);
    const regRes = await request('/api/auth/register', 'POST', { email, password });
    if (regRes.status !== 201) {
      throw new Error(`Đăng ký thất bại với mã trạng thái ${regRes.status}: ${JSON.stringify(regRes.body)}`);
    }
    console.log('✅ Đăng ký thành công! ID phụ huynh:', regRes.body.id);

    // Lưu cookie nhận được từ đăng ký
    const cookies = regRes.headers['set-cookie'];
    if (cookies && cookies.length > 0) {
      sessionCookie = cookies[0].split(';')[0];
    }

    // 2. Đăng nhập tài khoản
    console.log('\n2. Thực hiện đăng nhập để kiểm tra phiên...');
    const loginRes = await request('/api/auth/login', 'POST', { email, password });
    if (loginRes.status !== 200) {
      throw new Error(`Đăng nhập thất bại: ${JSON.stringify(loginRes.body)}`);
    }
    console.log('✅ Đăng nhập thành công! Thông tin email:', loginRes.body.email);
    
    if (loginRes.headers['set-cookie']) {
      sessionCookie = loginRes.headers['set-cookie'][0].split(';')[0];
    }

    const authHeaders = { 'Cookie': sessionCookie };

    // 3. Gọi API lấy thông tin cá nhân của phiên đăng nhập (/api/auth/me)
    console.log('\n3. Truy vấn thông tin người dùng từ Cookie session...');
    const meRes = await request('/api/auth/me', 'GET', null, authHeaders);
    if (meRes.status !== 200) {
      throw new Error(`Truy vấn thông tin /me thất bại: ${JSON.stringify(meRes.body)}`);
    }
    console.log('✅ Thông tin khớp từ Cookie! Email phụ huynh:', meRes.body.email);

    // 4. Tạo hồ sơ cho bé
    console.log('\n4. Đang tạo hồ sơ mới cho bé: "Bé Bo", Lớp: "Mầm non", Avatar: "🐱"...');
    const profileRes = await request('/api/profile', 'POST', {
      name: 'Bé Bo',
      grade: 'Mầm non',
      avatar: '🐱'
    }, authHeaders);
    
    if (profileRes.status !== 201) {
      throw new Error(`Tạo hồ sơ cho bé thất bại: ${JSON.stringify(profileRes.body)}`);
    }
    const profileId = profileRes.body.id;
    console.log('✅ Tạo hồ sơ thành công! ID Bé:', profileId);

    // 5. Chọn bạn đồng hành (Cập nhật hồ sơ)
    console.log('\n5. Đang chọn bạn đồng hành: Cáo "Leo" (emoji: 🦊)...');
    const companionRes = await request('/api/profile', 'POST', {
      id: profileId,
      mascotId: 1,
      mascotName: 'Leo',
      mascotImage: '🦊',
      name: 'Bé Bo'
    }, authHeaders);
    
    if (companionRes.status !== 200) {
      throw new Error(`Chọn bạn đồng hành thất bại: ${JSON.stringify(companionRes.body)}`);
    }
    console.log('✅ Thiết lập bạn đồng hành thành công!');

    // 6. Truy cập lấy thông tin bé qua profileId
    console.log('\n6. Lấy chi tiết hồ sơ bé từ API...');
    const kidRes = await request(`/api/profile?profileId=${profileId}`, 'GET', null, authHeaders);
    if (kidRes.status !== 200) {
      throw new Error(`Truy vấn hồ sơ bé thất bại: ${JSON.stringify(kidRes.body)}`);
    }
    console.log(`✅ Lấy hồ sơ thành công! Mascot của bé: ${kidRes.body.mascotName} (${kidRes.body.mascotImage})`);

    // 7. Ghi nhận hoàn thành trò chơi & tích sao
    console.log('\n7. Chơi thử game Chọn đúng (Level 1), được 3 sao. Lưu tiến độ...');
    const progressRes = await request('/api/progress', 'POST', {
      profileId,
      completedLevel: 1,
      starsEarned: 3
    }, authHeaders);
    
    if (progressRes.status !== 200) {
      throw new Error(`Lưu tiến độ game thất bại: ${JSON.stringify(progressRes.body)}`);
    }
    console.log(`✅ Lưu tiến độ thành công! Cấp hiện tại: ${progressRes.body.currentLevel}, Số sao: ${progressRes.body.stars}`);

    // 8. Đổi trang phục trong tủ đồ
    console.log('\n8. Mặc phụ kiện "Mũ phép thuật" cho Leo...');
    const closetRes = await request('/api/closet', 'POST', {
      profileId,
      equippedAccessories: 'hat'
    }, authHeaders);
    
    if (closetRes.status !== 200) {
      throw new Error(`Lưu trang phục thất bại: ${JSON.stringify(closetRes.body)}`);
    }
    console.log(`✅ Lưu trang phục tủ đồ thành công! Phụ kiện đã mặc: "${closetRes.body.equippedAccessories}"`);

    // 9. Đăng xuất
    console.log('\n9. Tiến hành đăng xuất...');
    const logoutRes = await request('/api/auth/logout', 'POST', null, authHeaders);
    if (logoutRes.status !== 200) {
      throw new Error(`Đăng xuất thất bại: ${JSON.stringify(logoutRes.body)}`);
    }
    console.log('✅ Đăng xuất thành công! Phiên hoạt động đã bị xóa.');

    console.log('\n🌟 CHÚC MỪNG! TẤT CẢ CÁC BÀI KIỂM TRA ĐÃ VƯỢT QUA THÀNH CÔNG! 🌟');
  } catch (err) {
    console.error('\n❌ BÀI KIỂM TRA THẤT BẠI VỚI LỖI:', err.message);
    process.exit(1);
  }
}

runTests();

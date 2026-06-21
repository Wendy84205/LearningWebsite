'use client'
import Link from 'next/link'
import styles from './page.module.css'

const FEATURES = [
  { icon: 'sports_esports', color: 'primary', title: 'Game hóa học tập', desc: 'Biến bài tập Toán, Tiếng Việt, Khoa học thành những cuộc phiêu lưu vui nhộn với huy chương và phần thưởng hấp dẫn.' },
  { icon: 'layers', color: 'secondary', title: 'Chuẩn chương trình Bộ GD&ĐT', desc: 'Toàn bộ nội dung lớp 1–5 bám sát SGK hiện hành: Toán, Tiếng Việt, Khoa học, Tiếng Anh và Kỹ năng sống.' },
  { icon: 'monitoring', color: 'tertiary', title: 'Báo cáo tiến độ thực tế', desc: 'Phụ huynh xem chi tiết từng môn, từng lớp: sao tích lũy, chuỗi ngày học, huy chương thế giới đã chinh phục.' },
  { icon: 'family_restroom', color: 'primary', title: 'Dành cho cả gia đình', desc: 'Một tài khoản phụ huynh quản lý nhiều bé, theo dõi tiến độ từng con riêng biệt theo lớp và môn học.' },
]

const GRADES = [
  {
    grade: 'Lớp 1',
    icon: '🏡',
    color: '#d0e4ff',
    border: '#005da7',
    text: '#005da7',
    subjects: ['Toán: Số 0–10, cộng trừ', 'Tiếng Việt: Chữ cái & vần', 'Tự nhiên & Xã hội'],
  },
  {
    grade: 'Lớp 2',
    icon: '📖',
    color: '#fef9c3',
    border: '#686000',
    text: '#5c4a00',
    subjects: ['Toán: Phép tính đến 100', 'Tiếng Việt: Đọc hiểu câu', 'Đạo đức & Kỹ năng sống'],
  },
  {
    grade: 'Lớp 3',
    icon: '🧪',
    color: '#dcfce7',
    border: '#16a34a',
    text: '#166534',
    subjects: ['Toán: Nhân chia cơ bản', 'Tiếng Việt: Tập làm văn', 'Khoa học Tự nhiên'],
  },
  {
    grade: 'Lớp 4',
    icon: '🌍',
    color: '#fce7f3',
    border: '#be185d',
    text: '#9d174d',
    subjects: ['Toán: Phân số & đo lường', 'Tiếng Việt: Đọc diễn cảm', 'Lịch sử & Địa lý'],
  },
  {
    grade: 'Lớp 5',
    icon: '🚀',
    color: '#ede9fe',
    border: '#7c3aed',
    text: '#5b21b6',
    subjects: ['Toán: Hình học & số thập phân', 'Tiếng Việt: Luận điểm & bố cục', 'Khoa học & Kỹ thuật'],
  },
]

const TESTIMONIALS = [
  { initial: 'H', name: 'Chị Hương', role: 'Mẹ bé Ben (Lớp 2)', text: '"Từ khi dùng Học Vui, con trai mình không còn sợ học Toán nữa. Bé cứ đòi làm nhiệm vụ để tích điểm đổi quà suốt!"', bg: 'primary' },
  { initial: 'T', name: 'Anh Tuấn', role: 'Bố bé Na (Lớp 4)', text: '"App rất dễ sử dụng, giao diện tươi sáng và mình có thể xem con yếu phần nào để kèm cặp thêm. Bé Na học lớp 4 mà vẫn mê chơi!"', bg: 'tertiary' },
  { initial: 'M', name: 'Chị Mai', role: 'Mẹ bé Khôi (Lớp 5)', text: '"Con thi chuyển cấp đạt điểm 9 Toán. Mình nghĩ một phần nhờ Học Vui giúp con ôn bài mỗi ngày mà không chán."', bg: 'secondary' },
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className="nav-bar">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          </div>
          <span className="nav-logo-text">Học Vui</span>
        </div>
        <nav className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Tính năng</a>
          <a href="#pricing" className={styles.navLink}>Bảng giá</a>
          <Link href="/parent-login" className="btn btn-primary btn-sm">Bắt đầu miễn phí</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroBackdrop} aria-hidden="true" />
          <div className={styles.heroContent}>
            <span className={`badge badge-amber ${styles.heroBadge}`}>Dành cho học sinh Tiểu học Lớp 1-5</span>
            <h1 className={styles.heroTitle}>Học Vui</h1>
            <p className={styles.heroSub}>
              Nền tảng luyện tập Toán, Tiếng Việt, Khoa học và Kỹ năng sống cho học sinh <strong>lớp 1 đến lớp 5</strong> thông qua hệ thống trò chơi hấp dẫn, giúp trẻ tự giác và yêu thích học tập mỗi ngày.
            </p>
            <div className={styles.heroActions}>
              <Link href="/parent-login" id="cta-start" className="btn btn-primary btn-lg">Đăng ký ngay</Link>
              <Link href="/parent-login?tab=login" className="btn btn-ghost btn-lg">
                <span className="material-symbols-outlined">play_circle</span>
                Xem demo
              </Link>
            </div>
            <div className={styles.heroStats} aria-label="Tổng quan chương trình">
              <div className={styles.heroStat}>
                <strong>5</strong>
                <span>khối lớp</span>
              </div>
              <div className={styles.heroStat}>
                <strong>4+</strong>
                <span>môn học</span>
              </div>
              <div className={styles.heroStat}>
                <strong>100%</strong>
                <span>dữ liệu tiến độ thật</span>
              </div>
            </div>
            <div className={styles.heroSubjects} aria-label="Môn học nổi bật">
              <span className={styles.heroSubject}>Toán</span>
              <span className={styles.heroSubject}>Tiếng Việt</span>
              <span className={styles.heroSubject}>Khoa học</span>
              <span className={styles.heroSubject}>Kỹ năng sống</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tính năng nổi bật</h2>
            <p className={styles.sectionSub}>Môi trường học tập an toàn, đầy cảm hứng cho học sinh tiểu học lớp 1–5</p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={`card-surface tactile-hover ${styles.featureCard}`}>
                <div className={styles.featureIconWrap} data-color={f.color}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '2rem' }}>{f.icon}</span>
                </div>
                <h3 className={styles.featureTitle} data-color={f.color}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum Showcase – Grades 1-5 */}
        <section id="curriculum" className={styles.featuresSection} style={{ background: 'var(--surface-container-low)' }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Nội dung học Tiểu học Lớp 1–5
              <span className="material-symbols-outlined" style={{ marginLeft: '8px', verticalAlign: 'middle' }}>menu_book</span>
            </h2>
            <p className={styles.sectionSub}>Toàn bộ nội dung bám sát chương trình sách giáo khoa Bộ GD&ĐT hiện hành cho tất cả 5 khối lớp tiểu học</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
            {GRADES.map((g, i) => (
              <div key={i} className={`card-surface tactile-hover ${styles.featureCard}`} style={{
                borderTop: `4px solid ${g.border}`,
                background: `linear-gradient(160deg, ${g.color}66, white)`,
              }}>
                <div style={{ fontSize: '36px', marginBottom: '6px' }}>{g.icon}</div>
                <h3 className={styles.featureTitle} style={{ color: g.text, fontSize: '18px' }}>{g.grade}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {g.subjects.map((s, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: g.border, flexShrink: 0, marginTop: '5px' }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.testimonialsSection}>
          <h2 className={styles.sectionTitle}>Phụ huynh nói gì</h2>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.15, color: 'var(--primary)', position: 'absolute', top: 16, right: 16 }}>format_quote</span>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar} style={{ background: `var(--${t.bg})` }}>{t.initial}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className={styles.pricingSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Chọn gói học phù hợp</h2>
          </div>
          <div className={styles.pricingGrid}>
            <div className={`card ${styles.pricingCard}`}>
              <h3 className={styles.pricingName}>Miễn phí</h3>
              <p className={styles.pricingSub}>Trải nghiệm cơ bản</p>
              <div className={styles.pricingAmount}><span>0đ</span><small>/tháng</small></div>
              <ul className={styles.pricingFeatures}>
                <li><span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check_circle</span> 10 bài tập mỗi ngày</li>
                <li><span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check_circle</span> 1 tài khoản học sinh</li>
                <li style={{ opacity: 0.4 }}><span className="material-symbols-outlined">cancel</span> Báo cáo tiến độ chi tiết</li>
              </ul>
              <Link href="/parent-login" className="btn btn-outline-primary" style={{ width: '100%', justifyContent: 'center' }}>Dùng thử ngay</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
              <div className={styles.pricingBadge}>Phổ biến nhất</div>
              <h3 className={styles.pricingName}>Gia đình</h3>
              <p className={styles.pricingSub}>Đầy đủ tính năng cao cấp</p>
              <div className={styles.pricingAmount}><span>199.000đ</span><small>/tháng</small></div>
              <ul className={styles.pricingFeatures}>
                <li><span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check_circle</span> Không giới hạn bài tập</li>
                <li><span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check_circle</span> 3 tài khoản học sinh</li>
                <li><span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check_circle</span> Báo cáo & Phân tích AI</li>
                <li><span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check_circle</span> Hỗ trợ gia sư trực tuyến</li>
              </ul>
              <Link href="/parent-login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Nâng cấp ngay</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className="nav-logo">
              <div className="nav-logo-icon">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
              </div>
              <span className="nav-logo-text">Học Vui</span>
            </div>
            <p className={styles.footerDesc}>Chúng tôi cam kết mang lại môi trường học tập an toàn nhất cho trẻ em. Dữ liệu của con bạn luôn được bảo vệ nghiêm ngặt.</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Thông tin</h4>
            <a href="#">Điều khoản dịch vụ</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Cam kết an toàn</a>
          </div>
          <div className={styles.footerLinks}>
            <h4>Liên hệ</h4>
            <p><span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--primary)' }}>call</span> 1900 1234</p>
            <p><span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--primary)' }}>location_on</span> Hà Nội, Việt Nam</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 Học Vui – Học tập là niềm vui</p>
          <span>
            Made with
            <span className="material-symbols-outlined" style={{ color: 'red', fontSize: '16px', verticalAlign: 'middle', margin: '0 4px', fontVariationSettings: "'FILL' 1" }}>favorite</span>
            for children
          </span>
        </div>
      </footer>
    </div>
  )
}

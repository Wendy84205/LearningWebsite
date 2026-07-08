'use client'
import Link from 'next/link'
import styles from './page.module.css'

const NAV_ITEMS = [
  { href: '#features', label: 'Tính năng' },
  { href: '#curriculum', label: 'Chương trình' },
  { href: '#parents', label: 'Phụ huynh' },
]

const FEATURES = [
  { icon: 'sports_esports', title: 'Học bằng game', desc: 'Câu hỏi lớp 1-5 được biến thành nhiệm vụ ngắn, có XP, sao, streak và phản hồi ngay sau mỗi lượt chơi.' },
  { icon: 'route', title: 'Lộ trình theo lớp', desc: 'Mỗi bé học theo lớp, thế giới, màn chơi và kỹ năng trọng tâm thay vì danh sách bài tập rời rạc.' },
  { icon: 'monitoring', title: 'Tiến độ thật', desc: 'Phụ huynh xem số câu đúng, sao, cấp độ, môn mạnh/yếu và lịch sử luyện tập từ dữ liệu lưu trong hệ thống.' },
  { icon: 'admin_panel_settings', title: 'Nội dung quản trị', desc: 'Question Bank và CMS giúp mở rộng câu hỏi, game, bài kiểm tra và báo cáo mà không phải sửa giao diện học sinh.' },
]

const GRADES = [
  { grade: 'Lớp 1', icon: 'looks_one', theme: 'green', focus: 'Đếm, chữ cái, âm vần', subjects: ['Toán 0-10', 'Tiếng Việt nhập môn', 'Ghép hình, nghe chọn'] },
  { grade: 'Lớp 2', icon: 'looks_two', theme: 'blue', focus: 'Tính nhẩm, đọc hiểu câu', subjects: ['Cộng trừ đến 100', 'Từ và câu', 'Nhiệm vụ ngày'] },
  { grade: 'Lớp 3', icon: 'looks_3', theme: 'pink', focus: 'Nhân chia, đoạn văn, logic', subjects: ['Bảng nhân chia', 'Tập làm văn', 'Quiz phiêu lưu'] },
  { grade: 'Lớp 4', icon: 'looks_4', theme: 'violet', focus: 'Phân số, khoa học, địa lí', subjects: ['Phân số', 'Từ loại', 'Ghép khái niệm'] },
  { grade: 'Lớp 5', icon: 'looks_5', theme: 'amber', focus: 'Tổng ôn và phản xạ', subjects: ['Số thập phân', 'Đọc hiểu dài', 'Runner 3D'] },
]

const STATS = [
  { value: '5', label: 'khối lớp' },
  { value: '9', label: 'kiểu game' },
  { value: '100%', label: 'tiến độ thật' },
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.ambientLayer} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.starField} aria-hidden="true" />
      <header className={styles.navBar}>
        <Link href="/" className={styles.brand} aria-label="Học Vui trang chủ">
          <span className={styles.brandMark} aria-hidden="true">
            <span className="material-symbols-outlined">auto_stories</span>
          </span>
          <span>Học Vui</span>
        </Link>

        <nav className={styles.navLinks} aria-label="Điều hướng trang chủ">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href} className={styles.navLink}>{item.label}</a>
          ))}
        </nav>

        <Link href="/parent-login" className={styles.navCta}>Bắt đầu</Link>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroContent}>
            <span className={styles.kicker}>Dành cho học sinh tiểu học lớp 1-5</span>
            <h1 id="home-title" className={styles.heroTitle}>
              <span>Học</span>
              <span>Vui</span>
            </h1>
            <p className={styles.heroSub}>
              Luyện Toán, Tiếng Việt, Khoa học và kỹ năng nền tảng bằng game ngắn, lộ trình rõ và báo cáo tiến độ thật cho phụ huynh.
            </p>

            <div className={styles.heroActions} aria-label="Hành động chính">
              <Link href="/parent-login" id="cta-start" className={styles.primaryButton}>Đăng ký miễn phí</Link>
              <Link href="/parent-login?tab=login" className={styles.secondaryButton}>
                <span className="material-symbols-outlined" aria-hidden="true">login</span>
                Đăng nhập
              </Link>
              <a href="#curriculum" className={styles.ghostButton}>Xem chương trình</a>
            </div>

            <form className={styles.emailForm} action="/parent-login" aria-label="Nhận tư vấn tài khoản phụ huynh">
              <label htmlFor="parent-email" className={styles.emailLabel}>Email phụ huynh</label>
              <div className={styles.emailControl}>
                <span className="material-symbols-outlined" aria-hidden="true">mail</span>
                <input id="parent-email" name="email" type="email" inputMode="email" placeholder="phuhuynh@example.com" />
                <button type="submit">Tư vấn</button>
              </div>
            </form>

            <div className={styles.heroStats} aria-label="Tổng quan sản phẩm">
              {STATS.map(stat => (
                <div key={stat.label} className={styles.heroStat}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="Minh họa bản đồ học tập Học Vui">
            <div className={styles.visualSpotlight} aria-hidden="true" />
            <div className={styles.orbitBadge} data-tone="green">
              <span className="material-symbols-outlined" aria-hidden="true">local_fire_department</span>
              7 ngày streak
            </div>
            <div className={styles.orbitBadge} data-tone="blue">
              <span className="material-symbols-outlined" aria-hidden="true">sports_esports</span>
              Game quest
            </div>
            <div className={styles.phoneFrame}>
              <div className={styles.borderBeam} aria-hidden="true" />
              <div className={styles.phoneTop}>
                <span>Hôm nay</span>
                <strong>84%</strong>
              </div>
              <div className={styles.lessonPath}>
                {['Toán', 'TV', '3D', 'Boss'].map((item, index) => (
                  <div key={item} className={styles.lessonNode} data-active={index < 3}>
                    <i aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className={styles.quizPreview}>
                <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
                <div>
                  <strong>3 + 2 = ?</strong>
                  <p>Chọn cổng đúng để nhận XP</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Learning system</span>
            <h2>Học nhanh, chơi gọn, phụ huynh nắm được kết quả</h2>
            <p>Giao diện ưu tiên hành động rõ ràng, tương phản cao, chữ dễ đọc và không dùng ngoại lệ màu/spacing rời rạc.</p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map(feature => (
              <article key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIcon} aria-hidden="true">
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="curriculum" className={`${styles.section} ${styles.curriculumSection}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Grade 1-5</span>
            <h2>Phân bổ game theo từng lớp để bé không bị chán</h2>
            <p>Mỗi khối có nhịp học riêng: lớp nhỏ thao tác đơn giản, lớp lớn tăng chiến thuật, đọc hiểu và phản xạ.</p>
          </div>
          <div className={styles.gradeGrid}>
            {GRADES.map(grade => (
              <article key={grade.grade} className={styles.gradeCard} data-theme={grade.theme}>
                <div className={styles.gradeHead}>
                  <span className="material-symbols-outlined" aria-hidden="true">{grade.icon}</span>
                  <h3>{grade.grade}</h3>
                </div>
                <p>{grade.focus}</p>
                <ul>
                  {grade.subjects.map(subject => (
                    <li key={subject}>
                      <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                      {subject}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="parents" className={styles.parentBand}>
          <div>
            <span className={styles.sectionEyebrow}>For parents</span>
            <h2>Biết con đang mạnh gì, yếu gì, cần ôn gì tiếp theo</h2>
            <p>Bảng phụ huynh lấy dữ liệu thật từ hồ sơ bé, tiến độ màn chơi và kết quả luyện tập để gợi ý trọng tâm học tiếp.</p>
          </div>
          <Link href="/parent-login" className={styles.primaryButton}>Vào dashboard phụ huynh</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href="/" className={styles.brand} aria-label="Học Vui trang chủ">
          <span className={styles.brandMark} aria-hidden="true">
            <span className="material-symbols-outlined">auto_stories</span>
          </span>
          <span>Học Vui</span>
        </Link>
        <div className={styles.footerLinks}>
          <a href="#features">Tính năng</a>
          <a href="#curriculum">Chương trình</a>
          <Link href="/parent-login">Đăng nhập</Link>
        </div>
      </footer>
    </div>
  )
}

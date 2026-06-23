'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export default function ParentDashboard() {
  const router = useRouter()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeChild, setActiveChild] = useState(0)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/parent/dashboard', { cache: 'no-store' })
        if (res.status === 401) { router.push('/parent-login'); return }
        if (res.ok) { const data = await res.json(); setDashboard(data) }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [router])

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch (_) {}
    localStorage.clear()
    router.push('/')
  }

  const profiles = dashboard?.profiles || []
  const profile = profiles[activeChild] || null
  const parentName = dashboard?.parentName || 'Ba Mẹ'
  const stats = profile?.stats || {}
  const recentActivity = profile?.recentActivity || []
  const suggestions = profile?.suggestions || []
  const chartData = profile?.weeklyMinutes || [40, 60, 45, 85, 30, 90, 45]
  const chartDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const chartMax = Math.max(...chartData, 1)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  const completionPct = profile?.todayGoalPct ?? 85

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sideLogoArea}>
          <Link href="/" className={styles.sideLogoLink}>
            <span className={styles.sideLogoText}>Học Vui</span>
          </Link>
        </div>

        <nav className={styles.sideNav}>
          <Link href="/parent-dashboard" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span>Tổng quan</span>
          </Link>
          <Link href="/parent-dashboard/reports" className={styles.navItem}>
            <span className="material-symbols-outlined">analytics</span>
            <span>Báo cáo</span>
          </Link>
          <Link href="/parent-dashboard/settings" className={styles.navItem}>
            <span className="material-symbols-outlined">settings</span>
            <span>Cài đặt</span>
          </Link>
        </nav>

        {/* Parent Profile at bottom */}
        <div className={styles.sideProfile}>
          <div className={styles.sideAvatar}>
            <span className="material-symbols-outlined" style={{ color: '#58cc02', fontSize: 22, fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div className={styles.sideProfileInfo}>
            <p className={styles.sideProfileName}>{parentName}</p>
            <p className={styles.sideProfileBadge}>Phụ huynh</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.welcomeTitle}>{greeting}, {parentName} 👋</h1>
            <p className={styles.welcomeSub}>
              {profile ? (
                <>Hôm nay <strong>{profile.name}</strong> đã hoàn thành <span className={styles.goalPct}>{completionPct}%</span> mục tiêu!</>
              ) : 'Chào mừng đến với bảng điều khiển phụ huynh.'}
            </p>
          </div>

          <div className={styles.headerActions}>
            {/* Child Switcher */}
            {profiles.length > 1 && (
              <div className={styles.childSwitcher}>
                {profiles.map((p, i) => (
                  <button
                    key={p.id}
                    className={`${styles.childTab} ${i === activeChild ? styles.childTabActive : ''}`}
                    onClick={() => setActiveChild(i)}
                  >
                    <div className={styles.childTabAvatar}>
                      {p.avatar && (p.avatar.startsWith('http') || p.avatar.startsWith('/')) ? (
                        <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 16 }}>{p.avatar || '👦'}</span>
                      )}
                    </div>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className={styles.headerRight}>
              <button className={styles.iconBtn} title="Thông báo">
                <span className="material-symbols-outlined">notifications</span>
                <span className={styles.notifDot} />
              </button>
              <button className={styles.iconBtn} onClick={handleLogout} title="Đăng xuất">
                <span className="material-symbols-outlined" style={{ color: '#ff4b4b' }}>logout</span>
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className={styles.loadingWrap}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#58cc02', animation: 'spin 1s linear infinite' }}>refresh</span>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className={styles.body}>
            {/* METRIC CARDS */}
            <section className={styles.metricGrid}>
              {[
                { icon: 'schedule', color: '#1cb0f6', bg: 'rgba(28,176,246,0.1)', label: 'Thời gian học hôm nay', value: `${stats.studyMinutesToday ?? 45} Phút`, badge: '+12%', badgeColor: '#58cc02' },
                { icon: 'local_fire_department', color: '#ffc800', bg: 'rgba(255,200,0,0.1)', label: 'Streak hiện tại', value: `${stats.streak ?? 12} Ngày`, badge: 'Mới!', badgeColor: '#ffc800' },
                { icon: 'workspace_premium', color: '#58cc02', bg: 'rgba(88,204,2,0.1)', label: 'Cấp độ hiện tại', value: `Cấp độ ${stats.level ?? 14}`, badge: 'Vàng', badgeColor: '#ffc800' },
                { icon: 'star', color: '#1cb0f6', bg: 'rgba(28,176,246,0.1)', label: 'Tổng XP tuần này', value: `${(stats.weeklyXp ?? 1250).toLocaleString()} XP`, badge: 'TOP 5', badgeColor: '#1cb0f6' },
              ].map((m, i) => (
                <div key={i} className={styles.metricCard}>
                  <div className={styles.metricTop}>
                    <div className={styles.metricIconWrap} style={{ background: m.bg }}>
                      <span className="material-symbols-outlined" style={{ color: m.color, fontSize: 28, fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                    </div>
                    <span className={styles.metricBadge} style={{ color: m.badgeColor }}>{m.badge}</span>
                  </div>
                  <p className={styles.metricValue}>{m.value}</p>
                  <p className={styles.metricLabel}>{m.label}</p>
                </div>
              ))}
            </section>

            {/* CHARTS + SUGGESTIONS */}
            <section className={styles.chartRow}>
              {/* Bar Chart */}
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Thời gian học tập</h3>
                  <select className={styles.chartSelect}>
                    <option>7 ngày gần nhất</option>
                    <option>Tháng này</option>
                  </select>
                </div>
                <div className={styles.barChart}>
                  {chartData.map((val, i) => {
                    const pct = Math.round((val / chartMax) * 100)
                    const isToday = i === chartData.length - 1
                    return (
                      <div key={i} className={styles.barCol}>
                        <div className={styles.barTrack} style={{ height: 260 }}>
                          <div
                            className={styles.barFill}
                            style={{
                              height: `${pct}%`,
                              background: isToday ? '#58cc02' : '#1cb0f6',
                              boxShadow: isToday ? '0 0 12px rgba(88,204,2,0.4)' : 'none',
                            }}
                          />
                        </div>
                        <span className={styles.barLabel} style={{ color: isToday ? '#58cc02' : '#6e7881', fontWeight: isToday ? 900 : 700 }}>
                          {chartDays[i]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Suggestions */}
              <div className={styles.suggCard}>
                <h3 className={styles.chartTitle}>Gợi ý cho con</h3>
                <div className={styles.suggList}>
                  {(suggestions.length > 0 ? suggestions : [
                    { icon: 'calculate', color: '#ffc800', shadow: '#cc9a00', title: 'Ôn tập Phép trừ có nhớ', sub: `${profile?.name || 'Con'} đang gặp khó khăn ở các bài toán có số 0.` },
                    { icon: 'translate', color: '#1cb0f6', shadow: '#1899d6', title: 'Luyện từ vựng Trường học', sub: `Giúp ${profile?.name || 'con'} ghi nhớ 10 từ mới về dụng cụ.` },
                    { icon: 'lightbulb', color: '#58cc02', shadow: '#46a302', title: 'Thử thách Khoa học vui', sub: `Khám phá vòng đời của Bướm cùng ${profile?.name || 'con'}.` },
                  ]).map((s, i) => (
                    <div key={i} className={styles.suggItem}>
                      <div className={styles.suggIcon} style={{ background: s.color, boxShadow: `0 3px 0 ${s.shadow}` }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff' }}>{s.icon}</span>
                      </div>
                      <div className={styles.suggText}>
                        <p className={styles.suggTitle}>{s.title}</p>
                        <p className={styles.suggSub}>{s.sub}</p>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: '#bdc8d2', marginLeft: 'auto' }}>chevron_right</span>
                    </div>
                  ))}
                </div>
                <button className={styles.suggMoreBtn}>Xem thêm gợi ý</button>
              </div>
            </section>

            {/* ACHIEVEMENT BANNER */}
            <section className={styles.achieveBanner}>
              <div className={styles.achieveText}>
                <h2 className={styles.achieveTitle}>Thành tích mới của {profile?.name || 'con'}! 🏆</h2>
                <p className={styles.achieveSub}>
                  {profile?.name || 'Con'} vừa đạt được danh hiệu &quot;Dũng sĩ Toán học&quot; sau khi hoàn thành 50 bài tập đúng liên tiếp.
                </p>
                <div className={styles.achieveBtns}>
                  <button className={styles.achievePraise}>Khen ngợi ngay</button>
                  <Link href="/parent-dashboard/reports" className={styles.achieveDetail}>Xem chi tiết</Link>
                </div>
              </div>
              <div className={styles.achieveBadgeWrap}>
                <div className={styles.achieveBadgeRing}>
                  <div className={styles.achieveBadgeInner}>
                    <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#fff', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className={styles.mobileNav}>
        <Link href="/parent-dashboard" className={`${styles.mobileNavItem} ${styles.mobileNavActive}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span>Tổng quan</span>
        </Link>
        <Link href="/parent-dashboard/reports" className={styles.mobileNavItem}>
          <span className="material-symbols-outlined">analytics</span>
          <span>Báo cáo</span>
        </Link>
        <Link href="/parent-dashboard/settings" className={styles.mobileNavItem}>
          <span className="material-symbols-outlined">settings</span>
          <span>Cài đặt</span>
        </Link>
      </nav>
    </div>
  )
}

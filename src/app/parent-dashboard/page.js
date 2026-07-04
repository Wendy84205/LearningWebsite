'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export default function ParentDashboard() {
  const router = useRouter()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeChild, setActiveChild] = useState(0)
  const [lastRefresh, setLastRefresh] = useState(null)
  const refreshTimerRef = useRef(null)

  const fetchDashboard = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true)
      const res = await fetch('/api/parent/dashboard', { cache: 'no-store' })
      if (res.status === 401) { router.push('/parent-login'); return }
      if (res.ok) {
        const data = await res.json()
        setDashboard(data)
        setLastRefresh(new Date())
      }
    } catch (e) {
      console.error('[parent-dashboard]', e)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      fetchDashboard()
    }, 0)
    return () => window.clearTimeout(initialLoadId)
  }, [fetchDashboard])

  // Auto-refresh mỗi 60 giây khi tab active
  useEffect(() => {
    const startTimer = () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
      refreshTimerRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') fetchDashboard(true)
      }, 60000)
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboard(true)
        startTimer()
      } else {
        clearInterval(refreshTimerRef.current)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    startTimer()
    return () => {
      clearInterval(refreshTimerRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchDashboard])

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch (_) {}
    localStorage.clear()
    router.push('/')
  }

  const profiles = dashboard?.profiles || []
  const profile = profiles[activeChild] || null
  const parentName = dashboard?.parentName || 'Ba Mẹ'
  const unreadCount = dashboard?.unreadCount || 0
  const stats = profile?.stats || {}
  const suggestions = profile?.suggestions || []
  const chartData = profile?.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0]
  const chartDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const chartMax = Math.max(...chartData, 1)
  const recentActivities = profile?.recentActivities || []
  const latestBadge = profile?.latestBadge || null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  const completionPct = profile?.todayGoalPct ?? 0

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

        {/* Last refresh */}
        {lastRefresh && (
          <div className={styles.refreshInfo}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>sync</span>
            <span>Cập nhật lúc {lastRefresh.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}

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
                <>Hôm nay <strong>{profile.name}</strong> đã hoàn thành <span className={styles.goalPct}>{completionPct}%</span> mục tiêu học tập!</>
              ) : loading ? 'Đang tải dữ liệu...' : 'Chào mừng đến với bảng điều khiển phụ huynh.'}
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
                        <span style={{ fontSize: 14 }}>{p.avatar || '👦'}</span>
                      )}
                    </div>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className={styles.headerRight}>
              <button className={styles.iconBtn} title="Thông báo" style={{ position: 'relative' }}>
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className={styles.notifBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
              <button className={styles.iconBtn} onClick={handleLogout} title="Đăng xuất">
                <span className="material-symbols-outlined" style={{ color: '#ff4b4b' }}>logout</span>
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className={styles.loadingWrap}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#58cc02', animation: 'spin 1s linear infinite' }}>refresh</span>
            <p>Đang tải dữ liệu...</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : !profile ? (
          <div className={styles.loadingWrap}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#bdc8d2' }}>person_off</span>
            <p>Không tìm thấy hồ sơ học sinh.</p>
            <Link href="/add-profile" className={styles.achievePraise} style={{ marginTop: 16, textDecoration: 'none', display: 'inline-block' }}>
              Thêm hồ sơ
            </Link>
          </div>
        ) : (
          <div className={styles.body}>
            {/* METRIC CARDS - Dữ liệu thật */}
            <section className={styles.metricGrid}>
              {[
                {
                  icon: 'schedule',
                  color: '#1cb0f6', bg: 'rgba(28,176,246,0.1)',
                  label: 'Thời gian học hôm nay',
                  value: `${stats.studyMinutesToday ?? 0} Phút`,
                  badge: stats.studyMinutesToday >= 30 ? '✓ Đạt!' : `${Math.max(0, 30 - (stats.studyMinutesToday ?? 0))} phút nữa`,
                  badgeColor: stats.studyMinutesToday >= 30 ? '#58cc02' : '#ffc800',
                },
                {
                  icon: 'local_fire_department',
                  color: '#ffc800', bg: 'rgba(255,200,0,0.1)',
                  label: 'Streak hiện tại',
                  value: `${stats.streak ?? 0} Ngày`,
                  badge: stats.streak >= 7 ? '🔥 Tuyệt!' : stats.streak > 0 ? 'Đang duy trì' : 'Chưa bắt đầu',
                  badgeColor: stats.streak >= 7 ? '#ff4b4b' : '#ffc800',
                },
                {
                  icon: 'workspace_premium',
                  color: '#58cc02', bg: 'rgba(88,204,2,0.1)',
                  label: 'Cấp độ hiện tại',
                  value: `Cấp độ ${stats.level ?? 1}`,
                  badge: `${stats.xp ?? 0} XP`,
                  badgeColor: '#58cc02',
                },
                {
                  icon: 'star',
                  color: '#1cb0f6', bg: 'rgba(28,176,246,0.1)',
                  label: 'XP tuần này',
                  value: `${(stats.weeklyXp ?? 0).toLocaleString()} XP`,
                  badge: `TB: ${stats.averageScore ?? 0}%`,
                  badgeColor: '#1cb0f6',
                },
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

            {/* CHART + SUGGESTIONS */}
            <section className={styles.chartRow}>
              {/* Bar Chart - Thời gian học thật 7 ngày */}
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Thời gian học 7 ngày qua</h3>
                  <span style={{ fontSize: 13, color: '#777', fontWeight: 700 }}>
                    Tổng: {chartData.reduce((a, b) => a + b, 0)} phút
                  </span>
                </div>
                <div className={styles.barChart}>
                  {chartData.map((val, i) => {
                    const pct = Math.round((val / chartMax) * 100)
                    const isToday = i === chartData.length - 1
                    return (
                      <div key={i} className={styles.barCol}>
                        <span className={styles.barVal} style={{ color: isToday ? '#58cc02' : '#aaa' }}>
                          {val > 0 ? `${val}p` : ''}
                        </span>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            style={{
                              height: `${Math.max(pct, val > 0 ? 4 : 0)}%`,
                              background: isToday ? '#58cc02' : '#1cb0f6',
                              boxShadow: isToday ? '0 0 12px rgba(88,204,2,0.4)' : 'none',
                            }}
                          />
                        </div>
                        <span className={styles.barLabel} style={{ color: isToday ? '#58cc02' : '#777', fontWeight: isToday ? 900 : 700 }}>
                          {chartDays[i]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Suggestions - Dựa trên weakSkills thật */}
              <div className={styles.suggCard}>
                <h3 className={styles.chartTitle}>Gợi ý cho {profile.name}</h3>
                <div className={styles.suggList}>
                  {suggestions.map((s, i) => (
                    <div key={i} className={styles.suggItem}>
                      <div className={styles.suggIcon} style={{ background: s.color, boxShadow: `0 3px 0 ${s.shadow}` }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff' }}>{s.icon}</span>
                      </div>
                      <div className={styles.suggText}>
                        <p className={styles.suggTitle}>{s.title}</p>
                        <p className={styles.suggSub}>{s.sub}</p>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: '#bdc8d2', marginLeft: 'auto', flexShrink: 0 }}>chevron_right</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/learning/${profile.gradeSlug}/map`}
                  className={styles.suggMoreBtn}
                >
                  Xem bản đồ học tập của {profile.name}
                </Link>
              </div>
            </section>

            {/* RECENT ACTIVITY */}
            {recentActivities.length > 0 && (
              <section className={styles.activitySection}>
                <h3 className={styles.chartTitle} style={{ marginBottom: 16 }}>Hoạt động gần đây của {profile.name}</h3>
                <div className={styles.activityList}>
                  {recentActivities.map((act, i) => {
                    const typeIcon = act.activityType === 'test' ? 'assignment' : act.activityType === 'review' ? 'psychology' : 'sports_esports'
                    const typeColor = act.activityType === 'test' ? '#1cb0f6' : act.activityType === 'review' ? '#ffa500' : '#58cc02'
                    return (
                      <div key={i} className={styles.activityItem}>
                        <div className={styles.activityIcon} style={{ background: `${typeColor}18` }}>
                          <span className="material-symbols-outlined" style={{ color: typeColor, fontSize: 22 }}>{typeIcon}</span>
                        </div>
                        <div className={styles.activityInfo}>
                          <p className={styles.activityTitle}>{act.title}</p>
                          <p className={styles.activitySub}>
                            {act.correct}/{act.total} đúng &bull; {act.scorePct}% &bull; +{act.xp} XP &bull; {act.stars}★
                          </p>
                        </div>
                        <span className={styles.activityScore} style={{ color: act.scorePct >= 80 ? '#58cc02' : act.scorePct >= 60 ? '#ffc800' : '#ff4b4b' }}>
                          {act.scorePct}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ACHIEVEMENT BANNER - Badge thật */}
            <section className={styles.achieveBanner}>
              <div className={styles.achieveText}>
                <h2 className={styles.achieveTitle}>
                  {latestBadge
                    ? `${profile.name} đạt huy hiệu: ${latestBadge.name}! 🏆`
                    : `Khuyến khích ${profile.name} học thêm! 🌟`}
                </h2>
                <p className={styles.achieveSub}>
                  {latestBadge
                    ? `Huy hiệu được mở khóa ngày ${new Date(latestBadge.unlockedAt).toLocaleDateString('vi-VN')}.`
                    : `${profile.name} đang ở cấp độ ${stats.level ?? 1} với ${stats.xp ?? 0} XP tổng. Tiếp tục cổ vũ để con đạt huy hiệu đầu tiên!`}
                </p>
                <div className={styles.achieveBtns}>
                  <Link
                    href={`/learning/${profile.gradeSlug}`}
                    className={styles.achievePraise}
                  >
                    Xem dashboard của {profile.name}
                  </Link>
                  <Link href="/parent-dashboard/reports" className={styles.achieveDetail}>
                    Xem báo cáo chi tiết
                  </Link>
                </div>
              </div>
              <div className={styles.achieveBadgeWrap}>
                <div className={styles.achieveBadgeRing}>
                  <div className={styles.achieveBadgeInner}>
                    <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#fff', fontVariationSettings: "'FILL' 1" }}>
                      {latestBadge ? 'workspace_premium' : 'star'}
                    </span>
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

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
  const trendTone = (stats.averageScore ?? 0) >= 80 ? 'Tự tin' : (stats.averageScore ?? 0) >= 60 ? 'Cần luyện thêm' : 'Cần hỗ trợ'
  const latestActivity = recentActivities[0] || null
  const primarySuggestion = suggestions[0] || null
  const todayMinutes = stats.studyMinutesToday ?? 0
  const ranking = profile?.ranking
  const rankingItems = ranking?.items || []
  const currentRank = ranking?.current
  const parentNavItems = profile ? [
    { href: '#overview', icon: 'dashboard', label: 'Tổng quan', desc: 'Nhịp học hôm nay', active: true },
    { href: '#child-now', icon: 'visibility', label: 'Con đang học gì', desc: latestActivity?.title || 'Hoạt động mới nhất' },
    { href: '#ranker', icon: 'leaderboard', label: 'Ranker', desc: currentRank ? `Hạng #${currentRank.rank}` : 'Xếp hạng học tập' },
    { href: '#metrics', icon: 'monitoring', label: 'Chỉ số', desc: `${stats.averageScore ?? 0}% điểm TB` },
    { href: '#activity', icon: 'history', label: 'Hoạt động', desc: `${recentActivities.length} lượt gần đây` },
  ] : [
    { href: '#overview', icon: 'dashboard', label: 'Tổng quan', desc: 'Bảng phụ huynh', active: true },
  ]
  const parentQuickLinks = profile ? [
    { href: `/learning/${profile.gradeSlug}`, icon: 'school', label: 'Dashboard con' },
    { href: `/learning/${profile.gradeSlug}/map`, icon: 'route', label: 'Lộ trình' },
    { href: `/learning/${profile.gradeSlug}/games`, icon: 'sports_esports', label: 'Game' },
    { href: '/add-profile', icon: 'person_add', label: 'Thêm hồ sơ' },
  ] : [
    { href: '/add-profile', icon: 'person_add', label: 'Thêm hồ sơ' },
    { href: '/', icon: 'home', label: 'Trang chủ' },
  ]

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sideLogoArea}>
          <Link href="/" className={styles.sideLogoLink}>
            <span className={styles.sideLogoMark} aria-hidden="true">
              <span className="material-symbols-outlined">family_restroom</span>
            </span>
            <span className={styles.sideLogoCopy}>
              <span className={styles.sideLogoText}>Học Vui</span>
              <span className={styles.sideLogoSub}>Parent Center</span>
            </span>
          </Link>
        </div>

        {profile && (
          <div className={styles.sideChildCard}>
            <div className={styles.sideChildTop}>
              <div className={styles.sideChildAvatar}>
                {profile.avatar && (profile.avatar.startsWith('http') || profile.avatar.startsWith('/')) ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span>{profile.avatar || '👦'}</span>
                )}
              </div>
              <div className={styles.sideChildInfo}>
                <span>Đang theo dõi</span>
                <strong>{profile.name}</strong>
                <small>{profile.grade || profile.gradeLabel || 'Học sinh'}</small>
              </div>
            </div>
            <div className={styles.sideChildProgress}>
              <div>
                <strong>{completionPct}%</strong>
                <span>Mục tiêu</span>
              </div>
              <div>
                <strong>{stats.streak ?? 0}</strong>
                <span>Streak</span>
              </div>
              <div>
                <strong>{stats.level ?? 1}</strong>
                <span>Cấp</span>
              </div>
            </div>
          </div>
        )}

        {profiles.length > 1 && (
          <div className={styles.sideChildSwitch}>
            <span className={styles.sideSectionLabel}>Hồ sơ học sinh</span>
            {profiles.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.sideChildSwitchItem} ${i === activeChild ? styles.sideChildSwitchActive : ''}`}
                onClick={() => setActiveChild(i)}
              >
                <span>{p.avatar && !String(p.avatar).startsWith('http') && !String(p.avatar).startsWith('/') ? p.avatar : '👦'}</span>
                <strong>{p.name}</strong>
              </button>
            ))}
          </div>
        )}

        <nav className={styles.sideNav} aria-label="Điều hướng phụ huynh">
          <span className={styles.sideSectionLabel}>Bảng điều khiển</span>
          {parentNavItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: item.active ? "'FILL' 1" : undefined }}>{item.icon}</span>
              <span className={styles.navText}>
                <strong>{item.label}</strong>
                <small>{item.desc}</small>
              </span>
            </a>
          ))}
        </nav>

        <div className={styles.sideQuickActions}>
          <span className={styles.sideSectionLabel}>Đi nhanh</span>
          <div className={styles.sideQuickGrid}>
            {parentQuickLinks.map(item => (
              <Link key={item.href} href={item.href} className={styles.sideQuickLink}>
                <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                <strong>{item.label}</strong>
              </Link>
            ))}
          </div>
        </div>

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
          <button type="button" className={styles.sideLogoutButton} onClick={handleLogout} title="Đăng xuất">
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
          </button>
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
            <section id="overview" className={styles.parentHero}>
              <div className={styles.parentHeroText}>
                <span className={styles.parentHeroEyebrow}>Báo cáo học tập hôm nay</span>
                <h2>{profile.name} đang học ở nhịp độ {completionPct >= 80 ? 'rất tốt' : completionPct > 0 ? 'ổn định' : 'cần khởi động'}</h2>
                <p>
                  Theo dõi thời gian học, XP, streak và kỹ năng cần ôn để ba mẹ biết nên cổ vũ con ở đâu trong ngày.
                </p>
                <div className={styles.parentHeroActions}>
                  <Link href={`/learning/${profile.gradeSlug}`} className={styles.primaryAction}>
                    Mở dashboard của con
                  </Link>
                  <Link href={`/learning/${profile.gradeSlug}/map`} className={styles.secondaryAction}>
                    Xem lộ trình
                  </Link>
                </div>
              </div>
              <div className={styles.parentHeroPanel}>
                <div
                  className={styles.parentHeroRing}
                  style={{ '--goal-progress': `${Math.max(0, Math.min(completionPct, 100))}%` }}
                >
                  <span>{completionPct}%</span>
                  <small>Mục tiêu</small>
                </div>
                <div className={styles.parentHeroSignals}>
                  <div>
                    <strong>{trendTone}</strong>
                    <span>Tín hiệu học tập</span>
                  </div>
                  <div>
                    <strong>{stats.averageScore ?? 0}%</strong>
                    <span>Điểm trung bình</span>
                  </div>
                  <div>
                    <strong>{recentActivities.length}</strong>
                    <span>Hoạt động gần đây</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.questCommand} aria-label="Bảng nhiệm vụ phụ huynh">
              {[
                { icon: 'flag', label: 'Mục tiêu hôm nay', value: `${completionPct}%`, sub: completionPct >= 80 ? 'Gần hoàn tất' : 'Cần cổ vũ thêm', tone: 'green' },
                { icon: 'local_fire_department', label: 'Chuỗi học', value: `${stats.streak ?? 0}`, sub: 'ngày liên tiếp', tone: 'orange' },
                { icon: 'military_tech', label: 'Cấp hiện tại', value: `${stats.level ?? 1}`, sub: `${stats.xp ?? 0} XP`, tone: 'blue' },
                { icon: 'psychology', label: 'Điểm trung bình', value: `${stats.averageScore ?? 0}%`, sub: trendTone, tone: 'pink' },
              ].map(item => (
                <div key={item.label} className={styles.questCommandCard} data-tone={item.tone}>
                  <span className={styles.questCommandIcon}>
                    <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                  </span>
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <small>{item.sub}</small>
                  </div>
                </div>
              ))}
            </section>

            <section id="child-now" className={styles.childNowBoard} aria-label="Con đang học gì">
              <div className={styles.childNowHeader}>
                <div>
                  <span>Trạng thái hiện tại</span>
                  <h2>{profile.name} đang làm gì?</h2>
                </div>
                <Link href={`/learning/${profile.gradeSlug}`} className={styles.childNowLink}>
                  Mở màn hình học
                  <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
                </Link>
              </div>

              <div className={styles.childNowGrid}>
                <article className={styles.childNowCard} data-tone="blue">
                  <span className={styles.childNowIcon}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {latestActivity ? 'sports_esports' : 'play_circle'}
                    </span>
                  </span>
                  <div>
                    <span className={styles.childNowLabel}>Vừa làm gần nhất</span>
                    <strong>{latestActivity?.title || 'Chưa có hoạt động hôm nay'}</strong>
                    <small>
                      {latestActivity
                        ? `${latestActivity.correct}/${latestActivity.total} đúng • ${latestActivity.scorePct}% • +${latestActivity.xp} XP`
                        : 'Hãy cho con bắt đầu một bài luyện ngắn.'}
                    </small>
                  </div>
                </article>

                <article className={styles.childNowCard} data-tone="green">
                  <span className={styles.childNowIcon}>
                    <span className="material-symbols-outlined" aria-hidden="true">timer</span>
                  </span>
                  <div>
                    <span className={styles.childNowLabel}>Thời gian hôm nay</span>
                    <strong>{todayMinutes} phút</strong>
                    <small>{todayMinutes >= 30 ? 'Đã đạt mục tiêu ngày.' : `Còn ${Math.max(0, 30 - todayMinutes)} phút để đạt mục tiêu.`}</small>
                  </div>
                </article>

                <article className={styles.childNowCard} data-tone="orange">
                  <span className={styles.childNowIcon}>
                    <span className="material-symbols-outlined" aria-hidden="true">tips_and_updates</span>
                  </span>
                  <div>
                    <span className={styles.childNowLabel}>Nên tập trung</span>
                    <strong>{primarySuggestion?.title || 'Ôn bài tiếp theo'}</strong>
                    <small>{primarySuggestion?.sub || 'Chưa có gợi ý yếu rõ ràng, tiếp tục duy trì nhịp học.'}</small>
                  </div>
                </article>
              </div>
            </section>

            <section id="ranker" className={styles.parentRanker} aria-label="Xếp hạng học tập của con">
              <div className={styles.parentRankerHeader}>
                <div>
                  <span>Ranker học tập</span>
                  <h2>{currentRank ? `${profile.name} đang ở hạng #${currentRank.rank}` : 'Chưa có dữ liệu xếp hạng'}</h2>
                </div>
                <strong>{currentRank?.score || 0} điểm</strong>
              </div>
              <div className={styles.parentRankerRows}>
                {(rankingItems.length ? rankingItems : [{ id: 'empty', name: profile.name, rank: 1, xp: 0, accuracy: 0, tier: 'gold' }]).map(item => (
                  <div
                    key={item.id}
                    className={`${styles.parentRankerRow} ${item.id === currentRank?.id ? styles.parentRankerCurrent : ''}`}
                    data-tier={item.tier}
                  >
                    <span>#{item.rank}</span>
                    <strong>{item.name}</strong>
                    <small>{item.xp || 0} XP · {item.accuracy || 0}% đúng · {item.streak || 0} streak</small>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.parentActionRail} aria-label="Hành động nhanh cho phụ huynh">
              {[
                {
                  href: `/learning/${profile.gradeSlug}/map`,
                  icon: 'route',
                  title: 'Xem bản đồ',
                  sub: `Theo dõi chặng tiếp theo của ${profile.name}`,
                  tone: 'blue',
                },
                {
                  href: '/parent-dashboard/reports',
                  icon: 'analytics',
                  title: 'Báo cáo chi tiết',
                  sub: `${recentActivities.length} hoạt động gần đây`,
                  tone: 'green',
                },
                {
                  href: `/learning/${profile.gradeSlug}/achievements`,
                  icon: 'workspace_premium',
                  title: 'Huy hiệu & thưởng',
                  sub: latestBadge ? latestBadge.name : 'Chưa có huy hiệu mới',
                  tone: 'gold',
                },
              ].map(item => (
                <Link key={item.title} href={item.href} className={styles.parentActionCard} data-tone={item.tone}>
                  <span className={styles.parentActionIcon}>
                    <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                  </span>
                  <span className={styles.parentActionCopy}>
                    <strong>{item.title}</strong>
                    <small>{item.sub}</small>
                  </span>
                  <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                </Link>
              ))}
            </section>

            {/* METRIC CARDS - Dữ liệu thật */}
            <section id="metrics" className={styles.metricGrid}>
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
              <section id="activity" className={styles.activitySection}>
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
        <a href="#child-now" className={styles.mobileNavItem}>
          <span className="material-symbols-outlined">visibility</span>
          <span>Đang học</span>
        </a>
        <a href="#ranker" className={styles.mobileNavItem}>
          <span className="material-symbols-outlined">leaderboard</span>
          <span>Rank</span>
        </a>
        {profile ? (
          <Link href={`/learning/${profile.gradeSlug}`} className={styles.mobileNavItem}>
            <span className="material-symbols-outlined">school</span>
            <span>Con</span>
          </Link>
        ) : (
          <Link href="/add-profile" className={styles.mobileNavItem}>
            <span className="material-symbols-outlined">person_add</span>
            <span>Thêm</span>
          </Link>
        )}
      </nav>
    </div>
  )
}

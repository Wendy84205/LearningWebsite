'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

function MaterialIcon({ children, className = '', filled = false, style }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}),
        ...style,
      }}
    >
      {children}
    </span>
  )
}

function CustomIcon({ icon, className = '' }) {
  if (!icon) return null
  const isEmoji = /[\uD800-\uDFFF\u2600-\u27BF]/.test(icon)
  if (isEmoji) {
    const emojiMap = {
      '✍️': 'edit',
      '🧮': 'calculate',
      '🎵': 'music_note',
      '⭐': 'star',
      '🔥': 'local_fire_department',
      '🏆': 'trophy',
      '🎯': 'ads_click',
      '🗺️': 'map',
      '💡': 'lightbulb',
      '📚': 'menu_book',
      '🧩': 'extension',
      '🗣️': 'record_voice_over',
      '🎧': 'hearing',
      '🔊': 'volume_up',
    }
    const mapped = emojiMap[icon] || emojiMap[icon.trim()]
    if (mapped) {
      return <MaterialIcon className={className}>{mapped}</MaterialIcon>
    }
    return <span style={{ fontSize: '1.4rem' }}>{icon}</span>
  }
  return <MaterialIcon className={className}>{icon}</MaterialIcon>
}

function ProfileAvatar({ avatar, className = '' }) {
  const value = avatar || '🙂'
  const isImage = typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))

  if (isImage) {
    return <img src={value} alt="" className={className} />
  }

  return <span className={className}>{value}</span>
}

function formatGradeLabel(grade) {
  if (!grade) return 'lớp hiện tại'
  const normalized = String(grade).toLowerCase()
  const labels = {
    'nha-tre': 'Nhà trẻ',
    'mam-non': 'Mầm non',
    'lop-1': 'Lớp 1',
    'lop-2': 'Lớp 2',
    'lop-3': 'Lớp 3',
    'lop-4': 'Lớp 4',
    'lop-5': 'Lớp 5',
  }
  return labels[normalized] || grade
}

// Danh sách gợi ý tổng quát của chuyên gia
const GENERAL_RECS = [
  {
    icon: 'edit',
    title: 'Luyện viết chữ đều đẹp',
    desc: 'Hướng dẫn bé cầm bút đúng cách và tập viết theo dòng kẻ ô ly. Bắt đầu từ nét cơ bản rồi sang chữ cái đơn.',
    level: 'Tiếng Việt',
    color: '#fef9c3',
    textColor: '#5c4a00'
  },
  {
    icon: 'calculate',
    title: 'Nhận biết hình học cơ bản',
    desc: 'Chỉ cho bé thấy hình vuông, hình tròn, hình tam giác trong cuộc sống hằng ngày (cửa sổ, bánh xe, biển báo...).',
    level: 'Toán học',
    color: '#d0e4ff',
    textColor: '#005da7'
  },
  {
    icon: 'music_note',
    title: 'Học qua bài hát thiếu nhi',
    desc: 'Các bài hát về số đếm, con vật, màu sắc giúp bé ghi nhớ từ vựng một cách tự nhiên và vui vẻ.',
    level: 'Bổ trợ',
    color: '#ede9fe',
    textColor: '#5b21b6'
  }
]

export default function ParentDashboardPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard')
        if (res.status === 401) {
          router.push('/parent-login')
          return
        }
        if (!res.ok) {
          throw new Error('Không thể tải dữ liệu báo cáo.')
        }

        const data = await res.json()
        const profileList = data.profiles || []

        setParentEmail(data.parentEmail || '')
        if (data.parentEmail) {
          localStorage.setItem('parentEmail', data.parentEmail)
        }
        setProfiles(profileList)
        setSelected(profileList[0] || null)
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError(err.message || 'Không thể tải dữ liệu báo cáo.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  const selectProfile = (p) => {
    setSelected(p)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.clear()
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
      router.push('/')
    }
  }

  const summary = selected?.summary || {
    stars: 0,
    streak: 0,
    medalCount: 0,
    totalMedals: 0,
    normalLevelsCompleted: 0,
    totalNormalLevels: 0,
    progressPct: 0,
  }
  const worldProgress = selected?.worldProgress || []
  const activeFocusRec = selected?.focusRecommendation
  const selectedGradeLabel = formatGradeLabel(selected?.grade)
  const activityStats = selected?.activityStats || {}
  const recentActivities = selected?.recentActivities || []
  const weakSkills = selected?.weakSkills || []
  const badges = selected?.badges || []
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!selected?.id) return
    fetch(`/api/notifications?profileId=${selected.id}`)
      .then(res => res.ok ? res.json() : { notifications: [] })
      .then(data => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))
  }, [selected?.id])

  return (
    <div className={styles.page}>
      <aside className={styles.stitchSidebar}>
        <div className={styles.sidebarBrand}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#58cc02' }}>school</span>
          <h1>Học Vui</h1>
        </div>
        <nav className={styles.sidebarNav}>
          {[
            { id: 'overview', label: 'Tổng quan', icon: 'dashboard' },
            { id: 'progress', label: 'Tiến độ', icon: 'analytics' },
            { id: 'notifications', label: 'Thông báo', icon: 'notifications' },
            { id: 'settings', label: 'Cài đặt', icon: 'settings' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.sidebarLink} ${activeView === tab.id ? styles.sidebarLinkActive : ''}`}
              onClick={() => setActiveView(tab.id)}
            >
              <MaterialIcon filled={activeView === tab.id}>{tab.icon}</MaterialIcon>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarUserCard}>
            <p style={{ fontWeight: 800, fontSize: 14 }}>{parentEmail || 'Phụ huynh'}</p>
            <p style={{ fontSize: 12, color: '#777', fontWeight: 700 }}>Theo dõi {profiles.length} bé</p>
          </div>
        </div>
      </aside>

      <div className={styles.mainShell}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/" id="btn-back-dash" className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className={styles.title}>Báo cáo học tập</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span className={styles.email}>
            <span className="material-symbols-outlined">account_circle</span>
            {parentEmail}
          </span>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            <MaterialIcon style={{ fontSize: '18px' }}>logout</MaterialIcon>
            Đăng xuất
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Đang tải dữ liệu báo cáo...</div>
        ) : error ? (
          <div className={styles.empty}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--error)' }}>error</span>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{error}</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className={styles.empty}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)' }}>person_add</span>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Chưa có hồ sơ của bé.</p>
            <Link href="/add-profile" className="btn btn-primary">+ Thêm hồ sơ cho bé</Link>
          </div>
        ) : (
          <>
            {/* Profile Selector */}
            <div className={styles.profileRow}>
              {profiles.map(p => (
                <button
                  type="button"
                  key={p.id}
                  id={`profile-tab-${p.id}`}
                  className={`${styles.profileTab} ${selected?.id === p.id ? styles.profileTabActive : ''}`}
                  onClick={() => selectProfile(p)}
                >
                  <ProfileAvatar avatar={p.avatar} className={styles.profileAvatar} />
                  <span>{p.name}</span>
                </button>
              ))}
              <Link href="/add-profile" className={styles.addBabyBtn}>
                <MaterialIcon>add</MaterialIcon>
                Thêm bé
              </Link>
            </div>

            <div className={styles.viewTabs} style={{ display: 'none' }}>
              {[
                { id: 'overview', label: 'Tổng quan', icon: 'dashboard' },
                { id: 'progress', label: 'Tiến độ', icon: 'trending_up' },
                { id: 'notifications', label: 'Thông báo', icon: 'notifications' },
                { id: 'settings', label: 'Cài đặt', icon: 'settings' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.viewTab} ${activeView === tab.id ? styles.viewTabActive : ''}`}
                  onClick={() => setActiveView(tab.id)}
                >
                  <MaterialIcon>{tab.icon}</MaterialIcon>
                  {tab.label}
                </button>
              ))}
            </div>

            {selected && activeView === 'settings' && (
              <section className={styles.settingsPanel}>
                <h2 className={styles.sectionTitle}><MaterialIcon>settings</MaterialIcon> Cài đặt phụ huynh</h2>
                <div className={styles.settingsCard}>
                  <p><strong>Email:</strong> {parentEmail}</p>
                  <p><strong>Hồ sơ con:</strong> {profiles.length} bé</p>
                  <Link href="/add-profile" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>Quản lý hồ sơ con</Link>
                  <Link href="/profile-select" className="btn btn-secondary" style={{ marginTop: 8, display: 'inline-block', marginLeft: 8 }}>Chọn bé chơi</Link>
                </div>
              </section>
            )}

            {selected && activeView === 'notifications' && (
              <section className={styles.settingsPanel}>
                <h2 className={styles.sectionTitle}><MaterialIcon>notifications</MaterialIcon> Thông báo</h2>
                {notifications.length === 0 ? (
                  <div className={styles.emptyActivity}>Chưa có thông báo mới.</div>
                ) : (
                  <div className={styles.activityList}>
                    {notifications.map(item => (
                      <div key={item.id} className={styles.activityItem}>
                        <span className={styles.activityKind}>
                          <MaterialIcon>{item.type === 'badge' ? 'emoji_events' : item.type === 'alert' ? 'warning' : 'info'}</MaterialIcon>
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.body}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {selected && activeView === 'progress' && (
              <section className={styles.settingsPanel}>
                <h2 className={styles.sectionTitle}><MaterialIcon>trending_up</MaterialIcon> Tiến độ chi tiết</h2>
                <div className={styles.learningReportGrid}>
                  <div className={styles.reportCard}>
                    <span className={styles.reportIcon}><MaterialIcon>bolt</MaterialIcon></span>
                    <div><span>XP</span><strong>{activityStats.totalXp || 0}</strong></div>
                  </div>
                  <div className={styles.reportCard}>
                    <span className={styles.reportIcon}><MaterialIcon>sports_esports</MaterialIcon></span>
                    <div><span>Game</span><strong>{activityStats.completedGames || 0}</strong></div>
                  </div>
                  <div className={styles.reportCard}>
                    <span className={styles.reportIcon}><MaterialIcon>assignment</MaterialIcon></span>
                    <div><span>Kiểm tra</span><strong>{activityStats.completedTests || 0}</strong></div>
                  </div>
                </div>
                <div className={styles.worldsGrid} style={{ marginTop: 20 }}>
                  {worldProgress.map(world => (
                    <div key={world.id} className={styles.worldProgressCard}>
                      <strong>{world.name}</strong>
                      <small>{world.completedLevelsCount}/{world.totalLevelsCount} ải · {world.pct}%</small>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {selected && activeView === 'overview' && (
              <>
                <section className={styles.stitchHero}>
                  <h2>Chào phụ huynh {selected.name} 👋</h2>
                  <p>Hôm nay bé đạt <em>{summary.progressPct}%</em> mục tiêu học tập</p>
                </section>
                <section className={styles.gamifiedMetricGrid}>
                  <div className={styles.gamifiedMetricCard} style={{ borderBottomColor: '#1cb0f6' }}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(28,176,246,0.1)', color: '#1cb0f6' }}>
                      <MaterialIcon filled>bolt</MaterialIcon>
                    </div>
                    <strong style={{ color: '#1cb0f6' }}>{activityStats.totalXp || 0}</strong>
                    <span>XP tích lũy</span>
                  </div>
                  <div className={styles.gamifiedMetricCard} style={{ borderBottomColor: '#ffc800' }}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(255,200,0,0.15)', color: '#ffc800' }}>
                      <MaterialIcon filled>local_fire_department</MaterialIcon>
                    </div>
                    <strong style={{ color: '#ffc800' }}>{summary.streak} ngày</strong>
                    <span>Streak hiện tại</span>
                  </div>
                  <div className={styles.gamifiedMetricCard} style={{ borderBottomColor: '#58cc02' }}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(88,204,2,0.1)', color: '#58cc02' }}>
                      <MaterialIcon filled>military_tech</MaterialIcon>
                    </div>
                    <strong style={{ color: '#58cc02' }}>Cấp {activityStats.level?.level || 1}</strong>
                    <span>Level hiện tại</span>
                  </div>
                  <div className={styles.gamifiedMetricCard} style={{ borderBottomColor: '#ff4b4b' }}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(255,75,75,0.1)', color: '#ff4b4b' }}>
                      <MaterialIcon filled>analytics</MaterialIcon>
                    </div>
                    <strong style={{ color: '#ff4b4b' }}>{activityStats.averageScore || 0}%</strong>
                    <span>Điểm trung bình</span>
                  </div>
                </section>
              </>
            )}

            {selected && activeView === 'overview' && (
              <div className={styles.dashboard}>
                <section className={styles.parentHero}>
                  <div className={styles.parentHeroMain}>
                    <div className={styles.parentHeroAvatar}>
                      <ProfileAvatar avatar={selected.avatar} className={styles.parentHeroAvatarVisual} />
                    </div>
                    <div className={styles.parentHeroCopy}>
                      <span className={styles.parentHeroEyebrow}>Hồ sơ đang xem</span>
                      <h2>{selected.name}</h2>
                      <p>
                        Bé đã hoàn thành <strong>{summary.normalLevelsCompleted}</strong> ải thường,
                        tích lũy <strong>{summary.stars}</strong> sao và duy trì chuỗi <strong>{summary.streak}</strong> ngày học.
                      </p>
                    </div>
                  </div>
                  <div className={styles.parentHeroProgress}>
                    <span className={styles.parentHeroPct}>{summary.progressPct}%</span>
                    <div className={styles.parentHeroTrack}>
                      <div className={styles.parentHeroFill} style={{ width: `${summary.progressPct}%` }} />
                    </div>
                    <span className={styles.parentHeroNote}>
                      {activeFocusRec ? `Nên ưu tiên: ${activeFocusRec.subject}` : 'Chưa có gợi ý trọng tâm'}
                    </span>
                  </div>
                </section>

                {/* Summary Grid Cards */}
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                      <MaterialIcon filled style={{ color: '#ffb953', fontSize: '32px' }}>star</MaterialIcon>
                    </div>
                    <div className={styles.summaryVal}>{summary.stars}</div>
                    <div className={styles.summaryLabel}>Tổng số sao</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                      <MaterialIcon filled style={{ color: '#ff6f00', fontSize: '32px' }}>local_fire_department</MaterialIcon>
                    </div>
                    <div className={styles.summaryVal}>{summary.streak}</div>
                    <div className={styles.summaryLabel}>Ngày học chuỗi</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                      <MaterialIcon filled style={{ color: '#ffc800', fontSize: '32px' }}>trophy</MaterialIcon>
                    </div>
                    <div className={styles.summaryVal}>{summary.medalCount}/{summary.totalMedals}</div>
                    <div className={styles.summaryLabel}>Huy chương World</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                      <MaterialIcon filled style={{ color: '#ef4444', fontSize: '32px' }}>ads_click</MaterialIcon>
                    </div>
                    <div className={styles.summaryVal}>{summary.normalLevelsCompleted}/{summary.totalNormalLevels}</div>
                    <div className={styles.summaryLabel}>Ải thường vượt qua</div>
                  </div>
                </div>

                <div className={styles.learningReportGrid}>
                  <div className={styles.reportCard}>
                    <span className={styles.reportIcon}><MaterialIcon>bolt</MaterialIcon></span>
                    <div>
                      <span>XP tích lũy</span>
                      <strong>{activityStats.totalXp || 0}</strong>
                    </div>
                  </div>
                  <div className={styles.reportCard}>
                    <span className={styles.reportIcon}><MaterialIcon>analytics</MaterialIcon></span>
                    <div>
                      <span>Điểm trung bình</span>
                      <strong>{activityStats.averageScore || 0}%</strong>
                    </div>
                  </div>
                  <div className={styles.reportCard}>
                    <span className={styles.reportIcon}><MaterialIcon>history_edu</MaterialIcon></span>
                    <div>
                      <span>Lượt học đã lưu</span>
                      <strong>{activityStats.totalAttempts || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Overall Progress Section */}
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span>Tiến độ tổng thể {selectedGradeLabel}</span>
                    <span className={styles.progressPct}>{summary.progressPct}%</span>
                  </div>
                  <div className="progress-track" style={{ height: '14px', backgroundColor: '#eceff1', borderRadius: '10px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ width: `${summary.progressPct}%`, height: '100%', backgroundColor: 'var(--primary, #0060ac)', borderRadius: '10px' }} />
                  </div>
                  <div className={styles.levelInfo}>
                    Bé đã hoàn thành <strong>{summary.normalLevelsCompleted}</strong> trên tổng số <strong>{summary.totalNormalLevels}</strong> ải thường của chương trình {selectedGradeLabel}.
                  </div>
                </div>

                {/* Detailed Worlds Progress Section */}
                <div className={styles.worldsSection}>
                  <h2 className={styles.sectionTitle}>
                    <MaterialIcon style={{ marginRight: '8px', verticalAlign: 'middle' }}>map</MaterialIcon>
                    Chi tiết tiến trình thế giới học tập
                  </h2>
                  <div className={styles.worldsGrid}>
                    {worldProgress.map(world => (
                      <div key={world.id} className={styles.worldProgressCard}>
                        <div className={styles.worldProgressLeft}>
                          <div className={styles.worldProgressTitleRow}>
                            <span className={styles.worldCardIcon}><CustomIcon icon={world.icon} /></span>
                            <span className={styles.worldCardName}>{world.name}</span>
                          </div>
                          <div className={styles.worldProgressBarContainer}>
                            <div className={styles.miniProgressTrack}>
                              <div
                                className={styles.miniProgressFill}
                                style={{
                                  width: `${world.pct}%`,
                                  backgroundColor: world.borderColor
                                }}
                              />
                            </div>
                            <span className={styles.worldCardProgressText}>
                              {world.completedLevelsCount}/{world.totalLevelsCount} Ải ({world.pct}%)
                            </span>
                          </div>
                        </div>
                        <div className={styles.worldProgressRight}>
                          {world.bossCompleted ? (
                            <span className={styles.worldCardMedal}>{world.medal}</span>
                          ) : (
                            <span className={styles.worldCardMedalLocked}><MaterialIcon>lock</MaterialIcon></span>
                          )}
                          <span className={`${styles.medalLabel} ${world.bossCompleted ? styles.medalLabelCompleted : ''}`}>
                            {world.bossCompleted ? world.medalName : 'Chưa đạt'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.activitySection}>
                  <div className={styles.activityColumn}>
                    <h2 className={styles.sectionTitle}>
                      <MaterialIcon style={{ marginRight: '8px', verticalAlign: 'middle' }}>timeline</MaterialIcon>
                      Lịch sử học tập gần đây
                    </h2>
                    {recentActivities.length === 0 ? (
                      <div className={styles.emptyActivity}>Chưa có lượt làm bài/game nào được lưu.</div>
                    ) : (
                      <div className={styles.activityList}>
                        {recentActivities.slice(0, 6).map(item => (
                          <div key={item.id} className={styles.activityItem}>
                            <span className={styles.activityKind}>
                              <MaterialIcon>{item.activityType === 'test' ? 'assignment' : item.activityType === 'review' ? 'psychology' : 'sports_esports'}</MaterialIcon>
                            </span>
                            <div>
                              <strong>{item.title}</strong>
                              <small>{item.correct}/{item.total} đúng · {item.scorePct}% · +{item.xp} XP</small>
                            </div>
                            <b>{item.stars}★</b>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.activityColumn}>
                    <h2 className={styles.sectionTitle}>
                      <MaterialIcon style={{ marginRight: '8px', verticalAlign: 'middle' }}>psychology</MaterialIcon>
                      Kỹ năng cần luyện
                    </h2>
                    {weakSkills.length === 0 ? (
                      <div className={styles.emptyActivity}>Chưa đủ dữ liệu lỗi sai để gợi ý kỹ năng yếu.</div>
                    ) : (
                      <div className={styles.skillList}>
                        {weakSkills.slice(0, 5).map(skill => (
                          <div key={skill.skill} className={styles.skillItem}>
                            <div>
                              <strong>{skill.skill}</strong>
                              <small>{skill.correct}/{skill.total} câu đúng</small>
                            </div>
                            <span>{skill.accuracy}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stitch Achievement Banner */}
                {badges.length > 0 && (
                  <section style={{
                    background: '#1cb0f6',
                    borderRadius: '24px',
                    border: 'none',
                    borderBottom: '8px solid #1899d6',
                    padding: '32px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                      <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '8px', fontStyle: 'italic' }}>
                        Thành tích mới của {selected.name}! 🏆
                      </h2>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                        {selected.name} vừa đạt huy hiệu “{badges[badges.length - 1]?.name}” sau khi hoàn thành {summary.normalLevelsCompleted} bài học.
                      </p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button style={{
                          padding: '12px 28px',
                          background: '#ffc800',
                          color: '#4b4b4b',
                          borderRadius: '16px',
                          fontWeight: 900,
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          border: 'none',
                          boxShadow: '0 4px 0 0 #cc9a00',
                          cursor: 'pointer',
                        }}>Khen ngợi ngay</button>
                        <button style={{
                          padding: '12px 28px',
                          background: 'rgba(255,255,255,0.2)',
                          color: '#fff',
                          borderRadius: '16px',
                          fontWeight: 900,
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          border: '2px solid rgba(255,255,255,0.3)',
                          cursor: 'pointer',
                        }}>Xem chi tiết</button>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '9999px',
                        border: '4px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: '#ffc800',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Stitch Bar Chart: hình thức Thời gian học tập */}
                <section style={{
                  background: '#fff',
                  border: '2px solid #e5e5e5',
                  borderBottom: '4px solid #e5e5e5',
                  borderRadius: '20px',
                  padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#4b4b4b' }}>Thời gian học tập</h3>
                    <span style={{
                      background: '#ebebeb',
                      border: '2px solid #d0d0d0',
                      borderRadius: '12px',
                      padding: '4px 12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#777',
                    }}>7 ngày gần nhất</span>
                  </div>
                  <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '0 8px',
                  }}>
                    {[{ label: 'T2', h: 40 }, { label: 'T3', h: 65 }, { label: 'T4', h: 50 }, { label: 'T5', h: 85 }, { label: 'T6', h: 30 }, { label: 'T7', h: 95 }, { label: 'CN', h: 45 }].map((day, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '100%',
                          height: `${day.h * 1.8}px`,
                          background: i === 6 ? '#58cc02' : '#ebebeb',
                          borderRadius: '6px 6px 0 0',
                          position: 'relative',
                          overflow: 'hidden',
                        }}>
                          {i !== 6 && (
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              width: '100%',
                              height: '75%',
                              background: '#58cc02',
                              borderRadius: '4px 4px 0 0',
                            }} />
                          )}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: i === 6 ? '#58cc02' : '#777' }}>{day.label}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dynamic Recommendations */}
                <div className={styles.recsSection}>
                  <h2 className={styles.recsTitle}>
                    <MaterialIcon style={{ marginRight: '8px', verticalAlign: 'middle' }}>lightbulb</MaterialIcon>
                    Khuyên dùng & Gợi ý từ chuyên gia
                  </h2>

                  {/* Hộp gợi ý tiêu điểm động */}
                  {activeFocusRec && (
                    <div className={styles.focusRecBox}>
                      <div className={styles.focusRecIcon}><CustomIcon icon={activeFocusRec.icon} /></div>
                      <div className={styles.focusRecBody}>
                        <div className={styles.focusRecBadge}>Khuyên dùng rèn luyện: {activeFocusRec.subject}</div>
                        <div className={styles.focusRecTitle}>{activeFocusRec.title}</div>
                        <div className={styles.focusRecDesc}>{activeFocusRec.desc}</div>
                      </div>
                    </div>
                  )}

                  {/* Thư viện gợi ý tổng quát */}
                  <div className={styles.recsGrid}>
                    {GENERAL_RECS.map((r, i) => (
                      <div key={i} className={styles.recCard} style={{
                        borderLeft: `4px solid ${r.textColor || 'var(--primary)'}`
                      }}>
                        <div className={styles.recIcon}><CustomIcon icon={r.icon} /></div>
                        <div className={styles.recBody}>
                          <div className={styles.recTitle}>{r.title}</div>
                          <div className={styles.recDesc}>{r.desc}</div>
                        </div>
                        <div style={{
                          background: r.color || 'var(--primary-container)',
                          color: r.textColor || 'var(--primary)',
                          borderRadius: '999px',
                          padding: '3px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          {r.level}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  )
}

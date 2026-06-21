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

  return (
    <div className={styles.page}>
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

            {selected && (
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
  )
}

'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getGradeData } from '@/lib/data'
import styles from './page.module.css'

const DEFAULT_PROFILE = { name: 'Học sinh', avatar: '/avatar-default.png' }
const DEFAULT_MASCOT = {
  name: 'Tin Tin',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvdz9atv7ARpvqQLQcBC-nUsmg4xE1NcZ9EKHi3pdIpmzdujb3-kikQVWw4tBLFITAzvANKzSCe0NlqVat2TRwlp6b-mJ-xBvzm4dKeJu-iELiFhzLYcLVoc7tbcEnuOYszTSiVWsW52WX4Q6bGRJExXAohb4mGeMLqcMoGkZiVBx6oTpGwqt3df4aSWNCGMPeZoHyyNOV2MOdWRNrPPnUjKV1hlqrBOpRSOeDSq5vB3tuxPfqXjIUthHfISQ-a0F_O2u4jo6AHeA'
}
const DEFAULT_PROGRESS = { stars: 0, streak: 0, currentLevel: 1, completedLevels: '' }
const DEFAULT_SUMMARY = { normalLevelsCompleted: 0, completedLevels: [] }

function getNextPracticeForWorlds(worldIds, completedLevels, worldsList, gradeSlug) {
  const completed = new Set(completedLevels || [])

  for (const worldId of worldIds) {
    const world = worldsList.find(item => item.id === worldId)
    if (!world) continue

    const nextLevel = world.levels.find(level => !completed.has(`w${world.id}-l${level.id}`))
    if (nextLevel) {
      return {
        href: `${nextLevel.game}&grade=${gradeSlug}`,
        title: nextLevel.title,
        worldName: world.name,
      }
    }

    if (!completed.has(`w${world.id}-boss`)) {
      return {
        href: `${world.bossGame}&grade=${gradeSlug}`,
        title: world.bossName,
        worldName: world.name,
      }
    }
  }

  const firstWorld = worldsList.find(item => item.id === worldIds[0])
  const firstLevel = firstWorld?.levels[0]

  return {
    href: firstLevel ? `${firstLevel.game}&grade=${gradeSlug}` : `/learning/${gradeSlug}/map`,
    title: 'Ôn tập lại',
    worldName: firstWorld?.name || 'Bản đồ học tập',
  }
}

export default function GradeLandingPage() {
  const router = useRouter()
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'

  const { WORLDS: STATIC_WORLDS } = getGradeData(gradeSlug)

  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [mascot, setMascot] = useState(DEFAULT_MASCOT)
  const [progress, setProgress] = useState(DEFAULT_PROGRESS)
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)
  const [worlds, setWorlds] = useState(STATIC_WORLDS)
  const [studentDashboard, setStudentDashboard] = useState(null)
  const [time, setTime] = useState(new Date())

  const greeting = useMemo(() => {
    const hour = time.getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }, [time])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (_) {}
    localStorage.clear()
    router.push('/')
  }, [router])

  const loadLandingData = useCallback(async () => {
    try {
      const [dashboardRes, cmsRes] = await Promise.all([
        fetch('/api/dashboard', { cache: 'no-store' }),
        fetch(`/api/cms?module=learning-map&grade=${gradeSlug}`, { cache: 'no-store' })
      ])
      const res = dashboardRes
      if (res.status === 401) {
        router.push('/parent-login')
        return
      }
      if (!res.ok) {
        throw new Error('Không thể tải dữ liệu trang chủ.')
      }

      const data = await res.json()
      if (cmsRes.ok) {
        const cmsData = await cmsRes.json()
        if (Array.isArray(cmsData.worlds) && cmsData.worlds.length > 0) {
          setWorlds(cmsData.worlds)
        }
      }
      const profileId = localStorage.getItem('profileId')
      const activeProfile = data.profiles?.find(item => item.id === profileId) || data.profiles?.[0]

      if (!activeProfile) {
        router.push('/add-profile')
        return
      }

      setProfile({
        name: activeProfile.name || DEFAULT_PROFILE.name,
        avatar: activeProfile.avatar || DEFAULT_PROFILE.avatar,
      })
      setMascot({
        name: activeProfile.mascotName || DEFAULT_MASCOT.name,
        image: activeProfile.mascotImage || DEFAULT_MASCOT.image,
      })
      setProgress(activeProfile.progress || DEFAULT_PROGRESS)
      setSummary(activeProfile.summary || DEFAULT_SUMMARY)

      localStorage.setItem('profileId', activeProfile.id)
      localStorage.setItem('profileName', activeProfile.name || DEFAULT_PROFILE.name)
      localStorage.setItem('mascotName', activeProfile.mascotName || DEFAULT_MASCOT.name)
      localStorage.setItem('mascotEmoji', activeProfile.mascotImage || DEFAULT_MASCOT.image)
      localStorage.setItem('gradeSlug', gradeSlug)

      const studentRes = await fetch(`/api/student/dashboard?profileId=${activeProfile.id}&grade=${gradeSlug}`, { cache: 'no-store' })
      if (studentRes.ok) {
        const studentData = await studentRes.json()
        setStudentDashboard(studentData)
      }
    } catch (err) {
      console.error('Error fetching landing data:', err)
    }
  }, [router, gradeSlug])

  useEffect(() => {
    const loadTimerId = setTimeout(() => {
      loadLandingData()
    }, 0)

    const intervalId = setInterval(() => setTime(new Date()), 60000)
    return () => {
      clearTimeout(loadTimerId)
      clearInterval(intervalId)
    }
  }, [loadLandingData])

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        loadLandingData()
      }
    }

    window.addEventListener('focus', loadLandingData)
    window.addEventListener('pageshow', loadLandingData)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      window.removeEventListener('focus', loadLandingData)
      window.removeEventListener('pageshow', loadLandingData)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [loadLandingData])

  const handleMascotSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = `Xin chào ${profile.name}! Mình là ${mascot.name}. Hôm nay chúng ta cùng nhau khám phá thêm nhiều điều thú vị và tích lũy thật nhiều sao nhé!`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      window.speechSynthesis.speak(utterance)
    }
  }

  const completedCount = summary.normalLevelsCompleted ?? 0
  const activityStats = studentDashboard?.activityStats
  const levelInfo = activityStats?.level || { level: 1, xp: 0, progressPct: 0, nextLevelXp: 80 }
  const recentActivities = activityStats?.attempts || []
  const weakSkills = activityStats?.weakSkills || []
  const missions = studentDashboard?.missions
  const quickPractices = useMemo(() => {
    const completedLevels = summary.completedLevels || []

    // Lấy các thế giới có sẵn tùy theo cấu hình lớp
    const worldIds = worlds.map(w => w.id)
    const mathWorldIds = worlds.filter(w => w.name.includes('Toán') || w.name.includes('Số')).map(w => w.id)
    const languageWorldIds = worlds.filter(w => w.name.includes('Chữ') || w.name.includes('Tiếng')).map(w => w.id)
    const otherWorldIds = worlds.filter(w => !mathWorldIds.includes(w.id) && !languageWorldIds.includes(w.id)).map(w => w.id)

    return {
      math: getNextPracticeForWorlds(mathWorldIds.length > 0 ? mathWorldIds : worldIds, completedLevels, worlds, gradeSlug),
      vietnamese: getNextPracticeForWorlds(languageWorldIds.length > 0 ? languageWorldIds : worldIds, completedLevels, worlds, gradeSlug),
      matching: getNextPracticeForWorlds(otherWorldIds.length > 0 ? otherWorldIds : worldIds, completedLevels, worlds, gradeSlug),
    }
  }, [summary.completedLevels, worlds, gradeSlug])

  const isMascotEmoji = mascot.image && !mascot.image.startsWith('http') && !mascot.image.startsWith('/')

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.greeting}>
          <span className={styles.greetingText}>
            {greeting}, <strong>{profile.name}</strong>!
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginLeft: '6px', color: '#ffb953' }}>waving_hand</span>
          </span>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statChip}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--primary)', fontSize: '18px' }}>star</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{levelInfo.xp} XP</span>
          </div>
          <div className={styles.statChip}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#ffc800', fontSize: '18px' }}>monetization_on</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{progress.stars}</span>
          </div>
          <div className={styles.statChip}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#ff4b4b', fontSize: '18px' }}>local_fire_department</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{progress.streak} ngày</span>
          </div>
          <Link href="/parent-dashboard" id="btn-parent-dash" className={styles.parentDashBtn} title="Báo cáo phụ huynh">
            <span className="material-symbols-outlined">monitoring</span>
          </Link>
          <button type="button" onClick={handleLogout} className={styles.parentDashBtn} title="Đăng xuất" id="btn-logout">
            <span className="material-symbols-outlined" style={{ color: 'var(--error, #ba1a1a)' }}>logout</span>
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav}>
            <Link href={`/learning/${gradeSlug}`} className={`${styles.navItem} ${styles.navItemActive}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span>Tổng quan</span>
            </Link>
            <Link href={`/learning/${gradeSlug}/map`} className={styles.navItem}>
              <span className="material-symbols-outlined">map</span>
              <span>Lộ trình học</span>
            </Link>
            <Link href={`/learning/${gradeSlug}/games`} className={styles.navItem}>
              <span className="material-symbols-outlined">sports_esports</span>
              <span>Trò chơi</span>
            </Link>
            <Link href={`/learning/${gradeSlug}/test?mode=test`} className={styles.navItem}>
              <span className="material-symbols-outlined">assignment</span>
              <span>Kiểm tra</span>
            </Link>
            <Link href={`/learning/${gradeSlug}/achievements`} className={styles.navItem}>
              <span className="material-symbols-outlined">emoji_events</span>
              <span>Thành tích</span>
            </Link>
            <Link href={`/learning/${gradeSlug}/report`} className={styles.navItem}>
              <span className="material-symbols-outlined">assessment</span>
              <span>Báo cáo</span>
            </Link>
            <Link href="/kids-closet" className={styles.navItem}>
              <span className="material-symbols-outlined">styler</span>
              <span>Tủ đồ của bé</span>
            </Link>
          </nav>
          <div className={styles.sideProfile}>
            <div className={styles.sideAvatar}>
              {isMascotEmoji ? (
                <span style={{ fontSize: 22 }}>{mascot.image}</span>
              ) : (
                <img src={mascot.image} alt={mascot.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              )}
            </div>
            <div>
              <p className={styles.sideProfileName}>{profile.name}</p>
              <p className={styles.sideProfileSub}>Cùng {mascot.name}</p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.content}>
          {/* HERO BENTO */}
          <section className={styles.heroGrid}>
            <div className={styles.heroCard}>
              <div className={styles.heroDecoBg} />
              <div className={styles.heroBadge}>Tiếp tục hành trình</div>
              <div className={styles.heroInner}>
                <div className={styles.heroMascot} onClick={handleMascotSpeech} style={{ cursor: 'pointer' }}>
                  <div className={styles.mascotGlow} />
                  {isMascotEmoji ? (
                    <span style={{ fontSize: 80 }}>{mascot.image}</span>
                  ) : (
                    <img src={mascot.image} className={styles.mascotImg} alt={mascot.name} />
                  )}
                </div>
                <div className={styles.heroText}>
                  <div className={styles.speechBubble}>
                    <p>&quot;Chào {profile.name}! Hôm nay chúng ta còn nhiều nhiệm vụ để mở khóa vùng mới!&quot;</p>
                  </div>
                  <div className={styles.heroMeta}>
                    <div className={styles.heroMetaItem}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 18 }}>public</span>
                      <span>Bản đồ học tập</span>
                    </div>
                    <div className={styles.heroDot} />
                    <div className={styles.heroMetaItem}>
                      <span className="material-symbols-outlined" style={{ color: '#58cc02', fontSize: 18 }}>trending_up</span>
                      <span>Level {levelInfo.level}</span>
                    </div>
                  </div>
                  <Link href={`/learning/${gradeSlug}/map`} id="btn-continue" className={styles.heroBtn}>
                    Tiếp tục học
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.tasksCard}>
              <div className={styles.tasksHeader}>
                <h3 className={styles.tasksTitle}>Nhiệm vụ</h3>
                <span className={styles.tasksBadge}>HÀNG NGÀY</span>
              </div>
              <div className={styles.tasksList}>
                {[
                  { label: 'Hoàn thành 1 Level Toán', xp: '+50 XP', done: true },
                  { label: 'Đọc 1 bài Tiếng Việt', xp: '+30 XP', done: true },
                  { label: 'Luyện tập Tiếng Anh', xp: '+40 XP', done: false },
                ].map((t, i) => (
                  <div key={i} className={`${styles.taskItem} ${t.done ? styles.taskDone : styles.taskPending}`}>
                    <div className={styles.taskCheck} style={{ background: t.done ? '#58cc02' : '#e5e5e5' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1", color: t.done ? '#fff' : '#aaa' }}>
                        {t.done ? 'check' : 'schedule'}
                      </span>
                    </div>
                    <div className={styles.taskInfo}>
                      <p style={{ opacity: t.done ? 1 : 0.6 }}>{t.label}</p>
                      <span style={{ color: t.done ? '#58cc02' : '#aaa', fontWeight: 700, fontSize: 12 }}>{t.xp}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.tasksFooter}>
                <div className={styles.tasksFooterIcons}>
                  <div className={styles.tasksFooterIcon} style={{ background: '#fff9e6' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#ffc800', fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  </div>
                  <div className={styles.tasksFooterIcon} style={{ background: '#e8f4ff' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#1cb0f6', fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                </div>
                <Link href={`/learning/${gradeSlug}/test?mode=daily`} className={styles.rewardBtn}>
                  <span>Nhận thưởng</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ffa500', fontVariationSettings: "'FILL' 1" }}>redeem</span>
                </Link>
              </div>
            </div>
          </section>

          {/* SUBJECT TILES */}
          <section className={styles.subjectSection}>
            <div className={styles.subjectHeader}>
              <h2 className={styles.subjectTitle}>Học kỳ này</h2>
              <Link href={`/learning/${gradeSlug}/map`} className={styles.subjectViewAll}>
                Xem tất cả <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle' }}>arrow_forward</span>
              </Link>
            </div>
            <div className={styles.subjectGrid}>
              {[
                { href: quickPractices.math.href, id: 'btn-game-1', color: '#1cb0f6', shadow: '#0090d4', icon: 'calculate', name: 'Toán học', sub: quickPractices.math.worldName, pct: completedCount > 0 ? Math.min(Math.round((completedCount / 20) * 100), 100) : 0 },
                { href: quickPractices.vietnamese.href, id: 'btn-game-2', color: '#ff4b4b', shadow: '#cc2222', icon: 'history_edu', name: 'Tiếng Việt', sub: quickPractices.vietnamese.worldName, pct: completedCount > 0 ? Math.min(Math.round((completedCount / 30) * 100), 100) : 0 },
                { href: quickPractices.matching.href, id: 'btn-game-3', color: '#58cc02', shadow: '#46a302', icon: 'translate', name: 'Tiếng Anh', sub: quickPractices.matching.worldName, pct: completedCount > 0 ? Math.min(Math.round((completedCount / 40) * 100), 100) : 0 },
                { href: `/learning/${gradeSlug}/games`, id: 'btn-game-4', color: '#fea250', shadow: '#cc7a00', icon: 'biotech', name: 'Khoa học', sub: 'Trò chơi học tập', pct: 15, label: 'Mới' },
              ].map(s => (
                <Link key={s.id} href={s.href} id={s.id} className={styles.subjectCard}>
                  <div className={styles.subjectColorBar} style={{ background: s.color }} />
                  <div className={styles.subjectCardTop}>
                    <div className={styles.subjectIconWrap} style={{ background: `${s.color}20` }}>
                      <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 28 }}>{s.icon}</span>
                    </div>
                    <span className={styles.subjectPct} style={{ color: s.color }}>{s.label || `${s.pct}%`}</span>
                  </div>
                  <div className={styles.subjectNames}>
                    <div className={styles.subjectName}>{s.name}</div>
                    <div className={styles.subjectSub}>{s.sub}</div>
                  </div>
                  <div className={styles.subjectProgressTrack}>
                    <div className={styles.subjectProgressFill} style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <div className={styles.subjectBtn} style={{ background: s.color, boxShadow: `0 4px 0 ${s.shadow}` }}>Tiếp tục</div>
                </Link>
              ))}
            </div>
          </section>

          {/* HIGHLIGHTS */}
          <section className={styles.highlightRow}>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIconWrap}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#ffa500', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <div>
                <h4 className={styles.highlightTitle}>Huy hiệu mới nhất</h4>
                <p className={styles.highlightSub}>{recentActivities.length > 0 ? `+${recentActivities[0]?.xp || 0} XP từ bài gần nhất` : 'Hoàn thành bài học để nhận huy hiệu!'}</p>
              </div>
            </div>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIconWrap}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>groups</span>
              </div>
              <div>
                <h4 className={styles.highlightTitle}>Thứ hạng tuần này</h4>
                <p className={styles.highlightSub}>{activityStats?.averageScore ? `Điểm TB: ${activityStats.averageScore}%` : 'Chơi game để lên bảng xếp hạng!'}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}


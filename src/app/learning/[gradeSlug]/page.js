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
          {/* XP */}
          <div className={styles.statChip}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--primary)', fontSize: '18px' }}>star</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{levelInfo.xp} XP</span>
          </div>
          {/* Coins */}
          <div className={styles.statChip}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#ffc800', fontSize: '18px' }}>monetization_on</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{progress.stars}</span>
          </div>
          {/* Streak */}
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

      <div className={styles.content}>
        {/* Mascot Greeting Speech */}
        <div className={styles.mascotArea} onClick={handleMascotSpeech} style={{ cursor: 'pointer' }}>
          <div className={styles.mascotBubble}>
            <span className={styles.speechText}>
              Chào {profile.name}! Hôm nay mình cùng học thật nhiều bài hay nhé!
              <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginLeft: '6px', color: '#ffb953' }}>star</span>
            </span>
          </div>
          <div className={styles.mascotFigure}>
            <div className={styles.mascotImgContainer}>
              {isMascotEmoji ? (
                <span className={styles.mascotEmoji}>{mascot.image}</span>
              ) : (
                <img
                  src={mascot.image}
                  className={styles.mascotImg}
                  alt="Robot Mascot"
                />
              )}
            </div>
            <span className={styles.mascotLabel}>{mascot.name}</span>
          </div>
        </div>

        {/* Main Learning and Closet Actions */}
        <div className={styles.mainActions}>
          <Link href={`/learning/${gradeSlug}/map`} id="btn-learning-map" className={styles.actionCard}>
            <span className={`material-symbols-outlined ${styles.actionIcon}`} style={{ color: 'var(--primary)' }}>map</span>
            <div className={styles.actionInfo}>
              <div className={styles.actionTitle}>Bản đồ học tập</div>
              <div className={styles.actionSub}>Cấp {progress.currentLevel} đang đợi bạn!</div>
            </div>
            <span className={`material-symbols-outlined ${styles.actionArrow}`}>arrow_forward</span>
          </Link>

          <Link href="/kids-closet" id="btn-closet" className={styles.actionCard}>
            <span className={`material-symbols-outlined ${styles.actionIcon}`} style={{ color: 'var(--secondary)' }}>styler</span>
            <div className={styles.actionInfo}>
              <div className={styles.actionTitle}>Tủ đồ của bé</div>
              <div className={styles.actionSub}>Đổi phụ kiện đẹp cho {mascot.name}</div>
            </div>
            <span className={`material-symbols-outlined ${styles.actionArrow}`}>arrow_forward</span>
          </Link>
        </div>

        {/* Mini Stats Card Grid */}
        <div className={styles.miniStats}>
          <div className={styles.miniStat}>
            <span className={`material-symbols-outlined ${styles.miniStatIcon}`} style={{ color: 'var(--primary)' }}>menu_book</span>
            <div className={styles.miniStatVal}>{levelInfo.level}</div>
            <div className={styles.miniStatLabel}>Level XP</div>
          </div>
          <div className={styles.miniStat}>
            <span className={`material-symbols-outlined ${styles.miniStatIcon}`} style={{ color: '#10b981' }}>check_circle</span>
            <div className={styles.miniStatVal}>{completedCount}</div>
            <div className={styles.miniStatLabel}>Đã xong</div>
          </div>
          <div className={styles.miniStat}>
            <span className={`material-symbols-outlined ${styles.miniStatIcon}`} style={{ color: '#ffb953' }}>star</span>
            <div className={styles.miniStatVal}>{levelInfo.xp}</div>
            <div className={styles.miniStatLabel}>XP đã nhận</div>
          </div>
          <div className={styles.miniStat}>
            <span className={`material-symbols-outlined ${styles.miniStatIcon}`} style={{ color: '#ff6f00' }}>local_fire_department</span>
            <div className={styles.miniStatVal}>{progress.streak}</div>
            <div className={styles.miniStatLabel}>Chuỗi ngày</div>
          </div>
        </div>

        {/* Stitch Subject Tiles */}
        <section className={styles.subjectSection}>
          <div className={styles.subjectHeader}>
            <h2 className={styles.subjectTitle}>Học kỳ này</h2>
            <Link href={`/learning/${gradeSlug}/map`} className={styles.subjectViewAll}>
              Xem tất cả <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle' }}>arrow_forward</span>
            </Link>
          </div>
          <div className={styles.subjectGrid}>
            {/* Toán */}
            <Link href={quickPractices.math.href} id="btn-game-1" className={styles.subjectCard} style={{ '--subject-color': '#1cb0f6', '--subject-bg': 'rgba(28,176,246,0.08)' }}>
              <div className={styles.subjectCardTop}>
                <div className={styles.subjectCardTopLeft} style={{ background: 'rgba(28,176,246,0.1)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#1cb0f6', fontSize: 28 }}>calculate</span>
                </div>
                <span className={styles.subjectPct} style={{ color: '#1cb0f6' }}>{completedCount > 0 ? Math.min(Math.round((completedCount / 20) * 100), 100) : 0}%</span>
              </div>
              <div>
                <div className={styles.subjectName}>Toán học</div>
                <div className={styles.subjectSub}>{quickPractices.math.worldName}</div>
              </div>
              <div className={styles.subjectProgressTrack}>
                <div className={styles.subjectProgressFill} style={{ width: `${completedCount > 0 ? Math.min(Math.round((completedCount / 20) * 100), 100) : 0}%`, background: '#1cb0f6' }} />
              </div>
              <div className={styles.subjectBtn} style={{ background: '#1cb0f6' }}>Tiếp tục</div>
            </Link>

            {/* Tiếng Việt */}
            <Link href={quickPractices.vietnamese.href} id="btn-game-2" className={styles.subjectCard} style={{ '--subject-color': '#ff4b4b', '--subject-bg': 'rgba(255,75,75,0.08)' }}>
              <div className={styles.subjectCardTop}>
                <div className={styles.subjectCardTopLeft} style={{ background: 'rgba(255,75,75,0.1)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#ff4b4b', fontSize: 28 }}>history_edu</span>
                </div>
                <span className={styles.subjectPct} style={{ color: '#ff4b4b' }}>{completedCount > 0 ? Math.min(Math.round((completedCount / 30) * 100), 100) : 0}%</span>
              </div>
              <div>
                <div className={styles.subjectName}>Tiếng Việt</div>
                <div className={styles.subjectSub}>{quickPractices.vietnamese.worldName}</div>
              </div>
              <div className={styles.subjectProgressTrack}>
                <div className={styles.subjectProgressFill} style={{ width: `${completedCount > 0 ? Math.min(Math.round((completedCount / 30) * 100), 100) : 0}%`, background: '#ff4b4b' }} />
              </div>
              <div className={styles.subjectBtn} style={{ background: '#ff4b4b' }}>Tiếp tục</div>
            </Link>

            {/* Tiếng Anh */}
            <Link href={quickPractices.matching.href} id="btn-game-3" className={styles.subjectCard} style={{ '--subject-color': '#58cc02', '--subject-bg': 'rgba(88,204,2,0.08)' }}>
              <div className={styles.subjectCardTop}>
                <div className={styles.subjectCardTopLeft} style={{ background: 'rgba(88,204,2,0.1)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#58cc02', fontSize: 28 }}>translate</span>
                </div>
                <span className={styles.subjectPct} style={{ color: '#58cc02' }}>{completedCount > 0 ? Math.min(Math.round((completedCount / 40) * 100), 100) : 0}%</span>
              </div>
              <div>
                <div className={styles.subjectName}>Tiếng Anh</div>
                <div className={styles.subjectSub}>{quickPractices.matching.worldName}</div>
              </div>
              <div className={styles.subjectProgressTrack}>
                <div className={styles.subjectProgressFill} style={{ width: `${completedCount > 0 ? Math.min(Math.round((completedCount / 40) * 100), 100) : 0}%`, background: '#58cc02' }} />
              </div>
              <div className={styles.subjectBtn} style={{ background: '#58cc02' }}>Tiếp tục</div>
            </Link>

            {/* Khoa học */}
            <Link href={`/learning/${gradeSlug}/games`} id="btn-game-4" className={styles.subjectCard} style={{ '--subject-color': '#ffa500', '--subject-bg': 'rgba(255,165,0,0.08)' }}>
              <div className={styles.subjectCardTop}>
                <div className={styles.subjectCardTopLeft} style={{ background: 'rgba(255,165,0,0.1)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#ffa500', fontSize: 28 }}>biotech</span>
                </div>
                <span className={styles.subjectPct} style={{ color: '#ffa500' }}>Mới</span>
              </div>
              <div>
                <div className={styles.subjectName}>Khoa học</div>
                <div className={styles.subjectSub}>Trò chơi học tập</div>
              </div>
              <div className={styles.subjectProgressTrack}>
                <div className={styles.subjectProgressFill} style={{ width: '15%', background: '#ffa500' }} />
              </div>
              <div className={styles.subjectBtn} style={{ background: '#ffa500' }}>Tiếp tục</div>
            </Link>
          </div>
        </section>

        <div className={styles.missionPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelEyebrow}>Học thật từ Question Bank</span>
              <h2 className={styles.quickStartTitle}>Nhiệm vụ & kiểm tra</h2>
            </div>
            <div className={styles.xpProgress}>
              <span>Level {levelInfo.level}</span>
              <div className={styles.xpTrack}>
                <div className={styles.xpFill} style={{ width: `${levelInfo.progressPct}%` }} />
              </div>
            </div>
          </div>
          <div className={styles.missionGrid}>
            <Link href={missions?.daily?.href || `/learning/${gradeSlug}/test?mode=daily`} className={styles.missionCard}>
              <span className="material-symbols-outlined">emoji_events</span>
              <strong>Nhiệm vụ hôm nay</strong>
              <small>{missions?.daily?.count || 0} câu gợi ý</small>
            </Link>
            <Link href={`/learning/${gradeSlug}/games`} className={styles.missionCard}>
              <span className="material-symbols-outlined">sports_esports</span>
              <strong>Trò chơi học tập</strong>
              <small>7 game từ Question Bank</small>
            </Link>
            <Link href={`/learning/${gradeSlug}/test?mode=test`} className={styles.missionCard}>
              <span className="material-symbols-outlined">assignment</span>
              <strong>Bài kiểm tra</strong>
              <small>Lấy câu hỏi published</small>
            </Link>
            <Link href={`/learning/${gradeSlug}/practice`} className={styles.missionCard}>
              <span className="material-symbols-outlined">fitness_center</span>
              <strong>Luyện tập</strong>
              <small>Feedback tức thì</small>
            </Link>
            <Link href={`/learning/${gradeSlug}/achievements`} className={styles.missionCard}>
              <span className="material-symbols-outlined">emoji_events</span>
              <strong>Thành tích</strong>
              <small>XP, level, badge</small>
            </Link>
            <Link href={`/learning/${gradeSlug}/report`} className={styles.missionCard}>
              <span className="material-symbols-outlined">monitoring</span>
              <strong>Báo cáo</strong>
              <small>Lịch sử & kỹ năng yếu</small>
            </Link>
            <Link href={missions?.review?.href || `/learning/${gradeSlug}/test?mode=review`} className={styles.missionCard}>
              <span className="material-symbols-outlined">psychology</span>
              <strong>Ôn tập thông minh</strong>
              <small>{weakSkills[0]?.skill ? `Cần luyện: ${weakSkills[0].skill}` : 'Dựa trên lỗi sai'}</small>
            </Link>
          </div>
        </div>

        <div className={styles.historyPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelEyebrow}>Theo dõi tiến bộ</span>
              <h2 className={styles.quickStartTitle}>Lịch sử học gần đây</h2>
            </div>
            <span className={styles.averageBadge}>{activityStats?.averageScore || 0}% trung bình</span>
          </div>
          {recentActivities.length === 0 ? (
            <div className={styles.emptyHistory}>
              <span className="material-symbols-outlined">history_edu</span>
              <p>Chưa có lượt học nào. Hãy chơi game hoặc làm bài kiểm tra đầu tiên nhé!</p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {recentActivities.slice(0, 4).map(item => (
                <div key={item.id} className={styles.historyItem}>
                  <span className="material-symbols-outlined">
                    {item.activityType === 'test' ? 'assignment' : item.activityType === 'review' ? 'psychology' : 'sports_esports'}
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
      </div>
    </div>
  )
}

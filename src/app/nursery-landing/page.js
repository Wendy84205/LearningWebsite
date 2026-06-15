'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WORLDS } from '@/lib/grade1-data'
import styles from './page.module.css'

const DEFAULT_PROFILE = { name: 'Học sinh', avatar: '/avatar-default.png' }
const DEFAULT_MASCOT = {
  name: 'Tin Tin',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvdz9atv7ARpvqQLQcBC-nUsmg4xE1NcZ9EKHi3pdIpmzdujb3-kikQVWw4tBLFITAzvANKzSCe0NlqVat2TRwlp6b-mJ-xBvzm4dKeJu-iELiFhzLYcLVoc7tbcEnuOYszTSiVWsW52WX4Q6bGRJExXAohb4mGeMLqcMoGkZiVBx6oTpGwqt3df4aSWNCGMPeZoHyyNOV2MOdWRNrPPnUjKV1hlqrBOpRSOeDSq5vB3tuxPfqXjIUthHfISQ-a0F_O2u4jo6AHeA'
}
const DEFAULT_PROGRESS = { stars: 0, streak: 0, currentLevel: 1, completedLevels: '' }
const DEFAULT_SUMMARY = { normalLevelsCompleted: 0, completedLevels: [] }

function getNextPracticeForWorlds(worldIds, completedLevels) {
  const completed = new Set(completedLevels || [])

  for (const worldId of worldIds) {
    const world = WORLDS.find(item => item.id === worldId)
    if (!world) continue

    const nextLevel = world.levels.find(level => !completed.has(`w${world.id}-l${level.id}`))
    if (nextLevel) {
      return {
        href: nextLevel.game,
        title: nextLevel.title,
        worldName: world.name,
      }
    }

    if (!completed.has(`w${world.id}-boss`)) {
      return {
        href: world.bossGame,
        title: world.bossName,
        worldName: world.name,
      }
    }
  }

  const firstWorld = WORLDS.find(item => item.id === worldIds[0])
  const firstLevel = firstWorld?.levels[0]

  return {
    href: firstLevel?.game || '/nursery-map',
    title: 'Ôn tập lại',
    worldName: firstWorld?.name || 'Bản đồ học tập',
  }
}

export default function NurseryLandingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [mascot, setMascot] = useState(DEFAULT_MASCOT)
  const [progress, setProgress] = useState(DEFAULT_PROGRESS)
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)
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
      const res = await fetch('/api/dashboard', { cache: 'no-store' })
      if (res.status === 401) {
        router.push('/parent-login')
        return
      }
      if (!res.ok) {
        throw new Error('Không thể tải dữ liệu trang chủ.')
      }

      const data = await res.json()
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
    } catch (err) {
      console.error('Error fetching landing data:', err)
    }
  }, [router])

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
  const quickPractices = useMemo(() => {
    const completedLevels = summary.completedLevels || []

    return {
      math: getNextPracticeForWorlds([1, 4], completedLevels),
      vietnamese: getNextPracticeForWorlds([2], completedLevels),
      matching: getNextPracticeForWorlds([3], completedLevels),
    }
  }, [summary.completedLevels])

  const isMascotEmoji = mascot.image && !mascot.image.startsWith('http') && !mascot.image.startsWith('/')

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.greeting}>
          <span className={styles.greetingText}>
            {greeting}, <strong>{profile.name}</strong>! 👋
          </span>
        </div>
        <div className={styles.statsRow}>
          <div className="badge badge-yellow stat-badge">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--secondary)' }}>monetization_on</span>
            <span>{progress.stars}</span>
          </div>
          <div className="badge badge-blue stat-badge">
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>local_fire_department</span>
            <span>{progress.streak} ngày</span>
          </div>
          <Link href="/parent-dashboard" id="btn-parent-dash" className={styles.parentDashBtn} title="Báo cáo phụ huynh">
            <span className="material-symbols-outlined">monitoring</span>
          </Link>
          <button onClick={handleLogout} className={styles.parentDashBtn} title="Đăng xuất" id="btn-logout" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--error, #ba1a1a)' }}>logout</span>
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Mascot Greeting Speech */}
        <div className={styles.mascotArea} onClick={handleMascotSpeech} style={{ cursor: 'pointer' }}>
          <div className={styles.mascotBubble}>
            <span className={styles.speechText}>
              Chào {profile.name}! Hôm nay mình cùng học thật nhiều bài hay nhé! 🌟
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
          <Link href="/nursery-map" id="btn-learning-map" className={styles.actionCard}>
            <span className={styles.actionIcon}>🗺️</span>
            <div className={styles.actionInfo}>
              <div className={styles.actionTitle}>Bản đồ học tập</div>
              <div className={styles.actionSub}>Cấp {progress.currentLevel} đang đợi bạn!</div>
            </div>
            <span className={styles.actionArrow}>→</span>
          </Link>

          <Link href="/kids-closet" id="btn-closet" className={styles.actionCard}>
            <span className={styles.actionIcon}>👗</span>
            <div className={styles.actionInfo}>
              <div className={styles.actionTitle}>Tủ đồ của bé</div>
              <div className={styles.actionSub}>Đổi phụ kiện đẹp cho {mascot.name}</div>
            </div>
            <span className={styles.actionArrow}>→</span>
          </Link>
        </div>

        {/* Mini Stats Card Grid */}
        <div className={styles.miniStats}>
          <div className={styles.miniStat}>
            <span className={styles.miniStatIcon}>📚</span>
            <div className={styles.miniStatVal}>{progress.currentLevel}</div>
            <div className={styles.miniStatLabel}>Cấp hiện tại</div>
          </div>
          <div className={styles.miniStat}>
            <span className={styles.miniStatIcon}>✅</span>
            <div className={styles.miniStatVal}>{completedCount}</div>
            <div className={styles.miniStatLabel}>Đã xong</div>
          </div>
          <div className={styles.miniStat}>
            <span className={styles.miniStatIcon}>⭐</span>
            <div className={styles.miniStatVal}>{progress.stars}</div>
            <div className={styles.miniStatLabel}>Tổng số sao</div>
          </div>
          <div className={styles.miniStat}>
            <span className={styles.miniStatIcon}>🔥</span>
            <div className={styles.miniStatVal}>{progress.streak}</div>
            <div className={styles.miniStatLabel}>Chuỗi ngày</div>
          </div>
        </div>

        {/* Quick Start – Môn học */}
        <div className={styles.quickStart}>
          <h2 className={styles.quickStartTitle}>Luyện tập nhanh 🚀</h2>
          <div className={styles.quickGrid}>
            <Link href={quickPractices.math.href} id="btn-game-1" className={styles.quickCard}>
              <span className={styles.quickIcon}>🔢</span>
              <span className={styles.quickName}>Toán lớp 1</span>
              <span className={styles.quickSub}>{quickPractices.math.title}</span>
              <span className={styles.quickMeta}>{quickPractices.math.worldName}</span>
            </Link>

            <Link href={quickPractices.vietnamese.href} id="btn-game-2" className={styles.quickCard}>
              <span className={styles.quickIcon}>📖</span>
              <span className={styles.quickName}>Tiếng Việt</span>
              <span className={styles.quickSub}>{quickPractices.vietnamese.title}</span>
              <span className={styles.quickMeta}>{quickPractices.vietnamese.worldName}</span>
            </Link>

            <Link href={quickPractices.matching.href} id="btn-game-3" className={styles.quickCard}>
              <span className={styles.quickIcon}>🧩</span>
              <span className={styles.quickName}>Ghép đôi</span>
              <span className={styles.quickSub}>{quickPractices.matching.title}</span>
              <span className={styles.quickMeta}>{quickPractices.matching.worldName}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getGameTheme } from '@/lib/games/game-themes'
import styles from './page.module.css'
import '@/lib/games/game-ui.css'

const STAR_MSGS = ['Cố gắng hơn nhé!', 'Tốt lắm!', 'Rất giỏi!', 'Xuất sắc!']

function ResultsContent() {
  const searchParams = useSearchParams()
  const gameKey = searchParams.get('game') || ''
  const gradeFromQuery = searchParams.get('grade') || ''
  const theme = getGameTheme(gameKey)
  const [stars, setStars] = useState(0)
  const [gameName, setGameName] = useState('')
  const [mascot, setMascot] = useState({
    name: 'Tin Tin',
    image: '🤖'
  })
  const [showStars, setShowStars] = useState(0)
  const [confettiDots, setConfettiDots] = useState([])
  const [gradeSlug, setGradeSlug] = useState('lop-1')
  const [xp, setXp] = useState(0)
  const [scorePct, setScorePct] = useState(0)
  const [levelNumber, setLevelNumber] = useState(1)

  useEffect(() => {
    const s = parseInt(localStorage.getItem('lastStars') || '0')
    const g = localStorage.getItem('lastGame') || theme.label || 'Trò chơi'
    const mn = localStorage.getItem('mascotName') || 'Tin Tin'
    const me = localStorage.getItem('mascotEmoji') || '🤖'
    const gs = gradeFromQuery || localStorage.getItem('gradeSlug') || 'lop-1'
    const lastXp = parseInt(localStorage.getItem('lastXp') || '0', 10)
    const lastScorePct = parseInt(localStorage.getItem('lastScorePct') || '0', 10)
    const lastLevelNumber = parseInt(localStorage.getItem('lastLevelNumber') || '1', 10)
    
    setTimeout(() => {
      setStars(s)
      setGameName(g)
      setMascot({ name: mn, image: me })
      setGradeSlug(gs)
      setXp(Number.isFinite(lastXp) ? lastXp : 0)
      setScorePct(Number.isFinite(lastScorePct) ? lastScorePct : 0)
      setLevelNumber(Number.isFinite(lastLevelNumber) ? lastLevelNumber : 1)
    }, 0)

    // Confetti and Audio Narration
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = `Chúc mừng bạn nhỏ đã hoàn thành trò chơi ${g}! Bạn nhận được ${s} ngôi sao.`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      window.speechSynthesis.speak(utterance)
    }

    // Confetti dots generation after mount
    const dots = Array.from({ length: 24 }).map((_, i) => ({
      left: Math.random() * 100 + '%',
      delay: Math.random() * 2.5 + 's',
      background: ['#005da7', '#f7e61a', '#ffb953', '#ba1a1a', '#2976c7'][i % 5],
    }))
    setTimeout(() => {
      setConfettiDots(dots)
    }, 0)

    // Animate stars in
    let count = 0
    const id = setInterval(() => {
      count++
      setShowStars(count)
      if (count >= s) clearInterval(id)
    }, 400)
    return () => clearInterval(id)
  }, [gradeFromQuery, theme.label])

  const msg = STAR_MSGS[stars] || STAR_MSGS[0]
  const isMascotEmoji = mascot.image && !mascot.image.startsWith('http') && !mascot.image.startsWith('/')

  return (
    <div className={styles.page} data-theme={gameKey || 'quiz-adventure'}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Confetti dots */}
      <div className={styles.confetti} aria-hidden="true">
        {confettiDots.map((dot, i) => (
          <div
            key={i}
            className={styles.confettiDot}
            style={{
              left: dot.left,
              animationDelay: dot.delay,
              background: dot.background,
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.mascotWrap} style={{ borderColor: theme.accent }}>
          {isMascotEmoji ? (
            <span className={styles.mascotEmoji}>{mascot.image}</span>
          ) : (
            <img
              src={mascot.image}
              className={styles.mascotImg}
              alt="Mascot Robot"
            />
          )}
        </div>

        <span className={styles.themeEmoji}>{theme.emoji}</span>
        <h1 className={styles.title} style={{ color: theme.accentDark || theme.accent }}>Hoàn thành!</h1>
        <p className={styles.gameName}>{gameName}</p>

        <div className={styles.starsRow}>
          {[1, 2, 3].map(n => (
            <span
              key={n}
              className={`${styles.starIcon} ${showStars >= n ? styles.starLit : styles.starDim}`}
              style={{ animationDelay: `${n * 0.4}s` }}
            >
              <span className="material-symbols-outlined">star</span>
            </span>
          ))}
        </div>

        <p className={styles.message}>{msg}</p>

        <div className={styles.rewardGrid}>
          <div>
            <span>XP nhận được</span>
            <strong>+{xp}</strong>
          </div>
          <div>
            <span>Điểm đúng</span>
            <strong>{scorePct}%</strong>
          </div>
          <div>
            <span>Level hiện tại</span>
            <strong>{levelNumber}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/learning/${gradeSlug}/games`} id="btn-play-again" className={`btn btn-primary btn-lg ${styles.actionsBtn}`}>
            <span className="material-symbols-outlined">sports_esports</span>
            Chơi tiếp
          </Link>
          <Link href={`/learning/${gradeSlug}/map`} id="btn-back-map" className={`btn btn-primary btn-lg ${styles.actionsBtn}`}>
            <span className="material-symbols-outlined">map</span>
            Xem bản đồ
          </Link>
          <Link href={`/learning/${gradeSlug}`} id="btn-home" className={`btn btn-ghost btn-lg ${styles.actionsBtn}`}>
            <span className="material-symbols-outlined">home</span>
            Về nhà
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function GameResultsPage() {
  return (
    <Suspense fallback={<div className={styles.page} style={{ display: 'grid', placeItems: 'center' }}>Đang tải...</div>}>
      <ResultsContent />
    </Suspense>
  )
}

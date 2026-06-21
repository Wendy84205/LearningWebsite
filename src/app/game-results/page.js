'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const STAR_MSGS = ['Cố gắng hơn nhé!', 'Tốt lắm!', 'Rất giỏi!', 'Xuất sắc!']

export default function GameResultsPage() {
  const [stars, setStars] = useState(0)
  const [gameName, setGameName] = useState('')
  const [mascot, setMascot] = useState({
    name: 'Tin Tin',
    image: '🤖'
  })
  const [showStars, setShowStars] = useState(0)
  const [confettiDots, setConfettiDots] = useState([])
  const [gradeSlug, setGradeSlug] = useState('lop-1')

  useEffect(() => {
    const s = parseInt(localStorage.getItem('lastStars') || '0')
    const g = localStorage.getItem('lastGame') || 'Trò chơi'
    const mn = localStorage.getItem('mascotName') || 'Tin Tin'
    const me = localStorage.getItem('mascotEmoji') || '🤖'
    const gs = localStorage.getItem('gradeSlug') || 'lop-1'
    
    setTimeout(() => {
      setStars(s)
      setGameName(g)
      setMascot({ name: mn, image: me })
      setGradeSlug(gs)
    }, 0)

    // Save progress to DB if not already saved by game page
    const profileId = localStorage.getItem('profileId')
    const lastLevel = parseInt(localStorage.getItem('lastLevel') || '0')
    const savedKey = `progress_saved_${lastLevel}_${Date.now().toString().slice(0, -4)}`
    const alreadySaved = localStorage.getItem('lastProgressSaved') === savedKey
    if (profileId && lastLevel > 0 && !alreadySaved) {
      localStorage.setItem('lastProgressSaved', savedKey)
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, completedLevel: lastLevel, starsEarned: s }),
      }).catch(err => console.error('Error saving progress:', err))
    }

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
  }, [])

  const msg = STAR_MSGS[stars] || STAR_MSGS[0]
  const isMascotEmoji = mascot.image && !mascot.image.startsWith('http') && !mascot.image.startsWith('/')

  return (
    <div className={styles.page}>
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
        <div className={styles.mascotWrap}>
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

        <h1 className={styles.title}>Hoàn thành!</h1>
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

        <div className={styles.actions}>
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

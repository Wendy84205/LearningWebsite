'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getQuestionsForGame, WORLDS } from '@/lib/grade1-data'
import styles from './page.module.css'

function GameContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = parseInt(searchParams.get('world') || '1', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'

  const [qIndex, setQIndex] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [shake, setShake] = useState(false)
  const [pulse, setPulse] = useState(false)

  const questions = useMemo(() => {
    return getQuestionsForGame(worldId, levelId, isBoss)
  }, [worldId, levelId, isBoss])

  if (questions.length === 0) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className={styles.pulse} style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
          <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>Đang chuẩn bị câu hỏi...</h2>
        </div>
      </div>
    )
  }

  const q = questions[qIndex]
  const isLast = qIndex === questions.length - 1
  const progress = (qIndex / questions.length) * 100
  const currentWorld = WORLDS.find(w => w.id === worldId) || WORLDS[0]

  const handleAnswer = async (optIdx) => {
    if (chosen !== null) return
    setChosen(optIdx)
    const isRight = optIdx === q.correct

    if (isRight) {
      setCorrect(c => c + 1)
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance('Đúng rồi! Bạn giỏi quá!')
        utterance.lang = 'vi-VN'
        window.speechSynthesis.speak(utterance)
      }
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance('Chưa chính xác! Cố gắng lên nhé!')
        utterance.lang = 'vi-VN'
        window.speechSynthesis.speak(utterance)
      }
    }

    setTimeout(async () => {
      if (isLast) {
        const finalCorrect = correct + (isRight ? 1 : 0)
        // 3 sao nếu đúng hết hoặc sai 1 câu, 2 sao nếu đúng quá nửa, còn lại 1 sao
        const starsEarned = finalCorrect === questions.length ? 3 : finalCorrect >= Math.ceil(questions.length / 2) ? 2 : 1
        const completedLevelStr = isBoss ? `w${worldId}-boss` : `w${worldId}-l${levelId}`

        const profileId = localStorage.getItem('profileId')
        if (profileId) {
          try {
            await fetch('/api/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ profileId, completedLevel: completedLevelStr, starsEarned }),
            })
          } catch (err) {
            console.error('Error saving progress:', err)
          }
        }
        localStorage.setItem('lastStars', starsEarned)
        localStorage.setItem('lastGame', isBoss ? `Trận đấu Trùm: ${currentWorld.bossName}` : `Bài học: ${q.topic}`)
        localStorage.setItem('lastLevel', isBoss ? `${currentWorld.name} (Boss)` : `${currentWorld.name} - Ải ${levelId}`)
        router.push('/game-results')
      } else {
        setQIndex(i => i + 1)
        setChosen(null)
      }
    }, 1400)
  }

  return (
    <div className={styles.page}>
      {/* Background Blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/nursery-map" className={styles.closeBtn}>✕</Link>
        <div className={styles.progressWrap}>
          <div className={styles.progressContainer}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.qCounter}>{qIndex + 1}/{questions.length}</span>
        </div>
        <div className={styles.starBadge}>
          <span className={`material-symbols-outlined ${styles.starIcon}`}>monetization_on</span>
          <span>{correct}</span>
        </div>
      </header>

      {/* Subject Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
        <span style={{
          background: currentWorld.bgColor,
          color: currentWorld.textColor,
          border: `1px solid ${currentWorld.borderColor}`,
          borderRadius: '999px',
          padding: '4px 14px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {currentWorld.name} · {isBoss ? 'Trận đấu Trùm 🏆' : `Ải ${levelId}`}
        </span>
      </div>

      {/* Game Area */}
      <div className={styles.gameArea}>
        <div className={`${styles.questionCard} ${shake ? styles.shake : ''} ${pulse ? styles.pulse : ''}`}>
          <div className={styles.questionEmoji}>{q.emoji || '❓'}</div>
          <h2 className={styles.questionText}>{q.q}</h2>
        </div>

        <div className={styles.optionsGrid}>
          {q.options.map((opt, i) => {
            let stateClass = ''
            if (chosen !== null) {
              if (i === q.correct) stateClass = styles.optCorrect
              else if (i === chosen) stateClass = styles.optWrong
            }
            return (
              <button
                key={i}
                id={`option-${i}`}
                className={`${styles.optionBtn} ${stateClass}`}
                onClick={() => handleAnswer(i)}
                disabled={chosen !== null}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function GameChoose1of2Page() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--surface)' }}>
        <h3>Đang tải trò chơi...</h3>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}

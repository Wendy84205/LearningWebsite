'use client'
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getGradeData } from '@/lib/data'
import styles from './page.module.css'

function GameContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = parseInt(searchParams.get('world') || '2', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const gradeData = getGradeData(gradeSlug)
  const WORLDS = gradeData.WORLDS

  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/questions?grade=${gradeSlug}&world=${worldId}&level=${levelId}&boss=${isBoss}&game=listen-and-select`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuestions(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [gradeSlug, worldId, levelId, isBoss])

  const q = questions[qIndex]
  const isLast = qIndex === questions.length - 1
  const progress = questions.length ? (qIndex / questions.length) * 100 : 0
  const currentWorld = WORLDS.find(w => w.id === worldId) || WORLDS[0]

  const playSound = useCallback(() => {
    if (!q) return
    setSpeaking(true)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(q.word)
      utter.lang = 'vi-VN'
      utter.rate = 0.75
      utter.pitch = 1.1
      utter.onend = () => setSpeaking(false)
      window.speechSynthesis.speak(utter)
    } else {
      setTimeout(() => setSpeaking(false), 1000)
    }
  }, [q, setSpeaking])

  // Tự động đọc từ vựng khi load câu hỏi mới
  useEffect(() => {
    if (q) {
      const timer = setTimeout(() => {
        playSound()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [q, playSound])

  if (questions.length === 0 || !q) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👂</div>
          <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>Đang chuẩn bị câu nghe...</h2>
        </div>
      </div>
    )
  }

  const handleAnswer = async (optIdx) => {
    if (chosen !== null) return
    setChosen(optIdx)
    const isRight = optIdx === q.correct

    if (isRight) {
      setCorrect(c => c + 1)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance('Chính xác! Giỏi lắm!')
        utterance.lang = 'vi-VN'
        window.speechSynthesis.speak(utterance)
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance('Chưa đúng rồi, cố lên bé nhé!')
        utterance.lang = 'vi-VN'
        window.speechSynthesis.speak(utterance)
      }
    }

    setTimeout(async () => {
      if (isLast) {
        const finalCorrect = correct + (isRight ? 1 : 0)
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
        setSpeaking(false)
      }
    }, 1400)
  }

  return (
    <div className={styles.page}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Header */}
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}/map`} className={styles.closeBtn} aria-label="Thoát trò chơi">
          <span className="material-symbols-outlined">close</span>
        </Link>
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
      <div className={styles.subjectBadgeWrap} style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
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
          {currentWorld.name} · {isBoss ? 'Trận đấu Trùm' : `Ải ${levelId}`}
        </span>
      </div>

      {/* Game Area */}
      <div className={styles.gameArea}>
        <h2 className={styles.instruction}>
          <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--primary)' }}>hearing</span>
          Nghe và chọn từ đúng!
        </h2>

        <button
          id="btn-play-sound"
          className={styles.soundBtn}
          onClick={playSound}
          disabled={speaking}
        >
          <span className={`material-symbols-outlined ${styles.soundIcon} ${speaking ? styles.soundAnimating : ''}`}>
            volume_up
          </span>
          {speaking ? 'Đang phát...' : `Nghe phát âm`}
        </button>

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
                id={`listen-option-${i}`}
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

export default function GameListenAndSelectPage() {
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

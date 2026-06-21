'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getGradeData } from '@/lib/data'
import styles from './page.module.css'

function GameContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = parseInt(searchParams.get('world') || '3', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const gradeData = getGradeData(gradeSlug)
  const WORLDS = gradeData.WORLDS
  const currentWorld = WORLDS.find(w => w.id === worldId) || WORLDS[0]

  const [pairs, setPairs] = useState([])
  const [leftCards, setLeftCards] = useState([])
  const [rightCards, setRightCards] = useState([])
  const [leftSel, setLeftSel] = useState(null)
  const [rightSel, setRightSel] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState(false)
  const [loading, setLoading] = useState(true)

  // Khởi tạo cặp thẻ dựa trên World và Level
  useEffect(() => {
    fetch(`/api/questions?grade=${gradeSlug}&world=${worldId}&level=${levelId}&boss=${isBoss}&game=simple-matching`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const pList = data
          const leftShuffled = [...pList]
          const rightShuffled = [...pList]
          
          // Shuffle helper đơn giản tại chỗ
          const shuffleArray = (arr) => {
            const a = [...arr]
            for (let i = a.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]]
            }
            return a
          }

          const shufL = shuffleArray(leftShuffled)
          const shufR = shuffleArray(rightShuffled)

          setPairs(pList)
          setLeftCards(shufL)
          setRightCards(shufR)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [gradeSlug, worldId, levelId, isBoss])

  // Hàm chọn và ghép cặp trực tiếp khi click (thay cho useEffect)
  const handleCardSelect = (col, idx) => {
    if (wrong) return // Nếu đang báo sai thì không cho chọn tiếp
    if (col === 'left') {
      if (leftSel === idx) {
        setLeftSel(null)
        return
      }
      setLeftSel(idx)
      if (rightSel !== null) {
        checkMatch(idx, rightSel)
      }
    } else {
      if (rightSel === idx) {
        setRightSel(null)
        return
      }
      setRightSel(idx)
      if (leftSel !== null) {
        checkMatch(leftSel, idx)
      }
    }
  }

  const checkMatch = (lIdx, rIdx) => {
    const l = leftCards[lIdx]
    const r = rightCards[rIdx]
    if (l.id === r.id) {
      setMatched(m => [...m, l.id])
      setLeftSel(null)
      setRightSel(null)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance('Ghép đúng rồi!')
        utter.lang = 'vi-VN'
        window.speechSynthesis.speak(utter)
      }
    } else {
      setWrong(true)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance('Chưa đúng rồi!')
        utter.lang = 'vi-VN'
        window.speechSynthesis.speak(utter)
      }
      setTimeout(() => {
        setLeftSel(null)
        setRightSel(null)
        setWrong(false)
      }, 800)
    }
  }

  // Hoàn thành game khi ghép hết tất cả
  useEffect(() => {
    if (pairs.length > 0 && matched.length === pairs.length) {
      const finish = async () => {
        const starsEarned = 3
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
        localStorage.setItem('lastGame', isBoss ? `Trận đấu Trùm: Siêu trí nhớ 30 Thẻ` : `Ghép đôi: Luyện trí nhớ`)
        localStorage.setItem('lastLevel', isBoss ? `${currentWorld.name} (Boss)` : `${currentWorld.name} - Ải ${levelId}`)
        router.push('/game-results')
      }
      setTimeout(finish, 800)
    }
  }, [matched, pairs.length, router, isBoss, worldId, levelId, currentWorld.name])

  if (loading || pairs.length === 0) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧩</div>
          <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>Đang chuẩn bị các cặp thẻ...</h2>
        </div>
      </div>
    )
  }

  const progress = (matched.length / pairs.length) * 100

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
          <span className={styles.qCounter}>{matched.length}/{pairs.length} cặp</span>
        </div>
        <div className={styles.starBadge}>
          <span className={`material-symbols-outlined ${styles.starIcon}`}>monetization_on</span>
          <span>{matched.length * 2}</span>
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
          <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--primary)' }}>extension</span>
          Ghép hình với chữ đúng!
        </h2>

        <div className={styles.matchGrid}>
          {/* Cột trái - Hình/Số/Từ gợi ý */}
          <div className={styles.col}>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hình ảnh / Từ
            </div>
            {leftCards.map((card, i) => {
              const isMatched = matched.includes(card.id)
              let cardClass = ''
              if (leftSel === i) cardClass = styles.cardSelected
              if (isMatched) cardClass = styles.cardMatched
              if (wrong && leftSel === i) cardClass = styles.cardWrong

              return (
                <button
                  key={`left-${card.id}-${i}`}
                  id={`left-${i}`}
                  className={`${styles.matchCard} ${cardClass}`}
                  onClick={() => !isMatched && handleCardSelect('left', i)}
                  disabled={isMatched}
                  style={{ fontSize: card.left.length <= 4 ? '1.8rem' : '1.1rem' }}
                >
                  {card.left}
                </button>
              )
            })}
          </div>

          {/* Cột phải - Chữ/Từ giải nghĩa */}
          <div className={styles.col}>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--secondary, #686000)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Từ ngữ / Ý nghĩa
            </div>
            {rightCards.map((card, i) => {
              const isMatched = matched.includes(card.id)
              let cardClass = ''
              if (rightSel === i) cardClass = styles.cardSelected
              if (isMatched) cardClass = styles.cardMatched
              if (wrong && rightSel === i) cardClass = styles.cardWrong

              return (
                <button
                  key={`right-${card.id}-${i}`}
                  id={`right-${i}`}
                  className={`${styles.matchCard} ${styles.matchCardText} ${cardClass}`}
                  onClick={() => !isMatched && handleCardSelect('right', i)}
                  disabled={isMatched}
                  style={{ fontSize: card.right.length <= 8 ? '1.2rem' : '0.95rem', padding: '8px 4px' }}
                >
                  {card.right}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>

  )
}

export default function GameSimpleMatchingPage() {
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

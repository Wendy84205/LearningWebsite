'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { buildMemoryPairs } from '@/lib/games/engine/question-adapter'
import { saveGameResult } from '@/lib/api/student-api'
import styles from '@/lib/games/shared-game.module.css'

function MemoryCardInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/questions?grade=${gradeSlug}&game=matching&limit=6`)
      .then(res => res.json())
      .then(data => {
        const pairs = buildMemoryPairs(Array.isArray(data) ? data : [], 4)
        setCards(pairs.sort(() => Math.random() - 0.5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [gradeSlug])

  const handleFlip = async (card) => {
    if (flipped.length >= 2 || matched.has(card.pairId) || flipped.find(f => f.id === card.id)) return

    const next = [...flipped, card]
    setFlipped(next)

    if (next.length === 2) {
      setMoves(m => m + 1)
      if (next[0].pairId === next[1].pairId) {
        const nextMatched = new Set(matched)
        nextMatched.add(card.pairId)
        setMatched(nextMatched)
        setFlipped([])

        if (nextMatched.size === cards.length / 2) {
          const profileId = localStorage.getItem('profileId')
          const stars = moves <= cards.length ? 3 : moves <= cards.length * 2 ? 2 : 1
          localStorage.setItem('lastStars', String(stars))
          localStorage.setItem('lastXp', String(30 + stars * 10))
          localStorage.setItem('lastScore', '100')
          if (profileId) {
            await saveGameResult({
              profileId,
              activityType: 'game',
              title: 'Thẻ Nhớ',
              grade: gradeSlug,
              gameType: 'memory-card',
              correct: nextMatched.size,
              total: cards.length / 2,
              starsEarned: stars,
            })
          }
          router.push(`/game-results?grade=${gradeSlug}&game=memory-card`)
        }
      } else {
        setTimeout(() => setFlipped([]), 700)
      }
    }
  }

  if (loading) {
    return <div className={styles.loading}><div className={styles.loadingIcon}>🃏</div><h2>Đang xáo bài...</h2></div>
  }

  const visible = (card) => flipped.some(f => f.id === card.id) || matched.has(card.pairId)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}/games`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Thẻ Nhớ
        </Link>
        <span className={styles.statPill}>{moves} lượt · {matched.size}/{cards.length / 2}</span>
      </header>
      <main className={styles.main}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
          {cards.map(card => (
            <button
              key={card.id}
              type="button"
              className={styles.choiceBtn}
              style={{ minHeight: 80, justifyContent: 'center' }}
              onClick={() => handleFlip(card)}
            >
              {visible(card) ? card.label : '?'}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function MemoryCardPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>...</div>}>
      <MemoryCardInner />
    </Suspense>
  )
}

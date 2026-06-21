'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { adaptQuestionsForGame } from '@/lib/games/engine/question-adapter'
import { saveGameResult } from '@/lib/api/student-api'
import styles from '@/lib/games/shared-game.module.css'

function WordMatchInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const [pairs, setPairs] = useState([])
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetch(`/api/questions?grade=${gradeSlug}&game=matching&limit=6`)
      .then(res => res.json())
      .then(data => {
        const adapted = adaptQuestionsForGame(Array.isArray(data) ? data : [])
        const cards = adapted.flatMap(q => [
          { id: `${q.id}-q`, label: q.prompt, pairId: q.id },
          { id: `${q.id}-a`, label: String(q.answer), pairId: q.id },
        ])
        setPairs(cards.sort(() => Math.random() - 0.5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [gradeSlug])

  const handlePick = async (card) => {
    if (matched.has(card.pairId)) return

    if (!selected) {
      setSelected(card)
      return
    }

    if (selected.id === card.id) {
      setSelected(null)
      return
    }

    if (selected.pairId === card.pairId) {
      const nextMatched = new Set(matched)
      nextMatched.add(card.pairId)
      setMatched(nextMatched)
      setScore(s => s + 1)
      setSelected(null)

      if (nextMatched.size === pairs.length / 2) {
        const profileId = localStorage.getItem('profileId')
        localStorage.setItem('lastStars', '3')
        localStorage.setItem('lastXp', String(score * 15 + 20))
        localStorage.setItem('lastScore', '100')
        if (profileId) {
          await saveGameResult({
            profileId,
            activityType: 'game',
            title: 'Ghép Từ',
            grade: gradeSlug,
            gameType: 'word-match',
            correct: nextMatched.size,
            total: pairs.length / 2,
            starsEarned: 3,
          })
        }
        router.push(`/game-results?grade=${gradeSlug}&game=word-match`)
      }
    } else {
      setSelected(null)
    }
  }

  if (loading) {
    return <div className={styles.loading}><div className={styles.loadingIcon}>🔤</div><h2>Đang tải...</h2></div>
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}/games`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Ghép Từ
        </Link>
        <span className={styles.statPill}>{score}/{pairs.length / 2} cặp</span>
      </header>
      <main className={styles.main}>
        <div className={styles.choices}>
          {pairs.map(card => (
            <button
              key={card.id}
              type="button"
              className={styles.choiceBtn}
              style={{
                opacity: matched.has(card.pairId) ? 0.4 : 1,
                borderColor: selected?.id === card.id ? '#005da7' : undefined,
              }}
              onClick={() => handlePick(card)}
              disabled={matched.has(card.pairId)}
            >
              {card.label}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function WordMatchPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>...</div>}>
      <WordMatchInner />
    </Suspense>
  )
}

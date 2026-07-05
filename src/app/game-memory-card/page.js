'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { buildMemoryPairs } from '@/lib/games/engine/question-adapter'
import { saveGameResult } from '@/lib/api/student-api'
import { getGameTheme } from '@/lib/games/game-themes'
import { GameLoading, GameHud } from '@/lib/games/GameUi'
import '@/lib/games/game-ui.css'

function MemoryCardInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const hasMapContext = searchParams.has('world') || searchParams.has('level') || searchParams.has('boss')
  const worldId = parseInt(searchParams.get('world') || '1', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'
  const theme = getGameTheme('memory-card')
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({
      grade: gradeSlug,
      game: 'matching',
      limit: '6',
      world: String(worldId),
      level: String(levelId),
      boss: String(isBoss),
    })

    fetch(`/api/questions?${params}`)
      .then(res => res.json())
      .then(data => {
        const pairs = buildMemoryPairs(Array.isArray(data) ? data : [], 4)
        setCards(pairs.sort(() => Math.random() - 0.5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [gradeSlug, worldId, levelId, isBoss])

  const totalPairs = cards.length / 2

  const finishGame = async (nextMatched, finalMoves) => {
    const profileId = localStorage.getItem('profileId')
    const stars = finalMoves <= cards.length ? 3 : finalMoves <= cards.length * 2 ? 2 : 1
    localStorage.setItem('lastStars', String(stars))
    localStorage.setItem('lastXp', String(30 + stars * 10))
    localStorage.setItem('lastScorePct', '100')
    localStorage.setItem('lastGame', theme.label)
    localStorage.setItem('lastLevelNumber', '1')
    if (profileId) {
      try {
        const response = await saveGameResult({
          profileId,
          activityType: 'game',
          title: theme.label,
          grade: gradeSlug,
          gameType: 'memory-card',
          completedLevel: hasMapContext ? (isBoss ? `w${worldId}-boss` : `w${worldId}-l${levelId}`) : '',
          worldId,
          levelId,
          isBoss,
          correct: nextMatched.size,
          total: totalPairs,
          starsEarned: stars,
          answers: Array.from(nextMatched).map(pairId => ({
            questionId: pairId,
            selected: 'matched',
            correctAnswer: 'matched',
            isCorrect: true,
            difficulty: 'easy',
            topic: 'Trí nhớ',
            skill: 'memory_matching',
          })),
        })
        localStorage.setItem('lastXp', String(response?.result?.xp ?? response?.result?.xpEarned ?? 30 + stars * 10))
        localStorage.setItem('lastScorePct', String(response?.result?.scorePct || 100))
        localStorage.setItem('lastLevelNumber', String(response?.result?.level?.level || 1))
      } catch (err) {
        console.error(err)
      }
    }
    router.push(`/game-results?grade=${gradeSlug}&game=memory-card`)
  }

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

        if (nextMatched.size === totalPairs) {
          await finishGame(nextMatched, moves + 1)
        }
      } else {
        setTimeout(() => setFlipped([]), 650)
      }
    }
  }

  const isRevealed = (card) => flipped.some(f => f.id === card.id) || matched.has(card.pairId)

  if (loading) return <GameLoading theme={theme} />

  return (
    <div className="game-shell" data-theme="memory-card">
      <div className="game-bg" aria-hidden="true">
        <div className="game-bg-blob game-bg-blob-a" />
        <div className="game-bg-blob game-bg-blob-b" />
        <div className="game-bg-grid" />
      </div>

      <GameHud
        theme={theme}
        gradeSlug={gradeSlug}
        label={theme.label}
        session={{ score: matched.size, hearts: null }}
        config={{}}
        questionIndex={matched.size}
        totalQuestions={totalPairs}
      />

      <main className="game-main">
        <div className="game-hero-tag">
          <span className="material-symbols-outlined">grid_view</span>
          {theme.tagline} · {moves} lượt lật
        </div>

        <div className="game-memory-grid">
          {cards.map(card => (
            <button
              key={card.id}
              type="button"
              className={[
                'game-memory-card',
                isRevealed(card) ? 'revealed' : '',
                matched.has(card.pairId) ? 'matched' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleFlip(card)}
              aria-label={isRevealed(card) ? card.label : 'Thẻ úp'}
            >
              <div className="game-memory-inner">
                <div className="game-memory-face game-memory-front">?</div>
                <div className="game-memory-face game-memory-back">{card.label}</div>
              </div>
            </button>
          ))}
        </div>

        {cards.length === 0 && (
          <Link href={`/learning/${gradeSlug}/games`} className="game-hud-back">Về trò chơi</Link>
        )}
      </main>
    </div>
  )
}

export default function MemoryCardPage() {
  return (
    <Suspense fallback={<GameLoading theme={getGameTheme('memory-card')} />}>
      <MemoryCardInner />
    </Suspense>
  )
}

'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { adaptQuestionsForGame } from '@/lib/games/engine/question-adapter'
import { saveGameResult } from '@/lib/api/student-api'
import { getGameTheme } from '@/lib/games/game-themes'
import { GameLoading, GameHud } from '@/lib/games/GameUi'
import '@/lib/games/game-ui.css'

function WordMatchInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const hasMapContext = searchParams.has('world') || searchParams.has('level') || searchParams.has('boss')
  const worldId = parseInt(searchParams.get('world') || '1', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'
  const theme = getGameTheme('word-match')
  const [pairs, setPairs] = useState([])
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [wobbleId, setWobbleId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)

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
        const adapted = adaptQuestionsForGame(Array.isArray(data) ? data : [])
        const cards = adapted.flatMap(q => [
          { id: `${q.id}-q`, label: q.prompt, pairId: q.id, kind: 'word' },
          { id: `${q.id}-a`, label: String(q.answer), pairId: q.id, kind: 'meaning' },
        ])
        setPairs(cards.sort(() => Math.random() - 0.5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [gradeSlug, worldId, levelId, isBoss])

  const totalPairs = pairs.length / 2

  const finishGame = async (finalScore, finalMatched = matched) => {
    const profileId = localStorage.getItem('profileId')
    const stars = finalScore === totalPairs ? 3 : finalScore >= Math.ceil(totalPairs / 2) ? 2 : 1
    localStorage.setItem('lastStars', String(stars))
    localStorage.setItem('lastXp', String(finalScore * 15 + 20))
    localStorage.setItem('lastScorePct', String(Math.round((finalScore / totalPairs) * 100)))
    localStorage.setItem('lastGame', theme.label)
    localStorage.setItem('lastLevelNumber', '1')
    if (profileId) {
      try {
        const response = await saveGameResult({
          profileId,
          activityType: 'game',
          title: theme.label,
          grade: gradeSlug,
          gameType: 'word-match',
          completedLevel: hasMapContext ? (isBoss ? `w${worldId}-boss` : `w${worldId}-l${levelId}`) : '',
          worldId,
          levelId,
          isBoss,
          correct: finalScore,
          total: totalPairs,
          starsEarned: stars,
          answers: Array.from(finalMatched).map(pairId => ({
            questionId: pairId,
            selected: 'matched',
            correctAnswer: 'matched',
            isCorrect: true,
            difficulty: 'easy',
            topic: 'Ghép từ',
            skill: 'word_matching',
          })),
        })
        localStorage.setItem('lastXp', String(response?.result?.xp ?? response?.result?.xpEarned ?? finalScore * 15 + 20))
        localStorage.setItem('lastScorePct', String(response?.result?.scorePct || Math.round((finalScore / totalPairs) * 100)))
        localStorage.setItem('lastLevelNumber', String(response?.result?.level?.level || 1))
      } catch (err) {
        console.error(err)
      }
    }
    router.push(`/game-results?grade=${gradeSlug}&game=word-match`)
  }

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
      const nextScore = score + 1
      setScore(nextScore)
      setCombo(c => c + 1)
      setSelected(null)

      if (nextMatched.size === totalPairs) {
        await finishGame(nextScore, nextMatched)
      }
    } else {
      setCombo(0)
      setWobbleId(card.id)
      setTimeout(() => setWobbleId(null), 400)
      setSelected(null)
    }
  }

  if (loading) return <GameLoading theme={theme} />

  return (
    <div className="game-shell" data-theme="word-match">
      <div className="game-bg" aria-hidden="true">
        <div className="game-bg-blob game-bg-blob-a" />
        <div className="game-bg-blob game-bg-blob-b" />
        <div className="game-bg-grid" />
      </div>

      <GameHud
        theme={theme}
        gradeSlug={gradeSlug}
        label={theme.label}
        session={{ score, hearts: null }}
        config={{}}
        combo={combo}
        questionIndex={score}
        totalQuestions={totalPairs}
      />

      <main className="game-main">
        <div className="game-hero-tag">
          <span className="material-symbols-outlined">spellcheck</span>
          {theme.tagline}
        </div>
        <div className="game-match-grid">
          {pairs.map(card => (
            <button
              key={card.id}
              type="button"
              className={[
                'game-match-tile',
                matched.has(card.pairId) ? 'matched' : '',
                selected?.id === card.id ? 'selected' : '',
                wobbleId === card.id ? 'wobble' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handlePick(card)}
              disabled={matched.has(card.pairId)}
            >
              {card.label}
            </button>
          ))}
        </div>
        {pairs.length === 0 && (
          <Link href={`/learning/${gradeSlug}/games`} className="game-hud-back">Về trò chơi</Link>
        )}
      </main>
    </div>
  )
}

export default function WordMatchPage() {
  return (
    <Suspense fallback={<GameLoading theme={getGameTheme('word-match')} />}>
      <WordMatchInner />
    </Suspense>
  )
}

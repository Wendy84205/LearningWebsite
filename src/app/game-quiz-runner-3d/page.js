'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import ThreeQuizRunner from '@/lib/games/ThreeQuizRunner'
import { adaptQuestionsForGame } from '@/lib/games/engine/question-adapter'
import { getGameTheme } from '@/lib/games/game-themes'
import { saveGameResult } from '@/lib/api/student-api'
import '@/lib/games/game-ui.css'

function starsFromScore(correct, total) {
  if (!total) return 0
  const pct = correct / total
  if (pct >= 0.8) return 3
  if (pct >= 0.5) return 2
  return correct > 0 ? 1 : 0
}

function RunnerLoading({ gradeSlug, message = 'Đang mở đường chạy 3D...' }) {
  const theme = getGameTheme('quiz-runner-3d')
  return (
    <div className="game-shell" data-theme="quiz-runner-3d">
      <div className="game-bg" aria-hidden="true">
        <div className="game-bg-blob game-bg-blob-a" />
        <div className="game-bg-blob game-bg-blob-b" />
        <div className="game-bg-grid" />
      </div>
      <main className="game-main">
        <div className="game-hero-tag">
          <span>{theme.emoji}</span>
          <strong>{message}</strong>
        </div>
        <Link href={`/learning/${gradeSlug}/games`} className="game-hud-back">Về trò chơi</Link>
      </main>
    </div>
  )
}

function QuizRunner3DInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const hasMapContext = searchParams.has('world') || searchParams.has('level') || searchParams.has('boss')
  const worldId = Number.parseInt(searchParams.get('world') || '1', 10)
  const levelId = Number.parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'
  const theme = getGameTheme('quiz-runner-3d')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const completedLevel = useMemo(() => {
    if (!hasMapContext) return ''
    return isBoss ? `w${worldId}-boss` : `w${worldId}-l${levelId}`
  }, [hasMapContext, isBoss, levelId, worldId])

  useEffect(() => {
    let cancelled = false

    async function loadQuestions() {
      const params = new URLSearchParams({
        grade: gradeSlug,
        game: 'quiz',
        limit: '5',
        world: String(worldId),
        level: String(levelId),
        boss: String(isBoss),
      })

      try {
        await Promise.resolve()
        const res = await fetch(`/api/questions?${params}`, { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        const adapted = adaptQuestionsForGame(Array.isArray(data) ? data : [])
          .filter(question => question.choices?.length >= 2)
          .slice(0, 5)
        setQuestions(adapted)
        setError(adapted.length ? '' : 'Chưa có câu hỏi phù hợp cho Quiz Runner 3D.')
      } catch (err) {
        if (!cancelled) setError(err.message || 'Không tải được câu hỏi.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadQuestions()
    return () => {
      cancelled = true
    }
  }, [gradeSlug, isBoss, levelId, worldId])

  const handleComplete = useCallback(async ({ correct, total, answers, maxCombo }) => {
    const profileId = localStorage.getItem('profileId')
    const stars = starsFromScore(correct, total)
    const scorePct = total ? Math.round((correct / total) * 100) : 0
    const fallbackXp = correct * 18 + stars * 12 + Math.min(maxCombo || 0, 5) * 3

    localStorage.setItem('lastStars', String(stars))
    localStorage.setItem('lastXp', String(fallbackXp))
    localStorage.setItem('lastScore', String(scorePct))
    localStorage.setItem('lastScorePct', String(scorePct))
    localStorage.setItem('lastCorrect', String(correct))
    localStorage.setItem('lastTotal', String(total))
    localStorage.setItem('lastGame', theme.label)
    localStorage.setItem('lastCombo', String(maxCombo || 0))
    localStorage.setItem('lastLevelNumber', '1')

    if (profileId) {
      try {
        const response = await saveGameResult({
          profileId,
          activityType: 'game',
          title: theme.label,
          grade: gradeSlug,
          gameType: 'quiz-runner-3d',
          completedLevel,
          worldId,
          levelId,
          isBoss,
          answers,
          correct,
          total,
          starsEarned: stars,
        })
        localStorage.setItem('lastXp', String(response?.result?.xp ?? response?.result?.xpEarned ?? fallbackXp))
        localStorage.setItem('lastScorePct', String(response?.result?.scorePct ?? scorePct))
        localStorage.setItem('lastLevelNumber', String(response?.result?.level?.level || 1))
      } catch (err) {
        console.error(err)
      }
    }

    router.push(`/game-results?grade=${gradeSlug}&game=quiz-runner-3d`)
  }, [completedLevel, gradeSlug, isBoss, levelId, router, theme.label, worldId])

  if (loading) return <RunnerLoading gradeSlug={gradeSlug} />
  if (error) return <RunnerLoading gradeSlug={gradeSlug} message={error} />

  return <ThreeQuizRunner questions={questions} theme={theme} onComplete={handleComplete} />
}

export default function QuizRunner3DPage() {
  return (
    <Suspense fallback={<RunnerLoading gradeSlug="lop-1" />}>
      <QuizRunner3DInner />
    </Suspense>
  )
}

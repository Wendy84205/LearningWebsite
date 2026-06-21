'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { GAME_CONFIG, GAME_LABELS } from '@/lib/games/engine/game-types'
import {
  createGameSession,
  getCurrentQuestion,
  submitGameAnswer,
  finalizeGameSession,
} from '@/lib/games/engine/game-session'
import { saveGameResult } from '@/lib/api/student-api'

/**
 * Shared hook for quiz-style games powered by Question Bank.
 */
export function useGamePage({
  gameType,
  gradeSlug,
  worldId = 1,
  levelId = 1,
  isBoss = false,
  activityTitle,
  completedLevel,
  extraParams = {},
}) {
  const router = useRouter()
  const config = GAME_CONFIG[gameType]
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState(null)
  const [timer, setTimer] = useState(config?.timer || null)

  useEffect(() => {
    const apiGame = config?.apiGame || 'quiz'
    const params = new URLSearchParams({
      grade: gradeSlug,
      world: String(worldId),
      level: String(levelId),
      boss: String(isBoss),
      game: apiGame,
      ...extraParams,
    })

    fetch(`/api/questions?${params}`)
      .then(res => res.json())
      .then(data => {
        const questions = Array.isArray(data) ? data : []
        setSession(createGameSession(gameType, questions))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [gameType, gradeSlug, worldId, levelId, isBoss, config?.apiGame, extraParams])

  useEffect(() => {
    if (!config?.timer || session?.status !== 'playing') return undefined
    const id = setInterval(() => {
      setTimer(prev => {
        if (prev == null || prev <= 1) {
          clearInterval(id)
          setSession(s => s ? { ...s, status: 'finished' } : s)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [config?.timer, session?.status])

  const question = session ? getCurrentQuestion(session) : null

  const finishGame = useCallback(async (finalSession) => {
    const result = finalizeGameSession(finalSession)
    const profileId = localStorage.getItem('profileId')

    localStorage.setItem('lastStars', String(result.stars))
    localStorage.setItem('lastXp', String(result.xp))
    localStorage.setItem('lastScore', String(result.scorePct))
    localStorage.setItem('lastCorrect', String(result.correct))
    localStorage.setItem('lastTotal', String(result.total))

    if (profileId) {
      try {
        await saveGameResult({
          profileId,
          activityType: gameType === 'daily-mission' ? 'daily' : 'game',
          title: activityTitle || GAME_LABELS[gameType],
          grade: gradeSlug,
          gameType,
          completedLevel: completedLevel || '',
          worldId,
          levelId,
          isBoss,
          answers: finalSession.answers,
          correct: result.correct,
          total: result.total,
          starsEarned: result.stars,
        })
      } catch (err) {
        console.error(err)
      }
    }

    router.push(`/game-results?grade=${gradeSlug}&game=${gameType}`)
  }, [activityTitle, completedLevel, gameType, gradeSlug, isBoss, levelId, router, worldId])

  const handleAnswer = useCallback(async (selected) => {
    if (!session || session.status !== 'playing' || feedback) return

    const { session: nextSession, result } = submitGameAnswer(session, selected)
    setFeedback(result)
    setSession(nextSession)

    setTimeout(async () => {
      setFeedback(null)
      if (nextSession.status === 'finished') {
        await finishGame(nextSession)
      } else {
        setSession(nextSession)
      }
    }, result?.isCorrect ? 800 : 1200)
  }, [session, feedback, finishGame])

  return {
    session,
    question,
    loading,
    feedback,
    timer,
    config,
    handleAnswer,
    label: GAME_LABELS[gameType],
  }
}

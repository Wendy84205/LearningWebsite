'use client'

import { Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useGamePage } from '@/lib/games/use-game-page'
import { getGameTheme } from '@/lib/games/game-themes'
import { GAME_CONFIG } from '@/lib/games/engine/game-types'
import { GameLoading, GameHud, AdventurePath, FeedbackToast } from '@/lib/games/GameUi'
import '@/lib/games/game-ui.css'

const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function GameInner({ gameType }) {
  const searchParams = useSearchParams()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const hasMapContext = searchParams.has('world') || searchParams.has('level') || searchParams.has('boss')
  const worldId = parseInt(searchParams.get('world') || '1', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'
  const theme = getGameTheme(gameType)
  const gameConfig = GAME_CONFIG[gameType]
  const gameSubject = gameConfig?.subject || ''
  const extraParams = useMemo(() => {
    if (gameSubject) return { subject: gameSubject }
    return {}
  }, [gameSubject])

  const { session, question, loading, feedback, timer, config, handleAnswer, label } = useGamePage({
    gameType,
    gradeSlug,
    worldId,
    levelId,
    isBoss,
    activityTitle: theme.label,
    completedLevel: hasMapContext ? (isBoss ? `w${worldId}-boss` : `w${worldId}-l${levelId}`) : '',
    extraParams,
  })

  const cardClass = useMemo(() => {
    const parts = ['game-question-card']
    if (feedback?.isCorrect) parts.push('pulse')
    if (feedback && !feedback.isCorrect) parts.push('shake')
    return parts.join(' ')
  }, [feedback])

  if (loading) {
    return <GameLoading theme={theme} />
  }

  if (!session?.questions?.length) {
    return (
      <div className="game-shell" data-theme={gameType}>
        <GameLoading theme={theme} message="Chưa có câu hỏi published" />
        <div style={{ textAlign: 'center', marginTop: -80, position: 'relative', zIndex: 3 }}>
          <Link href={`/learning/${gradeSlug}/games`} className="game-hud-back">Về trò chơi</Link>
        </div>
      </div>
    )
  }

  const total = session.questions.length
  const combo = session.combo || 0

  return (
    <div className="game-shell" data-theme={gameType}>
      <div className="game-bg" aria-hidden="true">
        <div className="game-bg-blob game-bg-blob-a" />
        <div className="game-bg-blob game-bg-blob-b" />
        <div className="game-bg-grid" />
      </div>

      <GameHud
        theme={theme}
        gradeSlug={gradeSlug}
        label={label}
        session={session}
        config={config}
        timer={timer}
        combo={combo}
        questionIndex={session.index}
        totalQuestions={total}
      />

      <main className="game-main">
        <div className="game-hero-tag">
          <span className="material-symbols-outlined">{theme.icon}</span>
          {theme.tagline}
        </div>

        {gameType === 'quiz-adventure' && (
          <AdventurePath total={total} current={session.index} theme={theme} />
        )}

        {gameType === 'math-battle' && (
          <div className="game-battle-arena">
            <div className="game-battle-avatar player">🧒</div>
            <span className="game-battle-vs">VS</span>
            <div className="game-battle-avatar enemy">🐉</div>
          </div>
        )}

        <article className={cardClass}>
          {question?.meta?.emoji && (
            <div className="game-question-emoji">{question.meta.emoji}</div>
          )}
          {!question?.meta?.emoji && theme.emoji && (
            <div className="game-question-emoji">{theme.emoji}</div>
          )}
          <h1 className="game-question-text">{question?.prompt}</h1>

          <div className="game-choices">
            {(question?.choices || []).map((choice, idx) => {
              let cls = 'game-choice'
              if (feedback) {
                if (String(choice) === String(question.answer)) cls += ' correct'
                else if (String(choice) === String(feedback.selected)) cls += ' wrong'
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={cls}
                  disabled={Boolean(feedback)}
                  onClick={() => handleAnswer(choice)}
                >
                  <span className="game-choice-letter">{CHOICE_LETTERS[idx] || idx + 1}</span>
                  {choice}
                </button>
              )
            })}
          </div>

          <FeedbackToast feedback={feedback} explanation={feedback?.explanation} />
        </article>
      </main>
    </div>
  )
}

export default function GenericQuizGame({ gameType }) {
  const theme = getGameTheme(gameType)
  return (
    <Suspense fallback={<GameLoading theme={theme} />}>
      <GameInner gameType={gameType} />
    </Suspense>
  )
}

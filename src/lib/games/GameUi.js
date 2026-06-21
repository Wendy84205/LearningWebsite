'use client'

import Link from 'next/link'

export function GameLoading({ theme, message = 'Đang chuẩn bị câu hỏi...' }) {
  return (
    <div className="game-loading" data-theme={theme?.id}>
      <div className="game-bg" aria-hidden="true">
        <div className="game-bg-blob game-bg-blob-a" />
        <div className="game-bg-blob game-bg-blob-b" />
        <div className="game-bg-grid" />
      </div>
      <div className="game-loading-card">
        <div className="game-loading-orbit">
          <span className="game-loading-emoji">{theme?.emoji || '🎮'}</span>
        </div>
        <h2>{message}</h2>
        <div className="game-loading-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

export function GameHud({
  theme,
  gradeSlug,
  label,
  session,
  config,
  timer,
  combo = 0,
  questionIndex = 0,
  totalQuestions = 0,
}) {
  const progress = totalQuestions ? Math.round((questionIndex / totalQuestions) * 100) : 0
  const timerUrgent = timer != null && timer <= 10

  return (
    <header className="game-hud">
      <Link href={`/learning/${gradeSlug}/games`} className="game-hud-back">
        <span className="material-symbols-outlined">arrow_back</span>
        <span>{label || theme?.label}</span>
      </Link>

      <div className="game-hud-center">
        <div className="game-progress-track">
          <div className="game-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="game-progress-label">
          Câu {Math.min(questionIndex + 1, totalQuestions)}/{totalQuestions}
        </span>
      </div>

      <div className="game-hud-stats">
        {combo > 1 && (
          <span className="game-combo-pill">
            <span className="material-symbols-outlined">bolt</span>
            x{combo} COMBO!
          </span>
        )}
        {session?.hearts != null && (
          <div className="game-hearts" aria-label={`${session.hearts} tim`}>
            {Array.from({ length: config?.hearts || 3 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined"
                style={{
                  color: i < session.hearts ? '#ff319f' : '#cbd5e1',
                  fontVariationSettings: i < session.hearts ? "'FILL' 1" : undefined,
                }}
              >
                favorite
              </span>
            ))}
          </div>
        )}
        {timer != null && (
          <span className={`game-stat-pill ${timerUrgent ? 'game-stat-urgent' : ''}`}>
            <span className="material-symbols-outlined">timer</span>
            {timer}s
          </span>
        )}
        <span className="game-stat-pill game-stat-score">
          <span className="material-symbols-outlined">star</span>
          {session?.score || 0}/{totalQuestions}
        </span>
      </div>
    </header>
  )
}

export function AdventurePath({ total, current, theme }) {
  if (!total) return null
  return (
    <div className="game-adventure-path" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`game-adventure-step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}
          style={{ '--step-color': theme?.accent }}
        >
          {i < current ? (
            <span className="material-symbols-outlined">check</span>
          ) : (
            <span>{i + 1}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export function FeedbackToast({ feedback, explanation }) {
  if (!feedback) return null
  return (
    <div className={`game-feedback ${feedback.isCorrect ? 'game-feedback-good' : 'game-feedback-bad'}`}>
      <span className="material-symbols-outlined">
        {feedback.isCorrect ? 'celebration' : 'psychology'}
      </span>
      <div>
        <strong>{feedback.isCorrect ? 'Tuyệt vời!' : 'Chưa đúng rồi!'}</strong>
        {explanation && <p>{explanation}</p>}
      </div>
    </div>
  )
}

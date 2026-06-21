'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useGamePage } from '@/lib/games/use-game-page'
import styles from '@/lib/games/shared-game.module.css'

function GameInner({ gameType, title, emoji }) {
  const searchParams = useSearchParams()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const worldId = parseInt(searchParams.get('world') || '1', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'

  const { session, question, loading, feedback, timer, config, handleAnswer, label } = useGamePage({
    gameType,
    gradeSlug,
    worldId,
    levelId,
    isBoss,
    activityTitle: title || label,
    completedLevel: isBoss ? `w${worldId}-boss` : `w${worldId}-l${levelId}`,
    extraParams: config?.subject ? { subject: config.subject } : {},
  })

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingIcon}>{emoji}</div>
        <h2>Đang chuẩn bị câu hỏi...</h2>
      </div>
    )
  }

  if (!session?.questions?.length) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingIcon}>📭</div>
        <h2>Chưa có câu hỏi published</h2>
        <Link href={`/learning/${gradeSlug}`} className={styles.backBtn}>Về trang học</Link>
      </div>
    )
  }

  const progress = session.questions.length
    ? Math.round((session.index / session.questions.length) * 100)
    : 0

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}/games`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          {label}
        </Link>
        <div className={styles.stats}>
          {session.hearts != null && (
            <div className={styles.hearts} aria-label={`${session.hearts} tim`}>
              {Array.from({ length: config.hearts || 3 }).map((_, i) => (
                <span key={i} className="material-symbols-outlined" style={{ color: i < session.hearts ? '#ef4444' : '#cbd5e1', fontVariationSettings: i < session.hearts ? "'FILL' 1" : undefined }}>
                  favorite
                </span>
              ))}
            </div>
          )}
          {timer != null && (
            <span className={styles.statPill}>
              <span className="material-symbols-outlined">timer</span>
              {timer}s
            </span>
          )}
          <span className={styles.statPill}>
            <span className="material-symbols-outlined">bolt</span>
            {session.score}/{session.questions.length}
          </span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <article className={styles.card}>
          <p className={styles.prompt}>{question?.prompt}</p>
          <div className={styles.choices}>
            {(question?.choices || []).map((choice, idx) => {
              let cls = styles.choiceBtn
              if (feedback) {
                if (String(choice) === String(question.answer)) cls += ` ${styles.choiceBtnCorrect}`
                else if (String(choice) === String(feedback.selected)) cls += ` ${styles.choiceBtnWrong}`
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={cls}
                  disabled={Boolean(feedback)}
                  onClick={() => handleAnswer(choice)}
                >
                  <span className="material-symbols-outlined">radio_button_unchecked</span>
                  {choice}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className={`${styles.feedback} ${feedback.isCorrect ? styles.feedbackGood : styles.feedbackBad}`}>
              {feedback.isCorrect ? 'Đúng rồi!' : 'Chưa chính xác.'}
              {feedback.explanation ? ` ${feedback.explanation}` : ''}
            </div>
          )}
        </article>
      </main>
    </div>
  )
}

export default function GenericQuizGame({ gameType, title, emoji = '🎮' }) {
  return (
    <Suspense fallback={<div className={styles.loading}><div className={styles.loadingIcon}>{emoji}</div></div>}>
      <GameInner gameType={gameType} title={title} emoji={emoji} />
    </Suspense>
  )
}

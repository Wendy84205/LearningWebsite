'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

const MODE_LABELS = {
  test: 'Bài kiểm tra',
  daily: 'Nhiệm vụ hôm nay',
  review: 'Ôn tập thông minh',
}

function TestContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const gradeSlug = params.gradeSlug || 'lop-1'
  const mode = searchParams.get('mode') || 'test'
  const subject = searchParams.get('subject') || ''
  const chapter = searchParams.get('chapter') || ''
  const profileId = typeof window !== 'undefined' ? localStorage.getItem('profileId') : ''

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profileId) {
      router.push('/profile-select')
      return
    }

    const query = new URLSearchParams({
      profileId,
      grade: gradeSlug,
      mode,
      limit: mode === 'test' ? '10' : '5',
    })
    if (subject) query.set('subject', subject)
    if (chapter) query.set('chapter', chapter)

    fetch(`/api/student/test?${query.toString()}`, { cache: 'no-store' })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Không thể tải bài làm.')
        setQuestions(data.questions || [])
      })
      .catch(err => setError(err.message || 'Không thể tải bài làm.'))
      .finally(() => setLoading(false))
  }, [profileId, gradeSlug, mode, subject, chapter, router])

  const answeredCount = Object.keys(answers).length
  const progressPct = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0
  const modeLabel = MODE_LABELS[mode] || MODE_LABELS.test

  const resultPreview = useMemo(() => {
    const checked = questions.map(question => {
      const selected = answers[question.id]
      return {
        questionId: question.id,
        selected,
        correctAnswer: question.correct,
        isCorrect: Number(selected) === Number(question.correct),
        difficulty: question.difficulty,
        subject: question.subject,
        topic: question.topic,
        skill: question.skill,
      }
    })
    const correct = checked.filter(item => item.isCorrect).length
    const scorePct = questions.length ? Math.round((correct / questions.length) * 100) : 0
    return { checked, correct, scorePct }
  }, [answers, questions])

  const submitTest = async () => {
    if (!profileId || submitting || answeredCount < questions.length) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/student/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          activityType: mode === 'daily' ? 'daily_mission' : mode === 'review' ? 'review' : 'test',
          title: modeLabel,
          grade: gradeSlug,
          subject: subject || questions[0]?.subject || 'Tổng hợp',
          topic: chapter || questions[0]?.topic || modeLabel,
          skill: questions[0]?.skill || '',
          gameType: 'quiz',
          answers: resultPreview.checked,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Không thể lưu kết quả.')

      localStorage.setItem('lastStars', String(data.result?.stars || 0))
      localStorage.setItem('lastGame', modeLabel)
      localStorage.setItem('lastLevel', `${resultPreview.correct}/${questions.length} câu đúng`)
      localStorage.setItem('lastXp', String(data.result?.xp || 0))
      localStorage.setItem('lastScorePct', String(data.result?.scorePct || 0))
      localStorage.setItem('lastLevelNumber', String(data.result?.level?.level || 1))
      localStorage.setItem('gradeSlug', gradeSlug)
      router.push('/game-results')
    } catch (err) {
      setError(err.message || 'Không thể lưu kết quả.')
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}`} className={styles.iconButton} aria-label="Về dashboard">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow}>{modeLabel}</span>
          <h1>Làm bài thật vui</h1>
        </div>
        <div className={styles.progressPill}>
          <span>{answeredCount}/{questions.length}</span>
          <strong>{progressPct}%</strong>
        </div>
      </header>

      {loading ? (
        <section className={styles.stateCard}>
          <span className="material-symbols-outlined">hourglass_top</span>
          <h2>Đang chuẩn bị câu hỏi...</h2>
          <p>Hệ thống đang lấy câu hỏi published từ Question Bank.</p>
        </section>
      ) : error ? (
        <section className={styles.stateCard}>
          <span className="material-symbols-outlined">error</span>
          <h2>Chưa thể mở bài</h2>
          <p>{error}</p>
        </section>
      ) : questions.length === 0 ? (
        <section className={styles.stateCard}>
          <span className="material-symbols-outlined">inventory_2</span>
          <h2>Chưa có câu hỏi phù hợp</h2>
          <p>Hãy publish câu hỏi trong Admin Question Bank hoặc bật usage cho bài kiểm tra.</p>
        </section>
      ) : (
        <>
          <section className={styles.heroCard}>
            <div>
              <span className={styles.heroBadge}>Question Bank Live</span>
              <h2>{modeLabel} gồm {questions.length} câu</h2>
              <p>Câu hỏi được lấy từ ngân hàng câu hỏi, trộn theo lớp, môn và mức độ phù hợp.</p>
            </div>
            <div className={styles.scorePreview}>
              <strong>{resultPreview.correct}</strong>
              <span>câu đúng hiện tại</span>
            </div>
          </section>

          <section className={styles.questionList}>
            {questions.map((question, index) => (
              <article key={question.id} className={styles.questionCard}>
                <div className={styles.questionTop}>
                  <span className={styles.questionNumber}>Câu {index + 1}</span>
                  <span className={styles.questionMeta}>{question.subject || 'Tổng hợp'} · {question.difficulty}</span>
                </div>
                <h3><span>{question.emoji}</span>{question.question}</h3>
                <div className={styles.optionsGrid}>
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[question.id] === optionIndex
                    return (
                      <button
                        key={`${question.id}-${optionIndex}`}
                        type="button"
                        className={`${styles.optionButton} ${selected ? styles.optionSelected : ''}`}
                        onClick={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}
                      >
                        <span>{String.fromCharCode(65 + optionIndex)}</span>
                        {option}
                      </button>
                    )
                  })}
                </div>
              </article>
            ))}
          </section>

          <footer className={styles.submitBar}>
            <div>
              <strong>{answeredCount === questions.length ? 'Sẵn sàng nộp bài' : 'Trả lời hết câu hỏi nhé'}</strong>
              <span>{answeredCount}/{questions.length} câu đã chọn</span>
            </div>
            <button
              type="button"
              className={styles.submitButton}
              onClick={submitTest}
              disabled={answeredCount < questions.length || submitting}
            >
              <span className="material-symbols-outlined">done_all</span>
              {submitting ? 'Đang lưu...' : 'Nộp bài'}
            </button>
          </footer>
        </>
      )}
    </main>
  )
}

export default function StudentTestPage() {
  return (
    <Suspense fallback={<div className={styles.page}>Đang tải...</div>}>
      <TestContent />
    </Suspense>
  )
}

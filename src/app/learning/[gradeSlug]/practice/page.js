'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getQuestionsForGame } from '@/lib/api/question-api'
import { saveGameResult } from '@/lib/api/student-api'
import { scoreAnswer } from '@/lib/scoring-service'
import styles from './page.module.css'

export default function PracticePage() {
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'
  const [subject, setSubject] = useState('')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState([])
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setIndex(0)
      setSelected(null)
      setFeedback(null)
      setScore(0)
      setAnswers([])
      try {
        const query = { grade: gradeSlug, game: 'quiz', limit: 8 }
        if (subject) query.subject = subject
        const data = await getQuestionsForGame(query)
        if (!cancelled) setQuestions(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setQuestions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [gradeSlug, subject, reloadKey])

  const q = questions[index]
  const finished = index >= questions.length && questions.length > 0

  const handleAnswer = async (choice, idx) => {
    if (selected != null || !q) return
    setSelected(idx)
    const correctIdx = Number(q.correct ?? 0)
    const options = Array.isArray(q.options) ? q.options : []
    const { isCorrect } = scoreAnswer({
      selected: idx,
      correctAnswer: correctIdx,
    })
    const answerRecord = {
      questionId: q.id,
      selected: idx,
      correctAnswer: correctIdx,
      isCorrect,
      difficulty: q.difficulty,
      subject: q.subject,
      skill: q.skill,
    }
    setAnswers(prev => [...prev, answerRecord])
    setFeedback({ isCorrect, explanation: q.explanation })
    if (isCorrect) setScore(s => s + 1)

    setTimeout(async () => {
      if (index >= questions.length - 1) {
        const profileId = localStorage.getItem('profileId')
        if (profileId) {
          await saveGameResult({
            profileId,
            activityType: 'practice',
            title: `Luyện tập${subject ? `: ${subject}` : ''}`,
            grade: gradeSlug,
            answers,
            correct: score + (isCorrect ? 1 : 0),
            total: questions.length,
          })
        }
        setIndex(i => i + 1)
      } else {
        setIndex(i => i + 1)
        setSelected(null)
        setFeedback(null)
      }
    }, 1000)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Luyện tập
        </Link>
        <span className={styles.score}>{score}/{questions.length || '–'}</span>
      </header>

      <main className={styles.main}>
        <div className={styles.filters}>
          {['', 'math', 'vietnamese', 'english'].map(s => (
            <button
              key={s || 'all'}
              type="button"
              className={`${styles.filterBtn} ${subject === s ? styles.filterActive : ''}`}
              onClick={() => setSubject(s)}
            >
              {s === '' ? 'Tất cả' : s === 'math' ? 'Toán' : s === 'vietnamese' ? 'Tiếng Việt' : 'Tiếng Anh'}
            </button>
          ))}
        </div>

        {loading && (
          <div className={styles.empty}>
            <span className="material-symbols-outlined">hourglass_top</span>
            Đang tải câu hỏi...
          </div>
        )}

        {!loading && questions.length === 0 && (
          <div className={styles.empty}>
            <span className="material-symbols-outlined">inventory_2</span>
            Chưa có câu hỏi published. Hãy thêm từ Admin Dashboard.
          </div>
        )}

        {!loading && finished && (
          <div className={styles.resultCard}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#10b981' }}>celebration</span>
            <h2>Hoàn thành luyện tập!</h2>
            <p>{score}/{questions.length} câu đúng</p>
            <button type="button" className={styles.primaryBtn} onClick={() => setReloadKey(k => k + 1)}>Luyện lại</button>
          </div>
        )}

        {!loading && q && !finished && (
          <article className={styles.card}>
            <span className={styles.badge}>Câu {index + 1}/{questions.length}</span>
            <h2 className={styles.prompt}>{q.q}</h2>
            <div className={styles.choices}>
              {(Array.isArray(q.options) ? q.options : []).map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.choiceBtn}
                  disabled={selected != null}
                  onClick={() => handleAnswer(opt, idx)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {feedback && (
              <p className={feedback.isCorrect ? styles.good : styles.bad}>
                {feedback.isCorrect ? 'Đúng!' : 'Chưa đúng.'}
                {feedback.explanation ? ` ${feedback.explanation}` : ''}
              </p>
            )}
          </article>
        )}
      </main>
    </div>
  )
}

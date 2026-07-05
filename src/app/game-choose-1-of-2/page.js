'use client'
import { useState, useEffect, useMemo, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getGradeData } from '@/lib/data'
import styles from './page.module.css'

const MASCOT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2NFSY-SBYXNcMqP_ktL-rpOuzhBlXjFLoSPz3QrhveKP_cAEe1db4z7mgL9hlGFHNz2ZA6E7qdmKChcaHK_ObrWivF76fDG00KLURFR4vyNh7Ng5Jl23m4YRHce9qT47Ouw1Rb8cRZoIHVGvQ3MY9h95_xc2KgUahFd8CHOCgiuNFgcnO8TOGXyCryTPjmwc20y-Q7sjkCPIxyfp94q7JUvukPpFoOeyA2OaclfHitMXv3CWDnWsoqk5sMjePhlQFn1yet2LRXf4'
const MASCOT_SAD = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe-gm_Khrg4SS_V0FeN7jfmDwqbgqkmHJ9TwASNEiJOWCVCfc-8uJatHGFMtv_VgJadl9FH-zNGq6x6nfr79RTEfoofWXt8nCco6N2nu8ldHFrkMW07YgPRogMUmtGc2UR2jnv1GszSU9VkJcNKPq99YzqaRoi9R6OMiGkIueKFx7cfDnRI9Vu0BSvJsWfQ4DpzjxDlwl-AAbusbE1iDXrhPNDH8NJyw_iM76Y6OXHu6qw-pr2ys4hYQsgPMdUypHP28jgdi9GzzA'

function GameContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = parseInt(searchParams.get('world') || '1', 10)
  const levelId = parseInt(searchParams.get('level') || '1', 10)
  const isBoss = searchParams.get('boss') === 'true'
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const gradeData = getGradeData(gradeSlug)
  const WORLDS = gradeData.WORLDS

  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [answerLog, setAnswerLog] = useState([])
  const [shake, setShake] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showIncorrect, setShowIncorrect] = useState(false)

  useEffect(() => {
    fetch(`/api/questions?grade=${gradeSlug}&world=${worldId}&level=${levelId}&boss=${isBoss}&game=choose-1-of-2`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuestions(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [gradeSlug, worldId, levelId, isBoss])

  if (loading || questions.length === 0) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={MASCOT_IMG} alt="Mascot" style={{ width: 120, height: 120, objectFit: 'contain', animation: 'none' }} />
          <h2 style={{ color: '#005da7', fontWeight: 800, marginTop: 16 }}>Đang chuẩn bị câu hỏi...</h2>
        </div>
      </div>
    )
  }

  const q = questions[qIndex]
  const isLast = qIndex === questions.length - 1
  const progress = (qIndex / questions.length) * 100
  const currentWorld = WORLDS.find(w => w.id === worldId) || WORLDS[0]

  const handleSpeaker = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(q.q)
      utterance.lang = 'vi-VN'
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleAnswer = async (optIdx) => {
    if (chosen !== null) return
    setChosen(optIdx)
    const isRight = optIdx === q.correct
    const currentAnswer = {
      questionId: q.id,
      selected: optIdx,
      correctAnswer: q.correct,
      isCorrect: isRight,
      difficulty: q.difficulty,
      subject: q.subject,
      topic: q.topic,
      skill: q.skill,
    }
    setAnswerLog(prev => [...prev, currentAnswer])

    if (isRight) {
      setCorrect(c => c + 1)
      setPulse(true)
      setShowSuccess(true)
      setTimeout(() => setPulse(false), 600)
    } else {
      setShake(true)
      setShowIncorrect(true)
      setTimeout(() => setShake(false), 600)
    }

    setTimeout(async () => {
      setShowSuccess(false)
      setShowIncorrect(false)

      if (isLast) {
        const finalCorrect = correct + (isRight ? 1 : 0)
        const starsEarned = finalCorrect === questions.length ? 3 : finalCorrect >= Math.ceil(questions.length / 2) ? 2 : 1
        const scorePct = Math.round((finalCorrect / questions.length) * 100)
        const completedLevelStr = isBoss ? `w${worldId}-boss` : `w${worldId}-l${levelId}`

        const profileId = localStorage.getItem('profileId')
        if (profileId) {
          try {
            const submitRes = await fetch('/api/student/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                profileId,
                activityType: 'game',
                title: isBoss ? `Trận đấu Trùm: ${currentWorld.bossName}` : `Bài học: ${q.topic || currentWorld.name}`,
                grade: gradeSlug,
                subject: q.subject || currentWorld.name,
                topic: q.topic || currentWorld.name,
                skill: q.skill || '',
                difficulty: q.difficulty || '',
                gameType: 'choose-1-of-2',
                completedLevel: completedLevelStr,
                worldId,
                levelId,
                isBoss,
                starsEarned,
                answers: [...answerLog, currentAnswer],
              }),
            })
            const submitData = await submitRes.json()
            if (submitRes.ok) {
              localStorage.setItem('lastXp', String(submitData.result?.xp || 0))
              localStorage.setItem('lastScorePct', String(submitData.result?.scorePct || 0))
              localStorage.setItem('lastLevelNumber', String(submitData.result?.level?.level || 1))
            }
          } catch (err) {
            console.error('Error saving activity:', err)
          }
        }
        localStorage.setItem('lastStars', starsEarned)
        localStorage.setItem('lastCorrect', String(finalCorrect))
        localStorage.setItem('lastTotal', String(questions.length))
        localStorage.setItem('lastScore', String(scorePct))
        localStorage.setItem('lastScorePct', String(scorePct))
        localStorage.setItem('lastGame', isBoss ? `Trận đấu Trùm: ${currentWorld.bossName}` : `Bài học: ${q.topic}`)
        localStorage.setItem('lastLevel', isBoss ? `${currentWorld.name} (Boss)` : `${currentWorld.name} - Ải ${levelId}`)
        localStorage.setItem('gradeSlug', gradeSlug)
        router.push(`/game-results?grade=${gradeSlug}&game=choose-1-of-2`)
      } else {
        setQIndex(i => i + 1)
        setChosen(null)
      }
    }, 1600)
  }

  return (
    <div className={styles.page}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Header */}
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}/map`} className={styles.closeBtn} aria-label="Thoát trò chơi">
          <span className="material-symbols-outlined">close</span>
        </Link>
        <div className={styles.progressWrap}>
          <div className={styles.progressContainer}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}>
              <div className={styles.progressDot} />
            </div>
          </div>
        </div>
        <div className={styles.starBadge}>
          <span className={`material-symbols-outlined ${styles.starIcon}`}>monetization_on</span>
          <span>{correct}</span>
        </div>
      </header>

      {/* Subject Badge */}
      <div className={styles.subjectBadgeWrap}>
        <span style={{
          background: currentWorld.bgColor || '#d4e3ff',
          color: currentWorld.textColor || '#005da7',
          border: `1px solid ${currentWorld.borderColor || '#a4c9ff'}`,
          borderRadius: '999px',
          padding: '4px 16px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {currentWorld.name} · {isBoss ? 'Trận đấu Trùm' : `Ải ${levelId}`}
        </span>
      </div>

      {/* Game Area */}
      <div className={styles.gameArea}>
        {/* Mascot + Question */}
        <div className={styles.mascotSection}>
          <div className={styles.mascotWrapper}>
            <img src={MASCOT_IMG} alt="Mascot" />
            <button className={styles.speakerBtn} onClick={handleSpeaker} aria-label="Đọc câu hỏi">
              <span className="material-symbols-outlined" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>volume_up</span>
            </button>
          </div>
          <h1 className={`${styles.questionText} ${shake ? styles.shake : ''} ${pulse ? styles.pulse : ''}`}>
            {q.q}
          </h1>
        </div>

        {/* Options */}
        <div className={styles.optionsGrid}>
          {q.options.map((opt, i) => {
            let stateClass = ''
            if (chosen !== null) {
              if (i === q.correct) stateClass = styles.optCorrect
              else if (i === chosen) stateClass = styles.optWrong
            }
            return (
              <button
                key={i}
                id={`option-${i}`}
                className={`${styles.optionBtn} ${stateClass}`}
                onClick={() => handleAnswer(i)}
                disabled={chosen !== null}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Success Overlay */}
      <div className={`${styles.successOverlay} ${showSuccess ? styles.visible : ''}`}>
        <div className={styles.feedbackContent}>
          <span className={`material-symbols-outlined ${styles.successStar}`}>auto_awesome</span>
          <div className={styles.feedbackBubble}>
            <h2>Tuyệt vời!</h2>
          </div>
        </div>
      </div>

      {/* Incorrect Overlay */}
      <div className={`${styles.incorrectOverlay} ${showIncorrect ? styles.visible : ''}`}>
        <div className={styles.feedbackContent}>
          <img src={MASCOT_SAD} alt="Mascot buồn" className={styles.mascotFeedbackImg} />
          <div className={styles.feedbackBubbleWrong}>
            <p>Gần đúng rồi, thử lại nhé!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GameChoose1of2Page() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#FFF9F2' }}>
        <h3 style={{ color: '#005da7', fontWeight: 800 }}>Đang tải trò chơi...</h3>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getStudentDashboard } from '@/lib/api/student-api'
import styles from './page.module.css'

export default function ReportPage() {
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'
  const [data, setData] = useState(null)

  useEffect(() => {
    const profileId = localStorage.getItem('profileId')
    if (!profileId) return
    getStudentDashboard(profileId, gradeSlug).then(setData).catch(console.error)
  }, [gradeSlug])

  const stats = data?.activityStats || {}
  const attempts = stats.attempts || []
  const weakSkills = stats.weakSkills || []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Báo cáo học tập
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.kpiRow}>
          <div className={styles.kpi}><strong>{stats.averageScore || 0}%</strong><span>Điểm TB</span></div>
          <div className={styles.kpi}><strong>{stats.totalXp || 0}</strong><span>Tổng XP</span></div>
          <div className={styles.kpi}><strong>{stats.streak || 0}</strong><span>Streak</span></div>
        </div>

        <section className={styles.panel}>
          <h2>Lịch sử hoạt động</h2>
          {attempts.length === 0 ? (
            <p className={styles.empty}>Chưa có hoạt động nào.</p>
          ) : (
            <ul className={styles.list}>
              {attempts.slice(0, 10).map(item => (
                <li key={item.id}>
                  <span className="material-symbols-outlined">
                    {item.activityType === 'test' ? 'assignment' : 'sports_esports'}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.correct}/{item.total} · {item.scorePct}% · +{item.xp} XP</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.panel}>
          <h2>Kỹ năng cần ôn</h2>
          {weakSkills.length === 0 ? (
            <p className={styles.empty}>Chưa có dữ liệu kỹ năng yếu.</p>
          ) : (
            <ul className={styles.list}>
              {weakSkills.map(item => (
                <li key={item.skill}>
                  <span className="material-symbols-outlined">psychology</span>
                  <div>
                    <strong>{item.skill}</strong>
                    <small>{item.wrongCount} lần sai</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link href={`/learning/${gradeSlug}/practice`} className={styles.cta}>
          <span className="material-symbols-outlined">fitness_center</span>
          Luyện tập ngay
        </Link>
      </main>
    </div>
  )
}

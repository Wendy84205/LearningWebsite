'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BADGE_CATALOG } from '@/lib/badge-catalog'
import { getStudentDashboard } from '@/lib/api/student-api'
import styles from './page.module.css'

export default function AchievementsPage() {
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const profileId = localStorage.getItem('profileId')
    if (!profileId) return
    getStudentDashboard(profileId, gradeSlug)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [gradeSlug])

  const stats = data?.activityStats || {}
  const earned = new Set((stats.badges || []).map(b => b.id))
  const levelInfo = stats.level || { level: 1, xp: 0, progressPct: 0 }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Thành tích
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.levelCard}>
          <div>
            <span className={styles.eyebrow}>Level {levelInfo.level}</span>
            <h1>{stats.totalXp || 0} XP</h1>
            <div className={styles.xpTrack}>
              <div className={styles.xpFill} style={{ width: `${levelInfo.progressPct || 0}%` }} />
            </div>
          </div>
          <div className={styles.miniStats}>
            <div><strong>{stats.streak || 0}</strong><small>Streak</small></div>
            <div><strong>{stats.completedGames || 0}</strong><small>Game</small></div>
            <div><strong>{stats.completedTests || 0}</strong><small>Kiểm tra</small></div>
          </div>
        </section>

        <h2 className={styles.sectionTitle}>Huy hiệu</h2>
        {loading ? (
          <p className={styles.loading}>Đang tải...</p>
        ) : (
          <div className={styles.badgeGrid}>
            {BADGE_CATALOG.map(badge => {
              const isEarned = earned.has(badge.id)
              return (
                <article key={badge.id} className={`${styles.badgeCard} ${isEarned ? styles.earned : styles.locked}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: isEarned ? "'FILL' 1" : undefined }}>
                    {badge.icon}
                  </span>
                  <strong>{badge.name}</strong>
                  <small>{badge.description}</small>
                  {!isEarned && <span className={styles.lockLabel}>Chưa mở</span>}
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

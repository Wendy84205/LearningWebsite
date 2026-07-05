'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getGradeSlug } from '@/lib/grades'
import styles from './page.module.css'

export default function ProfileSelectPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify parent session
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/parent-login')
          throw new Error('Unauthorized')
        }
        return res.json()
      })
      .then(data => {
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles)
        } else {
          router.push('/add-profile')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching parent session:', err)
        setLoading(false)
      })
  }, [router])

  const handleSelect = (profile) => {
    const slug = getGradeSlug(profile.grade)

    localStorage.setItem('profileId', profile.id)
    localStorage.setItem('profileName', profile.name)
    localStorage.setItem('mascotName', profile.mascotName || 'Tin Tin')
    localStorage.setItem('mascotEmoji', profile.mascotImage || '🤖')
    localStorage.setItem('gradeSlug', slug)
    router.push(`/learning/${slug}`)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Đang tải danh sách hồ sơ...</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={`material-symbols-outlined ${styles.headerIcon}`}>school</span>
          <h1>Chào mừng con đến với Học Vui!</h1>
          <p>Bé nào sẽ cùng học hôm nay thế nhỉ?</p>
        </div>

        <div className={styles.profileGrid}>
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className={styles.profileCard}
              id={`profile-card-${p.id}`}
            >
              <div className={styles.avatarBox}>
                {p.avatar}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{p.name}</div>
                <div className={styles.grade}>{p.grade}</div>
              </div>
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/add-profile" className="btn btn-primary" id="btn-add-profile-select" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined">add</span>
            Thêm hồ sơ bé mới
          </Link>
        </div>
      </div>
    </div>
  )
}

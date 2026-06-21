'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const AVATARS = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐸', '🐼', '🐨', '🐯', '🦁', '🐮']
const GRADES = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5']

export default function AddProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('Lớp 1')
  const [avatar, setAvatar] = useState('🐱')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/parent-login')
        }
      })
      .catch(() => {
        router.push('/parent-login')
      })
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, grade, avatar }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) return setError(data.error || 'Tạo hồ sơ thất bại')
      
      const GRADE_SLUGS = {
        'Nhà trẻ': 'nha-tre',
        'Mầm non': 'mam-non',
        'Lớp 1': 'lop-1',
        'Lớp 2': 'lop-2',
        'Lớp 3': 'lop-3',
        'Lớp 4': 'lop-4',
        'Lớp 5': 'lop-5',
      }
      
      localStorage.setItem('profileId', data.id)
      localStorage.setItem('profileName', data.name)
      localStorage.setItem('gradeSlug', GRADE_SLUGS[data.grade] || 'lop-1')
      router.push('/choose-companion')
    } catch (err) {
      setLoading(false)
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại.')
    }
  }


  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* Progress Step Bar */}
      <div className={styles.progressBar}>
        <div className={styles.step}>
          <div className={`${styles.stepDot} ${styles.stepActive}`}>1</div>
          <span>Hồ sơ</span>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.step}>
          <div className={styles.stepDot}>2</div>
          <span>Bạn đồng hành</span>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.step}>
          <div className={styles.stepDot}>3</div>
          <span>Bắt đầu!</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={`material-symbols-outlined ${styles.headerIcon}`}>child_care</span>
          <h1>Tạo hồ sơ cho bé</h1>
          <p>Hãy thiết lập thông tin cơ bản để cá nhân hóa lộ trình học nhé!</p>
        </div>

        <form id="form-add-profile" onSubmit={handleSubmit} className={styles.card}>
          {/* Avatar picker */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '6px' }}>palette</span>
              Chọn biểu tượng cho bé
            </label>
            <div className={styles.avatarGrid}>
              {AVATARS.map(a => (
                <button
                  key={a}
                  type="button"
                  className={`${styles.avatarBtn} ${avatar === a ? styles.avatarSelected : ''}`}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Child Name */}
          <div className={styles.field}>
            <label htmlFor="input-child-name">Tên của bé</label>
            <div className={styles.inputWrap}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>face</span>
              <input
                id="input-child-name"
                className={styles.inputField}
                type="text"
                placeholder="Ví dụ: Bé Miu, Ben..."
                value={name}
                onChange={e => setName(e.target.value)}
                required
                maxLength={30}
              />
            </div>
          </div>

          {/* Grade Selector */}
          <div className={styles.field}>
            <label>Lớp học của con</label>
            <div className={styles.gradeGrid}>
              {GRADES.map(g => (
                <button
                  key={g}
                  type="button"
                  className={`${styles.gradeBtn} ${grade === g ? styles.gradeBtnActive : ''}`}
                  onClick={() => setGrade(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className={styles.preview}>
            <div className={styles.previewAvatar}>{avatar}</div>
            <div className={styles.previewInfo}>
              <span className={styles.previewName}>{name || 'Tên bé'}</span>
              <span className={styles.previewGrade}>{grade}</span>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <span className="material-symbols-outlined">warning</span>
              {error}
            </div>
          )}

          <button
            id="btn-create-profile"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          >
            {loading ? 'Đang lưu hồ sơ...' : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Tiếp theo
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

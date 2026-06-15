'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const COMPANIONS = [
  { id: 1, name: 'Leo', emoji: '🦊', type: 'Cáo thông minh', color: '#005da7', desc: 'Nhanh nhẹn, thông minh và luôn tìm ra đáp án!' },
  { id: 2, name: 'Panda', emoji: '🐼', type: 'Gấu trúc vui vẻ', color: '#686000', desc: 'Bình tĩnh, kiên nhẫn và yêu thích âm nhạc!' },
  { id: 3, name: 'Mochi', emoji: '🐰', type: 'Thỏ dễ thương', color: '#7f5300', desc: 'Nhảy nhót, sáng tạo và rất yêu hội họa!' },
  { id: 4, name: 'Sparkle', emoji: '🦄', type: 'Kỳ lân huyền bí', color: '#0060ac', desc: 'Kỳ diệu, phép màu và luôn mang lại may mắn!' },
  { id: 5, name: 'Hoppy', emoji: '🐸', type: 'Ếch xanh thú vị', color: '#2976c7', desc: 'Vui tính, hài hước và giỏi kể chuyện!' },
  { id: 6, name: 'Splash', emoji: '🐬', type: 'Cá heo thân thiện', color: '#004883', desc: 'Thân thiện, tốt bụng và thích khám phá đại dương!' },
]

export default function ChooseCompanionPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!selected) return
    const profileId = localStorage.getItem('profileId')
    if (!profileId) return router.push('/add-profile')
    setLoading(true)
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profileId,
          mascotId: selected.id,
          mascotName: selected.name,
          mascotImage: selected.emoji,
          name: localStorage.getItem('profileName') || 'Bé',
        }),
      })
      localStorage.setItem('mascotEmoji', selected.emoji)
      localStorage.setItem('mascotName', selected.name)
      setLoading(false)
      router.push('/nursery-landing')
    } catch (err) {
      setLoading(false)
      alert('Đã xảy ra lỗi khi lưu bạn đồng hành. Vui lòng thử lại.')
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
          <div className={`${styles.stepDot} ${styles.stepDone}`}>1</div>
          <span>Hồ sơ</span>
        </div>
        <div className={`${styles.stepLine} ${styles.stepLineDone}`} />
        <div className={styles.step}>
          <div className={`${styles.stepDot} ${styles.stepActive}`}>2</div>
          <span>Bạn đồng hành</span>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.step}>
          <div className={styles.stepDot}>3</div>
          <span>Bắt đầu!</span>
        </div>
      </div>

      <div className={styles.header}>
        <h1>Chọn bạn đồng hành!</h1>
        <p>Người bạn này sẽ đồng hành cùng bé học tập và lớn lên mỗi ngày 🌟</p>
      </div>

      {/* Companion Cards */}
      <div className={styles.grid}>
        {COMPANIONS.map(c => (
          <button
            key={c.id}
            id={`companion-${c.id}`}
            className={`${styles.card} ${selected?.id === c.id ? styles.cardSelected : ''}`}
            onClick={() => setSelected(c)}
            style={{ '--card-color': c.color }}
          >
            <div className={styles.emoji}>{c.emoji}</div>
            <div className={styles.cardName}>{c.name}</div>
            <div className={styles.cardType}>{c.type}</div>
            <div className={styles.cardDesc}>{c.desc}</div>
            {selected?.id === c.id && (
              <div className={styles.selectedCheck}>✓</div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Footer Actions */}
      <div className={styles.footer}>
        {selected ? (
          <div className={styles.selectedInfo}>
            <span className={styles.selectedEmoji}>{selected.emoji}</span>
            <span>{selected.name} đã sẵn sàng cùng bạn nhỏ!</span>
          </div>
        ) : (
          <span className={styles.hint}>Chọn một người bạn để tiếp tục học tập nào →</span>
        )}
        <button
          id="btn-confirm-companion"
          className="btn btn-primary btn-lg"
          onClick={handleConfirm}
          disabled={!selected || loading}
        >
          {loading ? '⏳ Đang lưu...' : 'Bắt đầu học ngay! 🚀'}
        </button>
      </div>
    </div>
  )
}

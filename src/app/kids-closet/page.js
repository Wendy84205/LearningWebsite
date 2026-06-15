'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

const ALL_ACCESSORIES = [
  { id: 'hat', label: 'Mũ phép thuật', icon: '🎩', cost: 50, category: 'hat' },
  { id: 'crown', label: 'Vương miện', icon: '👑', cost: 80, category: 'hat' },
  { id: 'bow', label: 'Nơ hồng', icon: '🎀', cost: 30, category: 'hat' },
  { id: 'scarf', label: 'Khăn quàng', icon: '🧣', cost: 40, category: 'neck' },
  { id: 'bowtie', label: 'Nơ cổ', icon: '🎗️', cost: 25, category: 'neck' },
  { id: 'glasses', label: 'Kính mắt', icon: '🕶️', cost: 35, category: 'face' },
  { id: 'heart', label: 'Trái tim', icon: '❤️', cost: 20, category: 'misc' },
  { id: 'wand', label: 'Cây phép', icon: '🪄', cost: 60, category: 'misc' },
]

export default function KidsClosetPage() {
  const router = useRouter()
  const [equipped, setEquipped] = useState([])
  const [stars, setStars] = useState(0)
  const [mascot, setMascot] = useState({
    name: 'Tin Tin',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvdz9atv7ARpvqQLQcBC-nUsmg4xE1NcZ9EKHi3pdIpmzdujb3-kikQVWw4tBLFITAzvANKzSCe0NlqVat2TRwlp6b-mJ-xBvzm4dKeJu-iELiFhzLYcLVoc7tbcEnuOYszTSiVWsW52WX4Q6bGRJExXAohb4mGeMLqcMoGkZiVBx6oTpGwqt3df4aSWNCGMPeZoHyyNOV2MOdWRNrPPnUjKV1hlqrBOpRSOeDSq5vB3tuxPfqXjIUthHfISQ-a0F_O2u4jo6AHeA'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const mn = localStorage.getItem('mascotName') || 'Tin Tin'
    setTimeout(() => {
      setMascot(prev => ({ ...prev, name: mn }))
    }, 0)

    const profileId = localStorage.getItem('profileId')
    if (profileId) {
      // Fetch stats
      fetch(`/api/progress?profileId=${profileId}`)
        .then(r => r.json())
        .then(d => {
          if (d && !d.error) setStars(d.stars)
        })
        .catch(err => console.error('Error fetching progress:', err))

      // Fetch profile details for equipped items and mascot image
      fetch(`/api/profile?profileId=${profileId}`)
        .then(r => r.json())
        .then(p => {
          if (p && !p.error) {
            if (p.equippedAccessories) {
              setEquipped(p.equippedAccessories.split(',').filter(Boolean))
            }
            if (p.mascotName) {
              setMascot({
                name: p.mascotName,
                image: p.mascotImage || '🤖'
              })
            }
          }
        })
        .catch(err => console.error('Error fetching profile:', err))
    }
  }, [])

  const toggleAccessory = (id) => {
    setEquipped(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSaveOutfit = async () => {
    const profileId = localStorage.getItem('profileId')
    if (!profileId) return
    setSaving(true)
    try {
      const res = await fetch('/api/closet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, equippedAccessories: equipped.join(',') }),
      })
      if (res.ok) {
        alert('Đã lưu trang phục thành công! ✨')
      } else {
        alert('Lưu trang phục thất bại. Vui lòng thử lại.')
      }
    } catch (err) {
      alert('Đã xảy ra lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const isMascotEmoji = mascot.image && !mascot.image.startsWith('http') && !mascot.image.startsWith('/')

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/nursery-landing" className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className={styles.title}>Tủ đồ của bé</h1>
        </div>
        <div className={styles.starBadge}>
          <span className={`material-symbols-outlined ${styles.starIcon}`}>monetization_on</span>
          <span>{stars}</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className={styles.content}>
        {/* Left Preview Panel */}
        <div className={styles.previewPanel}>
          <h2 className={styles.previewTitle}>Xem trước bạn đồng hành</h2>
          
          <div className={styles.mascotStage}>
            {isMascotEmoji ? (
              <span className={styles.mascotBigEmoji}>{mascot.image}</span>
            ) : (
              <img
                src={mascot.image}
                className={styles.mascotBig}
                alt={mascot.name}
              />
            )}

            {/* Overlay Accessories */}
            <div className={styles.equippedOverlay}>
              {equipped.map(id => {
                const acc = ALL_ACCESSORIES.find(a => a.id === id)
                if (!acc) return null

                let overlayClass = ''
                if (acc.category === 'hat') overlayClass = styles.overlayHat
                else if (acc.category === 'neck') overlayClass = styles.overlayNeck
                else if (acc.category === 'face') overlayClass = styles.overlayFace
                else if (acc.category === 'misc') overlayClass = styles.overlayMisc

                return (
                  <span key={id} className={overlayClass}>
                    {acc.icon}
                  </span>
                )
              })}
            </div>
          </div>

          <p className={styles.mascotName}>{mascot.name}</p>

          <button
            id="btn-save-outfit"
            className="btn btn-primary btn-lg"
            onClick={handleSaveOutfit}
            disabled={saving}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {saving ? '⏳ Đang lưu...' : '💾 Lưu trang phục'}
          </button>
        </div>

        {/* Right Accessories Selector */}
        <div className={styles.shopPanel}>
          <h2 className={styles.shopTitle}>Chọn phụ kiện cho bé</h2>
          <div className={styles.accGrid}>
            {ALL_ACCESSORIES.map(acc => {
              const isOn = equipped.includes(acc.id)
              return (
                <button
                  key={acc.id}
                  id={`acc-${acc.id}`}
                  className={`${styles.accCard} ${isOn ? styles.accOn : ''}`}
                  onClick={() => toggleAccessory(acc.id)}
                >
                  <span className={styles.accEmoji}>{acc.icon}</span>
                  <span className={styles.accLabel}>{acc.label}</span>
                  <div className={styles.accCost}>
                    <span className={`material-symbols-outlined ${styles.accCostIcon}`}>monetization_on</span>
                    <span>{acc.cost}</span>
                  </div>
                  {isOn && <div className={styles.accCheck}>✓</div>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getGradeData } from '@/lib/data'
import styles from './page.module.css'

const EMOJI_TO_MATERIAL_ICON = {
  // Worlds
  "🏡": "home",
  "📖": "menu_book",
  "🧩": "extension",
  "➕": "calculate",
  "🌎": "public",

  // Medals / Badge
  "🥉": { name: "workspace_premium", color: "#cd7f32" },
  "🥈": { name: "workspace_premium", color: "#c0c0c0" },
  "⭐": { name: "star", color: "#ffc800" },
  "💎": { name: "diamond", color: "#00b0ff" },
  "🌟": { name: "stars", color: "#ff9100" },
  "🏆": { name: "emoji_events", color: "#ffc800" }
}

function getMaterialIcon(emoji, defaultIcon = "help") {
  const match = EMOJI_TO_MATERIAL_ICON[emoji]
  if (!match) return defaultIcon
  return typeof match === "string" ? match : match.name
}


export default function GradeMapPage() {
  const router = useRouter()
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'

  const { WORLDS: STATIC_WORLDS } = getGradeData(gradeSlug)

  const [completed, setCompleted] = useState([]) // danh sách các màn đã hoàn thành (ví dụ: 'w1-l1', 'w1-boss')
  const [stars, setStars] = useState(0)
  const [streak, setStreak] = useState(0)
  const [profileName, setProfileName] = useState('Học sinh')
  const [avatar, setAvatar] = useState('🐱')
  const [worlds, setWorlds] = useState(STATIC_WORLDS)
  const [speechSpeaking, setSpeechSpeaking] = useState(false)

  // State điều khiển Modals
  const [activeWorld, setActiveWorld] = useState(null) // thế giới đang mở level selector
  const [goldMedalModalOpen, setGoldMedalModalOpen] = useState(false) // mở popup huy chương vàng

  const [confettiPieces, setConfettiPieces] = useState([])
  const [promoting, setPromoting] = useState(false)

  // Lấy tên tiếng Việt của lớp học để đọc âm thanh
  const getGradeNameVi = (slug) => {
    if (slug === 'nha-tre') return 'Nhà trẻ'
    if (slug === 'mam-non') return 'Mầm non'
    if (slug === 'lop-1') return 'Lớp 1'
    if (slug === 'lop-2') return 'Lớp 2'
    if (slug === 'lop-3') return 'Lớp 3'
    if (slug === 'lop-4') return 'Lớp 4'
    if (slug === 'lop-5') return 'Lớp 5'
    return 'Lớp học'
  }

  useEffect(() => {
    const profileId = localStorage.getItem('profileId')
    const name = localStorage.getItem('profileName')
    if (name) {
      setTimeout(() => setProfileName(name), 0)
    }

    if (profileId) {
      fetch(`/api/progress?profileId=${profileId}`)
        .then(r => r.json())
        .then(d => {
          if (d && !d.error) {
            setCompleted(d.completedLevels ? d.completedLevels.split(',').filter(Boolean) : [])
            setStars(d.stars ?? 0)
            setStreak(d.streak ?? 0)
          }
        })
        .catch(err => console.error('Error fetching progress:', err))

      fetch(`/api/profile?profileId=${profileId}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.avatar) setAvatar(data.avatar)
        })
        .catch(err => console.error('Error fetching profile:', err))
    }

    fetch(`/api/cms?module=learning-map&grade=${gradeSlug}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.worlds) && data.worlds.length > 0) {
          setWorlds(data.worlds)
        }
      })
      .catch(err => console.error('Error fetching CMS learning map:', err))

    // Sinh confetti động bằng CSS sau khi mount
    const pieces = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`,
      color: ['#ffc107', '#ff5722', '#4caf50', '#00bcd4', '#9c27b0', '#e91e63'][Math.floor(Math.random() * 6)],
      size: `${8 + Math.random() * 8}px`
    }))
    setTimeout(() => {
      setConfettiPieces(pieces)
    }, 0)
  }, [gradeSlug])

  // Kiểm tra thế giới có được mở khóa
  const isWorldUnlocked = (world) => {
    if (world.id === 1) return true
    const prevWorldBossId = `w${world.id - 1}-boss`
    return completed.includes(prevWorldBossId)
  }

  // Kiểm tra ải có được mở khóa
  const isLevelUnlocked = (world, level) => {
    if (!isWorldUnlocked(world)) return false
    if (level.id === 1) return true
    const prevLevelId = `w${world.id}-l${level.id - 1}`
    return completed.includes(prevLevelId)
  }

  // Kiểm tra trận Boss có được mở khóa
  const isBossUnlocked = (world) => {
    if (!isWorldUnlocked(world)) return false
    return world.levels.every(l => completed.includes(`w${world.id}-l${l.id}`))
  }

  // Kiểm tra đã hoàn tất toàn bộ thế giới của lớp này
  const isAllWorldsCompleted = useMemo(() => {
    if (worlds.length === 0) return false
    return worlds.every(w => completed.includes(`w${w.id}-boss`))
  }, [completed, worlds])

  const handleSpeakerClick = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = `Chào ${profileName}! Đây là lộ trình học tập khối ${getGradeNameVi(gradeSlug)} thế giới kỳ diệu. Hãy cùng vượt qua các thế giới và giành Huy chương Vàng nhé!`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      utterance.onstart = () => setSpeechSpeaking(true)
      utterance.onend = () => setSpeechSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  // Phát âm thanh chiến thắng 8-bit bằng Web Audio API
  const playVictorySound = () => {
    if (typeof window === 'undefined') return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    const notes = [
      { f: 261.63, d: 0.15 }, // C4
      { f: 329.63, d: 0.15 }, // E4
      { f: 392.00, d: 0.15 }, // G4
      { f: 523.25, d: 0.40 }  // C5
    ]

    let time = ctx.currentTime
    notes.forEach(n => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(n.f, time)
      
      gain.gain.setValueAtTime(0.1, time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + n.d)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(time)
      osc.stop(time + n.d)
      
      time += n.d - 0.05
    })
  }

  // Click vào Boss hoặc World 6
  const handleGoldMedalClick = () => {
    if (!isAllWorldsCompleted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance('Con cần vượt qua các trận Boss của tất cả thế giới học tập để mở khóa Huy chương Vàng nhé!')
        utter.lang = 'vi-VN'
        window.speechSynthesis.speak(utter)
      }
      return
    }

    setGoldMedalModalOpen(true)
    playVictorySound()

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = `Chúc mừng bé ${profileName}! Con đã hoàn thành xuất sắc toàn bộ hành trình học tập ${getGradeNameVi(gradeSlug)}. Con là một Nhà Thám Hiểm Tri Thức tuyệt vời và đã giành được Huy Chương Vàng. Hãy tiếp tục khám phá những điều mới mỗi ngày nhé!`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleWorldClick = (world) => {
    if (!isWorldUnlocked(world)) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(`Thế giới ${world.name} đang bị khóa. Hãy hoàn thành các thế giới trước đó nhé!`)
        utter.lang = 'vi-VN'
        window.speechSynthesis.speak(utter)
      }
      return
    }
    setActiveWorld(world)
  }

  const handlePromote = async () => {
    const profileId = localStorage.getItem('profileId')
    if (!profileId) return
    setPromoting(true)
    try {
      const res = await fetch('/api/profile/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('gradeSlug', data.nextGradeSlug)
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
          const utter = new SpeechSynthesisUtterance(`Chúc mừng con đã lên ${data.nextGradeName}!`)
          utter.lang = 'vi-VN'
          window.speechSynthesis.speak(utter)
        }
        setGoldMedalModalOpen(false)
        router.push(`/learning/${data.nextGradeSlug}/map`)
        setTimeout(() => {
          window.location.reload()
        }, 800)
      } else {
        alert(data.error || 'Đã xảy ra lỗi khi lên lớp.')
      }
    } catch (err) {
      console.error(err)
      alert('Đã xảy ra lỗi kết nối.')
    } finally {
      setPromoting(false)
    }
  }

  // Tọa độ vẽ các Node thế giới trên map
  const NODE_POSITIONS = [
    { top: '80px',  left: '160px' }, // World 1
    { top: '280px', left: '240px' }, // World 2
    { top: '480px', left: '100px' }, // World 3
    { top: '680px', left: '220px' }, // World 4
    { top: '880px', left: '120px' }  // World 5
  ]

  return (
    <div className={styles.page}>
      {/* Top App Bar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href={`/learning/${gradeSlug}`} className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className={styles.title}>Bản đồ {getGradeNameVi(gradeSlug)}</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.starBadge}>
            <span className={`material-symbols-outlined ${styles.starIcon}`}>monetization_on</span>
            <span>{stars}</span>
          </div>
          <div className={styles.avatar}>
            <span className={styles.avatarEmoji}>{avatar}</span>
          </div>
        </div>
      </header>

      {/* Progress Summary */}
      <div className={styles.progressSummary}>
        <div className={styles.summaryItem}>
          <span className={`material-symbols-outlined ${styles.summaryIcon}`} style={{ color: 'var(--primary, #1cb0f6)' }}>map</span>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryVal}>
              {worlds.filter(w => completed.includes(`w${w.id}-boss`)).length}/{worlds.length}
            </div>
            <div className={styles.summaryLabel}>Thế giới xong</div>
          </div>
        </div>
        <div className={styles.summaryItem}>
          <span className={`material-symbols-outlined ${styles.summaryIcon}`} style={{ color: '#ffc800', fontVariationSettings: "'FILL' 1" }}>star</span>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryVal}>{stars}</div>
            <div className={styles.summaryLabel}>Tổng số sao</div>
          </div>
        </div>
        <div className={styles.summaryItem}>
          <span className={`material-symbols-outlined ${styles.summaryIcon}`} style={{ color: '#ff9100', fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryVal}>{streak}</div>
            <div className={styles.summaryLabel}>Chuỗi ngày</div>
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      <main className={styles.gardenBg}>
        {/* Floating Speaker Button */}
        <button
          className={`${styles.floatingSpeaker} ${speechSpeaking ? 'animate-ping' : ''}`}
          onClick={handleSpeakerClick}
          title="Nghe hướng dẫn"
        >
          <span className={`material-symbols-outlined ${styles.speakerIcon}`}>volume_up</span>
        </button>

        <div className={styles.windingPath}>
          {/* Path SVG */}
          <svg className={styles.pathSvg} viewBox="0 0 400 1100">
            <path d="M200,0 C350,180 50,360 200,540 C350,720 50,900 200,1080" />
          </svg>

          {/* Render Grade World Nodes */}
          {worlds.map((world, idx) => {
            const unlocked = isWorldUnlocked(world)
            const isDone = completed.includes(`w${world.id}-boss`)
            const current = unlocked && !isDone
            const pos = NODE_POSITIONS[idx % NODE_POSITIONS.length]

            return (
              <div
                key={world.id}
                className={styles.nodeContainer}
                style={{ ...pos }}
                onClick={() => handleWorldClick(world)}
              >
                <div className={styles.nodeCol}>
                  {/* Huy chương treo trên đầu thế giới */}
                  <div className={styles.medalPlacement}>
                    {isDone ? (
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '32px',
                          color: EMOJI_TO_MATERIAL_ICON[world.medal]?.color || '#ffc800',
                          fontVariationSettings: "'FILL' 1"
                        }}
                      >
                        {getMaterialIcon(world.medal, 'workspace_premium')}
                      </span>
                    ) : current ? (
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '32px',
                          color: 'var(--error, #ea4335)',
                          fontVariationSettings: "'FILL' 1"
                        }}
                      >
                        track_changes
                      </span>
                    ) : null}
                  </div>

                  {/* World Circle Button */}
                  <div
                    className={`${styles.worldCircle} ${current ? styles.worldCircleActive : ''} ${!unlocked ? styles.worldCircleLocked : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${world.bgColor}, #ffffff)`,
                      border: `4px solid ${world.borderColor}`
                    }}
                  >
                    {!unlocked && (
                      <div className={styles.lockBadge}>
                        <span className={`material-symbols-outlined ${styles.lockIcon}`}>lock</span>
                      </div>
                    )}
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '44px',
                        color: world.borderColor,
                        fontVariationSettings: "'FILL' 1"
                      }}
                    >
                      {getMaterialIcon(world.icon, 'sports_esports')}
                    </span>
                  </div>

                  {/* Label Thế giới */}
                  <div className={styles.worldLabel}>
                    <div className={styles.worldTitle}>{world.name}</div>
                    <div className={styles.worldStatus}>
                      {isDone ? 'ĐÃ XONG' : unlocked ? 'ĐANG CHƠI' : 'ĐANG KHÓA'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Huy chương Vàng Boss cuối */}
          <div
            className={styles.nodeContainer}
            style={{ top: `${80 + worlds.length * 200}px`, left: '50%', transform: 'translateX(-50%)' }}
            onClick={handleGoldMedalClick}
          >
            <div className={styles.nodeCol}>
              <div className={`${styles.bossCircle} ${isAllWorldsCompleted ? styles.bossCircleActive : styles.bossCircleLocked}`}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '72px',
                    color: isAllWorldsCompleted ? '#ffc800' : '#90a4ae',
                    fontVariationSettings: "'FILL' 1"
                  }}
                >
                  emoji_events
                </span>
              </div>
              <div
                className={styles.bossBadge}
                style={{
                  background: isAllWorldsCompleted ? 'var(--primary, #1cb0f6)' : '#b0bec5',
                  color: 'white'
                }}
              >
                HUY CHƯƠNG VÀNG
              </div>
            </div>
          </div>
        </div>

        <div className={styles.grassLayer} />
      </main>

      {/* Level Selector Modal */}
      {activeWorld && (
        <div className={styles.modalOverlay} onClick={() => setActiveWorld(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '44px',
                  color: activeWorld.borderColor,
                  fontVariationSettings: "'FILL' 1"
                }}
              >
                {getMaterialIcon(activeWorld.icon, 'sports_esports')}
              </span>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: activeWorld.textColor }}>{activeWorld.name}</h3>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{activeWorld.desc}</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setActiveWorld(null)}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.levelsList}>
                {/* Render normal levels */}
                {activeWorld.levels.map(lvl => {
                  const unlocked = isLevelUnlocked(activeWorld, lvl)
                  const isDone = completed.includes(`w${activeWorld.id}-l${lvl.id}`)

                  return (
                    <div
                      key={lvl.id}
                      className={`${styles.levelRow} ${isDone ? styles.levelRowCompleted : ''} ${!unlocked ? styles.levelRowLocked : ''}`}
                    >
                      <div className={styles.levelInfo}>
                        <div className={styles.levelTitleRow}>
                          <span className={styles.levelTitle}>Ải {lvl.id}: {lvl.title}</span>
                          {isDone && (
                            <div className={styles.levelStars}>
                              <span className={`material-symbols-outlined ${styles.starMini}`}>star</span>
                              <span className={`material-symbols-outlined ${styles.starMini}`}>star</span>
                              <span className={`material-symbols-outlined ${styles.starMini}`}>star</span>
                            </div>
                          )}
                        </div>
                        <span className={styles.levelDesc}>{lvl.desc}</span>
                      </div>
                      
                      {unlocked ? (
                        <Link
                          href={`${lvl.game}&grade=${gradeSlug}`}
                          className={styles.playBtn}
                          style={{
                            background: activeWorld.borderColor,
                            color: 'white'
                          }}
                        >
                          {isDone ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>replay</span>
                              CHƠI LẠI
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                              BẮT ĐẦU
                            </span>
                          )}
                        </Link>
                      ) : (
                        <button className={`${styles.playBtn} ${styles.playBtnLocked}`} disabled>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                            KHÓA
                          </span>
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* Boss Level */}
                <div
                  className={`${styles.levelRow} ${completed.includes(`w${activeWorld.id}-boss`) ? styles.levelRowCompleted : ''} ${!isBossUnlocked(activeWorld) ? styles.levelRowLocked : ''}`}
                  style={{ border: '2px dashed #fbbf24', background: isBossUnlocked(activeWorld) ? '#fffbeb' : '#f8f9fa' }}
                >
                  <div className={styles.levelInfo}>
                    <div className={styles.levelTitleRow}>
                      <span className={styles.levelTitle} style={{ color: '#b45309', fontWeight: 900 }}>BOSS: {activeWorld.bossName}</span>
                      {completed.includes(`w${activeWorld.id}-boss`) && (
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: '24px',
                            marginLeft: '8px',
                            color: EMOJI_TO_MATERIAL_ICON[activeWorld.medal]?.color || '#ffc800',
                            fontVariationSettings: "'FILL' 1",
                            verticalAlign: 'middle'
                          }}
                        >
                          {getMaterialIcon(activeWorld.medal, 'workspace_premium')}
                        </span>
                      )}
                    </div>
                    <span className={styles.levelDesc}>{activeWorld.bossDesc}</span>
                  </div>

                  {isBossUnlocked(activeWorld) ? (
                    <Link
                      href={`${activeWorld.bossGame}&grade=${gradeSlug}`}
                      className={styles.playBtn}
                      style={{
                        background: 'linear-gradient(135deg, #d97706, #b45309)',
                        color: 'white'
                      }}
                    >
                      {completed.includes(`w${activeWorld.id}-boss`) ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>replay</span>
                          ĐẤU LẠI
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ffc800', fontVariationSettings: "'FILL' 1" }}>bolt</span>
                          CHIẾN BOSS
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button className={`${styles.playBtn} ${styles.playBtnLocked}`} disabled>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                        CẦN XONG ẢI
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gold Medal Congratulations Modal */}
      {goldMedalModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setGoldMedalModalOpen(false)}>
          {/* Confetti Animation Layer */}
          <div className={styles.confettiContainer}>
            {confettiPieces.map(p => (
              <div
                key={p.id}
                className={styles.confettiPiece}
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size
                }}
              />
            ))}
          </div>

          <div
            className={`${styles.modalContent} ${styles.goldModalContent}`}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.modalCloseBtn} onClick={() => setGoldMedalModalOpen(false)}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
            </button>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div className={styles.goldMedalAnimation}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '96px',
                    color: '#ffc800',
                    fontVariationSettings: "'FILL' 1"
                  }}
                >
                  emoji_events
                </span>
              </div>
              <h2 className={styles.goldMedalTitle}>CHIẾN THẮNG HUY CHƯƠNG VÀNG!</h2>
              <p className={styles.goldMedalText}>
                Chúc mừng bé <strong>{profileName}</strong> đã xuất sắc hoàn thành toàn bộ hành trình học tập {getGradeNameVi(gradeSlug)}!<br /><br />
                Con là một <strong>Nhà Thám Hiểm Tri Thức</strong> tuyệt vời. Hãy tiếp tục khám phá những điều mới mẻ mỗi ngày nhé!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                {gradeSlug !== 'lop-5' && (
                  <button
                    className={styles.playBtn}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      width: '100%',
                      fontSize: '16px',
                      fontWeight: 800,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={handlePromote}
                    disabled={promoting}
                  >
                    {promoting ? (
                      'ĐANG LÊN LỚP...'
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        LÊN LỚP KẾ TIẾP!
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>rocket_launch</span>
                      </span>
                    )}
                  </button>
                )}
                <button
                  className={styles.playBtn}
                  style={{
                    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
                    color: 'white',
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px'
                  }}
                  onClick={() => setGoldMedalModalOpen(false)}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    ĐÓNG
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ff4081', fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mascot Encouragement */}
      <div className={styles.mascotWrapper}>
        <div className={styles.mascotBubble}>
          <p className={styles.mascotBubbleText}>
            {completed.filter(c => c.endsWith('-boss')).length === 0
              ? `Chào ${profileName}! Nhấn vào thế giới đầu tiên để bắt đầu cuộc hành trình nhé! 🎉`
              : isAllWorldsCompleted
              ? `Tuyệt vời ông mặt trời ${profileName}! Nhấn vào Huy chương Vàng 🏆 để nhận giải thưởng thôi!`
              : `Cố lên ${profileName}! Đã hoàn thành ${completed.filter(c => c.endsWith('-boss')).length}/${worlds.length} thế giới rồi! 💪`}
          </p>
          <div className={styles.mascotBubbleArrow} />
        </div>
        <div className={styles.mascotImgContainer}>
          <img
            className={styles.mascotImg}
            alt="Mascot Robot"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvdz9atv7ARpvqQLQcBC-nUsmg4xE1NcZ9EKHi3pdIpmzdujb3-kikQVWw4tBLFITAzvANKzSCe0NlqVat2TRwlp6b-mJ-xBvzm4dKeJu-iELiFhzLYcLVoc7tbcEnuOYszTSiVWsW52WX4Q6bGRJExXAohb4mGeMLqcMoGkZiVBx6oTpGwqt3df4aSWNCGMPeZoHyyNOV2MOdWRNrPPnUjKV1hlqrBOpRSOeDSq5vB3tuxPfqXjIUthHfISQ-a0F_O2u4jo6AHeA"
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.mobileBottomNav}>
        <Link href={`/learning/${gradeSlug}`} className={styles.navItem}>
          <span className="material-symbols-outlined">home</span>
          <span>Trang chủ</span>
        </Link>
        <Link href={`/learning/${gradeSlug}/map`} className={`${styles.navItem} ${styles.navItemActive}`}>
          <span className="material-symbols-outlined">map</span>
          <span>Lộ trình</span>
        </Link>
        <Link href="/parent-dashboard" className={styles.navItem}>
          <span className="material-symbols-outlined">monitoring</span>
          <span>Báo cáo</span>
        </Link>
        <Link href="/kids-closet" className={styles.navItem}>
          <span className="material-symbols-outlined">shopping_bag</span>
          <span>Tủ đồ</span>
        </Link>
      </nav>
    </div>
  )
}

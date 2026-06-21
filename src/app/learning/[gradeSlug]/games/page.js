'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { GAME_THEMES } from '@/lib/games/game-themes'
import '@/lib/games/game-ui.css'
import styles from './page.module.css'

const HUB_ITEMS = [
  { theme: GAME_THEMES['quiz-adventure'], href: '/game-quiz-adventure', badge: 'Mới' },
  { theme: GAME_THEMES['math-battle'], href: '/game-math-battle', badge: 'Hot' },
  { theme: GAME_THEMES['word-match'], href: '/game-word-match', badge: 'Ghép' },
  { theme: GAME_THEMES['memory-card'], href: '/game-memory-card', badge: 'Nhớ' },
  { theme: GAME_THEMES['choose-1-of-2'], href: '/game-choose-1-of-2', badge: 'Classic' },
  { theme: GAME_THEMES['listen-and-select'], href: '/game-listen-and-select', badge: 'Nghe' },
  { theme: GAME_THEMES['simple-matching'], href: '/game-simple-matching', badge: 'Match' },
]

export default function GamesHubPage() {
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.blobA} />
        <div className={styles.blobB} />
      </div>

      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Trò chơi học tập
        </Link>
        <span className={styles.headerBadge}>
          <span className="material-symbols-outlined">verified</span>
          Question Bank
        </span>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroIcon}>🎮</div>
          <h1>Trung tâm trò chơi</h1>
          <p>Chọn game yêu thích — câu hỏi lấy tự động từ ngân hàng câu hỏi đã publish</p>
        </section>

        <div className={styles.grid}>
          {HUB_ITEMS.map(({ theme, href, badge }) => (
            <Link
              key={theme.id}
              href={`${href}?grade=${gradeSlug}`}
              className={styles.card}
              style={{
                '--card-accent': theme.accent,
                '--card-accent-dark': theme.accentDark,
              }}
            >
              <span className={styles.cardBadge}>{badge}</span>
              <div className={styles.cardIconWrap}>
                <span className="material-symbols-outlined">{theme.icon}</span>
              </div>
              <strong>{theme.label}</strong>
              <small>{theme.tagline}</small>
              <span className={styles.cardCta}>
                Chơi ngay
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>

        <Link href={`/learning/${gradeSlug}/test?mode=daily`} className={styles.dailyCard}>
          <div className={styles.dailyGlow} aria-hidden="true" />
          <span className="material-symbols-outlined">emoji_events</span>
          <div>
            <strong>Nhiệm vụ hôm nay</strong>
            <small>3–5 câu ngắn · XP bonus · streak</small>
          </div>
          <span className="material-symbols-outlined">bolt</span>
        </Link>
      </main>
    </div>
  )
}

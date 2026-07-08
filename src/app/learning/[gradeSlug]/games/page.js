'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { buildGameHref, getGradeGameCatalog } from '@/lib/games/grade-game-catalog'
import '@/lib/games/game-ui.css'
import styles from './page.module.css'

export default function GamesHubPage() {
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'
  const catalog = getGradeGameCatalog(gradeSlug)
  const featured = catalog.categories[0]?.items[0]

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.blobA} />
        <div className={styles.blobB} />
        <div className={styles.starGrid} />
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
          <span className={styles.gradePill}>{catalog.label}</span>
          <h1>{catalog.headline}</h1>
          <p>{catalog.summary}</p>
          {featured && (
            <Link href={buildGameHref(featured, gradeSlug)} className={styles.featuredCta}>
              <span className="material-symbols-outlined">{featured.theme.icon}</span>
              Chơi đề xuất hôm nay
            </Link>
          )}
          <div className={styles.engineStrip} aria-label="Công nghệ game">
            {['Phaser 2D', 'Question Bank', 'XP + Streak', 'Mobile-first'].map(label => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </section>

        <div className={styles.rotation}>
          {catalog.rotation.map(step => (
            <div key={step.label} className={styles.rotationStep}>
              <span className="material-symbols-outlined">{step.icon}</span>
              <strong>{step.label}</strong>
              <small>{step.text}</small>
            </div>
          ))}
        </div>

        {catalog.categories.map(category => (
          <section key={category.id} className={styles.category}>
            <div className={styles.categoryHeader}>
              <div>
                <h2>{category.title}</h2>
                <p>{category.subtitle}</p>
              </div>
              <span>{category.items.length} game</span>
            </div>

            <div className={styles.grid}>
              {category.items.map(item => {
                const theme = item.theme
                return (
                  <Link
                    key={`${category.id}-${item.id}-${item.world || 'any'}-${item.level || 'any'}`}
                    href={buildGameHref(item, gradeSlug)}
                    className={styles.card}
                    style={{
                      '--card-accent': theme.accent,
                      '--card-accent-dark': theme.accentDark,
                    }}
                  >
                    <span className={styles.cardBeam} aria-hidden="true" />
                    <span className={styles.cardBadge}>{item.badge}</span>
                    <div className={styles.cardIconWrap}>
                      <span className="material-symbols-outlined">{theme.icon}</span>
                    </div>
                    <strong>{theme.label}</strong>
                    <small>{item.focus || theme.tagline}</small>
                    <p>{item.reason}</p>
                    <div className={styles.cardMeta}>
                      <span>
                        <span className="material-symbols-outlined">timer</span>
                        {item.duration}
                      </span>
                      <span>
                        <span className="material-symbols-outlined">local_fire_department</span>
                        {item.intensity}
                      </span>
                    </div>
                    <span className={styles.cardCta}>
                      Chơi ngay
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                    <span className={styles.cardPixels} aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
          </section>
        ))}

        <Link href={`/game-daily-mission?grade=${gradeSlug}`} className={styles.dailyCard}>
          <div className={styles.dailyGlow} aria-hidden="true" />
          <span className="material-symbols-outlined">emoji_events</span>
          <div>
            <strong>Nhiệm vụ hôm nay cho {catalog.label}</strong>
            <small>3-5 câu ngắn · XP bonus · streak</small>
          </div>
          <span className="material-symbols-outlined">bolt</span>
        </Link>
      </main>
    </div>
  )
}

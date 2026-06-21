'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import styles from './page.module.css'

const GAMES = [
  { id: 'quiz-adventure', href: '/game-quiz-adventure', icon: 'map', color: '#005da7', title: 'Phiêu lưu Quiz', desc: 'Trả lời đúng để đi tiếp' },
  { id: 'math-battle', href: '/game-math-battle', icon: 'calculate', color: '#10b981', title: 'Đấu Toán', desc: 'Timer + combo điểm cao' },
  { id: 'word-match', href: '/game-word-match', icon: 'spellcheck', color: '#8b5cf6', title: 'Ghép Từ', desc: 'Ghép cặp từ vựng' },
  { id: 'memory-card', href: '/game-memory-card', icon: 'grid_view', color: '#f59e0b', title: 'Thẻ Nhớ', desc: 'Lật thẻ tìm cặp' },
  { id: 'choose-1-of-2', href: '/game-choose-1-of-2', icon: 'touch_app', color: '#0ea5e9', title: 'Chọn 1 trong 2', desc: 'Game cổ điển' },
  { id: 'listen-and-select', href: '/game-listen-and-select', icon: 'hearing', color: '#ec4899', title: 'Nghe & Chọn', desc: 'Luyện nghe' },
  { id: 'simple-matching', href: '/game-simple-matching', icon: 'extension', color: '#14b8a6', title: 'Ghép đôi', desc: 'Matching nhanh' },
]

export default function GamesHubPage() {
  const params = useParams()
  const gradeSlug = params.gradeSlug || 'lop-1'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/learning/${gradeSlug}`} className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Trò chơi học tập
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--primary)' }}>sports_esports</span>
          <h1>Chọn trò chơi</h1>
          <p>Câu hỏi lấy từ Question Bank — chỉ câu published mới hiển thị</p>
        </div>

        <div className={styles.grid}>
          {GAMES.map(game => (
            <Link
              key={game.id}
              href={`${game.href}?grade=${gradeSlug}`}
              className={styles.card}
            >
              <span className="material-symbols-outlined" style={{ color: game.color, fontSize: 32 }}>{game.icon}</span>
              <strong>{game.title}</strong>
              <small>{game.desc}</small>
            </Link>
          ))}
        </div>

        <Link href={`/learning/${gradeSlug}/test?mode=daily`} className={styles.dailyCard}>
          <span className="material-symbols-outlined">emoji_events</span>
          <div>
            <strong>Nhiệm vụ hôm nay</strong>
            <small>3–5 câu ngắn · nhận XP bonus</small>
          </div>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </main>
    </div>
  )
}

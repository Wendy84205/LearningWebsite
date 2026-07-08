'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getPhaserGameMode } from '@/lib/games/phaser-game-modes'
import { saveGameResult } from '@/lib/api/student-api'
import './phaser-learning-game.css'

const SAMPLE_BANK = {
  'lop-1': [
    { prompt: 'Chọn số lớn hơn', answer: '7', choices: ['7', '4', '2'], pair: ['7', 'bảy'], group: 'Số' },
    { prompt: 'Âm đầu của “mẹ” là gì?', answer: 'm', choices: ['m', 'b', 'n'], pair: ['mẹ', 'mother'], group: 'Tiếng Việt' },
    { prompt: '2 + 3 = ?', answer: '5', choices: ['5', '4', '6'], pair: ['2+3', '5'], group: 'Toán' },
  ],
  'lop-2': [
    { prompt: '35 + 27 = ?', answer: '62', choices: ['62', '52', '72'], pair: ['35+27', '62'], group: 'Toán' },
    { prompt: 'Từ nào chỉ hoạt động?', answer: 'chạy', choices: ['chạy', 'đẹp', 'bàn'], pair: ['chạy', 'hoạt động'], group: 'Tiếng Việt' },
    { prompt: 'Mua bút 8k, đưa 10k. Thối lại?', answer: '2k', choices: ['2k', '1k', '3k'], pair: ['10k-8k', '2k'], group: 'Tiền tệ' },
  ],
  'lop-3': [
    { prompt: '8 x 7 = ?', answer: '56', choices: ['56', '54', '64'], pair: ['8x7', '56'], group: 'Toán' },
    { prompt: 'Câu lệnh nào giúp nhân vật tiến lên?', answer: 'Tiến', choices: ['Tiến', 'Lùi', 'Dừng'], pair: ['forward', 'Tiến'], group: 'Tin học' },
    { prompt: 'Bộ phận nào giúp cây quang hợp?', answer: 'Lá', choices: ['Lá', 'Rễ', 'Thân'], pair: ['Lá', 'quang hợp'], group: 'Khoa học' },
  ],
  'lop-4': [
    { prompt: '1/2 bằng bao nhiêu phần tư?', answer: '2/4', choices: ['2/4', '1/4', '3/4'], pair: ['1/2', '2/4'], group: 'Phân số' },
    { prompt: 'Thủ đô Việt Nam là?', answer: 'Hà Nội', choices: ['Hà Nội', 'Huế', 'Đà Nẵng'], pair: ['Thủ đô', 'Hà Nội'], group: 'Địa lí' },
    { prompt: 'Vật dẫn điện tốt là?', answer: 'Đồng', choices: ['Đồng', 'Gỗ', 'Nhựa'], pair: ['Đồng', 'dẫn điện'], group: 'Khoa học' },
  ],
  'lop-5': [
    { prompt: '25% của 80 là?', answer: '20', choices: ['20', '25', '40'], pair: ['25% x 80', '20'], group: 'Phần trăm' },
    { prompt: 'Sông dài nhất Việt Nam?', answer: 'Sông Mê Kông', choices: ['Sông Mê Kông', 'Sông Hồng', 'Sông Hương'], pair: ['Mê Kông', 'sông dài'], group: 'Địa lí' },
    { prompt: 'Nguồn năng lượng tái tạo là?', answer: 'Mặt trời', choices: ['Mặt trời', 'Than đá', 'Dầu mỏ'], pair: ['Mặt trời', 'tái tạo'], group: 'Khoa học' },
  ],
}

function getFallbackQuestions(gradeSlug) {
  return SAMPLE_BANK[gradeSlug] || SAMPLE_BANK['lop-1']
}

function normalizeQuestions(rows, gradeSlug) {
  const source = Array.isArray(rows) && rows.length ? rows : getFallbackQuestions(gradeSlug)
  return source.slice(0, 6).map((item, index) => {
    const choices = item.choices || item.options || []
    const answer = item.answer || choices[item.correct || 0] || item.correctAnswer || choices[0]
    return {
      id: item.id || `phaser-${gradeSlug}-${index}`,
      prompt: item.prompt || item.q || item.question || 'Chọn đáp án đúng',
      answer: String(answer),
      choices: choices.length ? choices.map(String) : [String(answer), 'Sai 1', 'Sai 2'],
      pair: item.pair || [item.left || item.prompt || item.q || String(answer), item.right || String(answer)],
      group: item.group || item.subject || item.topic || 'Kiến thức',
      explanation: item.explanation || 'Làm tốt lắm, tiếp tục nhé!',
    }
  })
}

function pick(arr, index) {
  return arr[index % arr.length]
}

function createLearningScene({ Phaser, mode, gradeSlug, questions, onFinish }) {
  const config = getPhaserGameMode(mode)

  return class LearningScene extends Phaser.Scene {
    constructor() {
      super('LearningScene')
      this.index = 0
      this.correct = 0
      this.combo = 0
      this.answered = []
      this.mode = mode
      this.finished = false
      this.locked = false
    }

    create() {
      const { width, height } = this.scale
      this.cameras.main.setBackgroundColor('#f6fbff')
      this.add.rectangle(width / 2, height / 2, width, height, 0xf6fbff)
      this.add.circle(width * 0.1, height * 0.18, 140, Phaser.Display.Color.HexStringToColor(config.color).color, 0.12)
      this.add.circle(width * 0.92, height * 0.12, 160, 0xffc800, 0.16)
      this.add.grid(width / 2, height / 2, width, height, 42, 42, 0xffffff, 0, 0x1cb0f6, 0.06)

      this.title = this.add.text(24, 18, `${config.emoji} ${config.label}`, {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '22px',
        color: '#17202a',
        fontStyle: '900',
      })
      this.scoreText = this.add.text(width - 24, 22, '0 XP', {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '18px',
        color: '#17202a',
        fontStyle: '900',
      }).setOrigin(1, 0)
      this.progressTrack = this.add.rectangle(width / 2, 30, 260, 12, 0xdce9f1, 1)
        .setStrokeStyle(2, 0xffffff, 0.85)
      this.progressFill = this.add.rectangle(width / 2 - 130, 30, 28, 12, Phaser.Display.Color.HexStringToColor(config.color).color, 1)
        .setOrigin(0, 0.5)
      this.progressText = this.add.text(width / 2, 44, '', {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '12px',
        color: '#5f6f7a',
        fontStyle: '900',
      }).setOrigin(0.5, 0)
      this.comboText = this.add.text(width - 24, 52, 'Combo x0', {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '13px',
        color: '#6e7881',
        fontStyle: '900',
      }).setOrigin(1, 0)
      this.tipText = this.add.text(24, 52, 'Chạm đáp án đúng để nhận XP', {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '13px',
        color: '#6e7881',
        fontStyle: '900',
      })
      this.promptText = this.add.text(width / 2, 74, '', {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '24px',
        color: '#17202a',
        fontStyle: '900',
        align: 'center',
        wordWrap: { width: Math.min(760, width - 48) },
      }).setOrigin(0.5, 0)
      this.feedbackText = this.add.text(width / 2, height - 48, '', {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '18px',
        color: '#17202a',
        fontStyle: '800',
        align: 'center',
      }).setOrigin(0.5)

      this.renderQuestion()
    }

    clearBoard() {
      this.children.list
        .filter(child => child.getData?.('dynamic'))
        .forEach(child => child.destroy())
    }

    currentQuestion() {
      return pick(questions, this.index)
    }

    markDynamic(child) {
      child.setData('dynamic', true)
      return child
    }

    updateScore() {
      this.scoreText.setText(`${this.correct * 20 + this.combo * 5} XP`)
      this.comboText.setText(`Combo x${this.combo}`)
      const total = Math.min(questions.length, 5)
      const progress = Math.max(1, Math.min(total, this.index + 1))
      this.progressText.setText(`Câu ${progress}/${total}`)
      this.tweens.add({
        targets: this.progressFill,
        width: 260 * (progress / total),
        duration: 220,
        ease: 'Cubic.easeOut',
      })
    }

    juice(ok) {
      const { width, height } = this.scale
      const color = ok ? Phaser.Display.Color.HexStringToColor(config.color).color : 0xff4d4f
      const x = width / 2
      const y = height - 88

      try {
        window.navigator?.vibrate?.(ok ? 18 : [18, 28, 18])
      } catch {
        // Best-effort haptic feedback only.
      }

      if (!ok) {
        this.cameras.main.shake(150, 0.006)
      }

      const ring = this.markDynamic(this.add.circle(x, y, 12, color, 0).setStrokeStyle(5, color, 0.9))
      this.tweens.add({
        targets: ring,
        radius: ok ? 92 : 58,
        alpha: 0,
        duration: ok ? 520 : 320,
        ease: 'Cubic.easeOut',
        onComplete: () => ring.destroy(),
      })

      const label = this.markDynamic(this.add.text(x, y - 8, ok ? `+${20 + this.combo * 5} XP` : 'Thử lại nhé', {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: ok ? '22px' : '18px',
        color: ok ? config.dark : '#ba1a1a',
        fontStyle: '950',
      }).setOrigin(0.5))
      this.tweens.add({
        targets: label,
        y: y - 72,
        alpha: 0,
        scale: ok ? 1.12 : 0.96,
        duration: 620,
        ease: 'Back.easeOut',
        onComplete: () => label.destroy(),
      })

      if (ok) {
        Array.from({ length: 10 }).forEach((_, index) => {
          const dot = this.markDynamic(this.add.circle(x, y, 5 + (index % 3), color, 0.86))
          const angle = (Math.PI * 2 * index) / 10
          this.tweens.add({
            targets: dot,
            x: x + Math.cos(angle) * (54 + index * 5),
            y: y + Math.sin(angle) * (42 + index * 3),
            alpha: 0,
            scale: 0.15,
            duration: 520,
            ease: 'Cubic.easeOut',
            onComplete: () => dot.destroy(),
          })
        })
      }
    }

    answer(value) {
      if (this.finished || this.locked) return
      this.locked = true
      const question = this.currentQuestion()
      const ok = String(value) === String(question.answer)
      if (ok) {
        this.correct += 1
        this.combo += 1
        this.feedbackText.setText(`Đúng rồi! Combo x${this.combo}`)
        this.feedbackText.setColor('#2b6c00')
      } else {
        this.combo = 0
        this.feedbackText.setText(`Chưa đúng. Đáp án là ${question.answer}`)
        this.feedbackText.setColor('#ba1a1a')
      }
      this.answered.push({
        questionId: question.id,
        selected: String(value),
        correctAnswer: question.answer,
        isCorrect: ok,
        difficulty: 'easy',
      })
      this.updateScore()
      this.juice(ok)

      if (this.index >= Math.min(questions.length, 5) - 1) {
        this.time.delayedCall(980, () => this.finish())
      } else {
        this.index += 1
        this.time.delayedCall(980, () => this.renderQuestion())
      }
    }

    finish() {
      if (this.finished) return
      this.finished = true
      onFinish({
        correct: this.correct,
        total: Math.min(questions.length, 5),
        answers: this.answered,
        mode: this.mode,
      })
    }

    renderQuestion() {
      this.clearBoard()
      this.locked = false
      const question = this.currentQuestion()
      this.promptText.setText(question.prompt)
      this.feedbackText.setText('')
      this.updateScore()

      const renderers = {
        'catch-falling': () => this.renderFalling(question),
        'drag-match': () => this.renderDragMatch(question),
        'memory-flip': () => this.renderMemory(question),
        'speed-runner': () => this.renderRunner(question),
        'money-shop': () => this.renderShop(question),
        'code-maze': () => this.renderMaze(question),
        'story-branch': () => this.renderStory(question),
        'explore-map': () => this.renderExplore(question),
        'fraction-builder': () => this.renderBuilder(question),
        'virtual-lab': () => this.renderLab(question),
        'code-lock': () => this.renderLock(question),
        'team-race': () => this.renderTeamRace(question),
      }
      ;(renderers[this.mode] || renderers['catch-falling'])()
    }

    button(x, y, label, value, color = config.color) {
      const group = this.add.container(x, y)
      this.markDynamic(group)
      const shadow = this.add.rectangle(0, 7, 184, 58, 0x0f172a, 0.18)
      const bg = this.add.rectangle(0, 0, 180, 58, Phaser.Display.Color.HexStringToColor(color).color, 1)
        .setStrokeStyle(3, 0xffffff, 0.75)
        .setInteractive({ useHandCursor: true })
      const text = this.add.text(0, 0, label, {
        fontFamily: 'Be Vietnam Pro, Arial',
        fontSize: '19px',
        color: '#ffffff',
        fontStyle: '900',
        align: 'center',
        wordWrap: { width: 154 },
      }).setOrigin(0.5)
      const shine = this.add.rectangle(-44, -20, 64, 8, 0xffffff, 0.28).setAngle(-16)
      group.add([bg, text, shadow, shine])
      group.sendToBack(shadow)
      group.setData('hitArea', bg)
      group.setData('labelText', text)
      bg.on('pointerover', () => {
        if (this.locked) return
        this.tweens.add({ targets: group, scale: 1.045, y: y - 3, duration: 120, ease: 'Cubic.easeOut' })
      })
      bg.on('pointerout', () => {
        this.tweens.add({ targets: group, scale: 1, y, duration: 120, ease: 'Cubic.easeOut' })
      })
      bg.on('pointerdown', () => {
        if (this.locked) return
        this.tweens.add({ targets: group, scale: 0.94, yoyo: true, duration: 80 })
        this.answer(value)
      })
      return group
    }

    renderChoiceRow(question, y = 300) {
      const { width } = this.scale
      question.choices.slice(0, 3).forEach((choice, index) => {
        this.button(width / 2 + (index - 1) * 205, y, choice, choice)
      })
    }

    renderFalling(question) {
      const { width } = this.scale
      question.choices.slice(0, 3).forEach((choice, index) => {
        const x = width * (0.25 + index * 0.25)
        const token = this.button(x, 158, choice, choice, index === 0 ? config.color : '#64748b')
        this.tweens.add({ targets: token, y: 430, duration: 2600 + index * 300, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 })
      })
    }

    renderDragMatch(question) {
      const { width } = this.scale
      const target = this.markDynamic(this.add.rectangle(width / 2 + 170, 315, 210, 90, 0xffffff, 1).setStrokeStyle(4, 0x58cc02))
      this.markDynamic(this.add.text(target.x, target.y, question.answer, { fontFamily: 'Be Vietnam Pro, Arial', fontSize: '22px', color: '#17202a', fontStyle: '900' }).setOrigin(0.5))
      question.choices.slice(0, 3).forEach((choice, index) => {
        const card = this.button(width / 2 - 190, 230 + index * 82, choice, choice, '#1cb0f6')
        card.getData('hitArea').removeAllListeners('pointerdown')
        card.setSize(180, 58).setInteractive({ draggable: true, useHandCursor: true })
        this.input.setDraggable(card)
        card.on('drag', (_pointer, dragX, dragY) => card.setPosition(dragX, dragY))
        card.on('dragend', () => {
          const hit = Phaser.Geom.Rectangle.Contains(target.getBounds(), card.x, card.y)
          if (hit) this.answer(choice)
        })
      })
    }

    renderMemory(question) {
      const cards = [question.pair[0], question.pair[1], ...question.choices.filter(c => c !== question.answer).slice(0, 2)]
      let flipped = []
      cards.forEach((label, index) => {
        const x = this.scale.width / 2 + (index % 2 ? 110 : -110)
        const y = 220 + Math.floor(index / 2) * 105
        const card = this.button(x, y, '?', label, '#8b5cf6')
        card.getData('hitArea').removeAllListeners('pointerdown')
        card.getData('hitArea').on('pointerdown', () => {
          if (this.locked) return
          card.getData('labelText').setText(label)
          flipped.push(label)
          if (flipped.length === 2) {
            const ok = flipped.includes(question.pair[0]) && flipped.includes(question.pair[1])
            this.answer(ok ? question.answer : flipped.join(''))
            flipped = []
          }
        })
      })
    }

    renderRunner(question) {
      const runner = this.markDynamic(this.add.text(70, 350, '🏃', { fontSize: '54px' }))
      this.markDynamic(this.add.rectangle(this.scale.width / 2, 410, this.scale.width - 120, 8, 0x1cb0f6, 0.45))
      this.tweens.add({ targets: runner, x: this.scale.width - 110, duration: 4200, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 })
      this.renderChoiceRow(question, 230)
    }

    renderShop(question) {
      this.markDynamic(this.add.text(this.scale.width / 2, 190, '🧃 8k   🍞 12k   ✏️ 5k', { fontFamily: 'Be Vietnam Pro, Arial', fontSize: '34px', color: '#17202a' }).setOrigin(0.5))
      this.renderChoiceRow(question, 330)
    }

    renderMaze(question) {
      const startX = this.scale.width / 2 - 170
      this.markDynamic(this.add.rectangle(this.scale.width / 2, 310, 360, 210, 0xffffff, 1).setStrokeStyle(4, 0xdce9f1))
      this.markDynamic(this.add.text(startX, 310, '🤖', { fontSize: '42px' }).setOrigin(0.5))
      this.markDynamic(this.add.text(this.scale.width / 2 + 170, 310, '🏁', { fontSize: '42px' }).setOrigin(0.5))
      this.renderChoiceRow(question, 450)
    }

    renderStory(question) {
      this.markDynamic(this.add.text(this.scale.width / 2, 178, 'Bạn thấy bạn cùng lớp làm rơi bút. Bạn sẽ...', { fontFamily: 'Be Vietnam Pro, Arial', fontSize: '22px', color: '#17202a', fontStyle: '800', align: 'center', wordWrap: { width: 650 } }).setOrigin(0.5))
      this.renderChoiceRow(question, 320)
    }

    renderExplore(question) {
      const spots = ['Hà Nội', 'Huế', 'TP.HCM']
      spots.forEach((spot, index) => {
        const x = this.scale.width / 2 + (index - 1) * 190
        const y = 285 + (index % 2) * 42
        this.button(x, y, `📍 ${spot}`, spot === question.answer ? question.answer : spot, '#14b8a6')
      })
    }

    renderBuilder(question) {
      this.markDynamic(this.add.rectangle(this.scale.width / 2, 340, 420, 120, 0xeaf8ff, 1).setStrokeStyle(4, 0x1cb0f6))
      this.markDynamic(this.add.text(this.scale.width / 2, 340, 'Ghép phần đúng để hoàn thành cây cầu', { fontFamily: 'Be Vietnam Pro, Arial', fontSize: '22px', color: '#17202a', fontStyle: '800' }).setOrigin(0.5))
      this.renderChoiceRow(question, 210)
    }

    renderLab(question) {
      this.markDynamic(this.add.text(this.scale.width / 2, 200, '🔋  💡  🌱  💧', { fontSize: '46px' }).setOrigin(0.5))
      this.renderChoiceRow(question, 330)
    }

    renderLock(question) {
      this.markDynamic(this.add.text(this.scale.width / 2, 205, '🔐  _  _  _', { fontSize: '52px' }).setOrigin(0.5))
      this.renderChoiceRow(question, 330)
    }

    renderTeamRace(question) {
      this.markDynamic(this.add.text(96, 250, 'Đội Sao', { fontFamily: 'Be Vietnam Pro, Arial', fontSize: '20px', color: '#17202a', fontStyle: '900' }))
      this.markDynamic(this.add.text(96, 340, 'Đội Mây', { fontFamily: 'Be Vietnam Pro, Arial', fontSize: '20px', color: '#17202a', fontStyle: '900' }))
      this.markDynamic(this.add.rectangle(this.scale.width / 2, 282, this.scale.width - 180, 16, 0x58cc02, 0.28))
      this.markDynamic(this.add.rectangle(this.scale.width / 2, 372, this.scale.width - 260, 16, 0x1cb0f6, 0.24))
      this.renderChoiceRow(question, 180)
    }
  }
}

export default function PhaserLearningGame({ mode }) {
  const mountRef = useRef(null)
  const gameRef = useRef(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const gradeSlug = searchParams.get('grade') || 'lop-1'
  const worldId = Number(searchParams.get('world') || '1')
  const levelId = Number(searchParams.get('level') || '1')
  const config = getPhaserGameMode(mode)
  const [ready, setReady] = useState(false)
  const [questions, setQuestions] = useState([])
  const normalizedQuestions = useMemo(() => normalizeQuestions(questions, gradeSlug), [questions, gradeSlug])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const params = new URLSearchParams({
          grade: gradeSlug,
          world: String(worldId),
          level: String(levelId),
          game: 'quiz',
          subject: config.subject.split('/')[0].trim(),
        })
        const res = await fetch(`/api/questions?${params}`, { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) setQuestions(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setQuestions([])
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [config.subject, gradeSlug, levelId, worldId])

  useEffect(() => {
    if (!ready || !mountRef.current || gameRef.current) return undefined
    let disposed = false

    const boot = async () => {
      const Phaser = await import('phaser')
      if (disposed || !mountRef.current) return

      const onFinish = async ({ correct, total, answers }) => {
        const scorePct = total ? Math.round((correct / total) * 100) : 0
        const stars = scorePct >= 90 ? 3 : scorePct >= 60 ? 2 : correct > 0 ? 1 : 0
        const xp = correct * 20 + stars * 10
        localStorage.setItem('lastStars', String(stars))
        localStorage.setItem('lastXp', String(xp))
        localStorage.setItem('lastScorePct', String(scorePct))
        localStorage.setItem('lastCorrect', String(correct))
        localStorage.setItem('lastTotal', String(total))
        localStorage.setItem('lastGame', config.label)
        localStorage.setItem('lastCombo', String(correct))
        localStorage.setItem('lastLevelNumber', String(Math.max(1, Math.ceil(xp / 80))))

        const profileId = localStorage.getItem('profileId')
        if (profileId) {
          try {
            await saveGameResult({
              profileId,
              activityType: 'game',
              title: config.label,
              grade: gradeSlug,
              gameType: mode,
              completedLevel: '',
              worldId,
              levelId,
              isBoss: false,
              answers,
              correct,
              total,
              starsEarned: stars,
            })
          } catch (err) {
            console.error(err)
          }
        }
        router.push(`/game-results?grade=${gradeSlug}&game=${mode}`)
      }

      const Scene = createLearningScene({
        Phaser,
        mode,
        gradeSlug,
        questions: normalizedQuestions,
        onFinish,
      })

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: mountRef.current,
        width: 960,
        height: 560,
        backgroundColor: '#f6fbff',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: Scene,
      })
    }

    boot()
    return () => {
      disposed = true
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [config.label, gradeSlug, levelId, mode, normalizedQuestions, ready, router, worldId])

  return (
    <div className="phaser-page" style={{ '--mode-color': config.color, '--mode-dark': config.dark }}>
      <div className="phaser-bg" aria-hidden="true" />
      <header className="phaser-topbar">
        <Link href={`/learning/${gradeSlug}/games`} className="phaser-back">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Trò chơi
        </Link>
        <div className="phaser-title">
          <span className="material-symbols-outlined" aria-hidden="true">{config.icon}</span>
          <div>
            <strong>{config.label}</strong>
            <small>{config.skill}</small>
          </div>
        </div>
        <span className="phaser-grade">{gradeSlug.replace('lop-', 'Lớp ')}</span>
      </header>

      <main className="phaser-stage-wrap">
        <section className="phaser-instructions">
          <span className="phaser-mode-emoji">{config.emoji}</span>
          <div>
            <h1>{config.shortLabel}</h1>
            <p>{config.description}</p>
          </div>
          <div className="phaser-reward-strip" aria-label="Thông tin màn chơi">
            <span>
              <strong>5</strong>
              câu
            </span>
            <span>
              <strong>XP</strong>
              thưởng
            </span>
            <span>
              <strong>★</strong>
              sao
            </span>
          </div>
          <div className="phaser-tip">
            <span className="material-symbols-outlined" aria-hidden="true">touch_app</span>
            <p>Chạm, kéo hoặc chọn nhanh theo luật của màn chơi.</p>
          </div>
        </section>
        <div className="phaser-stage" ref={mountRef}>
          {!ready && <div className="phaser-loading">Đang dựng màn chơi...</div>}
        </div>
      </main>
    </div>
  )
}

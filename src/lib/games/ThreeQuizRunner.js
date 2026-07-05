'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './three-quiz-runner.css'

const LANES = [-2.6, 0, 2.6]
const MAX_CHOICES = 3
const GAME_LENGTH = 5

function normalizeAnswer(value) {
  return String(value ?? '').trim().toLowerCase()
}

function fitText(ctx, text, maxWidth, startSize = 42, minSize = 20) {
  let size = startSize
  do {
    ctx.font = `800 ${size}px Arial, sans-serif`
    if (ctx.measureText(text).width <= maxWidth) return size
    size -= 2
  } while (size >= minSize)
  return minSize
}

function createTextTexture(text, { bg = '#ffffff', fg = '#111827', accent = '#1cb0f6' } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 320
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = accent
  ctx.lineWidth = 18
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36)
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const lines = String(text || '').split(/\s+/).reduce((rows, word) => {
    const next = [...rows]
    const current = next[next.length - 1] || ''
    const candidate = current ? `${current} ${word}` : word
    ctx.font = '800 36px Arial, sans-serif'
    if (ctx.measureText(candidate).width > 620 && current) {
      next.push(word)
    } else if (next.length) {
      next[next.length - 1] = candidate
    } else {
      next.push(candidate)
    }
    return next.slice(0, 3)
  }, [])
  const fontSize = fitText(ctx, lines.join(' '), 620)
  ctx.font = `800 ${fontSize}px Arial, sans-serif`
  const lineHeight = fontSize * 1.24
  const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight)
  })
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function buildQuestionChoices(question) {
  const choices = Array.isArray(question?.choices) ? question.choices.filter(Boolean) : []
  const answer = String(question?.answer || choices[0] || '')
  const pool = Array.from(new Set([answer, ...choices].map(String).filter(Boolean))).slice(0, MAX_CHOICES)
  return pool.length >= 2 ? pool : [answer, 'Chưa đúng'].filter(Boolean)
}

function makeAnswerRecord(question, selected) {
  const isCorrect = normalizeAnswer(selected) === normalizeAnswer(question.answer)
  return {
    questionId: question.id,
    selected,
    correctAnswer: question.answer,
    isCorrect,
    difficulty: question.difficulty || 'easy',
    subject: question.subject || '',
    topic: question.topic || '',
    skill: question.skill || '',
  }
}

function createGateMeshes(question, choices, materials) {
  const group = new THREE.Group()
  const questionTexture = createTextTexture(question.prompt, {
    bg: '#fff7ed',
    fg: '#7c2d12',
    accent: '#fb923c',
  })
  const promptMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7.8, 1.7),
    new THREE.MeshBasicMaterial({ map: questionTexture, transparent: true })
  )
  promptMesh.position.set(0, 4.15, 0)
  group.add(promptMesh)

  choices.forEach((choice, index) => {
    const laneX = LANES[index] || 0
    const arch = new THREE.Mesh(new THREE.BoxGeometry(2.25, 2.25, 0.32), materials.gate[index].clone())
    arch.position.set(laneX, 1.35, 0)
    arch.castShadow = true
    arch.receiveShadow = true
    group.add(arch)

    const hole = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.55, 0.36), materials.hole.clone())
    hole.position.set(laneX, 1.25, 0.03)
    group.add(hole)

    const texture = createTextTexture(choice, {
      bg: '#ffffff',
      fg: '#111827',
      accent: ['#1cb0f6', '#58cc02', '#ff9f1c'][index] || '#1cb0f6',
    })
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(2.05, 0.86),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    )
    label.position.set(laneX, 2.75, 0.22)
    group.add(label)
  })

  return group
}

export default function ThreeQuizRunner({ questions, theme, onComplete }) {
  const mountRef = useRef(null)
  const runtimeRef = useRef(null)
  const laneRef = useRef(1)
  const completedRef = useRef(false)
  const [ui, setUi] = useState({
    status: 'ready',
    questionIndex: 0,
    total: Math.min(questions.length, GAME_LENGTH),
    correct: 0,
    lives: 3,
    combo: 0,
    feedback: 'Sẵn sàng',
  })

  const moveLane = useCallback((direction) => {
    const runtime = runtimeRef.current
    if (!runtime || runtime.status !== 'playing') return
    const maxLane = Math.max(0, runtime.currentChoices.length - 1)
    laneRef.current = Math.max(0, Math.min(maxLane, laneRef.current + direction))
    runtime.targetLane = laneRef.current
  }, [])

  const startGame = useCallback(() => {
    const runtime = runtimeRef.current
    if (!runtime || runtime.status === 'playing') return
    completedRef.current = false
    runtime.status = 'playing'
    runtime.questionIndex = 0
    runtime.correct = 0
    runtime.lives = 3
    runtime.combo = 0
    runtime.maxCombo = 0
    runtime.answers = []
    runtime.gateZ = -26
    runtime.feedback = 'Chọn làn đáp án đúng!'
    laneRef.current = 1
    runtime.targetLane = Math.min(1, Math.max(0, runtime.currentChoices.length - 1))
    runtime.spawnQuestion(0)
  }, [])

  const togglePause = useCallback(() => {
    const runtime = runtimeRef.current
    if (!runtime) return
    if (runtime.status === 'playing') runtime.status = 'paused'
    else if (runtime.status === 'paused') runtime.status = 'playing'
  }, [])

  useEffect(() => {
    let frameId = 0
    let lastTs = performance.now()
    let uiTick = 0
    const mount = mountRef.current
    if (!mount || !questions.length) return undefined

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#bfe9ff')
    scene.fog = new THREE.Fog('#bfe9ff', 18, 58)

    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 6, 10.5)
    camera.lookAt(0, 1.2, -12)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    mount.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight('#ffffff', '#87a878', 2.5)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#fff7dd', 2.8)
    sun.position.set(-5, 12, 6)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    scene.add(sun)

    const materials = {
      road: new THREE.MeshStandardMaterial({ color: '#28445f', roughness: 0.72, metalness: 0.05 }),
      lane: new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.6, emissive: '#332400', emissiveIntensity: 0.15 }),
      player: new THREE.MeshStandardMaterial({ color: theme?.accent || '#1cb0f6', roughness: 0.38, metalness: 0.16 }),
      playerFace: new THREE.MeshStandardMaterial({ color: '#fff7ed', roughness: 0.4 }),
      gate: [
        new THREE.MeshStandardMaterial({ color: '#1cb0f6', roughness: 0.35, metalness: 0.12, emissive: '#082f49', emissiveIntensity: 0.12 }),
        new THREE.MeshStandardMaterial({ color: '#58cc02', roughness: 0.35, metalness: 0.12, emissive: '#14532d', emissiveIntensity: 0.12 }),
        new THREE.MeshStandardMaterial({ color: '#ff9f1c', roughness: 0.35, metalness: 0.12, emissive: '#7c2d12', emissiveIntensity: 0.12 }),
      ],
      hole: new THREE.MeshBasicMaterial({ color: '#0f172a' }),
      coin: new THREE.MeshStandardMaterial({ color: '#ffc800', roughness: 0.22, metalness: 0.3, emissive: '#7c2d12', emissiveIntensity: 0.18 }),
    }

    const road = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.26, 72), materials.road)
    road.position.set(0, -0.13, -24)
    road.receiveShadow = true
    scene.add(road)

    for (let z = 6; z > -62; z -= 5) {
      LANES.forEach((laneX) => {
        const laneMark = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 1.8), materials.lane)
        laneMark.position.set(laneX, 0.04, z)
        scene.add(laneMark)
      })
    }

    const decorGroup = new THREE.Group()
    for (let i = 0; i < 28; i += 1) {
      const side = i % 2 === 0 ? -1 : 1
      const tree = new THREE.Group()
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8), new THREE.MeshStandardMaterial({ color: '#9a5b2f' }))
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.52, 1.15, 7), new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? '#58cc02' : '#22c55e' }))
      trunk.position.y = 0.35
      crown.position.y = 1.18
      tree.add(trunk, crown)
      tree.position.set(side * (5.8 + (i % 4) * 0.35), 0, 4 - i * 2.55)
      tree.rotation.y = i * 0.4
      decorGroup.add(tree)
    }
    scene.add(decorGroup)

    const player = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 0.95, 6, 12), materials.player)
    body.position.y = 0.92
    body.castShadow = true
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), materials.playerFace)
    face.position.set(0, 1.55, 0.32)
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.04), new THREE.MeshBasicMaterial({ color: '#111827' }))
    visor.position.set(0, 1.58, 0.55)
    player.add(body, face, visor)
    player.position.set(LANES[1], 0, 2.2)
    scene.add(player)

    let gateGroup = null
    const total = Math.min(questions.length, GAME_LENGTH)
    const runtime = {
      status: 'ready',
      questionIndex: 0,
      correct: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      answers: [],
      gateZ: -26,
      targetLane: 1,
      currentChoices: buildQuestionChoices(questions[0]),
      feedback: 'Sẵn sàng',
      spawnQuestion(index) {
        if (gateGroup) {
          scene.remove(gateGroup)
          gateGroup.traverse((object) => {
            object.geometry?.dispose?.()
            object.material?.map?.dispose?.()
            object.material?.dispose?.()
          })
        }
        const question = questions[index]
        this.currentChoices = buildQuestionChoices(question)
        this.targetLane = Math.min(this.targetLane, this.currentChoices.length - 1)
        laneRef.current = this.targetLane
        gateGroup = createGateMeshes(question, this.currentChoices, materials)
        gateGroup.position.z = this.gateZ
        scene.add(gateGroup)
      },
      finish() {
        this.status = 'finished'
      },
    }
    runtimeRef.current = runtime
    runtime.spawnQuestion(0)

    function answerCurrentQuestion() {
      const question = questions[runtime.questionIndex]
      const selected = runtime.currentChoices[laneRef.current] || runtime.currentChoices[0]
      const answer = makeAnswerRecord(question, selected)
      runtime.answers.push(answer)
      if (answer.isCorrect) {
        runtime.correct += 1
        runtime.combo += 1
        runtime.maxCombo = Math.max(runtime.maxCombo, runtime.combo)
        runtime.feedback = 'Chính xác!'
      } else {
        runtime.combo = 0
        runtime.lives = Math.max(0, runtime.lives - 1)
        runtime.feedback = `Đáp án: ${question.answer}`
      }

      runtime.questionIndex += 1
      if (runtime.questionIndex >= total || runtime.lives <= 0) {
        runtime.finish()
        return
      }
      runtime.gateZ = -26
      runtime.spawnQuestion(runtime.questionIndex)
    }

    function updateUi(force = false) {
      uiTick += 1
      if (!force && uiTick % 8 !== 0) return
      setUi({
        status: runtime.status,
        questionIndex: Math.min(runtime.questionIndex, total - 1),
        total,
        correct: runtime.correct,
        lives: runtime.lives,
        combo: runtime.combo,
        feedback: runtime.feedback,
      })
    }

    function animate(ts) {
      const delta = Math.min((ts - lastTs) / 1000, 0.04)
      lastTs = ts

      if (runtime.status === 'playing') {
        runtime.gateZ += delta * (8.5 + runtime.questionIndex * 0.65)
        if (gateGroup) gateGroup.position.z = runtime.gateZ
        const targetX = LANES[laneRef.current] || 0
        player.position.x += (targetX - player.position.x) * Math.min(1, delta * 12)
        player.rotation.z = (targetX - player.position.x) * -0.12
        player.position.y = Math.sin(ts * 0.008) * 0.07
        decorGroup.position.z = ((ts * 0.002) % 5) - 2.5
        if (runtime.gateZ >= 1.7) answerCurrentQuestion()
      }

      if (runtime.status === 'finished' && !completedRef.current) {
        completedRef.current = true
        onComplete({
          correct: runtime.correct,
          total,
          answers: runtime.answers,
          maxCombo: runtime.maxCombo,
          lives: runtime.lives,
        })
      }

      updateUi()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') moveLane(-1)
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') moveLane(1)
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        if (runtime.status === 'ready') startGame()
        else togglePause()
      }
    }

    function resize() {
      const width = Math.max(1, mount.clientWidth)
      const height = Math.max(1, mount.clientHeight)
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.position.z = width < 640 ? 12.5 : 10.5
      camera.updateProjectionMatrix()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', resize)
    function handleVisibilityChange() {
      if (document.hidden && runtime.status === 'playing') runtime.status = 'paused'
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    updateUi(true)
    resize()
    frameId = requestAnimationFrame(animate)

    window.__THREE_GAME_DIAGNOSTICS__ = {
      name: 'hoc-vui-three-quiz-runner',
      getState: () => ({
        status: runtime.status,
        questionIndex: runtime.questionIndex,
        correct: runtime.correct,
        lives: runtime.lives,
        lane: laneRef.current,
        answers: runtime.answers.length,
        renderer: renderer.info,
      }),
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      runtimeRef.current = null
      if (window.__THREE_GAME_DIAGNOSTICS__?.name === 'hoc-vui-three-quiz-runner') {
        delete window.__THREE_GAME_DIAGNOSTICS__
      }
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
      scene.traverse((object) => {
        object.geometry?.dispose?.()
        if (Array.isArray(object.material)) {
          object.material.forEach(material => {
            material.map?.dispose?.()
            material.dispose?.()
          })
        } else {
          object.material?.map?.dispose?.()
          object.material?.dispose?.()
        }
      })
      renderer.dispose()
    }
  }, [moveLane, onComplete, questions, startGame, theme?.accent, togglePause])

  const activeQuestion = questions[ui.questionIndex]
  const progressPct = ui.total ? Math.round(((Math.min(ui.questionIndex + 1, ui.total)) / ui.total) * 100) : 0

  return (
    <section className="three-runner-shell" data-status={ui.status}>
      <div ref={mountRef} className="three-runner-canvas" />

      <div className="three-runner-hud" aria-live="polite">
        <div className="three-runner-meter">
          <span className="material-symbols-outlined">route</span>
          <div>
            <strong>{ui.questionIndex + 1}/{ui.total}</strong>
            <span style={{ '--progress': `${progressPct}%` }} />
          </div>
        </div>
        <div className="three-runner-pill">
          <span className="material-symbols-outlined">favorite</span>
          {ui.lives}
        </div>
        <div className="three-runner-pill">
          <span className="material-symbols-outlined">bolt</span>
          {ui.correct}
        </div>
        <button type="button" className="three-runner-icon-btn" onClick={togglePause} aria-label="Tạm dừng">
          <span className="material-symbols-outlined">{ui.status === 'paused' ? 'play_arrow' : 'pause'}</span>
        </button>
      </div>

      <div className="three-runner-question">
        <span>{ui.feedback}</span>
        <strong>{activeQuestion?.prompt || 'Hoàn thành!'}</strong>
      </div>

      {ui.status !== 'playing' && (
        <div className="three-runner-modal">
          <div className="three-runner-modal-panel">
            <span className="three-runner-modal-icon">{theme?.emoji || '🚀'}</span>
            <h1>{ui.status === 'finished' ? 'Hoàn thành đường chạy!' : 'Quiz Runner 3D'}</h1>
            <p>{ui.status === 'paused' ? 'Trò chơi đang tạm dừng.' : 'Chạy qua làn có đáp án đúng để ghi điểm.'}</p>
            <button type="button" className="three-runner-primary" onClick={startGame}>
              <span className="material-symbols-outlined">{ui.status === 'finished' ? 'restart_alt' : 'play_arrow'}</span>
              {ui.status === 'finished' ? 'Chơi lại' : 'Bắt đầu'}
            </button>
          </div>
        </div>
      )}

      <div className="three-runner-controls" aria-label="Điều khiển làn chạy">
        <button type="button" onPointerDown={() => moveLane(-1)} aria-label="Sang trái">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button type="button" onPointerDown={() => moveLane(1)} aria-label="Sang phải">
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </section>
  )
}

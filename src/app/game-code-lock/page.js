'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function CodeLockGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="code-lock" /></Suspense>
}

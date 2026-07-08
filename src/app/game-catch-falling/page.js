'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function CatchFallingGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="catch-falling" /></Suspense>
}

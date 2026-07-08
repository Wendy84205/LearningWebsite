'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function MemoryFlipGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="memory-flip" /></Suspense>
}

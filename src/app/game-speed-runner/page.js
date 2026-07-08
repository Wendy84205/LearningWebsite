'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function SpeedRunnerGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="speed-runner" /></Suspense>
}

'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function VirtualLabGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="virtual-lab" /></Suspense>
}

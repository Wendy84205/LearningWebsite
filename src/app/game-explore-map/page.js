'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function ExploreMapGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="explore-map" /></Suspense>
}

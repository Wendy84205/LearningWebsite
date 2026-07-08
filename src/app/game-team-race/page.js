'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function TeamRaceGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="team-race" /></Suspense>
}

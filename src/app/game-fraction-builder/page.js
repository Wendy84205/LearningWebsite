'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function FractionBuilderGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="fraction-builder" /></Suspense>
}

'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function DragMatchGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="drag-match" /></Suspense>
}

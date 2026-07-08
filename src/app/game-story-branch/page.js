'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function StoryBranchGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="story-branch" /></Suspense>
}

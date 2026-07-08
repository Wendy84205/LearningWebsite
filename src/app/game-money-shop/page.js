'use client'
import { Suspense } from 'react'
import PhaserLearningGame from '@/lib/games/PhaserLearningGame'

export default function MoneyShopGamePage() {
  return <Suspense fallback={null}><PhaserLearningGame mode="money-shop" /></Suspense>
}

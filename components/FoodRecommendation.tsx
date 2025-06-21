'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Dice6 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import RandomFoodBox from './RandomFoodBox'
import { weightedRandomPick, WeightedFood } from '@/utils/weightedRandomPick'
import { pushMenuSelectEvent } from '@/lib/gtm'

interface FoodRecommendationProps {
  foodNames: WeightedFood[]
  onFoodSelected: (food: string | null) => void
  onClearPlaces: () => void
}

const FoodRecommendation = ({ foodNames, onFoodSelected, onClearPlaces }: FoodRecommendationProps) => {
  const t = useTranslations('foodMap')
  const [randomFood, setRandomFood] = useState<string | null>(null)
  const [showRandomFoodModal, setShowRandomFoodModal] = useState<boolean>(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  useEffect(() => {
    if (foodNames.length > 0) {
      const random = weightedRandomPick(foodNames)
      setRandomFood(random)
    }
  }, [foodNames])

  const handleRePick = () => {
    const otherFoods = foodNames.filter((f) => f.name !== randomFood)
    const random = weightedRandomPick(otherFoods)
    setRandomFood(random)
  }

  const handleAcceptRandomFood = () => {
    setHasUserInteracted(true)
    setShowRandomFoodModal(false)
    pushMenuSelectEvent(randomFood ?? '', 'random')  // 👈 GTM 이벤트 전송
    onFoodSelected(randomFood) // Pass randomFood directly
  }

  const handleShowRecommendation = () => {
    onClearPlaces()
    if (foodNames.length > 0) {
      const random = weightedRandomPick(foodNames)
      setRandomFood(random)
    }
    setShowRandomFoodModal(true)
    setHasUserInteracted(false)
  }

  const handleDismissRandomFood = () => {
    setRandomFood(null)
    setHasUserInteracted(true)
    setShowRandomFoodModal(false)
    onFoodSelected(null) // Pass null to reset to all foods
    if (foodNames.length > 0) {
      const random = weightedRandomPick(foodNames)
      setRandomFood(random)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleShowRecommendation}
          className="bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 text-sm"
        >
          <Dice6 className="h-4 w-4" />
          {t('showRecommendation')}
        </Button>
      </div>

      {showRandomFoodModal && (
        <Dialog open onOpenChange={setShowRandomFoodModal}>
          <DialogContent className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl w-full max-w-md mx-auto" aria-describedby="recommendation-description">
            <div>
              <DialogTitle className="mb-2">{t('todayRecommendation')}</DialogTitle>
              <RandomFoodBox
                foodNames={foodNames.map((f) => f.name)}
                randomFood={randomFood}
                onAccept={handleAcceptRandomFood}
                onRePick={handleRePick}
                onDismiss={handleDismissRandomFood}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default FoodRecommendation

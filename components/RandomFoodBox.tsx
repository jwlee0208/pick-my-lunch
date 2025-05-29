'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type Props = {
  foodNames: string[]
  randomFood: string | null
  onAccept: () => void
  onRePick: () => void
  onDismiss: () => void
}

const RandomFoodBox = ({ foodNames, randomFood, onAccept, onRePick, onDismiss }: Props) => {
  const t = useTranslations('randomBox')

  if (!randomFood || foodNames.length === 0) return null

  return (
    <div className="p-6 rounded-xl bg-yellow-100 dark:bg-yellow-800 text-black dark:text-white shadow text-center">
      <span className="text-lg font-semibold italic">
        {t('today')} <span className="text-red-600 dark:text-yellow-300 font-bold">{randomFood}</span>
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        <Button variant="outline" onClick={onAccept} className="bg-white dark:bg-black">
          {t('accept')}
        </Button>
        <Button variant="outline" onClick={onRePick} className="bg-white dark:bg-black">
          {t('retry')}
        </Button>
        <Button variant="outline" onClick={onDismiss} className="bg-white dark:bg-black">
          {t('hide')}
        </Button>
      </div>
    </div>
  )
}

export default RandomFoodBox

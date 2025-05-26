'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'

type Props = {
  filteredFoods: string[]
  focusedFood: string | null
  setFocusedFood: (food: string) => void
}

const MAX_TAGS = 10

export default function FoodTagList({ filteredFoods, focusedFood, setFocusedFood }: Props) {
  const [showAll, setShowAll] = useState(false)

  const displayFoods = showAll ? filteredFoods : filteredFoods.slice(0, MAX_TAGS)

  return (
    <div className="flex flex-wrap gap-2 items-center py-2">
      <div className="flex flex-wrap gap-2 items-center py-2">
        {displayFoods.map((food) => (
          <Badge
            key={food}
            variant={focusedFood === food ? 'default' : 'outline'}
            onClick={() => setFocusedFood(food)}
            className={`cursor-pointer transition-all text-sm px-3 py-1 ${
              focusedFood === food ? 'bg-indigo-600 text-white' : ''
            }`}
          >
            #{food}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center py-2">
        {filteredFoods.length > MAX_TAGS && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 underline ml-1"
          >
            {showAll ? '접기 ▲' : '더보기 ▼'}
          </button>
        )}
      </div>
    </div>
  )
}

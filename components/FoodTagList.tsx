'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { pushMenuSelectEvent } from '@/lib/gtm'

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
    <div className="flex flex-col items-center gap-4 py-2 w-full">
      {/* Badge Area with Scroll */}
      <div className="flex flex-wrap justify-center gap-2 w-full max-h-60 overflow-y-auto">
        {displayFoods.map((food) => (
          <Badge
            key={food}
            variant={focusedFood === food ? 'default' : 'outline'}
            onClick={() => {
              console.log('Badge 클릭됨:', food);
              setFocusedFood(food)
              pushMenuSelectEvent(food, 'tag')  // 👈 GTM 이벤트 전송
            }}
            className={`cursor-pointer transition-all text-sm px-3 py-1 text-center ${
              focusedFood === food ? 'bg-indigo-600 text-white' : ''
            }`}
          >
            #{food}
          </Badge>
        ))}
      </div>
      {/* Show More Button */}
      {filteredFoods.length > MAX_TAGS && (
        <div className="flex justify-center w-full">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 underline text-center"
          >
            {showAll ? '접기 ▲' : '더보기 ▼'}
          </button>
        </div>
      )}
    </div>
  )
}

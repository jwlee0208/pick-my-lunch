'use client'

import React, { useEffect, useState } from 'react'
import { Utensils, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FilterSection from '@/components/FilterSection'
import FoodMap from '@/components/FoodMap'
import FoodTagList from "@/components/FoodTagList"
import foodsData from "../public/data/foods.json"
import { WeightedFood } from '@/utils/weightedRandomPick'

const types = ['선택해주세요', '한식', '일식', '중식', '양식', '동남아시아']
const peoples = ['선택해주세요', '혼자', '친구', '직장동료','연인', '가족']
const bases = ['선택해주세요', '면', '밥', '빵', '기타']
const styles = ['선택해주세요', '간단히', '제대로']

type Food = {
  name: string
  type: string[]
  people: string[]
  base: string[]
  style: string[]
  weight: number
}

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedType, setSelectedType] = useState(types[0])
  const [selectedPeople, setSelectedPeople] = useState(peoples[0])
  const [selectedBase, setSelectedBase] = useState(bases[0])
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [focusedFood, setFocusedFood] = useState<string | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error('Geolocation error:', error)
      )
    }
  }, [])

  const resetFilters = () => {
    setSelectedType(types[0])
    setSelectedPeople(peoples[0])
    setSelectedBase(bases[0])
    setSelectedStyle(styles[0])
    setFocusedFood(null)
  }

  const filteredFoods: WeightedFood[] = foodsData
    .filter((food: Food) => {
      if (focusedFood) return food.name === focusedFood

      const typeMatch =
        selectedType === '선택해주세요' || food.type.includes(selectedType)

      const peopleMatch =
        selectedPeople === '선택해주세요' || food.people.includes(selectedPeople)

      const baseMatch =
        selectedBase === '선택해주세요' || food.base.includes(selectedBase)

      const styleMatch =
        selectedStyle === '선택해주세요' || food.style.includes(selectedStyle)

      return typeMatch && (peopleMatch || baseMatch || styleMatch)
    })
    .map((food: Food) => ({ name: food.name, weight: food.weight ?? 1 }))

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <FilterSection
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
        selectedBase={selectedBase}
        setSelectedBase={setSelectedBase}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        types={types}
        peoples={peoples}
        bases={bases}
        styles={styles}
      />

      {filteredFoods.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FoodTagList
            filteredFoods={filteredFoods.map(f => f.name)}
            focusedFood={focusedFood}
            setFocusedFood={setFocusedFood}
          />
          <Button variant="outline" onClick={resetFilters} className="gap-2">
            <RefreshCcw size={16} /> 초기화
          </Button>
        </section>
      )}

      {userLocation && filteredFoods.length > 0 && (
        <section>
          <FoodMap foodNames={filteredFoods} userLocation={userLocation} />
        </section>
      )}

      {filteredFoods.length === 0 && (
        <p className="mt-6 text-center text-red-600 font-semibold">
          선택한 조건에 맞는 음식이 없습니다.
        </p>
      )}
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { Utensils, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FilterSection from '@/components/FilterSection'
import FoodMap from '@/components/FoodMap'
import FoodTagList from "@/components/FoodTagList"
import { WeightedFood } from '@/utils/weightedRandomPick'
import { useTranslations } from 'next-intl'

type Props = {
  params: {
    locale: string
  }
}

const typesKey = ['typeDefault', 'korean', 'japanese', 'chinese', 'western', 'southeast']
const peoplesKey = ['peopleDefault', 'alone', 'friend', 'coworker', 'lover', 'family']
const basesKey = ['baseDefault', 'noodle', 'rice', 'bread', 'etc']
const stylesKey = ['styleDefault', 'simple', 'full']

type Food = {
  name: string
  type: string[]
  people: string[]
  base: string[]
  style: string[]
  weight: number
}

export default function Home({ params: { locale } }: Props) {
  const t = useTranslations('filters')

  const types = typesKey.map(key => t(key))
  const peoples = peoplesKey.map(key => t(key))
  const bases = basesKey.map(key => t(key))
  const styles = stylesKey.map(key => t(key))

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedType, setSelectedType] = useState(types[0])
  const [selectedPeople, setSelectedPeople] = useState(peoples[0])
  const [selectedBase, setSelectedBase] = useState(bases[0])
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [focusedFood, setFocusedFood] = useState<string | null>(null)
  const [foodsData, setFoodsData] = useState<Food[]>([])  // ✅ 다국어 foods 데이터 상태

  // ✅ 사용자 위치 가져오기
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

  // ✅ 언어에 맞는 foods.json 불러오기
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const res = await fetch(`/locales/${locale}/foods.json`)
        if (!res.ok) throw new Error('Failed to load foods.json')
        const data = await res.json()
        setFoodsData(data)
      } catch (error) {
        console.error('Error loading foods.json:', error)
      }
    }

    loadFoods()
  }, [locale])

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

      const typeMatch = selectedType === types[0] || food.type.includes(selectedType)
      const peopleMatch = selectedPeople === peoples[0] || food.people.includes(selectedPeople)
      const baseMatch = selectedBase === bases[0] || food.base.includes(selectedBase)
      const styleMatch = selectedStyle === styles[0] || food.style.includes(selectedStyle)

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
            <RefreshCcw size={16} /> {t('reset')}
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
          {t('noResult')}
        </p>
      )}
    </div>
  )
}

'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Utensils, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FilterSection from '@/components/recommend/FoodFilterSection'
import FoodMap from '@/components/map/FoodMap'
import FoodTagList from '@/components/recommend/FoodTagList'
import FoodRecommendation from '@/components/recommend/FoodRecommendation'
import { WeightedFood } from '@/utils/weightedRandomPick'
import { useTranslations } from 'next-intl'

type Props = {
  params: { locale: string }
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

  const types = typesKey.map((key) => t(key))
  const peoples = peoplesKey.map((key) => t(key))
  const bases = basesKey.map((key) => t(key))
  const styles = stylesKey.map((key) => t(key))

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedType, setSelectedType] = useState(types[0])
  const [selectedPeople, setSelectedPeople] = useState(peoples[0])
  const [selectedBase, setSelectedBase] = useState(bases[0])
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [focusedFood, setFocusedFood] = useState<string | null>(null)
  const [foodsData, setFoodsData] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recommendedFood, setRecommendedFood] = useState<string | null>(null)
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error('위치 정보 오류:', error)
      )
    }
  }, [])

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const res = await fetch(`/locales/${locale}/foods.json`)
        if (!res.ok) throw new Error('음식 데이터를 가져오지 못했습니다')
        const data = await res.json()
        setFoodsData(data)
        setLoading(false)
      } catch (error) {
        console.error('음식 데이터 로드 오류:', error)
        setError('음식 데이터를 로드하지 못했습니다')
        setLoading(false)
      }
    }
    loadFoods()
  }, [locale])

  useEffect(() => {
    console.log('focusedFood 변경됨:', focusedFood)
  }, [focusedFood])

  const resetFilters = () => {
    setSelectedType(types[0])
    setSelectedPeople(peoples[0])
    setSelectedBase(bases[0])
    setSelectedStyle(styles[0])
    setFocusedFood(null)
    setSelectedFoods([])
    setRecommendedFood(null)
  }

  const filteredFoods: WeightedFood[] = useMemo(() => {
    console.log('filteredFoods 계산됨:', foodsData.length)

    return foodsData
      .filter((food: Food) => {
        if (focusedFood) return food.name === focusedFood

        // type은 무조건 일치해야 함
        const typeMatch = selectedType === types[0] || food.type.includes(selectedType)
        if (!typeMatch) return false

        // people, base, style 중 하나 이상 매치되면 통과
        const peopleMatch = selectedPeople !== peoples[0] && food.people.includes(selectedPeople)
        const baseMatch = selectedBase !== bases[0] && food.base.includes(selectedBase)
        const styleMatch = selectedStyle !== styles[0] && food.style.includes(selectedStyle)

        const hasOtherFilters = selectedPeople !== peoples[0] || selectedBase !== bases[0] || selectedStyle !== styles[0]
        const additionalMatch = !hasOtherFilters || peopleMatch || baseMatch || styleMatch

        return additionalMatch
      })
      .map((food: Food) => ({
        name: food.name,
        weight: food.weight ?? 1,
      }))
  }, [
    foodsData,
    focusedFood,
    selectedType,
    selectedPeople,
    selectedBase,
    selectedStyle,
    types,
    peoples,
    bases,
    styles,
  ])

  const handleSetFocusedFood = (food: string) => {
    console.log('focusedFood 설정:', food)
    setFocusedFood(food)
    if (!selectedFoods.includes(food)) {
      setSelectedFoods((prev) => [...prev, food])
    }
  }

  const handleFoodSelected = (food: string | null) => {
    if (food) {
      setRecommendedFood(food)
      if (!selectedFoods.includes(food)) {
        setSelectedFoods((prev) => [...prev, food])
      }
    } else {
      setRecommendedFood(null)
      setSelectedFoods([])
    }
  }

  const handleClearPlaces = () => {
    setSelectedFoods([])
    setRecommendedFood(null)
  }

  if (loading) {
    return <div className="text-center py-6">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-6 text-red-600">Error: {error}</div>
  }

  return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Utensils size={28} className="text-indigo-600" /> {t('title')}
          </h2>
          <Button
            variant="default"
            onClick={() => setShowFilters((prev) => !prev)}
            className="bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 text-sm"
          >
            {showFilters ? t('hideFilters') : t('showFilters')}
          </Button>
        </header>

        {showFilters && (
          <section className="flex flex-row flex-wrap gap-4 border border-red-500 p-4 text-center">
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
          </section>
        )}
  
      <FoodRecommendation
        foodNames={filteredFoods}
        onFoodSelected={handleFoodSelected}
        onClearPlaces={handleClearPlaces}
      />
      {filteredFoods.length > 0 && (
        <section className="w-full">
          <FoodTagList
            filteredFoods={filteredFoods.map((f) => f.name)}
            focusedFood={focusedFood}
            setFocusedFood={handleSetFocusedFood}
          />
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={resetFilters} className="gap-2" style={{ padding: '0.5rem' }}>
              <RefreshCcw size={16} /> {t('reset')}
            </Button>
          </div>
        </section>
      )}
      {userLocation && filteredFoods.length > 0 && (
        <section>
          <FoodMap
            foodNames={filteredFoods}
            recommendedFood={recommendedFood}
            selectedFoods={selectedFoods}
            userLocation={userLocation}
          />
        </section>
      )}
      {filteredFoods.length === 0 && (
        <p className="mt-6 text-center text-red-600 font-semibold">{t('noResult')}</p>
      )}
    </div>
  )  
}

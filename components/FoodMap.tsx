'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Dice6 } from 'lucide-react'

import RandomFoodBox from './RandomFoodBox'
import PlaceList from './PlaceList'
import { weightedRandomPick, WeightedFood } from '@/utils/weightedRandomPick'

type Props = {
  foodNames: WeightedFood[]
  userLocation: { lat: number; lng: number }
}

const FoodMap = ({ foodNames, userLocation }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const googleMap = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isMapInitialized = useRef(false)
  const [places, setPlaces] = useState<any[]>([])
  const [randomFood, setRandomFood] = useState<string | null>(null)
  const [showRandomFoodModal, setShowRandomFoodModal] = useState<boolean>(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

  const selectedFoods = useMemo(() => {
    return randomFood ? [randomFood] : foodNames.map(f => f.name)
  }, [randomFood, foodNames])

  useEffect(() => {
    if (!userLocation) return

    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')

    const initialize = () => {
      if (window.google?.maps?.places) initMap()
    }

    if (existingScript) {
      existingScript.addEventListener('load', initialize)
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initialize
      document.head.appendChild(script)
    }
  }, [userLocation])

  const initMap = () => {
    if (!mapRef.current || !userLocation || isMapInitialized.current) return

    googleMap.current = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 14,
    })

    isMapInitialized.current = true
    if (selectedFoods.length > 0) searchMultipleFoods()
  }

  const searchMultipleFoods = () => {
    if (!googleMap.current || !window.google.maps.places) return

    clearMarkers()
    const service = new window.google.maps.places.PlacesService(googleMap.current)
    const allResults = new Map()

    const fetchPromises = selectedFoods.map((food) =>
      new Promise<void>((resolve) => {
        const request = {
          location: userLocation,
          radius: 1500,
          query: food,
        }

        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach((place) => {
              if (!allResults.has(place.place_id) && place.geometry?.location) {
                allResults.set(place.place_id, place)

                const marker = new window.google.maps.Marker({
                  map: googleMap.current,
                  position: place.geometry.location,
                  title: place.name,
                })

                marker.addListener('click', () => {
                  if (place.geometry?.location) {
                    googleMap.current.setCenter(place.geometry.location)
                    googleMap.current.setZoom(16)
                  }
                })

                markersRef.current.push(marker)
              }
            })
          }
          resolve()
        })
      })
    )

    Promise.all(fetchPromises).then(() => {
      setPlaces(Array.from(allResults.values()))
    })
  }

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
  }

  useEffect(() => {
    if (googleMap.current && selectedFoods && userLocation) {
      searchMultipleFoods()
    }
  }, [selectedFoods, userLocation])

  useEffect(() => {
    if (foodNames.length > 0) {
      const random = weightedRandomPick(foodNames)
      setRandomFood(random)
    }
  }, [foodNames])

  const handleAcceptRandomFood = () => {
    setHasUserInteracted(true)
    setShowRandomFoodModal(false)
    searchMultipleFoods()
  }

  const handleRePick = () => {
    const otherFoods = foodNames.filter((f) => f.name !== randomFood)
    const random = weightedRandomPick(otherFoods)
    setRandomFood(random)
  }

  const handleDismissRandomFood = () => {
    setRandomFood(null)
    setHasUserInteracted(true)
    setShowRandomFoodModal(false)
    searchMultipleFoods()
  }

  const handleShowRecommendation = () => {
    setPlaces([])
    clearMarkers()
    if (foodNames.length > 0) {
      const random = weightedRandomPick(foodNames)
      setRandomFood(random)
    }
    setShowRandomFoodModal(true)
    setHasUserInteracted(false)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleShowRecommendation}
          className="bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 text-sm"
        >
          <Dice6 className="h-4 w-4" />
          추천 음식 보기
        </Button>
      </div>

      <div ref={mapRef} className="w-full h-[400px] rounded-md border shadow-sm" />

      {places.length > 0 && <PlaceList places={places} userLocation={userLocation} />}

      {showRandomFoodModal && (
        <Dialog open onOpenChange={(open) => setShowRandomFoodModal(open)}>
          <DialogContent className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl w-full max-w-md mx-auto">
            <div>
              <DialogTitle className="mb-2">오늘의 추천 메뉴</DialogTitle>
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
    </div>
  )
}

export default FoodMap

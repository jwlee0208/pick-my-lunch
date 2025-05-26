'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import PlaceList from './PlaceList'
import RandomFoodBox from './RandomFoodBox'

type Props = {
  foodNames: string[]
  userLocation: { lat: number; lng: number }
}

const FoodMap = ({ foodNames, userLocation }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const googleMap = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isMapInitialized = useRef(false)
  const [places, setPlaces] = useState<any[]>([])
  const [randomFood, setRandomFood] = useState<string | null>(null)
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

  const selectedFoods = useMemo(() => {
    return randomFood ? [randomFood] : foodNames
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
    if (selectedFoods?.length > 0) searchMultipleFoods()
  }

  useEffect(() => {
    if (googleMap.current && selectedFoods && userLocation) {
      searchMultipleFoods()
    }
  }, [selectedFoods, userLocation])

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
              if (!allResults.has(place.place_id)) {
                if (place.geometry?.location) {
                  allResults.set(place.place_id, place)

                  const marker = new window.google.maps.Marker({
                    map: googleMap.current,
                    position: place.geometry.location,
                    title: place.name,
                  })

                  marker.addListener('click', () => {
                    // 안전하게 place.geometry?.location 체크 후 사용
                    if (place.geometry?.location) {
                      googleMap.current.setCenter(place.geometry.location)
                      googleMap.current.setZoom(16)
                    }
                  })

                  markersRef.current.push(marker)
                }
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
    if (foodNames?.length > 0) {
      const random = foodNames[Math.floor(Math.random() * foodNames.length)]
      setRandomFood(random)
    }
  }, [foodNames])

  const handleAcceptRandomFood = () => {
    searchMultipleFoods()
  }

  const handleRePick = () => {
    const otherFoods = foodNames.filter((f) => f !== randomFood)
    const random = otherFoods[Math.floor(Math.random() * otherFoods.length)]
    setRandomFood(random)
  }

  const handleDismissRandomFood = () => {
    setRandomFood(null)
    searchMultipleFoods()
  }

  return (
    <div className="w-full space-y-4">
      <RandomFoodBox
        foodNames={foodNames}
        randomFood={randomFood}
        onAccept={handleAcceptRandomFood}
        onRePick={handleRePick}
        onDismiss={handleDismissRandomFood}
      />

      <div ref={mapRef} className="w-full h-[400px] rounded-md border shadow-sm" />

      {places.length > 0 && <PlaceList places={places} userLocation={userLocation} />}
    </div>
  )
}

export default FoodMap

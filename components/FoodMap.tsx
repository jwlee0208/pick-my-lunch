'use client'

import React, { useRef, useState, useCallback } from 'react'
import MapContainer from './MapContainer'
import PlaceSearch from './PlaceSearch'
import MarkerManager from './MarkerManager'
import FoodRecommendation from './FoodRecommendation'
import PlaceList from './PlaceList'
import { WeightedFood } from '@/utils/weightedRandomPick'

interface Place {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
  business_status?: string
}

type Props = {
  foodNames: WeightedFood[]
  userLocation: { lat: number; lng: number }
}

const FoodMap = ({ foodNames, userLocation }: Props) => {
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isMapInitialized = useRef(false)
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedFood, setSelectedFood] = useState<string | null>(null)

  const selectedFoods = useCallback(() => {
    return selectedFood ? [selectedFood] : foodNames.map(f => f.name)
  }, [selectedFood, foodNames])

  const handleMapLoaded = () => {
    if (selectedFoods().length > 0) {
      // Trigger search when map is loaded
    }
  }

  const handleClearPlaces = () => {
    setPlaces([])
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
  }

  return (
    <div className="w-full space-y-4">
      <FoodRecommendation
        foodNames={foodNames}
        onFoodSelected={setSelectedFood}
        onClearPlaces={handleClearPlaces}
      />
      <MapContainer
        userLocation={userLocation}
        mapInstance={mapInstance}
        isMapInitialized={isMapInitialized}
        onMapLoaded={handleMapLoaded}
      />
      <PlaceSearch
        selectedFoods={selectedFoods()}
        userLocation={userLocation}
        mapInstance={mapInstance}
        onPlacesUpdated={setPlaces}
      />
      <MarkerManager places={places} mapInstance={mapInstance} markersRef={markersRef} />
      {places.length > 0 && <PlaceList places={places} userLocation={userLocation} />}
    </div>
  )
}

export default FoodMap

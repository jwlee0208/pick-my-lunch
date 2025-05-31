'use client'

import React, { useRef, useState, useCallback } from 'react'
import MapContainer from './map/MapContainer'
import PlaceSearch from './place/PlaceSearch'
import MarkerManager from './map/MarkerManager'
import FoodRecommendation from './FoodRecommendation'
import PlaceList from './place/PlaceList'
import { WeightedFood } from '@/utils/weightedRandomPick'
import { Place } from '@/types/place'

type Props = {
  foodNames: WeightedFood[]
  recommendedFood: string | null
  selectedFoods: string[]
  userLocation: { lat: number; lng: number }
}

const FoodMap = ({ foodNames, recommendedFood, selectedFoods, userLocation }: Props) => {
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isMapInitialized = useRef(false)
  const [places, setPlaces] = useState<Place[]>([])

  const handleMapLoaded = () => {
    console.log('지도 로드 완료')
    isMapInitialized.current = true
  }

  const handleClearPlaces = () => {
    setPlaces([])
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
  }

  return (
    <div className="w-full space-y-4">
      <MapContainer
        userLocation={userLocation}
        mapInstance={mapInstance}
        isMapInitialized={isMapInitialized}
        onMapLoaded={handleMapLoaded}
      />
      <PlaceSearch
        recommendedFood={recommendedFood}
        selectedFoods={selectedFoods}
        userLocation={userLocation}
        mapInstance={mapInstance}
        isMapInitialized={isMapInitialized}
        onPlacesUpdated={setPlaces}
      />
      <MarkerManager places={places} mapInstance={mapInstance} markersRef={markersRef} />
      {places.length > 0 && <PlaceList places={places} userLocation={userLocation} />}
    </div>
  )
}

export default FoodMap

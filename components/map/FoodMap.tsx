'use client'

import React, { useRef, useState, useCallback } from 'react'
import MapContainer from './MapContainer'
import PlaceSearch from '../place/PlaceSearch'
import MarkerManager from './MarkerManager'
import PlaceList from '../place/PlaceList'
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
    // 마커 정리
    markersRef.current.forEach((marker) => {
      if (marker.setMap) {
        marker.setMap(null)
      }
    })
    markersRef.current = []
  }

  // 장소 업데이트 핸들러 - 중복 제거 및 정렬 로직 추가
  const handlePlacesUpdated = useCallback((newPlaces: Place[]) => {
    setPlaces(prevPlaces => {
      // 기존 장소와 새 장소를 합치고 중복 제거
      const placeMap = new Map<string, Place>()

      // 기존 장소들 추가
      prevPlaces.forEach(place => {
        placeMap.set(place.place_id, place)
      })

      // 새 장소들 추가 (덮어쓰기)
      newPlaces.forEach(place => {
        placeMap.set(place.place_id, place)
      })

      // Map을 배열로 변환하고 거리순으로 정렬
      const uniquePlaces = Array.from(placeMap.values())
      return uniquePlaces.sort((a, b) => {
        if (a.distance == null) return 1
        if (b.distance == null) return -1
        return a.distance - b.distance
      })
    })
  }, [])

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <MapContainer
          userLocation={userLocation}
          mapInstance={mapInstance}
          isMapInitialized={isMapInitialized}
          onMapLoaded={handleMapLoaded}
        />

        {/* 지도 위에 클리어 버튼 추가 */}
        {places.length > 0 && (
          <button
            onClick={handleClearPlaces}
            className="absolute top-2 right-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm shadow-sm z-10 transition-colors"
          >
            🗑️ 지도 초기화
          </button>
        )}
      </div>

      <PlaceSearch
        recommendedFood={recommendedFood}
        selectedFoods={selectedFoods}
        userLocation={userLocation}
        mapInstance={mapInstance}
        isMapInitialized={isMapInitialized}
        onPlacesUpdated={handlePlacesUpdated}
      />

      <MarkerManager
        places={places}
        mapInstance={mapInstance}
        markersRef={markersRef}
        userLocation={userLocation}
      />

      {places.length > 0 && (
        <div className="mt-4">
          <PlaceList places={places} userLocation={userLocation} />
          <div className="mt-2 text-sm text-gray-600 text-center">
            총 {places.length}개의 식당을 찾았습니다 (반경 1.5km 내)
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodMap

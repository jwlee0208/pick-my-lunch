'use client'

import React, { useEffect, useCallback, useState } from 'react'
import { useLocale } from 'next-intl'
import { Place } from '@/types/place'
import {
  extractCoordinates,
  calculateDistance,
  convertGooglePlace,
  convertKakaoPlace,
  filterPlacesByRadius
} from '@/utils/typeGuards'

interface PlaceSearchProps {
  recommendedFood: string | null
  selectedFoods: string[]
  userLocation: { lat: number; lng: number }
  mapInstance: React.MutableRefObject<any>
  isMapInitialized: React.MutableRefObject<boolean>
  onPlacesUpdated: (places: Place[]) => void
}

const PlaceSearch = ({
  recommendedFood,
  selectedFoods,
  userLocation,
  mapInstance,
  isMapInitialized,
  onPlacesUpdated,
}: PlaceSearchProps) => {
  const locale = useLocale()
  const [processedFoods, setProcessedFoods] = useState<Set<string>>(new Set())
  const [allPlaces, setAllPlaces] = useState<Map<string, Place>>(new Map())

  const searchMultipleFoods = useCallback(
    async (foodsToSearch: string[]) => {
      if (!mapInstance.current || !isMapInitialized.current) {
        console.warn('지도 인스턴스 또는 초기화 상태 없음')
        return
      }

      const newResults = new Map<string, Place>()

      if (locale === 'en' || locale === 'ja' || locale === 'zh-hant') {
        if (!window.google?.maps?.places) {
          console.warn('Google Maps Places 서비스 로드 실패')
          return
        }

        const service = new window.google.maps.places.PlacesService(mapInstance.current)

        const fetchPromises = foodsToSearch.map(
          (food) =>
            new Promise<void>((resolve) => {
              const request: google.maps.places.TextSearchRequest = {
                location: userLocation,
                radius: 1500, // 1.5km
                query: food,
              }

              service.textSearch(request, (results: any[] | null, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                  const validPlaces: Place[] = []

                  results.forEach((googlePlace) => {
                    const isActive =
                      googlePlace.business_status !== 'CLOSED_PERMANENTLY' &&
                      googlePlace.business_status !== 'CLOSED_TEMPORARILY'

                    if (!googlePlace.place_id || !googlePlace.geometry?.location || !isActive) return

                    // 유틸리티 함수로 변환
                    const place = convertGooglePlace(googlePlace, userLocation)
                    if (place) {
                      validPlaces.push(place)
                    }
                  })

                  // 반경 필터링 적용
                  const filteredPlaces = filterPlacesByRadius(validPlaces, userLocation, 1.5)
                  filteredPlaces.forEach((place) => {
                    newResults.set(place.place_id, place)
                  })
                } else {
                  console.warn(`Google Places 검색 실패: ${status}, 키워드: ${food}`)
                }
                resolve()
              })
            })
        )

        await Promise.all(fetchPromises)
      } else if (locale === 'ko') {
        if (!window.kakao?.maps?.services) {
          console.error('Kakao Maps 서비스 로드 실패')
          return
        }

        const placesService = new window.kakao.maps.services.Places()

        const fetchPlaces = (keyword: string): Promise<Place[]> =>
          new Promise((resolve) => {
            placesService.keywordSearch(
              keyword,
              (results: KakaoPlaceData[], status: string) => {
                if (status === window.kakao.maps.services.Status.OK && results) {
                  const places: Place[] = []
                  for (const kakaoPlace of results) {
                    // 유틸리티 함수로 변환
                    const place = convertKakaoPlace(kakaoPlace, userLocation)
                    if (place) {
                      places.push(place)
                    }
                  }

                  // 반경 필터링 적용
                  const filteredPlaces = filterPlacesByRadius(places, userLocation, 1.5)
                  resolve(filteredPlaces)
                } else {
                  console.warn(`Kakao 검색 실패: ${keyword}, 상태: ${status}`)
                  resolve([])
                }
              },
              {
                location: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
                radius: 1500,
              }
            )
          })

        const fetchPromises = foodsToSearch.map(async (food) => {
          const results = await fetchPlaces(food)
          results.forEach((place) => {
            if (!newResults.has(place.place_id)) {
              newResults.set(place.place_id, place)
            }
          })
        })

        await Promise.all(fetchPromises)
      }

      // 처리된 음식 추가
      setProcessedFoods((prev) => {
        const updated = new Set(prev)
        foodsToSearch.forEach((food) => updated.add(food))
        return updated
      })

      setAllPlaces((prev) => {
        const updated = new Map(prev)
        newResults.forEach((place, place_id) => updated.set(place_id, place))
        return updated
      })

      // 마커 생성은 MarkerManager에서만 하도록 제거
      onPlacesUpdated(Array.from(newResults.values()))
    },
    [locale, userLocation, mapInstance, isMapInitialized, onPlacesUpdated]
  )

  useEffect(() => {
    if (!isMapInitialized.current || !userLocation) return

    if (locale === 'ko' && !window.kakao?.maps?.services) {
      console.warn('Kakao Maps 서비스 모듈 로드 대기 중')
      return
    }

    const foodsToSearch: string[] = []

    if (recommendedFood && !processedFoods.has(recommendedFood)) {
      foodsToSearch.push(recommendedFood)
    }

    selectedFoods.forEach((food) => {
      if (!processedFoods.has(food) && food !== recommendedFood) {
        foodsToSearch.push(food)
      }
    })

    if (foodsToSearch.length > 0) {
      searchMultipleFoods(foodsToSearch)
    }
  }, [recommendedFood, selectedFoods, userLocation, isMapInitialized, searchMultipleFoods, locale, processedFoods])

  return null
}

export default PlaceSearch

'use client'

import React, { useEffect, useCallback, useState } from 'react'
import { useLocale } from 'next-intl'
import { Place } from '@/types/place'

// 커스텀 타입 정의
interface LatLng {
  lat: () => number
  lng: () => number
}

interface LatLngLiteral {
  lat: number
  lng: number
}

interface PlaceResult {
  place_id?: string
  name?: string
  geometry?: { location?: LatLng | LatLngLiteral }
  formatted_address?: string
  business_status?: string
  rating?: number
  vicinity?: string
}

interface KakaoPlace {
  id: string
  place_name: string
  address_name: string
  road_address_name?: string
  x: string
  y: string
  distance?: string
}

interface PlaceSearchProps {
  recommendedFood: string | null
  selectedFoods: string[]
  userLocation: { lat: number; lng: number }
  mapInstance: React.MutableRefObject<any>
  isMapInitialized: React.MutableRefObject<boolean>
  onPlacesUpdated: (places: Place[]) => void
}

// 타입 가드 함수
const isLatLng = (location: unknown): location is LatLng => {
  return !!location && typeof (location as LatLng).lat === 'function' && typeof (location as LatLng).lng === 'function'
}

const isLatLngLiteral = (location: unknown): location is LatLngLiteral => {
  return !!location && typeof (location as LatLngLiteral).lat === 'number' && typeof (location as LatLngLiteral).lng === 'number'
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

      if (locale === 'en') {
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
                radius: 1500,
                query: food,
              }

              service.textSearch(request, (results: PlaceResult[] | null, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                  results.forEach((place) => {
                    const isActive =
                      place.business_status !== 'CLOSED_PERMANENTLY' &&
                      place.business_status !== 'CLOSED_TEMPORARILY'

                    if (!place.place_id || !place.geometry?.location || !isActive) return

                    let lat: number, lng: number
                    const location = place.geometry.location

                    if (isLatLng(location)) {
                      lat = location.lat()
                      lng = location.lng()
                    } else if (isLatLngLiteral(location)) {
                      lat = location.lat
                      lng = location.lng
                    } else {
                      console.warn(`유효하지 않은 location 형식: ${place.name}`, location)
                      return
                    }

                    newResults.set(place.place_id, {
                      place_id: place.place_id,
                      name: place.name || '',
                      formatted_address: place.formatted_address || '',
                      geometry: { location: { lat, lng } },
                      business_status: place.business_status,
                      rating: place.rating,
                      vicinity: place.vicinity,
                    })
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
              (results: KakaoPlace[], status: string) => {
                if (status === window.kakao.maps.services.Status.OK && results) {
                  const places: Place[] = []
                  for (const item of results) {
                    const lat = parseFloat(item.y)
                    const lng = parseFloat(item.x)
                    if (isNaN(lat) || isNaN(lng)) {
                      console.warn(`유효하지 않은 좌표: id=${item.id}, x=${item.x}, y=${item.y}`)
                      continue
                    }
                    places.push({
                      place_id: item.id,
                      name: item.place_name,
                      formatted_address: item.road_address_name || item.address_name,
                      geometry: { location: { lat, lng } },
                      business_status: 'OPERATIONAL',
                      vicinity: item.address_name,
                      distance: item.distance ? parseFloat(item.distance) / 1000 : null, // 미터 → km
                    })
                  }
                  resolve(places)
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

      setAllPlaces((prev) => {
        const updated = new Map(prev)
        newResults.forEach((place, place_id) => updated.set(place_id, place))
        return updated
      })

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

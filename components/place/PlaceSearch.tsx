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
  place_url?: string // 상세 페이지 URL
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
      const markers: any[] = [] // Kakao Maps 마커 저장

      const isKakaoUsable =
        locale === 'ko' &&
        typeof window !== 'undefined' &&
        window.kakao?.maps?.services &&
        typeof window.kakao.maps.services.Places === 'function'
      console.log(`isKakaoUsable : ${isKakaoUsable}`)
      if (isKakaoUsable) {
        // ✅ Kakao 지도 로직 실행
        console.log('카카오 지도 실행')
      } else {
        // ✅ Google 지도 로직 fallback 실행
        console.log('구글 지도 실행')
      }

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

                    const placeData: Place = {
                      place_id: place.place_id,
                      name: place.name || '',
                      formatted_address: place.formatted_address || '',
                      geometry: { location: { lat, lng } },
                      business_status: place.business_status,
                      rating: place.rating,
                      vicinity: place.vicinity,
                      source: 'google',
                    }
                    newResults.set(place.place_id, placeData)

                    // Google Maps 마커 추가
                    const marker = new window.google.maps.Marker({
                      position: { lat, lng },
                      map: mapInstance.current,
                      title: place.name,
                    })
                    markers.push(marker)
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
                    const placeData: Place = {
                      place_id: item.id,
                      name: item.place_name,
                      formatted_address: item.road_address_name || item.address_name,
                      geometry: { location: { lat, lng } },
                      business_status: 'OPERATIONAL',
                      vicinity: item.address_name,
                      distance: item.distance ? parseFloat(item.distance) / 1000 : null,
                      source: 'kakao',
                      place_url: item.place_url,
                    }
                    places.push(placeData)

                    const marker = new window.kakao.maps.Marker({
                      map: mapInstance.current,
                      position: new window.kakao.maps.LatLng(lat, lng),
                      title: item.place_name,
                    })
                    markers.push(marker)
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

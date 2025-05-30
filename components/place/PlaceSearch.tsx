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
  geometry?: { location?: LatLng | LatLngLiteral | { lat: number; lng: number } }
  formatted_address?: string
  business_status?: string
}

interface PlaceSearchProps {
  recommendedFood: string | null // FoodRecommendation에서 받은 초기 음식
  selectedFoods: string[] // 추가 선택된 음식
  userLocation: { lat: number; lng: number }
  mapInstance: React.MutableRefObject<any>
  isMapInitialized: React.MutableRefObject<boolean>
  onPlacesUpdated: (places: Place[]) => void
}

interface KakaoPlace {
  id: string
  place_name: string
  address_name: string
  x: string
  y: string
}

// 타입 가드 함수
const isLatLng = (location: any): location is LatLng => {
  const isValid = location && typeof location.lat === 'function' && typeof location.lng === 'function'
  if (!isValid) {
    console.log('isLatLng 실패, location:', location)
  }
  return isValid
}

const isLatLngLiteral = (location: any): location is LatLngLiteral => {
  return location && typeof location.lat === 'number' && typeof location.lng === 'number'
}

const PlaceSearch = ({ recommendedFood, selectedFoods, userLocation, mapInstance, isMapInitialized, onPlacesUpdated }: PlaceSearchProps) => {
  const locale = useLocale()
  const [processedFoods, setProcessedFoods] = useState<Set<string>>(new Set()) // 처리된 음식 캐싱
  const [allPlaces, setAllPlaces] = useState<Map<string, Place>>(new Map()) // 모든 장소 저장

  const searchMultipleFoods = useCallback(
    async (foodsToSearch: string[]) => {
      if (!mapInstance.current) {
        console.warn('지도 인스턴스 없음')
        return
      }

      console.log('searchMultipleFoods 호출, locale:', locale, 'foods:', foodsToSearch)

      const newResults = new Map<string, Place>()

      if (locale === 'en') {
        if (!window.google?.maps?.places) {
          console.warn('Google Maps Places 서비스 없음')
          return
        }

        const service = new window.google.maps.places.PlacesService(mapInstance.current)

        const fetchPromises = foodsToSearch.map(
          (food) =>
            new Promise<void>((resolve) => {
              console.log(`locale: ${locale}, 검색 키워드: ${food}`)
              const request: google.maps.places.TextSearchRequest = {
                location: userLocation,
                radius: 1500,
                query: food,
              }

              service.textSearch(request, (results: PlaceResult[] | null, status) => {
                console.log('Google Places API 응답:', { status, results })
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                  results.forEach((place) => {
                    const isActive =
                      place.business_status !== 'CLOSED_PERMANENTLY' &&
                      place.business_status !== 'CLOSED_TEMPORARILY'

                    if (!newResults.has(place.place_id!) && place.geometry?.location && isActive) {
                      let lat: number, lng: number
                      const location = place.geometry.location

                      console.log('Location 객체:', location, 'isLatLng:', isLatLng(location), 'isLatLngLiteral:', isLatLngLiteral(location))

                      if (isLatLng(location)) {
                        lat = location.lat()
                        lng = location.lng()
                      } else if (isLatLngLiteral(location)) {
                        lat = location.lat
                        lng = location.lng
                      } else {
                        console.warn('유효하지 않은 location 형식:', location)
                        return
                      }

                      newResults.set(place.place_id!, {
                        place_id: place.place_id!,
                        name: place.name!,
                        formatted_address: place.formatted_address || '',
                        geometry: { location: { lat, lng } },
                        business_status: place.business_status,
                      })
                      console.log('Google 장소 추가:', place.name)
                    }
                  })
                } else {
                  console.warn('Google Places 검색 실패:', status)
                }
                resolve()
              })
            })
        )

        await Promise.all(fetchPromises)
      } else if (locale === 'ko') {
        console.log('window.kakao.maps.services:', window.kakao?.maps?.services)
        if (!window.kakao?.maps?.services) {
          console.error('Kakao Maps 서비스 없음')
          return
        }

        const placesService = new window.kakao.maps.services.Places()

        const fetchPlaces = (keyword: string): Promise<Place[]> =>
          new Promise((resolve) => {
            console.log(`locale: ${locale}, 검색 키워드: ${keyword}`)
            placesService.keywordSearch(
              keyword,
              (results: KakaoPlace[], status: string) => {
                console.log('Kakao Places API 응답:', { status, results })
                if (status === window.kakao.maps.services.Status.OK && results) {
                  const places: Place[] = results.map((item) => {
                    const location = {
                      lat: isNaN(parseFloat(item.y)) ? 0 : parseFloat(item.y),
                      lng: isNaN(parseFloat(item.x)) ? 0 : parseFloat(item.x),
                    }
                    return {
                      place_id: item.id,
                      name: item.place_name,
                      formatted_address: item.address_name,
                      geometry: { location },
                      business_status: 'OPERATIONAL',
                    }
                  })
                  resolve(places)
                } else {
                  console.warn('Kakao 검색 실패:', keyword)
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

      // 기존 장소와 병합
      setAllPlaces((prev) => {
        const updated = new Map(prev)
        newResults.forEach((place, place_id) => updated.set(place_id, place))
        return updated
      })

      const finalPlaces = Array.from(newResults.values())
      console.log('새로운 장소 목록:', finalPlaces)
      onPlacesUpdated(Array.from(allPlaces.values()).concat(finalPlaces))

      // 처리된 음식 업데이트
      setProcessedFoods((prev) => {
        const updated = new Set(prev)
        foodsToSearch.forEach((food) => updated.add(food))
        return updated
      })
    },
    [locale, userLocation, mapInstance, onPlacesUpdated, allPlaces]
  )

  useEffect(() => {
    console.log('PlaceSearch useEffect 실행', {
      mapInstanceCurrent: mapInstance.current,
      isMapInitialized: isMapInitialized.current,
      recommendedFood,
      selectedFoods,
      userLocation,
      kakaoMapsServices: locale === 'ko' ? window.kakao?.maps?.services : 'N/A',
    })

    if (isMapInitialized.current && userLocation) {
      if (locale === 'ko' && !window.kakao?.maps?.services) {
        console.warn('Kakao Maps services 모듈이 아직 로드되지 않음')
        return
      }

      // 검색할 음식 목록 구성
      const foodsToSearch: string[] = []

      // 초기 추천 음식 처리
      if (recommendedFood && !processedFoods.has(recommendedFood)) {
        foodsToSearch.push(recommendedFood)
      }

      // 추가 선택된 음식 처리
      selectedFoods.forEach((food) => {
        if (!processedFoods.has(food) && food !== recommendedFood) {
          foodsToSearch.push(food)
        }
      })

      if (foodsToSearch.length > 0) {
        console.log('searchMultipleFoods 호출, foods:', foodsToSearch)
        searchMultipleFoods(foodsToSearch)
      }
    }
  }, [recommendedFood, selectedFoods, userLocation, isMapInitialized, searchMultipleFoods, locale, processedFoods])

  return null
}

export default PlaceSearch

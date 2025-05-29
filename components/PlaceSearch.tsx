'use client'

import React, { useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'

interface Place {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
  business_status?: string
}

interface PlaceSearchProps {
  selectedFoods: string[]
  userLocation: { lat: number; lng: number }
  mapInstance: React.MutableRefObject<any>
  onPlacesUpdated: (places: Place[]) => void
}

const PlaceSearch = ({ selectedFoods, userLocation, mapInstance, onPlacesUpdated }: PlaceSearchProps) => {
  const locale = useLocale()

  const searchMultipleFoods = useCallback(async () => {
    if (!mapInstance.current) return
    const allResults = new Map<string, Place>()

    if (locale === 'en') {
      if (!window.google?.maps?.places) return
      const service = new window.google.maps.places.PlacesService(mapInstance.current)

      const fetchPromises = selectedFoods.map(
        (food) =>
          new Promise<void>((resolve) => {
            const request: google.maps.places.TextSearchRequest = {
              location: userLocation,
              radius: 1500,
              query: food,
            }

            service.textSearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                results.forEach((place) => {
                  const isActive =
                    place.business_status !== 'CLOSED_PERMANENTLY' &&
                    place.business_status !== 'CLOSED_TEMPORARILY'
                  if (!allResults.has(place.place_id!) && place.geometry?.location && isActive) {
                    allResults.set(place.place_id!, {
                      place_id: place.place_id!,
                      name: place.name!,
                      formatted_address: place.formatted_address!,
                      geometry: {
                        location: {
                          lat: place.geometry!.location!.lat(),
                          lng: place.geometry!.location!.lng(),
                        },
                      },
                      business_status: place.business_status,
                    })
                  }
                })
              }
              resolve()
            })
          })
      )

      await Promise.all(fetchPromises)
    } else if (locale === 'ko') {
      if (!window.kakao?.maps?.services) {
        console.error('Kakao Maps services not available')
        return
      }

      const placesService = new window.kakao.maps.services.Places()

      const fetchPlaces = (food: string): Promise<Place[]> =>
        new Promise((resolve) => {
          placesService.keywordSearch(
            food,
            (results, status) => {
              if (status === window.kakao.maps.services.Status.OK && results) {
                const places = results.map((item: any) => ({
                  place_id: item.id,
                  name: item.place_name,
                  formatted_address: item.address_name,
                  geometry: {
                    location: {
                      lat: parseFloat(item.y),
                      lng: parseFloat(item.x),
                    },
                  },
                  business_status: 'OPERATIONAL', // Kakao는 영업 상태 미제공, 기본값 설정
                }))
                resolve(places)
              } else {
                resolve([])
              }
            },
            {
              location: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
              radius: 1500,
            }
          )
        })

      const fetchPromises = selectedFoods.map(async (food) => {
        const results = await fetchPlaces(food)
        results.forEach((place) => {
          if (!allResults.has(place.place_id) && place.geometry.location) {
            allResults.set(place.place_id, place)
          }
        })
      })

      await Promise.all(fetchPromises)
    }

    onPlacesUpdated(Array.from(allResults.values()))
  }, [locale, selectedFoods, userLocation, mapInstance])

  useEffect(() => {
    if (mapInstance.current && selectedFoods.length > 0 && userLocation) {
      searchMultipleFoods()
    }
  }, [selectedFoods, userLocation, searchMultipleFoods])

  return null
}

export default PlaceSearch

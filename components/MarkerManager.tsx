'use client'

import React, { useEffect } from 'react'
import { useLocale } from 'next-intl'

interface Place {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
  business_status?: string
}

interface MarkerManagerProps {
  places: Place[]
  mapInstance: React.MutableRefObject<any>
  markersRef: React.MutableRefObject<any[]>
}

const MarkerManager = ({ places, mapInstance, markersRef }: MarkerManagerProps) => {
  const locale = useLocale()

  useEffect(() => {
    if (!mapInstance.current) return

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    places.forEach((place) => {
      if (locale === 'en' && window.google?.maps) {
        const marker = new window.google.maps.Marker({
          map: mapInstance.current,
          position: place.geometry.location,
          title: place.name,
        })

        marker.addListener('click', () => {
          mapInstance.current.setCenter(place.geometry.location)
          mapInstance.current.setZoom(17)
        })

        markersRef.current.push(marker)
      } else if (locale === 'ko' && window.kakao?.maps) {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
          map: mapInstance.current,
          title: place.name,
        })

        window.kakao.maps.event.addListener(marker, 'click', () => {
          mapInstance.current.setCenter(
            new window.kakao.maps.LatLng(
              place.geometry.location.lat,
              place.geometry.location.lng
            )
          )
          mapInstance.current.setLevel(1) // Zoom in (level 1 ≈ Google zoom 17)
        })

        markersRef.current.push(marker)
      }
    })
  }, [places, mapInstance, markersRef, locale])

  return null
}

export default MarkerManager

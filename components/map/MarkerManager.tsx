'use client'

import React, { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Place } from '@/types/place'

interface MarkerManagerProps {
  places: Place[]
  mapInstance: React.MutableRefObject<any>
  markersRef: React.MutableRefObject<any[]>
}

const MarkerManager = ({ places, mapInstance, markersRef }: MarkerManagerProps) => {
  const locale = useLocale()

  useEffect(() => {
    if (!mapInstance.current) {
      console.warn('Map instance not available')
      return
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    places.forEach((place) => {
      console.log('Processing place:', place.name, place.geometry.location)

      if (locale === 'en' && window.google?.maps) {
        // Google Maps: location is { lat: number, lng: number }
        const position = place.geometry.location

        // Validate coordinates
        if (isNaN(position.lat) || isNaN(position.lng)) {
          console.warn('Invalid coordinates for place:', place.name)
          return
        }

        const marker = new window.google.maps.Marker({
          map: mapInstance.current,
          position,
          title: place.name,
        })

        marker.addListener('click', () => {
          mapInstance.current.setCenter(position)
          mapInstance.current.setZoom(17)
        })

        markersRef.current.push(marker)
        console.log('Google marker created for:', place.name)
      } else if (locale === 'ko' && window.kakao?.maps) {
        // Kakao Maps: location is { lat: number, lng: number }
        const position = place.geometry.location

        // Validate coordinates
        if (isNaN(position.lat) || isNaN(position.lng)) {
          console.warn('Invalid coordinates for place:', place.name)
          return
        }

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(position.lat, position.lng),
          map: mapInstance.current,
          title: place.name,
        })

        window.kakao.maps.event.addListener(marker, 'click', () => {
          mapInstance.current.setCenter(
            new window.kakao.maps.LatLng(position.lat, position.lng)
          )
          mapInstance.current.setLevel(1) // Zoom in (level 1 ≈ Google zoom 17)
        })

        markersRef.current.push(marker)
        console.log('Kakao marker created for:', place.name)
      }
    })
  }, [places, mapInstance, markersRef, locale])

  return null
}

export default MarkerManager

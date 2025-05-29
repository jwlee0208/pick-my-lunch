'use client'

import React, { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'

interface MapContainerProps {
  userLocation: { lat: number; lng: number }
  mapInstance: React.MutableRefObject<any>
  isMapInitialized: React.MutableRefObject<boolean>
  onMapLoaded: () => void
}

const MapContainer = ({ userLocation, mapInstance, isMapInitialized, onMapLoaded }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const locale = useLocale()

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY

  useEffect(() => {
    if (!userLocation) {
      console.error('Missing user location')
      return
    }

    if (locale === 'en' && !GOOGLE_API_KEY) {
      console.error('Missing Google API key')
      return
    }

    if (locale === 'ko' && !KAKAO_MAP_API_KEY) {
      console.error('Missing Kakao API key')
      return
    }

    const initializeMap = () => {
      if (!mapRef.current || isMapInitialized.current) return

      if (locale === 'en' && window.google?.maps) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: userLocation,
          zoom: 14,
        })
      } else if (locale === 'ko' && window.kakao?.maps) {
        mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
          level: 3, // Kakao의 zoom level (3 ≈ Google의 zoom 14)
        })
      }

      isMapInitialized.current = true
      onMapLoaded()
    }

    const loadScript = () => {
      if (locale === 'en') {
        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
        if (existingScript) {
          if (existingScript.getAttribute('data-loaded')) {
            initializeMap()
          } else {
            existingScript.addEventListener('load', () => {
              existingScript.setAttribute('data-loaded', 'true')
              initializeMap()
            })
          }
        } else {
          const script = document.createElement('script')
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
          script.async = true
          script.defer = true
          script.setAttribute('data-loaded', 'true')
          script.onload = initializeMap
          document.head.appendChild(script)
        }
      } else if (locale === 'ko') {
        const existingScript = document.querySelector('script[src*="//dapi.kakao.com/v2/maps/sdk.js"]')
        if (existingScript) {
          if (existingScript.getAttribute('data-loaded')) {
            initializeMap()
          } else {
            existingScript.addEventListener('load', () => {
              existingScript.setAttribute('data-loaded', 'true')
              initializeMap()
            })
          }
        } else {
          const script = document.createElement('script')
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`
          script.async = true
          script.defer = true
          script.setAttribute('data-loaded', 'true')
          script.onload = () => {
            window.kakao.maps.load(initializeMap)
          }
          document.head.appendChild(script)
        }
      }
    }

    loadScript()
  }, [userLocation, locale, GOOGLE_API_KEY, KAKAO_MAP_API_KEY, isMapInitialized, onMapLoaded])

  return <div ref={mapRef} className="w-full h-[400px] rounded-md border shadow-sm" />
}

export default MapContainer

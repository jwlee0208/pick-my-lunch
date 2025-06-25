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

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    places.forEach(place => {
      const location = place.geometry.location

      // Google Maps 처리
      if ((locale === 'en'|| locale === 'ja' || locale === 'zh-hant') && window.google?.maps) {
        let lat: number
        let lng: number

        // google.maps.LatLng 객체인지 확인
        if (typeof location.lat === 'function' && typeof location.lng === 'function') {
          lat = location.lat()
          lng = location.lng()
        } else {
          lat = (location as any).lat
          lng = (location as any).lng
        }

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('Invalid Google coordinates for:', place.name)
          return
        }

        const marker = new window.google.maps.Marker({
          map: mapInstance.current,
          position: { lat, lng },
          title: place.name,
        })

        marker.addListener('click', () => {
          mapInstance.current.setCenter({ lat, lng })
          mapInstance.current.setZoom(17)
        })

        markersRef.current.push(marker)
        console.log('Google marker created for:', place.name)

        // Kakao Maps 처리
      } else if (locale === 'ko' && window.kakao?.maps) {
        const lat = location.lat
        const lng = location.lng

        if (isNaN(lat as number) || isNaN(lng as number)) {
          console.warn('Invalid Kakao coordinates for:', place.name)
          return
        }

        const kakaoLatLng = new window.kakao.maps.LatLng(lat as number, lng as number)

        const marker = new window.kakao.maps.Marker({
          position: kakaoLatLng,
          map: mapInstance.current,
          title: place.name,
        })

        window.kakao.maps.event.addListener(marker, 'click', () => {
          mapInstance.current.setCenter(kakaoLatLng)
          mapInstance.current.setLevel(1)
        })

        markersRef.current.push(marker)
        console.log('Kakao marker created for:', place.name)
      }
    })
  }, [places, mapInstance, markersRef, locale])

  return null
}

export default MarkerManager

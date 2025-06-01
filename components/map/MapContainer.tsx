'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

interface MapContainerProps {
  userLocation: { lat: number; lng: number }
  mapInstance: React.MutableRefObject<any>
  isMapInitialized: React.MutableRefObject<boolean>
  onMapLoaded: (map: any) => void
}

const MapContainer = ({ userLocation, mapInstance, isMapInitialized, onMapLoaded }: MapContainerProps) => {
  const locale = useLocale()
  const mapRef = useRef<HTMLDivElement>(null)
  const [isSdkLoaded, setIsSdkLoaded] = useState<boolean>(false)

  const loadScript = (src: string, callback: () => void): void => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => {
      console.log('Kakao Maps 스크립트 로드 성공:', src)
      callback()
    }
    script.onerror = () => console.error('Kakao Maps 스크립트 로드 실패:', src)
    document.head.appendChild(script)
  }

  const initializeMap = () => {
    console.log('initializeMap 시작:', locale)
    if (locale === 'en') {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps SDK 로드 실패')
        return
      }
      const map = new window.google.maps.Map(mapRef.current!, {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 19,
      })
      console.log('Google Maps 초기화 완료:', map)
      mapInstance.current = map
      isMapInitialized.current = true
      onMapLoaded(map)
    } else if (locale === 'ko') {
      console.log('window.kakao:', window.kakao)
      console.log('window.kakao.maps:', window.kakao?.maps)
      console.log('window.kakao.maps.services:', window.kakao?.maps?.services)
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps SDK 로드 실패')
        return
      }
      window.kakao.maps.load(() => {
        console.log('Kakao Maps SDK 로드됨')
        if (!window.kakao.maps.services) {
          console.error('Kakao Maps services 모듈 로드 실패')
          return
        }
        const map = new window.kakao.maps.Map(mapRef.current!, {
          center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
          level: 4,
        })
        console.log('Kakao Maps 초기화 완료:', map)
        mapInstance.current = map
        isMapInitialized.current = true
        setIsSdkLoaded(true)
        onMapLoaded(map)
      })
    } else {
      console.error('지원하지 않는 locale:', locale)
    }
  }

  useEffect(() => {
    if (!mapRef.current || !userLocation) return

    if (locale === 'ko') {
      if (window.kakao && window.kakao.maps) {
        initializeMap()
      } else {
        console.log('Kakao Maps 스크립트 로드 중')
        loadScript(
          `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`,
          () => {
            console.log('Kakao Maps 스크립트 로드 완료')
            initializeMap()
          }
        )
      }
    } else {
      if (window.google && window.google.maps) {
        initializeMap()
      } else {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`,
          initializeMap
        )
      }
    }
  }, [locale, userLocation])

  return (
    <div
      ref={mapRef}
      className="h-[400px] w-full"
      style={{ minHeight: '400px' }}
    />
  )
}

export default MapContainer

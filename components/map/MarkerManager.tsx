'use client'

import React, { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Place } from '@/types/place'

interface MarkerManagerProps {
  places: Place[]
  mapInstance: React.MutableRefObject<any>
  markersRef: React.MutableRefObject<any[]>
  userLocation: { lat: number; lng: number }
}

const MarkerManager = ({ places, mapInstance, markersRef, userLocation }: MarkerManagerProps) => {
  const locale = useLocale()

  // 상세 페이지로 이동하는 함수
  const goToPlaceDetail = (place: Place) => {
    let url = ''
    if (place.source === 'kakao' && place.place_url) {
      url = place.place_url
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    if (!mapInstance.current) {
      console.warn('Map instance not available')
      return
    }

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // 🔵 사용자 위치 마커 생성
    if (locale === 'en' || locale === 'ja' || locale === 'zh-hant') {
      // Google Maps 사용자 위치 마커
      if (window.google?.maps) {
        const userMarker = new window.google.maps.Marker({
          map: mapInstance.current,
          position: { lat: userLocation.lat, lng: userLocation.lng },
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="#ffffff" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12),
          },
        })
        markersRef.current.push(userMarker)
      }
    } else if (locale === 'ko' && window.kakao?.maps) {
      // Kakao Maps 사용자 위치 마커
      const userPosition = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      const userMarker = new window.kakao.maps.Marker({
        position: userPosition,
        map: mapInstance.current,
        title: '현재 위치',
        image: new window.kakao.maps.MarkerImage(
          'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="#ffffff" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="#ffffff"/>
            </svg>
          `),
          new window.kakao.maps.Size(24, 24),
          { offset: new window.kakao.maps.Point(12, 12) }
        ),
      })
      markersRef.current.push(userMarker)
    }

    // 🍽️ 식당 마커 생성
    places.forEach(place => {
      const location = place.geometry.location

      // Google Maps 처리
      if ((locale === 'en' || locale === 'ja' || locale === 'zh-hant') && window.google?.maps) {
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

        // 마커 생성
        const marker = new window.google.maps.Marker({
          map: mapInstance.current,
          position: { lat, lng },
          title: place.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C11.6 2 8 5.6 8 10C8 16.2 16 28 16 28S24 16.2 24 10C24 5.6 20.4 2 16 2Z" fill="#EA4335" stroke="#ffffff" stroke-width="1"/>
                <circle cx="16" cy="10" r="4" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32),
          },
        })

        // InfoWindow 생성 (마커 클릭 시 식당명과 상세보기 버튼)
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${place.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${place.vicinity || place.formatted_address || ''}</p>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                ${place.rating ? `
                  <span style="display: flex; align-items: center; font-size: 14px;">
                    ⭐ ${place.rating.toFixed(1)}
                  </span>
                ` : ''}
                ${place.distance ? `
                  <span style="font-size: 14px; color: #666;">
                    📍 ${place.distance < 1 ? `${Math.round(place.distance * 1000)}m` : `${place.distance.toFixed(1)}km`}
                  </span>
                ` : ''}
              </div>
              <button
                onclick="window.googleInfoWindowAction('${place.place_id}')"
                style="background: #1976d2; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;"
              >
                상세보기
              </button>
            </div>
          `,
        })

        // 전역 함수로 상세보기 액션 등록
        ;(window as any).googleInfoWindowAction = (placeId: string) => {
          const targetPlace = places.find(p => p.place_id === placeId)
          if (targetPlace) {
            goToPlaceDetail(targetPlace)
          }
        }

        marker.addListener('click', () => {
          // 다른 InfoWindow 모두 닫기
          if ((window as any).currentInfoWindow) {
            ;(window as any).currentInfoWindow.close()
          }
          infoWindow.open(mapInstance.current, marker)
          ;(window as any).currentInfoWindow = infoWindow
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

        // 커스텀 마커 이미지
        const markerImage = new window.kakao.maps.MarkerImage(
          'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C11.6 2 8 5.6 8 10C8 16.2 16 28 16 28S24 16.2 24 10C24 5.6 20.4 2 16 2Z" fill="#FEE500" stroke="#000000" stroke-width="1"/>
              <circle cx="16" cy="10" r="4" fill="#000000"/>
            </svg>
          `),
          new window.kakao.maps.Size(32, 32),
          { offset: new window.kakao.maps.Point(16, 32) }
        )

        const marker = new window.kakao.maps.Marker({
          position: kakaoLatLng,
          map: mapInstance.current,
          title: place.name,
          image: markerImage,
        })

        // InfoWindow 생성
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 200px; font-family: 'Malgun Gothic', sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${place.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${place.vicinity || place.formatted_address || ''}</p>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                ${place.rating ? `
                  <span style="display: flex; align-items: center; font-size: 14px;">
                    ⭐ ${place.rating.toFixed(1)}
                  </span>
                ` : ''}
                ${place.distance ? `
                  <span style="font-size: 14px; color: #666;">
                    📍 ${place.distance < 1 ? `${Math.round(place.distance * 1000)}m` : `${place.distance.toFixed(1)}km`}
                  </span>
                ` : ''}
              </div>
              <button
                onclick="window.kakaoInfoWindowAction('${place.place_id}')"
                style="background: #FEE500; color: #000; border: 1px solid #000; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;"
              >
                상세보기
              </button>
            </div>
          `,
        })

        // 전역 함수로 상세보기 액션 등록
        ;(window as any).kakaoInfoWindowAction = (placeId: string) => {
          const targetPlace = places.find(p => p.place_id === placeId)
          if (targetPlace) {
            goToPlaceDetail(targetPlace)
          }
        }

        window.kakao.maps.event.addListener(marker, 'click', () => {
          // 다른 InfoWindow 모두 닫기
          if ((window as any).currentKakaoInfoWindow) {
            ;(window as any).currentKakaoInfoWindow.close()
          }
          infoWindow.open(mapInstance.current, marker)
          ;(window as any).currentKakaoInfoWindow = infoWindow
        })

        markersRef.current.push(marker)
        console.log('Kakao marker created for:', place.name)
      }
    })
  }, [places, mapInstance, markersRef, locale, userLocation])

  return null
}

export default MarkerManager

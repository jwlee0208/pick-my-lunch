// 타입 가드 함수들
import { Place, PlaceLocation } from '@/types/place'

// Google Maps LatLng 객체 체크
export const isGoogleLatLng = (location: any): location is google.maps.LatLng => {
  return (
    location &&
    typeof location.lat === 'function' &&
    typeof location.lng === 'function'
  )
}

// LatLng 리터럴 객체 체크
export const isLatLngLiteral = (location: any): location is { lat: number; lng: number } => {
  return (
    location &&
    typeof location.lat === 'number' &&
    typeof location.lng === 'number'
  )
}

// Kakao LatLng 객체 체크
export const isKakaoLatLng = (location: any): location is KakaoLatLng => {
  return (
    location &&
    typeof location.getLat === 'function' &&
    typeof location.getLng === 'function'
  )
}

// PlaceLocation에서 lat, lng 추출
export const extractCoordinates = (location: PlaceLocation): { lat: number; lng: number } => {
  let lat: number, lng: number

  if (typeof location.lat === 'function') {
    lat = location.lat()
    lng = (location.lng as () => number)()
  } else {
    lat = location.lat as number
    lng = location.lng as number
  }

  return { lat, lng }
}

// Google Place 결과를 내부 Place 타입으로 변환
export const convertGooglePlace = (googlePlace: any, userLocation: { lat: number; lng: number }): Place | null => {
  if (!googlePlace.place_id || !googlePlace.geometry?.location || !googlePlace.name) {
    return null
  }

  const { lat, lng } = extractCoordinates(googlePlace.geometry.location)
  const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng)

  return {
    place_id: googlePlace.place_id,
    name: googlePlace.name,
    formatted_address: googlePlace.formatted_address || '',
    geometry: { location: { lat, lng } },
    business_status: googlePlace.business_status,
    rating: googlePlace.rating,
    vicinity: googlePlace.vicinity,
    distance,
    source: 'google',
    user_ratings_total: googlePlace.user_ratings_total,
    price_level: googlePlace.price_level,
    opening_hours: googlePlace.opening_hours,
    photos: googlePlace.photos?.map((photo: any) => ({
      height: photo.height,
      width: photo.width,
      photo_reference: photo.photo_reference,
    })),
  }
}

// Kakao Place 결과를 내부 Place 타입으로 변환
export const convertKakaoPlace = (kakaoPlace: KakaoPlaceData, userLocation: { lat: number; lng: number }): Place | null => {
  const lat = parseFloat(kakaoPlace.y)
  const lng = parseFloat(kakaoPlace.x)

  if (isNaN(lat) || isNaN(lng)) {
    return null
  }

  const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng)

  return {
    place_id: kakaoPlace.id,
    name: kakaoPlace.place_name,
    formatted_address: kakaoPlace.road_address_name || kakaoPlace.address_name,
    geometry: { location: { lat, lng } },
    business_status: 'OPERATIONAL',
    vicinity: kakaoPlace.address_name,
    distance,
    source: 'kakao',
    place_url: kakaoPlace.place_url,
    category_name: kakaoPlace.category_name,
    phone: kakaoPlace.phone,
  }
}

// 거리 계산 함수
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 반경 필터링
export const filterPlacesByRadius = (places: Place[], center: { lat: number; lng: number }, radiusKm: number): Place[] => {
  return places.filter(place => {
    if (place.distance == null) return true
    return place.distance <= radiusKm
  })
}

// 장소 중복 제거
export const deduplicatePlaces = (places: Place[]): Place[] => {
  const placeMap = new Map<string, Place>()

  places.forEach(place => {
    const existing = placeMap.get(place.place_id)
    if (!existing || (place.distance != null && (existing.distance == null || place.distance < existing.distance))) {
      placeMap.set(place.place_id, place)
    }
  })

  return Array.from(placeMap.values())
}

// 비즈니스 상태 체크
export const isPlaceOpen = (place: Place): boolean => {
  return place.business_status !== 'CLOSED_PERMANENTLY' &&
         place.business_status !== 'CLOSED_TEMPORARILY'
}

// 평점이 있는 장소만 필터링
export const filterPlacesWithRating = (places: Place[], minRating: number = 0): Place[] => {
  return places.filter(place => place.rating != null && place.rating >= minRating)
}

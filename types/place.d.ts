// Place 인터페이스 개선
export interface Place {
  place_id: string
  name: string
  formatted_address?: string
  geometry: {
    location: PlaceLocation
  }
  business_status?: string
  rating?: number
  vicinity?: string
  distance?: number | null
  source: 'kakao' | 'google'
  place_url?: string
  // 추가 필드들
  category_name?: string
  phone?: string
  user_ratings_total?: number
  price_level?: number
  opening_hours?: {
    open_now?: boolean
    weekday_text?: string[]
  }
  photos?: Array<{
    height: number
    width: number
    photo_reference: string
  }>
}

// 위치 정보를 위한 유니온 타입
export type PlaceLocation =
  | { lat: number; lng: number }                    // 일반 객체 (Kakao, 변환된 데이터)
  | { lat: () => number; lng: () => number }        // Google Maps LatLng 함수형
  | google.maps.LatLng                              // Google Maps LatLng 클래스
  | google.maps.LatLngLiteral                       // Google Maps 리터럴

// 더 명확한 타입 가드를 위한 인터페이스들
export interface NumberCoordinates {
  lat: number
  lng: number
}

export interface FunctionCoordinates {
  lat: () => number
  lng: () => number
}

// Google Maps 전용 Place 결과 타입
export interface GooglePlaceResult {
  place_id?: string
  name?: string
  geometry?: {
    location?: google.maps.LatLng | google.maps.LatLngLiteral
  }
  formatted_address?: string
  business_status?: string
  rating?: number
  vicinity?: string
  user_ratings_total?: number
  price_level?: number
  opening_hours?: {
    open_now?: boolean
    weekday_text?: string[]
  }
  photos?: google.maps.places.PlacePhoto[]
}

// Kakao Maps 전용 Place 결과 타입
export interface KakaoPlaceResult {
  id: string
  place_name: string
  address_name: string
  road_address_name?: string
  x: string
  y: string
  category_name?: string
  phone?: string
  place_url?: string
  distance?: string
}

// 검색 옵션 타입
export interface PlaceSearchOptions {
  location: { lat: number; lng: number }
  radius?: number
  keyword: string
  type?: 'restaurant' | 'food' | 'meal_takeaway'
}

// 검색 결과 상태 타입
export interface PlaceSearchResult {
  places: Place[]
  status: 'OK' | 'ZERO_RESULTS' | 'ERROR' | 'OVER_QUERY_LIMIT'
  total_count?: number
  next_page_token?: string
}

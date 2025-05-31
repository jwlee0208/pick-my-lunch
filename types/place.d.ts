export interface Place {
  place_id: string
  name: string
  formatted_address?: string
  geometry: { location: { lat: number; lng: number } }
  business_status?: string
  rating?: number
  vicinity?: string
  distance?: number | null
  source: 'kakao' | 'google' // API 소스 구분
  place_url?: string // Kakao Maps 상세 페이지 URL
}

export interface Place {
  place_id: string
  name: string
  formatted_address?: string
  geometry: {
    location: { lat: number; lng: number } | google.maps.LatLng
  }
  business_status?: string
  rating?: number
  vicinity?: string
  distance?: number | null
  source: 'kakao' | 'google'
  place_url?: string
}

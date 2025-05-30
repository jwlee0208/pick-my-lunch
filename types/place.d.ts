export interface Place {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: { lat: number; lng: number }
      // | { lat: () => number; lng: () => number }
  }
  business_status?: string
}

export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  business_status?: string;
  rating?: number; // 선택적 속성
  vicinity?: string; // 선택적 속성
  distance?: number | null; // PlaceList에서 사용
}

export {}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google: {
      maps?: typeof google.maps & {
        Map: new (element: HTMLElement, opts?: google.maps.MapOptions) => google.maps.Map
        Marker: new (opts?: google.maps.MarkerOptions) => google.maps.Marker
        InfoWindow: new (opts?: google.maps.InfoWindowOptions) => google.maps.InfoWindow
        LatLng: new (lat: number, lng: number) => google.maps.LatLng
        Size: new (width: number, height: number) => google.maps.Size
        Point: new (x: number, y: number) => google.maps.Point
        places: {
          PlacesService: new (map: google.maps.Map | HTMLDivElement) => google.maps.places.PlacesService
          PlacesServiceStatus: typeof google.maps.places.PlacesServiceStatus
        }
      }
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string
              includedLanguages?: string
              layout?: any
            },
            container: string
          ): void
          InlineLayout: {
            SIMPLE: any
          }
        }
      }
    }
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: { center: any; level: number }) => KakaoMap
        LatLng: new (lat: number, lng: number) => KakaoLatLng
        Size: new (width: number, height: number) => KakaoSize
        Point: new (x: number, y: number) => KakaoPoint
        // MarkerImage 생성자 수정: 3번째 파라미터는 options 객체
        MarkerImage: new (
          src: string,
          size: KakaoSize,
          options?: {
            offset?: KakaoPoint
            alt?: string
            coords?: string
            shape?: string
          }
        ) => KakaoMarkerImage
        Marker: new (options: {
          position: KakaoLatLng
          map?: KakaoMap
          title?: string
          image?: KakaoMarkerImage
        }) => KakaoMarker
        // InfoWindow 추가
        InfoWindow: new (options: {
          content?: string
          position?: KakaoLatLng
          removable?: boolean
          zIndex?: number
        }) => KakaoInfoWindow
        services: {
          Places: new () => KakaoPlacesService
          Status: {
            OK: string
            ZERO_RESULT: string
            ERROR: string
          }
        }
        event: {
          addListener: (target: any, event: string, callback: (...args: any[]) => void) => void
          removeListener: (target: any, event: string, callback: (...args: any[]) => void) => void
        }
        load: (callback: () => void) => void
      }
    }
    // InfoWindow 액션을 위한 전역 함수들
    googleInfoWindowAction?: (placeId: string) => void
    kakaoInfoWindowAction?: (placeId: string) => void
    currentInfoWindow?: google.maps.InfoWindow
    currentKakaoInfoWindow?: KakaoInfoWindow
  }

  // Kakao Maps 타입 정의
  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void
    setLevel(level: number): void
    setBounds(bounds: KakaoLatLngBounds): void
    getBounds(): KakaoLatLngBounds
    getCenter(): KakaoLatLng
    getLevel(): number
  }

  interface KakaoLatLng {
    getLat(): number
    getLng(): number
  }

  interface KakaoLatLngBounds {
    extend(latlng: KakaoLatLng): void
    contains(latlng: KakaoLatLng): boolean
  }

  interface KakaoMarker {
    setMap(map: KakaoMap | null): void
    setPosition(latlng: KakaoLatLng): void
    getPosition(): KakaoLatLng
    setTitle(title: string): void
    setImage(image: KakaoMarkerImage): void
  }

  interface KakaoMarkerImage {
    // MarkerImage 관련 메서드들
  }

  interface KakaoSize {
    width: number
    height: number
  }

  interface KakaoPoint {
    x: number
    y: number
  }

  interface KakaoInfoWindow {
    open(map: KakaoMap, marker?: KakaoMarker): void
    close(): void
    setContent(content: string): void
    getContent(): string
    setPosition(latlng: KakaoLatLng): void
    getPosition(): KakaoLatLng
  }

  interface KakaoPlacesService {
    keywordSearch(
      keyword: string,
      callback: (results: KakaoPlaceData[], status: string, pagination?: any) => void,
      options?: {
        location?: KakaoLatLng
        radius?: number
        bounds?: KakaoLatLngBounds
        page?: number
        size?: number
        sort?: string
      }
    ): void
    categorySearch(
      code: string,
      callback: (results: KakaoPlaceData[], status: string, pagination?: any) => void,
      options?: {
        location?: KakaoLatLng
        radius?: number
        bounds?: KakaoLatLngBounds
        page?: number
        size?: number
      }
    ): void
  }

  interface KakaoPlaceData {
    id: string
    place_name: string
    category_name: string
    category_group_code: string
    category_group_name: string
    phone: string
    address_name: string
    road_address_name: string
    x: string
    y: string
    place_url: string
    distance: string
  }

  // Google Maps 타입 확장
  namespace google.maps {
    interface MarkerOptions {
      position?: LatLng | LatLngLiteral
      map?: Map | null
      title?: string
      icon?: string | Icon | Symbol
      label?: string | MarkerLabel
      draggable?: boolean
      clickable?: boolean
      cursor?: string
      opacity?: number
      zIndex?: number
      visible?: boolean
      animation?: Animation
    }

    interface InfoWindowOptions {
      content?: string | Element | Text
      position?: LatLng | LatLngLiteral
      pixelOffset?: Size
      maxWidth?: number
      disableAutoPan?: boolean
    }

    interface Icon {
      url: string
      size?: Size
      origin?: Point
      anchor?: Point
      scaledSize?: Size
      labelOrigin?: Point
    }
  }
}

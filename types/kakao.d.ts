declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: { center: any; level: number }) => any
        LatLng: new (lat: number, lng: number) => any
        services: {
          Places: new () => {
            keywordSearch: (
              query: string,
              callback: (results: KakaoPlace[], status: string) => void,
              options?: { location?: any; radius?: number }
            ) => void
          }
          Status: {
            OK: string
            ZERO_RESULT: string
            ERROR: string
          }
        }
        event: {
          addListener: (target: any, event: string, callback: () => void) => void
        }
        Marker: new (options: { position: any; map: any; title?: string }) => any
        load: (callback: () => void) => void
      }
    }
  }
}

interface KakaoPlace {
  id: string
  place_name: string
  address_name: string
  x: string
  y: string
}

export {}

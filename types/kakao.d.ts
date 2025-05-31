declare namespace kakao {
  namespace maps {
    class Map {
      constructor(container: HTMLElement, options: { center: LatLng; level: number })
      setBounds(bounds: LatLngBounds): void
      setCenter(latlng: LatLng): void
      setLevel(level: number): void
      getBounds(): LatLngBounds
    }
    class LatLng {
      constructor(lat: number, lng: number)
    }
    class LatLngBounds {
      constructor()
      extend(latlng: LatLng): void
    }
    class Marker {
      constructor(options: { map: Map; position: LatLng; title?: string; image?: MarkerImage })
      setMap(map: Map | null): void
    }
    class MarkerImage {
      constructor(src: string, size: Size)
    }
    class Size {
      constructor(width: number, height: number)
    }
    namespace services {
      class Places {
        keywordSearch(
          keyword: string,
          callback: (results: any[], status: string) => void,
          options?: { bounds?: LatLngBounds; location?: LatLng; radius?: number }
        ): void
      }
      enum Status {
        OK = 'OK',
        ZERO_RESULT = 'ZERO_RESULT',
        ERROR = 'ERROR'
      }
    }
    function load(callback: () => void): void
    namespace event {
      function addListener(target: any, event: string, callback: () => void): void
      function removeListener(target: any, event: string, callback: () => void): void
    }
  }
}

interface Window {
  kakao: typeof kakao
}

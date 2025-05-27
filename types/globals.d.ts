// types/globals.d.ts
export {}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google: {
      maps?: typeof google.maps
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
            // 필요 시 추가 가능
          }
        }
      }
    }
    googleTranslateElementInit?: () => void;
  }
}

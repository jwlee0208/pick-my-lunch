declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

export const pushMenuSelectEvent = (menuName: string, source: 'tag' | 'selectBox' | 'random') => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'menu_selected',
      menuName,
      source,
    });
  }
}

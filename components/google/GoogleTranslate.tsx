'use client'

import { useEffect } from 'react'

export function GoogleTranslate() {
// GoogleTranslate.tsx 내부
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    window.googleTranslateElementInit = () => {
      // ✅ 안전하게 google.translate이 존재하는지 확인
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'ko',
            includedLanguages: 'en,ja,zh-CN,zh-TW,es',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        )
      }
    }

    return () => {
      delete window.googleTranslateElementInit
    }
  }, [])

  return (
    <div className="h-10 w-full flex items-center overflow-hidden">
      <div id="google_translate_element" className="w-full" />

      {/* 스타일 커스터마이징 */}
      <style jsx global>{`
        #google_translate_element {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          line-height: 1;
        }

        .goog-te-gadget {
          font-family: inherit !important;
          font-size: inherit !important;
        }

        .goog-te-gadget-simple {
          display: block !important;
          width: 100% !important;
          max-height: 2.5rem !important;
          overflow: hidden;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          line-height: 1.2 !important;
        }

        .goog-te-menu-value {
          font-size: 0.875rem !important;
          padding: 0 !important;
          line-height: 1.2 !important;
        }

        .goog-logo-link,
        .goog-te-gadget .goog-te-combo + span {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

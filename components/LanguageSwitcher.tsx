'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const languages = [
  { code: 'ko', label: '🇰🇷 한국어' },
  { code: 'en', label: '🇺🇸🇬🇧 English' },
  { code: 'ja', label: '🇯🇵 日本語' },
  { code: 'zh-hant', label: '🇹🇼🇭🇰🇲🇴 繁體中文' },
];

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value

    const segments = pathname.split('/')
    segments[1] = nextLocale // 로케일 세그먼트 변경
    const newPath = segments.join('/')

    router.push(newPath)
  }

  return (
    <select
      className="border px-2 py-1 text-sm"
      defaultValue={currentLocale}
      onChange={handleChange}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}

'use client'

import React from 'react'
import { Utensils, Users, Leaf, Star } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'  // ✅ i18n 훅 추가
import { pushMenuSelectEvent } from '@/lib/gtm'

type Props = {
  selectedType: string
  setSelectedType: (value: string) => void
  selectedPeople: string
  setSelectedPeople: (value: string) => void
  selectedBase: string
  setSelectedBase: (value: string) => void
  selectedStyle: string
  setSelectedStyle: (value: string) => void
  types: string[]
  peoples: string[]
  bases: string[]
  styles: string[]
}

export default function FoodFilterSection({
                                        selectedType,
                                        setSelectedType,
                                        selectedPeople,
                                        setSelectedPeople,
                                        selectedBase,
                                        setSelectedBase,
                                        selectedStyle,
                                        setSelectedStyle,
                                        types,
                                        peoples,
                                        bases,
                                        styles,
                                      }: Props) {
  const t = useTranslations('filters')  // ✅ 'filters' 네임스페이스 사용

  const filters = [
    {
      id: 'type',
      label: t('typeLabel'), // 예: "음식 종류"
      value: selectedType,
      onChange: setSelectedType,
      options: types,
      icon: <Utensils size={16} />,
    },
    {
      id: 'people',
      label: t('peopleLabel'), // 예: "함께하는 사람"
      value: selectedPeople,
      onChange: setSelectedPeople,
      options: peoples,
      icon: <Users size={16} />,
    },
    {
      id: 'base',
      label: t('baseLabel'), // 예: "주 재료"
      value: selectedBase,
      onChange: setSelectedBase,
      options: bases,
      icon: <Leaf size={16} />,
    },
    {
      id: 'style',
      label: t('styleLabel'), // 예: "스타일"
      value: selectedStyle,
      onChange: setSelectedStyle,
      options: styles,
      icon: <Star size={16} />,
    },
  ]

  return (
    <section className="flex flex-row flex-wrap gap-4 justify-center">
      {filters.map(({ id, label, value, onChange, options, icon }) => (
        <div key={id} className="flex flex-col items-start w-40">
          <label htmlFor={id} className="mb-1 text-sm font-semibold flex items-center gap-2">
            {icon} {label}
          </label>
          <Select value={value} onValueChange={(val) => {
            onChange(val)
            pushMenuSelectEvent(val, 'selectBox')  // 👈 GTM 이벤트 전송
          }}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder={t('selectDefault')} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </section>
  )
}

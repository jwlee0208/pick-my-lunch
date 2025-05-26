'use client'

import React, { useEffect, useState } from 'react'
import { Utensils, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FilterSection from '@/components/FilterSection'
import FoodMap from '@/components/FoodMap'

const types = ['선택해주세요', '한식', '일식', '중식', '양식']
const peoples = ['선택해주세요', '혼자', '친구', '직장동료']
const bases = ['선택해주세요', '면', '밥']
const styles = ['선택해주세요', '간단히', '제대로']

const foodsData = [
  {
    "name": "김치찌개",
    "type": ["한식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날", "비오는날"]
  },
  {
    "name": "잔치국수",
    "type": ["한식"],
    "people": ["혼자", "가족"],
    "base": ["면"],
    "style": ["간단히"],
    "weather": ["비오는날"]
  },
  {
    "name": "비빔밥",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "김밥",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "제육덮밥",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "된장찌개",
    "type": ["한식"],
    "people": ["가족", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "불고기덮밥",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "김치볶음밥",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["비오는날"]
  },
  {
    "name": "순두부찌개",
    "type": ["한식"],
    "people": ["혼자", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "칼국수",
    "type": ["한식"],
    "people": ["가족", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "떡볶이",
    "type": ["한식"],
    "people": ["동료", "연인"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "냉면",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "잡채밥",
    "type": ["한식"],
    "people": ["가족", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "오징어볶음",
    "type": ["한식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "된장비빔밥",
    "type": ["한식"],
    "people": ["혼자", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "돼지불백",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "김치전",
    "type": ["한식"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["비오는날"]
  },
  {
    "name": "소고기국밥",
    "type": ["한식"],
    "people": ["혼자", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "해물파전",
    "type": ["한식"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["비오는날"]
  },
  {
    "name": "멸치국수",
    "type": ["한식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "짜장면",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "짬뽕",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "볶음밥",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "탕수육",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "마파두부",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "깐풍기",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "간짜장",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "짬뽕밥",
    "type": ["중식"],
    "people": ["혼자", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "군만두",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "새우볶음밥",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "유산슬밥",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "고추잡채",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "양장피",
    "type": ["중식"],
    "people": ["가족", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "라조기",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "멘보샤",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "잡탕밥",
    "type": ["중식"],
    "people": ["혼자", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "오징어짬뽕",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "깐쇼새우",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "유린기",
    "type": ["중식"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "난자완스",
    "type": ["중식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "오므라이스",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "까르보나라",
    "type": ["양식"],
    "people": ["연인", "가족"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "마르게리타 피자",
    "type": ["양식"],
    "people": ["동료", "가족"],
    "base": ["빵"],
    "style": ["제대로"],
    "weather": ["더운날"]
  },
  {
    "name": "알프레도 파스타",
    "type": ["양식"],
    "people": ["혼자", "연인"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "샌드위치",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["빵"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "치킨샐러드",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "스테이크덮밥",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "라자냐",
    "type": ["양식"],
    "people": ["가족", "연인"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "햄버거",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["빵"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "토마토 파스타",
    "type": ["양식"],
    "people": ["혼자", "연인"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "시저샐러드",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "치킨텐더",
    "type": ["양식"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "그릴드치킨랩",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["빵"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "페퍼로니 피자",
    "type": ["양식"],
    "people": ["동료", "가족"],
    "base": ["빵"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "크림리조또",
    "type": ["양식"],
    "people": ["혼자", "연인"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "감바스",
    "type": ["양식"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "베이컨포테이토스프",
    "type": ["양식"],
    "people": ["혼자", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "고르곤졸라 피자",
    "type": ["양식"],
    "people": ["동료", "연인"],
    "base": ["빵"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "쉬림프파스타",
    "type": ["양식"],
    "people": ["혼자", "연인"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "퀘사디아",
    "type": ["양식"],
    "people": ["혼자", "동료"],
    "base": ["빵"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "돈부리",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "우동",
    "type": ["일식"],
    "people": ["가족", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "초밥",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "규동",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름�킨날"]
  },
  {
    "name": "라멘",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "오니기리",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "연어덮밥",
    "type": ["일식"],
    "people": ["혼자", "연인"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "카츠동",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "소바",
    "type": ["일식"],
    "people": ["혼자", "가족"],
    "base": ["면"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "덴푸라",
    "type": ["일식"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "야키소바",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "오야코동",
    "type": ["일식"],
    "people": ["혼자", "가족"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "사케동",
    "type": ["일식"],
    "people": ["혼자", "연인"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "미소라멘",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "타코야키",
    "type": ["일식"],
    "people": ["동료", "연인"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "샤브샤브",
    "type": ["일식"],
    "people": ["가족", "동료"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "가츠샌드",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["빵"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "츠케멘",
    "type": ["일식"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "연어초밥",
    "type": ["일식"],
    "people": ["혼자", "연인"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "오코노미야키",
    "type": ["일식"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "팟타이",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["더운날"]
  },
  {
    "name": "포",
    "type": ["동남아시아"],
    "people": ["혼자", "가족"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "나시고랭",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "똠얌꿍",
    "type": ["동남아시아"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "그린커리",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "미고랭",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "파인애플볶음밥",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "카오팟",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "락사",
    "type": ["동남아시아"],
    "people": ["혼자", "가족"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "스프링롤",
    "type": ["동남아시아"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "치킨사테",
    "type": ["동남아시아"],
    "people": ["동료", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["구름낀날"]
  },
  {
    "name": "레드커리",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "쌀국수",
    "type": ["동남아시아"],
    "people": ["혼자", "가족"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "망고스틱라이스",
    "type": ["동남아시아"],
    "people": ["혼자", "연인"],
    "base": ["밥"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "팟씨유",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "반미",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["빵"],
    "style": ["간단히"],
    "weather": ["더운날"]
  },
  {
    "name": "커리푸프",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["기타"],
    "style": ["간단히"],
    "weather": ["구름낀날"]
  },
  {
    "name": "코코넛수프",
    "type": ["동남아시아"],
    "people": ["혼자", "가족"],
    "base": ["기타"],
    "style": ["제대로"],
    "weather": ["비오는날"]
  },
  {
    "name": "치킨커리",
    "type": ["동남아시아"],
    "people": ["동료", "가족"],
    "base": ["밥"],
    "style": ["제대로"],
    "weather": ["추운날"]
  },
  {
    "name": "분짜",
    "type": ["동남아시아"],
    "people": ["혼자", "동료"],
    "base": ["면"],
    "style": ["제대로"],
    "weather": ["더운날"]
  }
];

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedType, setSelectedType] = useState(types[0])
  const [selectedPeople, setSelectedPeople] = useState(peoples[0])
  const [selectedBase, setSelectedBase] = useState(bases[0])
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [focusedFood, setFocusedFood] = useState<string | null>(null)
  // const [filteredFoods, setFilteredFoods] = useState<string[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error('Geolocation error:', error)
      )
    }
  }, [])

/*
  useEffect(() => {
    // TODO: 여기에 음식 필터링 로직 적용 (예시: 서버 요청 또는 local filtering)
    setFilteredFoods(['김밥', '비빔밥', '김치찌개'])
  }, [selectedType, selectedPeople, selectedBase, selectedStyle, focusedFood])
*/

  const resetFilters = () => {
    setSelectedType(types[0])
    setSelectedPeople(peoples[0])
    setSelectedBase(bases[0])
    setSelectedStyle(styles[0])
    setFocusedFood(null)
  }


  type Food = {
    name: string
    type: string[]
    people: string[]
    base: string[]
    style: string[]
  }

  const filteredFoods: string[] = foodsData
    .filter((food: Food) => {
      if (focusedFood) return food.name === focusedFood

      const typeMatch =
        selectedType === '선택해주세요' || food.type.includes(selectedType)

      const peopleMatch =
        selectedPeople === '선택해주세요' || food.people.includes(selectedPeople)

      const baseMatch =
        selectedBase === '선택해주세요' || food.base.includes(selectedBase)

      const styleMatch =
        selectedStyle === '선택해주세요' || food.style.includes(selectedStyle)

      return typeMatch && (peopleMatch || baseMatch || styleMatch)
    })
    .map((food: Food) => food.name)


  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
{/*
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Utensils size={28} className="text-indigo-600" /> 오늘 점심 추천
        </h2>
      </header>
*/}

      <FilterSection
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
        selectedBase={selectedBase}
        setSelectedBase={setSelectedBase}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        types={types}
        peoples={peoples}
        bases={bases}
        styles={styles}
      />

      {filteredFoods.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <span
              key={food}
              onClick={() => setFocusedFood(food)}
              className={`cursor-pointer transition hover:shadow-lg rounded-xl p-6 text-center text-lg font-medium border ${
                focusedFood === food ? 'bg-indigo-600 text-white' : 'bg-muted'
              }`}
            >
              {food}
            </span>
          ))}

          <Button variant="outline" onClick={resetFilters} className="gap-2">
            <RefreshCcw size={16} /> 초기화
          </Button>
        </section>
      )}

      {userLocation && filteredFoods.length > 0 && (
        <section>
          <FoodMap foodNames={filteredFoods} userLocation={userLocation} />
        </section>
      )}

      {filteredFoods.length === 0 && (
        <p className="mt-6 text-center text-red-600 font-semibold">
          선택한 조건에 맞는 음식이 없습니다.
        </p>
      )}
    </div>
  )
}

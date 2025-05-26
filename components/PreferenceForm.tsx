'use client'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setCategory, setSpicy } from '@/store/slices/preferenceSlice'

const PreferenceForm = () => {
  const dispatch = useDispatch()
  const { category, spicy } = useSelector((state: RootState) => state.preference)

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCategory(e.target.value))
  }

  const handleSpicyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSpicy(e.target.value))
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center p-4">
      <label className="flex flex-col text-sm font-medium">
        음식 카테고리:
        <select
          value={category}
          onChange={handleCategoryChange}
          className="mt-1 border px-3 py-2 rounded-md"
        >
          <option value="한식">한식</option>
          <option value="일식">일식</option>
          <option value="중식">중식</option>
          <option value="양식">양식</option>
          <option value="분식">분식</option>
        </select>
      </label>

      <label className="flex flex-col text-sm font-medium">
        매운 음식 선호:
        <select
          value={spicy}
          onChange={handleSpicyChange}
          className="mt-1 border px-3 py-2 rounded-md"
        >
          <option value="매움">좋아함</option>
          <option value="순함">싫어함</option>
        </select>
      </label>
    </div>
  )
}

export default PreferenceForm

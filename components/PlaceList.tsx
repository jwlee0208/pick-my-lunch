'use client'

import React, { useEffect, useRef, useState } from 'react'

type Props = {
  places: any[]
  userLocation: { lat: number; lng: number }
}

const PlaceList = ({ places, userLocation }: Props) => {
  const [displayCount, setDisplayCount] = useState(10)
  const [sortKey, setSortKey] = useState<'rating' | 'distance'>('rating')
  const listRef = useRef<HTMLUListElement | null>(null)

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const placesWithDistance = places.map((place) => {
    const distance = place.geometry?.location
      ? getDistance(
        userLocation.lat,
        userLocation.lng,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      )
      : null
    return { ...place, distance }
  })

  const sortedPlaces = placesWithDistance.sort((a, b) => {
    if (sortKey === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
    if (sortKey === 'distance') {
      if (a.distance == null) return 1
      if (b.distance == null) return -1
      return a.distance - b.distance
    }
    return 0
  })

  const onScroll = () => {
    if (!listRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setDisplayCount((prev) => Math.min(prev + 10, places.length))
    }
  }

  useEffect(() => {
    setDisplayCount(10)
  }, [sortKey, places.length])

  return (
    <div className="space-y-2">
      <div className="text-sm">
        <label>
          정렬 기준:&nbsp;
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as 'rating' | 'distance')}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="rating">평점 순</option>
            <option value="distance">거리 순</option>
          </select>
        </label>
      </div>

      <ul
        ref={listRef}
        onScroll={onScroll}
        className="max-h-[300px] overflow-y-auto border rounded-md divide-y"
      >
        {sortedPlaces.slice(0, displayCount).map((place, idx) => (
          <li
            key={place.place_id || idx}
            className="p-4 hover:bg-muted cursor-pointer"
            onClick={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${place.name}&query_place_id=${place.place_id}`
              window.open(url, '_blank', 'noopener,noreferrer')
            }}
          >
            <div className="font-bold text-base">{place.name}</div>
            <div className="text-sm text-gray-500">{place.formatted_address || place.vicinity}</div>
            <div className="text-xs text-gray-400">
              ⭐ 평점: {place.rating ?? '정보 없음'}
              {place.distance !== null && <> / 거리: {place.distance.toFixed(2)} km</>}
            </div>
          </li>
        ))}
        {displayCount >= places.length && (
          <li className="text-center text-gray-400 py-3">더 이상 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  )
}

export default PlaceList

'use client'

import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react'
import { Star, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import { Place } from '@/types/place'

type Props = {
  places: Place[]
  userLocation: { lat: number; lng: number }
}

const PlaceList = ({ places, userLocation }: Props) => {
  const t = useTranslations('placeList')
  const [visibleItemCount, setVisibleItemCount] = useState(10)
  const [sortKey, setSortKey] = useState<'rating' | 'distance'>('rating')
  const listRef = useRef<HTMLUListElement | null>(null)

  const calculateDistance = useCallback((place: Place): number | null => {
    if (!place.geometry?.location) return null

    let lat: number
    let lng: number
    const loc = place.geometry.location as any

    // 함수인지 여부를 기반으로 google/kakao 구분
    if (typeof loc.lat === 'function' && typeof loc.lng === 'function') {
      // Google Maps: lat/lng are functions
      lat = loc.lat()
      lng = loc.lng()
    } else {
      // Kakao Maps: lat/lng are numbers
      lat = loc.lat
      lng = loc.lng
    }

    const R = 6371 // 지구 반지름 (km)
    const toRad = (value: number) => (value * Math.PI) / 180
    const dLat = toRad(lat - userLocation.lat)
    const dLon = toRad(lng - userLocation.lng)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [userLocation])


  const placesWithDistance = useMemo(() => {
    return places
      .filter(
        (place) => place.business_status !== 'CLOSED_PERMANENTLY' && place.business_status !== 'CLOSED_TEMPORARILY'
      )
      .map((place) => ({
        ...place,
        distance: place.distance ?? calculateDistance(place),
      }))
  }, [places, calculateDistance])

  const sortedPlaces = useMemo(() => {
    return [...placesWithDistance].sort((a, b) => {
      if (sortKey === 'rating') {
        const aRating = a.rating ?? 0
        const bRating = b.rating ?? 0
        return bRating - aRating
      }
      if (sortKey === 'distance') {
        if (a.distance == null) return 1
        if (b.distance == null) return -1
        return a.distance - b.distance
      }
      return 0
    })
  }, [placesWithDistance, sortKey])

  const handleScroll = useCallback(() => {
    if (!listRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setVisibleItemCount((prev) => Math.min(prev + 10, sortedPlaces.length))
    }
  }, [sortedPlaces.length])

  useEffect(() => {
    setVisibleItemCount(10)
  }, [sortKey, sortedPlaces.length])

  const formatDistance = (meters: number | null) => {
    if (meters == null) return t('unknownDistance')
    if (meters < 1) return `${Math.round(meters * 1000)}m`
    return `${meters.toFixed(1)}km`
  }

  const getDetailUrl = (place: Place) => {
    if (place.source === 'kakao' && place.place_url) {
      return place.place_url
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('title')}</CardTitle>
        <Select value={sortKey} onValueChange={(value: 'rating' | 'distance') => setSortKey(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">{t('sortByRating')}</SelectItem>
            <SelectItem value="distance">{t('sortByDistance')}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {sortedPlaces.length === 0 ? (
          <p className="text-center text-gray-600">{t('noPlaces')}</p>
        ) : (
          <ul
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-[400px] overflow-y-auto divide-y rounded-md border"
          >
            {sortedPlaces.slice(0, visibleItemCount).map((place) => (
              <li
                key={place.place_id}
                className="p-4 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => {
                  const url = getDetailUrl(place)
                  window.open(url, '_blank', 'noopener,noreferrer')
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.vicinity || place.formatted_address || t('noInfo')}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1">
                          {place.rating != null ? place.rating.toFixed(1) : t('noRating')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="ml-1">{formatDistance(place.distance)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: 장소 제거 기능 구현
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
            {visibleItemCount >= sortedPlaces.length && sortedPlaces.length > 0 && (
              <li className="text-center text-gray-400 py-3">{t('noMore')}</li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default PlaceList

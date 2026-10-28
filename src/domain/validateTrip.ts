import type { Trip } from './trip'

function uniqueIds(items: readonly { id: string }[], label: string): void {
  const ids = new Set<string>()
  for (const { id } of items) {
    if (!id.trim() || ids.has(id)) throw new Error(`${label}: IDが空または重複しています: ${id}`)
    ids.add(id)
  }
}

function validateUrl(value: string): void {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error(`HTTPS URLが必要です: ${value}`)
}

// TypeScriptで構造を検証した静的データについて、型では表せない制約を検査する。
export function validateTrip(trip: Trip): void {
  if (!trip.title.trim() || !trip.dateRange.trim() || trip.days.length === 0) {
    throw new Error('旅行名・期間・1日以上の日程が必要です')
  }
  uniqueIds(trip.days, '日程')
  for (const day of trip.days) {
    const stops = [...(day.preparations ?? []), ...day.stops, ...(day.optionalStops ?? [])]
    uniqueIds(stops, day.id)
    for (const stop of stops) {
      if (!stop.title.trim() || !stop.description.trim() || !stop.time.trim()) {
        throw new Error(`${stop.id}: 時刻・タイトル・説明が必要です`)
      }
      if (stop.officialUrl) validateUrl(stop.officialUrl)
      if (stop.map) {
        validateUrl(stop.map.view)
        validateUrl(stop.map.route)
      }
    }
  }
}

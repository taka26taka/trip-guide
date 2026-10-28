import type { Trip, TripDay } from '../domain/trip'

export const selectedDayStorageKey = 'family-trip-guide-selected-day'

export function resolveDay(days: Trip['days'], savedId: string | null): TripDay {
  return days.find((day) => day.id === savedId) ?? days[0]
}

export function readSelectedDay(): string | null {
  try {
    return window.localStorage.getItem(selectedDayStorageKey)
  } catch {
    return null
  }
}

export function saveSelectedDay(dayId: string): void {
  try {
    window.localStorage.setItem(selectedDayStorageKey, dayId)
  } catch {
    // 保存が許可されていなくても、現在の画面操作は継続できる。
  }
}

import { useEffect, useState } from 'react'
import type { Trip } from '../domain/trip'
import { readSelectedDay, resolveDay, saveSelectedDay } from '../lib/selectedDay'

export function useSelectedDay(days: Trip['days']) {
  const [selectedId, setSelectedId] = useState(readSelectedDay)
  const activeDay = resolveDay(days, selectedId)

  useEffect(() => {
    saveSelectedDay(activeDay.id)
  }, [activeDay.id])

  return { activeDay, selectDay: setSelectedId }
}

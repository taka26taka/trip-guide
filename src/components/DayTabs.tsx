import { useRef } from 'react'
import type { Trip } from '../domain/trip'

type DayTabsProps = {
  days: Trip['days']
  selectedId: string
  onSelect: (dayId: string) => void
}

export function DayTabs({ days, selectedId, onSelect }: DayTabsProps) {
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  return (
    <nav className="day-tabs" aria-label="日付を選ぶ">
      <div className="content-width day-tabs-inner">
        <span className="tabs-label">日程</span>
        <div className="tabs-list" role="tablist" aria-label="旅行の日程">
          {days.map((day, index) => (
            <button
              key={day.id}
              ref={(node) => { if (node) buttons.current.set(day.id, node); else buttons.current.delete(day.id) }}
              id={`tab-${day.id}`}
              className={`day-tab${selectedId === day.id ? ' is-active' : ''}`}
              type="button"
              role="tab"
              aria-selected={selectedId === day.id}
              aria-controls={`panel-${day.id}`}
              tabIndex={selectedId === day.id ? 0 : -1}
              onClick={() => onSelect(day.id)}
              onKeyDown={(event) => {
                const nextIndex = event.key === 'Home' ? 0
                  : event.key === 'End' ? days.length - 1
                  : event.key === 'ArrowRight' ? (index + 1) % days.length
                  : event.key === 'ArrowLeft' ? (index - 1 + days.length) % days.length
                  : undefined
                if (nextIndex === undefined) return
                event.preventDefault()
                const next = days[nextIndex]
                if (next) {
                  onSelect(next.id)
                  buttons.current.get(next.id)?.focus()
                }
              }}
            >
              <span className="day-tab-date">{day.date}</span>
              <span className="day-tab-week">（{day.dayOfWeek}）</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

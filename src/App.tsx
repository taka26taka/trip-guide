/**
 * 家族旅行しおりの画面本体。
 * 日付の選択状態だけを保持し、表示内容は src/data/trip.ts のデータから描画する。
 */
import { useEffect, useMemo, useState } from 'react'
import { MapButtons } from './components/MapButtons'
import { trip, type StopKind, type TripDay, type TripStop } from './data/trip'
import './styles.css'

const selectedDayStorageKey = 'family-trip-guide-selected-day'

const kindLabels: Record<StopKind, string> = {
  preparation: '出発前の準備',
  start: '出発',
  event: '舞台',
  sightseeing: '観光',
  meal: '食事',
  transfer: '移動',
  finish: '到着・帰路',
}

function getInitialDayId() {
  if (typeof window === 'undefined') return trip.days[0].id
  return window.localStorage.getItem(selectedDayStorageKey) ?? trip.days[0].id
}

function DayTab({ day, active, onSelect }: { day: TripDay; active: boolean; onSelect: () => void }) {
  return (
    <button
      className={`day-tab${active ? ' is-active' : ''}`}
      type="button"
      role="tab"
      onClick={onSelect}
      aria-selected={active}
      aria-controls="day-schedule"
    >
      <span className="day-tab-date">{day.date}</span>
      <span className="day-tab-week">（{day.dayOfWeek}）</span>
    </button>
  )
}

function ScheduleRow({ stop }: { stop: TripStop }) {
  return (
    <article className={`stop-row stop-${stop.kind}${stop.emphasis ? ` is-${stop.emphasis}` : ''}`}>
      <div className="stop-time-column">
        <time className="stop-time">{stop.time}</time>
        {stop.flexible && <span className="time-flexible">目安</span>}
      </div>
      <div className="stop-content">
        {stop.badge && <p className="stop-badge">{stop.badge}</p>}
        <p className="stop-kind">{kindLabels[stop.kind]}</p>
        <h3>{stop.title}</h3>
        {stop.place && <p className="stop-place">{stop.place}</p>}
        <p className="stop-description">{stop.description}</p>
        {stop.transport && (
          <p className="transport-note"><strong>移動方法</strong> {stop.transport}</p>
        )}
        {stop.note && <p className="stop-note">{stop.note}</p>}
        {stop.map && <MapButtons map={stop.map} />}
        {stop.officialUrl && (
          <a className="official-link" href={stop.officialUrl} target="_blank" rel="noopener noreferrer">
            営業時間・アクセスを公式サイトで確認
          </a>
        )}
      </div>
    </article>
  )
}

function OptionalStops({ stops }: { stops: TripStop[] }) {
  return (
    <section className="optional-section" aria-labelledby="optional-title">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">寄り道の候補</p>
          <h2 id="optional-title">時間に余裕があれば</h2>
        </div>
        <span className="stop-count">{stops.length}件</span>
      </div>
      <p className="optional-intro">本来の予定を優先して、行きたいときだけ選びましょう。</p>
      <div className="schedule-list optional-list">
        {stops.map((stop) => (
          <ScheduleRow key={stop.id} stop={stop} />
        ))}
      </div>
    </section>
  )
}

function Preparations({ stops }: { stops: TripStop[] }) {
  return (
    <section className="preparation-section" aria-labelledby="preparation-title">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">最初に確認</p>
          <h2 id="preparation-title">出発前にすること</h2>
        </div>
      </div>
      <div className="schedule-list preparation-list">
        {stops.map((stop) => (
          <ScheduleRow key={stop.id} stop={stop} />
        ))}
      </div>
    </section>
  )
}

function App() {
  const [selectedDayId, setSelectedDayId] = useState(getInitialDayId)
  const activeDay = useMemo(
    () => trip.days.find((day) => day.id === selectedDayId) ?? trip.days[0],
    [selectedDayId],
  )

  useEffect(() => {
    window.localStorage.setItem(selectedDayStorageKey, activeDay.id)
  }, [activeDay.id])

  const selectDay = (dayId: string) => {
    setSelectedDayId(dayId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-inner">
          <p className="hero-kicker">家族旅行のしおり</p>
          <h1>{trip.title}<span>{trip.dateRange}</span></h1>
          <p className="hero-lede">次に行く場所と、時間と、移動方法をすぐに確認できます。</p>
        </div>
      </header>

      <nav className="day-tabs" aria-label="日付を選ぶ">
        <div className="content-width day-tabs-inner">
          <span className="tabs-label">日程</span>
          <div className="tabs-list" role="tablist">
            {trip.days.map((day) => (
              <DayTab key={day.id} day={day} active={activeDay.id === day.id} onSelect={() => selectDay(day.id)} />
            ))}
          </div>
        </div>
      </nav>

      <main className="content-width main-content">
        <section className="day-overview" aria-labelledby="day-title">
          <p className="overview-label">{trip.days.indexOf(activeDay) + 1}日目{' '}{activeDay.date}（{activeDay.dayOfWeek}）</p>
          <h2 id="day-title">{activeDay.theme}</h2>
          <p>{activeDay.intro}</p>
          <p className="route-summary"><strong>移動順</strong>{activeDay.routeLabel}</p>
        </section>

        {activeDay.preparations && activeDay.preparations.length > 0 && (
          <Preparations stops={activeDay.preparations} />
        )}

        <section id="day-schedule" className="schedule-section" aria-labelledby="schedule-title" role="tabpanel">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">時刻順の予定</p>
              <h2 id="schedule-title">この日の予定</h2>
            </div>
            <span className="stop-count">{activeDay.stops.length}件</span>
          </div>
          <div className="schedule-list">
            {activeDay.stops.map((stop) => (
              <ScheduleRow key={stop.id} stop={stop} />
            ))}
          </div>
        </section>

        {activeDay.optionalStops && activeDay.optionalStops.length > 0 && (
          <OptionalStops stops={activeDay.optionalStops} />
        )}

        <aside className="travel-tip">
          <div>
            <h2>時間は目安です</h2>
            <p>舞台や観光の状況に合わせて、無理なく楽しみましょう。迷ったら各予定の「地図を見る」から確認できます。</p>
          </div>
        </aside>

        <footer className="footer">
          <span>神奈川旅行 2026</span>
          <span>家族旅行のしおり</span>
        </footer>
      </main>
    </div>
  )
}

export default App

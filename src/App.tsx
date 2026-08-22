/**
 * 家族旅行しおりの画面本体。
 * 日付の選択状態だけを保持し、表示内容は src/data/trip.ts のデータから描画する。
 */
import { useEffect, useMemo, useState } from 'react'
import { Icon } from './components/Icon'
import { MapButtons } from './components/MapButtons'
import { trip, type StopKind, type TripDay, type TripStop } from './data/trip'
import './styles.css'

const selectedDayStorageKey = 'family-trip-guide-selected-day'

const kindLabels: Record<StopKind, string> = {
  start: '出発',
  event: '舞台',
  sightseeing: '観光',
  meal: '食事',
  transfer: '移動',
  finish: '到着・帰路',
}

const kindIcons: Record<StopKind, 'pin' | 'train' | 'utensils'> = {
  start: 'train',
  event: 'pin',
  sightseeing: 'pin',
  meal: 'utensils',
  transfer: 'train',
  finish: 'train',
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

function StopCard({ stop, index, isLast }: { stop: TripStop; index: number; isLast: boolean }) {
  return (
    <article className={`stop-row stop-${stop.kind}`}>
      <div className="timeline-column" aria-hidden="true">
        <span className="timeline-dot"><Icon name={kindIcons[stop.kind]} /></span>
        {!isLast && <span className="timeline-line" />}
      </div>
      <div className="stop-card">
        <div className="stop-card-topline">
          <time className="stop-time"><Icon name="clock" />{stop.time}{stop.flexible && <span className="time-flexible">目安</span>}</time>
          <span className="stop-kind">{kindLabels[stop.kind]}</span>
        </div>
        <div className="stop-heading">
          <div>
            <h3>{stop.title}</h3>
            {stop.place && <p className="stop-place"><Icon name="pin" />{stop.place}</p>}
          </div>
          <span className="stop-number">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="stop-description">{stop.description}</p>
        {stop.transport && (
          <div className="transport-note">
            <Icon name={stop.kind === 'meal' ? 'utensils' : 'train'} />
            <span>{stop.transport}</span>
          </div>
        )}
        {stop.note && <p className="stop-note">{stop.note}</p>}
        {stop.map && <MapButtons map={stop.map} />}
      </div>
    </article>
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
          <div className="hero-kicker"><span className="kicker-mark">旅</span> 家族の旅のしおり</div>
          <h1>{trip.title}<br /><span>{trip.dateRange}</span></h1>
          <p className="hero-lede">次に行く場所と、時間と、移動方法を<br className="mobile-break" />すぐに確認できます。</p>
          <div className="hero-meta"><Icon name="calendar" /> 2026年8月30日（日）〜31日（月）</div>
        </div>
        <div className="hero-shape hero-shape-one" />
        <div className="hero-shape hero-shape-two" />
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
          <div className="overview-label">DAY {trip.days.indexOf(activeDay) + 1}</div>
          <h2 id="day-title">{activeDay.theme}</h2>
          <p>{activeDay.intro}</p>
          <div className="route-summary"><Icon name="arrow-right" /> {activeDay.routeLabel}</div>
        </section>

        <section id="day-schedule" className="schedule-section" aria-labelledby="schedule-title" role="tabpanel">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">TODAY&apos;S PLAN</p>
              <h2 id="schedule-title">今日の予定</h2>
            </div>
            <span className="stop-count">{activeDay.stops.length} spots</span>
          </div>
          <div className="timeline">
            {activeDay.stops.map((stop, index) => (
              <StopCard key={stop.id} stop={stop} index={index} isLast={index === activeDay.stops.length - 1} />
            ))}
          </div>
        </section>

        <aside className="travel-tip">
          <div className="tip-icon"><Icon name="clock" /></div>
          <div>
            <h2>時間は目安です</h2>
            <p>舞台や観光の状況に合わせて、無理なく楽しみましょう。迷ったら各カードの「地図を見る」から確認できます。</p>
          </div>
        </aside>

        <footer className="footer">
          <span>Family Trip Guide</span>
          <span>神奈川 2026</span>
        </footer>
      </main>
    </div>
  )
}

export default App

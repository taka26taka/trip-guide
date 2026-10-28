import { trip } from './data/trip'
import type { Trip } from './domain/trip'
import { useSelectedDay } from './hooks/useSelectedDay'
import { DayTabs } from './components/DayTabs'
import { Preparations, OptionalStops, ScheduleRow } from './components/ScheduleTimeline'
import './styles.css'

function App({ itinerary = trip }: { itinerary?: Trip }) {
  const { activeDay, selectDay } = useSelectedDay(itinerary.days)
  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-inner">
          <p className="hero-kicker">家族旅行のしおり</p>
          <h1>{itinerary.title}<span>{itinerary.dateRange}</span></h1>
          <p className="hero-lede">次に行く場所と、時間と、移動方法をすぐに確認できます。</p>
        </div>
      </header>

      <DayTabs days={itinerary.days} selectedId={activeDay.id} onSelect={selectDay} />

      <main className="content-width main-content">
        {itinerary.days.map((day, dayIndex) => (
          <div
            key={day.id}
            id={`panel-${day.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${day.id}`}
            tabIndex={0}
            hidden={activeDay.id !== day.id}
          >
            <section className="day-overview" aria-labelledby={`day-title-${day.id}`}>
              <p className="overview-label">{dayIndex + 1}日目{' '}{day.date}（{day.dayOfWeek}）</p>
              <h2 id={`day-title-${day.id}`}>{day.theme}</h2>
              <p>{day.intro}</p>
              <p className="route-summary"><strong>移動順</strong>{day.routeLabel}</p>
            </section>

            {day.preparations && day.preparations.length > 0 && (
              <Preparations stops={day.preparations} />
            )}

            <section className="schedule-section" aria-labelledby={`schedule-title-${day.id}`}>
              <div className="section-heading">
                <div>
                  <p className="section-eyebrow">時刻順の予定</p>
                  <h2 id={`schedule-title-${day.id}`}>この日の予定</h2>
                </div>
                <span className="stop-count">{day.stops.length}件</span>
              </div>
              <div className="schedule-list">
                {day.stops.map((stop) => (
                  <ScheduleRow key={stop.id} stop={stop} />
                ))}
              </div>
            </section>

            {day.optionalStops && day.optionalStops.length > 0 && (
              <OptionalStops stops={day.optionalStops} />
            )}

            <aside className="travel-tip">
              <div>
                <h2>時間は目安です</h2>
                <p>舞台や観光の状況に合わせて、無理なく楽しみましょう。迷ったら各予定の「地図を見る」から確認できます。</p>
              </div>
            </aside>
          </div>
        ))}

        <footer className="footer">
          <span>{itinerary.title} {itinerary.dateRange}</span>
          <span>家族旅行のしおり</span>
        </footer>
      </main>
    </div>
  )
}

export default App

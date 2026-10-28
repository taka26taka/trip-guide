import { useId } from 'react'
import type { StopKind, TripStop } from '../domain/trip'
import { MapButtons } from './MapButtons'

const kindLabels: Record<StopKind, string> = {
  preparation: '出発前の準備',
  start: '出発',
  event: '舞台',
  sightseeing: '観光',
  meal: '食事',
  transfer: '移動',
  finish: '到着・帰路',
}

export function ScheduleRow({ stop }: { stop: TripStop }) {
  return (
    <article className={`stop-row stop-${stop.kind}${stop.emphasis ? ` is-${stop.emphasis}` : ''}`}>
      <div className="stop-time-column">
        <span className="stop-time">{stop.time}</span>
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

export function OptionalStops({ stops }: { stops: readonly TripStop[] }) {
  const titleId = useId()
  return (
    <section className="optional-section" aria-labelledby={titleId}>
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">寄り道の候補</p>
          <h2 id={titleId}>時間に余裕があれば</h2>
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

export function Preparations({ stops }: { stops: readonly TripStop[] }) {
  const titleId = useId()
  return (
    <section className="preparation-section" aria-labelledby={titleId}>
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">最初に確認</p>
          <h2 id={titleId}>出発前にすること</h2>
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

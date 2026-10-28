import type { Trip, TripStop } from '../domain/trip'

export const minimalStop = { id: 'park', time: '午後', title: '公園散策', description: '公園で休憩します。', kind: 'sightseeing' } satisfies TripStop

export const singleDayTrip = {
  title: '日帰り旅行',
  dateRange: '2027/1/1',
  days: [{
    id: '2027-01-01',
    date: '1月1日',
    dayOfWeek: '金',
    theme: '街歩き',
    intro: 'ゆっくり歩きます。',
    routeLabel: '駅 → 公園',
    stops: [minimalStop],
  }],
} satisfies Trip

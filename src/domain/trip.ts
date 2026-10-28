export type StopKind = 'preparation' | 'start' | 'event' | 'sightseeing' | 'meal' | 'transfer' | 'finish'

export type StopEmphasis = 'important' | 'critical'

export type MapLinks = {
  view: string
  route: string
}

export type TripStop = {
  id: string
  time: string
  title: string
  place?: string
  description: string
  transport?: string
  kind: StopKind
  flexible?: boolean
  emphasis?: StopEmphasis
  badge?: string
  map?: MapLinks
  note?: string
  officialUrl?: string
}

export type TripDay = {
  id: string
  date: string
  dayOfWeek: string
  theme: string
  intro: string
  routeLabel: string
  preparations?: readonly TripStop[]
  stops: readonly TripStop[]
  optionalStops?: readonly TripStop[]
}

export type Trip = {
  title: string
  dateRange: string
  days: readonly [TripDay, ...TripDay[]]
}

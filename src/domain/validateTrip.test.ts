import { describe, expect, it } from 'vitest'
import { trip } from '../data/trip'
import type { Trip } from './trip'
import { minimalStop, singleDayTrip } from '../test/fixtures'
import { validateTrip } from './validateTrip'

const day = singleDayTrip.days[0]
const stop = minimalStop

describe('静的旅程の意味的検証', () => {
  it('既存旅行と任意項目のない日帰り旅行を許可する', () => {
    expect(() => validateTrip(trip)).not.toThrow()
    expect(() => validateTrip(singleDayTrip)).not.toThrow()
  })
  it.each(['title', 'dateRange'] as const)('%s の空白を拒否する', (field) => {
    expect(() => validateTrip({ ...singleDayTrip, [field]: ' ' })).toThrow()
  })
  it('日程のID重複を拒否する', () => {
    expect(() => validateTrip({ ...singleDayTrip, days: [day, day] })).toThrow('重複')
  })
  it.each(['', 'park'])('候補と本線を通じて空または重複したID %s を拒否する', (id) => {
    expect(() => validateTrip({ ...singleDayTrip, days: [{ ...day, optionalStops: [{ ...stop, id }] }] })).toThrow()
  })
  it.each(['time', 'title', 'description'] as const)('予定の %s が空なら拒否する', (field) => {
    expect(() => validateTrip({ ...singleDayTrip, days: [{ ...day, stops: [{ ...stop, [field]: '' }] }] })).toThrow()
  })
  it.each(['javascript:alert(1)', 'http://example.com', 'broken'])('不正な外部URL %s を拒否する', (officialUrl) => {
    expect(() => validateTrip({ ...singleDayTrip, days: [{ ...day, stops: [{ ...stop, officialUrl }] }] })).toThrow()
  })
  it('地図URLにもHTTPSを要求する', () => {
    const invalid: Trip = { ...singleDayTrip, days: [{ ...day, stops: [{ ...stop, map: { view: 'https://example.com', route: 'javascript:alert(1)' } }] }] }
    expect(() => validateTrip(invalid)).toThrow()
  })
})

import { describe, expect, it, vi } from 'vitest'
import { singleDayTrip } from '../test/fixtures'
import { trip } from '../data/trip'
import { readSelectedDay, resolveDay, saveSelectedDay, selectedDayStorageKey } from './selectedDay'

describe('日付選択と保存', () => {
  it('有効な日付を復元する', () => {
    expect(resolveDay(trip.days, '2026-08-31').id).toBe('2026-08-31')
  })
  it.each([null, '', 'invalid', '2026-08-31'])('日帰り旅行で無効値 %s は初日に戻す', (id) => {
    expect(resolveDay(singleDayTrip.days, id).id).toBe('2027-01-01')
  })
  it('保存値を読み書きする', () => {
    expect(readSelectedDay()).toBeNull()
    saveSelectedDay('2026-08-31')
    expect(window.localStorage.getItem(selectedDayStorageKey)).toBe('2026-08-31')
    expect(readSelectedDay()).toBe('2026-08-31')
  })
  it('ストレージ取得拒否でも読み書きが失敗しない', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new Error('SecurityError') })
    expect(readSelectedDay()).toBeNull()
    expect(() => saveSelectedDay('day')).not.toThrow()
  })
  it('容量不足でも保存失敗を外へ投げない', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('QuotaExceededError') })
    expect(() => saveSelectedDay('day')).not.toThrow()
  })
})

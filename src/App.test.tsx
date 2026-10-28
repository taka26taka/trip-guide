import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { singleDayTrip } from './test/fixtures'
import { selectedDayStorageKey } from './lib/selectedDay'

const tab = (date: string) => screen.getByRole('tab', { name: new RegExp(date) })

describe('旅行ガイド', () => {
  it('初日に準備・予定・候補・地図を表示する', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('神奈川旅行2026/8/30〜8/31')
    const panel = within(screen.getByRole('tabpanel'))
    expect(panel.getByRole('heading', { name: '市民ミュージカル開演' })).toBeVisible()
    expect(panel.getByRole('heading', { name: '出発前にすること' })).toBeVisible()
    expect(panel.getByRole('heading', { name: '時間に余裕があれば' })).toBeVisible()
    const link = panel.getAllByRole('link', { name: '地図を見る' })[0]
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link?.getAttribute('href')).toContain('https://www.google.com/maps/search/')
  })
  it('クリックで日付を変え、再訪時に復元する', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.click(tab('8月31日'))
    expect(screen.getByRole('heading', { name: '鎌倉観光 ＋ 東京駅へ' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: '市民ミュージカル開演' })).not.toBeInTheDocument()
    expect(window.localStorage.getItem(selectedDayStorageKey)).toBe('2026-08-31')
    unmount()
    render(<App />)
    expect(tab('8月31日')).toHaveAttribute('aria-selected', 'true')
  })
  it('壊れた保存値は初日に補正する', () => {
    window.localStorage.setItem(selectedDayStorageKey, 'unknown')
    render(<App />)
    expect(tab('8月30日')).toHaveAttribute('aria-selected', 'true')
    expect(window.localStorage.getItem(selectedDayStorageKey)).toBe('2026-08-30')
  })
  it('左右・Home・Endで循環し、フォーカスとパネルを同期する', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.tab()
    expect(tab('8月30日')).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(tab('8月31日')).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', tab('8月31日').id)
    await user.keyboard('{ArrowRight}')
    expect(tab('8月30日')).toHaveFocus()
    await user.keyboard('{End}')
    expect(tab('8月31日')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(tab('8月30日')).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(screen.getByRole('tabpanel')).toHaveFocus()
  })
  it('全タブのaria-controlsが存在するpanelを指し、IDが重複しない', () => {
    render(<App />)
    for (const element of screen.getAllByRole('tab')) {
      const id = element.getAttribute('aria-controls')
      expect(id).not.toBeNull()
      expect(document.getElementById(id ?? '')).toHaveAttribute('aria-labelledby', element.id)
    }
    const ids = Array.from(document.querySelectorAll('[id]'), (element) => element.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('1日の旅行と任意項目のない予定でも表示・操作できる', async () => {
    const user = userEvent.setup()
    render(<App itinerary={singleDayTrip} />)
    expect(screen.getByRole('heading', { name: '公園散策' })).toBeVisible()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '時間に余裕があれば' })).not.toBeInTheDocument()
    await user.tab()
    await user.keyboard('{ArrowRight}{ArrowLeft}{Home}{End}')
    expect(tab('1月1日')).toHaveFocus()
    fireEvent.keyDown(tab('1月1日'), { key: 'Escape' })
    expect(tab('1月1日')).toHaveAttribute('aria-selected', 'true')
  })
  it('表示中の旅程を差し替えたら新しい初日に戻す', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<App />)
    await user.click(tab('8月31日'))
    rerender(<App itinerary={singleDayTrip} />)
    expect(tab('1月1日')).toHaveAttribute('aria-selected', 'true')
    expect(window.localStorage.getItem(selectedDayStorageKey)).toBe('2027-01-01')
  })
  it('保存が拒否されても日付を切り替えられる', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied') })
    const user = userEvent.setup()
    render(<App />)
    await user.click(tab('8月31日'))
    expect(screen.getByRole('heading', { name: '鎌倉観光 ＋ 東京駅へ' })).toBeVisible()
  })
})

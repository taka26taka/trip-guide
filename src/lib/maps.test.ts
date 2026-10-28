import { describe, expect, it } from 'vitest'
import { mapLinks, mapsDirectionsUrl, mapsSearchUrl } from './maps'

describe('Google Maps URL', () => {
  it('日本語・空白・記号を検索語として保持する', () => {
    const url = new URL(mapsSearchUrl('横浜 & MARINE/WALK?'))
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/search/')
    expect(url.searchParams.get('api')).toBe('1')
    expect(url.searchParams.get('query')).toBe('横浜 & MARINE/WALK?')
  })
  it('目的地と出発地を公共交通の正しい向きに設定する', () => {
    const url = new URL(mapsDirectionsUrl('長谷寺', '鎌倉駅'))
    expect(url.searchParams.get('destination')).toBe('長谷寺')
    expect(url.searchParams.get('origin')).toBe('鎌倉駅')
    expect(url.searchParams.get('travelmode')).toBe('transit')
  })
  it('出発地未指定では現在地からの案内に任せる', () => {
    const links = mapLinks('東京駅')
    expect(new URL(links.route).searchParams.has('origin')).toBe(false)
    expect(new URL(links.view).searchParams.get('query')).toBe('東京駅')
  })
})

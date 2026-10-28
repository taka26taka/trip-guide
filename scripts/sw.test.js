/* global Response, URL */
// @vitest-environment node
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8')
const scope = 'https://example.com/trip-guide/'

function worker({ cached, offline = false } = {}) {
  const handlers = new Map()
  const cache = { addAll: vi.fn().mockResolvedValue(), match: vi.fn().mockResolvedValue(cached) }
  const caches = {
    open: vi.fn().mockResolvedValue(cache),
    keys: vi.fn().mockResolvedValue([
      `trip-guide:${scope}:old`, `trip-guide:${scope}:__BUILD_VERSION__`,
      'another-app', 'family-trip-guide-v2', 'trip-guide:https://example.com/other/:old',
    ]),
    delete: vi.fn().mockResolvedValue(true),
  }
  const fetch = offline ? vi.fn().mockRejectedValue(new Error('offline')) : vi.fn().mockResolvedValue(new Response('network'))
  const claim = vi.fn().mockResolvedValue()
  runInNewContext(source, {
    self: { registration: { scope }, clients: { claim }, addEventListener: (name, handler) => handlers.set(name, handler) },
    caches, fetch, URL, Response,
  })
  return { handlers, cache, caches, fetch, claim }
}

describe('Service Workerのキャッシュ境界', () => {
  it('install完了までシェルの保存を待つ', async () => {
    const { handlers, cache } = worker()
    const waitUntil = vi.fn()
    handlers.get('install')({ waitUntil })
    await waitUntil.mock.calls[0][0]
    expect(cache.addAll).toHaveBeenCalledWith([])
  })
  it('自分のスコープの古いキャッシュだけを消す', async () => {
    const { handlers, caches, claim } = worker()
    const waitUntil = vi.fn()
    handlers.get('activate')({ waitUntil })
    await waitUntil.mock.calls[0][0]
    expect(caches.delete.mock.calls).toEqual([[`trip-guide:${scope}:old`]])
    expect(claim).toHaveBeenCalledOnce()
  })
  it('オフラインでも同一ビルドのHTMLを返す', async () => {
    const cached = new Response('saved page')
    const { handlers, cache, fetch } = worker({ cached, offline: true })
    const respondWith = vi.fn()
    handlers.get('fetch')({ request: { url: scope, method: 'GET', mode: 'navigate' }, respondWith })
    expect(await respondWith.mock.calls[0][0]).toBe(cached)
    expect(cache.match).toHaveBeenCalledWith(`${scope}index.html`)
    expect(fetch).not.toHaveBeenCalled()
  })
  it('未保存リソースはネットワークから取得する', async () => {
    const { handlers } = worker()
    const respondWith = vi.fn()
    handlers.get('fetch')({ request: { url: `${scope}image.svg`, method: 'GET' }, respondWith })
    expect(await (await respondWith.mock.calls[0][0]).text()).toBe('network')
  })
  it('未保存かつオフラインなら明確な503応答を返す', async () => {
    const { handlers } = worker({ offline: true })
    const respondWith = vi.fn()
    handlers.get('fetch')({ request: { url: `${scope}missing`, method: 'GET' }, respondWith })
    const response = await respondWith.mock.calls[0][0]
    expect(response.status).toBe(503)
    expect(await response.text()).toContain('オフライン')
  })
  it.each([
    { url: 'https://google.com/maps/', method: 'GET' },
    { url: 'https://example.com/other/', method: 'GET' },
    { url: scope, method: 'POST' },
  ])('外部・他アプリ・POST要求には介入しない: %o', (request) => {
    const { handlers } = worker()
    const respondWith = vi.fn()
    handlers.get('fetch')({ request, respondWith })
    expect(respondWith).not.toHaveBeenCalled()
  })
})

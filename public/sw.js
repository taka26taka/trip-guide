/* global caches, fetch, self, URL, Response */

const CACHE_PREFIX = `trip-guide:${self.registration.scope}:`
const CACHE_NAME = `${CACHE_PREFIX}__BUILD_VERSION__`
const APP_SHELL = /* __PRECACHE__ */ []
const indexUrl = new URL('./index.html', self.registration.scope).href

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  // 自動のskipWaitingは行わない。旧ページと新JS/CSSの混在を防ぐ。
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)
    // HTMLとハッシュ付きアセットを同じビルドから返す。
    const cached = await cache.match(event.request.mode === 'navigate' ? indexUrl : event.request)
    if (cached) return cached
    try {
      return await fetch(event.request)
    } catch {
      return new Response('オフラインです。オンラインで一度ページを開いてください。', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
  })())
})

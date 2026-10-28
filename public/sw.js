/* global caches, fetch, self */

// アプリシェルをキャッシュし、旅行当日の一時的な通信不良でも画面を開けるようにする。
const CACHE_NAME = 'family-trip-guide-v2'
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
    )),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  // ページ本体はオンライン時に必ず最新版を取得する。公開後の旅程修正が
  // 古いキャッシュに隠れないようにし、通信失敗時だけ保存済み画面を返す。
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy))
        return response
      }).catch(() => caches.match('./index.html')),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
      return response
    }).catch(() => caches.match(event.request))),
  )
})

/**
 * Reactのエントリポイント。
 * アプリをマウントし、対応ブラウザでは同一オリジンのservice workerを登録する。
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('root要素が見つかりません')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // The app remains fully usable if a browser does not allow service workers.
    })
  })
}

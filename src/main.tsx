/**
 * Reactのエントリポイント。
 * アプリをマウントし、対応ブラウザでは同一オリジンのservice workerを登録する。
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // The app remains fully usable if a browser does not allow service workers.
    })
  })
}

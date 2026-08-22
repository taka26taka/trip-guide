/**
 * Vite設定。相対アセットパスにしてGitHub Pagesのプロジェクトページに対応する。
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset paths let the same build work at a GitHub Pages project URL.
export default defineConfig({
  base: './',
  plugins: [react()],
})

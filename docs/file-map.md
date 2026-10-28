# ファイルマップ

このプロジェクトの責務を一覧にしたものです。モジュール間の依存と判断理由はarchitecture.mdを参照してください。

## アプリ本体

| ファイル | 役割 |
|---|---|
| `src/main.tsx` | ReactをDOMへマウントし、service workerを登録する入口 |
| `src/App.tsx` | 旅行の注入、選択状態と表示コンポーネントの組み立て |
| `src/data/trip.ts` | 既存の静的旅程と意味的検証呼び出し |
| `src/components/Icon.tsx` | 外部ライブラリに依存しないインラインSVGアイコン |
| `src/components/MapButtons.tsx` | 場所検索・経路検索ボタンの共通表示 |
| `src/styles.css` | 色、タイポグラフィ、紙の予定表、レスポンシブUI |
| `src/vite-env.d.ts` | Viteの型定義を読み込むTypeScript宣言 |

## 実行・ビルド設定

| ファイル | 役割 |
|---|---|
| `index.html` | 静的HTMLシェル、manifest参照、メタ情報 |
| `vite.config.ts` | Vite設定、GitHub Pages向け相対パス |
| `tsconfig.json` | TypeScriptのプロジェクト参照 |
| `tsconfig.app.json` | アプリ側TypeScript設定 |
| `tsconfig.node.json` | Vite設定側TypeScript設定 |
| `eslint.config.js` | ESLint 10のflat config |
| `package.json` | npm scripts、Node.js制約、依存バージョン |
| `package-lock.json` | npm依存関係の再現用lockfile。手編集しない |
| `.nvmrc` | Node.js 24を選択するためのバージョン指定 |
| `.gitignore` | `node_modules`・`dist`など生成物の除外 |

## 静的公開・PWA

| ファイル | 役割 |
|---|---|
| `public/manifest.webmanifest` | PWAのアプリ名、色、起動先、アイコン定義 |
| `public/icon.svg` | ホーム画面用アイコン |
| `public/sw.js` | 静的アプリシェルをキャッシュするservice worker |
| `.github/workflows/deploy.yml` | Node.js 24でci・audit・lint・build後にGitHub Pagesへ公開 |

JSON、SVG、`.nvmrc`、lockfileなど、コメントを持てない形式の責務はこのファイルで補足しています。

## 改善後のモジュール

型・検証・保存・タブ・テスト・ビルド時SW生成の責務と依存関係は[architecture.md](architecture.md)に記載しています。テストは対象と同じ場所の`*.test.ts(x)`、SWは`scripts/sw.test.js`です。

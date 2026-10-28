# 神奈川旅行 2026 — 家族旅行のしおり

2026年8月30日〜31日に使う、スマートフォン向けの家族旅行ガイドです。ログイン・データベース・サーバー・有料APIは使わず、静的ファイルだけで動作します。

旅程は [`src/data/trip.ts`](./src/data/trip.ts) にまとめてあり、画面コンポーネントと分離しています。別の旅行を作るときは、基本的にこのデータを差し替えれば再利用できます。本線の予定に加えて、時間に余裕があるときの立ち寄り候補も定義できます。

## ドキュメント

- [構成と設計](./docs/architecture.md)
- [ファイルマップ](./docs/file-map.md)
- [旅程データの編集ガイド](./docs/content-editing.md)
- [公開前・旅行前チェックリスト](./docs/release-checklist.md)

このMVPは、旅程をすぐ確認するための静的Webアプリです。ログイン、予約、天気・乗換案内の自動取得、店舗の予約機能は対象外です。

## 技術構成

- React + Vite + TypeScript
- スマホファーストのレスポンシブUI
- Google Maps APIなし（通常のGoogle Maps URLを新しいタブで開く）
- PWA用の `manifest.webmanifest` と簡易service workerを同梱
- GitHub Pagesで公開できる相対アセットパス設定

## ローカル起動

Node.js 24 LTSを使用します。`.nvmrc` と `package.json` の `engines` でNode.js 24系に固定しています。

```bash
nvm use
npm ci
npm run dev
```

`nvm`を使わない場合も、`node --version` が24系であることを確認してから実行してください。

表示されたURL（通常は `http://localhost:5173`）をスマートフォンまたはブラウザで開いてください。

## lint / build

```bash
npm audit --audit-level=moderate
npm run lint
npm run build
```

ビルド成果物は `dist/` に出力されます。公開前に `npm run preview` で本番ビルドを確認できます。

## GitHub Pagesへの公開

このプロジェクトをGitHubリポジトリにpushしたあと、GitHubリポジトリの **Settings → Pages** でSourceを **GitHub Actions** に設定します。デプロイ用Workflowは既に [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) に含まれています。

初回公開時の確認項目は [公開前・旅行前チェックリスト](./docs/release-checklist.md) を参照してください。

`vite.config.ts` は `base: './'` のため、`https://ユーザー名.github.io/リポジトリ名/` のようなプロジェクトページでも動作します。

## 依存関係とセキュリティ

Node.js 24環境で依存関係を固定し、次のコマンドで監査できます。

```bash
npm audit --audit-level=moderate
```

GitHub Actionsでもデプロイ前に同じ監査を実行し、moderate以上の既知の脆弱性がある場合はデプロイを停止します。

## 旅程データの変更

`src/data/trip.ts` の `trip.days` を編集します。各予定には以下を設定できます。

- `time`: 表示する時刻（「終演後」「観光終了後」なども可）
- `title` / `place` / `description`: 予定の内容
- `transport`: 移動方法
- `map.view` / `map.route`: Google Mapsの場所・経路リンク
- `flexible`: 時刻が目安である予定かどうか
- `emphasis` / `badge`: 絶対に外せない予定や重要な注意の強調
- `note`: 補足事項
- `officialUrl`: 営業時間・アクセスを再確認する公式サイト
- `preparations`: ホテルや荷物など、観光開始前にすること
- `optionalStops`: 本線とは別に表示する立ち寄り候補

Google Mapsリンクは `mapsSearchUrl` と `mapsDirectionsUrl` が生成します。APIキーは不要です。

## ディレクトリ構成

```text
src/
  data/trip.ts             # 旅行タイトル・日付・予定・候補・Maps URL
  components/Icon.tsx      # インラインSVGアイコン
  components/MapButtons.tsx # Google Mapsリンク
  App.tsx                  # 日付タブと時系列画面
  styles.css               # スマホ優先のUI
public/
  manifest.webmanifest     # PWAメタデータ
  sw.js                    # アプリシェルのキャッシュ
docs/
  architecture.md         # 設計とデータフロー
  content-editing.md      # 旅程差し替え手順
  release-checklist.md    # 公開・実機確認
```

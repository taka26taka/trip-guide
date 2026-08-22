# 構成と設計

## 目的

家族旅行中に、スマートフォンで「次に行く場所」「時間」「移動方法」を迷わず確認できるようにする静的Webアプリです。

実際の旅行で使う情報を優先し、ログイン・サーバー・データベース・有料APIは使用しません。

## データと画面の分離

旅程の内容は [`src/data/trip.ts`](../src/data/trip.ts) に集約します。`App.tsx` は日付を選択し、`TripDay` と `TripStop` を表示するだけです。

```text
src/data/trip.ts
  └─ trip.days[]
       └─ TripDay.stops[]
            └─ TripStop
                 ├─ time / title / description
                 ├─ transport / note
                 └─ map.view / map.route

App.tsx
  ├─ 日付タブ
  ├─ 日ごとの概要
  └─ 時系列のStopCard
       └─ MapButtons
```

東京・大阪など別の旅行へ差し替える場合は、原則として`trip.ts`のデータを変更します。表示ロジックやスタイルは共通利用できます。

## Google Maps

Google Maps APIは使用していません。`mapsSearchUrl` と `mapsDirectionsUrl` が通常のURLを生成し、ブラウザの新しいタブでGoogle Mapsを開きます。

- `view`: 場所を検索するURL
- `route`: その場所までの経路を検索するURL
- APIキー、課金、サーバー側リクエストは不要

リンクはGoogle Mapsの最新の案内結果を表示するため、アプリ側では駅の出口や所要時間を固定していません。

## 状態管理

アプリが保持する状態は選択中の日付だけです。`family-trip-guide-selected-day`というキーでlocalStorageに保存し、再訪時に最後に見ていた日を復元します。

保存値が存在しない、または旅程にない場合は、8月30日を初期表示します。

## PWA

- `public/manifest.webmanifest`: ホーム画面追加時の名称・色・起動先
- `public/icon.svg`: PWAアイコン
- `public/sw.js`: ビルド後のアプリシェルをキャッシュ

service workerは同一オリジンの静的ファイルを対象にします。Google Mapsなど外部サイトの情報をキャッシュする設計ではありません。

## GitHub Pages

`vite.config.ts`の`base: './'`により、リポジトリ直下ではなく`/リポジトリ名/`配下に公開されるGitHub Pagesのプロジェクトページでも、JS・CSS・manifestを相対パスで読み込めます。

WorkflowはNode.js 24で、次の順に実行します。

```text
npm ci
npm audit --audit-level=moderate
npm run lint
npm run build
```

すべて成功した場合だけ`dist/`をGitHub Pagesへデプロイします。

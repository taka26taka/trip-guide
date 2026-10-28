# trip-guide — 家族旅行のしおり

旅先で「次の目的地・時刻・移動方法」をすぐ確認する、スマートフォン向けの静的Webアプリです。現在は神奈川旅行の旅程を掲載しています。React / TypeScriptの責務分離、型による制約、異常系を含むテスト、PRから公開までの品質管理を示すポートフォリオとしても開発しています。

ログイン・バックエンド・DB・有料APIは不要で、GitHub Pagesで無料運用できます。予約やリアルタイムの乗換案内は提供しません。

## 主な機能

- 日別の予定、出発前の準備、寄り道候補、注意事項の表示
- Google Mapsの検索・公共交通の経路リンク（APIキー不要）
- 選択日の復元。無効な保存値・ストレージ拒否時のフォールバック
- 左右/Home/Endキーによる日付タブ操作、ARIA対応
- インストール完了後のオフライン表示とビルド単位のキャッシュ更新
- 1日旅行や日数・予定数が異なる旅程への差し替え

## 技術と構成

React 19、TypeScript 6（strict）、Vite 8、Node.js 24。検証にはESLint、Vitest、React Testing Library、jsdom、V8 coverageを使用します。

```text
src/
  domain/             # 旅行の型と意味的検証
  data/trip.ts        # 静的旅程の唯一の取得先
  lib/                # Maps URL・日付解決・ストレージ境界
  hooks/              # 選択状態と保存の同期
  components/         # DayTabs、ScheduleTimeline、MapButtons、Icon
  test/               # 共通セットアップと日帰り旅程fixture
  App.tsx             # 表示の組み立て（旅程をpropsで注入可能）
  main.tsx            # React起動・本番SW登録
public/               # SWテンプレート、PWA manifest、icon
scripts/build-sw.mjs  # 本番成果物から事前キャッシュ一覧を生成
docs/                 # 設計、レビュー、編集・公開手順
.github/workflows/    # PR品質チェックとPages公開
```

状態は選択日だけなのでuseStateを使い、外部状態管理は導入しません。URL生成と日付解決は純粋関数、localStorageは例外を吸収する境界として分離しています。非空の日程を型で保証し、静的データは`satisfies`と実行時検証で確認します。既存UIを維持し、独立した操作責務があるタブと予定表示をコンポーネントに分けました。

[アーキテクチャとデータフロー](docs/architecture.md) / [コードレビューと実施結果](docs/code-review.md) / [変更ファイル一覧と完了報告](docs/implementation-report.md)

## ローカル環境

`.nvmrc`と`engines`に従いNode.js 24を使用します。

```bash
nvm use
npm ci
npm run dev
```

## 検証

```bash
npm run typecheck
npm run lint
npm test
npm run test:coverage
npm audit --audit-level=moderate
npm run build
npm run preview
```

`npm run test:watch`で継続実行、coverageのHTMLは`coverage/index.html`に出力します。URLエンコード・日付選択・保存失敗・静的旅程検証・タブ操作・旅程差し替え・SWのキャッシュ境界を検証します。カバレッジ閾値は`vitest.config.ts`で定義しています。

## データの差し替え

通常は`src/data/trip.ts`を変更します。旅行名・期間・日程を設定し、1日以上の日程と日内で重複しない予定IDを用意します。旅程の内容を自動変換・削除する処理はありません。

`Trip`の構造をTypeScriptが、IDやHTTPSリンク等の制約を`validateTrip`が検証します。任意項目のない予定も利用可能です。PWAのホーム画面名・HTMLタイトルなど公開メタ情報は`public/manifest.webmanifest`と`index.html`も合わせて編集してください。

[旅程の編集ガイド](docs/content-editing.md) / [ファイルマップ](docs/file-map.md)

## CI/CDと公開

Pull Requestで`npm ci`・脆弱性監査・型チェック・lint・カバレッジ付きテスト・本番ビルドを実行します。moderate以上の既知の脆弱性や検証失敗があれば公開へ進みません。mainへマージしたときだけ、同じ品質ジョブで生成したdistをGitHub Pagesへ公開します。

GitHubのSettings → Pages → SourceをGitHub Actionsに設定します。`base: './'`により`/trip-guide/`配下でも動作します。開発サーバーではSWを登録せず、PWA確認には本番ビルドとpreviewを使用します。

新SWは全アセットの保存完了後に待機し、既存タブを閉じた後の再訪で切り替わります。オフライン利用には初回オンライン訪問とインストール完了が必要です。Google Mapsや公式サイトはオンラインで利用してください。

[公開前・実機確認チェックリスト](docs/release-checklist.md)

## 今後の改善候補

- ブラウザE2EでGitHub Pages配下の更新・オフライン遷移を自動検証
- スクリーンリーダーと実機による継続的なアクセシビリティ検証
- 新バージョンの更新通知（利用者がタイミングを選べるUI）
- 外部JSON入力を実装する場合のunknownからの構造検証

Findy等の評価値を目的としたコード量やコミット数の水増しは行わず、利用上の問題と保守上の理由に基づいて改善します。

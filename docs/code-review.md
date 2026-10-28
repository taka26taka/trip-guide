# コードレビュー

調査日: 2026-10-28。対象: 初期コミット `2b3cedf` と開始時点の未コミット変更。旅程・デザインの既存変更は保持する。

## 全体構成と方針

React 19 / TypeScript strict / Vite、Node.js 24。`main.tsx` が起動とSW登録、`App.tsx` が選択状態・タブ・全予定表示、`data/trip.ts` が型・静的旅程・Maps URL生成を担当する。`MapButtons` → `Icon` の依存。CSSは共通変数を利用し、外部API・HTML挿入・秘密情報はない。バックエンドや状態管理ライブラリの追加は不要。

|重要度|該当ファイル|問題点|改善理由・方針|実施結果|
|---|---|---|---|---|
|高|src/App.tsx|localStorageのget/setが例外を送出し得る|例外を境界で吸収し、有効な日だけ復元する|対応済み: lib/selectedDayとhookへ分離。読取拒否・容量不足・不正値をテスト|
|高|src/App.tsx|タブに左右/Home/End操作、roving tabindex、ラベル対応がない|WAI-ARIA Tabsパターンで操作とフォーカスを統一する|対応済み: 左右/Home/End、自動選択、tabpanel対応、キーボード・実ブラウザ検証|
|高|public/sw.js|同一オリジンの全キャッシュを削除し、外部要求まで保存する|スコープ別の所有キャッシュだけを管理する|対応済み: scope付き接頭辞とGET/配信パス境界。単体・ブラウザで他キャッシュ保持を確認|
|高|public/sw.js|ビルドJS/CSSがinstall対象外、失敗時にundefinedを返す|ビルド成果物を事前保存し、更新とオフラインの整合性を保証する|対応済み: build-swで全成果物を事前保存。更新待機・オフライン再読込みを確認|
|中|src/data/trip.ts|型・URL生成・旅程が同居し、空の日程を表現できる|ドメイン型と純粋関数を分離し、非空の日程を保証する|対応済み: domainとlibへ分離、readonly非空日程、satisfies、strict設定強化|
|中|src/data/trip.ts|ID重複や不正URLは型だけでは検出できない|静的データ境界の実行時検証を追加する。外部入力機構は新設しない|対応済み: 型付き静的旅程の意味的検証と異常系テスト。未知JSONパーサーは対象外|
|中|src/App.tsx|予定表示と状態管理が同じファイル、footerに旅行固有文字列|タブと予定表示を分離し、旅行情報をpropsから受け取る|対応済み: DayTabsとScheduleTimelineを抽出。Appへの旅行注入と動的footer|
|中|.github/workflows/deploy.yml|push/mainのみ、テスト・独立型チェックなし|PR品質ジョブと成功後のmainデプロイに分ける|対応済み: PR/main共通qualityジョブ成功後だけmainを公開|
|中|package.json|テスト基盤がない|Vitest/RTLでURL・保存・検証・利用者操作を検証する|対応済み: Vitest/RTL、40テスト、V8 coverageと閾値を導入|
|低|src/styles.css|日数増加でタブが横にはみ出す、フォーカス色が薄い|横スクロールと明確なアウトライン。既存配色・レイアウト維持|対応済み: 横スクロール、濃色の枠。主要文字色は4.5:1以上|
|低|src/main.tsx|DOM取得に非nullアサーション、開発時もSW登録|起動境界を検査し、本番でだけ登録する|対応済み: 明示的root検査、本番だけSW登録|
|中|README.md, docs/*|旧責務の説明と検証手順が不足|実装と一致する設計判断・再利用・検証手順を記載する|対応済み: README・architecture・編集/公開資料を更新|

## 省略する改善

日付の表示文言は既存データとして維持する。時刻には「終演後」などの意味があるため数値時刻に変換しない。全種別に同じ任意項目が自然に存在するため、不要な判別Unionは導入しない。小さな静的概要・注意文だけのファイル分割、汎用リポジトリ層、外部検証ライブラリは追加しない。

## 調査・検証の根拠

- [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Vitest coverage](https://vitest.dev/guide/coverage)
- パッケージ監査と各検証結果は実装完了後に追記する。

## 実施結果と検証記録

環境: Node.js 24.22.1 / npm 11.19.1。既存のNode.js 24指定を変更せず、一時ディレクトリに公式配布を取得しSHA256を確認して使用した。

- `npm ci --no-audit --fund=false`: lockfileから再現成功。
- `npm audit --audit-level=moderate`: 脆弱性0件。
- `npm run typecheck`: 成功（テストとVite/Vitest設定も対象）。
- `npm run lint`: エラー・警告0件。
- `npm run test:coverage`: 5ファイル・40テスト成功。アプリコードの行/文/関数100%、分岐98.61%。SWの8テストは別途同じVitest実行に含む。mainのDOM起動とビルドスクリプトは単体カバレッジ対象外。
- `npm run build`: 成功。相対パスのHTML・JS・CSS、内容ハッシュ付きSWを生成。
- 開始時点の旅程をJavaScriptとして評価し、改善後とのJSON全項目一致を確認。既存本文・URL・日程数・準備・候補の変更なし。
- 一時導入のPlaywright/Chromiumで`/trip-guide/`配信を確認。390px幅の横はみ出しなし、左右キーとTabのフォーカス、保存復元、オフライン再読込みと日付切替、更新待機→タブを閉じた後の新ビルド反映、古い専用キャッシュ削除、他アプリキャッシュ保持を確認した。ブラウザ工具・OSライブラリは/tmpだけに配置し、プロジェクト依存には追加していない。

主要配色の計算値: 本文12.71:1、muted 6.72:1、accent 7.89:1、critical 5.91:1、主要ボタン7.96:1、critical badge 6.52:1、注記本文8.56:1、フォーカス枠7.12:1。実機の読み上げ・フォーカス視認性は手動確認項目として残す。

## 依存監査

作業中の最初の監査でhigh 4件（Vite、brace-expansion、source-map-js、zod）を検出した。Viteを8.2.1から同一メジャーの8.3.5へ更新し、他は互換範囲内の推移依存更新で解消した。強制メジャーアップデートや監査の無効化は行っていない。

根拠: [Vite関連advisory](https://github.com/advisories/GHSA-587h-7wmj-h5pm)、[brace-expansion](https://github.com/advisories/GHSA-qhr7-859c-m2p7)、[source-map-js](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)、[zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)。監査結果は2026-10-28時点であり、継続監査はCIで実施する。

## 互換性と残る課題

UIの変更は日付タブの横スクロールとフォーカス枠の改善、footerを旅行名・期間から表示する変更のみ。日付切替時の強制的なページ先頭へのスクロールを廃止した。非選択日をhiddenで保持し、操作中のタブ上のフォーカスを維持する。未使用のSVGアイコン分岐は削除した。

PWAの新バージョン通知、スマートフォン実機・スクリーンリーダー確認、ブラウザE2EのCI常設は未対応。旧スコープ不明キャッシュは他アプリを誤削除しないため自動削除しない。PWA公開メタ情報は旅行差し替え時にHTML/manifestも編集する。PRはmainへ自動マージせず、実際の新バージョン公開はレビュー後のマージで行う。

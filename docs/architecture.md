# アーキテクチャ

## 制約と設計判断

React + TypeScript + Vite、Node.js 24、GitHub Pagesだけで完結する。旅行中に時刻・次の目的地・移動手段を素早く読むため、既存の紙のしおり風UIを維持する。外部API・バックエンド・DB・有料サービスは使わない。

状態は選択日だけなのでReactのuseStateで十分。Contextや外部状態管理、汎用データアクセス層は不要。日程概要と注意文は小さく、App内に残す。対してキーボード操作と予定描画は独立した変更理由を持つため分離した。

## 責務と依存方向

```text
main.tsx → App
             ├─ data/trip.ts → domain/trip.ts, validateTrip, lib/maps
             ├─ hooks/useSelectedDay → lib/selectedDay → domain/trip
             ├─ components/DayTabs → domain/trip
             └─ components/ScheduleTimeline → MapButtons → Icon
```

|モジュール|責務|
|---|---|
|`domain/trip.ts`|Trip（旅行）、TripDay（日別旅程）、TripStop（予定）、種別とリンクの型|
|`domain/validateTrip.ts`|静的データの空文字・ID重複・HTTPS URLという意味的制約|
|`data/trip.ts`|既存の旅行内容と検証呼び出し。旅行情報の唯一の取得先|
|`lib/maps.ts`|検索語や出発地を安全にエンコードする純粋関数|
|`lib/selectedDay.ts`|有効な日の解決、localStorage例外の吸収|
|`hooks/useSelectedDay.ts`|選択状態と保存副作用の同期|
|`components/DayTabs.tsx`|ARIA対応、roving tabindex、左右/Home/End操作|
|`components/ScheduleTimeline.tsx`|予定行・準備・寄り道の表示。保存処理に依存しない|
|`App.tsx`|旅行をpropsで受け取り、全体を組み立てる|
|`scripts/build-sw.mjs`|成果物一覧と内容ハッシュからSWの事前キャッシュを生成|

## 型とデータの境界

`Trip.days`はreadonlyの非空タプルで、空の日程を受け付けない。予定配列もreadonlyとし、表示側の配列変更を抑制する。`StopKind`と`StopEmphasis`はUnion、表示ラベルは`Record<StopKind, string>`で網羅する。

静的旅程は`satisfies Trip`で構造を検査しつつ、リテラル型の推論を維持する。`strict`・`noUncheckedIndexedAccess`・`exactOptionalPropertyTypes`を有効化する。先頭日へのアクセスが安全なことは非空型で示し、キーボード操作の添字アクセスは存在を検査する。

`validateTrip`は**型付き静的データの意味的検証**であり、未知のJSONをTripへ変換するパーサーではない。入力インポート機能は存在しないため汎用パーサーは作らない。URLはHTTPSだけを許可し、HTML挿入は使わない。旅程の説明・時刻・曜日・期間表示は編集者が管理し、営業時間などの現地情報の正確さは検証対象外。

## 状態とデータフロー

1. 既存キー`family-trip-guide-selected-day`から保存値を読む。拒否や未保存ならnull。
2. `resolveDay`が現在の旅程に含まれる日を返し、不正値や別旅行の値なら先頭日を返す。
3. Appがその日を選択中として描画する。
4. タブ操作で選択IDが変わる。副作用で有効な日のIDを保存する。
5. 容量不足・ストレージ取得拒否でも画面操作を継続する。

旅行を差し替えても表示時に現在のdaysから選び直す。IDが一致する場合は同じ日を選択する。複数旅行の同時保存は対象外で、既存の保存キーを維持した。

## アクセシビリティ

[WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)を参照し、左右キーは循環、Home/Endは先頭/末尾、Enter/Spaceはネイティブbuttonの操作を利用する。静的内容をすべてDOMに置けるため自動選択方式とし、非選択パネルはhiddenで支援技術から除外する。全タブのaria-controlsとパネルのaria-labelledbyを対応させる。

Tabキーは選択タブからtabpanelへ移動し、フォーカスは日付選択中にタブ上に保つ。元の全画面スクロールは廃止し、操作対象が突然移動するのを防ぐ。配色・カード構成は維持し、フォーカス枠を濃いアクセント色へ変更、多日程のタブには横スクロールを追加した。本文色・ラベル色・強調色・ボタン文字のコントラストは[コードレビューの検証記録](code-review.md)を参照。実際の読み上げ・モバイル操作は手動確認が必要。

## PWAと更新

本番だけSWを登録する。`npm run build`の最後にdist内のHTML/JS/CSS/manifest/iconを列挙し、内容ハッシュをキャッシュ名へ埋め込む。installが全ファイルの保存に失敗すると新SWは有効化されない。navigationは保存したindex.htmlを返し、同一ビルドのアセットと整合させる。

skipWaitingは使わず、既存タブを閉じた後の再訪で新SWへ切り替わる。公開直後の即時更新通知は未実装。activate時に現在のregistration.scopeを含む接頭辞の古いキャッシュだけを削除する。旧実装の`family-trip-guide-v*`は所有スコープを判定できないため自動削除しない。初回オンライン訪問とSWのインストール完了がオフライン利用の前提。外部地図・公式サイトはネット接続が必要。

## CI/CD

同一workflowのqualityジョブをPR・main push・手動実行で共用。Node指定は.nvmrcから取得し、npm ci → audit(moderate以上で失敗) → typecheck → lint → coverage付きテスト → buildを実行する。mainの検証済みdistだけをPages artifactとして渡し、依存するdeployジョブが公開する。PRには書込み権限を与えない。

Viteの`base: './'`、manifest・SWの相対パスを維持する。GitHub Pages設定でSourceにGitHub Actionsを選択する。マージ前に既存の公開サイトを変更する必要はない。

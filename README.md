# PostNote

## 概要
PostNoteは、投稿・編集・削除ができるシンプルなノートアプリです。  
フロントエンドにNext.js、バックエンドにSupabaseを使用し、CRUD処理の基本構成を理解することを目的に開発しました。

---

## URL
https://post-note-7d6r6gqhd-mui-1729s-projects.vercel.app/

---

## 背景・目的
Webアプリケーション開発の基礎である「データの取得・保存・更新・削除（CRUD）」の流れを理解するために作成しました。  
特に、フロントエンドとバックエンドのデータ連携の仕組みを実装レベルで把握することを目的としています。

---

## 主な機能
- 投稿の作成
- 投稿一覧の表示（作成日時の降順）
- 投稿の編集
- 投稿の削除

---

## 技術構成
- Frontend: Next.js (App Router)
- Language: TypeScript
- Backend: Supabase
- Hosting: Vercel

---

## データ構造（Supabase）

| カラム名   | 型        | 説明                 |
|------------|----------|----------------------|
| id         | int8     | 投稿ID（自動生成）   |
| content    | text     | 投稿内容             |
| label      | text     | 投稿ラベル（AI分類） |
| created_at | timestamp| 作成日時             |

---

## 実装のポイント（重要）

### 1. フロントでの状態管理
投稿後に再フェッチせず、取得したデータをそのままstateに追加することで、即時にUIへ反映させています。

### 2. 再描画の仕組み
配列を直接変更せず、新しい配列を生成して`setState`することで、Reactの再描画が正しく行われるようにしています。

### 3. Supabaseとの連携
- `select`でデータ取得
- `insert`で投稿追加
- `update`で編集
- `delete`で削除

CRUD操作を一通り実装しています。

---

## 環境変数

以下を `.env.local` に設定してください。

```text
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_HF_API_TOKEN=your_huggingface_api_token
```

---

## ローカルでの起動方法

```bash
git clone https://github.com/mui-1729/PostNote.git
cd PostNote
npm install
npm run dev
```

---

## AI機能

投稿内容をAIで分類し、自動でラベル付けを行っています。

- 分類は投稿時に1回のみ実行
- 結果はデータベースに保存し、表示時の再計算は行わない
- 必要に応じてユーザーがラベルを修正可能

これにより、パフォーマンスとコストを抑えつつ、自然なUXを実現しています。

---

## 課題・改善点
- リアルタイム更新未対応（現在は手動リロード）
- 認証機能がないため、誰でも編集可能
- UIが最小構成

---

## 今後の展望
- Supabase Realtimeによる即時同期
- ユーザー認証の追加
- 投稿へのラベル付け機能
- UI/UXの改善

---

## 補足
本アプリは学習目的で作成しています。
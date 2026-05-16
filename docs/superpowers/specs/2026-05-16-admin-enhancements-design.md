# 管理者画面 高優先度機能 設計書

**日付:** 2026-05-16  
**対象:** `src/app/admin/` 以下の管理者画面

---

## 概要

管理者画面に以下の3機能を追加する。

1. **ドラッグ&ドロップ並び替え** — Works・Categories の表示順を視覚的に変更
2. **一括公開/非公開** — Works 一覧でチェックボックスによる状態の一括変更
3. **プレビューリンク** — Works 一覧から公開ページへ新タブで直接遷移

---

## 決定事項

| 項目 | 決定 |
|------|------|
| 並び替えの保存方式 | 手動保存（「順序を保存」ボタンで確定）|
| 並び替えの対象 | Works・Categories 両方 |
| 一括操作の内容 | 公開 / 非公開 のみ（削除は含まない）|
| プレビューリンクの配置 | Works 一覧の操作列（新タブで開く）|
| DnD ライブラリ | `@dnd-kit/core` + `@dnd-kit/sortable` |
| 状態管理 | Client Component + `useState` → Server Action |

---

## アーキテクチャ

### 新規ファイル

| ファイル | 役割 |
|---------|------|
| `src/components/admin/SortableList.tsx` | dnd-kit ラッパー。Works・Categories で共用。ドラッグハンドル・並び替え済みインジケーター・「順序を保存」ボタン・「元に戻す」ボタンを含む |
| `src/components/admin/WorksListClient.tsx` | Works 一覧の Client Component。一括選択状態・ドラッグ状態を管理。`WorksListPage` から UI ロジックをすべて委譲される |
| `src/components/admin/CategoriesListClient.tsx` | Categories 一覧の Client Component。ドラッグ状態を管理 |

### 既存ファイルの変更

| ファイル | 変更内容 |
|---------|---------|
| `src/app/admin/works/actions.ts` | `updateWorksOrder(ids: string[])` と `bulkUpdatePublished(ids: string[], published: boolean)` を追加 |
| `src/app/admin/categories/actions.ts` | `updateCategoriesOrder(ids: string[])` を追加 |
| `src/app/admin/works/page.tsx` | DB データ取得のみ担当し、`WorksListClient` に props として渡す。`slug` を select に追加 |
| `src/app/admin/categories/page.tsx` | DB データ取得のみ担当し、`CategoriesListClient` に props として渡す |

---

## 機能詳細

### 1. ドラッグ&ドロップ並び替え

**ユーザーフロー:**
1. 各行の左端にドラッグハンドル（⠿）を表示
2. ハンドルをつかんで上下にドラッグ → ローカル state の順序が変わる
3. 移動済みの行は視覚的に区別（黄色のインジケーター）
4. カテゴリセクションごとに「順序を保存」ボタンを表示。変更がない場合は `disabled`
5. 「元に戻す」ボタンで初期順序にリセット（DB は変更しない）
6. 「順序を保存」クリック → `updateWorksOrder(ids[])` を呼び出し → Supabase で `order = index` に一括 UPDATE

**SortableList の props インターフェース:**
```ts
type SortableListProps<T extends { id: string }> = {
  items: T[]
  renderRow: (item: T, dragHandleProps: DragHandleProps) => React.ReactNode
  onSave: (orderedIds: string[]) => Promise<void>
  saveLabel?: string  // デフォルト: "順序を保存"
}
```

**DB 更新ロジック:**
```ts
// updateWorksOrder の実装方針
// ids[0] が order=0、ids[1] が order=1 ... として並列 UPDATE
await Promise.all(
  ids.map((id, index) =>
    supabase.from('works').update({ order: index }).eq('id', id)
  )
)
```

`bulkUpdatePublished` は `.in('id', ids)` で単一クエリにまとめる。

**Works の場合の並び替え範囲:** カテゴリをまたいだ移動は不可。各カテゴリの `SortableList` は独立している。

---

### 2. 一括公開/非公開

**ユーザーフロー:**
1. 各 Work 行の左端にチェックボックスを追加
2. テーブルヘッダーに「全選択」チェックボックスを配置（全選択・全解除を切り替え）
3. 1件以上選択時、テーブル上部に操作バーを表示:
   - 「N 件選択中」のカウント
   - 「公開にする」ボタン
   - 「非公開にする」ボタン
   - 「選択解除」ボタン
4. ボタンクリック → `bulkUpdatePublished(selectedIds, boolean)` → Supabase 一括 UPDATE → `revalidatePath` → 画面リフレッシュ

**選択状態の管理:**
```ts
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
```
`Set` を使って O(1) で選択状態を確認・トグル。

**全選択の挙動:**
- 全件選択済みなら「全解除」として機能
- 未選択または一部選択なら「全選択」として機能（indeterminate 状態）

---

### 3. プレビューリンク

**Works 一覧の操作列に追加:**
```tsx
<a
  href={`/works/${w.slug}`}
  target="_blank"
  rel="noopener noreferrer"
  className={`${styles.btn} ${styles.btnPreview}`}
>
  ↗ 見る
</a>
```

- `slug` は既存の Works 一覧クエリに追加するだけで取得可能（追加の DB 問い合わせなし）
- `published` が `false` の Works でもリンクは表示する（下書き確認のため）
- 操作列のボタン順: 編集 → ↗ 見る → 削除

---

## エラーハンドリング

| シナリオ | 対応 |
|---------|------|
| 並び替え保存失敗 | `useActionState` でエラーメッセージをボタン付近にインライン表示 |
| 一括操作失敗 | 同上。操作バーにエラーを表示 |
| 保存中の二重送信 | ボタンを `disabled` + ローディング表示で防止 |

---

## テスト方針

すべて手動確認。既存 E2E テスト（`e2e/` 以下）の回帰を確認する。

| 確認項目 |
|---------|
| ドラッグで並び替え → 「順序を保存」→ リロード後も順序が維持される |
| 「元に戻す」→ 保存前の状態に戻る |
| 全選択チェック → 全行にチェックが入る |
| 「公開にする」→ 対象行の状態バッジが「公開」に切り替わる |
| 「↗ 見る」→ 正しい `/works/[slug]` URL が新タブで開く |
| Works・Categories それぞれでドラッグ&ドロップが動作する |

---

## 依存パッケージ

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

既存の `package.json` への追加のみ。他の依存関係への影響なし。

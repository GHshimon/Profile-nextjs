# Admin Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 管理者画面に「ドラッグ&ドロップ並び替え（Works・Categories）」「一括公開/非公開（Works）」「プレビューリンク（Works 一覧）」の3機能を追加する。

**Architecture:** Server Component（page.tsx）がデータ取得のみを担い、Client Component（*ListClient.tsx）がインタラクション状態を管理する。`SortableList` は dnd-kit のコンテキストプロバイダーを持ち `<tr>` フラグメントのみ返す（DOM ラッパーなし）ため `<tbody>` 内に安全に配置できる。保存ボタンは Consumer 側が `<table>` の外で描画する。

**Tech Stack:** Next.js 16 App Router, React 19, @dnd-kit/core + @dnd-kit/sortable, Supabase, CSS Modules

---

## ファイルマップ

| アクション | ファイル | 責務 |
|-----------|---------|------|
| 作成 | `src/components/admin/SortableList.tsx` | dnd-kit ラッパー。`<tr>` フラグメントのみ返す。保存ボタンは含まない。Works・Categories 共用 |
| 作成 | `src/components/admin/WorksListClient.tsx` | Works 一覧の全インタラクション（DnD・一括選択・プレビューリンク）を管理する Client Component |
| 作成 | `src/components/admin/CategoriesListClient.tsx` | Categories 一覧の DnD インタラクションを管理する Client Component |
| 修正 | `src/components/admin/admin.module.css` | 新機能用 CSS クラスを追加 |
| 修正 | `src/app/admin/works/actions.ts` | `updateWorksOrder` と `bulkUpdatePublished` を追加 |
| 修正 | `src/app/admin/categories/actions.ts` | `updateCategoriesOrder` を追加 |
| 修正 | `src/app/admin/works/page.tsx` | `slug` を select に追加し、`WorksListClient` に委譲 |
| 修正 | `src/app/admin/categories/page.tsx` | `CategoriesListClient` に委譲 |

---

## Task 1: @dnd-kit パッケージのインストール

**Files:**
- Modify: `package.json`

- [ ] **Step 1: パッケージをインストール**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected: `added 3 packages` のような出力。エラーがないことを確認。

- [ ] **Step 2: インストール確認**

```bash
node -e "require('@dnd-kit/core'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 3: コミット**

```bash
git add package.json package-lock.json
git commit -m "chore: install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities"
```

---

## Task 2: CSS クラスの追加

**Files:**
- Modify: `src/components/admin/admin.module.css`

- [ ] **Step 1: `admin.module.css` の末尾に以下を追記**

```css
/* ── Drag & Drop ── */
.dragHandle {
  cursor: grab;
  color: #9ca3af;
  font-size: 18px;
  padding: 0 4px;
  line-height: 1;
  user-select: none;
}

.dragHandle:active {
  cursor: grabbing;
}

.rowDragging {
  opacity: 0.5;
  background: #fef9c3;
}

.orderActions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

/* ── Bulk Action Bar ── */
.bulkBar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}

.bulkCount {
  font-weight: 600;
  color: #1d4ed8;
}

.btnPublish {
  background: #10b981;
  color: #fff;
  border-color: #10b981;
}

.btnUnpublish {
  background: #6b7280;
  color: #fff;
  border-color: #6b7280;
}

/* ── Preview Link ── */
.btnPreview {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

/* ── Table column widths ── */
.checkboxCell {
  width: 36px;
  padding: 10px 8px;
}

.handleCell {
  width: 28px;
  padding: 10px 4px;
}
```

- [ ] **Step 2: TypeScript/build エラーがないことを確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add src/components/admin/admin.module.css
git commit -m "style(admin): add CSS classes for drag-drop, bulk bar, and preview link"
```

---

## Task 3: Server Actions の追加

**Files:**
- Modify: `src/app/admin/works/actions.ts`
- Modify: `src/app/admin/categories/actions.ts`

- [ ] **Step 1: `src/app/admin/works/actions.ts` に2つの関数を追記**

既存の `deleteWork` 関数の直後に追記する（`'use server'` ディレクティブと既存 import はそのまま）。

```ts
export async function updateWorksOrder(ids: string[]) {
  const supabase = await createSupabaseServerClient()
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from('works').update({ order: index }).eq('id', id)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(failed.error.message)
  revalidatePath('/admin/works')
  revalidatePath('/works')
  revalidatePath('/')
}

export async function bulkUpdatePublished(ids: string[], published: boolean) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('works')
    .update({ published })
    .in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/works')
  revalidatePath('/works')
  revalidatePath('/')
}
```

- [ ] **Step 2: `src/app/admin/categories/actions.ts` に1つの関数を追記**

既存の `deleteCategory` 関数の直後に追記する。

```ts
export async function updateCategoriesOrder(ids: string[]) {
  const supabase = await createSupabaseServerClient()
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from('categories').update({ order: index }).eq('id', id)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(failed.error.message)
  revalidatePath('/admin/categories')
  revalidatePath('/works')
  revalidatePath('/')
}
```

- [ ] **Step 3: TypeScript エラーがないことを確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 4: コミット**

```bash
git add src/app/admin/works/actions.ts src/app/admin/categories/actions.ts
git commit -m "feat(admin): add updateWorksOrder, bulkUpdatePublished, updateCategoriesOrder actions"
```

---

## Task 4: SortableList コンポーネントの作成

**Files:**
- Create: `src/components/admin/SortableList.tsx`

**設計上の注意点:**
- `DndContext` と `SortableContext` は dnd-kit のコンテキストプロバイダーで DOM 要素を描画しない
- `SortableRow` が `<tr>` を描画する
- 結果として `<tbody>` 内に配置しても有効な HTML になる
- 保存ボタンは含まない（Consumer が `<table>` の外で描画する）
- `onOrderChange` で並び替え後のアイテム配列を Consumer に通知する

- [ ] **Step 1: `SortableList.tsx` を新規作成**

```tsx
'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCallback } from 'react'
import styles from './admin.module.css'

type SortableRowProps<T extends { id: string }> = {
  item: T
  renderCells: (
    item: T,
    dragHandleListeners: Record<string, unknown> | undefined
  ) => React.ReactNode
  rowClassName?: (isDragging: boolean) => string | undefined
}

function SortableRow<T extends { id: string }>({
  item,
  renderCells,
  rowClassName,
}: SortableRowProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  return (
    <tr
      ref={setNodeRef as React.Ref<HTMLTableRowElement>}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={rowClassName?.(isDragging)}
      {...attributes}
    >
      {renderCells(item, listeners)}
    </tr>
  )
}

export type SortableListProps<T extends { id: string }> = {
  items: T[]
  renderCells: (
    item: T,
    dragHandleListeners: Record<string, unknown> | undefined
  ) => React.ReactNode
  rowClassName?: (isDragging: boolean) => string | undefined
  onOrderChange: (orderedItems: T[]) => void
}

export function DragHandle({
  listeners,
}: {
  listeners: Record<string, unknown> | undefined
}) {
  return (
    <span
      className={styles.dragHandle}
      {...(listeners as React.HTMLAttributes<HTMLSpanElement>)}
    >
      ⠿
    </span>
  )
}

export default function SortableList<T extends { id: string }>({
  items,
  renderCells,
  rowClassName,
  onOrderChange,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      onOrderChange(arrayMove(items, oldIndex, newIndex))
    },
    [items, onOrderChange]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableRow
            key={item.id}
            item={item}
            renderCells={renderCells}
            rowClassName={rowClassName}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

- [ ] **Step 2: TypeScript エラーがないことを確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add src/components/admin/SortableList.tsx
git commit -m "feat(admin): add SortableList component with dnd-kit"
```

---

## Task 5: CategoriesListClient の作成

**Files:**
- Create: `src/components/admin/CategoriesListClient.tsx`

**設計上の注意点:**
- Server Actions（`updateCategoriesOrder`, `deleteCategory`）は `'use server'` ファイルからの import は Client Component でも有効
- `SortableList` を `<tbody>` 内に配置し、保存ボタンは `<table>` の外に描画する
- 初期順序との比較で `hasChanged` を判定する

- [ ] **Step 1: `CategoriesListClient.tsx` を新規作成**

```tsx
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import SortableList, { DragHandle } from './SortableList'
import DeleteButton from './DeleteButton'
import { updateCategoriesOrder } from '@/app/admin/categories/actions'
import { deleteCategory } from '@/app/admin/categories/actions'
import styles from './admin.module.css'

type Category = {
  id: string
  slug: string
  name: string
  order: number
}

type Props = {
  categories: Category[]
}

export default function CategoriesListClient({ categories: initialCategories }: Props) {
  const [items, setItems] = useState(initialCategories)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const initialIds = initialCategories.map((c) => c.id).join(',')
  const hasChanged = items.map((c) => c.id).join(',') !== initialIds

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      try {
        await updateCategoriesOrder(items.map((c) => c.id))
      } catch {
        setError('保存に失敗しました。もう一度お試しください。')
      }
    })
  }

  const handleReset = () => {
    setItems(initialCategories)
    setError(null)
  }

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.handleCell} />
            <th>表示名</th>
            <th>slug</th>
            <th>順序</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <SortableList
            items={items}
            onOrderChange={setItems}
            rowClassName={(isDragging) =>
              isDragging ? styles.rowDragging : undefined
            }
            renderCells={(cat, listeners) => (
              <>
                <td className={styles.handleCell}>
                  <DragHandle listeners={listeners} />
                </td>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.order}</td>
                <td>
                  <div className={styles.actionRow}>
                    <Link
                      href={`/admin/categories/${cat.id}`}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      編集
                    </Link>
                    <DeleteButton
                      action={() => deleteCategory(cat.id)}
                      confirmMessage={`カテゴリ「${cat.name}」を削除しますか？\n（紐づく Works も削除される可能性があります）`}
                    />
                  </div>
                </td>
              </>
            )}
          />
        </tbody>
      </table>

      <div className={styles.orderActions}>
        <button
          onClick={handleSave}
          disabled={!hasChanged || isPending}
          className={styles.btn}
        >
          {isPending ? '保存中...' : '順序を保存'}
        </button>
        {hasChanged && (
          <button
            onClick={handleReset}
            disabled={isPending}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            元に戻す
          </button>
        )}
        {error && <span className={styles.formError}>{error}</span>}
      </div>
    </>
  )
}
```

- [ ] **Step 2: TypeScript エラーがないことを確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add src/components/admin/CategoriesListClient.tsx
git commit -m "feat(admin): add CategoriesListClient with drag-and-drop ordering"
```

---

## Task 6: categories/page.tsx の更新

**Files:**
- Modify: `src/app/admin/categories/page.tsx`

- [ ] **Step 1: `page.tsx` を以下で置き換え**

```tsx
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import CategoriesListClient from '@/components/admin/CategoriesListClient'
import styles from '@/components/admin/admin.module.css'

export default async function CategoriesListPage() {
  const supabase = await createSupabaseServerClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name, order')
    .order('order', { ascending: true })

  return (
    <>
      <div
        className={styles.actionRow}
        style={{ justifyContent: 'space-between', display: 'flex' }}
      >
        <h1 className={styles.heading}>Categories</h1>
        <Link href="/admin/categories/new" className={styles.btn}>
          新規作成
        </Link>
      </div>
      <div className={styles.card}>
        <CategoriesListClient categories={categories ?? []} />
      </div>
    </>
  )
}
```

- [ ] **Step 2: dev サーバーを起動して `/admin/categories` を手動確認**

```bash
npm run dev
```

`http://localhost:3000/admin/categories` を開いて確認:

- [ ] 各行の左端に ⠿ ハンドルが表示される
- [ ] ハンドルをドラッグして行を並び替えられる
- [ ] 並び替え後に「順序を保存」ボタンが有効になる（変更前は disabled）
- [ ] 「順序を保存」クリック → 成功 → ページをリロードしても順序が維持される
- [ ] 「元に戻す」クリック → 初期順序に戻る
- [ ] 変更なしの場合「順序を保存」は disabled のまま

- [ ] **Step 3: コミット**

```bash
git add src/app/admin/categories/page.tsx
git commit -m "feat(admin): wire CategoriesListClient into categories page"
```

---

## Task 7: WorksListClient の作成

**Files:**
- Create: `src/components/admin/WorksListClient.tsx`

**設計上の注意点:**
- Works は複数カテゴリがある。カテゴリごとに独立した `SortableList` + 並び替え状態を持つ
- 並び替え状態は `Record<categoryId, Work[]>` で一括管理する
- `bulkUpdatePublished` と `deleteWork` は Server Actions ファイルから直接 import する（Client Component でも有効）
- 一括選択の状態 `selectedIds: Set<string>` は全カテゴリ横断で1つ管理する

- [ ] **Step 1: `WorksListClient.tsx` を新規作成**

```tsx
'use client'

import { useState, useTransition, useMemo } from 'react'
import Link from 'next/link'
import SortableList, { DragHandle } from './SortableList'
import DeleteButton from './DeleteButton'
import { updateWorksOrder, bulkUpdatePublished } from '@/app/admin/works/actions'
import { deleteWork } from '@/app/admin/works/actions'
import styles from './admin.module.css'

type Work = {
  id: string
  category_id: string
  number: string
  title: string
  slug: string
  order: number
  published: boolean
}

type Category = {
  id: string
  name: string
}

type Props = {
  works: Work[]
  categories: Category[]
}

export default function WorksListClient({ works, categories }: Props) {
  // 並び替え状態: カテゴリ ID → Works 配列
  const [catItems, setCatItems] = useState<Record<string, Work[]>>(() =>
    Object.fromEntries(
      categories.map((cat) => [
        cat.id,
        works.filter((w) => w.category_id === cat.id),
      ])
    )
  )

  // 並び替えの初期順序（hasChanged 判定用）
  const initialOrder = useMemo(
    () =>
      Object.fromEntries(
        categories.map((cat) => [
          cat.id,
          works
            .filter((w) => w.category_id === cat.id)
            .map((w) => w.id)
            .join(','),
        ])
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // 並び替え保存状態（カテゴリごと）
  const [orderPending, startOrderTransition] = useTransition()
  const [orderErrors, setOrderErrors] = useState<Record<string, string>>({})

  // 一括操作状態
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkPending, startBulkTransition] = useTransition()
  const [bulkError, setBulkError] = useState<string | null>(null)

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleBulkUpdate = (published: boolean) => {
    setBulkError(null)
    startBulkTransition(async () => {
      try {
        await bulkUpdatePublished(Array.from(selectedIds), published)
        setSelectedIds(new Set())
      } catch {
        setBulkError('一括操作に失敗しました。もう一度お試しください。')
      }
    })
  }

  const handleSaveOrder = (catId: string) => {
    setOrderErrors((prev) => ({ ...prev, [catId]: '' }))
    startOrderTransition(async () => {
      try {
        await updateWorksOrder(catItems[catId].map((w) => w.id))
      } catch {
        setOrderErrors((prev) => ({
          ...prev,
          [catId]: '保存に失敗しました。もう一度お試しください。',
        }))
      }
    })
  }

  return (
    <>
      {selectedIds.size > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selectedIds.size} 件選択中</span>
          <button
            onClick={() => handleBulkUpdate(true)}
            disabled={bulkPending}
            className={`${styles.btn} ${styles.btnPublish}`}
          >
            公開にする
          </button>
          <button
            onClick={() => handleBulkUpdate(false)}
            disabled={bulkPending}
            className={`${styles.btn} ${styles.btnUnpublish}`}
          >
            非公開にする
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className={`${styles.btn} ${styles.btnSecondary}`}
            style={{ marginLeft: 'auto' }}
          >
            選択解除
          </button>
          {bulkError && <span className={styles.formError}>{bulkError}</span>}
        </div>
      )}

      {categories.map((cat) => {
        const items = catItems[cat.id] ?? []
        const currentIds = items.map((w) => w.id).join(',')
        const hasChanged = currentIds !== (initialOrder[cat.id] ?? '')

        const allSelected =
          items.length > 0 && items.every((w) => selectedIds.has(w.id))
        const someSelected = items.some((w) => selectedIds.has(w.id))

        const toggleAllInCategory = () => {
          setSelectedIds((prev) => {
            const next = new Set(prev)
            if (allSelected) {
              items.forEach((w) => next.delete(w.id))
            } else {
              items.forEach((w) => next.add(w.id))
            }
            return next
          })
        }

        return (
          <section key={cat.id}>
            <div className={styles.groupHeader}>
              <span>📁 {cat.name}</span>
              <Link
                href={`/admin/works/new?category=${cat.id}`}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                このカテゴリに新規追加
              </Link>
            </div>
            <div className={styles.card}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected && !allSelected
                        }}
                        onChange={toggleAllInCategory}
                      />
                    </th>
                    <th className={styles.handleCell} />
                    <th>番号</th>
                    <th>タイトル</th>
                    <th>状態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ color: '#6b7280' }}>
                        このカテゴリには Works がありません。
                      </td>
                    </tr>
                  )}
                  <SortableList
                    items={items}
                    onOrderChange={(ordered) =>
                      setCatItems((prev) => ({ ...prev, [cat.id]: ordered }))
                    }
                    rowClassName={(isDragging) =>
                      isDragging ? styles.rowDragging : undefined
                    }
                    renderCells={(w, listeners) => (
                      <>
                        <td className={styles.checkboxCell}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(w.id)}
                            onChange={() => toggleSelect(w.id)}
                          />
                        </td>
                        <td className={styles.handleCell}>
                          <DragHandle listeners={listeners} />
                        </td>
                        <td>{w.number}</td>
                        <td>{w.title}</td>
                        <td>{w.published ? '公開' : '非公開'}</td>
                        <td>
                          <div className={styles.actionRow}>
                            <Link
                              href={`/admin/works/${w.id}`}
                              className={`${styles.btn} ${styles.btnSecondary}`}
                            >
                              編集
                            </Link>
                            <a
                              href={`/works/${w.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${styles.btn} ${styles.btnPreview}`}
                            >
                              ↗ 見る
                            </a>
                            <DeleteButton
                              action={() => deleteWork(w.id)}
                              confirmMessage={`Works「${w.title}」を削除しますか？`}
                            />
                          </div>
                        </td>
                      </>
                    )}
                  />
                </tbody>
              </table>

              <div className={styles.orderActions}>
                <button
                  onClick={() => handleSaveOrder(cat.id)}
                  disabled={!hasChanged || orderPending}
                  className={styles.btn}
                >
                  {orderPending ? '保存中...' : '順序を保存'}
                </button>
                {hasChanged && (
                  <button
                    onClick={() =>
                      setCatItems((prev) => ({
                        ...prev,
                        [cat.id]: works.filter((w) => w.category_id === cat.id),
                      }))
                    }
                    disabled={orderPending}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                  >
                    元に戻す
                  </button>
                )}
                {orderErrors[cat.id] && (
                  <span className={styles.formError}>{orderErrors[cat.id]}</span>
                )}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
```

- [ ] **Step 2: TypeScript エラーがないことを確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add src/components/admin/WorksListClient.tsx
git commit -m "feat(admin): add WorksListClient with drag-drop, bulk publish, and preview link"
```

---

## Task 8: works/page.tsx の更新

**Files:**
- Modify: `src/app/admin/works/page.tsx`

- [ ] **Step 1: `page.tsx` を以下で置き換え**

`slug` を select に追加し、`WorksListClient` に委譲する。既存の `DeleteButton` のインライン `'use server'` は削除して Client Component 側の import に移行済み。

```tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import WorksListClient from '@/components/admin/WorksListClient'
import styles from '@/components/admin/admin.module.css'

export default async function WorksListPage() {
  const supabase = await createSupabaseServerClient()
  const [{ data: categories }, { data: works }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name')
      .order('order', { ascending: true }),
    supabase
      .from('works')
      .select('id, category_id, number, title, slug, order, published')
      .order('order', { ascending: true }),
  ])

  return (
    <>
      <h1 className={styles.heading}>Works</h1>
      <WorksListClient works={works ?? []} categories={categories ?? []} />
    </>
  )
}
```

- [ ] **Step 2: dev サーバーで `/admin/works` を手動確認**

`npm run dev` が起動中であることを確認し `http://localhost:3000/admin/works` を開く。

**ドラッグ&ドロップ:**
- [ ] 各行の左端に ⠿ ハンドルが表示される
- [ ] 同一カテゴリ内でドラッグして並び替えられる
- [ ] 並び替え後に「順序を保存」ボタンが有効になる
- [ ] 保存 → リロード後も順序が維持される
- [ ] 「元に戻す」で初期順序に戻る

**一括操作:**
- [ ] 各行にチェックボックスが表示される
- [ ] ヘッダーチェックボックスで全選択/全解除できる
- [ ] 一部選択時にヘッダーチェックが indeterminate 状態になる
- [ ] 1件以上選択すると青い一括バーが表示される
- [ ] 「公開にする」→ 対象 Works の状態が「公開」に変わる
- [ ] 「非公開にする」→ 対象 Works の状態が「非公開」に変わる
- [ ] 「選択解除」でチェックがすべて外れ一括バーが消える

**プレビューリンク:**
- [ ] 各行の操作列に「↗ 見る」ボタンが表示される
- [ ] クリックすると `/works/[正しいslug]` が新タブで開く

- [ ] **Step 3: `npm run build` でビルドが成功することを確認**

```bash
npm run build
```

Expected: ビルド成功（型エラー・未使用 import なし）

- [ ] **Step 4: コミット**

```bash
git add src/app/admin/works/page.tsx
git commit -m "feat(admin): wire WorksListClient into works page"
```

---

## Task 9: 最終確認

**Files:**
- Read: 全変更ファイル（最終確認のみ）

- [ ] **Step 1: 既存ページのリグレッションがないことを確認**

以下ページが正常に表示・動作することを確認する:

| URL | 確認項目 |
|-----|---------|
| `http://localhost:3000/admin` | ダッシュボードの統計が表示される |
| `http://localhost:3000/admin/works/new` | Works 新規作成フォームが表示・送信できる |
| `http://localhost:3000/admin/works/[任意のid]` | Works 編集フォームが表示・更新できる |
| `http://localhost:3000/admin/categories/new` | Category 新規作成フォームが表示・送信できる |
| `http://localhost:3000/admin/categories/[任意のid]` | Category 編集フォームが表示・更新できる |

- [ ] **Step 2: `npm run lint` でリントエラーがないことを確認**

```bash
npm run lint
```

Expected: エラーなし

- [ ] **Step 3: `.superpowers/` を `.gitignore` に追加（未追加の場合）**

`.gitignore` の末尾に以下を追記する。すでに記載がある場合はスキップ。

```
.superpowers/
```

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm artifacts" || echo "skipped"
```

- [ ] **Step 4: 最終コミットログを確認**

```bash
git log --oneline -9
```

Expected（この順で）:
```
feat(admin): wire WorksListClient into works page
feat(admin): add WorksListClient with drag-drop, bulk publish, and preview link
feat(admin): wire CategoriesListClient into categories page
feat(admin): add CategoriesListClient with drag-and-drop ordering
feat(admin): add SortableList component with dnd-kit
feat(admin): add updateWorksOrder, bulkUpdatePublished, updateCategoriesOrder actions
style(admin): add CSS classes for drag-drop, bulk bar, and preview link
chore: install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
docs: add admin enhancements design spec (drag-drop, bulk publish, preview link)
```

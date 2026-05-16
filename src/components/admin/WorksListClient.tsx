'use client'

import { useState, useTransition, useMemo } from 'react'
import Link from 'next/link'
import SortableList, { DragHandle, SortableProvider } from './SortableList'
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
  const [catItems, setCatItems] = useState<Record<string, Work[]>>(() =>
    Object.fromEntries(
      categories.map((cat) => [
        cat.id,
        works.filter((w) => w.category_id === cat.id),
      ])
    )
  )

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

  // Per-category save pending tracked via Set (avoids shared transition blocking all categories)
  const [pendingCatIds, setPendingCatIds] = useState<Set<string>>(new Set())
  const [orderErrors, setOrderErrors] = useState<Record<string, string>>({})

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
    const ids = Array.from(selectedIds)
    startBulkTransition(async () => {
      try {
        await bulkUpdatePublished(ids, published)
        setCatItems((prev) => {
          const next = { ...prev }
          for (const catId of Object.keys(next)) {
            next[catId] = next[catId].map((w) =>
              ids.includes(w.id) ? { ...w, published } : w
            )
          }
          return next
        })
        setSelectedIds(new Set())
      } catch {
        setBulkError('一括操作に失敗しました。もう一度お試しください。')
      }
    })
  }

  const handleSaveOrder = async (catId: string) => {
    setOrderErrors((prev) => ({ ...prev, [catId]: '' }))
    setPendingCatIds((prev) => new Set(prev).add(catId))
    try {
      await updateWorksOrder(catItems[catId].map((w) => w.id))
    } catch {
      setOrderErrors((prev) => ({
        ...prev,
        [catId]: '保存に失敗しました。もう一度お試しください。',
      }))
    } finally {
      setPendingCatIds((prev) => {
        const next = new Set(prev)
        next.delete(catId)
        return next
      })
    }
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
        const isSaving = pendingCatIds.has(cat.id)

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
            <SortableProvider
              items={items}
              onOrderChange={(ordered) =>
                setCatItems((prev) => ({ ...prev, [cat.id]: ordered }))
              }
            >
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
                    disabled={!hasChanged || isSaving}
                    className={styles.btn}
                  >
                    {isSaving ? '保存中...' : '順序を保存'}
                  </button>
                  {hasChanged && (
                    <button
                      onClick={() =>
                        setCatItems((prev) => ({
                          ...prev,
                          [cat.id]: works.filter((w) => w.category_id === cat.id),
                        }))
                      }
                      disabled={isSaving}
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
            </SortableProvider>
          </section>
        )
      })}
    </>
  )
}

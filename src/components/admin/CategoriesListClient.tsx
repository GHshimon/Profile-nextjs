'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import SortableList, { DragHandle, SortableProvider } from './SortableList'
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
      <SortableProvider items={items} onOrderChange={setItems}>
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
      </SortableProvider>

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

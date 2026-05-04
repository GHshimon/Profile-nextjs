import CategoryForm from '@/components/admin/CategoryForm'
import { createCategory } from '../actions'
import styles from '@/components/admin/admin.module.css'

export default function NewCategoryPage() {
  return (
    <>
      <h1 className={styles.heading}>カテゴリを新規作成</h1>
      <div className={styles.card}>
        <CategoryForm action={createCategory} submitLabel="作成" />
      </div>
    </>
  )
}

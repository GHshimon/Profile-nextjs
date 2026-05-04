import Link from 'next/link'
import styles from './admin.module.css'

type CategoryInitial = {
  slug: string
  name: string
  description: string
  order: number
}

type Props = {
  action: (formData: FormData) => Promise<void>
  initial?: CategoryInitial
  submitLabel: string
}

const empty: CategoryInitial = { slug: '', name: '', description: '', order: 0 }

export default function CategoryForm({ action, initial = empty, submitLabel }: Props) {
  return (
    <form action={action} className={styles.formGrid}>
      <div className={styles.formRow}>
        <label htmlFor="slug">slug</label>
        <input id="slug" name="slug" type="text" defaultValue={initial.slug} required />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="name">表示名</label>
        <input id="name" name="name" type="text" defaultValue={initial.name} required />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="description">説明</label>
        <textarea
          id="description"
          name="description"
          defaultValue={initial.description}
        />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="order">表示順</label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={initial.order}
        />
      </div>
      <div className={styles.actionRow}>
        <button type="submit" className={styles.btn}>
          {submitLabel}
        </button>
        <Link href="/admin/categories" className={`${styles.btn} ${styles.btnSecondary}`}>
          キャンセル
        </Link>
      </div>
    </form>
  )
}

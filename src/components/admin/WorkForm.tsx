import Link from 'next/link'
import ImageUploader from './ImageUploader'
import styles from './admin.module.css'

type WorkInitial = {
  category_id: string
  slug: string
  number: string
  title: string
  description: string
  detail: string
  tags: string[]
  color: string
  order: number
  published: boolean
  thumbnail_url: string | null
}

type CategoryOption = { id: string; name: string }

type Props = {
  action: (formData: FormData) => Promise<void>
  categories: CategoryOption[]
  initial?: WorkInitial
  submitLabel: string
}

const empty: WorkInitial = {
  category_id: '',
  slug: '',
  number: '',
  title: '',
  description: '',
  detail: '',
  tags: [],
  color: '#000000',
  order: 0,
  published: false,
  thumbnail_url: null,
}

export default function WorkForm({
  action,
  categories,
  initial = empty,
  submitLabel,
}: Props) {
  const isEdit = !!initial.number

  return (
    <form action={action} className={styles.formGrid}>
      <div className={styles.formRow}>
        <label htmlFor="title">タイトル</label>
        <input id="title" name="title" type="text" defaultValue={initial.title} required />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="category_id">カテゴリ</label>
        <select id="category_id" name="category_id" defaultValue={initial.category_id} required>
          <option value="" disabled>選択してください</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.formRow}>
        <label htmlFor="slug">
          slug
          {!isEdit && <span style={{ marginLeft: 8, fontSize: '0.8em', color: '#888' }}>（省略するとタイトルから自動生成）</span>}
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={initial.slug}
          pattern="[a-z0-9-]*"
          title="小文字英数字とハイフンのみ（空欄で自動生成）"
          placeholder={isEdit ? '' : 'タイトルから自動生成'}
          readOnly={isEdit}
        />
      </div>
      {isEdit && (
        <div className={styles.formRow}>
          <label>番号</label>
          <span style={{ padding: '6px 0', color: '#666' }}>{initial.number}</span>
        </div>
      )}
      <div className={styles.formRow}>
        <label htmlFor="description">概要（一覧カード用）</label>
        <input id="description" name="description" type="text" defaultValue={initial.description} />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="detail">詳細本文</label>
        <textarea id="detail" name="detail" defaultValue={initial.detail} />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="tags">タグ（カンマ区切り）</label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={initial.tags.join(', ')}
          placeholder="React, UI/UX"
        />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="color">アクセント色</label>
        <input id="color" name="color" type="text" defaultValue={initial.color} />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="order">表示順</label>
        <input id="order" name="order" type="number" defaultValue={initial.order} />
      </div>
      <ImageUploader name="thumbnail_url" initialUrl={initial.thumbnail_url} />
      <div className={styles.formRow}>
        <label htmlFor="published" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={initial.published}
          />
          公開する
        </label>
      </div>
      <div className={styles.actionRow}>
        <button type="submit" className={styles.btn}>
          {submitLabel}
        </button>
        <Link href="/admin/works" className={`${styles.btn} ${styles.btnSecondary}`}>
          キャンセル
        </Link>
      </div>
    </form>
  )
}

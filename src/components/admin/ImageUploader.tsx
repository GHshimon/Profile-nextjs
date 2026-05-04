'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import styles from './admin.module.css'

type Props = {
  name: string
  initialUrl?: string | null
}

export default function ImageUploader({ name, initialUrl }: Props) {
  const [url, setUrl] = useState<string>(initialUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const ext = file.name.split('.').pop() || 'bin'
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('works-thumbnails')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('works-thumbnails').getPublicUrl(path)
      setUrl(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.formRow}>
      <label>サムネイル画像</label>
      <input type="hidden" name={name} value={url} />
      {url && <img src={url} alt="thumbnail preview" className={styles.thumbPreview} />}
      <input type="file" accept="image/*" onChange={handleChange} disabled={uploading} />
      {uploading && <div>アップロード中…</div>}
      {error && <div className={styles.formError}>{error}</div>}
    </div>
  )
}

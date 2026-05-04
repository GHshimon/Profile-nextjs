'use client'

import { useTransition } from 'react'
import styles from './admin.module.css'

type Props = {
  action: () => Promise<void>
  confirmMessage: string
  label?: string
}

export default function DeleteButton({ action, confirmMessage, label = '削除' }: Props) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(confirmMessage)) return
    startTransition(async () => {
      await action()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`${styles.btn} ${styles.btnDanger}`}
    >
      {pending ? '削除中…' : label}
    </button>
  )
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function createCategory(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const payload = {
    slug: String(formData.get('slug') ?? '').trim().toLowerCase(),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? ''),
    order: Number(formData.get('order') ?? 0),
  }
  const { error } = await supabase.from('categories').insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
  revalidatePath('/works')
  redirect('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const payload = {
    slug: String(formData.get('slug') ?? '').trim().toLowerCase(),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? ''),
    order: Number(formData.get('order') ?? 0),
  }
  const { error } = await supabase.from('categories').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
  revalidatePath('/works')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
  revalidatePath('/works')
}

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

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

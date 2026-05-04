'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function buildPayload(formData: FormData) {
  return {
    category_id: String(formData.get('category_id') ?? ''),
    slug: String(formData.get('slug') ?? '').trim(),
    number: String(formData.get('number') ?? '').trim(),
    title: String(formData.get('title') ?? '').trim(),
    description: String(formData.get('description') ?? ''),
    detail: String(formData.get('detail') ?? ''),
    tags: parseTags(String(formData.get('tags') ?? '')),
    color: String(formData.get('color') ?? ''),
    order: Number(formData.get('order') ?? 0),
    published: formData.get('published') === 'on',
    thumbnail_url: String(formData.get('thumbnail_url') ?? '') || null,
  }
}

export async function createWork(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('works').insert(buildPayload(formData))
  if (error) throw new Error(error.message)
  revalidatePath('/admin/works')
  revalidatePath('/works')
  revalidatePath('/')
  redirect('/admin/works')
}

export async function updateWork(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('works').update(buildPayload(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/works')
  revalidatePath('/works')
  revalidatePath('/')
  redirect('/admin/works')
}

export async function deleteWork(id: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('works').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/works')
  revalidatePath('/works')
  revalidatePath('/')
}

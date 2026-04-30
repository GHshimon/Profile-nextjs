import { supabase } from '@/lib/supabase'
import WorkCard from './WorkCard'

export default async function Works({ limit }: { limit?: number }) {
  let query = supabase
    .from('works')
    .select('*, category:categories(slug)')
    .eq('published', true)
    .order('order')

  if (limit) query = query.limit(limit)

  const { data, error } = await query

  if (error || !data || data.length === 0) return null

  return (
    <section className="works" id="works">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="num">[ 02 ]</div>
          <h2>
            Selected <em>works.</em>
          </h2>
        </div>

        <div className="works-grid">
          {data.map((work: any, index: number) => (
            <WorkCard key={work.slug} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

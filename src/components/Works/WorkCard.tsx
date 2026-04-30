import Link from 'next/link'

type Work = {
  slug: string
  number: string
  title: string
  description: string
  tags: string[]
  color: string
  category: { slug: string }
}

const colorClasses = ['c1', 'c2', 'c3', 'c4']
const delayClasses = ['', 'd1', 'd2', 'd3']

export default function WorkCard({ work, index }: { work: Work; index: number }) {
  const colorClass = colorClasses[index % colorClasses.length]
  const delayClass = delayClasses[index % delayClasses.length]
  const className = ['card', colorClass, 'reveal', delayClass].filter(Boolean).join(' ')

  return (
    <Link
      href={`/works/${work.category.slug}/${work.slug}`}
      className={className}
    >
      <div className="thumb">
        <div className="stripes"></div>
        <span className="label">
          {work.number} / {work.category.slug.toUpperCase()}
        </span>
      </div>
      <div className="body">
        <h3>{work.title}</h3>
        <p>{work.description}</p>
        <div className="tags">
          {work.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="arrow">↗</div>
      </div>
    </Link>
  )
}

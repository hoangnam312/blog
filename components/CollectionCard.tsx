import Link from 'next/link'

const badgeLabel = {
  hooks: 'Hooks',
  principles: 'Principles',
}

export interface Collection {
  title: string
  description: string
  category: 'hooks' | 'principles'
  href: string
  count: number
}

export default function CollectionCard({ item }: { item: Collection }) {
  return (
    <Link
      href={item.href}
      className="group block p-6 bg-card border border-rim rounded-card hover:border-accent transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-dim text-accent">
          {badgeLabel[item.category]}
        </span>
        <span className="text-xs text-muted">
          {item.count} bài
        </span>
      </div>

      <h2 className="font-display font-semibold text-fg group-hover:text-accent transition-colors mb-1.5">
        {item.title}
      </h2>

      <p className="text-sm text-muted line-clamp-2">
        {item.description}
      </p>
    </Link>
  )
}

import Link from 'next/link'

const badgeStyle = {
  hooks: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  patterns: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
}

const badgeLabel = {
  hooks: 'Hooks',
  patterns: 'Patterns',
}

export interface Collection {
  title: string
  description: string
  category: 'hooks' | 'patterns'
  href: string
  count: number
}

export default function CollectionCard({ item }: { item: Collection }) {
  return (
    <Link
      href={item.href}
      className="group block p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeStyle[item.category]}`}>
          {badgeLabel[item.category]}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {item.count} bài
        </span>
      </div>

      <h2 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">
        {item.title}
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
        {item.description}
      </p>
    </Link>
  )
}

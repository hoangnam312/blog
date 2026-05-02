import Link from 'next/link'
import type { Metadata } from 'next'
import CollectionCard, { type Collection } from '@/components/CollectionCard'

export const metadata: Metadata = {
  title: 'React Handbook',
  description: 'Học React hooks và patterns từ cơ bản đến nâng cao — với ví dụ thực tế và live preview.',
}

const collections: Collection[] = [
  {
    title: 'React Hooks',
    description: 'useState, useEffect và các hooks thường dùng nhất — từ cơ bản đến nâng cao.',
    category: 'hooks',
    href: '/blog/hooks',
    count: 2,
  },
  {
    title: 'React Patterns',
    description: 'Compound Component, Render Props và các design patterns thực tế trong React.',
    category: 'patterns',
    href: '/blog/patterns',
    count: 2,
  },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
          Từ cơ bản đến nâng cao
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          React Handbook
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8">
          Tài liệu học React hooks và patterns theo 3 cấp độ — kèm code mẫu và live preview tương tác.
        </p>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Bắt đầu học
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </section>

      {/* Collections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chủ đề</h2>
          <Link href="/blog" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Xem blog →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map(item => (
            <CollectionCard key={item.href} item={item} />
          ))}
        </div>
      </section>
    </main>
  )
}

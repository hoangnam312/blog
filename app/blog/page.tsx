import type { Metadata } from 'next'
import Link from 'next/link'
import CollectionCard, { type Collection } from '@/components/CollectionCard'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tổng hợp các bài viết về React hooks và patterns từ cơ bản đến nâng cao.',
  openGraph: {
    title: 'Blog',
    description: 'Tổng hợp các bài viết về React hooks và patterns từ cơ bản đến nâng cao.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | React Handbook',
    description: 'Tổng hợp các bài viết về React hooks và patterns từ cơ bản đến nâng cao.',
  },
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

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 dark:text-slate-100 font-medium">Blog</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Blog</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Các bài viết về React hooks và design patterns với ví dụ thực tế.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map(item => (
          <CollectionCard key={item.href} item={item} />
        ))}
      </div>
    </main>
  )
}

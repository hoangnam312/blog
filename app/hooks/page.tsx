import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import useStateArticle from '@/content/hooks/use-state'
import useEffectArticle from '@/content/hooks/use-effect'

export const metadata: Metadata = {
  title: 'React Hooks',
  description: 'Tìm hiểu các React hooks phổ biến — useState, useEffect và nhiều hơn nữa, từ cơ bản đến nâng cao.',
  openGraph: {
    title: 'React Hooks',
    description: 'Tìm hiểu các React hooks phổ biến từ cơ bản đến nâng cao.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Hooks',
    description: 'Tìm hiểu các React hooks phổ biến từ cơ bản đến nâng cao.',
  },
}

const hooks = [useStateArticle, useEffectArticle]

export default function HooksPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 dark:text-slate-100 font-medium">Hooks</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">React Hooks</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Tổng hợp các React hooks với giải thích chi tiết và ví dụ thực tế.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {hooks.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </main>
  )
}

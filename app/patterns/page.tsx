import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import compoundArticle from '@/content/patterns/compound-component'
import renderPropsArticle from '@/content/patterns/render-props'

export const metadata: Metadata = {
  title: 'React Patterns',
  description: 'Tổng hợp các React design patterns — Compound Component, Render Props và nhiều pattern thực tế.',
  openGraph: {
    title: 'React Patterns',
    description: 'Tổng hợp các React design patterns thực tế.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Patterns',
    description: 'Tổng hợp các React design patterns thực tế.',
  },
}

const patterns = [compoundArticle, renderPropsArticle]

export default function PatternsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 dark:text-slate-100 font-medium">Patterns</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">React Patterns</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Các design patterns giúp xây dựng component linh hoạt, dễ tái sử dụng và dễ bảo trì.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {patterns.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </main>
  )
}

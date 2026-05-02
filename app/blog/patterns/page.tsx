import type { Metadata } from 'next'
import Link from 'next/link'
import { highlight } from '@/lib/highlight'
import ArticleSection from '@/components/ArticleSection'
import compoundArticle from '@/content/patterns/compound-component'
import renderPropsArticle from '@/content/patterns/render-props'
import { DOMAIN } from '@/utils/constant'

export const metadata: Metadata = {
  title: 'React Patterns',
  description: 'Hướng dẫn đầy đủ về Compound Component và Render Props — các design patterns thực tế trong React.',
  alternates: { canonical: '/blog/patterns' },
  openGraph: {
    title: 'React Patterns',
    description: 'Hướng dẫn đầy đủ về Compound Component và Render Props.',
    type: 'website',
    url: '/blog/patterns',
    siteName: 'React Handbook',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Patterns | React Handbook',
    description: 'Hướng dẫn đầy đủ về Compound Component và Render Props.',
  },
}

const articles = [compoundArticle, renderPropsArticle]

export default async function PatternsPage() {
  const allCodeHtmls = await Promise.all(
    articles.map(article =>
      Promise.all(article.levels.map(level => highlight(level.code, level.language)))
    )
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'React Patterns',
    description: metadata.description,
    author: { '@type': 'Person', name: 'React Handbook' },
    url: `${DOMAIN}/blog/patterns`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-900 dark:text-slate-100 font-medium">Patterns</li>
          </ol>
        </nav>

        <header className="mb-12">
          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 mb-3">
            Patterns
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            React Patterns
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Các design patterns giúp xây dựng component linh hoạt và dễ tái sử dụng.
          </p>
        </header>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {articles.map((article, i) => (
            <div key={article.slug} className="py-10 first:pt-0 last:pb-0">
              <ArticleSection article={article} codeHtmls={allCodeHtmls[i]} />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

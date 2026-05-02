import type { Metadata } from 'next'
import Link from 'next/link'
import { highlight } from '@/lib/highlight'
import ArticleSection from '@/components/ArticleSection'
import useStateArticle from '@/content/hooks/use-state'
import useEffectArticle from '@/content/hooks/use-effect'
import { DOMAIN } from '@/utils/constant'

export const metadata: Metadata = {
  title: 'React Hooks',
  description: 'Hướng dẫn đầy đủ về useState, useEffect từ cơ bản đến nâng cao — với ví dụ thực tế và live preview.',
  alternates: { canonical: '/blog/hooks' },
  openGraph: {
    title: 'React Hooks',
    description: 'Hướng dẫn đầy đủ về useState, useEffect từ cơ bản đến nâng cao.',
    type: 'website',
    url: '/blog/hooks',
    siteName: 'React Handbook',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Hooks | React Handbook',
    description: 'Hướng dẫn đầy đủ về useState, useEffect từ cơ bản đến nâng cao.',
  },
}

const articles = [useStateArticle, useEffectArticle]

export default async function HooksPage() {
  const allCodeHtmls = await Promise.all(
    articles.map(article =>
      Promise.all(article.levels.map(level => highlight(level.code, level.language)))
    )
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'React Hooks',
    description: metadata.description,
    author: { '@type': 'Person', name: 'React Handbook' },
    url: `${DOMAIN}/blog/hooks`,
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
            <li className="text-slate-900 dark:text-slate-100 font-medium">Hooks</li>
          </ol>
        </nav>

        <header className="mb-12">
          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 mb-3">
            Hooks
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            React Hooks
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Hướng dẫn đầy đủ về các React hooks từ cơ bản đến nâng cao.
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

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
    siteName: 'Hoàng Nam',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Hooks | Hoàng Nam',
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
    author: { '@type': 'Person', name: 'Hoàng Nam' },
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
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-fg transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-fg transition-colors">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-fg font-medium">Hooks</li>
          </ol>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-fg">
            React Hooks
          </h1>
        </header>

        <div className="divide-y divide-rim">
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

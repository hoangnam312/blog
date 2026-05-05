import type { Metadata } from 'next'
import Link from 'next/link'
import { highlight, highlightExplanation } from '@/lib/highlight'
import ArticleSection from '@/components/ArticleSection'
import article from '@/content/hooks/use-effect'
import { DOMAIN } from '@/utils/constant'

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: '/blog/hooks/use-effect' },
  openGraph: {
    title: article.title,
    description: article.description,
    type: 'article',
    url: '/blog/hooks/use-effect',
    siteName: 'Hoàng Nam',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${article.title} | Hoàng Nam`,
    description: article.description,
  },
}

export default async function UseEffectPage() {
  const [codeHtmls, explanationHtmls] = await Promise.all([
    Promise.all(article.levels.map(level => highlight(level.code, level.language))),
    Promise.all(article.levels.map(level => highlightExplanation(level.explanation))),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: 'Hoàng Nam' },
    url: `${DOMAIN}/blog/hooks/use-effect`,
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
            <li><Link href="/blog/hooks" className="hover:text-fg transition-colors">Hooks</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-fg font-medium">useEffect</li>
          </ol>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-dim text-accent">
              Hook
            </span>
            <time className="text-xs text-muted" dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-fg mb-3">
            {article.title}
          </h1>
          <p className="text-muted text-lg">{article.description}</p>
        </header>

        <ArticleSection
          article={article}
          codeHtmls={codeHtmls}
          explanationHtmls={explanationHtmls}
          hideHeader
        />
      </main>
    </>
  )
}

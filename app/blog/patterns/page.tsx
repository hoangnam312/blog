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
    siteName: 'Hoàng Nam',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Patterns | Hoàng Nam',
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
    author: { '@type': 'Person', name: 'Hoàng Nam' },
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
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-fg transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-fg transition-colors">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-fg font-medium">Patterns</li>
          </ol>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-fg">
            React Patterns
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

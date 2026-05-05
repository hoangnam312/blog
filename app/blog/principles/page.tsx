import type { Metadata } from 'next'
import Link from 'next/link'
import ccpArticle from '@/content/principles/ccp'

export const metadata: Metadata = {
  title: 'Principles',
  description: 'Các bộ tiêu chí thiết kế component common trong React.',
  alternates: { canonical: '/blog/principles' },
  openGraph: {
    title: 'Principles',
    description: 'Các bộ tiêu chí thiết kế component common trong React.',
    type: 'website',
    url: '/blog/principles',
    siteName: 'Hoàng Nam',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Principles | Hoàng Nam',
    description: 'Các bộ tiêu chí thiết kế component common trong React.',
  },
}

const articles = [
  { article: ccpArticle, href: '/blog/principles/ccp' },
]

export default function PrinciplesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-fg transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="hover:text-fg transition-colors">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-fg font-medium">Principles</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-fg">Principles</h1>
      </header>

      <div className="divide-y divide-rim">
        {articles.map(({ article, href }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-1.5 py-6 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-dim text-accent">
                Principles
              </span>
              <time className="text-xs text-muted" dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h2 className="text-lg font-semibold font-display text-fg group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            <p className="text-sm text-muted">{article.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

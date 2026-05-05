import type { Metadata } from 'next'
import Link from 'next/link'
import useStateArticle from '@/content/hooks/use-state'
import useEffectArticle from '@/content/hooks/use-effect'

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

const articles = [
  { article: useStateArticle, href: '/blog/hooks/use-state' },
  { article: useEffectArticle, href: '/blog/hooks/use-effect' },
]

export default function HooksPage() {
  return (
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

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-fg">React Hooks</h1>
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

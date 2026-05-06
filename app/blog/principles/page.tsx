import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCardList from '@/components/ArticleCardList'
import ccpVi from '@/content/principles/ccp'
import ccpEn from '@/content/principles/ccp.en'

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

const items = [
  {
    title: ccpVi.title,
    descriptionVi: ccpVi.description,
    descriptionEn: ccpEn.description,
    publishedAt: ccpVi.publishedAt,
    href: '/blog/principles/ccp',
    badge: 'Principles',
  },
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

      <ArticleCardList items={items} />
    </main>
  )
}

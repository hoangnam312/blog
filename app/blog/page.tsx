import type { Metadata } from 'next'
import Link from 'next/link'
import CollectionCard, { type Collection } from '@/components/CollectionCard'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tổng hợp các bài viết về React hooks và patterns từ cơ bản đến nâng cao.',
  alternates: {
    canonical: '/blog',
    languages: {
      vi: '/blog',
      en: '/blog',
      'x-default': '/blog',
    },
  },
  openGraph: {
    title: 'Blog',
    description: 'Tổng hợp các bài viết về React hooks và patterns từ cơ bản đến nâng cao.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Hoàng Nam',
    description: 'Tổng hợp các bài viết về React hooks và patterns từ cơ bản đến nâng cao.',
  },
}

const collections: Collection[] = [
  {
    title: 'React Hooks',
    description: 'useState, useEffect và các hooks thường dùng nhất — từ cơ bản đến nâng cao.',
    category: 'hooks',
    href: '/blog/hooks',
    count: 2,
  },
  {
    title: 'Principles',
    description: 'Bộ tiêu chí thiết kế component — lấy cảm hứng từ OOP, áp dụng cho React.',
    category: 'principles',
    href: '/blog/principles',
    count: 1,
  },
]

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-fg transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-fg font-medium">Blog</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold font-display text-fg">Blog</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map(item => (
          <CollectionCard key={item.href} item={item} />
        ))}
      </div>
    </main>
  )
}

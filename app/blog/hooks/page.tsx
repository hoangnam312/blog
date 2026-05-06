import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCardList from '@/components/ArticleCardList'
import useStateVi from '@/content/hooks/use-state'
import useEffectVi from '@/content/hooks/use-effect'
import useStateEn from '@/content/hooks/use-state.en'
import useEffectEn from '@/content/hooks/use-effect.en'

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

const items = [
  {
    title: useStateVi.title,
    descriptionVi: useStateVi.description,
    descriptionEn: useStateEn.description,
    publishedAt: useStateVi.publishedAt,
    href: '/blog/hooks/use-state',
    badge: 'Hook',
  },
  {
    title: useEffectVi.title,
    descriptionVi: useEffectVi.description,
    descriptionEn: useEffectEn.description,
    publishedAt: useEffectVi.publishedAt,
    href: '/blog/hooks/use-effect',
    badge: 'Hook',
  },
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

      <ArticleCardList items={items} />
    </main>
  )
}

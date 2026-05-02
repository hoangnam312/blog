import type { Metadata } from 'next'
import CollectionCard, { type Collection } from '@/components/CollectionCard'

export const metadata: Metadata = {
  title: 'Hoàng Nam',
  description: 'Blog về React hooks và patterns.',
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
    title: 'React Patterns',
    description: 'Compound Component, Render Props và các design patterns thực tế trong React.',
    category: 'patterns',
    href: '/blog/patterns',
    count: 2,
  },
]

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="animate-fade-up font-display font-extrabold tracking-tight">
        <span className="block text-base font-normal text-muted tracking-normal mb-1">
          I'm
        </span>
        <span className="block text-6xl sm:text-7xl bg-gradient-to-r from-[#630ed4] to-[#7c3aed] dark:from-[#d2bbff] dark:to-[#e9dbff] bg-clip-text text-transparent leading-tight">
          Hoàng Nam
        </span>
      </h1>
      <h2 className="animate-fade-up-delayed mt-4 text-base sm:text-lg font-mono text-muted">
        I'm a developer<span className="animate-blink text-accent ml-0.5">_</span>
      </h2>

      <h3 className="text-2xl font-semibold font-display text-fg mt-12 mb-6">Blog</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map(item => (
          <CollectionCard key={item.href} item={item} />
        ))}
      </div>
    </main>
  )
}

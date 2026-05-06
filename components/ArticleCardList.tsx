'use client'

import Link from 'next/link'
import FormattedDate from './FormattedDate'
import { useLanguage } from '@/lib/i18n'

export interface BilingualCard {
  title: string
  descriptionVi: string
  descriptionEn: string
  publishedAt: string
  href: string
  badge: string
}

export default function ArticleCardList({ items }: { items: BilingualCard[] }) {
  const { lang } = useLanguage()

  return (
    <div className="divide-y divide-rim">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-1.5 py-6 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-dim text-accent">
              {item.badge}
            </span>
            <FormattedDate dateTime={item.publishedAt} />
          </div>
          <h2 className="text-lg font-semibold font-display text-fg group-hover:text-accent transition-colors">
            {item.title}
          </h2>
          <p className="text-sm text-muted">
            {lang === 'en' ? item.descriptionEn : item.descriptionVi}
          </p>
        </Link>
      ))}
    </div>
  )
}

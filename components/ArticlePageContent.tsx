'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import FormattedDate from './FormattedDate'
import ArticleSection from './ArticleSection'
import { useLanguage } from '@/lib/i18n'
import type { Article } from '@/lib/types'

interface Crumb {
  label: string
  href?: string
}

interface ArticlePageContentProps {
  articleVi: Article
  articleEn: Article
  codeHtmls: string[]
  explanationHtmlsVi: string[]
  explanationHtmlsEn: string[]
  breadcrumbs: Crumb[]
}

export default function ArticlePageContent({
  articleVi,
  articleEn,
  codeHtmls,
  explanationHtmlsVi,
  explanationHtmlsEn,
  breadcrumbs,
}: ArticlePageContentProps) {
  const { lang, t } = useLanguage()
  const article = lang === 'en' ? articleEn : articleVi
  const explanationHtmls = lang === 'en' ? explanationHtmlsEn : explanationHtmlsVi

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted">
          {breadcrumbs.map((crumb, i) => (
            <Fragment key={crumb.label}>
              {i > 0 && <li aria-hidden="true">/</li>}
              <li>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-fg transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-fg font-medium">{crumb.label}</span>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-dim text-accent">
            {t.categoryLabel[article.category]}
          </span>
          <FormattedDate dateTime={article.publishedAt} />
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
  )
}

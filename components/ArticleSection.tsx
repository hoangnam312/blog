'use client'

import LevelAccordion from './LevelAccordion'
import FormattedDate from './FormattedDate'
import { useLanguage } from '@/lib/i18n'
import type { Article } from '@/lib/types'

interface ArticleSectionProps {
  article: Article
  articleEn?: Article
  codeHtmls: string[]
  codeHtmlsEn?: string[]
  explanationHtmls?: string[]
  explanationHtmlsEn?: string[]
  hideHeader?: boolean
}

export default function ArticleSection({ article, articleEn, codeHtmls, codeHtmlsEn, explanationHtmls, explanationHtmlsEn, hideHeader }: ArticleSectionProps) {
  const { lang, t } = useLanguage()
  const activeArticle = (lang === 'en' && articleEn) ? articleEn : article
  const activeCodes = (lang === 'en' && codeHtmlsEn?.length) ? codeHtmlsEn : codeHtmls
  const activeExplanationHtmls = (lang === 'en' && explanationHtmlsEn?.length) ? explanationHtmlsEn : explanationHtmls

  return (
    <section aria-labelledby={`section-${activeArticle.slug}`} className="mb-12 last:mb-0">
      {!hideHeader && (
        <header className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-dim text-accent">
              {t.categoryLabel[activeArticle.category]}
            </span>
            <FormattedDate dateTime={activeArticle.publishedAt} />
          </div>
          <h2
            id={`section-${activeArticle.slug}`}
            className="text-2xl font-bold font-display text-fg mb-2"
          >
            {activeArticle.title}
          </h2>
          <p className="text-muted">{activeArticle.description}</p>
        </header>
      )}

      <div className="space-y-3">
        {activeArticle.levels.map((level, i) => (
          <LevelAccordion
            key={level.badge}
            level={level}
            codeHtml={activeCodes[i]}
            explanationHtml={activeExplanationHtmls?.[i]}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </section>
  )
}

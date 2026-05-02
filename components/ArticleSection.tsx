import LevelAccordion from './LevelAccordion'
import type { Article } from '@/lib/types'

const categoryLabel: Record<Article['category'], string> = {
  hooks: 'Hook',
  patterns: 'Pattern',
}

interface ArticleSectionProps {
  article: Article
  codeHtmls: string[]
}

export default function ArticleSection({ article, codeHtmls }: ArticleSectionProps) {
  return (
    <section aria-labelledby={`section-${article.slug}`} className="mb-12 last:mb-0">
      <header className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-dim text-accent">
            {categoryLabel[article.category]}
          </span>
          <time className="text-xs text-muted" dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <h2
          id={`section-${article.slug}`}
          className="text-2xl font-bold font-display text-fg mb-2"
        >
          {article.title}
        </h2>
        <p className="text-muted">{article.description}</p>
      </header>

      <div className="space-y-3">
        {article.levels.map((level, i) => (
          <LevelAccordion
            key={level.badge}
            level={level}
            codeHtml={codeHtmls[i]}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </section>
  )
}

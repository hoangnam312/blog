import type { Metadata } from 'next'
import { highlight, highlightExplanation } from '@/lib/highlight'
import ArticlePageContent from '@/components/ArticlePageContent'
import articleVi from '@/content/hooks/use-state'
import articleEn from '@/content/hooks/use-state.en'
import { DOMAIN } from '@/utils/constant'

export const metadata: Metadata = {
  title: articleVi.title,
  description: articleVi.description,
  alternates: { canonical: '/blog/hooks/use-state' },
  openGraph: {
    title: articleVi.title,
    description: articleVi.description,
    type: 'article',
    url: '/blog/hooks/use-state',
    siteName: 'Hoàng Nam',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${articleVi.title} | Hoàng Nam`,
    description: articleVi.description,
  },
}

export default async function UseStatePage() {
  const [codeHtmls, explanationHtmlsVi, explanationHtmlsEn] = await Promise.all([
    Promise.all(articleVi.levels.map(level => highlight(level.code, level.language))),
    Promise.all(articleVi.levels.map(level => highlightExplanation(level.explanation))),
    Promise.all(articleEn.levels.map(level => highlightExplanation(level.explanation))),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: articleVi.title,
    description: articleVi.description,
    datePublished: articleVi.publishedAt,
    author: { '@type': 'Person', name: 'Hoàng Nam' },
    url: `${DOMAIN}/blog/hooks/use-state`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePageContent
        articleVi={articleVi}
        articleEn={articleEn}
        codeHtmls={codeHtmls}
        explanationHtmlsVi={explanationHtmlsVi}
        explanationHtmlsEn={explanationHtmlsEn}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Hooks', href: '/blog/hooks' },
          { label: 'useState' },
        ]}
      />
    </>
  )
}

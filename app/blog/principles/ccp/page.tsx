import type { Metadata } from 'next'
import { highlight, highlightExplanation } from '@/lib/highlight'
import CcpContent from '@/components/CcpContent'
import articleVi from '@/content/principles/ccp'
import articleEn from '@/content/principles/ccp.en'
import { DOMAIN } from '@/utils/constant'

export const metadata: Metadata = {
  title: articleVi.title,
  description: articleVi.description,
  alternates: {
    canonical: '/blog/principles/ccp',
    languages: {
      vi: '/blog/principles/ccp',
      en: '/blog/principles/ccp',
      'x-default': '/blog/principles/ccp',
    },
  },
  openGraph: {
    title: articleVi.title,
    description: articleVi.description,
    type: 'article',
    url: '/blog/principles/ccp',
    siteName: 'Hoàng Nam',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${articleVi.title} | Hoàng Nam`,
    description: articleVi.description,
  },
}

export default async function CcpPage() {
  const [badCodeHtmls, goodCodeHtmls, originHtmlVi, usageHtmlVi, forewordHtmlVi, originHtmlEn, usageHtmlEn, forewordHtmlEn] = await Promise.all([
    Promise.all(articleVi.principles.map(p => highlight(p.badCode, p.language))),
    Promise.all(articleVi.principles.map(p => highlight(p.goodCode, p.language))),
    highlightExplanation(articleVi.origin),
    highlightExplanation(articleVi.usage),
    articleVi.foreword ? highlightExplanation(articleVi.foreword) : Promise.resolve(null),
    highlightExplanation(articleEn.origin),
    highlightExplanation(articleEn.usage),
    articleEn.foreword ? highlightExplanation(articleEn.foreword) : Promise.resolve(null),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: articleVi.title,
    description: articleVi.description,
    datePublished: articleVi.publishedAt,
    inLanguage: ['vi', 'en'],
    author: { '@type': 'Person', name: 'Hoàng Nam' },
    url: `${DOMAIN}/blog/principles/ccp`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CcpContent
        articleVi={articleVi}
        articleEn={articleEn}
        badCodeHtmls={badCodeHtmls}
        goodCodeHtmls={goodCodeHtmls}
        originHtmlVi={originHtmlVi}
        originHtmlEn={originHtmlEn}
        usageHtmlVi={usageHtmlVi}
        usageHtmlEn={usageHtmlEn}
        forewordHtmlVi={forewordHtmlVi}
        forewordHtmlEn={forewordHtmlEn}
      />
    </>
  )
}

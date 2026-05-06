'use client'

import Link from 'next/link'
import PrinciplePairBlock from './PrinciplePairBlock'
import FormattedDate from './FormattedDate'
import { useLanguage } from '@/lib/i18n'
import type { PrinciplesPost } from '@/lib/types'

interface CcpContentProps {
  articleVi: PrinciplesPost
  articleEn: PrinciplesPost
  badCodeHtmls: string[]
  goodCodeHtmls: string[]
  originHtmlVi: string
  originHtmlEn: string
  usageHtmlVi: string
  usageHtmlEn: string
  forewordHtmlVi: string | null
  forewordHtmlEn: string | null
}

const proseClass = `prose prose-slate dark:prose-invert prose-sm max-w-none
  prose-headings:font-semibold
  prose-code:bg-rim-subtle prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
  [&_.shiki-wrapper]:not-prose`

export default function CcpContent({ articleVi, articleEn, badCodeHtmls, goodCodeHtmls, originHtmlVi, originHtmlEn, usageHtmlVi, usageHtmlEn, forewordHtmlVi, forewordHtmlEn }: CcpContentProps) {
  const { lang, t } = useLanguage()
  const article = lang === 'en' ? articleEn : articleVi
  const originHtml = lang === 'en' ? originHtmlEn : originHtmlVi
  const usageHtml = lang === 'en' ? usageHtmlEn : usageHtmlVi
  const forewordHtml = lang === 'en' ? forewordHtmlEn : forewordHtmlVi
  const ccp = t.ccp

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-fg transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="hover:text-fg transition-colors">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog/principles" className="hover:text-fg transition-colors">Principles</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-fg font-medium">CCP</li>
        </ol>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-dim text-accent">
            Principles
          </span>
          <FormattedDate dateTime={article.publishedAt} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-fg mb-3">
          {article.title}
        </h1>
        <p className="text-muted text-lg">{article.description}</p>
      </header>

      {forewordHtml && (
        <section aria-label={ccp.foreword} className="mb-12">
          <div className={proseClass} dangerouslySetInnerHTML={{ __html: forewordHtml }} />
          <hr className="border-rim mt-12" />
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-bold font-display text-fg mb-4">{ccp.origin}</h2>
        <div className={proseClass} dangerouslySetInnerHTML={{ __html: originHtml }} />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold font-display text-fg mb-4">{ccp.criteria}</h2>
        <div className="overflow-x-auto rounded-card border border-rim">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-raised border-b border-rim">
                <th className="text-left px-4 py-3 text-muted font-semibold w-8">#</th>
                <th className="text-left px-4 py-3 text-muted font-semibold">{ccp.thCriterion}</th>
                <th className="text-left px-4 py-3 text-muted font-semibold">{ccp.thOopOrigin}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rim">
              {article.principles.map(p => (
                <tr key={p.number} className="hover:bg-raised/50 transition-colors">
                  <td className="px-4 py-3 text-muted">{p.number}</td>
                  <td className="px-4 py-3">
                    <a href={`#principle-${p.number}`} className="font-semibold text-fg hover:text-accent transition-colors">
                      {p.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.oopOrigin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="space-y-16 mb-16">
        {article.principles.map((p, i) => (
          <section key={p.number} id={`principle-${p.number}`} aria-labelledby={`principle-${p.number}-heading`}>
            <div className="mb-5">
              <h2 id={`principle-${p.number}-heading`} className="text-xl font-bold font-display text-fg mb-1">
                {p.number}. {p.name}
              </h2>
              <p className="text-muted font-medium">&ldquo;{p.tagline}&rdquo;</p>
            </div>

            <p className="text-fg mb-4">{p.explanation}</p>

            <div className="flex items-start gap-2 px-4 py-3 bg-raised border border-rim rounded-card mb-6 text-sm">
              <span className="text-yellow-500 shrink-0 mt-0.5" aria-hidden="true">⚠</span>
              <p className="text-muted">
                <span className="font-semibold text-fg">{ccp.violationSign}:</span>{' '}
                {p.violationSign}
              </p>
            </div>

            <PrinciplePairBlock
              badHtml={badCodeHtmls[i]}
              goodHtml={goodCodeHtmls[i]}
              language={p.language}
            />
          </section>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold font-display text-fg mb-4">{ccp.usage}</h2>
        <div
          className={`${proseClass} prose-h3:text-base`}
          dangerouslySetInnerHTML={{ __html: usageHtml }}
        />
      </section>

      <section>
        <h2 className="text-xl font-bold font-display text-fg mb-4">{ccp.summary}</h2>
        <div className="overflow-x-auto rounded-card border border-rim">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-raised border-b border-rim">
                <th className="text-left px-4 py-3 text-muted font-semibold w-8">#</th>
                <th className="text-left px-4 py-3 text-muted font-semibold">{ccp.thCriterion}</th>
                <th className="text-left px-4 py-3 text-muted font-semibold">{ccp.thCheckQuestion}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rim">
              {article.principles.map(p => (
                <tr key={p.number} className="hover:bg-raised/50 transition-colors">
                  <td className="px-4 py-3 text-muted">{p.number}</td>
                  <td className="px-4 py-3 font-semibold text-fg">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.summaryQuestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

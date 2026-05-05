import type { Metadata } from 'next'
import Link from 'next/link'
import { highlight, highlightExplanation } from '@/lib/highlight'
import PrinciplePairBlock from '@/components/PrinciplePairBlock'
import article from '@/content/principles/ccp'
import { DOMAIN } from '@/utils/constant'

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: '/blog/principles/ccp' },
  openGraph: {
    title: article.title,
    description: article.description,
    type: 'article',
    url: '/blog/principles/ccp',
    siteName: 'Hoàng Nam',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${article.title} | Hoàng Nam`,
    description: article.description,
  },
}

export default async function CcpPage() {
  const [badCodeHtmls, goodCodeHtmls, originHtml, usageHtml, forewordHtml] = await Promise.all([
    Promise.all(article.principles.map(p => highlight(p.badCode, p.language))),
    Promise.all(article.principles.map(p => highlight(p.goodCode, p.language))),
    highlightExplanation(article.origin),
    highlightExplanation(article.usage),
    article.foreword ? highlightExplanation(article.foreword) : Promise.resolve(null),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: 'Hoàng Nam' },
    url: `${DOMAIN}/blog/principles/ccp`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <time className="text-xs text-muted" dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-fg mb-3">
            {article.title}
          </h1>
          <p className="text-muted text-lg">{article.description}</p>
        </header>

        {/* Foreword / Author's note */}
        {forewordHtml && (
          <section aria-label="Lời tác giả" className="mb-12">
            <div
              className="prose prose-slate dark:prose-invert prose-sm max-w-none
                prose-headings:font-semibold
                prose-code:bg-rim-subtle prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                [&_.shiki-wrapper]:not-prose"
              dangerouslySetInnerHTML={{ __html: forewordHtml }}
            />
            <hr className="border-rim mt-12" />
          </section>
        )}

        {/* Origin section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-display text-fg mb-4">Nguồn gốc tư tưởng</h2>
          <div
            className="prose prose-slate dark:prose-invert prose-sm max-w-none
              prose-headings:font-semibold
              prose-code:bg-rim-subtle prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              [&_.shiki-wrapper]:not-prose"
            dangerouslySetInnerHTML={{ __html: originHtml }}
          />
        </section>

        {/* Overview table */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-display text-fg mb-4">Bộ 8 tiêu chí</h2>
          <div className="overflow-x-auto rounded-card border border-rim">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-raised border-b border-rim">
                  <th className="text-left px-4 py-3 text-muted font-semibold w-8">#</th>
                  <th className="text-left px-4 py-3 text-muted font-semibold">Tiêu chí</th>
                  <th className="text-left px-4 py-3 text-muted font-semibold">Gốc từ OOP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rim">
                {article.principles.map(p => (
                  <tr key={p.number} className="hover:bg-raised/50 transition-colors">
                    <td className="px-4 py-3 text-muted">{p.number}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`#principle-${p.number}`}
                        className="font-semibold text-fg hover:text-accent transition-colors"
                      >
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

        {/* Principle sections */}
        <div className="space-y-16 mb-16">
          {article.principles.map((p, i) => (
            <section key={p.number} id={`principle-${p.number}`} aria-labelledby={`principle-${p.number}-heading`}>
              <div className="mb-5">
                <h2
                  id={`principle-${p.number}-heading`}
                  className="text-xl font-bold font-display text-fg mb-1"
                >
                  {p.number}. {p.name}
                </h2>
                <p className="text-muted font-medium">&ldquo;{p.tagline}&rdquo;</p>
              </div>

              <p className="text-fg mb-4">{p.explanation}</p>

              <div className="flex items-start gap-2 px-4 py-3 bg-raised border border-rim rounded-card mb-6 text-sm">
                <span className="text-yellow-500 shrink-0 mt-0.5" aria-hidden="true">⚠</span>
                <p className="text-muted">
                  <span className="font-semibold text-fg">Dấu hiệu vi phạm:</span>{' '}
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

        {/* Usage section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-display text-fg mb-4">Cách sử dụng CCP</h2>
          <div
            className="prose prose-slate dark:prose-invert prose-sm max-w-none
              prose-headings:font-semibold prose-h3:text-base
              prose-code:bg-rim-subtle prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              [&_.shiki-wrapper]:not-prose"
            dangerouslySetInnerHTML={{ __html: usageHtml }}
          />
        </section>

        {/* Summary table */}
        <section>
          <h2 className="text-xl font-bold font-display text-fg mb-4">Tóm tắt nhanh</h2>
          <div className="overflow-x-auto rounded-card border border-rim">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-raised border-b border-rim">
                  <th className="text-left px-4 py-3 text-muted font-semibold w-8">#</th>
                  <th className="text-left px-4 py-3 text-muted font-semibold">Tiêu chí</th>
                  <th className="text-left px-4 py-3 text-muted font-semibold">Câu hỏi kiểm tra</th>
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
    </>
  )
}

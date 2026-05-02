import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LevelAccordion from '@/components/LevelAccordion'
import { highlight } from '@/lib/highlight'
import useStateArticle from '@/content/hooks/use-state'
import useEffectArticle from '@/content/hooks/use-effect'
import type { Article } from '@/lib/types'
import { DOMAIN } from '@/utils/constant'

const articles: Record<string, Article> = {
  'use-state': useStateArticle,
  'use-effect': useEffectArticle,
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return Object.keys(articles).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = articles[slug]
  if (!article) return {}
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/hooks/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `/hooks/${slug}`,
      siteName: 'React Handbook',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

export default async function HookArticlePage({ params }: Props) {
  const { slug } = await params
  const article = articles[slug]
  if (!article) notFound()

  const codeHtmls = await Promise.all(
    article.levels.map(level => highlight(level.code, level.language))
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Person', name: 'React Handbook' },
    datePublished: article.publishedAt,
    url: `${DOMAIN}/hooks/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/hooks" className="hover:text-indigo-600 dark:hover:text-indigo-400">Hooks</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-900 dark:text-slate-100 font-medium">{article.title}</li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                Hook
              </span>
              <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              {article.title}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              {article.description}
            </p>
          </header>

          <section className="space-y-3" aria-label="Article levels">
            {article.levels.map((level, i) => (
              <LevelAccordion
                key={level.badge}
                level={level}
                codeHtml={codeHtmls[i]}
                defaultOpen={i === 0}
              />
            ))}
          </section>
        </article>
      </main>
    </>
  )
}

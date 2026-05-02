'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import LivePreview from './LivePreview'
import type { Level } from '@/lib/types'

const badgeStyle: Record<Level['badge'], string> = {
  'Cơ bản': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'Trung cấp': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  'Nâng cao': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

const panelId = (title: string, badge: string) =>
  `panel-${title.replace(/\s+/g, '-').toLowerCase()}-${badge}`

interface LevelAccordionProps {
  level: Level
  codeHtml: string
  defaultOpen: boolean
}

export default function LevelAccordion({ level, codeHtml, defaultOpen }: LevelAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const id = panelId(level.badge, level.language)

  return (
    <section className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-expanded={isOpen}
        aria-controls={id}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-left transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeStyle[level.badge]}`}>
            {level.badge}
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {level.badge === 'Cơ bản' && 'Kiến thức cơ bản'}
            {level.badge === 'Trung cấp' && 'Nâng cao kỹ năng'}
            {level.badge === 'Nâng cao' && 'Chuyên sâu'}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 dark:text-slate-500 shrink-0"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 space-y-4">
              <div className="prose prose-slate dark:prose-invert prose-sm max-w-none
                prose-headings:font-semibold prose-h2:text-base prose-h3:text-sm
                prose-code:bg-slate-200 dark:prose-code:bg-slate-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {level.explanation}
                </ReactMarkdown>
              </div>

              <CodeBlock html={codeHtml} language={level.language} />

              {level.showLivePreview && level.sandpackCode && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Live Preview
                  </h3>
                  <LivePreview code={level.sandpackCode} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

'use client'

import CodeBlock from './CodeBlock'
import { useLanguage } from '@/lib/i18n'

interface PrinciplePairBlockProps {
  badHtml: string
  goodHtml: string
  language: string
}

export default function PrinciplePairBlock({ badHtml, goodHtml, language }: PrinciplePairBlockProps) {
  const { t } = useLanguage()
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1.5">
          {t.violation}
        </p>
        <CodeBlock html={badHtml} language={language} />
      </div>
      <div>
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1.5">
          {t.correct}
        </p>
        <CodeBlock html={goodHtml} language={language} />
      </div>
    </div>
  )
}

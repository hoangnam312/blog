'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Level, Article } from './types'

type Lang = 'vi' | 'en'

type Translations = {
  badges: Record<Level['badge'], string>
  violation: string
  correct: string
  articleCount: (n: number) => string
  livePreview: string
  categoryLabel: Record<Article['category'], string>
  ccp: {
    origin: string
    criteria: string
    usage: string
    summary: string
    violationSign: string
    foreword: string
    thCriterion: string
    thOopOrigin: string
    thCheckQuestion: string
  }
  collectionDesc: Record<string, string>
  dateLocale: string
}

const T: Record<Lang, Translations> = {
  vi: {
    badges: {
      'Cơ bản': 'Cơ bản',
      'Trung cấp': 'Trung cấp',
      'Nâng cao': 'Nâng cao',
    },
    violation: '❌ Vi phạm',
    correct: '✅ Đúng chuẩn',
    articleCount: (n) => `${n} bài`,
    livePreview: 'Live Preview',
    categoryLabel: { hooks: 'Hook', patterns: 'Pattern' },
    ccp: {
      origin: 'Nguồn gốc tư tưởng',
      criteria: 'Bộ 8 tiêu chí',
      usage: 'Cách sử dụng CCP',
      summary: 'Tóm tắt nhanh',
      violationSign: 'Dấu hiệu vi phạm',
      foreword: 'Lời tác giả',
      thCriterion: 'Tiêu chí',
      thOopOrigin: 'Gốc từ OOP',
      thCheckQuestion: 'Câu hỏi kiểm tra',
    },
    collectionDesc: {
      hooks: 'useState, useEffect và các hooks thường dùng nhất — từ cơ bản đến nâng cao.',
      principles: 'Bộ tiêu chí thiết kế component — lấy cảm hứng từ OOP, áp dụng cho React.',
    },
    dateLocale: 'vi-VN',
  },
  en: {
    badges: {
      'Cơ bản': 'Basic',
      'Trung cấp': 'Intermediate',
      'Nâng cao': 'Advanced',
    },
    violation: '❌ Violation',
    correct: '✅ Correct',
    articleCount: (n) => `${n} ${n === 1 ? 'article' : 'articles'}`,
    livePreview: 'Live Preview',
    categoryLabel: { hooks: 'Hook', patterns: 'Pattern' },
    ccp: {
      origin: 'Conceptual Origin',
      criteria: 'The 8 Criteria',
      usage: 'How to Use CCP',
      summary: 'Quick Summary',
      violationSign: 'Violation sign',
      foreword: "Author's Note",
      thCriterion: 'Criterion',
      thOopOrigin: 'OOP Origin',
      thCheckQuestion: 'Check Question',
    },
    collectionDesc: {
      hooks: 'useState, useEffect and the most common hooks — from basics to advanced.',
      principles: 'Component design criteria — inspired by OOP, applied to React.',
    },
    dateLocale: 'en-US',
  },
}

interface LanguageContextValue {
  lang: Lang
  t: Translations
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('vi')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'vi' || stored === 'en') {
      setLang(stored)
    } else {
      setLang(navigator.language.startsWith('en') ? 'en' : 'vi')
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  function toggle() {
    const next: Lang = lang === 'vi' ? 'en' : 'vi'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  return (
    <LanguageContext.Provider value={{ lang, t: T[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

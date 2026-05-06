'use client'

import { useLanguage } from '@/lib/i18n'

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage()
  return (
    <button
      onClick={toggle}
      aria-label={lang === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
      className="px-2.5 py-1 text-xs font-semibold text-muted hover:text-fg hover:bg-raised rounded-lg transition-colors"
    >
      {lang === 'vi' ? 'EN' : 'VI'}
    </button>
  )
}

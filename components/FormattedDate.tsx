'use client'

import { useLanguage } from '@/lib/i18n'

interface FormattedDateProps {
  dateTime: string
  className?: string
}

export default function FormattedDate({ dateTime, className = 'text-xs text-muted' }: FormattedDateProps) {
  const { t } = useLanguage()
  return (
    <time className={className} dateTime={dateTime}>
      {new Date(dateTime).toLocaleDateString(t.dateLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  )
}

export interface Level {
  badge: 'Cơ bản' | 'Trung cấp' | 'Nâng cao'
  explanation: string
  code: string
  language: string
  showLivePreview: boolean
  sandpackCode?: string
}

export interface Article {
  slug: string
  title: string
  description: string
  category: 'hooks' | 'patterns'
  publishedAt: string
  levels: [Level, Level, Level]
}

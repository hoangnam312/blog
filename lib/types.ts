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
  category: 'hooks'
  publishedAt: string
  levels: [Level, Level, Level]
}

export interface Principle {
  number: number
  name: string
  tagline: string
  oopOrigin: string
  explanation: string
  violationSign: string
  badCode: string
  goodCode: string
  language: string
  summaryQuestion: string
}

export interface PrinciplesPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  origin: string
  principles: Principle[]
  usage: string
  foreword?: string
}

import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import { DOMAIN } from '@/utils/constant'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | React Handbook',
    default: 'React Handbook',
  },
  description: 'Học React hooks và patterns từ cơ bản đến nâng cao',
  metadataBase: new URL(DOMAIN),
  openGraph: {
    siteName: 'React Handbook',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          {children}
          <footer className="mt-24 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-sm text-slate-500 dark:text-slate-400 text-center">
              © {new Date().getFullYear()} React Handbook · Built with Next.js &amp; Tailwind CSS
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

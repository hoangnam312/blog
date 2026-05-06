import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Manrope } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import { LanguageProvider } from '@/lib/i18n'
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

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Hoàng Nam',
    default: 'Hoàng Nam',
  },
  description: 'Blog về React hooks và patterns.',
  metadataBase: new URL(DOMAIN),
  openGraph: {
    siteName: 'Hoàng Nam',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${manrope.variable}`}>
      <body className="bg-canvas text-fg font-sans antialiased">
        <LanguageProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <footer className="mt-24 border-t border-rim">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-sm text-muted text-center">
                © {new Date().getFullYear()} Hoàng Nam
              </div>
            </footer>
          </div>
        </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

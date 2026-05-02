import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur border-b border-rim">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-muted hover:text-fg hover:bg-raised rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="px-3 py-1.5 text-sm font-medium text-muted hover:text-fg hover:bg-raised rounded-lg transition-colors"
          >
            Blog
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}

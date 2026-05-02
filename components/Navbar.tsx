import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg text-indigo-600 dark:text-indigo-400 tracking-tight"
        >
          React Handbook
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Blog
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

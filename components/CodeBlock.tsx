'use client'

import { useState } from 'react'

interface CodeBlockProps {
  html: string
  language: string
}

export default function CodeBlock({ html, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const pre = document.createElement('div')
    pre.innerHTML = html
    const text = pre.textContent ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-card overflow-hidden border border-rim my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-raised border-b border-rim">
        <span className="text-xs font-mono text-muted">
          {language}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="text-xs text-muted hover:text-fg flex items-center gap-1.5 transition-colors"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div
        className="overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:m-0 [&>pre]:overflow-x-auto shiki-wrapper"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

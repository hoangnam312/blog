'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import { defaultLight, defaultDark } from '@codesandbox/sandpack-react'

interface LivePreviewProps {
  code: string
}

export default function LivePreview({ code }: LivePreviewProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
        style={{ height: 320 }}
        aria-label="Loading live preview"
      />
    )
  }

  const sandpackTheme = theme === 'dark' ? defaultDark : defaultLight

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ minHeight: 320 }}>
      <SandpackProvider
        template="react"
        theme={sandpackTheme}
        files={{
          '/App.js': code,
        }}
        options={{ recompileMode: 'delayed', recompileDelay: 500 }}
      >
        <SandpackLayout>
          <SandpackCodeEditor style={{ height: 280 }} showLineNumbers />
          <SandpackPreview style={{ height: 280 }} showOpenInCodeSandbox={false} />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

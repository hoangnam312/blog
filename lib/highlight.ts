import { codeToHtml } from 'shiki'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { toHtml } from 'hast-util-to-html'

export async function highlight(code: string, lang: string): Promise<string> {
  return codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })
}

type HastNode = { type: string; [key: string]: unknown }
type HastElement = HastNode & {
  type: 'element'
  tagName: string
  properties: Record<string, unknown>
  children: HastNode[]
}

const LANG_MAP: Record<string, string> = {
  code: 'javascript',
  '':   'text',
}

async function processNode(node: HastNode): Promise<HastNode> {
  if (node.type !== 'element') return node
  const el = node as HastElement

  if (el.tagName === 'pre') {
    const codeEl = el.children?.find(
      (c): c is HastElement => c.type === 'element' && (c as HastElement).tagName === 'code'
    )
    if (codeEl) {
      const classes = (codeEl.properties.className as string[] | undefined) ?? []
      const langClass = classes.find(c => c.startsWith('language-'))
      const rawLang = langClass ? langClass.replace('language-', '') : ''
      const lang = LANG_MAP[rawLang] ?? rawLang

      const text = (codeEl.children ?? [])
        .filter(c => c.type === 'text')
        .map(c => c.value as string)
        .join('')

      const shikiHtml = lang === 'text'
        ? `<pre class="shiki" style="background:#f6f8fa"><code>${text}</code></pre>`
        : await highlight(text.trim(), lang)

      return {
        type: 'raw',
        value: `<div class="shiki-wrapper my-4 rounded-card overflow-hidden border border-rim">${shikiHtml}</div>`,
      }
    }
  }

  if (el.children?.length) {
    el.children = await Promise.all(el.children.map(processNode))
  }
  return el
}

export async function highlightExplanation(explanation: string): Promise<string> {
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(explanation)
  const hast = await unified().use(remarkRehype).run(mdast) as unknown as HastElement

  hast.children = await Promise.all(hast.children.map(processNode))

  return toHtml(hast as never, { allowDangerousHtml: true })
}

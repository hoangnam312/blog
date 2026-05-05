import CodeBlock from './CodeBlock'

interface PrinciplePairBlockProps {
  badHtml: string
  goodHtml: string
  language: string
}

export default function PrinciplePairBlock({ badHtml, goodHtml, language }: PrinciplePairBlockProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1.5">
          ❌ Vi phạm
        </p>
        <CodeBlock html={badHtml} language={language} />
      </div>
      <div>
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1.5">
          ✅ Đúng chuẩn
        </p>
        <CodeBlock html={goodHtml} language={language} />
      </div>
    </div>
  )
}

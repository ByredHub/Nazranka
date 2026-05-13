import Image from 'next/image'
import type { TiptapNode, TiptapMark } from '@/lib/types'

interface TiptapRendererProps {
  content: TiptapNode
}

/**
 * Серверный компонент для рендера Tiptap JSON в HTML.
 * Рекурсивный подход — без зависимости от Tiptap.
 * SECURITY: нет dangerouslySetInnerHTML, все строки экранируются React автоматически.
 */
export function TiptapRenderer({ content }: TiptapRendererProps) {
  if (!content || !content.content) {
    return null
  }

  return (
    <div className="article-body">
      {content.content.map((node, index) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  )
}

function RenderNode({ node }: { node: TiptapNode }) {
  if (node.type === 'text') {
    return <RenderText text={node.text || ''} marks={node.marks} />
  }

  const children = node.content?.map((child, index) => (
    <RenderNode key={index} node={child} />
  ))

  switch (node.type) {
    case 'paragraph':
      return <p>{children}</p>

    case 'heading': {
      const level = (node.attrs?.level as number) || 2
      const safeLevel = Math.min(Math.max(level, 2), 6)
      if (safeLevel === 2) return <h2>{children}</h2>
      if (safeLevel === 3) return <h3>{children}</h3>
      if (safeLevel === 4) return <h4>{children}</h4>
      if (safeLevel === 5) return <h5>{children}</h5>
      return <h6>{children}</h6>
    }

    case 'bulletList':
      return <ul>{children}</ul>

    case 'orderedList':
      return <ol>{children}</ol>

    case 'listItem':
      return <li>{children}</li>

    case 'blockquote':
      return <blockquote>{children}</blockquote>

    case 'codeBlock':
      return (
        <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4">
          <code>{children}</code>
        </pre>
      )

    case 'image': {
      const src = node.attrs?.src as string
      const alt = (node.attrs?.alt as string) || ''
      if (!src) return null

      // SECURITY: проверяем что URL начинается с https
      if (!src.startsWith('https://')) {
        return <p className="text-gray-400 italic">[Изображение недоступно]</p>
      }

      return (
        <Image
          src={src}
          alt={alt}
          width={800}
          height={450}
          className="rounded-lg my-4 max-w-full h-auto"
        />
      )
    }

    case 'hardBreak':
      return <br />

    case 'horizontalRule':
      return <hr className="my-6 border-gray-200" />

    default:
      // Неизвестный тип — рендерим children если есть
      return children ? <>{children}</> : null
  }
}

function RenderText({ text, marks }: { text: string; marks?: TiptapMark[] }) {
  if (!marks || marks.length === 0) {
    return <>{text}</>
  }

  let result: React.ReactNode = text

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        result = <strong>{result}</strong>
        break
      case 'italic':
        result = <em>{result}</em>
        break
      case 'underline':
        result = <u>{result}</u>
        break
      case 'strike':
        result = <s>{result}</s>
        break
      case 'code':
        result = <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{result}</code>
        break
      case 'link': {
        const href = mark.attrs?.href as string
        // SECURITY: только http/https ссылки, предотвращаем javascript: XSS
        if (href && (href.startsWith('https://') || href.startsWith('http://') || href.startsWith('/'))) {
          result = (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {result}
            </a>
          )
        }
        break
      }
    }
  }

  return <>{result}</>
}

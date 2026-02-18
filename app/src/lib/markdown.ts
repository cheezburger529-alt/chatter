import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export function renderMarkdown(input: string) {
  const raw = marked.parse(input)
  return DOMPurify.sanitize(raw)
}

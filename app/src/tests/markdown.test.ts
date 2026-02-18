import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../lib/markdown'

describe('markdown', () => {
  it('renders bold text', () => {
    const html = renderMarkdown('**bold**')
    expect(html).toContain('<strong>')
  })
})

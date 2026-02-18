import { describe, expect, it } from 'vitest'
import { canManageServer } from '../lib/permissions'

describe('permissions', () => {
  it('allows admins and mods', () => {
    expect(canManageServer('admin')).toBe(true)
    expect(canManageServer('mod')).toBe(true)
    expect(canManageServer('member')).toBe(false)
  })
})

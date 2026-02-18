export type Role = 'admin' | 'mod' | 'member'

export function canManageServer(role?: Role) {
  return role === 'admin' || role === 'mod'
}

import { Command } from 'cmdk'
import { useEffect, useState } from 'react'

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return (
    <div className={open ? 'fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6' : 'hidden'}>
      <Command className="w-full max-w-lg rounded-2xl border border-white/10 bg-base-850 p-4 text-slate-100">
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Jump to channel or DM"
          className="w-full rounded-xl border border-white/10 bg-base-900 px-3 py-2 text-sm"
          onKeyDown={(event) => {
            if (event.key === 'Escape') onOpenChange(false)
          }}
        />
        <Command.List className="mt-3 max-h-64 overflow-auto text-sm">
          <Command.Empty className="text-slate-400">No matches.</Command.Empty>
          <Command.Item className="rounded-lg px-3 py-2 hover:bg-base-700"># lounge</Command.Item>
          <Command.Item className="rounded-lg px-3 py-2 hover:bg-base-700"># product</Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}

export function Brand() {
  return (
    <div className="flex items-center gap-2 text-base font-semibold text-white">
      <span className="h-9 w-9 rounded-2xl bg-brand-600/90 shadow-glow" aria-hidden="true" />
      <div className="leading-tight">
        <p className="font-display text-lg tracking-tight">Chatter</p>
        <p className="text-xs text-slate-300">Build the room you want</p>
      </div>
    </div>
  )
}

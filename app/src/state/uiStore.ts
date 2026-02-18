import { create } from 'zustand'

type PanelState = {
  showMembers: boolean
  showChannels: boolean
  toggleMembers: () => void
  toggleChannels: () => void
  closePanels: () => void
}

export const usePanelStore = create<PanelState>((set) => ({
  showMembers: true,
  showChannels: true,
  toggleMembers: () => set((state) => ({ showMembers: !state.showMembers })),
  toggleChannels: () => set((state) => ({ showChannels: !state.showChannels })),
  closePanels: () => set({ showMembers: false, showChannels: false }),
}))

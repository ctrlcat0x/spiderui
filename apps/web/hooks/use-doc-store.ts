import { create } from 'zustand'

interface DocStore {
  activeVariantIndex: number
  setActiveVariantIndex: (index: number) => void
  isPreviewExpanded: boolean
  setPreviewExpanded: (expanded: boolean) => void
}

export const useDocStore = create<DocStore>((set) => ({
  activeVariantIndex: -1,
  setActiveVariantIndex: (index) => set({ activeVariantIndex: index }),
  isPreviewExpanded: false,
  setPreviewExpanded: (expanded) => set({ isPreviewExpanded: expanded }),
}))

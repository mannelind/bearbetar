'use client'

import { create } from 'zustand'

type WidgetType = 'mobile-menu' | 'draggable-mobile-menu' | 'accessibility' | null

interface MobileWidgetState {
  activeWidget: WidgetType
  setActiveWidget: (widget: WidgetType) => void
  closeAll: () => void
}

export const useMobileWidgetState = create<MobileWidgetState>((set) => ({
  activeWidget: null,
  setActiveWidget: (widget) => set({ activeWidget: widget }),
  closeAll: () => set({ activeWidget: null }),
}))
// ════════════════════════════════════════
// store/compareStore.ts
// Side-by-side plot compare (max 4)
// Port of js/plot-compare.js
// ════════════════════════════════════════
import { create } from 'zustand';
import type { PlotPoint } from '@/types/plot';

export const MAX_COMPARE = 4;

interface CompareState {
  items: PlotPoint[];
  add: (plot: PlotPoint) => 'added' | 'exists' | 'full';
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],
  add: (plot) => {
    const { items } = get();
    if (items.find((p) => p.id === plot.id)) return 'exists';
    if (items.length >= MAX_COMPARE) return 'full';
    set({ items: [...items, plot] });
    return 'added';
  },
  remove: (id) => set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
  clear: () => set({ items: [] }),
  has: (id) => !!get().items.find((p) => p.id === id),
}));

// ════════════════════════════════════════
// store/heatmapStore.ts
// Phase 3 #9 — toggle heatmap layer
// ════════════════════════════════════════
import { create } from 'zustand';

interface HeatmapState {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
}

export const useHeatmapStore = create<HeatmapState>((set) => ({
  enabled: false,
  toggle: () => set((s) => ({ enabled: !s.enabled })),
  setEnabled: (enabled) => set({ enabled }),
}));

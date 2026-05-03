// ════════════════════════════════════════
// src/store/govLayersStore.ts
// Active government overlay layers + global opacity
// ════════════════════════════════════════
import { create } from 'zustand';
import type { GovLayerKey } from '@/lib/gov-layers';

interface GovLayersState {
  active: Record<GovLayerKey, boolean>;
  opacity: number; // 0..1
  toggle: (key: GovLayerKey) => void;
  setOpacity: (o: number) => void;
}

const initialActive: Record<GovLayerKey, boolean> = {
  landuse: false,
  cityplan_bkk: false,
  parcel: false,
  forest: false,
  geology: false,
  soil: false,
};

export const useGovLayersStore = create<GovLayersState>((set) => ({
  active: initialActive,
  opacity: 0.6,
  toggle: (key) =>
    set((s) => ({ active: { ...s.active, [key]: !s.active[key] } })),
  setOpacity: (o) => set({ opacity: Math.max(0, Math.min(1, o)) }),
}));

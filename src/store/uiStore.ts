// ════════════════════════════════════════
// store/uiStore.ts
// Drawer / Modal open states + Plot edit target
// ════════════════════════════════════════
import { create } from 'zustand';
import type { PlotPoint, PlotType } from '@/types/plot';

/** Either an existing plot (id present) or a draft from map click/draw */
export type EditingPlot =
  | { mode: 'edit'; plot: PlotPoint }
  | { mode: 'create'; type: PlotType; lat: number; lng: number;
      areaSqm?: number; polygon?: { lat: number; lng: number }[] };

type DrawMode = null | 'land' | 'polygon';

interface UIState {
  drawerOpen: boolean;
  loginOpen: boolean;
  filterOpen: boolean;
  editingPlot: EditingPlot | null;
  drawMode: DrawMode;
  setDrawerOpen: (v: boolean) => void;
  setLoginOpen: (v: boolean) => void;
  setFilterOpen: (v: boolean) => void;
  setEditingPlot: (p: EditingPlot | null) => void;
  setDrawMode: (m: DrawMode) => void;
  toggleDrawer: () => void;
  toggleFilter: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  loginOpen: false,
  filterOpen: false,
  editingPlot: null,
  drawMode: null,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  setLoginOpen: (loginOpen) => set({ loginOpen }),
  setFilterOpen: (filterOpen) => set({ filterOpen }),
  setEditingPlot: (editingPlot) => set({ editingPlot }),
  setDrawMode: (drawMode) => set({ drawMode }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  toggleFilter: () => set((s) => ({ filterOpen: !s.filterOpen })),
}));

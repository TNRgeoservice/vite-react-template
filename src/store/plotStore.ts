// ════════════════════════════════════════
// store/plotStore.ts
// Plots collection + filters
// filters → persist ใน localStorage (ครั้งแรกบังคับเลือกจังหวัด,
// ครั้งถัดไปใช้กรองเดิมจากครั้งล่าสุด)
// ════════════════════════════════════════
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PlotPoint, PlotStatus } from '@/types/plot';

type MapFilter = 'all' | PlotStatus;
type SearchFilter = 'all' | 'land' | 'road';
/** #18 sub-filter เฉพาะ status='sold' — 'all' = ทั้งหมด, 'verified' = เฉพาะที่ปิดผ่านระบบ */
export type ClosedFilter = 'all' | 'verified';

export interface SearchFilters {
  province:  string | null;        // ชื่อจังหวัด (ต้องเลือกก่อนถึงจะโหลดแปลง)
  priceMin:  number | null;        // ฿
  priceMax:  number | null;
  areaMin:   number | null;        // ตร.ม.
  areaMax:   number | null;
  titleType: string | null;        // โฉนด, น.ส.3, ส.ป.ก. ฯลฯ
  status:    MapFilter;            // all | available | reserved | sold
  /** #18 sub-filter เมื่อ status='sold' — เลือกแสดงเฉพาะ verified ได้ */
  closed:    ClosedFilter;
}

export const EMPTY_FILTERS: SearchFilters = {
  province:  null,
  priceMin:  null,
  priceMax:  null,
  areaMin:   null,
  areaMax:   null,
  titleType: null,
  status:    'all',
  closed:    'all',
};

interface PlotState {
  plots: PlotPoint[];
  mapFilter: MapFilter;
  searchFilter: SearchFilter;
  searchQuery: string;
  filters: SearchFilters;
  /** plot id ที่ดูล่าสุด — ใช้ flyTo ตอน user กด back กลับแผนที่ */
  lastViewedPlotId: string | null;
  setPlots: (plots: PlotPoint[]) => void;
  setMapFilter: (f: MapFilter) => void;
  setSearchFilter: (f: SearchFilter) => void;
  setSearchQuery: (q: string) => void;
  setFilters: (patch: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setLastViewedPlotId: (id: string | null) => void;
}

export const usePlotStore = create<PlotState>()(
  persist(
    (set) => ({
      plots: [],
      mapFilter: 'all',
      searchFilter: 'all',
      searchQuery: '',
      filters: { ...EMPTY_FILTERS },
      lastViewedPlotId: null,
      setPlots: (plots) => set({ plots }),
      setMapFilter: (mapFilter) => set({ mapFilter }),
      setSearchFilter: (searchFilter) => set({ searchFilter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
      resetFilters: () => set({ filters: { ...EMPTY_FILTERS } }),
      setLastViewedPlotId: (lastViewedPlotId) => set({ lastViewedPlotId }),
    }),
    {
      name: 'tnr-plot-filters',
      storage: createJSONStorage(() => localStorage),
      // persist เฉพาะ filters + mapFilter + lastViewedPlotId (ไม่ persist plots live)
      partialize: (state) => ({
        filters: state.filters,
        mapFilter: state.mapFilter,
        lastViewedPlotId: state.lastViewedPlotId,
      }),
    }
  )
);

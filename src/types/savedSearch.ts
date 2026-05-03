// ════════════════════════════════════════
// src/types/savedSearch.ts
// Saved search criteria — match กับ SearchFilters
// ════════════════════════════════════════
import type { SearchFilters } from '@/store/plotStore';

export const MAX_SAVED_SEARCHES = 10;

export interface SavedSearch {
  id:        string;
  ownerUid:  string;
  name:      string;          // user-defined label
  filters:   SearchFilters;   // เก็บ snapshot ของ filter
  enabled:   boolean;         // toggle เปิด/ปิดแจ้งเตือน
  createdAt: any;
  lastMatchAt?: any;
}

/** Check ว่า plot ตรง criteria ไหม (ใช้ทั้ง client + Cloud Function) */
export function plotMatchesFilters(
  plot: {
    province?: string | null;
    priceTotal?: number | string | null;
    areaSqm?: number | string | null;
    titleType?: string | null;
    status?: string | null;
  },
  f: SearchFilters,
): boolean {
  if (!f.province) return false;
  if (plot.province !== f.province) return false;

  const price = Number(plot.priceTotal);
  if (f.priceMin != null && (!isFinite(price) || price < f.priceMin)) return false;
  if (f.priceMax != null && (!isFinite(price) || price > f.priceMax)) return false;

  const area = Number(plot.areaSqm);
  if (f.areaMin != null && (!isFinite(area) || area < f.areaMin)) return false;
  if (f.areaMax != null && (!isFinite(area) || area > f.areaMax)) return false;

  if (f.titleType && plot.titleType !== f.titleType) return false;
  if (f.status !== 'all' && plot.status !== f.status) return false;
  return true;
}

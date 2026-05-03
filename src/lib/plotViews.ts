// ════════════════════════════════════════
// src/lib/plotViews.ts
// Phase 3 #9 — track view counts per plot for heatmap
//
// Schema: plotViews/{plotDocId} { count, lastViewedAt, lat, lng }
// Throttle: 1 view/plot/day per browser (localStorage)
// ════════════════════════════════════════
import { doc, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const KEY_PREFIX = 'plotview:';
const TTL_MS = 24 * 60 * 60 * 1000; // 1 day

export async function logPlotView(
  plotDocId: string,
  meta?: { lat?: number | null; lng?: number | null },
): Promise<void> {
  if (!plotDocId) return;
  if (typeof window === 'undefined') return;

  // Throttle: skip ถ้าเคย log ภายใน 24ชม.
  try {
    const k = KEY_PREFIX + plotDocId;
    const last = Number(localStorage.getItem(k) || 0);
    if (last && Date.now() - last < TTL_MS) return;
    localStorage.setItem(k, String(Date.now()));
  } catch {/* localStorage blocked → ยังอยากนับ */}

  try {
    const payload: Record<string, unknown> = {
      count: increment(1),
      lastViewedAt: serverTimestamp(),
    };
    if (meta?.lat != null) payload.lat = meta.lat;
    if (meta?.lng != null) payload.lng = meta.lng;
    await setDoc(doc(db, 'plotViews', plotDocId), payload, { merge: true });
  } catch (e) {
    console.warn('[plotViews] log failed', e);
  }
}

export interface PlotViewDoc {
  plotDocId: string;
  count: number;
  lat: number;
  lng: number;
}

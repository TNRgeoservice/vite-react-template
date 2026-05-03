// ════════════════════════════════════════
// src/lib/proximityWatcher.ts
// Geolocation watchPosition + match savedSearches → trigger notification
// Cache localStorage 24h ต่อ plot กัน spam
// ════════════════════════════════════════
import {
  collection, query, where, getDocs, addDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { plotMatchesFilters, type SavedSearch } from '@/types/savedSearch';
import type { PlotPoint } from '@/types/plot';

const RADIUS_KM = 1;
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h ต่อแปลง
const CHECK_INTERVAL_MS = 2 * 60 * 1000;  // เช็คทุก 2 นาที (ไม่ flood)
const MIN_MOVE_KM = 0.3;                   // ขยับ <300m ไม่เช็คใหม่

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function alreadyAlerted(plotId: string): boolean {
  try {
    const v = localStorage.getItem(`prox:${plotId}`);
    if (!v) return false;
    const ts = Number(v);
    return isFinite(ts) && Date.now() - ts < COOLDOWN_MS;
  } catch { return false; }
}

function markAlerted(plotId: string) {
  try { localStorage.setItem(`prox:${plotId}`, String(Date.now())); } catch {}
}

interface WatcherDeps {
  ownerUid: string;
  getSavedSearches: () => SavedSearch[];
}

export class ProximityWatcher {
  private watchId: number | null = null;
  private lastCheck: { at: number; lat: number; lng: number } | null = null;
  private deps: WatcherDeps;

  constructor(deps: WatcherDeps) {
    this.deps = deps;
  }

  start(): boolean {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return false;
    if (this.watchId != null) return true;
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => this.onPosition(pos),
      (err) => console.warn('[proximity] geo error:', err.message),
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 30000 },
    );
    return true;
  }

  stop() {
    if (this.watchId != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    this.watchId = null;
    this.lastCheck = null;
  }

  isRunning(): boolean { return this.watchId != null; }

  private async onPosition(pos: GeolocationPosition) {
    const { latitude: lat, longitude: lng } = pos.coords;
    const now = Date.now();

    // throttle: ห่างเวลา + ขยับน้อยกว่า threshold ข้าม
    if (this.lastCheck) {
      const dt = now - this.lastCheck.at;
      const dKm = haversineKm({ lat, lng }, this.lastCheck);
      if (dt < CHECK_INTERVAL_MS && dKm < MIN_MOVE_KM) return;
    }
    this.lastCheck = { at: now, lat, lng };

    const searches = this.deps.getSavedSearches().filter((s) => s.enabled);
    if (!searches.length) return;

    // หา province distinct → query plots province ละ batch
    const provinces = Array.from(new Set(
      searches.map((s) => s.filters.province).filter(Boolean) as string[]
    ));

    for (const prov of provinces) {
      try {
        const q = query(
          collection(db, 'fieldsurvey_points'),
          where('province', '==', prov),
          where('status', '==', 'available'),
        );
        const snap = await getDocs(q);
        for (const doc of snap.docs) {
          const plot = { id: doc.id, ...doc.data() } as PlotPoint;
          if (plot.ownerUid && plot.ownerUid === this.deps.ownerUid) continue;
          if (!plot.lat || !plot.lng) continue;
          if (alreadyAlerted(plot.id)) continue;

          const dist = haversineKm({ lat, lng }, { lat: plot.lat, lng: plot.lng });
          if (dist > RADIUS_KM) continue;

          // match อย่างน้อย 1 saved search?
          const matched = searches.find((s) =>
            s.filters.province === prov && plotMatchesFilters(plot as any, s.filters)
          );
          if (!matched) continue;

          await this.triggerAlert(plot, matched, dist);
          markAlerted(plot.id);
        }
      } catch (e) {
        console.warn('[proximity] query failed for', prov, e);
      }
    }
  }

  private async triggerAlert(plot: PlotPoint, ss: SavedSearch, distKm: number) {
    const dist = distKm < 1 ? `${Math.round(distKm * 1000)} ม.` : `${distKm.toFixed(1)} กม.`;
    try {
      await addDoc(collection(db, 'notifications'), {
        type: 'proximityMatch',
        toUid: this.deps.ownerUid,
        fromName: 'TNR Nearby',
        title: `📍 มีแปลงน่าสนใจในรัศมี ${dist}`,
        body: `${ss.name}: ${plot.name || 'ที่ดิน'} — แวะดูไหม?`,
        plotDocId: plot.id,
        plotName: plot.name || 'ที่ดิน',
        url: `/plot/${plot.id}`,
        savedSearchId: ss.id,
        createdAt: serverTimestamp(),
        sent: false,
      });
    } catch (e) {
      console.warn('[proximity] notification write failed:', e);
    }
  }
}

// ════════════════════════════════════════
// lib/geoNearby.ts
// หาแปลงในรัศมี + median ราคา/ตร.วา
// Strategy: query แค่ where province==X (auto-index) → filter ใน client
// Fallback: ถ้าแปลงไม่มี landPricePerSqWa cached → คำนวณจาก priceTotal/areaSqm
// ════════════════════════════════════════
import { collection, getDocs, query, where, limit as fsLimit } from 'firebase/firestore';
import { db } from './firebase';

const EARTH_R_KM = 6371;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_R_KM * Math.asin(Math.sqrt(h));
}

export function median(values: number[]): number | null {
  const v = values.filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

export interface NearbySample {
  id: string;
  name: string;
  lat: number;
  lng: number;
  pricePerWa: number;
  distanceKm: number;
}

export interface NearbyComparison {
  selfPricePerWa: number;
  medianPricePerWa: number;
  diffPct: number;
  sampleCount: number;
  radiusKm: number;
  samples: NearbySample[];
}

export async function getNearbyComparison(opts: {
  selfId: string;
  province: string;
  lat: number;
  lng: number;
  selfPricePerWa: number;
  radiusKm?: number;
  minSamples?: number;
}): Promise<NearbyComparison | null> {
  const { selfId, province, lat, lng, selfPricePerWa } = opts;
  const radiusKm = opts.radiusKm ?? 5;
  const minSamples = opts.minSamples ?? 3;

  if (!province || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (!(selfPricePerWa > 0)) return null;

  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const qRef = query(
    collection(db, 'fieldsurvey_points'),
    where('province', '==', province),
    fsLimit(1000),
  );

  const snap = await getDocs(qRef);
  console.log('[geoNearby] query returned', snap.size, 'docs in', province);

  const samples: NearbySample[] = [];
  let skipNoLatLng = 0, skipBboxLat = 0, skipBboxLng = 0, skipNoPpw = 0, skipFar = 0;

  snap.forEach((d) => {
    if (d.id === selfId) return;
    const data = d.data() as Record<string, unknown>;
    const docLat = Number(data.lat);
    const docLng = Number(data.lng);
    if (!Number.isFinite(docLat) || !Number.isFinite(docLng)) { skipNoLatLng++; return; }
    if (Math.abs(docLat - lat) > latDelta) { skipBboxLat++; return; }
    if (Math.abs(docLng - lng) > lngDelta) { skipBboxLng++; return; }

    // ราคา/ตร.วา — ใช้ cached ก่อน, fallback คำนวณจาก priceTotal/areaSqm (หัก buildingValueTotal)
    let ppw = Number(data.landPricePerSqWa);
    if (!(ppw > 0)) {
      const priceTotal = Number(data.priceTotal);
      const areaSqm = Number(data.areaSqm);
      const buildingTotal = Number(data.buildingValueTotal) || 0;
      if (priceTotal > 0 && areaSqm > 0) {
        const landWa = areaSqm / 4;
        ppw = (priceTotal - buildingTotal) / landWa;
      }
    }
    if (!(ppw > 0)) { skipNoPpw++; return; }

    const dist = haversineKm({ lat, lng }, { lat: docLat, lng: docLng });
    if (dist > radiusKm) { skipFar++; return; }

    samples.push({
      id: d.id,
      name: String(data.name || ''),
      lat: docLat, lng: docLng,
      pricePerWa: ppw,
      distanceKm: dist,
    });
  });

  console.log('[geoNearby] filter', { samples: samples.length, skipNoLatLng, skipBboxLat, skipBboxLng, skipNoPpw, skipFar, minSamples });
  if (samples.length < minSamples) return null;

  const med = median(samples.map((s) => s.pricePerWa));
  if (!med) return null;

  return {
    selfPricePerWa,
    medianPricePerWa: med,
    diffPct: ((selfPricePerWa - med) / med) * 100,
    sampleCount: samples.length,
    radiusKm,
    samples: samples.sort((a, b) => a.distanceKm - b.distanceKm),
  };
}

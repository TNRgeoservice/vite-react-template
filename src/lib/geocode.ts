// ════════════════════════════════════════
// src/lib/geocode.ts
// Reverse geocoding (lat,lng) → จังหวัด/อำเภอ/ตำบล
// Primary: LongDo Map API (ถ้ามี key) — แม่นกว่าสำหรับไทย
// Fallback: Nominatim (OSM) — ฟรี ไม่ต้อง key
// ════════════════════════════════════════

export interface GeocodeResult {
  province: string;
  amphoe:   string;
  tambon:   string;
  source:   'longdo' | 'nominatim' | 'none';
}

const EMPTY: GeocodeResult = { province: '', amphoe: '', tambon: '', source: 'none' };

/** ตัด prefix ภาษาไทยให้ตรงกับ format ใน loc-codes (ที่เก็บแบบไม่มี prefix) */
function strip(s: string | undefined | null): string {
  if (!s) return '';
  return String(s)
    .replace(/^(จังหวัด|จ\.)\s*/, '')
    .replace(/^(อำเภอ|อ\.|เขต)\s*/, '')
    .replace(/^(ตำบล|ต\.|แขวง)\s*/, '')
    .trim();
}

/**
 * LongDo Map API — Reverse geocode
 * Doc: https://map.longdo.com/docs/javascript/services
 * Endpoint: https://api.longdo.com/map/services/address?lat=..&lon=..&noelevation=1&key=..
 */
async function reverseLongdo(lat: number, lng: number, key: string): Promise<GeocodeResult> {
  try {
    const url = `https://api.longdo.com/map/services/address?lat=${lat}&lon=${lng}&noelevation=1&key=${encodeURIComponent(key)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return EMPTY;
    const j = await res.json();
    return {
      province: strip(j.province),
      amphoe:   strip(j.district),
      tambon:   strip(j.subdistrict),
      source:   'longdo',
    };
  } catch {
    return EMPTY;
  }
}

/**
 * Nominatim (OSM) — fallback
 * Rate limit: 1 req/sec, ต้องส่ง User-Agent ตาม policy
 */
async function reverseNominatim(lat: number, lng: number): Promise<GeocodeResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=th&zoom=14`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return EMPTY;
    const j = await res.json();
    const a = j?.address || {};
    // OSM keys: state(จังหวัด), county/state_district(อำเภอ?), suburb/village/neighbourhood(ตำบล?)
    return {
      province: strip(a.state || a.province),
      amphoe:   strip(a.county || a.city_district || a.district || ''),
      tambon:   strip(a.suburb || a.village || a.neighbourhood || a.town || ''),
      source:   'nominatim',
    };
  } catch {
    return EMPTY;
  }
}

/**
 * Reverse geocode — ลอง LongDo ก่อน (ถ้ามี key), fallback Nominatim
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return EMPTY;
  const key = process.env.NEXT_PUBLIC_LONGDO_MAP_KEY;
  if (key) {
    const r = await reverseLongdo(lat, lng, key);
    if (r.province || r.amphoe || r.tambon) return r;
  }
  return reverseNominatim(lat, lng);
}

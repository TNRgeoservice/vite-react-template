// ════════════════════════════════════════
// lib/loc-codes.ts
// Lookup Location Code 6 หลัก (DOPA) จาก (province, amphoe, tambon)
// ใช้สำหรับสร้างเลขเอกสารรูปแบบ {locCode}-{seq5}
// ════════════════════════════════════════
import codes from './loc-codes.json';

const MAP = codes as Record<string, string>;

function norm(s: string | null | undefined): string {
  if (!s) return '';
  return String(s)
    .normalize('NFC')
    .trim()
    // ตัด prefix ที่พบบ่อย ให้จับคู่ได้แม้ user พิมพ์สั้น
    .replace(/^(จังหวัด|จ\.)\s*/, '')
    .replace(/^(อำเภอ|อ\.|เขต)\s*/, '')
    .replace(/^(ตำบล|ต\.|แขวง)\s*/, '');
}

/**
 * หา Location Code 6 หลักจากชื่อ จังหวัด/อำเภอ/ตำบล
 * ลอง exact match ก่อน ถ้าไม่เจอ fallback แบบ contains ที่อำเภอ (กรณี "เมือง" vs "เมืองขอนแก่น")
 */
export function getLocCode(
  province?: string | null,
  amphoe?:   string | null,
  tambon?:   string | null,
): string | null {
  const p = norm(province);
  const a = norm(amphoe);
  const t = norm(tambon);
  if (!p || !a || !t) return null;

  // 1) exact
  const exact = MAP[`${p}|${a}|${t}`];
  if (exact) return exact;

  // 2) amphoe "เมือง" → "เมือง<จังหวัด>"
  if (a === 'เมือง') {
    const guess = MAP[`${p}|เมือง${p}|${t}`];
    if (guess) return guess;
  }

  // 3) contains (ช้าแต่ครอบคลุม) — หา key ที่ province ตรง และ amphoe/tambon ใกล้เคียง
  for (const key of Object.keys(MAP)) {
    const [kp, ka, kt] = key.split('|');
    if (kp !== p) continue;
    if (kt !== t) continue;
    if (ka === a || ka.includes(a) || a.includes(ka)) return MAP[key];
  }
  return null;
}

/**
 * Autocomplete helpers — list ของ จังหวัด/อำเภอ/ตำบล จาก loc-codes (cached, lazy)
 */
let _provinces:  string[] | null = null;
let _amphoeMap:  Record<string, string[]> | null = null;
let _tambonMap:  Record<string, Record<string, string[]>> | null = null;

function buildIndexes() {
  if (_provinces) return;
  const provs = new Set<string>();
  const aMap: Record<string, Set<string>> = {};
  const tMap: Record<string, Record<string, Set<string>>> = {};
  for (const key of Object.keys(MAP)) {
    const [p, a, t] = key.split('|');
    if (!p || !a || !t) continue;
    provs.add(p);
    if (!aMap[p]) aMap[p] = new Set();
    aMap[p].add(a);
    if (!tMap[p]) tMap[p] = {};
    if (!tMap[p][a]) tMap[p][a] = new Set();
    tMap[p][a].add(t);
  }
  _provinces = Array.from(provs).sort();
  _amphoeMap = Object.fromEntries(
    Object.entries(aMap).map(([k, v]) => [k, Array.from(v).sort()])
  );
  _tambonMap = Object.fromEntries(
    Object.entries(tMap).map(([k, v]) => [
      k,
      Object.fromEntries(Object.entries(v).map(([k2, v2]) => [k2, Array.from(v2).sort()])),
    ])
  );
}

export function listProvinces(): string[] {
  buildIndexes();
  return _provinces || [];
}

export function listAmphoes(province: string): string[] {
  buildIndexes();
  const p = norm(province);
  return _amphoeMap?.[p] || [];
}

export function listTambons(province: string, amphoe: string): string[] {
  buildIndexes();
  const p = norm(province);
  const a = norm(amphoe);
  return _tambonMap?.[p]?.[a] || [];
}

/**
 * สร้างเลขเอกสาร {locCode}-{seq5}
 * ถ้าไม่มี locCode ใช้ '000000' เป็น fallback
 */
export function buildDocNo(locCode: string | null, seq: number): string {
  const loc = (locCode || '000000').padStart(6, '0').slice(0, 6);
  const s   = String(Math.max(0, Math.floor(seq))).padStart(5, '0').slice(-5);
  return `${loc}-${s}`;
}

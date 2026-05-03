// ════════════════════════════════════════
// lib/rai.ts
// Thai land area conversions
// 1 ไร่ = 4 งาน = 400 ตร.วา = 1,600 ตร.ม.
// 1 งาน = 100 ตร.วา = 400 ตร.ม.
// 1 ตร.วา = 4 ตร.ม.
// ════════════════════════════════════════

export const SQM_PER_WA   = 4;
export const SQM_PER_NGAN = 400;
export const SQM_PER_RAI  = 1600;
export const WA_PER_NGAN  = 100;
export const WA_PER_RAI   = 400;

export interface RaiNganWa {
  rai:  number;
  ngan: number;
  wa:   number;   // สามารถมีทศนิยมได้
}

/** Split total ตร.ม. → ไร่/งาน/วา (วา เก็บ 2 ทศนิยม) */
export function sqmToRNW(sqm: number): RaiNganWa {
  if (!Number.isFinite(sqm) || sqm < 0) return { rai: 0, ngan: 0, wa: 0 };
  const totalWa = sqm / SQM_PER_WA;
  const rai  = Math.floor(totalWa / WA_PER_RAI);
  const rest1 = totalWa - rai * WA_PER_RAI;
  const ngan = Math.floor(rest1 / WA_PER_NGAN);
  const wa   = Math.round((rest1 - ngan * WA_PER_NGAN) * 100) / 100;
  return { rai, ngan, wa };
}

/** Assemble ไร่/งาน/วา → ตร.ม. */
export function rnwToSqm(r: Partial<RaiNganWa>): number {
  const rai  = Number(r.rai)  || 0;
  const ngan = Number(r.ngan) || 0;
  const wa   = Number(r.wa)   || 0;
  return rai * SQM_PER_RAI + ngan * SQM_PER_NGAN + wa * SQM_PER_WA;
}

/** Total ตร.วา (คำนวณจาก ตร.ม.) */
export function sqmToWa(sqm: number): number {
  if (!Number.isFinite(sqm) || sqm < 0) return 0;
  return Math.round((sqm / SQM_PER_WA) * 100) / 100;
}

/** Human-readable "ไร่-งาน-วา" */
export function fmtRNW(sqm: number | string | null | undefined): string {
  if (sqm == null || sqm === '') return '—';
  const n = typeof sqm === 'string' ? parseFloat(sqm) : sqm;
  if (!Number.isFinite(n)) return '—';
  const { rai, ngan, wa } = sqmToRNW(n);
  const parts: string[] = [];
  if (rai)  parts.push(`${rai} ไร่`);
  if (ngan) parts.push(`${ngan} งาน`);
  if (wa)   parts.push(`${wa} ตร.วา`);
  return parts.length ? parts.join(' ') : '0 ตร.วา';
}

// ════════════════════════════════════════
// src/lib/revisions.ts
// #19 Field history helpers — track เปลี่ยนแปลงของ field
// เก็บแบบ inline ใน plot doc: revisions[fieldName] = RevisionEntry[]
// Policy: keep first entry + last 3 → max 4 entries/field
// ════════════════════════════════════════
import { Timestamp } from 'firebase/firestore';
import type { RevisionEntry } from '@/types/plot';

const MAX_TAIL = 3;

/**
 * Compare old vs new value (ไม่ track ถ้าเหมือนกัน)
 * รองรับ string, number, null, undefined — เทียบแบบ ===
 * (สำหรับ object/array ใช้ JSON.stringify เปรียบเทียบ)
 */
export function valuesDiffer(oldV: any, newV: any): boolean {
  // normalize: '' / null / undefined → null
  const norm = (v: any) => (v === '' || v === undefined ? null : v);
  const a = norm(oldV);
  const b = norm(newV);
  if (a === b) return false;
  if (typeof a === 'object' || typeof b === 'object') {
    try {
      return JSON.stringify(a) !== JSON.stringify(b);
    } catch {
      return true;
    }
  }
  return true;
}

/**
 * Push new revision entry into existing array, keep [first, ...last 3]
 * - oldValue คือค่าเดิม (ก่อนเปลี่ยน) ที่ต้องเก็บ
 * - คืน array ใหม่ (immutable)
 */
export function pushRevision(
  prev: RevisionEntry[] | undefined | null,
  oldValue: any,
): RevisionEntry[] {
  const entry: RevisionEntry = {
    value: oldValue ?? null,
    at:    Timestamp.now(),
  };
  const arr = Array.isArray(prev) ? [...prev] : [];
  arr.push(entry);
  if (arr.length <= MAX_TAIL + 1) return arr;
  // keep index 0 + last 3
  return [arr[0], ...arr.slice(-MAX_TAIL)];
}

/**
 * Diff old vs new fields object → return revisions update partial
 * - input: oldFields (จาก plot doc), newFields (กำลังจะ save), prevRevisions
 * - output: Record<fieldName, RevisionEntry[]> ใหม่ (มีเฉพาะ field ที่เปลี่ยน)
 *   หรือ undefined ถ้าไม่มีอะไรเปลี่ยน
 */
export function buildRevisionsUpdate(
  oldFields: Record<string, any>,
  newFields: Record<string, any>,
  prevRevisions: Record<string, RevisionEntry[]> | null | undefined,
  fieldsToTrack: string[],
): Record<string, RevisionEntry[]> | undefined {
  const out: Record<string, RevisionEntry[]> = { ...(prevRevisions || {}) };
  let changed = false;
  for (const f of fieldsToTrack) {
    const oldV = oldFields[f];
    const newV = newFields[f];
    if (valuesDiffer(oldV, newV)) {
      out[f] = pushRevision(prevRevisions?.[f], oldV);
      changed = true;
    }
  }
  return changed ? out : undefined;
}

/**
 * Format revision tooltip text — "เดิม: <value> (เมื่อ DD/MM/YYYY)"
 * - ใช้แสดง entry ล่าสุด (revisions[revisions.length-1])
 * - ถ้าไม่มี revisions → return null
 */
export function formatRevisionTooltip(
  entries: RevisionEntry[] | undefined | null,
  formatValue?: (v: any) => string,
): string | null {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  // entries[0] = first ever, entries[-1] = ล่าสุด — ใช้ entries[-1] (ค่าก่อนเปลี่ยนครั้งล่าสุด)
  const last = entries[entries.length - 1];
  const fmt  = formatValue || ((v: any) => v == null ? '—' : String(v));
  const dStr = formatThaiDate(last.at);
  return `เดิม: ${fmt(last.value)}${dStr ? ` (เมื่อ ${dStr})` : ''}`;
}

/**
 * Format ทุก entries เป็น text หลายบรรทัด — สำหรับ tooltip ที่อยากแสดงทั้ง history
 */
export function formatRevisionHistory(
  entries: RevisionEntry[] | undefined | null,
  formatValue?: (v: any) => string,
): string | null {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  const fmt = formatValue || ((v: any) => v == null ? '—' : String(v));
  return entries
    .map((e, i) => {
      const tag  = i === 0 ? 'เริ่มต้น' : `ครั้งที่ ${i + 1}`;
      const dStr = formatThaiDate(e.at);
      return `${tag}: ${fmt(e.value)}${dStr ? ` (${dStr})` : ''}`;
    })
    .join('\n');
}

/** Convert Firestore Timestamp / Date / ISO string → DD/MM/YYYY (พ.ศ.) */
export function formatThaiDate(ts: any): string {
  try {
    let d: Date | null = null;
    if (!ts) return '';
    if (typeof ts === 'string') d = new Date(ts);
    else if (ts.toDate) d = ts.toDate();
    else if (ts.seconds) d = new Date(ts.seconds * 1000);
    else if (ts instanceof Date) d = ts;
    if (!d || isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yy}`;
  } catch {
    return '';
  }
}

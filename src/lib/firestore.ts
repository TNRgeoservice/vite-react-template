// ════════════════════════════════════════
// src/lib/firestore.ts
// Modular Firestore helpers (port ของ legacy fs* helpers)
// ════════════════════════════════════════
import {
  collection, doc, getDoc, setDoc, updateDoc, deleteDoc,
  getDocs, query, onSnapshot, serverTimestamp,
  arrayUnion, arrayRemove, increment,
  QueryConstraint, DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

export const COL = 'fieldsurvey_points';

/** Get single doc → { id, ...data } | null */
export async function fsGet<T = DocumentData>(col: string, docId: string): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, col, String(docId)));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as T) }) : null;
}

/** Set / overwrite (merge: true by default — เลียนแบบ legacy behavior) */
export async function fsSet(col: string, docId: string, data: DocumentData, merge = true) {
  return setDoc(doc(db, col, String(docId)), data, { merge });
}

/** Update specific fields */
export async function fsUpdate(col: string, docId: string, data: DocumentData) {
  return updateDoc(doc(db, col, String(docId)), data);
}

/** Delete doc */
export async function fsDelete(col: string, docId: string) {
  return deleteDoc(doc(db, col, String(docId)));
}

/** Query collection → array */
export async function fsQuery<T = DocumentData>(
  col: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  const q = query(collection(db, col), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as T) }));
}

/** Realtime subscription — returns unsubscribe fn */
export function fsSubscribe<T = DocumentData>(
  col: string,
  onChange: (items: (T & { id: string })[]) => void,
  ...constraints: QueryConstraint[]
) {
  const q = query(collection(db, col), ...constraints);
  return onSnapshot(q, snap => {
    onChange(snap.docs.map(d => ({ id: d.id, ...(d.data() as T) })));
  });
}

// ── Server helpers ──
export const TS = () => serverTimestamp();
export const ArrayUnion = (...v: unknown[]) => arrayUnion(...v);
export const ArrayRemove = (...v: unknown[]) => arrayRemove(...v);
export const Increment = (n = 1) => increment(n);

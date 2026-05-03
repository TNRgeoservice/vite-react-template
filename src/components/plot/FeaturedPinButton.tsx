// ════════════════════════════════════════
// src/components/plot/FeaturedPinButton.tsx
// ปุ่ม 📌 ปัก/ถอนปักหมุดแปลง — เฉพาะ admin
// toggle field `isFeatured` ใน fieldsurvey_points/{id}
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, COL } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

interface Props {
  plotDocId: string;
  initialFeatured?: boolean;
}

export function FeaturedPinButton({ plotDocId, initialFeatured = false }: Props) {
  const role = useAuthStore((s) => s.role);
  const ready = useAuthStore((s) => s.ready);
  const [featured, setFeatured] = useState<boolean>(initialFeatured);
  const [busy, setBusy] = useState(false);
  const [synced, setSynced] = useState(false);

  // sync จาก Firestore (live value อาจ stale จาก SSR)
  useEffect(() => {
    if (!plotDocId) return;
    let cancelled = false;
    getDoc(doc(db, COL, plotDocId))
      .then((snap) => {
        if (cancelled) return;
        setFeatured(!!snap.data()?.isFeatured);
        setSynced(true);
      })
      .catch(() => setSynced(true));
    return () => { cancelled = true; };
  }, [plotDocId]);

  if (!ready) return null;
  if (role !== 'admin') return null;

  async function toggle() {
    setBusy(true);
    const next = !featured;
    try {
      await updateDoc(doc(db, COL, plotDocId), {
        isFeatured: next,
        featuredAt: next ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      });
      setFeatured(next);
    } catch (e) {
      alert('ผิดพลาด: ' + (e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy || !synced}
      title={featured ? 'ถอนการปักหมุด' : 'ปักหมุดเป็นที่ดินแนะนำ'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 8,
        background: featured ? '#ffb300' : '#0d2030',
        color: featured ? '#0d1520' : '#ffb300',
        border: `1px solid ${featured ? '#ffb300' : '#ffb300'}`,
        fontWeight: 700, fontSize: 12,
        cursor: busy ? 'wait' : 'pointer',
        opacity: synced ? 1 : 0.6,
      }}
    >
      {busy ? '⏳' : '📌'} {featured ? 'ปักหมุดแล้ว · กดเพื่อถอน' : 'ปักหมุดที่ดินแนะนำ (admin)'}
    </button>
  );
}

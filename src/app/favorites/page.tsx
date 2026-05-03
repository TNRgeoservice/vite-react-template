// ════════════════════════════════════════
// src/app/favorites/page.tsx
// My favorites list (realtime)
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

type FavItem = {
  id: string;
  plotDocId: string;
  name?: string;
  type?: string;
  lat?: number;
  lng?: number;
  priceTotal?: number;
  areaSqm?: number;
  province?: string;
  thumbUrl?: string;
};

export default function FavoritesPage() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const [items, setItems] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user) { setLoading(false); return; }
    const q = query(collection(db, 'users', user.uid, 'favorites'), orderBy('savedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as FavItem)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user, ready]);

  async function remove(favId: string) {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'favorites', favId));
  }

  if (!ready || loading) {
    return <div className="p-10 text-center text-[#7a9ab8]">กำลังโหลด...</div>;
  }
  if (!user) {
    return (
      <div className="p-10 text-center text-[#7a9ab8]">
        กรุณาเข้าสู่ระบบ —{' '}
        <Link href="/" className="text-[#40c4ff] underline">กลับหน้าหลัก</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 text-[#dce8f5]">
      <Link href="/" className="text-xs text-[#7a9ab8]">← กลับหน้าแผนที่</Link>
      <h1 className="mt-2 mb-5 text-xl font-bold">❤️ รายการโปรด ({items.length})</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-[#213045] bg-[#162030] p-10 text-center text-xs text-[#7a9ab8]">
          ยังไม่มีรายการโปรด<br />กด 🤍 ที่ที่ดินในแผนที่เพื่อบันทึก
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((it) => {
            const area = it.areaSqm
              ? (it.areaSqm >= 1600 ? (it.areaSqm/1600).toFixed(2)+' ไร่' : it.areaSqm.toFixed(0)+' ตร.ม.')
              : '—';
            const price = it.priceTotal ? '฿'+Number(it.priceTotal).toLocaleString('th-TH') : '—';
            return (
              <div key={it.id} className="flex items-center gap-3 rounded-xl border border-[#213045] bg-[#162030] p-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#213045]">
                  {it.thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.thumbUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🏞️</div>
                  )}
                </div>
                <Link href={`/plot/${it.plotDocId}`} className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{it.name || 'ที่ดิน'}</div>
                  <div className="text-xs text-[#7a9ab8]">{area} · {price}</div>
                  <div className="truncate text-xs text-[#7a9ab8]">{it.province}</div>
                </Link>
                <button onClick={() => remove(it.id)}
                  className="rounded-lg border border-[#213045] p-2 text-sm text-[#dc2626]"
                  title="ลบ">🗑️</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// src/app/admin/featured/page.tsx
// Admin dashboard — รวมแปลงที่ปักหมุด + unpin เร็ว
// guard: role === 'admin'
// ════════════════════════════════════════
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  collection, getDocs, query, where, orderBy, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db, COL } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { PlotPoint } from '@/types/plot';

export default function AdminFeaturedPage() {
  const role = useAuthStore((s) => s.role);
  const ready = useAuthStore((s) => s.ready);
  const [items, setItems] = useState<PlotPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || role !== 'admin') return;
    let cancelled = false;
    (async () => {
      try {
        // orderBy featuredAt desc — แปลงไม่มี featuredAt (legacy) จะ filter แยก
        const q1 = query(collection(db, COL), where('isFeatured', '==', true));
        const snap = await getDocs(q1);
        if (cancelled) return;
        const list: PlotPoint[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        list.sort((a, b) => {
          const at = (a.featuredAt as { seconds?: number })?.seconds || 0;
          const bt = (b.featuredAt as { seconds?: number })?.seconds || 0;
          return bt - at;
        });
        setItems(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ready, role]);

  async function unpin(id: string) {
    if (!confirm('ถอนการปักหมุด?')) return;
    setBusyId(id);
    try {
      await updateDoc(doc(db, COL, id), {
        isFeatured: false,
        featuredAt: null,
        updatedAt: serverTimestamp(),
      });
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('ผิดพลาด: ' + (e as Error).message);
    } finally { setBusyId(null); }
  }

  if (!ready) return <main className="p-6 text-[#7a9ab8]">⏳ กำลังโหลด...</main>;
  if (role !== 'admin') {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-[#dce8f5]">⛔ ไม่มีสิทธิ์</h1>
        <p className="mt-2 text-sm text-[#7a9ab8]">หน้านี้สำหรับ admin เท่านั้น</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#dce8f5]">📌 ที่ดินที่ปักหมุด (Admin)</h1>
          <p className="mt-1 text-xs text-[#7a9ab8]">รวม {items.length} รายการ · เรียงปักล่าสุดขึ้นบน</p>
        </div>
        <Link href="/cards" className="text-xs text-[#40c4ff] hover:underline">→ ดูหน้า /cards</Link>
      </header>

      {loading ? (
        <div className="rounded-lg border border-[#213045] bg-[#111c2b] p-6 text-center text-sm text-[#7a9ab8]">⏳ กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-[#213045] bg-[#111c2b] p-6 text-center text-sm text-[#7a9ab8]">
          ยังไม่มีแปลงที่ปักหมุด
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => {
            const thumb = p.photoUrls?.[0] || p.photos?.[0];
            const area = p.areaSqm != null
              ? (Number(p.areaSqm) >= 1600 ? (Number(p.areaSqm) / 1600).toFixed(2) + ' ไร่' : Number(p.areaSqm).toFixed(0) + ' ตร.ม.')
              : '—';
            const price = p.priceTotal != null ? '฿' + Number(p.priceTotal).toLocaleString('th-TH') : '—';
            const fSec = (p.featuredAt as { seconds?: number })?.seconds;
            const fDate = fSec ? new Date(fSec * 1000).toLocaleString('th-TH') : '—';
            return (
              <li key={p.id} className="flex items-center gap-3 rounded-lg border border-[#213045] bg-[#111c2b] p-3">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded bg-[#213045]">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={p.name || ''} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🏞️</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/plot/${p.id}`} className="block truncate font-semibold text-[#dce8f5] hover:text-[#40c4ff]">
                    {p.name || 'ที่ดิน'}
                  </Link>
                  <div className="truncate text-[11px] text-[#7a9ab8]">📍 {p.province || '-'} · {area} · <span className="text-[#00e676]">{price}</span></div>
                  <div className="text-[10px] text-[#7a9ab8]">ปักเมื่อ: {fDate}</div>
                </div>
                <button
                  onClick={() => unpin(p.id)}
                  disabled={busyId === p.id}
                  className="rounded border border-[#ff6b6b] px-3 py-1.5 text-xs font-semibold text-[#ff6b6b] hover:bg-[#ff6b6b]/10 disabled:opacity-50"
                  title="ถอนการปักหมุด"
                >
                  {busyId === p.id ? '⏳' : '✕ ถอน'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

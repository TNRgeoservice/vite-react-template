// ════════════════════════════════════════
// src/components/featured/FeaturedScroller.tsx
// Horizontal scroller of featured plots (isFeatured=true, type=land)
// ════════════════════════════════════════
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePlotStore } from '@/store/plotStore';

export function FeaturedScroller() {
  const plots = usePlotStore((s) => s.plots);
  const [hidden, setHidden] = useState(false);

  const items = useMemo(
    () => plots
      .filter((p) =>
        p.isFeatured &&
        (p.type === 'land' || p.type === 'polygon') &&
        p.status !== 'sold' // กันที่ดินที่ขายไปแล้ว (กรณีข้อมูลเก่ายังไม่ unset isFeatured)
      )
      .sort((a, b) => {
        const at = (a.featuredAt as { seconds?: number })?.seconds || 0;
        const bt = (b.featuredAt as { seconds?: number })?.seconds || 0;
        return bt - at;
      }),
    [plots],
  );

  // ซ่อนถ้า ≤1 รายการ — กันแถบบังหน้าจอเปล่า ๆ
  if (hidden || items.length <= 1) return null;

  return (
    <div className="pointer-events-auto fixed bottom-16 left-0 right-0 z-[700] border-t border-[#213045] bg-[#0d1520]/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 pt-2">
        <span className="text-xs font-semibold text-[#dce8f5]">⭐ ที่ดินแนะนำ</span>
        <button onClick={() => setHidden(true)} className="text-sm text-[#7a9ab8]" title="ซ่อน">✕</button>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 py-2" style={{ scrollSnapType: 'x mandatory' }}>
        {items.map((p) => {
          const area = p.areaSqm != null
            ? (Number(p.areaSqm) >= 1600 ? (Number(p.areaSqm)/1600).toFixed(2)+' ไร่' : Number(p.areaSqm).toFixed(0)+' ตร.ม.')
            : '—';
          const price = p.priceTotal != null ? '฿'+Number(p.priceTotal).toLocaleString('th-TH') : '—';
          const thumb = p.photoUrls?.[0] || p.photos?.[0];
          return (
            <Link key={p.id} href={`/plot/${p.id}`}
              className="flex w-48 shrink-0 flex-col overflow-hidden rounded-lg border border-[#213045] bg-[#162030]"
              style={{ scrollSnapAlign: 'start' }}>
              <div className="h-24 w-full bg-[#213045]">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={p.name || ''} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">🏞️</div>
                )}
              </div>
              <div className="p-2 text-[11px]">
                <div className="truncate font-semibold text-[#dce8f5]">{p.name || 'ที่ดิน'}</div>
                <div className="truncate text-[#7a9ab8]">📍 {p.province || '-'}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[#7a9ab8]">{area}</span>
                  <span className="font-semibold text-[#00e676]">{price}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

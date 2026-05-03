// ════════════════════════════════════════
// app/cards/page.tsx
// Card / Grid view — all plots
// Port of js/card-view.v2.js (detail modal = link to /plot/[id])
// ════════════════════════════════════════
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, COL } from '@/lib/firebase';
import { usePlotStore } from '@/store/plotStore';
import { useCompareStore } from '@/store/compareStore';
import type { PlotPoint, PlotStatus } from '@/types/plot';

type StatusFilter = 'all' | PlotStatus;
type ClosedFilter = 'all' | 'verified';
type SortMode = '' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'date-desc' | 'date-asc';

const statusLabelShort: Record<PlotStatus, string> = {
  available: '✅ ว่าง',
  reserved: '⏳ จอง',
  sold: '🔴 ขาย',
};
const statusColor: Record<PlotStatus, string> = {
  available: '#00e676',
  reserved: '#ffb300',
  sold: '#ff5252',
};

function formatPrice(p: PlotPoint) {
  if (p.priceTotal != null && p.priceTotal !== '') {
    return Number(p.priceTotal).toLocaleString('th-TH') + ' ฿';
  }
  return 'ติดต่อสอบถาม';
}

function formatArea(p: PlotPoint) {
  return p.areaSqm ? Number(p.areaSqm).toLocaleString('th-TH') + ' ตร.ม.' : '-';
}

export default function CardsPage() {
  const plots = usePlotStore((s) => s.plots);
  const setPlots = usePlotStore((s) => s.setPlots);

  const [status, setStatus] = useState<StatusFilter>('all');
  const [closed, setClosed] = useState<ClosedFilter>('all'); // #18 sub-filter
  const [province, setProvince] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');
  const [sort, setSort] = useState<SortMode>('');

  // Subscribe if store is empty (user landed here directly)
  useEffect(() => {
    if (plots.length > 0) return;
    const unsub = onSnapshot(query(collection(db, COL)), (snap) => {
      setPlots(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as PlotPoint[]);
    });
    return () => unsub();
  }, [plots.length, setPlots]);

  const filtered = useMemo(() => {
    let out = plots.slice();
    if (status !== 'all') out = out.filter((p) => (p.status || 'available') === status);
    // #18 sub-filter: เมื่อ status='sold' + closed='verified' → เอาเฉพาะ verified
    if (status === 'sold' && closed === 'verified') out = out.filter((p) => p.closeType === 'verified');
    if (province) out = out.filter((p) => (p.province || '').toLowerCase().includes(province.toLowerCase()));

    const pMin = parseFloat(priceMin);
    const pMax = parseFloat(priceMax);
    if (!isNaN(pMin)) out = out.filter((p) => Number(p.priceTotal || 0) >= pMin);
    if (!isNaN(pMax)) out = out.filter((p) => Number(p.priceTotal || 0) <= pMax);

    const aMin = parseFloat(areaMin);
    const aMax = parseFloat(areaMax);
    if (!isNaN(aMin)) out = out.filter((p) => Number(p.areaSqm || 0) >= aMin);
    if (!isNaN(aMax)) out = out.filter((p) => Number(p.areaSqm || 0) <= aMax);

    if (sort === 'price-asc') out.sort((a, b) => Number(a.priceTotal || 0) - Number(b.priceTotal || 0));
    if (sort === 'price-desc') out.sort((a, b) => Number(b.priceTotal || 0) - Number(a.priceTotal || 0));
    if (sort === 'area-asc') out.sort((a, b) => Number(a.areaSqm || 0) - Number(b.areaSqm || 0));
    if (sort === 'area-desc') out.sort((a, b) => Number(b.areaSqm || 0) - Number(a.areaSqm || 0));
    if (sort === 'date-desc')
      out.sort((a, b) => ((b.createdAt as { seconds?: number })?.seconds || 0) - ((a.createdAt as { seconds?: number })?.seconds || 0));
    if (sort === 'date-asc')
      out.sort((a, b) => ((a.createdAt as { seconds?: number })?.seconds || 0) - ((b.createdAt as { seconds?: number })?.seconds || 0));

    // Featured ขึ้นบนเสมอ (stable secondary sort) — ภายในกลุ่ม featured เรียงตาม featuredAt desc (ปักล่าสุดขึ้นบน)
    out.sort((a, b) => {
      const af = a.isFeatured ? 1 : 0;
      const bf = b.isFeatured ? 1 : 0;
      if (bf !== af) return bf - af;
      if (af === 1) {
        const at = (a.featuredAt as { seconds?: number })?.seconds || 0;
        const bt = (b.featuredAt as { seconds?: number })?.seconds || 0;
        return bt - at;
      }
      return 0;
    });

    return out;
  }, [plots, status, closed, province, priceMin, priceMax, areaMin, areaMax, sort]);

  function clearFilters() {
    setStatus('all');
    setClosed('all');
    setProvince('');
    setPriceMin('');
    setPriceMax('');
    setAreaMin('');
    setAreaMax('');
    setSort('');
  }

  return (
    <div className="min-h-[100dvh] bg-[#0d1520] pb-[calc(6rem+env(safe-area-inset-bottom))] text-[#dce8f5]">
      {/* Header */}
      <div className="flex h-[52px] items-center justify-between border-b border-[#213045] bg-[#162030] px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-[#7a9ab8]">
            ← กลับ
          </Link>
          <span className="text-base font-bold">🗂 รายการที่ดิน</span>
        </div>
        <span className="text-[11px] text-[#7a9ab8]">{filtered.length} / {plots.length} แปลง</span>
      </div>

      {/* Filters — scroll แนวนอนบนมือถือ, wrap บน desktop */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#213045] bg-[#162030] p-3 sm:flex-wrap">
        {(['all', 'available', 'reserved', 'sold'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              if (s !== 'sold') setClosed('all'); // #18 reset sub-filter
            }}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
              status === s
                ? 'bg-[#00e676] text-[#001a0a] font-bold'
                : 'bg-[#1e2d42] text-[#7a9ab8]'
            }`}
          >
            {s === 'all' ? 'ทั้งหมด' : statusLabelShort[s]}
          </button>
        ))}
        {/* #18 sub-filter chip — แสดงเฉพาะตอนเลือก "ขายแล้ว" */}
        {status === 'sold' && (
          <button
            onClick={() => setClosed(closed === 'verified' ? 'all' : 'verified')}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
              closed === 'verified'
                ? 'bg-[#40c4ff] text-[#0d1520] font-bold'
                : 'bg-[#1e2d42] text-[#7a9ab8]'
            }`}
          >
            🛡️ Verified
          </button>
        )}

        <input
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          placeholder="จังหวัด"
          className="w-24 shrink-0 rounded-md border border-[#213045] bg-[#1e2d42] px-2 py-1 text-xs outline-none"
        />
        <input
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          placeholder="ราคา ≥"
          type="number"
          className="w-24 shrink-0 rounded-md border border-[#213045] bg-[#1e2d42] px-2 py-1 text-xs outline-none"
        />
        <input
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          placeholder="ราคา ≤"
          type="number"
          className="w-24 shrink-0 rounded-md border border-[#213045] bg-[#1e2d42] px-2 py-1 text-xs outline-none"
        />
        <input
          value={areaMin}
          onChange={(e) => setAreaMin(e.target.value)}
          placeholder="ตร.ม. ≥"
          type="number"
          className="w-24 shrink-0 rounded-md border border-[#213045] bg-[#1e2d42] px-2 py-1 text-xs outline-none"
        />
        <input
          value={areaMax}
          onChange={(e) => setAreaMax(e.target.value)}
          placeholder="ตร.ม. ≤"
          type="number"
          className="w-24 shrink-0 rounded-md border border-[#213045] bg-[#1e2d42] px-2 py-1 text-xs outline-none"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="shrink-0 rounded-md border border-[#213045] bg-[#1e2d42] px-2 py-1 text-xs"
        >
          <option value="">เรียงตาม...</option>
          <option value="price-asc">ราคา ↑</option>
          <option value="price-desc">ราคา ↓</option>
          <option value="area-asc">พื้นที่ ↑</option>
          <option value="area-desc">พื้นที่ ↓</option>
          <option value="date-desc">ใหม่สุด</option>
          <option value="date-asc">เก่าสุด</option>
        </select>
        <button
          onClick={clearFilters}
          className="shrink-0 rounded-md border border-[#213045] px-2 py-1 text-xs text-[#7a9ab8]"
        >
          ล้าง
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((p) => (
          <PlotCard key={p.id} plot={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="p-10 text-center text-sm text-[#7a9ab8]">ไม่พบข้อมูลแปลง</div>
      )}
    </div>
  );
}

function PlotCard({ plot: p }: { plot: PlotPoint }) {
  const add = useCompareStore((s) => s.add);
  const has = useCompareStore((s) => s.has);
  const inCompare = has(p.id);
  const thumb = p.photos?.[0] || p.photoUrls?.[0];
  const st = p.status || 'available';
  // #18 verified sale → badge แยก (สีฟ้า + ไอคอนโล่)
  const isVerifiedSale = st === 'sold' && p.closeType === 'verified';
  const badgeColor = isVerifiedSale ? '#40c4ff' : statusColor[st];
  const badgeLabel = isVerifiedSale ? '🛡️ Verified' : statusLabelShort[st];

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const r = add(p);
    if (r === 'exists') alert('อยู่ในรายการเปรียบเทียบแล้ว');
    else if (r === 'full') alert('เปรียบเทียบได้สูงสุด 4 แปลง');
  }

  return (
    <Link
      href={`/plot/${p.id}`}
      className="group relative overflow-hidden rounded-lg bg-[#162030] transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full bg-[#213045]">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🗺</div>
        )}
        <span
          className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: badgeColor + '33', color: badgeColor, border: `1px solid ${badgeColor}55` }}
        >
          {badgeLabel}
        </span>
        {p.isFeatured && (
          <span
            className="absolute left-2 top-9 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: '#ffb300', color: '#0d1520' }}
            title="ที่ดินแนะนำ"
          >⭐ แนะนำ</span>
        )}
        <button
          onClick={handleCompare}
          className={`absolute right-2 top-2 rounded-md border-0 px-2 py-0.5 text-[10px] font-bold ${
            inCompare ? 'bg-[#00e676] text-[#001a0a]' : 'bg-black/60 text-[#dce8f5]'
          }`}
          title="เปรียบเทียบ"
        >
          {inCompare ? '✓ เทียบ' : '⇆ เทียบ'}
        </button>
      </div>
      <div className="p-2.5">
        <div className="truncate text-[12.5px] font-semibold">{p.name || 'ไม่ระบุชื่อ'}</div>
        <div className="truncate text-[10.5px] text-[#7a9ab8]">
          {[p.tambon, p.amphoe, p.province].filter(Boolean).join(', ') || '-'}
        </div>
        <div className="text-[12px] font-semibold text-[#00e676]">{formatPrice(p)}</div>
        <div className="text-[10px] text-[#7a9ab8]">{formatArea(p)}</div>
      </div>
    </Link>
  );
}

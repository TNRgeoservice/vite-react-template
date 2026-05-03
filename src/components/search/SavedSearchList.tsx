// ════════════════════════════════════════
// src/components/search/SavedSearchList.tsx
// แสดงรายการ saved search ของ user — toggle / ลบ / apply
// ════════════════════════════════════════
'use client';

import { useRouter } from 'next/navigation';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { usePlotStore } from '@/store/plotStore';
import { useUIStore } from '@/store/uiStore';

function summarize(f: ReturnType<typeof Object>): string {
  const parts: string[] = [];
  if (f.province) parts.push(f.province);
  if (f.priceMin != null || f.priceMax != null) {
    const a = f.priceMin != null ? Number(f.priceMin).toLocaleString('th-TH') : '0';
    const b = f.priceMax != null ? Number(f.priceMax).toLocaleString('th-TH') : '∞';
    parts.push(`฿${a}–${b}`);
  }
  if (f.areaMin != null || f.areaMax != null) {
    const a = f.areaMin != null ? Number(f.areaMin).toLocaleString('th-TH') : '0';
    const b = f.areaMax != null ? Number(f.areaMax).toLocaleString('th-TH') : '∞';
    parts.push(`${a}–${b} ตร.ม.`);
  }
  if (f.titleType) parts.push(f.titleType);
  if (f.status && f.status !== 'all') parts.push(f.status);
  return parts.join(' · ');
}

export function SavedSearchList() {
  const router = useRouter();
  const { items, loading, remove, toggle } = useSavedSearches();
  const setFilters = usePlotStore((s) => s.setFilters);
  const setFilterOpen = useUIStore((s) => s.setFilterOpen);

  if (loading) {
    return <div className="text-center text-xs text-[#7a9ab8] py-3">กำลังโหลด...</div>;
  }
  if (!items.length) {
    return (
      <div className="rounded-xl border border-[#213045] bg-[#162030] p-4 text-center text-xs text-[#7a9ab8]">
        ยังไม่มีการค้นหาที่บันทึก — บันทึกจาก 🔍 ในหน้าแผนที่
      </div>
    );
  }

  function applyAndOpen(filters: any) {
    setFilters(filters);
    setFilterOpen(false);
    router.push('/');
  }

  return (
    <div className="space-y-2">
      {items.map((s) => (
        <div key={s.id} className="rounded-xl border border-[#213045] bg-[#162030] p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                🔔 {s.name}
              </div>
              <div className="mt-0.5 truncate text-[11px] text-[#7a9ab8]">
                {summarize(s.filters)}
              </div>
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[11px] text-[#7a9ab8]">
              <input
                type="checkbox"
                checked={s.enabled}
                onChange={(e) => toggle(s.id, e.target.checked)}
                className="accent-[#00e676]"
              />
              {s.enabled ? 'เปิด' : 'ปิด'}
            </label>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => applyAndOpen(s.filters)}
              className="flex-1 rounded-md border border-[#40c4ff] bg-[#0d2030] px-2 py-1 text-[11px] text-[#40c4ff]"
            >เปิดดูในแผนที่</button>
            <button
              onClick={() => { if (confirm('ลบ "' + s.name + '"?')) remove(s.id); }}
              className="rounded-md border border-[#213045] bg-[#0d1520] px-2 py-1 text-[11px] text-[#ff5252]"
            >ลบ</button>
          </div>
        </div>
      ))}
    </div>
  );
}

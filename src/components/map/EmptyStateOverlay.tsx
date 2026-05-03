'use client';
// ════════════════════════════════════════
// components/map/EmptyStateOverlay.tsx
// โชว์ตอนยังไม่เลือกจังหวัด — กดแล้วเปิด FilterSidebar
// รอ persist hydrate ก่อน (กัน flash) + ซ่อนถ้ามี ?plot= ใน URL
// ════════════════════════════════════════
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { usePlotStore } from '@/store/plotStore';

export default function EmptyStateOverlay() {
  const province = usePlotStore((s) => s.filters.province);
  const setFilterOpen = useUIStore((s) => s.setFilterOpen);
  const filterOpen = useUIStore((s) => s.filterOpen);
  const searchParams = useSearchParams();
  const hasPlotParam = !!searchParams?.get('plot');

  // รอ zustand persist hydrate จาก localStorage ก่อน (กัน flash overlay)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = usePlotStore.persist.onFinishHydration(() => setHydrated(true));
    if (usePlotStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  if (!hydrated) return null;
  if (province) return null;
  if (filterOpen) return null; // กำลังเลือกอยู่
  if (hasPlotParam) return null; // มาจาก ?plot= → MapHub จะ auto-set province

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[700] flex items-center justify-center
                 md:pl-0"
    >
      <div
        className="pointer-events-auto max-w-xs rounded-2xl border border-[#213045] bg-[#111c2b]/95
                   px-6 py-5 text-center shadow-2xl backdrop-blur"
      >
        <div className="text-4xl mb-2">📍</div>
        <div className="text-sm font-semibold text-[#dce8f5] mb-1">
          เริ่มค้นหาแปลงที่ดิน
        </div>
        <div className="text-xs text-[#7a9ab8] mb-4">
          กรุณาเลือกจังหวัดก่อน เพื่อดูแปลงในพื้นที่
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="w-full rounded-md bg-[#40c4ff] px-4 py-2 text-sm font-semibold text-[#0d1520]
                     hover:bg-[#29b6f6] transition-colors"
        >
          🔍 เลือกจังหวัด
        </button>
      </div>
    </div>
  );
}

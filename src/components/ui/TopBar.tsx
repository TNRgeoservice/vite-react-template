// ════════════════════════════════════════
// components/ui/TopBar.tsx
// Fixed top bar (52px) — menu icon-tile (36) + title stack + segmented link
// README §Top bar
// ════════════════════════════════════════
'use client';

import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useUnreadDM } from '@/hooks/useUnreadDM';

export function TopBar() {
  const setDrawerOpen = useUIStore((s) => s.setDrawerOpen);
  const toggleFilter = useUIStore((s) => s.toggleFilter);
  const filterOpen = useUIStore((s) => s.filterOpen);
  const unreadDM = useUnreadDM();

  return (
    <header
      className="fixed inset-x-0 top-0 z-[800] flex h-top-h items-center gap-3
                 border-b border-brd bg-bg2 px-3 text-tx"
    >
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="เมนู"
        className="relative flex h-tbi w-tbi items-center justify-center rounded-md-t text-xl
                   active:opacity-[.78] transition-opacity duration-tnr-fast"
      >
        ☰
        {unreadDM > 0 && (
          <span
            aria-label={`${unreadDM} ข้อความใหม่`}
            className="absolute right-0.5 top-0.5 inline-flex min-w-[16px] items-center justify-center
                       rounded-full bg-[#ef4444] px-1 text-[9px] font-bold leading-4 text-white shadow"
          >
            {unreadDM > 9 ? '9+' : unreadDM}
          </span>
        )}
      </button>

      <button
        onClick={toggleFilter}
        aria-label="ค้นหา/กรอง"
        aria-pressed={filterOpen}
        className={`flex h-tbi w-tbi items-center justify-center rounded-md-t text-lg
                    active:opacity-[.78] transition-all duration-tnr-fast
                    ${filterOpen ? 'bg-[#40c4ff] text-[#0d1520]' : 'text-tx'}`}
        title="ค้นหาแปลง / กรอง"
      >
        🔍
      </button>

      <div className="flex-1 leading-tight">
        <div className="text-[13.5px] font-semibold tracking-[-0.2px]">TNR MapHub</div>
        <div className="font-mono text-xs-t text-txd">beta</div>
      </div>

      <Link
        href="/cards"
        className="rounded-md-t bg-bg3 px-2.5 py-1 text-[11px] text-tx
                   active:opacity-[.78] transition-opacity duration-tnr-fast"
        title="รายการที่ดิน"
      >
        🗂 รายการ
      </Link>
    </header>
  );
}

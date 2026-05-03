// ════════════════════════════════════════
// components/compare/CompareBar.tsx
// Floating bottom bar when >=1 plot in compare list
// ════════════════════════════════════════
'use client';

import Link from 'next/link';
import { useCompareStore, MAX_COMPARE } from '@/store/compareStore';

export function CompareBar() {
  const items  = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear  = useCompareStore((s) => s.clear);

  if (items.length === 0) return null;

  const ready = items.length >= 2;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[8500] flex flex-wrap items-center gap-2
                 border-t border-brd bg-bg2 px-4 py-2 shadow-float"
    >
      <span className="shrink-0 text-xs-t text-tx2">
        🔍 เปรียบเทียบ ({items.length}/{MAX_COMPARE})
      </span>

      <div className="flex flex-1 gap-1.5 overflow-x-auto">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap
                       rounded-md-t bg-bg3 px-2 py-1 text-[11px] text-tx"
          >
            <span className="max-w-[100px] overflow-hidden text-ellipsis">
              {p.name || p.id}
            </span>
            <button
              onClick={() => remove(p.id)}
              className="border-0 bg-transparent p-0 text-sm leading-none text-red
                         active:opacity-[.78]"
              aria-label="ลบ"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <Link
        href="/compare"
        className={
          'shrink-0 rounded-md-t px-3.5 py-1.5 text-xs-t font-semibold ' +
          'transition-opacity duration-tnr-fast ease-tnr-ease ' +
          (ready
            ? 'bg-acc text-[#001a0a] active:opacity-[.78]'
            : 'bg-bg3 text-tx2 pointer-events-none')
        }
      >
        เปรียบเทียบ →
      </Link>

      <button
        onClick={clear}
        className="shrink-0 rounded-md-t border-[1.5px] border-brd bg-transparent
                   px-2.5 py-1.5 text-xs-t text-tx2 active:opacity-[.78]
                   transition-opacity duration-tnr-fast"
      >
        ล้าง
      </button>
    </div>
  );
}

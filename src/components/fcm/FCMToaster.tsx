// ════════════════════════════════════════
// src/components/fcm/FCMToaster.tsx
// Foreground FCM toast banner (mounted in root layout)
// ════════════════════════════════════════
'use client';

import Link from 'next/link';
import { useFCM } from '@/hooks/useFCM';

const COLORS: Record<string, string> = {
  chat: '#00e676',
  priceDrop: '#ffb300',
  slipPaid: '#40c4ff',
  confirmed: '#00e676',
  info: '#b388ff',
};

export function FCMToaster() {
  const { toasts, dismissToast } = useFCM();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-[calc(env(safe-area-inset-top)+12px)] z-[2200] flex w-[90%] max-w-[360px] -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => {
        const accent = COLORS[t.type] || COLORS.info;
        const inner = (
          <div className="flex items-start gap-2.5 rounded-2xl border border-[#213045] bg-[#111c2b] p-3 shadow-2xl">
            <div className="mt-0.5 shrink-0 text-xl">{t.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold" style={{ color: accent }}>
                {t.title}
              </div>
              <div className="mt-0.5 line-clamp-2 text-[11.5px] text-[#7a9ab8]">{t.body}</div>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismissToast(t.id); }}
              className="shrink-0 px-1 text-xs text-[#7a9ab8]"
            >✕</button>
          </div>
        );
        return (
          <div key={t.id} className="pointer-events-auto">
            {t.url
              ? <Link href={t.url} onClick={() => dismissToast(t.id)}>{inner}</Link>
              : inner}
          </div>
        );
      })}
    </div>
  );
}

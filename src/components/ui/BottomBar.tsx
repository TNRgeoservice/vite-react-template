// ════════════════════════════════════════
// components/ui/BottomBar.tsx
// Fixed bottom bar (62px) — 3 tabs with emoji icon + label.
// Active tab = entity-color border + 9% tint background (README §Bottom bar)
// ════════════════════════════════════════
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tone = 'acc' | 'land' | 'road' | 'poly';
interface Tab {
  href:  string;
  icon:  string;
  label: string;
  tone:  Tone;
}

const TONE_HEX: Record<Tone, string> = {
  acc:  '#00e676',
  land: '#40c4ff',
  road: '#ffb300',
  poly: '#b388ff',
};
const TONE_RGB: Record<Tone, string> = {
  acc:  '0,230,118',
  land: '64,196,255',
  road: '255,179,0',
  poly: '179,136,255',
};

const DEFAULT_TABS: Tab[] = [
  { href: '/',         icon: '🗺', label: 'แผนที่',    tone: 'acc'  },
  { href: '/cards',    icon: '🗂', label: 'รายการ',    tone: 'land' },
  { href: '/favorites',icon: '❤️', label: 'รายการโปรด', tone: 'road' },
];

export function BottomBar({ tabs = DEFAULT_TABS }: { tabs?: Tab[] }) {
  const pathname = usePathname() || '/';

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[800] flex h-bar-h items-stretch
                 border-t border-brd bg-bg2"
    >
      {tabs.map((t) => {
        const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={
              'flex flex-1 flex-col items-center justify-center gap-1 ' +
              'border-t-[2px] transition-colors duration-tnr-fast ease-tnr-ease ' +
              'active:opacity-[.78] '
            }
            style={
              active
                ? {
                    borderTopColor: TONE_HEX[t.tone],
                    background:     `rgba(${TONE_RGB[t.tone]}, .09)`,
                    color:          TONE_HEX[t.tone],
                  }
                : { borderTopColor: 'transparent', color: '#7a9ab8' }
            }
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span className="text-xs-t font-medium tracking-[-0.1px]">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ════════════════════════════════════════
// components/ui/StatusBadge.tsx
// Recipe (README §Status badges):
//   rgba(.15)/rgba(.3)/COLOR pill, p=2/8, r=pill, fs=10, w=700.
//   Position top-left on photos.
// ════════════════════════════════════════
import { ReactNode } from 'react';

export type StatusKind = 'available' | 'reserved' | 'sold';

const RECIPE: Record<StatusKind, { bg: string; brd: string; fg: string; label: string; icon: string }> = {
  available: { bg: 'rgba(0,230,118,.15)',  brd: 'rgba(0,230,118,.3)',  fg: '#00e676', label: 'ว่าง',   icon: '✅' },
  reserved:  { bg: 'rgba(255,179,0,.15)',  brd: 'rgba(255,179,0,.3)',  fg: '#ffb300', label: 'จอง',   icon: '⏳' },
  sold:      { bg: 'rgba(255,82,82,.15)',  brd: 'rgba(255,82,82,.3)',  fg: '#ff5252', label: 'ขายแล้ว', icon: '🔴' },
};

interface Props {
  status: StatusKind;
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, children, className = '', showIcon = false }: Props) {
  const r = RECIPE[status];
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-pill px-2 py-[2px] ' +
        'text-xs-t font-semibold border ' + className
      }
      style={{ background: r.bg, borderColor: r.brd, color: r.fg }}
    >
      {showIcon && <span>{r.icon}</span>}
      {children ?? r.label}
    </span>
  );
}

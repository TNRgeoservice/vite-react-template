// ════════════════════════════════════════
// components/plot/PlotCard.tsx
// Grid card for plot listings.
// README §Cards layout:
//   photo (4:3, object-cover)
//   → status badge top-left
//   → compare button top-right
//   → body: name 12.5/600 · location 10.5 muted · price 13 acc · area 10 road
// ════════════════════════════════════════
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { PlotPoint } from '@/types/plot';

interface Props {
  plot: PlotPoint;
  href?: string;
  onCompare?: (p: PlotPoint) => void;
  inCompare?: boolean;
}

const RAI = 1600; // 1 rai = 1,600 sqm

function fmtPrice(v: number | string | null | undefined) {
  if (v == null || v === '') return 'ติดต่อสอบถาม';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (!Number.isFinite(n)) return 'ติดต่อสอบถาม';
  return '฿' + n.toLocaleString('th-TH');
}
function fmtArea(sqm: number | string | null | undefined) {
  if (sqm == null || sqm === '') return '—';
  const n = typeof sqm === 'string' ? parseFloat(sqm) : sqm;
  if (!Number.isFinite(n)) return '—';
  if (n >= RAI) return `${(n / RAI).toFixed(2)} ไร่`;
  return `${n.toLocaleString('th-TH')} ตร.ม.`;
}

export function PlotCard({ plot, href, onCompare, inCompare = false }: Props) {
  const photo = plot.photos?.[0] || plot.photoUrls?.[0];
  const loc = [plot.province, plot.amphoe].filter(Boolean).join(' · ') || '—';

  const body = (
    <>
      <div className="relative aspect-[4/3] bg-bg3">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={plot.name || ''} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-txd">🏞</div>
        )}
        <div className="absolute left-2 top-2">
          <StatusBadge status={plot.status || 'available'} />
        </div>
        {onCompare && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompare(plot); }}
            className={
              'absolute right-2 top-2 rounded-pill border-[1.5px] ' +
              'px-2 py-[2px] text-xs-t font-semibold ' +
              'transition-opacity duration-tnr-fast ease-tnr-ease active:opacity-[.78] ' +
              (inCompare
                ? 'border-acc bg-[rgba(0,230,118,.08)] text-acc'
                : 'border-brd bg-bg2/70 text-tx2 backdrop-blur-tnr')
            }
            aria-label={inCompare ? 'ออกจากเปรียบเทียบ' : 'เพิ่มเปรียบเทียบ'}
          >
            {inCompare ? '✔' : '＋'}
          </button>
        )}
      </div>
      <div className="p-sp3 space-y-[3px]">
        <div className="text-[12.5px] font-semibold text-tx line-clamp-1 tracking-[-0.1px]">
          {plot.name || '—'}
        </div>
        <div className="text-[10.5px] text-tx2 line-clamp-1">{loc}</div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-body-t font-semibold text-acc">{fmtPrice(plot.priceTotal)}</span>
          <span className="text-xs-t font-medium text-road">{fmtArea(plot.areaSqm)}</span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <Card interactive>{body}</Card>
      </Link>
    );
  }
  return <Card interactive>{body}</Card>;
}

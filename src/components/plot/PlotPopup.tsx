// ════════════════════════════════════════
// components/plot/PlotPopup.tsx
// Renderer for Leaflet popup content
// (mount with `renderToStaticMarkup` or `createRoot`).
// Content stack: title + badge → price → area → contact → coord → two actions
// README §Map popup — width ~290, bg2, r=12, sh-popup
// ════════════════════════════════════════
'use client';

import type { PlotPoint } from '@/types/plot';

const RAI = 1600;

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
function fmtCoord(lat?: number | null, lng?: number | null) {
  if (lat == null || lng == null) return '—';
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

interface Props {
  plot:        PlotPoint;
  onDetail?:   () => void;
  onContact?:  () => void;
}

export function PlotPopup({ plot, onDetail, onContact }: Props) {
  const status = plot.status || 'available';
  const photo  = plot.photos?.[0] || plot.photoUrls?.[0];

  return (
    <div className="tnr-pop" style={{ width: 290 }}>
      <div className="tnr-pop-t">
        <span>{plot.name || '—'}</span>
        <span className={`tnr-st-tag tnr-st-${status}`}>
          {status === 'available' ? 'ว่าง' : status === 'reserved' ? 'จอง' : 'ขายแล้ว'}
        </span>
      </div>

      <div className="tnr-pop-r">
        <span className="tnr-pop-k">ราคา</span>
        <span className="tnr-pop-hl">{fmtPrice(plot.priceTotal)}</span>
      </div>

      <div className="tnr-pop-r">
        <span className="tnr-pop-k">พื้นที่</span>
        <span className="tnr-pop-area">{fmtArea(plot.areaSqm)}</span>
      </div>

      {plot.phone && (
        <div className="tnr-pop-r">
          <span className="tnr-pop-k">โทร</span>
          <a className="tnr-pop-phone" href={`tel:${plot.phone}`}>{plot.phone}</a>
        </div>
      )}

      <div className="tnr-pop-meta">{fmtCoord(plot.lat, plot.lng)}</div>

      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="tnr-pop-img" src={photo} alt={plot.name || ''} />
      )}

      <div className="tnr-pop-actions">
        <button
          type="button"
          onClick={onDetail}
          className="tnr-pop-btn tnr-pop-detail"
        >
          📄 รายละเอียด
        </button>
        <button
          type="button"
          onClick={onContact}
          className="tnr-pop-btn tnr-pop-contact"
        >
          💬 ติดต่อ
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// components/plot/PlotPrintSheet.tsx
// Offline / PDF print summary — soft brown parchment theme
// README §Colors — print sheet: --print-bg/-card/-ink/-ink2/-muted/-brd/-accent/-price
// ════════════════════════════════════════
import type { PlotPoint } from '@/types/plot';
import { QUALITY_LABELS, getBuildingType } from '@/lib/buildingPriceTable';

const RAI = 1600;

function fmtPrice(v: number | string | null | undefined) {
  if (v == null || v === '') return '—';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (!Number.isFinite(n)) return '—';
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

/** Inline SVG phone icon — the one vector exception in the design system. */
function PhoneIcon() {
  return (
    <svg className="ps-ft-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.1 15.1 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1A18 18 0 013 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
    </svg>
  );
}

interface Props {
  plot: PlotPoint;
}

/**
 * Single-page parchment summary. Print via `window.print()` or embed in a
 * route styled with `@media print`.
 */
export function PlotPrintSheet({ plot }: Props) {
  const loc = [plot.tambon, plot.amphoe, plot.province].filter(Boolean).join(' · ') || '—';

  // ราคา/ตร.วา + รายการสิ่งปลูกสร้าง
  const buildings = Array.isArray(plot.buildings) ? plot.buildings : [];
  const hasBuildings = buildings.length > 0;
  const buildingTotal = typeof plot.buildingValueTotal === 'number' ? plot.buildingValueTotal : 0;
  const landPriceWa: number | null = (() => {
    if (typeof plot.landPricePerSqWa === 'number') return plot.landPricePerSqWa;
    if (plot.priceTotal != null && plot.priceTotal !== '' && plot.areaSqm != null) {
      const sqm = Number(plot.areaSqm);
      const wa = sqm / 4;
      if (wa > 0) return (Number(plot.priceTotal) - buildingTotal) / wa;
    }
    return null;
  })();
  const fmtBaht = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

  return (
    <article
      className="mx-auto max-w-[720px] p-sp8 font-sans"
      style={{ background: 'var(--print-bg)', color: 'var(--print-ink)' }}
    >
      {/* Header */}
      <header
        className="mb-sp6 flex items-center justify-between pb-sp5"
        style={{ borderBottom: '1px solid var(--print-brd)' }}
      >
        <div>
          <div
            className="font-mono text-xs-t uppercase tracking-[1.5px]"
            style={{ color: 'var(--print-muted)' }}
          >
            TNR MapHub · สรุปแปลงที่ดิน
          </div>
          <h1
            className="mt-1 text-2xl-t font-semibold tracking-[-0.2px]"
            style={{ color: 'var(--print-ink)' }}
          >
            {plot.name || '—'}
          </h1>
          <div className="text-body-t" style={{ color: 'var(--print-ink2)' }}>{loc}</div>
        </div>
        <div
          className="rounded-lg-t px-sp5 py-sp4 text-right"
          style={{ background: 'var(--print-price)', color: 'var(--print-accent)' }}
        >
          <div className="text-xs-t" style={{ color: 'var(--print-ink2)' }}>ราคา</div>
          <div className="text-xl-t font-semibold tracking-[-0.2px]">
            {fmtPrice(plot.priceTotal)}
          </div>
          {hasBuildings && buildingTotal > 0 && (
            <div className="mt-1 text-xs-t" style={{ color: 'var(--print-ink2)' }}>
              สิ่งปลูกสร้าง {fmtBaht(buildingTotal)} ฿
            </div>
          )}
          {landPriceWa != null && (
            <div className="text-xs-t" style={{ color: 'var(--print-ink2)' }}>
              {hasBuildings && buildingTotal > 0
                ? `ที่ดิน ${fmtBaht(landPriceWa)} ฿/ตร.ว.`
                : `${fmtBaht(landPriceWa)} ฿/ตร.ว.`}
            </div>
          )}
        </div>
      </header>

      {/* Body grid */}
      <section
        className="grid grid-cols-2 gap-sp5 rounded-lg-t p-sp5"
        style={{ background: 'var(--print-card)', border: '1px solid var(--print-brd)' }}
      >
        <Row label="พื้นที่"       value={fmtArea(plot.areaSqm)} />
        <Row label="ประเภทโฉนด"   value={plot.titleType || '—'} />
        <Row label="ผังเมือง"      value={plot.zoning || '—'} />
        <Row label="ถนนเข้า"       value={plot.roadAcc || '—'} />
        <Row label="แลนด์มาร์ค"    value={plot.landmark || '—'} />
        <Row label="พิกัด GPS"     value={fmtCoord(plot.lat, plot.lng)} mono />
      </section>

      {hasBuildings && (
        <section className="mt-sp5">
          <div
            className="mb-sp2 font-mono text-xs-t uppercase tracking-[1.5px]"
            style={{ color: 'var(--print-muted)' }}
          >
            สิ่งปลูกสร้าง ({buildings.length} หลัง)
          </div>
          <div
            className="rounded-lg-t p-sp4"
            style={{ background: 'var(--print-card)', border: '1px solid var(--print-brd)' }}
          >
            {buildings.map((b, i) => {
              const entry = getBuildingType(b.typeCode);
              return (
                <div
                  key={i}
                  className="py-sp2"
                  style={{
                    borderBottom: i < buildings.length - 1 ? '1px solid var(--print-brd)' : undefined,
                  }}
                >
                  <div className="text-md-t font-medium" style={{ color: 'var(--print-ink)' }}>
                    {entry?.label || b.typeCode}
                  </div>
                  <div className="text-xs-t" style={{ color: 'var(--print-ink2)' }}>
                    คุณภาพ{QUALITY_LABELS[b.quality]} · {b.areaSqm.toLocaleString('th-TH')} ตร.ม. · พ.ศ. {b.builtYearBE} ·
                    หักค่าเสื่อม {b.depreciationRate.toFixed(2)}% =
                    <span className="ml-1 font-medium" style={{ color: 'var(--print-accent)' }}>
                      {fmtBaht(b.netValue)} ฿
                    </span>
                  </div>
                </div>
              );
            })}
            {buildingTotal > 0 && (
              <div
                className="mt-sp2 flex justify-between pt-sp2"
                style={{ borderTop: '1px solid var(--print-brd)' }}
              >
                <span className="text-xs-t" style={{ color: 'var(--print-muted)' }}>
                  รวมหลังหักค่าเสื่อม
                </span>
                <span className="text-md-t font-semibold" style={{ color: 'var(--print-accent)' }}>
                  {fmtBaht(buildingTotal)} ฿
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {plot.notes && (
        <section className="mt-sp5">
          <div
            className="mb-sp2 font-mono text-xs-t uppercase tracking-[1.5px]"
            style={{ color: 'var(--print-muted)' }}
          >
            หมายเหตุ
          </div>
          <p className="text-body-t leading-[1.55]" style={{ color: 'var(--print-ink)' }}>
            {plot.notes}
          </p>
        </section>
      )}

      {/* Footer — contact */}
      <footer
        className="mt-sp7 flex items-center justify-between pt-sp5"
        style={{ borderTop: '1px solid var(--print-brd)' }}
      >
        <div
          className="font-mono text-xs-t uppercase tracking-[1.5px]"
          style={{ color: 'var(--print-muted)' }}
        >
          TNR Geoservice
        </div>
        {plot.phone && (
          <div
            className="flex items-center gap-sp2 text-body-t font-medium"
            style={{ color: 'var(--print-accent)' }}
          >
            <PhoneIcon />
            <span>{plot.phone}</span>
          </div>
        )}
      </footer>
    </article>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs-t" style={{ color: 'var(--print-muted)' }}>{label}</div>
      <div
        className={'text-md-t ' + (mono ? 'font-mono' : 'font-medium')}
        style={{ color: 'var(--print-ink)' }}
      >
        {value}
      </div>
    </div>
  );
}

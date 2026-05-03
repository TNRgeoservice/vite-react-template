'use client';
// ════════════════════════════════════════
// components/map/FilterSidebar.tsx
// Filter panel — desktop sidebar (ซ้าย 320px) / mobile bottom sheet
// Sync URL: ?province=&priceMin=&priceMax=&areaMin=&areaMax=&titleType=&status=&closed=
// ════════════════════════════════════════
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { usePlotStore, EMPTY_FILTERS, type SearchFilters } from '@/store/plotStore';
import { PROVINCE_NAMES } from '@/lib/provinces';
import { useAuthStore } from '@/store/authStore';
import { useSavedSearches } from '@/hooks/useSavedSearches';

const TITLE_TYPES = ['โฉนด', 'น.ส.3ก', 'น.ส.3', 'ส.ป.ก.', 'ส.ค.1', 'อื่นๆ'];
const STATUSES: Array<{ v: SearchFilters['status']; label: string; color: string }> = [
  { v: 'all',       label: 'ทั้งหมด', color: '#7a9ab8' },
  { v: 'available', label: 'ว่าง',    color: '#00e676' },
  { v: 'reserved',  label: 'จอง',     color: '#ffb300' },
  { v: 'sold',      label: 'ขายแล้ว', color: '#ff5252' },
];

// ── URL <-> filters helpers ──
function filtersFromURL(sp: URLSearchParams): SearchFilters {
  const num = (k: string): number | null => {
    const v = sp.get(k);
    if (v == null || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  };
  const s = sp.get('status') as SearchFilters['status'] | null;
  const c = sp.get('closed') as SearchFilters['closed'] | null;
  return {
    province:  sp.get('province') || null,
    priceMin:  num('priceMin'),
    priceMax:  num('priceMax'),
    areaMin:   num('areaMin'),
    areaMax:   num('areaMax'),
    titleType: sp.get('titleType') || null,
    status:    s && ['all','available','reserved','sold'].includes(s) ? s : 'all',
    closed:    c && ['all','verified'].includes(c) ? c : 'all',
  };
}

function filtersToURL(f: SearchFilters): string {
  const sp = new URLSearchParams();
  if (f.province)  sp.set('province', f.province);
  if (f.priceMin  != null) sp.set('priceMin',  String(f.priceMin));
  if (f.priceMax  != null) sp.set('priceMax',  String(f.priceMax));
  if (f.areaMin   != null) sp.set('areaMin',   String(f.areaMin));
  if (f.areaMax   != null) sp.set('areaMax',   String(f.areaMax));
  if (f.titleType) sp.set('titleType', f.titleType);
  if (f.status && f.status !== 'all') sp.set('status', f.status);
  if (f.closed && f.closed !== 'all') sp.set('closed', f.closed);
  return sp.toString();
}

export default function FilterSidebar() {
  const filterOpen  = useUIStore((s) => s.filterOpen);
  const setFilterOpen = useUIStore((s) => s.setFilterOpen);
  const filters     = usePlotStore((s) => s.filters);
  const setFilters  = usePlotStore((s) => s.setFilters);
  const resetFilters = usePlotStore((s) => s.resetFilters);

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // ── Init from URL (once) ──
  // ถ้า URL มี filter param → ใช้จาก URL (deep link / share)
  // ถ้า URL ว่าง หรือ URL มีแค่ ?plot= → คง store เดิม (จาก persist localStorage)
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (initialized) return;
    const params = new URLSearchParams(sp.toString());
    const FILTER_KEYS = ['province', 'priceMin', 'priceMax', 'areaMin', 'areaMax', 'titleType', 'status', 'closed'];
    const hasUrlFilters = FILTER_KEYS.some((k) => params.has(k));
    if (hasUrlFilters) {
      const f = filtersFromURL(params);
      setFilters(f);
      if (f.province) setFilterOpen(false);
    }
    setInitialized(true);
  }, [initialized, sp, setFilters, setFilterOpen]);

  // ── Sync filters → URL ──
  useEffect(() => {
    if (!initialized) return;
    const qs = filtersToURL(filters);
    const target = qs ? `${pathname}?${qs}` : pathname;
    const current = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
    if (target !== current) {
      router.replace(target, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, initialized]);

  if (!filterOpen) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className="fixed inset-0 z-[900] bg-black/40 md:hidden"
        onClick={() => setFilterOpen(false)}
      />

      {/* Panel */}
      <aside
        className="fixed z-[901] flex flex-col overflow-hidden bg-[#111c2b] text-[#dce8f5]
                   border-[#213045]
                   /* mobile: bottom sheet */
                   inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t
                   /* desktop: left sidebar */
                   md:inset-y-0 md:right-auto md:top-[52px] md:bottom-0 md:left-0
                   md:h-auto md:max-h-none md:w-[320px] md:rounded-none md:border-r md:border-t-0"
        role="dialog"
        aria-label="ตัวกรองค้นหา"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#213045] px-4 py-3">
          <div className="text-sm font-semibold">🔍 ค้นหาแปลงที่ดิน</div>
          <button
            onClick={() => setFilterOpen(false)}
            aria-label="ปิด"
            className="text-[#7a9ab8] hover:text-[#dce8f5] text-xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* จังหวัด */}
          <Field label="จังหวัด" required={!filters.province}>
            <select
              value={filters.province ?? ''}
              onChange={(e) => setFilters({ province: e.target.value || null })}
              className="w-full rounded-md bg-[#0d1520] border border-[#213045] px-3 py-2 text-sm
                         focus:outline-none focus:border-[#40c4ff]"
            >
              <option value="">— เลือกจังหวัด —</option>
              {PROVINCE_NAMES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {!filters.province && (
              <p className="mt-1 text-[11px] text-[#ffb300]">
                ⚠ เลือกจังหวัดเพื่อเริ่มดูแปลงที่ขาย
              </p>
            )}
          </Field>

          {/* ราคา */}
          <Field label="ราคา (฿)">
            <div className="flex gap-2">
              <NumInput
                placeholder="ต่ำสุด"
                value={filters.priceMin}
                onChange={(v) => setFilters({ priceMin: v })}
              />
              <span className="self-center text-[#7a9ab8] text-xs">ถึง</span>
              <NumInput
                placeholder="สูงสุด"
                value={filters.priceMax}
                onChange={(v) => setFilters({ priceMax: v })}
              />
            </div>
          </Field>

          {/* เนื้อที่ */}
          <Field label="เนื้อที่ (ตร.ม.)">
            <div className="flex gap-2">
              <NumInput
                placeholder="ต่ำสุด"
                value={filters.areaMin}
                onChange={(v) => setFilters({ areaMin: v })}
              />
              <span className="self-center text-[#7a9ab8] text-xs">ถึง</span>
              <NumInput
                placeholder="สูงสุด"
                value={filters.areaMax}
                onChange={(v) => setFilters({ areaMax: v })}
              />
            </div>
            <p className="mt-1 text-[10px] text-[#7a9ab8]">1 ไร่ = 1,600 ตร.ม.</p>
          </Field>

          {/* ประเภทโฉนด */}
          <Field label="ประเภทเอกสารสิทธิ์">
            <div className="flex flex-wrap gap-1.5">
              <Chip
                active={!filters.titleType}
                onClick={() => setFilters({ titleType: null })}
              >
                ทั้งหมด
              </Chip>
              {TITLE_TYPES.map((t) => (
                <Chip
                  key={t}
                  active={filters.titleType === t}
                  onClick={() => setFilters({ titleType: t })}
                >
                  {t}
                </Chip>
              ))}
            </div>
          </Field>

          {/* สถานะ */}
          <Field label="สถานะ">
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <Chip
                  key={s.v}
                  active={filters.status === s.v}
                  onClick={() => setFilters({ status: s.v, ...(s.v !== 'sold' ? { closed: 'all' } : {}) })}
                  color={s.color}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
            {/* #18 sub-filter: เมื่อเลือก "ขายแล้ว" ให้เลือกได้ว่าเอาเฉพาะ verified */}
            {filters.status === 'sold' && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Chip
                  active={filters.closed === 'all'}
                  onClick={() => setFilters({ closed: 'all' })}
                  color="#7a9ab8"
                >
                  ทั้งหมด
                </Chip>
                <Chip
                  active={filters.closed === 'verified'}
                  onClick={() => setFilters({ closed: 'verified' })}
                  color="#40c4ff"
                >
                  🛡️ Verified เท่านั้น
                </Chip>
              </div>
            )}
          </Field>
        </div>

        {/* Save search */}
        <SaveSearchRow filters={filters} />

        {/* Footer */}
        <div className="flex gap-2 border-t border-[#213045] px-4 py-3">
          <button
            onClick={() => {
              resetFilters();
            }}
            className="flex-1 rounded-md border border-[#213045] bg-[#0d1520] px-3 py-2 text-sm
                       text-[#7a9ab8] hover:text-[#dce8f5]"
          >
            ล้างตัวกรอง
          </button>
          <button
            onClick={() => setFilterOpen(false)}
            className="flex-1 rounded-md bg-[#40c4ff] px-3 py-2 text-sm font-semibold text-[#0d1520]
                       hover:bg-[#29b6f6]"
          >
            ดูแผนที่
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Save search row ──
function SaveSearchRow({ filters }: { filters: SearchFilters }) {
  const user = useAuthStore((s) => s.user);
  const { items, create } = useSavedSearches();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!user) return null;
  if (!filters.province) return null;

  async function onSave() {
    setErr('');
    setBusy(true);
    try {
      await create(name, filters);
      setOpen(false);
      setName('');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-t border-[#213045] px-4 py-3">
      {!open ? (
        <button
          onClick={() => { setName(filters.province || ''); setOpen(true); }}
          className="w-full rounded-md border border-[#40c4ff] bg-[#0d2030] px-3 py-2 text-xs font-semibold text-[#40c4ff] hover:bg-[#102a3d]"
        >
          🔔 บันทึกการค้นหา (แจ้งเตือนเมื่อมีแปลงใหม่)
        </button>
      ) : (
        <div className="space-y-2">
          <div className="text-[11px] text-[#7a9ab8]">
            ใช้แล้ว {items.length}/10 รายการ
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อ เช่น ขอนแก่น <2ล้าน"
            maxLength={40}
            className="w-full rounded-md border border-[#213045] bg-[#0d1520] px-2.5 py-2 text-sm focus:border-[#40c4ff] focus:outline-none"
          />
          {err && <div className="text-[11px] text-[#ff5252]">{err}</div>}
          <div className="flex gap-2">
            <button
              onClick={() => { setOpen(false); setErr(''); }}
              className="flex-1 rounded-md border border-[#213045] bg-[#0d1520] px-3 py-1.5 text-xs text-[#7a9ab8]"
            >ยกเลิก</button>
            <button
              onClick={onSave}
              disabled={busy}
              className="flex-1 rounded-md bg-[#00e676] px-3 py-1.5 text-xs font-semibold text-[#001a0a] disabled:opacity-50"
            >{busy ? 'กำลังบันทึก…' : 'บันทึก'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Subcomponents ──
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#7a9ab8] mb-1.5 uppercase tracking-wide">
        {label}
        {required && <span className="ml-1 text-[#ffb300]">*</span>}
      </label>
      {children}
    </div>
  );
}

function NumInput({
  placeholder, value, onChange,
}: {
  placeholder: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? null : Number(v));
      }}
      className="w-full rounded-md bg-[#0d1520] border border-[#213045] px-2.5 py-2 text-sm
                 focus:outline-none focus:border-[#40c4ff]"
    />
  );
}

function Chip({
  active, onClick, color, children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-xs transition-colors"
      style={{
        borderColor: active ? (color ?? '#40c4ff') : '#213045',
        background:  active ? (color ?? '#40c4ff') : 'transparent',
        color:       active ? '#0d1520' : '#dce8f5',
      }}
    >
      {children}
    </button>
  );
}

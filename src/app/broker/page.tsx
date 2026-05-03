// ════════════════════════════════════════
// app/broker/page.tsx
// Broker Dashboard — listings + analytics for logged-in broker
// Port of js/broker-dashboard.js (slips tab skipped per scope)
// ════════════════════════════════════════
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, COL } from '@/lib/firebase';
import type { PlotPoint, PlotStatus } from '@/types/plot';
import { CobrokerInvites } from '@/components/cobroker/CobrokerInvites';
import { CobrokerRequests } from '@/components/cobroker/CobrokerRequests';
import { SharedListings } from '@/components/cobroker/SharedListings';

const fmt = (n: number) => n.toLocaleString('th-TH');

const statusLabel: Record<PlotStatus, string> = {
  available: 'ว่าง',
  reserved: 'จอง',
  sold: 'ขายแล้ว',
};

type Tab = 'listings' | 'analytics' | 'invites' | 'requests' | 'shared';

export default function BrokerDashboardPage() {
  return (
    <Suspense fallback={null}>
      <BrokerDashboardInner />
    </Suspense>
  );
}

function BrokerDashboardInner() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const [plots, setPlots] = useState<PlotPoint[]>([]);
  const sp = useSearchParams();
  const initialTab = (sp?.get('tab') as Tab) || 'listings';
  const [tab, setTab] = useState<Tab>(
    ['listings','analytics','invites','requests','shared'].includes(initialTab) ? initialTab : 'listings'
  );
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'' | PlotStatus>('');
  const [pendingInvites, setPendingInvites] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  // Realtime subscription to my listings
  useEffect(() => {
    if (!user) return;
    // query by ownerUid to match PlotPoint schema (legacy uses ownerId — we use ownerUid)
    const q = query(collection(db, COL), where('ownerUid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setPlots(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as PlotPoint[]);
    });
    return () => unsub();
  }, [user]);

  // นับคำเชิญ cobroker ที่ pending — ฟัง 2 ทาง (brokerUid + brokerEmail) merge dedupe by id
  useEffect(() => {
    if (!user) { setPendingInvites(0); return; }
    let uidIds: string[] = [];
    let emailIds: string[] = [];
    const recompute = () => {
      setPendingInvites(new Set([...uidIds, ...emailIds]).size);
    };
    const qUid = query(
      collection(db, 'cobrokers'),
      where('brokerUid', '==', user.uid),
      where('status', '==', 'pending'),
    );
    const unsubUid = onSnapshot(qUid, (snap) => {
      uidIds = snap.docs.map((d) => d.id);
      recompute();
    }, () => {});
    let unsubEmail = () => {};
    if (user.email) {
      const qEmail = query(
        collection(db, 'cobrokers'),
        where('brokerEmail', '==', user.email),
        where('status', '==', 'pending'),
      );
      unsubEmail = onSnapshot(qEmail, (snap) => {
        emailIds = snap.docs.map((d) => d.id);
        recompute();
      }, () => {});
    }
    return () => { unsubUid(); unsubEmail(); };
  }, [user]);

  // นับคำขอจากนายหน้า (owner-side requests)
  useEffect(() => {
    if (!user) { setPendingRequests(0); return; }
    const q = query(
      collection(db, 'cobrokers'),
      where('ownerUid', '==', user.uid),
      where('direction', '==', 'request'),
      where('status', '==', 'pending'),
    );
    const unsub = onSnapshot(q, (snap) => setPendingRequests(snap.size), () => {});
    return unsub;
  }, [user]);

  const stats = useMemo(() => {
    const total = plots.length;
    const avail = plots.filter((p) => p.status === 'available').length;
    const reserved = plots.filter((p) => p.status === 'reserved').length;
    const sold = plots.filter((p) => p.status === 'sold').length;
    const value = plots.reduce((s, p) => s + (Number(p.priceTotal) || 0), 0);
    return { total, avail, reserved, sold, value };
  }, [plots]);

  if (ready && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1520] text-[#dce8f5]">
        <div className="text-center">
          <div className="mb-3 text-sm">กรุณาเข้าสู่ระบบเพื่อดูแดชบอร์ด</div>
          <button
            onClick={() => setLoginOpen(true)}
            className="rounded-md bg-[#00e676] px-4 py-2 text-sm font-bold text-[#001a0a]"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1520] text-[#dce8f5]">
      {/* Header */}
      <div className="flex h-[52px] items-center justify-between border-b border-[#213045] bg-[#162030] px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-[#7a9ab8]">
            ← กลับ
          </Link>
          <span className="text-base font-bold">📊 Broker Dashboard</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2.5 overflow-x-auto border-b border-[#213045] bg-[#162030] px-4 py-3">
        <StatCard label="ทั้งหมด" value={stats.total} />
        <StatCard label="ว่าง" value={stats.avail} color="#00e676" />
        <StatCard label="จอง" value={stats.reserved} color="#ffb300" />
        <StatCard label="ขายแล้ว" value={stats.sold} color="#ff5252" />
        <StatCard label="มูลค่ารวม (฿)" value={stats.value > 0 ? fmt(stats.value) : '–'} color="#b388ff" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#213045] bg-[#162030]">
        <TabButton label="📋 รายการ" active={tab === 'listings'} onClick={() => setTab('listings')} />
        <TabButton label="📈 วิเคราะห์" active={tab === 'analytics'} onClick={() => setTab('analytics')} />
        <TabButton
          label="🤝 คำเชิญร่วมขาย"
          active={tab === 'invites'}
          onClick={() => setTab('invites')}
          badge={pendingInvites}
        />
        <TabButton
          label="📩 คำขอร่วมขาย"
          active={tab === 'requests'}
          onClick={() => setTab('requests')}
          badge={pendingRequests}
        />
        <TabButton
          label="🤝 แปลงที่ร่วมขาย"
          active={tab === 'shared'}
          onClick={() => setTab('shared')}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {tab === 'listings' && (
          <ListingsTab
            plots={plots}
            search={search}
            setSearch={setSearch}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}
        {tab === 'analytics' && <AnalyticsTab plots={plots} />}
        {tab === 'invites' && <CobrokerInvites />}
        {tab === 'requests' && <CobrokerRequests />}
        {tab === 'shared' && <SharedListings />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════

function StatCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="flex min-w-[90px] shrink-0 flex-col items-center rounded-lg bg-[#1e2d42] px-3.5 py-2.5">
      <span className="text-xl font-black leading-none" style={{ color: color || '#dce8f5' }}>
        {typeof value === 'number' ? value : value}
      </span>
      <span className="mt-1 text-[10px] text-[#7a9ab8]">{label}</span>
    </div>
  );
}

function TabButton({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`relative border-0 bg-transparent px-4.5 py-2.5 text-xs transition ${
        active
          ? 'border-b-2 border-[#00e676] bg-[#1e2d42] text-[#dce8f5]'
          : 'border-b-2 border-transparent text-[#7a9ab8]'
      }`}
      style={{ paddingLeft: 18, paddingRight: 18 }}
    >
      {label}
      {badge && badge > 0 ? (
        <span
          className="ml-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#ff5252] px-1.5 text-[10px] font-bold text-white"
          style={{ lineHeight: '16px' }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  );
}

// ═══════════ Listings Tab ═══════════

function ListingsTab({
  plots,
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
}: {
  plots: PlotPoint[];
  search: string;
  setSearch: (v: string) => void;
  filterStatus: '' | PlotStatus;
  setFilterStatus: (v: '' | PlotStatus) => void;
}) {
  const filtered = plots.filter((p) => {
    if (search && !((p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.province || '').toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ค้นหาชื่อ/จังหวัด"
          className="min-w-[160px] flex-1 rounded-md border border-[#213045] bg-[#1e2d42] px-2.5 py-1.5 text-xs text-[#dce8f5] outline-none"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as '' | PlotStatus)}
          className="rounded-md border border-[#213045] bg-[#1e2d42] px-2 py-1.5 text-xs text-[#dce8f5]"
        >
          <option value="">ทุกสถานะ</option>
          <option value="available">ว่าง</option>
          <option value="reserved">จอง</option>
          <option value="sold">ขายแล้ว</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#7a9ab8]">ไม่พบรายการ</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <ListingRow key={p.id} plot={p} />
          ))}
        </div>
      )}
    </>
  );
}

function ListingRow({ plot: p }: { plot: PlotPoint }) {
  const statusBg = { available: '#00e676', reserved: '#ffb300', sold: '#ff5252' };
  const statusTx = { available: '#001a0a', reserved: '#0d1520', sold: '#fff' };
  const status = p.status || 'available';
  const price = p.priceTotal ? fmt(Number(p.priceTotal)) + ' ฿' : '–';
  const area = p.areaSqm ? Number(p.areaSqm).toFixed(0) + ' ตร.ม.' : '';
  const img = p.photos?.[0] || p.photoUrls?.[0];

  async function cycleStatus() {
    const order: PlotStatus[] = ['available', 'reserved', 'sold'];
    const idx = order.indexOf(status);
    const next = order[(idx + 1) % order.length];
    if (!confirm(`เปลี่ยนสถานะ "${p.name}" จาก "${statusLabel[status]}" เป็น "${statusLabel[next]}"?`)) return;
    try {
      await updateDoc(doc(db, COL, p.id), { status: next, updatedAt: serverTimestamp() });
    } catch (e) {
      alert('ผิดพลาด: ' + (e as Error).message);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#1e2d42] p-3">
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={p.name} className="h-[54px] w-[54px] shrink-0 rounded-md object-cover" />
      ) : (
        <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-md bg-[#213045] text-xl">
          🗺
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-bold">{p.name || 'ไม่มีชื่อ'}</div>
        <div className="text-[11px] text-[#7a9ab8]">
          {p.province || ''} {area ? '· ' + area : ''}
        </div>
        <div className="mt-0.5 text-xs font-bold text-[#00e676]">{price}</div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: statusBg[status], color: statusTx[status] }}
        >
          {statusLabel[status]}
        </span>
        <div className="flex gap-1">
          <Link
            href={`/plot/${p.id}`}
            className="rounded border-0 bg-[#213045] px-2 py-1 text-[10px] text-[#40c4ff]"
          >
            ดู
          </Link>
          <button
            onClick={cycleStatus}
            className="rounded border-0 bg-[#213045] px-2 py-1 text-[10px] text-[#dce8f5]"
          >
            สถานะ
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════ Analytics Tab ═══════════

function AnalyticsTab({ plots }: { plots: PlotPoint[] }) {
  const analysis = useMemo(() => {
    const provMap: Record<string, { total: number; available: number; reserved: number; sold: number; value: number }> = {};
    plots.forEach((p) => {
      const prov = p.province || 'ไม่ระบุ';
      if (!provMap[prov]) provMap[prov] = { total: 0, available: 0, reserved: 0, sold: 0, value: 0 };
      provMap[prov].total++;
      provMap[prov][p.status || 'available']++;
      provMap[prov].value += Number(p.priceTotal) || 0;
    });

    const monthMap: Record<string, number> = {};
    plots.forEach((p) => {
      const ts = p.createdAt;
      const d: Date | null = ts?.toDate?.() || (typeof ts === 'string' ? new Date(ts) : null);
      if (!d || isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    const months = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);

    const totalValue = plots.reduce((s, p) => s + (Number(p.priceTotal) || 0), 0);
    const soldValue = plots
      .filter((p) => p.status === 'sold')
      .reduce((s, p) => s + (Number(p.priceTotal) || 0), 0);
    const ppsRows = plots.filter((p) => p.priceTotal && p.areaSqm);
    const avgPriceSqm = ppsRows.length
      ? ppsRows.reduce((acc, p) => acc + Number(p.priceTotal) / Number(p.areaSqm), 0) / ppsRows.length
      : 0;

    return { provMap, months, totalValue, soldValue, avgPriceSqm };
  }, [plots]);

  const { provMap, months, totalValue, soldValue, avgPriceSqm } = analysis;
  const maxMonthVal = Math.max(...months.map(([, v]) => v), 1);

  return (
    <>
      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <SummaryCard label="💰 มูลค่ารวม" value={fmt(totalValue) + ' ฿'} color="#b388ff" />
        <SummaryCard label="✅ ขายแล้ว" value={fmt(soldValue) + ' ฿'} color="#00e676" />
        <SummaryCard
          label="📐 ราคา/ตร.ม. เฉลี่ย"
          value={avgPriceSqm > 0 ? fmt(Math.round(avgPriceSqm)) + ' ฿' : '–'}
          color="#40c4ff"
        />
        <SummaryCard label="📋 จำนวนทั้งหมด" value={plots.length + ' แปลง'} color="#ffb300" />
      </div>

      {/* Province breakdown */}
      <div className="mb-3 rounded-lg bg-[#1e2d42] p-3.5">
        <div className="mb-2.5 text-xs font-bold">📍 แยกตามจังหวัด</div>
        {Object.entries(provMap)
          .sort(([, a], [, b]) => b.total - a.total)
          .slice(0, 8)
          .map(([prov, data]) => (
            <div key={prov} className="mb-1.5 flex items-center gap-2">
              <div className="flex-1 truncate text-xs">{prov}</div>
              <div className="whitespace-nowrap text-[11px] text-[#7a9ab8]">{data.total} แปลง</div>
              <div className="flex h-1.5 flex-[2] overflow-hidden rounded-full bg-[#213045]">
                <div style={{ width: `${Math.round((data.available / data.total) * 100)}%`, background: '#00e676' }} />
                <div style={{ width: `${Math.round((data.reserved / data.total) * 100)}%`, background: '#ffb300' }} />
                <div style={{ width: `${Math.round((data.sold / data.total) * 100)}%`, background: '#ff5252' }} />
              </div>
            </div>
          ))}
      </div>

      {/* Monthly chart */}
      {months.length > 0 && (
        <div className="rounded-lg bg-[#1e2d42] p-3.5">
          <div className="mb-3 text-xs font-bold">📅 รายการใหม่ 6 เดือนล่าสุด</div>
          <div className="flex h-20 items-end gap-1.5">
            {months.map(([mo, cnt]) => (
              <div key={mo} className="flex flex-1 flex-col items-center gap-1">
                <div className="text-[10px] text-[#7a9ab8]">{cnt}</div>
                <div
                  className="w-full rounded-t-sm bg-[#00e676] opacity-80"
                  style={{ height: `${Math.round((cnt / maxMonthVal) * 60)}px`, minHeight: 4 }}
                />
                <div className="whitespace-nowrap text-[9px] text-[#7a9ab8]">{mo.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg bg-[#1e2d42] p-3">
      <div className="text-[11px] text-[#7a9ab8]">{label}</div>
      <div className="mt-1 text-base font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

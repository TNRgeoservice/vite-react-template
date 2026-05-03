// ════════════════════════════════════════
// app/compare/page.tsx
// Side-by-side compare (up to 4 plots)
// ════════════════════════════════════════
'use client';

import Link from 'next/link';
import { useCompareStore } from '@/store/compareStore';
import type { PlotPoint } from '@/types/plot';

const fmt = (n: number | string | null | undefined) => {
  const v = Number(n);
  return v ? v.toLocaleString('th-TH') : '–';
};

const statusColor = { available: '#00e676', reserved: '#ffb300', sold: '#ff5252' };
const statusLabel = { available: 'ว่าง', reserved: 'จอง', sold: 'ขายแล้ว' };

type RowDef = {
  label: string;
  render: (p: PlotPoint) => React.ReactNode;
  highlight?: 'min' | 'max';
  numeric?: (p: PlotPoint) => number | null;
};

const rows: RowDef[] = [
  {
    label: '📷 รูปภาพ',
    render: (p) => {
      const img = p.photos?.[0] || p.photoUrls?.[0];
      return img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={p.name} className="block max-h-[90px] w-full rounded-md object-cover" />
      ) : (
        <div className="text-center text-2xl">🗺</div>
      );
    },
  },
  { label: '📋 ชื่อแปลง', render: (p) => p.name || '–' },
  {
    label: '🔵 สถานะ',
    render: (p) => {
      const s = p.status || 'available';
      return (
        <span
          style={{ background: statusColor[s], color: s === 'available' ? '#001a0a' : '#0d1520' }}
          className="rounded-full px-2 py-0.5 text-[11px] font-bold"
        >
          {statusLabel[s]}
        </span>
      );
    },
  },
  {
    label: '💰 ราคารวม',
    render: (p) => (p.priceTotal ? fmt(p.priceTotal) + ' ฿' : '–'),
    highlight: 'min',
    numeric: (p) => (p.priceTotal ? Number(p.priceTotal) : null),
  },
  {
    label: '📐 ราคา/ตร.ม.',
    render: (p) => {
      if (p.priceTotal && p.areaSqm) {
        return fmt(Math.round(Number(p.priceTotal) / Number(p.areaSqm))) + ' ฿';
      }
      return '–';
    },
    highlight: 'min',
    numeric: (p) =>
      p.priceTotal && p.areaSqm ? Number(p.priceTotal) / Number(p.areaSqm) : null,
  },
  {
    label: '📏 พื้นที่ (ตร.ม.)',
    render: (p) => (p.areaSqm ? Number(p.areaSqm).toLocaleString('th-TH') : '–'),
    highlight: 'max',
    numeric: (p) => (p.areaSqm ? Number(p.areaSqm) : null),
  },
  {
    label: '🌾 พื้นที่ (ไร่)',
    render: (p) => (p.areaSqm ? (Number(p.areaSqm) / 1600).toFixed(3) : '–'),
    highlight: 'max',
    numeric: (p) => (p.areaSqm ? Number(p.areaSqm) / 1600 : null),
  },
  { label: '📍 จังหวัด', render: (p) => p.province || '–' },
  { label: '🏘 อำเภอ', render: (p) => p.amphoe || '–' },
  { label: '📄 ประเภทโฉนด', render: (p) => p.titleType || '–' },
  { label: '🗺 ผังเมือง', render: (p) => p.zoning || '–' },
  { label: '🛣 ทางเข้า', render: (p) => p.roadAcc || '–' },
  {
    label: '📝 หมายเหตุ',
    render: (p) => {
      const s = p.notes || '';
      return s.length > 80 ? s.slice(0, 80) + '…' : s || '–';
    },
  },
  {
    label: '',
    render: (p) => (
      <Link
        href={`/plot/${p.id}`}
        className="inline-block rounded-md bg-[#00e676] px-3 py-1.5 text-xs font-bold text-[#001a0a]"
      >
        ดูรายละเอียด →
      </Link>
    ),
  },
];

export default function ComparePage() {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d1520] text-[#dce8f5]">
        <Header showBack />
        <div className="p-10 text-center text-sm text-[#7a9ab8]">
          ยังไม่มีแปลงในรายการเปรียบเทียบ
          <div className="mt-3">
            <Link href="/" className="text-[#40c4ff] underline">
              ← กลับหน้าแผนที่
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Precompute best index per numeric row
  const bestIdx: Record<number, number> = {};
  rows.forEach((row, rIdx) => {
    if (!row.highlight || !row.numeric) return;
    const nums = items.map(row.numeric);
    const valid = nums.filter((v): v is number => v !== null);
    if (valid.length < 2) return;
    const target = row.highlight === 'min' ? Math.min(...valid) : Math.max(...valid);
    bestIdx[rIdx] = nums.findIndex((v) => v === target);
  });

  return (
    <div className="min-h-screen bg-[#0d1520] text-[#dce8f5]">
      <Header showBack showClear onClear={clear} />

      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse" style={{ minWidth: 130 + items.length * 180 }}>
          <thead>
            <tr className="bg-[#162030]">
              <th className="sticky left-0 z-[2] w-[130px] border-b border-[#213045] bg-[#162030] p-2 text-left text-[11px] font-medium text-[#7a9ab8]">
                เปรียบเทียบ
              </th>
              {items.map((p) => (
                <th
                  key={p.id}
                  className="min-w-[160px] border-b border-l border-[#213045] p-2 text-center"
                >
                  <div className="text-sm font-bold">{p.name || p.id}</div>
                  <div className="text-[10px] text-[#7a9ab8]">{p.province || ''}</div>
                  <button
                    onClick={() => remove(p.id)}
                    className="mt-1 border-0 bg-transparent text-[11px] text-[#ff5252]"
                  >
                    ✕ ลบออก
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-[#1e2d42]">
                <td className="sticky left-0 z-[1] whitespace-nowrap border-r border-[#213045] bg-[#0d1520] p-2.5 align-top text-[11px] text-[#7a9ab8]">
                  {row.label}
                </td>
                {items.map((p, i) => {
                  const isBest = bestIdx[rIdx] === i;
                  return (
                    <td
                      key={p.id}
                      className="border-l border-[#1e2d42] p-2.5 align-top text-center text-[13px]"
                      style={{
                        background: isBest ? 'rgba(0,230,118,.07)' : 'transparent',
                        color: isBest ? '#00e676' : '#dce8f5',
                        fontWeight: isBest ? 700 : 400,
                      }}
                    >
                      {row.render(p)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {items.length > 1 && (
          <div className="mt-3 flex gap-4 text-[11px] text-[#7a9ab8]">
            <span className="text-[#00e676]">■</span>
            <span>ค่าที่ดีที่สุดในหมวดนั้น (ราคาต่ำสุด / พื้นที่มากสุด)</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({
  showBack,
  showClear,
  onClear,
}: {
  showBack?: boolean;
  showClear?: boolean;
  onClear?: () => void;
}) {
  return (
    <div className="flex h-[52px] items-center justify-between border-b border-[#213045] bg-[#162030] px-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <Link href="/" className="text-xs text-[#7a9ab8]">
            ← กลับ
          </Link>
        )}
        <span className="text-base font-bold">🔍 เปรียบเทียบแปลงที่ดิน</span>
      </div>
      {showClear && (
        <button
          onClick={onClear}
          className="rounded-md border border-[#213045] px-2.5 py-1 text-xs text-[#7a9ab8]"
        >
          ล้างทั้งหมด
        </button>
      )}
    </div>
  );
}

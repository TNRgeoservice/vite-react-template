// ════════════════════════════════════════
// components/calc/MortgageCalculator.tsx
// คำนวณสินเชื่อบ้าน — ค่างวด/เดือน + ดอกเบี้ยรวม + ตารางผ่อนสรุป
// สูตร: amortization (PMT) มาตรฐาน
// ════════════════════════════════════════
'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';

interface Props {
  mode?: 'standalone' | 'embedded';
  /** ราคาขายเริ่มต้น (จากหน้าแปลง) */
  initialPriceTotal?: number;
}

export function MortgageCalculator({ mode = 'standalone', initialPriceTotal }: Props) {
  const [priceInput, setPriceInput] = useState<string>(
    initialPriceTotal ? String(initialPriceTotal) : '',
  );
  const [downPctInput, setDownPctInput] = useState<string>('20');
  const [rateInput, setRateInput] = useState<string>('5.5');
  const [yearsInput, setYearsInput] = useState<string>('30');

  const price = parseFloat(priceInput) || 0;
  const downPct = Math.max(0, Math.min(100, parseFloat(downPctInput) || 0));
  const rate = Math.max(0, parseFloat(rateInput) || 0);
  const years = Math.max(1, Math.min(40, parseInt(yearsInput, 10) || 0));

  const isComplete = price > 0 && rate > 0 && years > 0;

  const result = useMemo(() => {
    if (!isComplete) return null;
    const downPayment = price * (downPct / 100);
    const principal = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const monthlyPayment = monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPaid = monthlyPayment * months;
    const totalInterest = totalPaid - principal;
    return {
      downPayment,
      principal,
      monthlyPayment,
      totalPaid,
      totalInterest,
    };
  }, [isComplete, price, downPct, rate, years]);

  // คำนวณรายได้ขั้นต่ำที่แนะนำ — ค่างวดไม่เกิน 40% ของรายได้
  const recommendedIncome = result ? result.monthlyPayment / 0.4 : 0;

  return (
    <div className={mode === 'standalone' ? 'mx-auto max-w-2xl space-y-4 p-4' : 'space-y-3'}>
      {mode === 'standalone' && (
        <div className="border-b border-[#213045] pb-3">
          <h1 className="text-lg font-semibold text-[#dce8f5]">💰 คำนวณสินเชื่อบ้าน</h1>
          <p className="mt-1 text-xs text-[#7a9ab8]">ดอกเบี้ยคงที่ตลอดสัญญา (ประมาณการ)</p>
        </div>
      )}

      <Field
        label="ราคาบ้าน/ที่ดิน (บาท)"
        type="number"
        inputMode="decimal"
        min={0}
        value={priceInput}
        onChange={(e) => setPriceInput(e.target.value)}
        placeholder="เช่น 2500000"
        mono
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label={`เงินดาวน์ (% ของราคา)${result ? ` — ${fmtBaht(result.downPayment)}` : ''}`}
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step="1"
          value={downPctInput}
          onChange={(e) => setDownPctInput(e.target.value)}
          placeholder="เช่น 20"
          mono
        />
        <Field
          label="ดอกเบี้ย (% ต่อปี)"
          type="number"
          inputMode="decimal"
          min={0}
          max={20}
          step="0.01"
          value={rateInput}
          onChange={(e) => setRateInput(e.target.value)}
          placeholder="เช่น 5.5"
          mono
        />
      </div>

      <div>
        <span className="mb-[5px] block text-[12px] font-medium text-[#7a9ab8]">
          ระยะเวลาผ่อน
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[10, 20, 30, 40].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYearsInput(String(y))}
              className={
                'rounded-md border-[1.5px] px-2 py-2 text-sm transition-colors ' +
                (years === y
                  ? 'border-[#40c4ff] bg-[#40c4ff]/10 text-[#40c4ff]'
                  : 'border-[#213045] text-[#dce8f5] hover:border-[#7a9ab8]')
              }
            >
              {y} ปี
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={40}
          value={yearsInput}
          onChange={(e) => setYearsInput(e.target.value)}
          placeholder="หรือกำหนดเอง (ปี)"
          className="mt-2 block w-full rounded-md border-[1.5px] border-[#213045] bg-[#0d1520]
                     px-3 py-[10px] text-sm font-mono text-[#dce8f5] outline-none
                     focus:border-[#40c4ff]"
        />
      </div>

      {/* ผลลัพธ์ */}
      {!isComplete || !result ? (
        <div className="rounded-md border border-dashed border-[#213045] bg-[#0d1520]/50 p-4 text-center text-xs text-[#7a9ab8]">
          กรอกราคา + ดอกเบี้ย + ระยะเวลา เพื่อคำนวณ
        </div>
      ) : (
        <div className="space-y-2 rounded-md border border-[#213045] bg-[#111c2b] p-4">
          <Row label="วงเงินกู้" value={fmtBaht(result.principal)} />
          <Row label="ค่างวด/เดือน" value={fmtBaht(result.monthlyPayment)} tone="accent" big />
          <div className="my-2 border-t border-[#213045]" />
          <Row label={`ผ่อนทั้งหมด (${years * 12} งวด)`} value={fmtBaht(result.totalPaid)} />
          <Row label="ดอกเบี้ยรวม" value={fmtBaht(result.totalInterest)} tone="warn" />
          <div className="my-2 border-t border-[#213045]" />
          <Row label="แนะนำรายได้ขั้นต่ำ/เดือน" value={fmtBaht(recommendedIncome)} />
        </div>
      )}

      <div className="space-y-1 rounded-md border border-[#213045] bg-[#0d1520]/50 p-3 text-[10px] text-[#7a9ab8]">
        <div>• สูตร: amortization มาตรฐาน (ดอกเบี้ยคงที่)</div>
        <div>• ดอกเบี้ยจริงปกติแบบลอยตัว 3 ปีแรก ~3-4% หลังจากนั้น MRR</div>
        <div>• แนะนำให้รายได้/เดือน × 40% ≥ ค่างวด เพื่อสภาพคล่อง</div>
      </div>
    </div>
  );
}

function Row({
  label, value, tone, big,
}: { label: string; value: string; tone?: 'accent' | 'warn'; big?: boolean }) {
  const valueColor =
    tone === 'accent' ? 'text-[#00e676]' :
    tone === 'warn'   ? 'text-[#ffb300]' :
    'text-[#dce8f5]';
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#7a9ab8]">{label}</span>
      <span className={`font-mono ${big ? 'text-base font-semibold' : 'text-sm'} ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}

function fmtBaht(n: number): string {
  return n.toLocaleString('th-TH', { maximumFractionDigits: 0 }) + ' บาท';
}

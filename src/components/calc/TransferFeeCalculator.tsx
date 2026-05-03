// ════════════════════════════════════════
// components/calc/TransferFeeCalculator.tsx
// คำนวณค่าโอนที่ดิน — ค่าธรรมเนียม + ภาษีธุรกิจเฉพาะ + อากร + ภาษีเงินได้หัก ณ ที่จ่าย
// อิงอัตรากรมที่ดิน + กรมสรรพากร พ.ศ. 2568-2569
// ════════════════════════════════════════
'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';

interface Props {
  mode?: 'standalone' | 'embedded';
  /** ราคาขายเริ่มต้น (จากหน้าแปลง) */
  initialPriceTotal?: number;
}

type HoldingMode = 'over5y' | 'under5y' | 'company';
type FeeBearer = 'split' | 'buyer' | 'seller';

export function TransferFeeCalculator({ mode = 'standalone', initialPriceTotal }: Props) {
  // ราคาประเมิน + ราคาซื้อขาย — ใช้ตัวที่สูงกว่าเป็นฐาน
  const [appraisedInput, setAppraisedInput] = useState<string>('');
  const [salePriceInput, setSalePriceInput] = useState<string>(
    initialPriceTotal ? String(initialPriceTotal) : '',
  );
  const [holding, setHolding] = useState<HoldingMode>('over5y');
  const [yearsHeld, setYearsHeld] = useState<string>('5');
  const [bearer, setBearer] = useState<FeeBearer>('split');

  const sale = parseFloat(salePriceInput) || 0;
  const appraised = parseFloat(appraisedInput) || 0;
  const base = Math.max(sale, appraised); // ฐานคำนวณ = สูงกว่า
  const years = Math.max(0, Math.min(40, parseInt(yearsHeld, 10) || 0));

  const isComplete = sale > 0 && appraised > 0;

  const result = useMemo(() => {
    if (!isComplete) return null;
    return calcTransferFee(base, holding, years);
  }, [isComplete, base, holding, years]);

  return (
    <div className={mode === 'standalone' ? 'mx-auto max-w-2xl space-y-4 p-4' : 'space-y-3'}>
      {mode === 'standalone' && (
        <div className="border-b border-[#213045] pb-3">
          <h1 className="text-lg font-semibold text-[#dce8f5]">🏛️ คำนวณค่าโอนที่ดิน</h1>
          <p className="mt-1 text-xs text-[#7a9ab8]">
            อิงอัตรากรมที่ดิน + กรมสรรพากร พ.ศ. 2568-2569
          </p>
        </div>
      )}

      {/* ราคาประเมิน + ราคาซื้อขาย */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="ราคาประเมิน (บาท)"
          type="number"
          inputMode="decimal"
          min={0}
          value={appraisedInput}
          onChange={(e) => setAppraisedInput(e.target.value)}
          placeholder="เช่น 1500000"
          mono
        />
        <Field
          label="ราคาซื้อขายจริง (บาท)"
          type="number"
          inputMode="decimal"
          min={0}
          value={salePriceInput}
          onChange={(e) => setSalePriceInput(e.target.value)}
          placeholder="เช่น 1800000"
          mono
        />
      </div>

      {/* ผู้ขายเป็นใคร */}
      <div>
        <span className="mb-[5px] block text-[12px] font-medium text-[#7a9ab8]">
          สถานะผู้ขาย / ระยะเวลาถือครอง
        </span>
        <div className="grid grid-cols-3 gap-2">
          {([
            { k: 'over5y', label: 'บุคคล ถือ ≥ 5 ปี' },
            { k: 'under5y', label: 'บุคคล ถือ < 5 ปี' },
            { k: 'company', label: 'นิติบุคคล' },
          ] as { k: HoldingMode; label: string }[]).map((opt) => (
            <button
              key={opt.k}
              type="button"
              onClick={() => setHolding(opt.k)}
              className={
                'rounded-md border-[1.5px] px-2 py-2 text-xs transition-colors ' +
                (holding === opt.k
                  ? 'border-[#40c4ff] bg-[#40c4ff]/10 text-[#40c4ff]'
                  : 'border-[#213045] text-[#dce8f5] hover:border-[#7a9ab8]')
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* จำนวนปีที่ถือครอง */}
      {(holding === 'over5y' || holding === 'under5y') && (
        <Field
          label="จำนวนปีที่ถือครอง (สำหรับคำนวณภาษีเงินได้)"
          type="number"
          inputMode="numeric"
          min={1}
          max={40}
          value={yearsHeld}
          onChange={(e) => setYearsHeld(e.target.value)}
          placeholder="เช่น 5"
          mono
        />
      )}

      {/* ฝั่งใครจ่าย */}
      <div>
        <span className="mb-[5px] block text-[12px] font-medium text-[#7a9ab8]">
          ใครเป็นผู้รับภาระค่าโอน
        </span>
        <div className="grid grid-cols-3 gap-2">
          {([
            { k: 'split', label: 'แบ่งกันจ่าย' },
            { k: 'buyer', label: 'ผู้ซื้อจ่าย' },
            { k: 'seller', label: 'ผู้ขายจ่าย' },
          ] as { k: FeeBearer; label: string }[]).map((opt) => (
            <button
              key={opt.k}
              type="button"
              onClick={() => setBearer(opt.k)}
              className={
                'rounded-md border-[1.5px] px-2 py-2 text-xs transition-colors ' +
                (bearer === opt.k
                  ? 'border-[#40c4ff] bg-[#40c4ff]/10 text-[#40c4ff]'
                  : 'border-[#213045] text-[#dce8f5] hover:border-[#7a9ab8]')
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ผลลัพธ์ */}
      <ResultPanel result={result} isComplete={isComplete} bearer={bearer} base={base} />

      <div className="space-y-1 rounded-md border border-[#213045] bg-[#0d1520]/50 p-3 text-[10px] text-[#7a9ab8]">
        <div>• ค่าธรรมเนียมโอน: <strong>2%</strong> ของฐาน (สูงกว่าระหว่างราคาประเมิน/ขาย)</div>
        <div>• ภาษีธุรกิจเฉพาะ: <strong>3.3%</strong> (ถ้าถือ &lt; 5 ปี หรือนิติบุคคล) — ถ้าเสียแล้วไม่ต้องเสียอากรอีก</div>
        <div>• อากรแสตมป์: <strong>0.5%</strong> (ถ้าไม่เสียภาษีธุรกิจเฉพาะ)</div>
        <div>• ภาษีเงินได้หัก ณ ที่จ่าย: คำนวณจากอัตราก้าวหน้าตามกรมสรรพากร</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Calculation logic
// ────────────────────────────────────────────────────────────

interface TransferFeeResult {
  base: number;
  transferFee: number;        // 2%
  specificBusinessTax: number; // 3.3% (ถ้าเข้าเงื่อนไข)
  stampDuty: number;           // 0.5% (ถ้าไม่เข้า SBT)
  withholdingTax: number;      // ภาษีเงินได้หัก ณ ที่จ่าย
  total: number;
}

function calcTransferFee(base: number, holding: HoldingMode, years: number): TransferFeeResult {
  const transferFee = base * 0.02;

  let specificBusinessTax = 0;
  let stampDuty = 0;
  if (holding === 'under5y' || holding === 'company') {
    specificBusinessTax = base * 0.033; // 3% + ภาษีท้องถิ่น 10% ของ 3% = 0.3% รวม 3.3%
  } else {
    stampDuty = base * 0.005;
  }

  let withholdingTax = 0;
  if (holding === 'company') {
    withholdingTax = base * 0.01; // นิติบุคคล 1%
  } else {
    // บุคคลธรรมดา — คำนวณจากอัตราก้าวหน้า + หักค่าใช้จ่ายตามจำนวนปีถือครอง
    withholdingTax = calcPersonalWHT(base, years);
  }

  return {
    base,
    transferFee,
    specificBusinessTax,
    stampDuty,
    withholdingTax,
    total: transferFee + specificBusinessTax + stampDuty + withholdingTax,
  };
}

/** ภาษีเงินได้หัก ณ ที่จ่าย กรณีบุคคลธรรมดา ขายอสังหาฯ */
function calcPersonalWHT(base: number, years: number): number {
  if (base <= 0 || years <= 0) return 0;
  // หักค่าใช้จ่ายตามจำนวนปีที่ถือครอง (% ของราคาประเมิน)
  const expenseRates: Record<number, number> = {
    1: 0.92, 2: 0.84, 3: 0.77, 4: 0.71, 5: 0.65,
    6: 0.60, 7: 0.55, 8: 0.50,
  };
  const rate = years <= 8 ? expenseRates[years] : 0.50;
  const taxable = base * (1 - rate);
  // เฉลี่ยรายปี
  const yearly = taxable / years;
  // อัตราภาษีก้าวหน้า (กรมสรรพากร 2568) — ใช้แบบบุคคลธรรมดา
  const yearlyTax = progressiveTax(yearly);
  // คูณกลับด้วยจำนวนปี = ภาษีเงินได้รวม
  return yearlyTax * years;
}

/** อัตราภาษีเงินได้บุคคลธรรมดาก้าวหน้า (กรมสรรพากร 2568) */
function progressiveTax(income: number): number {
  const brackets = [
    { upTo: 150_000, rate: 0 },
    { upTo: 300_000, rate: 0.05 },
    { upTo: 500_000, rate: 0.10 },
    { upTo: 750_000, rate: 0.15 },
    { upTo: 1_000_000, rate: 0.20 },
    { upTo: 2_000_000, rate: 0.25 },
    { upTo: 5_000_000, rate: 0.30 },
    { upTo: Infinity, rate: 0.35 },
  ];
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (income <= prev) break;
    const taxable = Math.min(income, b.upTo) - prev;
    tax += taxable * b.rate;
    prev = b.upTo;
    if (income <= b.upTo) break;
  }
  return tax;
}

// ────────────────────────────────────────────────────────────

function ResultPanel({
  result, isComplete, bearer, base,
}: { result: TransferFeeResult | null; isComplete: boolean; bearer: FeeBearer; base: number }) {
  if (!isComplete || !result) {
    return (
      <div className="rounded-md border border-dashed border-[#213045] bg-[#0d1520]/50 p-4 text-center text-xs text-[#7a9ab8]">
        กรอกราคาประเมิน + ราคาซื้อขาย เพื่อคำนวณ
      </div>
    );
  }

  // แบ่งภาระ
  const buyerShare =
    bearer === 'buyer' ? result.total :
    bearer === 'seller' ? 0 :
    result.transferFee / 2; // split: ค่าธรรมเนียมแบ่งครึ่ง, ภาษีคนขายจ่าย
  const sellerShare = result.total - buyerShare;

  return (
    <div className="space-y-2 rounded-md border border-[#213045] bg-[#111c2b] p-4">
      <Row label="ฐานคำนวณ (สูงกว่าระหว่างราคาประเมิน/ขาย)" value={fmtBaht(base)} />
      <div className="my-1 border-t border-[#213045]" />
      <Row label="ค่าธรรมเนียมโอน 2%" value={fmtBaht(result.transferFee)} />
      {result.specificBusinessTax > 0 && (
        <Row label="ภาษีธุรกิจเฉพาะ 3.3%" value={fmtBaht(result.specificBusinessTax)} tone="warn" />
      )}
      {result.stampDuty > 0 && (
        <Row label="อากรแสตมป์ 0.5%" value={fmtBaht(result.stampDuty)} tone="warn" />
      )}
      <Row label="ภาษีเงินได้หัก ณ ที่จ่าย" value={fmtBaht(result.withholdingTax)} tone="warn" />
      <div className="my-2 border-t border-[#213045]" />
      <Row label="รวมค่าโอนทั้งหมด" value={fmtBaht(result.total)} tone="accent" big />
      {bearer !== 'split' || true ? (
        <>
          <div className="my-2 border-t border-[#213045]" />
          <Row label="ผู้ซื้อจ่าย" value={fmtBaht(buyerShare)} />
          <Row label="ผู้ขายจ่าย" value={fmtBaht(sellerShare)} />
        </>
      ) : null}
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

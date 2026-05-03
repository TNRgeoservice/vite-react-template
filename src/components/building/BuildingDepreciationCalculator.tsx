// ════════════════════════════════════════
// components/building/BuildingDepreciationCalculator.tsx
// ฟอร์มคำนวณราคาประเมินสิ่งปลูกสร้างหลังหักค่าเสื่อม
// อิงบัญชีราคามาตรฐาน VAT พ.ศ. 2568-2569
// ════════════════════════════════════════
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BUILDING_TYPES,
  CATEGORY_LABELS,
  QUALITY_LABELS,
  getBuildingsByCategory,
  getBuildingType,
} from '@/lib/buildingPriceTable';
import { calcBuildingValue, isValuationError } from '@/lib/depreciation';
import type {
  QualityLevel,
  BuildingCategory,
  BuildingValuationOutput,
} from '@/types/building';
import { Field } from '@/components/ui/Field';

const CURRENT_YEAR_BE = new Date().getFullYear() + 543;

interface Props {
  /** mode 'embedded' = ใช้ใน sell form (ไม่มี header), 'standalone' = หน้า calculator เต็ม */
  mode?: 'standalone' | 'embedded';
  /** initial values (สำหรับ edit) */
  initial?: {
    typeCode?: string;
    quality?: QualityLevel;
    areaSqm?: number;
    builtYearBE?: number;
  };
  /** callback ทุกครั้งที่ค่าเปลี่ยน — embedded mode ใช้ส่งกลับให้ parent */
  onChange?: (state: {
    typeCode: string;
    quality: QualityLevel;
    areaSqm: number;
    builtYearBE: number;
    result: BuildingValuationOutput | null;
  }) => void;
}

export function BuildingDepreciationCalculator({ mode = 'standalone', initial, onChange }: Props) {
  const [category, setCategory] = useState<BuildingCategory | ''>(
    initial?.typeCode ? getBuildingType(initial.typeCode)?.category ?? '' : ''
  );
  const [typeCode, setTypeCode] = useState<string>(initial?.typeCode ?? '');
  const [quality, setQuality] = useState<QualityLevel>(initial?.quality ?? 'medium');
  const [areaInput, setAreaInput] = useState<string>(
    initial?.areaSqm ? String(initial.areaSqm) : ''
  );
  const [builtYearInput, setBuiltYearInput] = useState<string>(
    initial?.builtYearBE ? String(initial.builtYearBE) : ''
  );

  const grouped = useMemo(() => getBuildingsByCategory(), []);
  const typeOptions = category ? grouped[category] : [];

  const areaSqm = parseFloat(areaInput) || 0;
  const builtYearBE = parseInt(builtYearInput, 10) || 0;
  const isComplete =
    typeCode !== '' && areaSqm > 0 && builtYearBE >= 2400 && builtYearBE <= CURRENT_YEAR_BE;

  const result: BuildingValuationOutput | null = useMemo(() => {
    if (!isComplete) return null;
    return calcBuildingValue({ typeCode, quality, areaSqm, builtYearBE });
  }, [isComplete, typeCode, quality, areaSqm, builtYearBE]);

  // notify parent (embedded mode) — ใช้ useEffect เพื่อกัน infinite loop
  // ไม่ใส่ onChange ใน deps เพราะ parent มักส่ง inline arrow → reference เปลี่ยนทุก render
  useEffect(() => {
    if (onChange && isComplete) {
      onChange({ typeCode, quality, areaSqm, builtYearBE, result });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, typeCode, quality, areaSqm, builtYearBE, result]);

  const age = builtYearBE > 0 ? Math.max(0, CURRENT_YEAR_BE - builtYearBE) : 0;

  return (
    <div className={mode === 'standalone' ? 'mx-auto max-w-2xl space-y-4 p-4' : 'space-y-3'}>
      {mode === 'standalone' && (
        <div className="border-b border-[#213045] pb-3">
          <h1 className="text-lg font-semibold text-[#dce8f5]">
            🏠 คำนวณค่าเสื่อมสิ่งปลูกสร้าง
          </h1>
          <p className="mt-1 text-xs text-[#7a9ab8]">
            อิงบัญชีราคามาตรฐาน VAT พ.ศ. 2568-2569
          </p>
        </div>
      )}

      {/* หมวดหมู่ */}
      <label className="block">
        <span className="mb-[5px] block text-[12px] font-medium text-[#7a9ab8]">
          หมวดหมู่อาคาร
        </span>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as BuildingCategory | '');
            setTypeCode('');
          }}
          className="block w-full rounded-md border-[1.5px] border-[#213045] bg-[#0d1520]
                     px-3 py-[10px] text-sm text-[#dce8f5] outline-none
                     focus:border-[#40c4ff]"
        >
          <option value="">— เลือกหมวดหมู่ —</option>
          {(Object.keys(CATEGORY_LABELS) as BuildingCategory[]).map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </label>

      {/* ประเภทอาคาร */}
      <label className="block">
        <span className="mb-[5px] block text-[12px] font-medium text-[#7a9ab8]">
          ประเภทสิ่งปลูกสร้าง
        </span>
        <select
          value={typeCode}
          onChange={(e) => setTypeCode(e.target.value)}
          disabled={!category}
          className="block w-full rounded-md border-[1.5px] border-[#213045] bg-[#0d1520]
                     px-3 py-[10px] text-sm text-[#dce8f5] outline-none
                     focus:border-[#40c4ff] disabled:opacity-50"
        >
          <option value="">— {category ? 'เลือกประเภท' : 'เลือกหมวดหมู่ก่อน'} —</option>
          {typeOptions.map((t) => (
            <option key={t.code} value={t.code}>
              {t.code} — {t.label}
            </option>
          ))}
        </select>
      </label>

      {/* ระดับคุณภาพ */}
      <div>
        <span className="mb-[5px] block text-[12px] font-medium text-[#7a9ab8]">
          ระดับคุณภาพการก่อสร้าง
        </span>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as QualityLevel[]).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              className={
                'flex-1 rounded-md border-[1.5px] px-3 py-2 text-sm transition-colors ' +
                (quality === q
                  ? 'border-[#40c4ff] bg-[#40c4ff]/10 text-[#40c4ff]'
                  : 'border-[#213045] text-[#dce8f5] hover:border-[#7a9ab8]')
              }
            >
              {QUALITY_LABELS[q]}
            </button>
          ))}
        </div>
      </div>

      {/* พื้นที่ + ปีที่สร้าง */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="พื้นที่ใช้สอย (ตร.ม.)"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={areaInput}
          onChange={(e) => setAreaInput(e.target.value)}
          placeholder="เช่น 120"
          mono
        />
        <Field
          label={`ปีที่สร้าง (พ.ศ.)${age > 0 ? ` — อายุ ${age} ปี` : ''}`}
          type="number"
          inputMode="numeric"
          min={2400}
          max={CURRENT_YEAR_BE}
          value={builtYearInput}
          onChange={(e) => setBuiltYearInput(e.target.value)}
          placeholder={`เช่น ${CURRENT_YEAR_BE - 5}`}
          mono
        />
      </div>

      {/* ผลลัพธ์ */}
      <ResultPanel result={result} isComplete={isComplete} areaSqm={areaSqm} />
    </div>
  );
}

function ResultPanel({
  result,
  isComplete,
  areaSqm,
}: {
  result: BuildingValuationOutput | null;
  isComplete: boolean;
  areaSqm: number;
}) {
  if (!isComplete) {
    return (
      <div className="rounded-md border border-dashed border-[#213045] bg-[#0d1520]/50 p-4 text-center text-xs text-[#7a9ab8]">
        กรอกข้อมูลให้ครบเพื่อคำนวณราคาประเมิน
      </div>
    );
  }

  if (!result) return null;

  if (isValuationError(result)) {
    return (
      <div className="rounded-md border border-[#ff5252]/40 bg-[#ff5252]/10 p-4 text-sm text-[#ff8a8a]">
        ⚠️ {result.error}
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-[#213045] bg-[#111c2b] p-4">
      <Row label="ราคา/ตร.ม. (ตามบัญชีฯ)" value={fmtBaht(result.pricePerSqm)} />
      <Row label={`ราคารวม (× ${fmtNum(areaSqm)} ตร.ม.)`} value={fmtBaht(result.grossValue)} />
      <Row label="ค่าเสื่อมราคา" value={`${result.depreciationRate.toFixed(2)}%`} tone="warn" />
      <div className="my-2 border-t border-[#213045]" />
      <Row
        label="ราคาประเมินหลังหักค่าเสื่อม"
        value={fmtBaht(result.netValue)}
        tone="accent"
        big
      />
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
function fmtNum(n: number): string {
  return n.toLocaleString('th-TH', { maximumFractionDigits: 2 });
}

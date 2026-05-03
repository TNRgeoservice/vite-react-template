// ════════════════════════════════════════
// components/building/BuildingsSection.tsx
// จัดการ array ของสิ่งปลูกสร้างบนแปลง — ใช้ใน PlotForm
// ════════════════════════════════════════
'use client';

import { useState } from 'react';
import { BuildingDepreciationCalculator } from './BuildingDepreciationCalculator';
import { calcBuildingValue, isValuationError } from '@/lib/depreciation';
import { getBuildingType, QUALITY_LABELS } from '@/lib/buildingPriceTable';
import type { BuildingInfo, QualityLevel } from '@/types/building';

interface Props {
  buildings: BuildingInfo[];
  onChange: (next: BuildingInfo[]) => void;
}

export function BuildingsSection({ buildings, onChange }: Props) {
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftState, setDraftState] = useState<{
    typeCode: string;
    quality: QualityLevel;
    areaSqm: number;
    builtYearBE: number;
    pricePerSqm: number;
    grossValue: number;
    depreciationRate: number;
    netValue: number;
  } | null>(null);

  const totalNet = buildings.reduce((sum, b) => sum + (b.netValue || 0), 0);

  function addCurrentDraft() {
    if (!draftState) return;
    const newBuilding: BuildingInfo = {
      typeCode:         draftState.typeCode,
      quality:          draftState.quality,
      areaSqm:          draftState.areaSqm,
      builtYearBE:      draftState.builtYearBE,
      pricePerSqm:      draftState.pricePerSqm,
      grossValue:       draftState.grossValue,
      depreciationRate: draftState.depreciationRate,
      netValue:         draftState.netValue,
    };
    onChange([...buildings, newBuilding]);
    setDraftOpen(false);
    setDraftState(null);
  }

  function removeAt(idx: number) {
    onChange(buildings.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2 rounded-md border border-[#213045] bg-[#0d1520]/50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#7a9ab8]">
          🏠 สิ่งปลูกสร้างบนที่ดิน ({buildings.length} หลัง)
        </span>
        {!draftOpen && (
          <button
            type="button"
            onClick={() => setDraftOpen(true)}
            className="rounded-md bg-[#40c4ff]/10 px-2 py-1 text-xs text-[#40c4ff]
                       hover:bg-[#40c4ff]/20"
          >
            + เพิ่มสิ่งปลูกสร้าง
          </button>
        )}
      </div>

      {/* รายการที่บันทึกแล้ว */}
      {buildings.length > 0 && (
        <ul className="space-y-2">
          {buildings.map((b, i) => {
            const entry = getBuildingType(b.typeCode);
            return (
              <li
                key={i}
                className="flex items-start justify-between rounded-md border border-[#213045] bg-[#111c2b] p-2 text-xs"
              >
                <div className="flex-1">
                  <div className="font-medium text-[#dce8f5]">
                    {entry?.label || b.typeCode} • {QUALITY_LABELS[b.quality]} • {b.areaSqm} ตร.ม. • พ.ศ. {b.builtYearBE}
                  </div>
                  <div className="mt-0.5 font-mono text-[#7a9ab8]">
                    {b.pricePerSqm.toLocaleString('th-TH')} ฿/ตร.ม. ×
                    หักค่าเสื่อม {b.depreciationRate.toFixed(2)}% =
                    <span className="ml-1 text-[#00e676]">
                      {b.netValue.toLocaleString('th-TH', { maximumFractionDigits: 0 })} ฿
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="ml-2 text-[#ff5252] hover:opacity-70"
                  aria-label="ลบ"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* รวม */}
      {buildings.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#213045] pt-2 text-xs">
          <span className="text-[#7a9ab8]">รวมราคาประเมินสิ่งปลูกสร้าง (หลังหักค่าเสื่อม)</span>
          <span className="font-mono font-semibold text-[#00e676]">
            {totalNet.toLocaleString('th-TH', { maximumFractionDigits: 0 })} ฿
          </span>
        </div>
      )}

      {/* Form draft — ฝัง calculator */}
      {draftOpen && (
        <div className="rounded-md border border-[#40c4ff]/30 bg-[#0d1520] p-3">
          <BuildingDepreciationCalculator
            mode="embedded"
            onChange={(s) => {
              if (s.result && !isValuationError(s.result)) {
                setDraftState({
                  typeCode: s.typeCode,
                  quality: s.quality,
                  areaSqm: s.areaSqm,
                  builtYearBE: s.builtYearBE,
                  pricePerSqm: s.result.pricePerSqm,
                  grossValue: s.result.grossValue,
                  depreciationRate: s.result.depreciationRate,
                  netValue: s.result.netValue,
                });
              } else {
                setDraftState(null);
              }
            }}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={addCurrentDraft}
              disabled={!draftState}
              className="flex-1 rounded-md bg-[#00e676] px-3 py-2 text-sm font-medium text-[#0d1520]
                         disabled:opacity-40"
            >
              ✓ เพิ่ม
            </button>
            <button
              type="button"
              onClick={() => { setDraftOpen(false); setDraftState(null); }}
              className="rounded-md border border-[#213045] px-3 py-2 text-sm text-[#dce8f5]
                         hover:bg-[#111c2b]"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

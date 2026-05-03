// ════════════════════════════════════════
// components/calc/CalculatorPanel.tsx
// แท็บรวม 3 calculators ใช้ในหน้า /plot/[id]
//   💰 สินเชื่อ | 🏛️ ค่าโอน | 🏠 สิ่งปลูกสร้าง
// ════════════════════════════════════════
'use client';

import { useState } from 'react';
import { MortgageCalculator } from './MortgageCalculator';
import { TransferFeeCalculator } from './TransferFeeCalculator';
import { BuildingDepreciationCalculator } from '@/components/building/BuildingDepreciationCalculator';

type Tab = 'mortgage' | 'transfer' | 'building';

interface Props {
  /** ราคาขายของแปลง — pass เป็นค่าตั้งต้นให้ทั้ง mortgage + transfer */
  priceTotal?: number;
}

export function CalculatorPanel({ priceTotal }: Props) {
  const [tab, setTab] = useState<Tab>('mortgage');

  return (
    <div className="rounded-xl border border-[#213045] bg-[#111c2b] p-3">
      <div className="mb-3 text-[13px] font-bold text-[#dce8f5]">🧮 เครื่องคำนวณ</div>

      {/* Tabs */}
      <div className="mb-3 flex gap-1 border-b border-[#213045]">
        <TabBtn active={tab === 'mortgage'} onClick={() => setTab('mortgage')}>💰 สินเชื่อ</TabBtn>
        <TabBtn active={tab === 'transfer'} onClick={() => setTab('transfer')}>🏛️ ค่าโอน</TabBtn>
        <TabBtn active={tab === 'building'} onClick={() => setTab('building')}>🏠 สิ่งปลูกสร้าง</TabBtn>
      </div>

      {/* Content */}
      {tab === 'mortgage' && <MortgageCalculator mode="embedded" initialPriceTotal={priceTotal} />}
      {tab === 'transfer' && <TransferFeeCalculator mode="embedded" initialPriceTotal={priceTotal} />}
      {tab === 'building' && <BuildingDepreciationCalculator mode="embedded" />}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'border-0 bg-transparent px-3 py-2 text-xs transition ' +
        (active
          ? 'border-b-2 border-[#40c4ff] text-[#40c4ff]'
          : 'border-b-2 border-transparent text-[#7a9ab8] hover:text-[#dce8f5]')
      }
    >
      {children}
    </button>
  );
}

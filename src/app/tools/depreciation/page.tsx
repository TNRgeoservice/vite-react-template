// ════════════════════════════════════════
// src/app/tools/depreciation/page.tsx
// หน้า Calculator suite — 3 tabs (สินเชื่อ/ค่าโอน/ค่าเสื่อม)
// ════════════════════════════════════════
'use client';

import { CalculatorPanel } from '@/components/calc/CalculatorPanel';

export default function CalculatorToolPage() {
  return (
    <div className="min-h-screen bg-[#0d1520] pt-[60px]">
      <div className="mx-auto max-w-2xl space-y-3 p-4">
        <div className="mb-2">
          <h1 className="text-xl font-bold text-[#dce8f5]">🧮 เครื่องคำนวณ</h1>
          <p className="mt-1 text-xs text-[#7a9ab8]">
            สินเชื่อบ้าน · ค่าโอนกรมที่ดิน · ค่าเสื่อมสิ่งปลูกสร้าง
          </p>
        </div>

        <CalculatorPanel />

        <p className="pt-2 text-xs text-[#7a9ab8]">
          หมายเหตุ: ตัวเลขเป็นค่าประมาณเพื่ออ้างอิง — ตรวจสอบกับธนาคาร/กรมที่ดินก่อนตัดสินใจจริง
        </p>
      </div>
    </div>
  );
}

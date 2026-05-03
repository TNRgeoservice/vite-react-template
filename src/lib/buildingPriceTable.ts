/**
 * บัญชีราคามาตรฐานสิ่งปลูกสร้าง พ.ศ. 2568-2569
 * ที่มา: สมาคมผู้ประเมินค่าทรัพย์สินแห่งประเทศไทย (VAT)
 * ประกาศ 1 พ.ค. 2567
 *
 * หน่วย: บาท/ตร.ม.
 * null = ไม่มีราคาในบัญชีฯ
 */

import type {
  BuildingTypeEntry,
  BuildingCategory,
  QualityLevel,
} from '@/types/building';

export const BUILDING_TYPES: BuildingTypeEntry[] = [
  // ========== 3.1 บ้านเดี่ยวพักอาศัย ==========
  { code: '101', label: 'บ้านพักอาศัยไม้ชั้นเดียว', category: 'detached', structureType: 'wood',
    prices: { low: 11500, medium: 13300, high: 14900 } },
  { code: '102', label: 'บ้านพักอาศัยไม้ชั้นเดียวใต้ถุนสูง', category: 'detached', structureType: 'wood',
    prices: { low: 13800, medium: 14400, high: 15900 } },
  { code: '103', label: 'บ้านพักอาศัยไม้ 2 ชั้น', category: 'detached', structureType: 'wood',
    prices: { low: 10300, medium: 12500, high: 14400 } },
  { code: '104', label: 'บ้านพักอาศัยตึกชั้นเดียว', category: 'detached', structureType: 'concrete',
    prices: { low: 12400, medium: 14200, high: 16100 } },
  { code: '105', label: 'บ้านพักอาศัยตึก 2 ชั้น (ทั่วไป)', category: 'detached', structureType: 'concrete',
    prices: { low: 11500, medium: 13400, high: 15400 } },
  { code: '105.1', label: 'บ้านพักอาศัยตึก 2-4 ชั้น (พิเศษ)', category: 'detached', structureType: 'concrete',
    prices: { low: 23900, medium: 27000, high: 32400 } },
  { code: '106', label: 'บ้านพักอาศัยตึก 3-4 ชั้น (ทั่วไป)', category: 'detached', structureType: 'concrete',
    prices: { low: 12600, medium: 14700, high: 17900 } },
  { code: '107', label: 'บ้านพักอาศัยตึกแฝด 1-2 ชั้น', category: 'detached', structureType: 'concrete',
    prices: { low: 10500, medium: 12400, high: 14300 } },
  { code: '108', label: 'บ้านพักอาศัยตึกแฝด 3-4 ชั้น', category: 'detached', structureType: 'concrete',
    prices: { low: 12000, medium: 13800, high: 15600 } },
  { code: '109', label: 'บ้านพักอาศัยครึ่งตึกครึ่งไม้ 2 ชั้น', category: 'detached', structureType: 'half-wood',
    prices: { low: 9600, medium: 11600, high: 14200 } },
  { code: '110', label: 'บ้านทรงไทยไม้ชั้นเดียวใต้ถุนสูง (ทั่วไป)', category: 'detached', structureType: 'wood',
    prices: { low: 14700, medium: 15900, high: 17500 } },
  { code: '110.1', label: 'บ้านทรงไทย (พิเศษ)', category: 'detached', structureType: 'wood',
    prices: { low: 22800, medium: 26100, high: 30000 } },
  { code: '111', label: 'บ้านทรงไทยครึ่งตึกครึ่งไม้ 2 ชั้น', category: 'detached', structureType: 'half-wood',
    prices: { low: 13400, medium: 14000, high: 15600 } },

  // ========== 3.2 บ้านแถว/ห้องแถว ==========
  { code: '201', label: 'ทาวน์เฮ้าส์ชั้นเดียว', category: 'townhouse', structureType: 'concrete',
    prices: { low: 8800, medium: 10600, high: 12500 } },
  { code: '202', label: 'ทาวน์เฮ้าส์ 2 ชั้น', category: 'townhouse', structureType: 'concrete',
    prices: { low: 8700, medium: 10400, high: 12300 } },
  { code: '203', label: 'ทาวน์เฮ้าส์ 3 ชั้น', category: 'townhouse', structureType: 'concrete',
    prices: { low: 9400, medium: 11600, high: 13300 } },
  { code: '204', label: 'ทาวน์เฮ้าส์ 2 ชั้น กว้าง 5-6 ม. ไม่มีเสากลาง', category: 'townhouse', structureType: 'concrete',
    prices: { low: 10200, medium: 12200, high: 14100 } },
  { code: '205', label: 'ทาวน์เฮ้าส์ 3 ชั้น กว้าง 5-6 ม. ไม่มีเสากลาง', category: 'townhouse', structureType: 'concrete',
    prices: { low: 10700, medium: 12900, high: 14700 } },
  { code: '301', label: 'ห้องแถวไม้ชั้นเดียว', category: 'townhouse', structureType: 'wood',
    prices: { low: 6800, medium: 8200, high: 9000 } },
  { code: '302', label: 'ห้องแถวไม้ 2 ชั้น', category: 'townhouse', structureType: 'wood',
    prices: { low: 6600, medium: 8000, high: 8700 } },
  { code: '303', label: 'ห้องแถวครึ่งตึกครึ่งไม้ 2 ชั้น', category: 'townhouse', structureType: 'half-wood',
    prices: { low: 7000, medium: 8700, high: 9100 } },

  // ========== 3.3 ตึกแถว (อาคารพาณิชย์) ==========
  { code: '401', label: 'ตึกแถวชั้นเดียว', category: 'commercial', structureType: 'concrete',
    prices: { low: 7500, medium: 8600, high: 9500 } },
  { code: '402', label: 'ตึกแถว 2 ชั้น (รวมมีชั้นลอย/2 ชั้นครึ่ง)', category: 'commercial', structureType: 'concrete',
    prices: { low: 8400, medium: 9800, high: 11200 } },
  { code: '403', label: 'ตึกแถว 3 ชั้น (รวมมีชั้นลอย/3 ชั้นครึ่ง)', category: 'commercial', structureType: 'concrete',
    prices: { low: 8800, medium: 10300, high: 12300 } },
  { code: '404', label: 'ตึกแถว 4 ชั้น (รวมมีชั้นลอย/4 ชั้นครึ่ง)', category: 'commercial', structureType: 'concrete',
    prices: { low: 9600, medium: 10900, high: 13100 } },

  // ========== 3.4 โกดัง/สำนักงาน ==========
  // 501 โกดังตอกเข็ม
  { code: '501-a', label: 'โกดังเก็บของ (ตอกเข็ม) — พื้นที่ไม่เกิน 500 ตร.ม.', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 8400, medium: 9800, high: 11100 } },
  { code: '501-b', label: 'โกดังเก็บของ (ตอกเข็ม) — พื้นที่ 501-2,000 ตร.ม.', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 8000, medium: 9400, high: 10600 } },
  { code: '501-c', label: 'โกดังเก็บของ (ตอกเข็ม) — พื้นที่ 2,001-10,000 ตร.ม.', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 7800, medium: 8900, high: 10100 } },
  { code: '501-d', label: 'โกดังเก็บของ (ตอกเข็ม) — พื้นที่ 10,000 ตร.ม. ขึ้นไป', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 8600, medium: 9700, high: 10900 } },
  // 501.1 โกดังไม่ตอกเข็ม
  { code: '501.1-a', label: 'โกดังเก็บของ (ไม่ตอกเข็ม) — พื้นที่ไม่เกิน 500 ตร.ม.', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 7100, medium: 8200, high: 9800 } },
  { code: '501.1-b', label: 'โกดังเก็บของ (ไม่ตอกเข็ม) — พื้นที่ 501-2,000 ตร.ม.', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 6900, medium: 7800, high: 9100 } },
  { code: '501.1-c', label: 'โกดังเก็บของ (ไม่ตอกเข็ม) — พื้นที่ 2,001-10,000 ตร.ม.', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 6700, medium: 7500, high: 8700 } },
  { code: '501.1-d', label: 'โกดังเก็บของ (ไม่ตอกเข็ม) — พื้นที่ 10,000 ตร.ม. ขึ้นไป', category: 'warehouse', structureType: 'warehouse',
    prices: { low: 7500, medium: 8400, high: 9500 } },
  // 507 อาคารสำนักงาน
  { code: '507-a', label: 'อาคารสำนักงาน — ในโรงงาน/โกดัง สูงไม่เกิน 3 ชั้น', category: 'warehouse', structureType: 'concrete',
    prices: { low: 12600, medium: 13300, high: 14300 } },
  { code: '507-b', label: 'อาคารสำนักงาน — ตึกสูงไม่เกิน 7 ชั้น', category: 'warehouse', structureType: 'concrete',
    prices: { low: 21600, medium: 23800, high: 28600 } },
  { code: '507-c', label: 'อาคารสำนักงาน — ตึกสูง 8-15 ชั้น', category: 'warehouse', structureType: 'concrete',
    prices: { low: 23900, medium: 26200, high: 31400 } },
  { code: '507-d', label: 'อาคารสำนักงาน — ตึกสูง 16-25 ชั้น', category: 'warehouse', structureType: 'concrete',
    prices: { low: 26200, medium: 28900, high: 34700 } },
  { code: '507-e', label: 'อาคารสำนักงาน — ตึกสูง 26-40 ชั้น', category: 'warehouse', structureType: 'concrete',
    prices: { low: 31800, medium: 35100, high: 42000 } },
  { code: '507-f', label: 'อาคารสำนักงาน — ตึกสูง 41-60 ชั้น', category: 'warehouse', structureType: 'concrete',
    prices: { low: null, medium: 45900, high: 53000 } },

  // ========== 3.5 โรงแรม/คอนโด ==========
  // 521 โรงแรม
  { code: '521-a', label: 'โรงแรม — ไม่เกิน 5 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: 15200, medium: 18400, high: 21600 } },
  { code: '521-b', label: 'โรงแรม — 6-8 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: 19500, medium: 21400, high: 23600 } },
  { code: '521-c', label: 'โรงแรม — 9-20 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: 23800, medium: 26200, high: 28900 } },
  { code: '521-d', label: 'โรงแรม — 41-60 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: null, medium: 38800, high: 45900 } },
  // 528 คอนโดมิเนียม
  { code: '528-a', label: 'คอนโดมิเนียม — ไม่เกิน 8 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: 14600, medium: 17300, high: 19500 } },
  { code: '528-b', label: 'คอนโดมิเนียม — 9-20 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: 16200, medium: 19500, high: 22700 } },
  { code: '528-c', label: 'คอนโดมิเนียม — 21-40 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: 21600, medium: 26000, high: 30300 } },
  { code: '528-d', label: 'คอนโดมิเนียม — 41-60 ชั้น', category: 'hotel-condo', structureType: 'concrete',
    prices: { low: null, medium: 38800, high: 45900 } },
];

/** label หมวดหมู่ */
export const CATEGORY_LABELS: Record<BuildingCategory, string> = {
  detached: 'บ้านเดี่ยว',
  townhouse: 'บ้านแถว/ห้องแถว',
  commercial: 'ตึกแถว (อาคารพาณิชย์)',
  warehouse: 'โกดัง/สำนักงาน',
  'hotel-condo': 'โรงแรม/คอนโด',
};

/** label ระดับคุณภาพ */
export const QUALITY_LABELS: Record<QualityLevel, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
};

/** ค้นหา entry จาก code */
export function getBuildingType(code: string): BuildingTypeEntry | undefined {
  return BUILDING_TYPES.find((b) => b.code === code);
}

/** ดึงราคา/ตร.ม. ตาม code + quality (null = ไม่มีในบัญชีฯ) */
export function getPricePerSqm(code: string, quality: QualityLevel): number | null {
  const entry = getBuildingType(code);
  if (!entry) return null;
  return entry.prices[quality];
}

/** จัดกลุ่มตาม category สำหรับ dropdown 2-tier */
export function getBuildingsByCategory(): Record<BuildingCategory, BuildingTypeEntry[]> {
  const grouped: Record<BuildingCategory, BuildingTypeEntry[]> = {
    detached: [],
    townhouse: [],
    commercial: [],
    warehouse: [],
    'hotel-condo': [],
  };
  for (const b of BUILDING_TYPES) {
    grouped[b.category].push(b);
  }
  return grouped;
}

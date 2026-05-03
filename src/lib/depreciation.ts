/**
 * หลักเกณฑ์การคิดค่าเสื่อมราคาสิ่งปลูกสร้าง
 * อิงตารางในข้อ 5 ของบัญชีราคามาตรฐาน VAT พ.ศ. 2568-2569
 *
 * V1: คำนวณจากอายุปฏิทิน (Calendar Age) เท่านั้น
 * V2 (อนาคต): รองรับ Effective Age กรณี renovation
 */

import type {
  StructureType,
  QualityLevel,
  BuildingValuationOutput,
} from '@/types/building';
import { getPricePerSqm, getBuildingType } from './buildingPriceTable';

/** ช่วงปีและอัตราค่าเสื่อม */
interface DepreciationBracket {
  /** ปีเริ่มต้น (inclusive) */
  fromYear: number;
  /** ปีสิ้นสุด (inclusive) */
  toYear: number;
  /** % ค่าเสื่อมต่อปีในช่วงนี้ */
  ratePerYear: number;
}

interface DepreciationRule {
  brackets: DepreciationBracket[];
  /** เพดาน % ค่าเสื่อมสะสมตลอดอายุ */
  maxRate: number;
}

/**
 * กฎค่าเสื่อมราคาแยกตามประเภทโครงสร้าง
 * (V1 ใช้ 4 ประเภทแรก — open-roof ไม่ผูกกับ building type ใน V1)
 */
export const DEPRECIATION_RULES: Record<StructureType, DepreciationRule> = {
  // ตึก / โครงสร้างเหล็ก: ปี 1-10 (1%), 11-42 (2%), cap 76%
  concrete: {
    brackets: [
      { fromYear: 1, toYear: 10, ratePerYear: 1 },
      { fromYear: 11, toYear: 42, ratePerYear: 2 },
    ],
    maxRate: 76,
  },
  // ครึ่งตึกครึ่งไม้: ปี 1-5 (2%), 6-15 (4%), 16-21 (5%), cap 85%
  'half-wood': {
    brackets: [
      { fromYear: 1, toYear: 5, ratePerYear: 2 },
      { fromYear: 6, toYear: 15, ratePerYear: 4 },
      { fromYear: 16, toYear: 21, ratePerYear: 5 },
    ],
    maxRate: 85,
  },
  // ไม้: ปี 1-5 (3%), 6-19 (5%), cap 90%
  wood: {
    brackets: [
      { fromYear: 1, toYear: 5, ratePerYear: 3 },
      { fromYear: 6, toYear: 19, ratePerYear: 5 },
    ],
    maxRate: 90,
  },
  // โรงงาน/โกดัง: ปี 1-10 (2%), 11-33 (2.5%), cap 80%
  warehouse: {
    brackets: [
      { fromYear: 1, toYear: 10, ratePerYear: 2 },
      { fromYear: 11, toYear: 33, ratePerYear: 2.5 },
    ],
    maxRate: 80,
  },
  // ส่วนโล่งหลังคาคลุม: ปี 1-5 (2%), 6-29 (3%), cap 85%
  'open-roof': {
    brackets: [
      { fromYear: 1, toYear: 5, ratePerYear: 2 },
      { fromYear: 6, toYear: 29, ratePerYear: 3 },
    ],
    maxRate: 85,
  },
};

/**
 * คำนวณ % ค่าเสื่อมจากอายุ (ปี)
 * @param structureType ประเภทโครงสร้าง
 * @param ageYears อายุอาคาร (ปี) — ถ้า ≤ 0 → 0%
 * @returns % ค่าเสื่อม (0-maxRate)
 */
export function calcDepreciationRate(
  structureType: StructureType,
  ageYears: number
): number {
  if (ageYears <= 0) return 0;

  const rule = DEPRECIATION_RULES[structureType];
  let total = 0;

  for (const bracket of rule.brackets) {
    if (ageYears < bracket.fromYear) break;
    const yearsInBracket = Math.min(ageYears, bracket.toYear) - bracket.fromYear + 1;
    total += yearsInBracket * bracket.ratePerYear;
  }

  return Math.min(total, rule.maxRate);
}

/** หาอายุอาคาร (ปี) จากปี พ.ศ. ที่สร้าง */
export function calcBuildingAge(builtYearBE: number, currentYearBE?: number): number {
  const currentBE = currentYearBE ?? new Date().getFullYear() + 543;
  return Math.max(0, currentBE - builtYearBE);
}

/**
 * คำนวณราคาประเมินสิ่งปลูกสร้างหลังหักค่าเสื่อม
 *
 * @returns BuildingValuationResult ถ้าสำเร็จ, BuildingValuationError ถ้าไม่มีราคาในบัญชีฯ
 */
export function calcBuildingValue(params: {
  typeCode: string;
  quality: QualityLevel;
  areaSqm: number;
  builtYearBE: number;
  currentYearBE?: number;
}): BuildingValuationOutput {
  const { typeCode, quality, areaSqm, builtYearBE, currentYearBE } = params;

  const entry = getBuildingType(typeCode);
  if (!entry) {
    return { error: 'ไม่พบประเภทอาคารที่เลือก' };
  }

  const pricePerSqm = getPricePerSqm(typeCode, quality);
  if (pricePerSqm === null) {
    return {
      error: 'ไม่สามารถคำนวณราคาได้ เนื่องจากไม่มีราคาประเมินในบัญชีฯ',
    };
  }

  if (areaSqm <= 0) {
    return { error: 'พื้นที่สิ่งปลูกสร้างต้องมากกว่า 0' };
  }

  const age = calcBuildingAge(builtYearBE, currentYearBE);
  const depreciationRate = calcDepreciationRate(entry.structureType, age);
  const grossValue = pricePerSqm * areaSqm;
  const netValue = grossValue * (1 - depreciationRate / 100);

  return {
    pricePerSqm,
    grossValue,
    depreciationRate,
    netValue,
  };
}

/** type guard */
export function isValuationError(
  output: BuildingValuationOutput
): output is { error: string } {
  return 'error' in output;
}

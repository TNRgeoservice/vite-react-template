/**
 * Types สำหรับสิ่งปลูกสร้าง — อิงบัญชีราคามาตรฐาน VAT พ.ศ. 2568-2569
 */

/** ระดับคุณภาพการก่อสร้าง */
export type QualityLevel = 'low' | 'medium' | 'high';

/**
 * ประเภทโครงสร้างหลัก — ใช้ map ไปยังกฎค่าเสื่อม
 * ดูตารางในข้อ 5 ของบัญชีฯ
 */
export type StructureType =
  | 'concrete'      // ตึก / โครงสร้างเหล็ก (cap 76%)
  | 'half-wood'     // ครึ่งตึกครึ่งไม้ (cap 85%)
  | 'wood'          // ไม้ (cap 90%)
  | 'warehouse'     // โรงงาน/โกดัง (cap 80%)
  | 'open-roof';    // ส่วนโล่งหลังคาคลุม (cap 85%) — ยังไม่ใช้ใน V1

/** หมวดหมู่อาคาร — ใช้จัดกลุ่มใน dropdown */
export type BuildingCategory =
  | 'detached'      // 3.1 บ้านเดี่ยว
  | 'townhouse'     // 3.2 บ้านแถว/ห้องแถว
  | 'commercial'    // 3.3 ตึกแถว
  | 'warehouse'     // 3.4 โกดัง/สำนักงาน
  | 'hotel-condo';  // 3.5 โรงแรม/คอนโด

/** ราคา 3 ระดับ — null = ไม่มีราคาในบัญชีฯ */
export interface PriceTier {
  low: number | null;
  medium: number | null;
  high: number | null;
}

/** entry ในตารางราคา — รองรับทั้งแบบ flat และ sub-variant */
export interface BuildingTypeEntry {
  /** รหัสจากบัญชีฯ เช่น "101", "105.1", "501-a" (sub-variant ใช้ suffix) */
  code: string;
  /** ชื่อแสดงผล */
  label: string;
  /** หมวดหมู่ใหญ่ */
  category: BuildingCategory;
  /** ประเภทโครงสร้างหลัก สำหรับคำนวณค่าเสื่อม */
  structureType: StructureType;
  /** ราคา ต่ำ/กลาง/สูง (บาท/ตร.ม.) */
  prices: PriceTier;
}

/**
 * ข้อมูลสิ่งปลูกสร้างที่กรอกในประกาศ — เก็บใน Firestore
 * (1 แปลงมีได้หลายหลัง → array ของ object นี้)
 */
export interface BuildingInfo {
  /** รหัสประเภทอาคาร อ้างถึง BuildingTypeEntry.code */
  typeCode: string;
  /** ระดับคุณภาพ */
  quality: QualityLevel;
  /** พื้นที่ใช้สอย (ตร.ม.) */
  areaSqm: number;
  /** ปีที่สร้าง (พ.ศ.) */
  builtYearBE: number;
  /** ราคา/ตร.ม. ตามบัญชีฯ (denormalized — เก็บไว้กันราคาบัญชีฯ เปลี่ยนรอบหน้า) */
  pricePerSqm: number;
  /** ราคารวมก่อนหักค่าเสื่อม */
  grossValue: number;
  /** % ค่าเสื่อมที่ใช้ */
  depreciationRate: number;
  /** ราคาหลังหักค่าเสื่อม */
  netValue: number;
}

/** ผลลัพธ์การคำนวณ — ใช้ใน calculator */
export interface BuildingValuationResult {
  pricePerSqm: number;
  grossValue: number;
  depreciationRate: number;
  netValue: number;
}

/** error เมื่อไม่มีราคาในบัญชีฯ */
export interface BuildingValuationError {
  error: string;
}

export type BuildingValuationOutput = BuildingValuationResult | BuildingValuationError;

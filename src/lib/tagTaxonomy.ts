// tagTaxonomy.ts — 7 categories (sync with Landingpage)
export type TagCategoryKey =
  | 'land_type' | 'location' | 'utility' | 'feature' | 'usage' | 'sales' | 'legacy';

export interface TagCategory {
  key: TagCategoryKey;
  label: string;
  tags: readonly string[];
}

export const TAG_CATEGORIES: readonly TagCategory[] = [
  {
    key: 'land_type',
    label: 'ประเภทที่ดิน',
    tags: ['ที่ดินเปล่า','ที่ดินสร้างบ้าน','ที่ดินบ้านสวน','ที่ดินการเกษตร','ที่ดินเชิงพาณิชย์','ที่ดินลงทุน','ที่ดินจัดสรร','ที่ดินรีสอร์ท'],
  },
  {
    key: 'location',
    label: 'ทำเล',
    tags: ['ติดถนนดำ','ติดถนนคอนกรีต','ติดถนนใหญ่','ติดถนนลาดยาง','ติดทางหลวง','ใกล้เมือง','ใกล้ตลาด','ใกล้โรงเรียน','ใกล้โรงพยาบาล','ใกล้มหาวิทยาลัย','ใกล้นิคม','ใกล้แหล่งชุมชน','ใกล้ปั๊มน้ำมัน','ใกล้เซเว่น','ใกล้โลตัส','ใกล้บิ๊กซี','ใกล้อำเภอ','ใกล้เทศบาล','ใกล้สนามบิน','ใกล้สถานีรถไฟ','ใกล้ถนนบายพาส','เดินทางสะดวก','เข้าออกได้หลายทาง','เข้าซอยไม่ลึก'],
  },
  {
    key: 'utility',
    label: 'สาธารณูปโภค',
    tags: ['ไฟฟ้าเข้าถึง','น้ำประปา','อินเทอร์เน็ตถึง','ถนนเข้าออกสะดวก','รถใหญ่เข้าได้','มีทางสาธารณะ','ถมแล้ว','พร้อมปลูกสร้าง','มีรั้ว','พร้อมโอน','น้ำไม่ท่วม','ที่สูง','ถนนกว้าง','รถสวนกันได้'],
  },
  {
    key: 'feature',
    label: 'จุดเด่นทำเล',
    tags: ['วิวสวย','วิวทุ่งนา','วิวภูเขา','วิวธรรมชาติ','ติดลำห้วย','ติดคลอง','ติดคลองสาธารณะ','ติดแม่น้ำ','ลมดี','อากาศดี','เงียบสงบ','เป็นส่วนตัว','รูปแปลงสวย','หน้ากว้าง','แปลงมุม','สี่เหลี่ยมสวย'],
  },
  {
    key: 'usage',
    label: 'เหมาะใช้',
    tags: ['เหมาะสร้างบ้าน','เหมาะทำบ้านสวน','เหมาะทำคาเฟ่','เหมาะทำรีสอร์ท','เหมาะลงทุน','เหมาะเก็งกำไร','เหมาะทำโกดัง','เหมาะทำร้านค้า','เหมาะปล่อยเช่า','เหมาะทำโครงการ','เหมาะปลูกบ้าน','เหมาะทำสวน'],
  },
  {
    key: 'sales',
    label: 'การขาย',
    tags: ['เจ้าของขายเอง','ราคาต่อรองได้','ฟรีโอน','ผ่อนกับเจ้าของ','ราคาพิเศษ','ด่วน','ต่ำกว่าประเมิน','แบ่งขาย','มีหลายแปลง','พร้อมเข้าอยู่','ซื้อเก็บคุ้ม','เอกสารครบ','โฉนดครุฑแดง','ฟรีดำเนินการ','ฟรีค่าธรรมเนียม'],
  },
  {
    key: 'legacy',
    label: 'อื่นๆ (เดิม)',
    tags: ['โฉนด','ตรวจสอบแล้ว','ผังเมืองสีเหลือง','ไฟฟ้า-น้ำพร้อม','ใกล้รถไฟฟ้า','ใกล้ทางด่วน','ใกล้แหล่งท่องเที่ยว','ใกล้ทะเล','ถนนคอนกรีต','มีรั้วล้อม','แบ่งขายได้','ติดถนนซอย','ใกล้โรงงาน'],
  },
] as const;

/** Popular tags — แสดงด้านบน FilterSidebar (cross-category) */
export const POPULAR_TAGS = [
  'ติดถนนใหญ่','ใกล้เมือง','ถมแล้ว','พร้อมโอน','วิวสวย','เหมาะสร้างบ้าน','เจ้าของขายเอง','ราคาต่อรองได้',
] as const;

/** Flat list ของ preset ทั้งหมด */
export const PRESET_TAGS: readonly string[] = TAG_CATEGORIES.flatMap((c) => c.tags);

export type PresetTag = (typeof PRESET_TAGS)[number];

export const TAG_RULES = {
  MAX_PER_PLOT: 15,
  MIN_LENGTH: 1,
  MAX_LENGTH: 30,
  FORBIDDEN_REGEX: /[<>"'`\\/{}[\]|]/,
} as const;

export function normalizeTag(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

export function validateTag(raw: string): string | null {
  const t = normalizeTag(raw);
  if (t.length < TAG_RULES.MIN_LENGTH) return 'tag สั้นเกินไป';
  if (t.length > TAG_RULES.MAX_LENGTH) return `tag ยาวเกิน ${TAG_RULES.MAX_LENGTH} ตัว`;
  if (TAG_RULES.FORBIDDEN_REGEX.test(t)) return 'มีอักขระต้องห้าม';
  return null;
}

export function isPresetTag(tag: string): boolean {
  return PRESET_TAGS.includes(tag);
}

export function getCategoryOfTag(tag: string): TagCategory | null {
  for (const c of TAG_CATEGORIES) {
    if (c.tags.includes(tag)) return c;
  }
  return null;
}

export function suggestTags(query: string, exclude: string[] = []): string[] {
  const q = normalizeTag(query).toLowerCase();
  if (!q) return [];
  const excludeSet = new Set(exclude);
  return PRESET_TAGS.filter((t) => !excludeSet.has(t) && t.toLowerCase().includes(q));
}

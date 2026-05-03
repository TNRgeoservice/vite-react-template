// ════════════════════════════════════════
// src/lib/gov-layers.ts
// Government map overlay layer configs + legends
// Port of GOV_LAYERS + GOV_LEGENDS ใน legacy index.html (~line 1856)
// ════════════════════════════════════════

export type GovLayerKey = 'landuse' | 'cityplan_bkk' | 'parcel' | 'forest' | 'geology' | 'soil';

export type GovLayerConfig =
  | { type: 'wms'; url: string; layers: string; name: string; version: '1.1.1' | '1.3.0'; minZoom?: number }
  | { type: 'arcgis-tile'; url: string; name: string; minZoom?: number };

export const GOV_LAYERS: Record<GovLayerKey, GovLayerConfig> = {
  landuse:      { type: 'wms', url: 'https://ms.longdo.com/mapproxy/service?', layers: 'cityplan_dpt',  name: 'ผังเมือง (DPT)',     version: '1.1.1' },
  cityplan_bkk: { type: 'wms', url: 'https://ms.longdo.com/mapproxy/service?', layers: 'cityplan_bkk', name: 'ผังเมืองกรุงเทพฯ',   version: '1.1.1' },
  parcel:       { type: 'wms', url: 'https://ms.longdo.com/mapproxy/service?', layers: 'dol_hd',        name: 'รูปแปลงที่ดิน (HD)', version: '1.3.0', minZoom: 14 },
  forest:       { type: 'arcgis-tile', url: 'https://gis3.forest.go.th/arcgis/rest/services/rfd_service/ForestArea/MapServer/tile/{z}/{y}/{x}', name: 'ป่าสงวนแห่งชาติ' },
  geology:      { type: 'arcgis-tile', url: 'https://gis.dmr.go.th/arcgis/rest/services/DMR_Geology/Geology_1M/MapServer/tile/{z}/{y}/{x}', name: 'ธรณีวิทยา' },
  soil:         { type: 'arcgis-tile', url: 'https://eis.ldd.go.th/ArcGIS/rest/services/LDD_SOIL_WM_CACHE/MapServer/tile/{z}/{y}/{x}', name: 'กลุ่มชุดดิน' },
};

export interface LegendItem { color: string; label: string }
export interface LegendSpec  { title: string; items: LegendItem[]; note?: string }

export const GOV_LEGENDS: Partial<Record<GovLayerKey, LegendSpec>> = {
  landuse: {
    title: 'สีผังเมืองรวม',
    items: [
      { color: '#c62828', label: 'ย.1 ที่พักอาศัยหนาแน่นมาก' },
      { color: '#e65100', label: 'ย.2 หนาแน่นปานกลาง' },
      { color: '#f9a825', label: 'ย.3 หนาแน่นน้อย' },
      { color: '#558b2f', label: 'ก. ชนบทและเกษตรกรรม' },
      { color: '#2e7d32', label: 'กพ. อนุรักษ์ชนบทฯ' },
      { color: '#6a1b9a', label: 'พ. พาณิชยกรรม' },
      { color: '#1565c0', label: 'อ. อุตสาหกรรม' },
      { color: '#00695c', label: 'ท. สาธารณูปโภค' },
    ],
    note: 'สีขึ้นกับประกาศกฎกระทรวงฯ แต่ละจังหวัด',
  },
  forest: {
    title: 'ป่าสงวนแห่งชาติ',
    items: [
      { color: '#2e7d32', label: 'ป่าสงวนแห่งชาติ' },
      { color: '#1b5e20', label: 'ชั้น 1ก (ต้นน้ำ)' },
      { color: '#388e3c', label: 'ชั้น 2 (เกษตรกรรม)' },
      { color: '#81c784', label: 'ชั้น 3 (เศรษฐกิจ)' },
    ],
    note: 'ข้อมูลจากกรมป่าไม้',
  },
  geology: {
    title: 'ธรณีวิทยา 1:1,000,000',
    items: [
      { color: '#e53935', label: 'หินอัคนีแทรกซอน' },
      { color: '#f06292', label: 'หินอัคนีพุ' },
      { color: '#7b1fa2', label: 'หินแปร' },
      { color: '#1e88e5', label: 'หินปูน' },
      { color: '#8d6e63', label: 'หินดินดาน/หินทราย' },
      { color: '#fdd835', label: 'ตะกอนยุคควอเทอร์นารี' },
    ],
    note: 'มาตราส่วน 1:1,000,000',
  },
  soil: {
    title: 'กลุ่มชุดดิน 62 กลุ่ม',
    items: [
      { color: '#1565c0', label: 'กลุ่ม 1–6 ดินนาลุ่มน้ำ' },
      { color: '#42a5f5', label: 'กลุ่ม 7–13 ดินนา' },
      { color: '#a5d6a7', label: 'กลุ่ม 14–18 ดินร่วน' },
      { color: '#66bb6a', label: 'กลุ่ม 19–24 ดินร่วนเหนียว' },
      { color: '#ffb300', label: 'กลุ่ม 25–33 ดินร่วนทราย' },
      { color: '#8d6e63', label: 'กลุ่ม 41–46 ดินตื้น' },
      { color: '#e53935', label: 'กลุ่ม 52–54 ดินเปรี้ยวจัด' },
    ],
    note: 'ซูมเข้าใกล้เพื่อดูรายละเอียด',
  },
  parcel: {
    title: 'รูปแปลงที่ดิน (กรมที่ดิน)',
    items: [
      { color: '#1565c0', label: 'เส้นขอบแปลงตามเอกสารสิทธิ์' },
      { color: '#42a5f5', label: 'แปลงไม่มีเอกสารสิทธิ์' },
    ],
    note: 'ซูม ≥ 14 จึงแสดง',
  },
};

export const DISPLAY_ORDER: { key: GovLayerKey; dot: string; sub?: string }[] = [
  { key: 'landuse',      dot: 'linear-gradient(135deg,#e91e63,#ff9800,#4caf50,#2196f3)', sub: 'กรมโยธาธิการฯ · WMS' },
  { key: 'cityplan_bkk', dot: 'linear-gradient(135deg,#e91e63,#ff5722)',                  sub: 'กทม. · WMS' },
  { key: 'parcel',       dot: '#1565c0',                                                   sub: 'กรมที่ดิน · WMS ซูม ≥14' },
  { key: 'forest',       dot: '#2e7d32',                                                   sub: 'กรมป่าไม้' },
  { key: 'geology',      dot: '#795548',                                                   sub: 'กรมทรัพยากรธรณี' },
  { key: 'soil',         dot: '#ff8f00',                                                   sub: 'กรมพัฒนาที่ดิน' },
];

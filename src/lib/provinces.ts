// ════════════════════════════════════════
// lib/provinces.ts
// 77 จังหวัดไทย + ศูนย์กลาง (lat/lng) + zoom ที่เหมาะสม
// ใช้กับ FilterSidebar → เลือกจังหวัดแล้ว map.flyTo()
// ════════════════════════════════════════
export interface Province {
  name: string;   // ชื่อไทย (ตรงกับ field plot.province)
  lat:  number;
  lng:  number;
  zoom: number;   // ประมาณ 9-11 (จังหวัดใหญ่ซูมออกหน่อย)
}

export const PROVINCES: Province[] = [
  { name: 'กรุงเทพมหานคร',      lat: 13.7563, lng: 100.5018, zoom: 10 },
  { name: 'กระบี่',              lat: 8.0863,  lng: 98.9063,  zoom: 10 },
  { name: 'กาญจนบุรี',           lat: 14.0227, lng: 99.5328,  zoom: 9  },
  { name: 'กาฬสินธุ์',           lat: 16.4315, lng: 103.5059, zoom: 10 },
  { name: 'กำแพงเพชร',           lat: 16.4827, lng: 99.5226,  zoom: 10 },
  { name: 'ขอนแก่น',             lat: 16.4419, lng: 102.8360, zoom: 10 },
  { name: 'จันทบุรี',            lat: 12.6113, lng: 102.1035, zoom: 10 },
  { name: 'ฉะเชิงเทรา',          lat: 13.6904, lng: 101.0779, zoom: 10 },
  { name: 'ชลบุรี',              lat: 13.3611, lng: 100.9847, zoom: 10 },
  { name: 'ชัยนาท',              lat: 15.1851, lng: 100.1251, zoom: 10 },
  { name: 'ชัยภูมิ',             lat: 15.8068, lng: 102.0314, zoom: 9  },
  { name: 'ชุมพร',               lat: 10.4930, lng: 99.1800,  zoom: 10 },
  { name: 'เชียงราย',            lat: 19.9105, lng: 99.8406,  zoom: 10 },
  { name: 'เชียงใหม่',           lat: 18.7883, lng: 98.9853,  zoom: 9  },
  { name: 'ตรัง',                lat: 7.5645,  lng: 99.6239,  zoom: 10 },
  { name: 'ตราด',                lat: 12.2428, lng: 102.5177, zoom: 10 },
  { name: 'ตาก',                 lat: 16.8840, lng: 99.1258,  zoom: 9  },
  { name: 'นครนายก',             lat: 14.2069, lng: 101.2131, zoom: 11 },
  { name: 'นครปฐม',              lat: 13.8196, lng: 100.0645, zoom: 10 },
  { name: 'นครพนม',              lat: 17.4108, lng: 104.7690, zoom: 10 },
  { name: 'นครราชสีมา',          lat: 14.9799, lng: 102.0978, zoom: 9  },
  { name: 'นครศรีธรรมราช',       lat: 8.4304,  lng: 99.9633,  zoom: 9  },
  { name: 'นครสวรรค์',           lat: 15.7047, lng: 100.1372, zoom: 10 },
  { name: 'นนทบุรี',             lat: 13.8622, lng: 100.5134, zoom: 11 },
  { name: 'นราธิวาส',            lat: 6.4251,  lng: 101.8253, zoom: 10 },
  { name: 'น่าน',                lat: 18.7756, lng: 100.7731, zoom: 9  },
  { name: 'บึงกาฬ',              lat: 18.3609, lng: 103.6466, zoom: 10 },
  { name: 'บุรีรัมย์',           lat: 14.9930, lng: 103.1029, zoom: 9  },
  { name: 'ปทุมธานี',            lat: 14.0208, lng: 100.5250, zoom: 11 },
  { name: 'ประจวบคีรีขันธ์',     lat: 11.8126, lng: 99.7957,  zoom: 9  },
  { name: 'ปราจีนบุรี',          lat: 14.0421, lng: 101.6601, zoom: 10 },
  { name: 'ปัตตานี',             lat: 6.7689,  lng: 101.2535, zoom: 10 },
  { name: 'พระนครศรีอยุธยา',     lat: 14.3692, lng: 100.5877, zoom: 10 },
  { name: 'พังงา',               lat: 8.4502,  lng: 98.5255,  zoom: 10 },
  { name: 'พัทลุง',              lat: 7.6167,  lng: 100.0740, zoom: 10 },
  { name: 'พิจิตร',              lat: 16.4429, lng: 100.3487, zoom: 10 },
  { name: 'พิษณุโลก',            lat: 16.8211, lng: 100.2659, zoom: 10 },
  { name: 'เพชรบุรี',            lat: 12.9829, lng: 99.9568,  zoom: 10 },
  { name: 'เพชรบูรณ์',           lat: 16.4189, lng: 101.1591, zoom: 9  },
  { name: 'แพร่',                lat: 18.1445, lng: 100.1405, zoom: 10 },
  { name: 'พะเยา',               lat: 19.1664, lng: 99.9009,  zoom: 10 },
  { name: 'ภูเก็ต',              lat: 7.8804,  lng: 98.3923,  zoom: 11 },
  { name: 'มหาสารคาม',           lat: 16.1850, lng: 103.3027, zoom: 10 },
  { name: 'มุกดาหาร',            lat: 16.5422, lng: 104.7208, zoom: 10 },
  { name: 'แม่ฮ่องสอน',          lat: 19.3020, lng: 97.9654,  zoom: 9  },
  { name: 'ยะลา',                lat: 6.5413,  lng: 101.2803, zoom: 10 },
  { name: 'ยโสธร',               lat: 15.7926, lng: 104.1452, zoom: 10 },
  { name: 'ร้อยเอ็ด',            lat: 16.0538, lng: 103.6520, zoom: 10 },
  { name: 'ระนอง',               lat: 9.9528,  lng: 98.6085,  zoom: 10 },
  { name: 'ระยอง',               lat: 12.6802, lng: 101.2588, zoom: 10 },
  { name: 'ราชบุรี',             lat: 13.5283, lng: 99.8134,  zoom: 10 },
  { name: 'ลพบุรี',              lat: 14.7995, lng: 100.6534, zoom: 10 },
  { name: 'ลำปาง',               lat: 18.2888, lng: 99.4909,  zoom: 9  },
  { name: 'ลำพูน',               lat: 18.5744, lng: 99.0087,  zoom: 10 },
  { name: 'เลย',                 lat: 17.4860, lng: 101.7223, zoom: 9  },
  { name: 'ศรีสะเกษ',            lat: 15.1186, lng: 104.3220, zoom: 10 },
  { name: 'สกลนคร',              lat: 17.1545, lng: 104.1348, zoom: 10 },
  { name: 'สงขลา',               lat: 7.1896,  lng: 100.5954, zoom: 10 },
  { name: 'สตูล',                lat: 6.6238,  lng: 100.0674, zoom: 10 },
  { name: 'สมุทรปราการ',         lat: 13.5990, lng: 100.5998, zoom: 11 },
  { name: 'สมุทรสงคราม',         lat: 13.4098, lng: 100.0022, zoom: 11 },
  { name: 'สมุทรสาคร',           lat: 13.5475, lng: 100.2744, zoom: 11 },
  { name: 'สระแก้ว',             lat: 13.8240, lng: 102.0645, zoom: 10 },
  { name: 'สระบุรี',             lat: 14.5289, lng: 100.9108, zoom: 10 },
  { name: 'สิงห์บุรี',           lat: 14.8937, lng: 100.3969, zoom: 11 },
  { name: 'สุโขทัย',             lat: 17.0068, lng: 99.8265,  zoom: 10 },
  { name: 'สุพรรณบุรี',          lat: 14.4745, lng: 100.1177, zoom: 10 },
  { name: 'สุราษฎร์ธานี',        lat: 9.1382,  lng: 99.3215,  zoom: 9  },
  { name: 'สุรินทร์',            lat: 14.8820, lng: 103.4960, zoom: 10 },
  { name: 'หนองคาย',             lat: 17.8782, lng: 102.7412, zoom: 10 },
  { name: 'หนองบัวลำภู',         lat: 17.2216, lng: 102.4260, zoom: 10 },
  { name: 'อ่างทอง',             lat: 14.5897, lng: 100.4551, zoom: 11 },
  { name: 'อำนาจเจริญ',          lat: 15.8657, lng: 104.6261, zoom: 10 },
  { name: 'อุดรธานี',            lat: 17.4139, lng: 102.7870, zoom: 10 },
  { name: 'อุตรดิตถ์',           lat: 17.6200, lng: 100.0993, zoom: 10 },
  { name: 'อุทัยธานี',           lat: 15.3835, lng: 100.0246, zoom: 10 },
  { name: 'อุบลราชธานี',         lat: 15.2448, lng: 104.8473, zoom: 9  },
];

export const PROVINCE_NAMES: string[] = PROVINCES.map((p) => p.name);

export function getProvince(name: string): Province | undefined {
  return PROVINCES.find((p) => p.name === name);
}

// ════════════════════════════════════════
// src/content/articles/city-plan-online.tsx
// บทความ: วิธีดูผังเมืองออนไลน์ด้วยตัวเอง
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'city-plan-online',
  title:       'วิธีดูผังเมืองออนไลน์ด้วยตัวเอง — เช็กการใช้ประโยชน์ที่ดินก่อนซื้อ',
  description: 'สอนวิธีตรวจผังเมือง (zoning) ออนไลน์ฟรี 5 ขั้นตอน เช็กสีผังเมือง โซนที่อยู่อาศัย พาณิชยกรรม เกษตรกรรม ก่อนซื้อที่ดิน ลงทุน หรือสร้างอาคาร',
  excerpt:     'เช็กการใช้ประโยชน์ที่ดินก่อนตัดสินใจซื้อ ลงทุน หรือสร้างอาคาร — 5 ขั้นตอนดูผังเมืองออนไลน์ฟรีด้วยตัวเอง พร้อมความหมายสีผังเมืองครบทุกโซน',
  date:        '2026-06-02',
  tags:        ['ผังเมือง', 'zoning', 'ซื้อที่ดิน', 'การใช้ประโยชน์ที่ดิน'],
  readMin:     6,
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const ZONES = [
  { th: 'สีเหลือง',  en: 'Yellow', color: '#f2c94c', ink: '#1a1400', use: 'ที่อยู่อาศัยหนาแน่นน้อย', detail: 'บ้านเดี่ยว หมู่บ้านจัดสรร พาณิชย์ขนาดเล็ก สถานศึกษา และเกษตรกรรมบางประเภท' },
  { th: 'สีส้ม',     en: 'Orange', color: '#f2994a', ink: '#1a0d00', use: 'ที่อยู่อาศัยหนาแน่นปานกลาง', detail: 'ที่อยู่อาศัย พาณิชย์ขนาดกลาง สำนักงาน และสถานบริการสาธารณะ' },
  { th: 'สีน้ำตาล',  en: 'Brown', color: '#9c6b3f', ink: '#fff', use: 'ที่อยู่อาศัยหนาแน่นมาก', detail: 'อาคารชุด คอนโด ศูนย์กลางชุมชน พาณิชยกรรม สำนักงาน ระบบขนส่งสาธารณะ' },
  { th: 'สีแดง',     en: 'Red', color: '#eb5757', ink: '#fff', use: 'พาณิชยกรรม', detail: 'การค้า การบริการ ธุรกิจ สำนักงาน โรงแรม สถานบริการ' },
  { th: 'สีม่วง',    en: 'Purple', color: '#9b51e0', ink: '#fff', use: 'อุตสาหกรรม', detail: 'โรงงาน คลังสินค้า โกดัง พาณิชยกรรมที่เกี่ยวข้อง' },
  { th: 'สีเขียว',   en: 'Green', color: '#27ae60', ink: '#fff', use: 'เกษตรกรรม', detail: 'เกษตรกรรม เกษตรกรรมแปรรูป และที่อยู่อาศัยที่ไม่กระทบการเกษตร' },
];

const STEPS = [
  { n: 1, t: 'เข้าเว็บไซต์', d: 'เข้าระบบตรวจสอบผังเมืองรวมของกรมโยธาธิการและผังเมือง (pludds.dpt.go.th)' },
  { n: 2, t: 'ค้นหาตำแหน่งที่ดิน', d: 'ค้นจาก "พิกัด" (เช่น 15.123456, 104.123456) หรือเลื่อนซูมหาแปลงบนแผนที่' },
  { n: 3, t: 'เปิดชั้นข้อมูลผังเมือง', d: 'เลือกชั้นข้อมูล "ผังเมืองรวม" ทับลงบนพื้นที่ที่ต้องการตรวจสอบ' },
  { n: 4, t: 'ตรวจสอบสีผังเมือง', d: 'ดูสีที่ครอบคลุมแปลง — แต่ละสีบอกประเภทการใช้ประโยชน์ที่ดินต่างกัน' },
  { n: 5, t: 'อ่านข้อกำหนดการใช้ที่ดิน', d: 'คลิกที่พื้นที่เพื่อดูข้อกำหนด FAR / OSR / ความสูงอาคาร และกิจการที่ทำได้/ห้าม' },
];

const FAQ = [
  { q: 'ที่ดินสีเขียวสร้างบ้านได้ไหม?', a: 'ได้บางกรณี ขึ้นกับข้อกำหนดผังเมืองของพื้นที่นั้น สิ่งปลูกสร้างบางประเภท เช่น บ้านพักอาศัยที่ไม่กระทบการเกษตร อาจได้รับอนุญาต ควรตรวจข้อกำหนดเฉพาะพื้นที่' },
  { q: 'ผังเมืองเปลี่ยนแปลงได้ไหม?', a: 'ได้ ผังเมืองรวมมีการปรับปรุงเป็นรอบ ๆ ตามกระบวนการทางกฎหมาย จึงควรตรวจสอบฉบับล่าสุดเสมอ' },
  { q: 'ผังเมืองมีผลต่อราคาที่ดินไหม?', a: 'มีผลโดยตรง ข้อกำหนดการใช้ประโยชน์ที่ดินส่งผลต่อศักยภาพการพัฒนาและมูลค่าของที่ดิน' },
  { q: 'ข้อมูลผังเมืองเป็นข้อมูลล่าสุดไหม?', a: 'ข้อมูลออนไลน์ใช้อ้างอิงเบื้องต้น อาจไม่ใช่ฉบับล่าสุด ควรตรวจสอบวันที่มีผลบังคับใช้และประกาศเพิ่มเติม' },
];

const SOURCES = [
  { name: 'ระบบตรวจสอบผังเมืองรวม (กรมโยธาธิการและผังเมือง)', url: 'https://pludds.dpt.go.th' },
  { name: 'LandsMaps ค้นหาแปลงและโฉนด (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
  { name: 'ราคาประเมินที่ดิน (กรมธนารักษ์)', url: 'https://www.treasury.go.th' },
  { name: 'ระบบค้นหากฎหมายไทย (สำนักงานคณะกรรมการกฤษฎีกา)', url: 'https://www.krisdika.go.th' },
];

const p: React.CSSProperties = { fontSize: 15, lineHeight: 1.65, color: C.text, margin: '0 0 10px' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{
        fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 14px',
        paddingBottom: 8, borderBottom: `1px solid ${C.border}`,
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CityPlanOnline() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          วิธีดูผังเมืองออนไลน์ด้วยตัวเอง
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          เช็กการใช้ประโยชน์ที่ดิน ก่อนซื้อที่ดิน ลงทุน หรือสร้างอาคาร
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          How to Check City Plan (Zoning) Online by Yourself
        </p>
      </header>

      <Section title="ผังเมืองคืออะไร?">
        <p style={p}>
          <strong>ผังเมือง</strong> คือ แผนที่กำหนดการใช้ประโยชน์ที่ดินในเขตเมืองและชนบท
          เพื่อควบคุมการพัฒนาให้เป็นระเบียบ เหมาะสม และยั่งยืน โดยแบ่งพื้นที่ออกเป็นโซนต่าง ๆ
          ด้วย <strong>สี</strong> ที่บอกว่าแต่ละพื้นที่ทำอะไรได้บ้าง
        </p>
      </Section>

      <Section title="ทำไมต้องตรวจผังเมืองก่อน?">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'รู้ข้อจำกัดและศักยภาพการใช้ที่ดิน',
            'ป้องกันซื้อที่ดินแล้วใช้ประโยชน์ไม่ได้ตามต้องการ',
            'ประเมินมูลค่าและโอกาสการลงทุน',
            'ลดความเสี่ยงในการพัฒนาโครงการ',
            'วางแผนก่อสร้างให้ถูกต้องตามกฎหมาย',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="5 ขั้นตอนดูผังเมืองออนไลน์">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          ใช้ระบบของกรมโยธาธิการและผังเมือง
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 10 }}>
          {STEPS.map(s => (
            <li key={s.n} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: C.cyan, color: '#0d1520', fontWeight: 900, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.n}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="ความหมายของสีผังเมือง (โดยสรุป)">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          การใช้ประโยชน์ที่ดินต้องเป็นไปตามข้อกำหนดผังเมืองรวมในแต่ละพื้นที่
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {ZONES.map(z => (
            <div key={z.en} style={{
              display: 'grid', gridTemplateColumns: '110px 1fr', gap: 14, alignItems: 'center',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
            }}>
              <div style={{
                background: z.color, color: z.ink, borderRadius: 8, padding: '10px 8px',
                textAlign: 'center', fontWeight: 700,
              }}>
                <div style={{ fontSize: 14 }}>{z.th}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{z.en}</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 2 }}>{z.use}</div>
                <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{z.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 12 }}>
          หมายเหตุ: บางโซนอาจมีลวดลายหรือสัญลักษณ์เพิ่มเติม (เช่น เขียวลาย ม่วงลาย) ซึ่งมีข้อกำหนดเฉพาะ
          ควรตรวจสอบรายละเอียดในพื้นที่นั้น ๆ และข้อกำหนดอาจแตกต่างกันในแต่ละจังหวัด
        </p>
      </Section>

      <Section title="คำถามที่พบบ่อย (FAQ)">
        <div style={{ display: 'grid', gap: 10 }}>
          {FAQ.map((f, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>Q: {f.q}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>A: {f.a}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="แหล่งข้อมูลที่เกี่ยวข้อง">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {SOURCES.map(s => (
            <li key={s.url} style={{ fontSize: 14.5, lineHeight: 1.6, color: C.text }}>
              {s.name} —{' '}
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: C.cyan, wordBreak: 'break-all' }}>
                {s.url.replace('https://', '')}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <p style={{
        fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginTop: 28,
        padding: '14px 16px', background: 'rgba(255,179,0,0.06)',
        border: '1px solid rgba(255,179,0,0.25)', borderRadius: 10,
      }}>
        ⚠ <strong>ข้อควรระวัง:</strong> ข้อมูลจากระบบผังเมืองออนไลน์เป็นข้อมูลเบื้องต้นเพื่อการตรวจสอบเท่านั้น
        การใช้ประโยชน์ที่ดินและการขออนุญาตก่อสร้างต้องเป็นไปตามกฎหมายและข้อกำหนดของหน่วยงานที่เกี่ยวข้อง
        FAR / OSR และความสูงอาคารเป็นเพียงตัวอย่าง ค่าจริงขึ้นกับข้อกำหนดผังเมืองของพื้นที่
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub ดูที่ดินจริง
        </a>
      </div>
    </article>
  );
}

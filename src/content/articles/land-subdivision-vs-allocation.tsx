// ════════════════════════════════════════
// src/content/articles/land-subdivision-vs-allocation.tsx
// บทความ: "แบ่งแปลง" vs "จัดสรรที่ดิน" ต่างกันยังไง
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-subdivision-vs-allocation',
  title:       '"แบ่งแปลงที่ดิน" vs "จัดสรรที่ดิน" ต่างกันยังไง — แบ่งกี่แปลงต้องขออนุญาต',
  description: 'เปรียบเทียบแบ่งแปลงที่ดินกับจัดสรรที่ดินตาม พ.ร.บ.จัดสรรที่ดิน พ.ศ. 2543 — แบ่งไม่เกิน 9 แปลงทำได้เลย ตั้งแต่ 10 แปลงต้องขอใบอนุญาต พร้อมภาระผู้จัดสรรและบทลงโทษ',
  excerpt:     'แบ่งที่ดินขายไม่เกิน 9 แปลงทำได้เลย แต่ตั้งแต่ 10 แปลงขึ้นไปเข้าข่าย "จัดสรร" ต้องขอใบอนุญาต — สรุปความต่าง เกณฑ์จำนวนแปลง ภาระผู้จัดสรร และบทลงโทษตามกฎหมาย',
  date:        '2026-06-03',
  tags:        ['แบ่งแปลงที่ดิน', 'จัดสรรที่ดิน', 'กฎหมายที่ดิน', 'พ.ร.บ.จัดสรรที่ดิน'],
  readMin:     5,
  cover:       'https://tnrmaphub.com/article-images/land-subdivision-vs-allocation.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const COMPARE = [
  { topic: 'จำนวนแปลง',        sub: 'แบ่งเป็นแปลงย่อยไม่เกิน 9 แปลง', jad: 'แบ่งเป็นแปลงย่อยรวมกันตั้งแต่ 10 แปลงขึ้นไป' },
  { topic: 'ขออนุญาต',         sub: 'ไม่ต้องขอใบอนุญาตจัดสรร',         jad: 'ต้องขอใบอนุญาตจากคณะกรรมการจัดสรรที่ดิน' },
  { topic: 'สาธารณูปโภค',      sub: 'ไม่บังคับตามกฎหมายจัดสรร',        jad: 'ต้องจัดให้มี (ถนน/สวน/ระบบสาธารณูปโภค) ตามแผนผังที่ขออนุญาต' },
  { topic: 'หน้าที่ดูแลต่อ',    sub: '—',                              jad: 'ผู้จัดสรรต้องบำรุงรักษา จนกว่าจะโอนให้นิติบุคคลหมู่บ้านจัดสรร/รัฐ' },
];

const FAQ = [
  { q: 'แบ่งที่ดินให้ลูกหลาน 3–4 แปลง ต้องขอจัดสรรไหม?', a: 'ไม่ต้อง ตราบใดที่แบ่งรวมแล้วไม่เกิน 9 แปลง แต่ถ้าภายหลังแบ่งเพิ่มจนรวมกันถึง 10 แปลงภายใน 3 ปี จะเข้าข่ายจัดสรรทันที' },
  { q: 'แบ่ง 9 แปลงปีนี้ ปีหน้าแบ่งเพิ่มอีก 2 แปลงได้ไหม?', a: 'หากนับรวมแล้วตั้งแต่ 10 แปลงขึ้นไปภายใน 3 ปี จะถือเป็นการจัดสรรที่ดิน ต้องขอใบอนุญาตก่อน' },
  { q: 'จัดสรรโดยไม่ขออนุญาต แล้วขายไปแล้วผิดไหม?', a: 'ผิด มีโทษทางอาญา (ตาม พ.ร.บ.จัดสรรที่ดิน) และอาจกระทบสิทธิของผู้ซื้อ ควรขออนุญาตให้ถูกต้องก่อนเสมอ' },
  { q: 'รู้ได้ยังไงว่าที่ดินแปลงไหนเป็นโครงการจัดสรรถูกกฎหมาย?', a: 'ตรวจสอบกับสำนักงานที่ดินจังหวัด หรือดูใบอนุญาตจัดสรรของโครงการ ก่อนตัดสินใจซื้อ' },
];

const SOURCES = [
  { name: 'พระราชบัญญัติการจัดสรรที่ดิน พ.ศ. 2543 (กรมที่ดิน)', url: 'https://www.dol.go.th/knowledge-land-department/law/act/act-822003885530124288/' },
  { name: 'ตัวบท พ.ร.บ.การจัดสรรที่ดิน พ.ศ. 2543 (สถาบันนิติธรรมาลัย)', url: 'https://www.drthawip.com/landlaw/055' },
  { name: 'LandsMaps ค้นหาแปลงและโฉนด (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
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

export function LandSubdivisionVsAllocation() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          "แบ่งแปลงที่ดิน" vs "จัดสรรที่ดิน" ต่างกันยังไง
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          แบ่งกี่แปลงถึงต้องขอใบอนุญาตจัดสรร?
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Land Subdivision vs Land Allocation under Thai Law
        </p>
      </header>

      <Section title="สองคำนี้ไม่เหมือนกัน">
        <p style={p}>
          หลายคนเข้าใจว่า "แบ่งที่ดินขาย" กับ "จัดสรรที่ดิน" คือเรื่องเดียวกัน แต่ตามกฎหมายแล้ว
          ทั้งสองคำแยกกันชัดเจน และการแบ่งขายโดยเข้าใจผิด อาจกลายเป็นการ
          <strong> จัดสรรที่ดินโดยไม่ได้รับอนุญาต</strong> ซึ่งมีโทษทางอาญา
        </p>
        <p style={p}>
          เส้นแบ่งสำคัญอยู่ที่ <strong>จำนวนแปลง</strong> ตาม
          <strong> พระราชบัญญัติการจัดสรรที่ดิน พ.ศ. 2543</strong>
        </p>
      </Section>

      <Section title="ความแตกต่างหลัก">
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 10,
            fontSize: 13, fontWeight: 700, color: C.muted, padding: '0 12px',
          }}>
            <div>ประเด็น</div>
            <div style={{ color: C.green }}>แบ่งแปลง</div>
            <div style={{ color: C.cyan }}>จัดสรรที่ดิน</div>
          </div>
          {COMPARE.map(row => (
            <div key={row.topic} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 10,
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{row.topic}</div>
              <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.5 }}>{row.sub}</div>
              <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.5 }}>{row.jad}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="เกณฑ์ตัวเลข: 9 แปลง vs 10 แปลง">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          ตามนิยาม "จัดสรรที่ดิน" ในมาตรา 4 พ.ร.บ.จัดสรรที่ดิน พ.ศ. 2543
        </p>
        <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
          {[
            { t: 'ไม่เกิน 9 แปลง', d: 'แบ่งแยกโฉนดเพื่อขายได้เลย ไม่ต้องขอใบอนุญาตจัดสรร', color: C.green },
            { t: 'ตั้งแต่ 10 แปลงขึ้นไป', d: 'เข้าข่าย "จัดสรรที่ดิน" ต้องขอใบอนุญาตก่อนจำหน่าย', color: C.cyan },
            { t: 'แบ่ง < 10 แปลง แต่แบ่งเพิ่มภายใน 3 ปี รวมถึง 10', d: 'นับรวมเป็นการจัดสรรที่ดินเช่นกัน', color: '#ffb300' },
          ].map(item => (
            <li key={item.t} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{ color: item.color, fontWeight: 900, fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>●</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{item.t}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{item.d}</div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="ถ้าเข้าข่ายจัดสรร ต้องทำอะไรบ้าง">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ยื่นขอใบอนุญาตจัดสรรที่ดินต่อคณะกรรมการจัดสรรที่ดินจังหวัด (ห้ามจัดสรรก่อนได้รับอนุญาต — มาตรา 21)',
            'จัดให้มีสาธารณูปโภคตามแผนผังที่ขออนุญาต เช่น ถนน สวน สนามเด็กเล่น',
            'สาธารณูปโภคที่จัดทำขึ้นจะตกอยู่ในภาระจำยอมเพื่อประโยชน์ของที่ดินจัดสรร และผู้จัดสรรมีหน้าที่บำรุงรักษา (มาตรา 43)',
            'จัดให้มีการดูแลต่อเนื่อง โดยทั่วไปจะโอนให้นิติบุคคลหมู่บ้านจัดสรรรับไปบริหารจัดการ',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
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
        ⚠ <strong>บทลงโทษ &amp; ข้อควรระวัง:</strong> ผู้ใดทำการจัดสรรที่ดินโดยไม่ได้รับอนุญาต (ฝ่าฝืนมาตรา 21)
        ต้องระวางโทษตามมาตรา 59 คือ <strong>จำคุกไม่เกิน 2 ปี และปรับตั้งแต่ 40,000–100,000 บาท</strong>
        บทความนี้เป็นข้อมูลเบื้องต้น ข้อกำหนดและรายละเอียด (เช่น มาตรฐานสาธารณูปโภค) เป็นไปตามกฎกระทรวงและประกาศที่เกี่ยวข้อง
        ก่อนดำเนินการจริงควรปรึกษาสำนักงานที่ดินจังหวัดหรือนักกฎหมาย
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub ดูแปลงที่ดินจริง
        </a>
      </div>
    </article>
  );
}

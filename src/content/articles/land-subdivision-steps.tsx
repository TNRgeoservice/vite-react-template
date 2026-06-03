// ════════════════════════════════════════
// src/content/articles/land-subdivision-steps.tsx
// บทความ: 5 ขั้นตอนแบ่งแปลงที่ดินตามกฎหมาย (แบ่งโฉนด)
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-subdivision-steps',
  title:       '5 ขั้นตอนแบ่งแปลงที่ดินตามกฎหมาย — ตั้งแต่ยื่นรังวัดถึงรับโฉนดใหม่',
  description: 'สรุป 5 ขั้นตอนแบ่งแปลงที่ดิน (แบ่งโฉนด) ตามกระบวนการกรมที่ดิน ตั้งแต่ยื่นคำขอ รังวัด ระวังแนวเขต จดทะเบียน ถึงรับโฉนดใหม่ พร้อมเอกสาร ค่าธรรมเนียม และระยะเวลา 30–90 วัน',
  excerpt:     'มีที่ดินผืนใหญ่อยากแบ่งขายทีละแปลง แต่ไม่รู้เริ่มตรงไหน? สรุปกระบวนการ 14 ขั้นของกรมที่ดินให้เหลือ 5 ช่วงเข้าใจง่าย พร้อมเอกสาร ค่าธรรมเนียม และเวลาที่ต้องใช้',
  date:        '2026-06-03',
  tags:        ['แบ่งแปลงที่ดิน', 'แบ่งโฉนด', 'รังวัดที่ดิน', 'ขั้นตอนแบ่งที่ดิน', 'กรมที่ดิน'],
  readMin:     6,
  cover:       'https://tnrmaphub.com/article-images/land-subdivision-steps.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const STEPS = [
  {
    n: 1,
    t: 'เตรียมเอกสาร แล้วยื่นคำขอแบ่งแยก',
    d: 'ไปที่ฝ่ายทะเบียน สำนักงานที่ดินที่แปลงตั้งอยู่ พร้อมโฉนดตัวจริง บัตรประชาชน และทะเบียนบ้านของเจ้าของ ถ้าไปเองไม่ได้ ใช้หนังสือมอบอำนาจแทนได้',
  },
  {
    n: 2,
    t: 'รับนัดรังวัด แล้ววางเงินมัดจำ',
    d: 'เจ้าหน้าที่ตรวจระวางแผนที่ กำหนดวันให้ช่างรังวัดลงพื้นที่ แล้วออกใบนัดให้ คุณวางเงินมัดจำค่ารังวัดตามที่สำนักงานแจ้ง',
  },
  {
    n: 3,
    t: 'ช่างรังวัดลงพื้นที่ ปักหลักเขต',
    d: 'ช่างรังวัดมาวัดและปักหลักเขตของแต่ละแปลงย่อย เจ้าของที่ดินข้างเคียงต้องมาระวังแนวเขตและเซ็นรับรองด้วย จุดนี้สำคัญที่สุด',
  },
  {
    n: 4,
    t: 'คำนวณเนื้อที่ เขียนแผนที่แปลงใหม่',
    d: 'ช่างคำนวณเนื้อที่ของแต่ละแปลงย่อย เขียนรูปแผนที่ใหม่ แล้วเสนอเจ้าพนักงานที่ดินตรวจสอบ',
  },
  {
    n: 5,
    t: 'จดทะเบียนแบ่งแยก รับโฉนดใหม่',
    d: 'ลงนามจดทะเบียนแบ่งแยกที่สำนักงานที่ดิน แล้วรับโฉนดของแต่ละแปลงย่อยที่ออกใหม่ จบกระบวนการ',
  },
];

const FEES = [
  { item: 'ค่าธรรมเนียมรังวัดแบ่งแยก (โฉนด น.ส.4)', cost: '40 บาท / แปลง' },
  { item: 'ค่าจดทะเบียนแบ่งแยก',                     cost: '50 บาท / แปลง' },
  { item: 'ค่าออกโฉนดใหม่',                          cost: '50 บาท / แปลง' },
  { item: 'ค่าหลักเขต',                              cost: '15 บาท / หลัก' },
  { item: 'ค่ารังวัด (ช่างออกพื้นที่)',               cost: 'แปรตามเนื้อที่/จำนวนวัน — สอบถามฝ่ายรังวัด' },
];

const FAQ = [
  { q: 'แบ่งได้สูงสุดกี่แปลง โดยไม่ต้องขอใบอนุญาตจัดสรร?', a: 'ไม่เกิน 9 แปลง ทำได้เลย แต่ตั้งแต่ 10 แปลงขึ้นไป (หรือทยอยแบ่งจนรวมถึง 10 ภายใน 3 ปี) จะเข้าข่าย "จัดสรรที่ดิน" ต้องขอใบอนุญาตก่อน' },
  { q: 'ใช้เวลานานแค่ไหน?', a: 'โดยทั่วไปประมาณ 30–90 วัน ขึ้นกับคิวงานรังวัดและพื้นที่ของแต่ละสำนักงานที่ดิน' },
  { q: 'ไปยื่นเองไม่ได้ ทำยังไง?', a: 'มอบอำนาจให้คนอื่นไปแทนได้ ใช้หนังสือมอบอำนาจพร้อมสำเนาบัตรประชาชนของทั้งผู้มอบและผู้รับมอบ' },
  { q: 'แบ่งแล้วเนื้อที่ไม่ตรงกับโฉนดเดิมเป๊ะ ผิดปกติไหม?', a: 'ไม่แปลก การรังวัดด้วยเครื่องมือปัจจุบันอาจได้เนื้อที่ต่างจากโฉนดเดิมเล็กน้อย ให้ยึดเนื้อที่ที่รังวัดจริงเป็นหลัก' },
];

const SOURCES = [
  { name: 'คู่มือประชาชน: การรังวัดสอบเขต แบ่งแยก รวมโฉนด (กรมที่ดิน 2562)', url: 'https://www.dol.go.th/Documents/manual/2562/no6_62.pdf' },
  { name: 'ค่าใช้จ่ายและขั้นตอนการแบ่งแยกโฉนด (กรมที่ดิน)', url: 'https://www.dol.go.th/question-answer/Q1903-004060' },
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

export function LandSubdivisionSteps() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          5 ขั้นตอนแบ่งแปลงที่ดินตามกฎหมาย
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          ตั้งแต่ยื่นคำขอรังวัด จนรับโฉนดแปลงใหม่
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          5 Steps to Subdivide Land in Thailand
        </p>
      </header>

      <Section title="อยากแบ่งที่ดินขาย แต่ไม่รู้เริ่มตรงไหน">
        <p style={p}>
          คุณมีที่ดินผืนใหญ่อยู่แปลงหนึ่ง อยากซอยขายทีละแปลงให้ได้ราคาดีขึ้น แต่พอไปถามคนรู้จัก
          ก็ได้ยินมาว่าต้อง "รังวัด" ต้อง "แจ้งเพื่อนบ้าน" วุ่นวายไปหมด จนไม่กล้าเริ่ม
        </p>
        <p style={p}>
          จริง ๆ แล้วกรมที่ดินแบ่งกระบวนการนี้เป็นขั้นตอนย่อยถึง 14 ขั้น แต่ถ้ามองเป็นภาพใหญ่
          มันสรุปได้แค่ <strong>5 ช่วง</strong> ที่เข้าใจง่ายกว่ามาก บทความนี้จะพาคุณไล่ทีละช่วง
          พร้อมบอกเอกสาร ค่าใช้จ่าย และเวลาที่ต้องเผื่อ
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          ก่อนเริ่ม เช็กก่อนว่าจำนวนแปลงที่จะแบ่งเข้าข่าย "จัดสรรที่ดิน" หรือไม่ —{' '}
          <a href="/articles/land-subdivision-vs-allocation" style={{ color: C.cyan, textDecoration: 'none' }}>
            อ่าน: แบ่งแปลง vs จัดสรร แบ่งกี่แปลงต้องขออนุญาต →
          </a>
        </p>
      </Section>

      <Section title="5 ช่วงของการแบ่งแปลงที่ดิน">
        <ol style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', display: 'grid', gap: 10 }}>
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

      <Section title="ขั้นที่คนพลาดบ่อย: เพื่อนบ้านไม่มาระวังแนวเขต">
        <p style={p}>
          ตอนช่างรังวัดลงพื้นที่ (ช่วงที่ 3) เจ้าของที่ดินข้างเคียงต้องมาดูและเซ็นรับรองแนวเขตด้วย
          ถ้าเพื่อนบ้านไม่มา งานมักค้างตรงนี้แหละ
        </p>
        <p style={p}>
          แต่ไม่ถึงกับตัน — เมื่อข้างเคียงไม่มาระวังแนวเขต เจ้าหน้าที่จะแจ้งเป็นหนังสือให้มาอีกครั้งภายใน
          <strong> 30 วัน</strong> ถ้ายังไม่มาและไม่ได้คัดค้าน จะถือตามแนวเขตที่รังวัดไว้ พร้อมบันทึกเหตุไว้เป็นหลักฐาน
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          เคล็ดลับ: หาหลักเขตเดิมให้เจอและชี้ให้ช่างก่อนวันนัด จะช่วยให้รังวัดเร็วขึ้นมาก
        </p>
      </Section>

      <Section title="ค่าใช้จ่ายมีอะไรบ้าง">
        <div style={{ display: 'grid', gap: 8 }}>
          {FEES.map(f => (
            <div key={f.item} style={{
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px',
            }}>
              <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.5 }}>{f.item}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.green, textAlign: 'right' }}>{f.cost}</div>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 12 }}>
          ค่าธรรมเนียมข้างต้นเป็นอัตราตามกฎกระทรวง ส่วน "ค่ารังวัด" เป็นค่าใช้จ่ายของช่างที่ออกพื้นที่
          ซึ่งคิดตามเนื้อที่และจำนวนวันทำงาน จึงต่างกันไปในแต่ละแปลงและจังหวัด ควรสอบถามฝ่ายรังวัดของสำนักงานที่ดินก่อน
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
        ⚠ <strong>ก่อนลงมือ:</strong> ถ้าจะแบ่งตั้งแต่ 10 แปลงขึ้นไป (หรือทยอยแบ่งจนรวมถึง 10 ภายใน 3 ปี)
        จะเข้าข่าย "จัดสรรที่ดิน" ต้องขอใบอนุญาตก่อน —{' '}
        <a href="/articles/land-subdivision-vs-allocation" style={{ color: C.cyan }}>
          ดูเกณฑ์แบ่งแปลง vs จัดสรร
        </a>{' '}
        ขั้นตอนและค่าธรรมเนียมอาจปรับตามระเบียบของแต่ละช่วงเวลา ควรตรวจสอบกับสำนักงานที่ดินจังหวัดก่อนดำเนินการจริง
      </p>

      <Section title="">
        <p style={{ ...p, marginTop: 8 }}>
          สรุปสั้น ๆ ก่อนเริ่ม: เตรียม <strong>โฉนดตัวจริง + บัตร + ทะเบียนบ้าน</strong>,
          เผื่อเวลา <strong>30–90 วัน</strong>, และนัดเพื่อนบ้านให้พร้อมมาระวังแนวเขต —
          แค่นี้กระบวนการก็ลื่นไปแล้วครึ่งทาง
        </p>
      </Section>

      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 วางผังแบ่งแปลงบน TNR MapHub
        </a>
      </div>
    </article>
  );
}

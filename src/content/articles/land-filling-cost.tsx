// ════════════════════════════════════════
// src/content/articles/land-filling-cost.tsx
// บทความ: ถมที่ดินราคาเท่าไร — คำนวณคิวดิน + กฎหมายถมดิน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-filling-cost',
  title:       'ถมที่ดินราคาเท่าไร — วิธีคำนวณคิวดิน + กฎหมายถมดินที่ต้องรู้ก่อนจ้าง',
  description: 'สอนคำนวณค่าถมที่ดินเป็น "คิว" ด้วยตัวเอง พร้อมราคาต่อคิว ปัจจัยที่ทำให้ราคาต่างกัน ชนิดดินถม และกฎหมายขุดดินถมดิน 2543 ที่ต้องแจ้งก่อนถม',
  excerpt:     'จ้างรถมาถมแล้วค่อยรู้ว่าจ่ายเกิน เพราะคิดคิวดินไม่เป็น — บทความนี้สอนคำนวณค่าถมที่ดินเองทีละขั้น พร้อมกฎหมายถมดินที่พลาดแล้วโดนปรับ',
  date:        '2026-06-16',
  tags:        ['ถมที่ดิน', 'ถมดิน', 'คำนวณคิวดิน', 'พัฒนาที่ดิน'],
  readMin:     6,
  cover:       'https://tnrmaphub.com/article-images/land-filling-cost.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const SOIL = [
  { th: 'ดินถมทั่วไป (ดินลูกรัง/ดินผสม)', use: 'ถมยกระดับพื้นที่เปล่า ราคาประหยัด อัดแน่นได้ดี', note: 'นิยมสุดสำหรับถมที่ก่อนปลูกสร้าง' },
  { th: 'ดินดาน (ดินแข็ง)', use: 'ถมชั้นล่างเป็นฐานรับน้ำหนัก แน่นกว่าดินทั่วไป', note: 'มักถมเป็นชั้นล่าง แล้วทับด้วยดินถมด้านบน' },
  { th: 'หน้าดิน (ดินดำ)', use: 'ดินปลูกพืช อุ้มน้ำดี แต่ยุบตัวง่าย', note: 'ใช้ทำเกษตร ไม่เหมาะถมเพื่อสร้างบ้าน' },
  { th: 'ทราย / ทรายถม', use: 'ระบายน้ำดี ไม่อมน้ำ แต่ต้องมีขอบกัน', note: 'มักใช้ปรับระดับสุดท้ายหรือพื้นที่น้ำท่วมขัง' },
];

const FACTORS = [
  'ระยะทางขนส่งจากบ่อดินถึงหน้างาน — ยิ่งไกล ค่าน้ำมัน/ค่ารถยิ่งสูง',
  'ชนิดดินที่เลือกถม — ดินดาน/ทราย แพงกว่าดินถมทั่วไป',
  'ความยากของหน้างาน — ทางเข้าแคบ รถใหญ่เข้าไม่ได้ ต้องขนถ่าย ราคาขึ้น',
  'ปริมาณงาน — ถมแปลงใหญ่ต่อรองราคาต่อคิวได้ถูกกว่าแปลงเล็ก',
  'ค่าบดอัด — ถ้าจ้างรถบดอัดแยก คิดเพิ่มจากค่าดิน',
];

export const FAQ = [
  { q: 'ถมที่ดินคิดราคายังไง คิดเป็นคิวคืออะไร?', a: '"คิว" คือลูกบาศก์เมตร (ปริมาตรดิน) ผู้รับเหมาส่วนใหญ่คิดราคาตามจำนวนคิวดินที่ใช้ คำนวณจาก พื้นที่ (ตร.ม.) คูณความสูงที่จะถม (เมตร) แล้วเผื่อค่าบดอัดอีกประมาณ 20-30%' },
  { q: 'ถมที่ดินต้องขออนุญาตไหม?', a: 'ขึ้นกับขนาดและความสูง ตาม พ.ร.บ.การขุดดินและถมดิน พ.ศ.2543 ถ้าถมสูงเกินระดับที่ดินข้างเคียงและมีพื้นที่เกิน 2,000 ตารางเมตร ต้องแจ้งเจ้าพนักงานท้องถิ่น (เทศบาล/อบต.) ก่อน และต้องจัดให้มีการระบายน้ำที่เพียงพอ' },
  { q: 'ถมที่ดินแล้วต้องทิ้งไว้นานแค่ไหนก่อนสร้างบ้าน?', a: 'ดินถมใหม่จะยุบตัวตามธรรมชาติ ควรทิ้งระยะให้ดินเซตตัวก่อนก่อสร้าง (ทั่วไปนิยม 6 เดือนถึง 1 ปี ขึ้นกับชนิดดินและการบดอัด) หรือใช้รถบดอัดช่วยให้แน่นเร็วขึ้น' },
  { q: 'ถมที่ดินช่วงไหนดีที่สุด?', a: 'ช่วงหน้าแล้งดีกว่าหน้าฝน เพราะดินแห้ง บดอัดได้แน่น รถบรรทุกเข้าออกสะดวก ถ้าถมหน้าฝนดินจะอุ้มน้ำ ยุบตัวง่าย และหน้างานเป็นโคลน' },
];

const SOURCES = [
  { name: 'พ.ร.บ.การขุดดินและถมดิน พ.ศ.2543 (สำนักงานคณะกรรมการกฤษฎีกา)', url: 'https://www.krisdika.go.th' },
  { name: 'กรมโยธาธิการและผังเมือง (การขุดดินถมดิน)', url: 'https://www.dpt.go.th' },
  { name: 'LandsMaps ค้นหาแปลงและเนื้อที่ที่ดิน (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
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

export function LandFillingCost() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ถมที่ดินราคาเท่าไร คิดยังไงไม่ให้โดนเอาเปรียบ
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          คำนวณคิวดินเองทีละขั้น พร้อมกฎหมายถมดินที่พลาดแล้วโดนปรับ
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Land Filling Cost — How to Calculate & Legal Requirements
        </p>
      </header>

      <p style={p}>
        จ้างรถมาถมที่ไปแล้ว ค่อยมารู้ทีหลังว่าจ่ายแพงกว่าที่ควร — ปัญหานี้เกิดบ่อย
        เพราะเจ้าของที่ดินส่วนใหญ่ <strong>คิดปริมาณดินไม่เป็น</strong> เลยต่อรองราคาไม่ได้
        และตรวจสอบบิลผู้รับเหมาไม่ออก จริง ๆ แล้วการประเมินค่าถมที่ดินคำนวณเองได้ไม่ยาก
        ถ้าเข้าใจหน่วย "คิว" และสูตรพื้นฐาน
      </p>

      <figure style={{ margin: '0 0 16px' }}>
        <img src="/article-images/land-filling-cost-fig1.webp" alt="รถบรรทุกเทดินถมที่ดินเปล่าในช่วงแสงเย็น พร้อมรถบดอัดดิน"
          style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
            borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
        <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
          ค่าถมที่ดินส่วนใหญ่คิดตามปริมาณดินเป็น “คิว” — ประเมินเองได้ถ้ารู้สูตร
        </figcaption>
      </figure>

      <Section title="ค่าถมที่ดินคิดเป็น “คิว” — แล้วคิวคืออะไร?">
        <p style={p}>
          ผู้รับเหมาถมดินส่วนใหญ่คิดราคาตามปริมาตรดินที่ใช้ หน่วยที่ใช้เรียกกันคือ
          <strong> “คิว”</strong> ซึ่งย่อมาจาก <strong>ลูกบาศก์เมตร (ลบ.ม.)</strong> —
          ดิน 1 คิว ก็คือดินที่อัดเต็มกล่องขนาด 1×1×1 เมตรนั่นเอง
        </p>
        <p style={p}>
          เมื่อรู้ว่าที่ดินต้องถมกี่คิว ก็เอาไปคูณราคาต่อคิวของผู้รับเหมา ได้งบประมาณคร่าว ๆ ทันที
        </p>
      </Section>

      <Section title="สูตรคำนวณคิวดิน + ตัวอย่างจริง">
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: '16px 18px', margin: '0 0 16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.cyan, lineHeight: 1.5 }}>
            จำนวนคิวดิน = พื้นที่ (ตร.ม.) × ความสูงที่จะถม (เมตร)
          </div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>
            แล้วเผื่อค่าบดอัดอีกประมาณ 20–30%
          </div>
        </div>

        <p style={{ ...p, fontWeight: 700, color: '#fff' }}>ตัวอย่าง: ถมที่ดิน 1 งาน สูง 1 เมตร</p>
        <ul style={{ margin: '0 0 12px', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ที่ดิน 1 งาน = 100 ตารางวา = 400 ตารางเมตร',
            'ถมสูง 1 เมตร → 400 × 1 = 400 คิว (ปริมาตรเปล่า)',
            'เผื่อบดอัด 20% → 400 × 1.2 ≈ 480 คิว (ปริมาณดินที่ต้องสั่งจริง)',
            'ถ้าราคา 300 บาท/คิว → 480 × 300 = 144,000 บาท (ค่าดินโดยประมาณ)',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13, color: C.muted }}>
          หมายเหตุ: ตัวเลขราคาต่อคิวเป็นเพียงตัวอย่างเพื่อสาธิตการคำนวณ ราคาจริงต่างกันมากตามพื้นที่
          ระยะขนส่ง และชนิดดิน ควรขอใบเสนอราคาผู้รับเหมาในพื้นที่จริงเสมอ
        </p>
      </Section>

      <Section title="ทำไมราคาต่อคิวแต่ละเจ้าไม่เท่ากัน?">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          ปัจจัยที่ทำให้ค่าถมที่ดินถูก/แพงต่างกัน
        </p>
        <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {FACTORS.map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          ก่อนถม ควรเช็กเนื้อที่แปลงให้แม่นก่อน —{' '}
          <a href="/articles/check-land-before-buying" style={{ color: C.cyan }}>
            ดูเช็กลิสต์ตรวจที่ดินก่อนซื้อ
          </a>{' '}จะช่วยให้รู้ขนาดและสภาพแปลงจริงก่อนวางแผนถม
        </p>
      </Section>

      <Section title="เลือกดินถมแบบไหนดี?">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          ดินถมมีหลายชนิด ใช้งานต่างกัน — เลือกผิดอาจยุบตัวหรือสร้างบ้านไม่ได้
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {SOIL.map(s => (
            <div key={s.th} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14,
            }}>
              <div style={{ fontWeight: 700, fontSize: 15.5, color: '#fff', marginBottom: 4 }}>{s.th}</div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.5, marginBottom: 3 }}>{s.use}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ถมที่ดินผิดกฎหมายได้ — รู้ก่อนจ้าง">
        <p style={p}>
          หลายคนคิดว่าที่ดินของตัวเองจะถมยังไงก็ได้ — ไม่จริง การถมดินอยู่ภายใต้
          <strong> พ.ร.บ.การขุดดินและถมดิน พ.ศ.2543</strong> โดยเฉพาะถ้าที่ดินอยู่ในเขตเทศบาล
          เขต อบต. หรือพื้นที่ที่มีผังเมืองรวมบังคับใช้
        </p>
        <figure style={{ margin: '12px 0 16px' }}>
          <img src="/article-images/land-filling-cost-fig2.webp" alt="ที่ดินถมเสร็จที่ขอบดินสูงกว่าแปลงข้างเคียง พร้อมร่องระบายน้ำตามแนวเขต"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ถมสูงกว่าที่ดินข้างเคียงต้องจัดให้มีการระบายน้ำ และถ้าเกิน 2,000 ตร.ม. ต้องแจ้งท้องถิ่นก่อน
          </figcaption>
        </figure>
        <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ถมดินสูงเกินระดับที่ดินข้างเคียง และมีพื้นที่ "เกิน 2,000 ตารางเมตร" → ต้องแจ้งการถมดินต่อเจ้าพนักงานท้องถิ่นก่อน (มาตรา 26)',
            'ทุกกรณีต้องจัดให้มี "การระบายน้ำ" เพียงพอ ไม่ให้น้ำท่วมขังหรือไหลเข้าที่ดินข้างเคียง',
            'ต้องป้องกันดินพังทลายและไม่ก่อความเสียหายต่อที่ดินรอบข้าง (เช่น ทำกำแพงกันดินหากจำเป็น)',
            'ถมโดยไม่แจ้งตามที่กฎหมายกำหนด มีโทษจำคุกไม่เกิน 1 ปี หรือปรับไม่เกิน 50,000 บาท หรือทั้งจำทั้งปรับ',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.cyan, fontWeight: 700, flexShrink: 0 }}>•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          ก่อนถมเพื่อพัฒนา ควรเช็กผังเมืองด้วยว่าที่ดินอยู่โซนไหน ทำอะไรได้ —{' '}
          <a href="/articles/city-plan-online" style={{ color: C.cyan }}>
            ดูวิธีเช็กผังเมืองออนไลน์ด้วยตัวเอง
          </a>
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

      <Section title="สรุป: ก่อนจ้างถมที่ดิน เช็ก 3 อย่างนี้">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'คำนวณคิวดินเองก่อน (พื้นที่ × ความสูง + เผื่อบดอัด) เพื่อต่อรองและตรวจบิลได้',
            'ขอใบเสนอราคาหลายเจ้า เทียบราคาต่อคิว + เงื่อนไขบดอัด/ขนส่งให้ชัด',
            'เช็กขนาดแปลง — ถ้าเกิน 2,000 ตร.ม. และถมสูง ต้องแจ้งท้องถิ่นก่อน เลี่ยงโดนปรับ',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
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
        ⚠ <strong>ข้อควรระวัง:</strong> ราคาต่อคิวและสัดส่วนเผื่อบดอัดในบทความเป็นตัวเลขโดยประมาณเพื่อสาธิตการคำนวณ
        ราคาจริงแตกต่างกันตามพื้นที่ ระยะขนส่ง และชนิดดิน ส่วนข้อกำหนดการแจ้งถมดินอาจต่างกันในแต่ละท้องถิ่น
        ควรสอบถามเทศบาล/อบต. ในพื้นที่ก่อนเริ่มงานเสมอ
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub เช็กแปลงที่ดินจริง
        </a>
      </div>
    </article>
  );
}

// ════════════════════════════════════════
// src/content/articles/land-appraisal-price-online.tsx
// บทความ: เช็คราคาประเมินที่ดินออนไลน์ฟรี — 2 เว็บราชการ
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-appraisal-price-online',
  title:       'เช็คราคาประเมินที่ดินออนไลน์ฟรี — 2 เว็บราชการทำเองได้ใน 3 นาที',
  description: 'สอนเช็คราคาประเมินที่ดินด้วยตัวเองฟรี ผ่านเว็บกรมธนารักษ์ (เลขโฉนด) และ LandsMaps กรมที่ดิน (คลิกบนแผนที่) ไม่ต้องลงทะเบียน ไม่ต้องจ้างใคร',
  excerpt:     'ก่อนตั้งราคาขายหรือเสนอซื้อ ควรรู้ราคาประเมินราชการของแปลงนั้นก่อน — เช็กเองฟรีใน 3 นาที ผ่าน 2 เว็บราชการ ไม่ต้องลงทะเบียน',
  date:        '2026-06-04',
  tags:        ['ราคาประเมินที่ดิน', 'กรมธนารักษ์', 'LandsMaps', 'เช็คราคาที่ดิน', 'ซื้อขายที่ดิน'],
  readMin:     6,
  cover:       'https://tnrmaphub.com/article-images/land-appraisal-price-online.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const USES = [
  'คำนวณค่าธรรมเนียมโอนและภาษีตอนซื้อขาย (คิดจากราคาประเมิน)',
  'ตั้งราคาตั้งต้นก่อนต่อรองซื้อหรือขาย',
  'ประเมินคร่าว ๆ ว่าราคาที่เขาเสนอมาสมเหตุสมผลไหม',
  'คำนวณภาษีที่ดินและสิ่งปลูกสร้างรายปี',
  'ตรวจก่อนยื่นกู้ธนาคาร (ธนาคารมักให้สินเชื่อตามราคาประเมิน)',
];

const TREASURY_STEPS = [
  { n: 1, t: 'เข้าเว็บกรมธนารักษ์', d: 'เปิด assessprice.treasury.go.th แล้วเลือกเมนูค้นหาราคาประเมิน "ที่ดิน"' },
  { n: 2, t: 'กรอกเลขที่โฉนด', d: 'ใส่เลขโฉนด (ดูที่มุมโฉนด) — ถ้าจะให้ตรงแปลง ระบุหน้าสำรวจเพิ่มด้วย' },
  { n: 3, t: 'เลือกจังหวัด / อำเภอ', d: 'เลือกที่ตั้งของที่ดินให้ตรง แล้วกดค้นหา' },
  { n: 4, t: 'อ่านราคาประเมิน', d: 'ระบบแสดงราคาประเมินต่อตารางวา (บาท/ตร.ว.) คูณด้วยเนื้อที่เพื่อได้มูลค่ารวม' },
];

const LANDSMAPS_STEPS = [
  { n: 1, t: 'เข้า LandsMaps', d: 'เปิด landsmaps.dol.go.th — ใช้ได้เลย ไม่ต้องลงทะเบียน' },
  { n: 2, t: 'เลือกจังหวัด / อำเภอ', d: 'เลือกพื้นที่ แล้วซูมแผนที่เข้าหาแปลงที่ต้องการ' },
  { n: 3, t: 'คลิกที่แปลงที่ดิน', d: 'คลิกบนรูปแปลงบนแผนที่ ระบบจะดึงข้อมูลแปลงนั้นขึ้นมา' },
  { n: 4, t: 'ดูราคาประเมิน + ข้อมูลแปลง', d: 'เห็นราคาประเมิน เนื้อที่ เลขโฉนด ค่าพิกัด และผังเมือง ในจุดเดียว' },
];

const COMPARE = [
  { site: 'กรมธนารักษ์', url: 'assessprice.treasury.go.th', best: 'รู้เลขโฉนดอยู่แล้ว', get: 'ราคาประเมินทางการ ค้นเร็วตรงแปลง' },
  { site: 'LandsMaps (กรมที่ดิน)', url: 'landsmaps.dol.go.th', best: 'ไม่รู้เลขโฉนด อยากหาจากตำแหน่งบนแผนที่', get: 'ราคาประเมิน + รูปแปลง + ผังเมือง ครบในแผนที่เดียว' },
];

export const FAQ = [
  { q: 'ราคาประเมิน เท่ากับราคาขายจริงไหม?', a: 'ไม่เท่า ราคาประเมินของราชการมักต่ำกว่าราคาตลาด โดยเฉพาะทำเลดี ใช้เป็นฐานคำนวณภาษี/ค่าโอน และเป็นจุดตั้งต้นต่อรอง ไม่ใช่ราคาซื้อขายจริง' },
  { q: 'ทำไมราคาในแต่ละเว็บไม่ตรงกัน?', a: 'ข้อมูลแต่ละระบบอาจอัปเดตคนละรอบ และราคาประเมินมีหลายระดับ (รายแปลง/รายบล็อก) ถ้าต้องใช้เป็นทางการ ควรขอหนังสือรับรองราคาประเมินจากสำนักงานที่ดินหรือธนารักษ์' },
  { q: 'ไม่มีเลขโฉนด เช็คได้ไหม?', a: 'ได้ ใช้ LandsMaps แล้วซูมหาแปลงบนแผนที่ คลิกที่แปลงเพื่อดูราคาประเมินและข้อมูลได้เลย ไม่ต้องมีเลขโฉนดก่อน' },
  { q: 'ต้องเสียเงิน/ลงทะเบียนไหม?', a: 'ไม่ต้อง ทั้งสองเว็บเป็นบริการฟรีของหน่วยงานราชการ เปิดใช้ได้ทันทีโดยไม่ต้องสมัครสมาชิก' },
];

const SOURCES = [
  { name: 'ราคาประเมินทรัพย์สิน (กรมธนารักษ์)', url: 'https://assessprice.treasury.go.th' },
  { name: 'LandsMaps ค้นหารูปแปลงที่ดิน (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
  { name: 'กรมธนารักษ์', url: 'https://www.treasury.go.th' },
  { name: 'กรมที่ดิน', url: 'https://www.dol.go.th' },
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

function StepList({ steps }: { steps: { n: number; t: string; d: string }[] }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 10 }}>
      {steps.map(s => (
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
  );
}

export function LandAppraisalPriceOnline() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          เช็คราคาประเมินที่ดินออนไลน์ฟรี
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          2 เว็บราชการ ทำเองได้ใน 3 นาที ไม่ต้องจ้างใคร
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          How to Check Official Land Appraisal Price Online — Free
        </p>
      </header>

      <Section title="ทำไมต้องรู้ราคาประเมินก่อน?">
        <p style={p}>
          ก่อนเสนอราคาซื้อ หรือตั้งราคาขายที่ดิน คุณควรรู้ <strong>ราคาประเมินของราชการ</strong>
          ของแปลงนั้นก่อน — เพราะมันคือฐานที่ใช้คิดค่าโอน ภาษี และเป็นจุดตั้งต้นในการต่อรอง
          ข่าวดีคือ เช็กเองได้ฟรีใน 3 นาที ไม่ต้องจ้างนายหน้าหรือบริษัทประเมิน
        </p>
        <p style={{ ...p, color: C.muted, fontSize: 13, marginBottom: 6 }}>ราคาประเมินเอาไปใช้ทำอะไรได้บ้าง:</p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {USES.map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="ราคาประเมิน ≠ ราคาตลาด (อย่าสับสน)">
        <p style={p}>
          <strong>ราคาประเมินราชการ</strong> คือราคาที่รัฐใช้คิดภาษีและค่าธรรมเนียม
          มักจะ <strong>ต่ำกว่าราคาซื้อขายจริงในตลาด</strong> โดยเฉพาะทำเลดี
          ดังนั้นใช้ราคาประเมินเป็น "ฐานอ้างอิง" และจุดตั้งต้นต่อรองได้
          แต่อย่าใช้เป็นราคาซื้อขายจริงตรง ๆ
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 4 }}>
          เห็นว่าราคาประเมินสูงหรือต่ำเกินจริง?{' '}
          <a href="/articles/object-land-appraisal-price" style={{ color: C.cyan }}>
            ยื่นคัดค้านราคาประเมินที่ดินกับกรมธนารักษ์
          </a>{' '}ได้ภายใน 90 วัน
        </p>
      </Section>

      <Section title="เว็บที่ 1: กรมธนารักษ์ — เมื่อรู้เลขโฉนด">
        <p style={{ ...p, marginTop: -4 }}>
          เหมาะกับคนที่มีโฉนดอยู่ในมือแล้ว ค้นจากเลขโฉนดได้ราคาประเมินตรงแปลง
        </p>
        <figure style={{ margin: '14px 0 4px' }}>
          <img src="/article-images/land-appraisal-price-online-fig1.webp" alt="เปิดเว็บกรมธนารักษ์เช็คราคาประเมินที่ดินจากเลขโฉนดบนมือถือ"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ค้นราคาประเมินจากเลขโฉนดบนเว็บกรมธนารักษ์ — ทำได้เองจากมือถือ
          </figcaption>
        </figure>
        <StepList steps={TREASURY_STEPS} />
      </Section>

      <Section title="เว็บที่ 2: LandsMaps — เมื่อไม่รู้เลขโฉนด">
        <p style={{ ...p, marginTop: -4 }}>
          ของกรมที่ดิน เหมาะเวลาอยากหาแปลงจากตำแหน่งบนแผนที่ คลิกแปลงเดียวได้ทั้งราคาและข้อมูล
        </p>
        <figure style={{ margin: '14px 0 4px' }}>
          <img src="/article-images/land-appraisal-price-online-fig2.webp" alt="คลิกรูปแปลงที่ดินบน LandsMaps เพื่อดูราคาประเมินและข้อมูลแปลง"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            คลิกที่รูปแปลงบน LandsMaps แล้วดูราคาประเมิน เนื้อที่ และผังเมือง ในจุดเดียว
          </figcaption>
        </figure>
        <StepList steps={LANDSMAPS_STEPS} />
      </Section>

      <Section title="เลือกใช้เว็บไหนดี?">
        <div style={{ display: 'grid', gap: 10 }}>
          {COMPARE.map(c => (
            <div key={c.url} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{c.site}</div>
              <div style={{ fontSize: 12.5, color: C.cyan, marginBottom: 8 }}>{c.url}</div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55, marginBottom: 3 }}>
                <strong style={{ color: C.green }}>เหมาะเมื่อ:</strong> {c.best}
              </div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>
                <strong style={{ color: C.text }}>ได้อะไร:</strong> {c.get}
              </div>
            </div>
          ))}
        </div>
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

      <Section title="สรุป — เช็กราคาประเมินก่อนตัดสินใจ">
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
          <li style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>
            <strong>มีเลขโฉนด</strong> → ใช้เว็บกรมธนารักษ์ ค้นตรงแปลงได้เลย
          </li>
          <li style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>
            <strong>ไม่มีเลขโฉนด</strong> → ใช้ LandsMaps คลิกหาแปลงบนแผนที่
          </li>
          <li style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>
            <strong>อย่าลืม</strong> ราคาประเมินเป็นฐานอ้างอิง ไม่ใช่ราคาตลาด — ต้องใช้เป็นทางการให้ขอหนังสือรับรอง
          </li>
        </ol>
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
        ⚠ <strong>ข้อควรระวัง:</strong> ราคาประเมินที่แสดงออนไลน์ใช้อ้างอิงเบื้องต้น
        ข้อมูลแต่ละระบบอาจอัปเดตคนละรอบและไม่ตรงกัน หากต้องใช้เป็นทางการ
        (เช่น คำนวณภาษี ค่าโอน หรือยื่นกู้) ควรขอหนังสือรับรองราคาประเมินจากสำนักงานที่ดินหรือกรมธนารักษ์โดยตรง
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

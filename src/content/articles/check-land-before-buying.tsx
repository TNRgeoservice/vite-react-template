// ════════════════════════════════════════
// src/content/articles/check-land-before-buying.tsx
// บทความ: ซื้อที่ดินต้องตรวจอะไรบ้าง ก่อนวางมัดจำ
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'check-land-before-buying',
  title:       'ซื้อที่ดินต้องตรวจอะไรบ้าง — 7 เช็กลิสต์ก่อนวางมัดจำ กันเงินสูญ',
  description: 'เช็กที่ดินก่อนซื้อให้ครบ 7 ข้อก่อนวางมัดจำ — ประเภทโฉนด เจ้าของตัวจริง จำนอง/อายัด ผังเมือง ทางเข้าออก แนวเขต และราคา พร้อมสิ่งที่ต้องระบุในสัญญามัดจำ กันซื้อแล้วใช้ไม่ได้',
  excerpt:     'ก่อนจ่ายมัดจำคือจุดสุดท้ายที่ถอนได้ฟรี — เช็ก 7 อย่างนี้ให้ครบ ตั้งแต่ประเภทโฉนด จำนอง/อายัด ผังเมือง ไปจนถึงทางเข้าออกและราคา กันซื้อแล้วใช้ไม่ได้หรือเงินมัดจำสูญ',
  date:        '2026-06-06',
  tags:        ['ซื้อที่ดิน', 'ตรวจสอบที่ดิน', 'โฉนด', 'มัดจำ', 'due diligence'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/check-land-before-buying.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const CHECKS = [
  {
    n: 1,
    t: 'โฉนดเป็น "ประเภทที่ซื้อขายได้" จริงไหม',
    d: 'ดูตราครุฑที่หัวเอกสารก่อนเลย โฉนดครุฑแดง (น.ส.4จ) คือกรรมสิทธิ์เต็ม โอนซื้อขายได้ปกติ แต่ น.ส.3 / น.ส.3ก เป็นแค่สิทธิครอบครอง ส่วน ส.ป.ก.4-01 และ ภ.บ.ท.5 ไม่ใช่เอกสารสิทธิ์ — ที่ดินยังเป็นของรัฐ ห้ามจดทะเบียนซื้อขาย ถ้าจ่ายมัดจำให้ที่ดินกลุ่มนี้ มีโอกาสสูงที่จะโอนไม่ได้',
    tool: 'ดูตราครุฑ + ชื่อหนังสือแสดงสิทธิ์ที่หัวโฉนด',
  },
  {
    n: 2,
    t: 'คนขายเป็นเจ้าของตัวจริงหรือเปล่า',
    d: 'ชื่อในโฉนดต้องตรงกับคนที่คุยขายกับคุณ ถ้าคนขายอ้างว่าขายแทนเจ้าของ ขอดูหนังสือมอบอำนาจตัวจริง + บัตรประชาชนของทั้งสองฝ่าย อย่าวางมัดจำให้คนที่พิสูจน์สิทธิ์เหนือที่ดินไม่ได้',
    tool: 'เทียบชื่อในโฉนด ↔ บัตรประชาชนผู้ขาย / หนังสือมอบอำนาจ',
  },
  {
    n: 3,
    t: 'ที่ดินติดจำนอง อายัด หรือมีคดีอยู่ไหม',
    d: 'พลิกดูด้านหลังโฉนดที่ช่อง "ภาระผูกพัน" จะเห็นว่าติดจำนองกับใคร วงเงินเท่าไร ส่วน "อายัด" คือการที่หน่วยงาน เช่น กรมบังคับคดี สั่งระงับการโอนชั่วคราว ถ้าที่ดินติดอายัดอยู่ โอนไม่ได้จนกว่าจะปลด วิธีที่แม่นที่สุดคือถือโฉนดตัวจริงไปขอ "หนังสือรับรองรายการจดทะเบียน (ท.ด.21)" ที่สำนักงานที่ดินที่ดินตั้งอยู่ — ได้ข้อมูลจำนอง อายัด คดีความ ครบในใบเดียว',
    tool: 'หลังโฉนด + LandsMaps (เบื้องต้น) + ท.ด.21 ที่สำนักงานที่ดิน (แม่นสุด)',
  },
  {
    n: 4,
    t: 'สร้างสิ่งที่ตั้งใจไว้ได้จริงไหม — เช็กผังเมือง',
    d: 'ที่ดินสวยแค่ไหนก็ไม่มีความหมาย ถ้าผังเมืองห้ามสร้างสิ่งที่คุณวางแผนไว้ ที่ดินโซนสีเขียว (เกษตรกรรม) สร้างที่อยู่อาศัยได้จำกัดและห้ามโรงงาน ส่วนโซนพาณิชย์หรืออุตสาหกรรมก็มีเงื่อนไขต่างกัน เช็กสีผังเมืองของแปลงก่อนวางมัดจำเสมอ',
    tool: 'ระบบผังเมืองกรมโยธาฯ (pludds.dpt.go.th) — ดูวิธีในลิงก์ด้านล่าง',
  },
  {
    n: 5,
    t: 'มีทางเข้าออกถูกกฎหมายไหม',
    d: 'ที่ดินที่ไม่มีทางออกสู่ถนนสาธารณะ เรียกว่า "ที่ดินตาบอด" ราคาตกและพัฒนายาก ทางออกมี 2 แบบที่ต่างกันในกฎหมาย: "ทางจำเป็น" (ป.พ.พ. มาตรา 1349–1352) ที่ที่ดินตาบอดมีสิทธิฟ้องขอผ่านที่ดินข้างเคียงโดยจ่ายค่าทดแทน กับ "ภาระจำยอม" (มาตรา 1387) ที่เจ้าของที่ดินตกลงยอมและจดทะเบียนไว้ ก่อนวางมัดจำ ถามให้ชัดว่าทางเข้าที่ใช้อยู่เป็นถนนสาธารณะ หรือเป็นแค่ทางผ่านที่ดินคนอื่นที่ยังไม่ได้จดทะเบียน',
    tool: 'ดูแปลงบนแผนที่ว่าติดถนนสาธารณะจริง + ถามการจดทะเบียนภาระจำยอม',
  },
  {
    n: 6,
    t: 'แนวเขตจริงตรงกับโฉนด และสภาพรอบข้างเป็นยังไง',
    d: 'หมุดหลักเขตในพื้นที่จริงควรตรงกับรูปแปลงในโฉนด ถ้าเพื่อนบ้านเคยรังวัดไปก่อนแล้วคุณไม่ได้ไประวังแนวเขต อาจเสียพื้นที่บางส่วนไปโดยไม่รู้ตัว ถ้าไม่มั่นใจ ยื่นรังวัดสอบเขตได้ (เนื้อที่ไม่เกิน 5 ไร่ ค่าใช้จ่ายประมาณ 3,480 บาทตามระเบียบกรมที่ดิน) และอย่าลืมดูสภาพรอบข้าง: เสี่ยงน้ำท่วมไหม ติดแนวเวนคืนหรือใต้เสาไฟฟ้าแรงสูงหรือเปล่า',
    tool: 'เดินดูหมุดเขตจริง + รังวัดสอบเขต (ถ้าจำเป็น) + สอบถามแนวเวนคืน',
  },
  {
    n: 7,
    t: 'ราคาที่จะจ่าย สมเหตุผลไหม',
    d: 'ก่อนเคาะราคา เทียบ "ราคาประเมินราชการ" กับ "ราคาตลาด" ของทำเลนั้น ราคาประเมินมักต่ำกว่าราคาซื้อขายจริงพอสมควร ใช้เป็นฐานอ้างอิงตอนต่อรองได้ อย่าใช้ราคาที่ผู้ขายบอกอย่างเดียวเป็นตัวตั้ง',
    tool: 'เทียบราคาประเมิน (กรมธนารักษ์) ↔ ราคาตลาดทำเลใกล้เคียง',
  },
];

const CONTRACT = [
  'ราคารวม + งวดการชำระ (วางมัดจำเท่าไร โอนส่วนที่เหลือเมื่อไร)',
  'แนบสำเนาโฉนด + ระบุเลขโฉนด เนื้อที่ ให้ตรงกับของจริง',
  'เงื่อนไขให้ผู้ซื้อเข้าตรวจสอบที่ดินได้ก่อนโอน',
  'ใครรับผิดชอบค่าโอน ค่าภาษี ค่าธรรมเนียมที่สำนักงานที่ดิน',
  'เงื่อนไขเมื่อฝ่ายใดผิดนัด (ริบมัดจำ / คืนมัดจำ / ค่าปรับ)',
];

const SUMMARY = [
  { check: 'ประเภทโฉนด (ครุฑแดงโอนได้)', tool: 'ดูตราครุฑที่หัวโฉนด' },
  { check: 'ชื่อเจ้าของตรงคนขาย', tool: 'โฉนด ↔ บัตร ปชช. / มอบอำนาจ' },
  { check: 'จำนอง / อายัด / คดี', tool: 'ท.ด.21 ที่สำนักงานที่ดิน' },
  { check: 'ผังเมือง (สร้างได้ไหม)', tool: 'pludds.dpt.go.th' },
  { check: 'ทางเข้าออกถูกกฎหมาย', tool: 'แผนที่ + การจดภาระจำยอม' },
  { check: 'แนวเขต + ความเสี่ยงรอบข้าง', tool: 'หมุดเขตจริง / รังวัดสอบเขต' },
  { check: 'ราคาสมเหตุผล', tool: 'ราคาประเมิน ↔ ราคาตลาด' },
];

export const FAQ = [
  { q: 'จ่ายมัดจำไปแล้ว เพิ่งรู้ว่าที่ดินมีปัญหา ขอเงินคืนได้ไหม?', a: 'ขึ้นกับเงื่อนไขในสัญญาและสาเหตุของปัญหา ถ้าฝ่ายผู้ขายปกปิดข้อมูลหรือผิดสัญญา ผู้ซื้ออาจมีสิทธิเรียกคืนได้ แต่ถ้าผู้ซื้อเปลี่ยนใจเอง มักถูกริบมัดจำ จึงควรตรวจให้ครบ "ก่อน" จ่าย เพราะตอนนั้นคือจุดที่ถอนได้โดยไม่เสียอะไร — กรณีมีข้อพิพาทควรปรึกษานักกฎหมาย' },
  { q: 'ตรวจจำนอง/อายัด ออนไลน์ได้เลยไหม หรือต้องไปสำนักงานที่ดิน?', a: 'ดูเบื้องต้นได้จากด้านหลังโฉนดและระบบ LandsMaps แต่ข้อมูลที่อัปเดตและแม่นที่สุดคือ "หนังสือรับรองรายการจดทะเบียน (ท.ด.21)" ที่ขอได้ที่สำนักงานที่ดินที่แปลงตั้งอยู่ ก่อนโอนเงินก้อนใหญ่แนะนำให้ขอใบนี้' },
  { q: 'ที่ดินตาบอด (ไม่มีทางออก) ซื้อได้ไหม?', a: 'ซื้อได้ แต่เสี่ยงและพัฒนายากกว่า เจ้าของที่ดินตาบอดมีสิทธิฟ้องขอ "ทางจำเป็น" ผ่านที่ดินข้างเคียงตาม ป.พ.พ. มาตรา 1349 โดยต้องจ่ายค่าทดแทน ถ้าจะซื้อ ควรเคลียร์เรื่องทางเข้าออกให้จบก่อนวางมัดจำ' },
  { q: 'ดูยังไงว่าโฉนดประเภทไหนซื้อขายได้?', a: 'ดูที่ตราครุฑและชื่อหนังสือแสดงสิทธิ์ น.ส.4จ (ครุฑแดง) คือโฉนดกรรมสิทธิ์เต็ม โอนซื้อขายได้ ส่วน ส.ป.ก.4-01 และ ภ.บ.ท.5 ไม่ใช่กรรมสิทธิ์ ห้ามซื้อขายในตลาดทั่วไป' },
];

const SOURCES = [
  { name: 'กรมที่ดิน (DOL)', url: 'https://www.dol.go.th' },
  { name: 'ค้นหารูปแปลงที่ดิน LandsMaps (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
  { name: 'ระบบตรวจสอบผังเมืองรวม (กรมโยธาธิการและผังเมือง)', url: 'https://pludds.dpt.go.th' },
  { name: 'ราคาประเมินที่ดิน (กรมธนารักษ์)', url: 'https://www.treasury.go.th' },
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

export function CheckLandBeforeBuying() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ซื้อที่ดินต้องตรวจอะไรบ้าง ก่อนวางมัดจำ
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          7 เช็กลิสต์ที่ต้องเคลียร์ให้จบ ก่อนจ่ายเงินก้อนแรก
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          7 Things to Check Before Putting a Deposit on Land
        </p>
      </header>

      <Section title="จ่ายมัดจำแล้วเพิ่งรู้ว่าที่ดินมีปัญหา — ตอนนั้นมักสายไป">
        <p style={p}>
          คุณเจอที่ดินถูกใจ ผู้ขายเร่งให้ "วางมัดจำจองไว้ก่อน เดี๋ยวคนอื่นเอาไป" คุณรีบโอนเงินจอง
          แล้วมารู้ทีหลังว่าที่ดินติดจำนองอยู่ หรือสร้างบ้านไม่ได้เพราะผังเมือง หรือไม่มีทางเข้าออกถูกกฎหมาย
        </p>
        <p style={p}>
          ปัญหาคือ พอเงินมัดจำออกจากมือไปแล้ว อำนาจต่อรองของคุณหายไปด้วย จะถอนก็เสี่ยงโดนริบมัดจำ
          <strong> ช่วงก่อนวางมัดจำ คือจังหวะสุดท้ายที่คุณถอนได้แทบจะฟรี</strong> ใช้มันให้คุ้ม
          ด้วยการเช็ก 7 อย่างนี้ให้ครบก่อน
        </p>
      </Section>

      <figure style={{ margin: '0 0 28px' }}>
        <img src="/article-images/check-land-before-buying-fig1.webp"
          alt="หน้าจอ TNR MapHub แสดงข้อมูลแปลงที่ดิน ประเภทเอกสาร น.ส.3ก และสีผังเมือง"
          style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
            borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
        <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>
          ข้อมูลแปลงบน TNR MapHub — เห็นประเภทเอกสาร (น.ส.3ก), สีผังเมือง (เขียว) และถนนเข้า (ลูกรัง) ในกล่องเดียว จับธงเตือนได้ตั้งแต่ยังไม่ออกไปดูที่จริง
        </figcaption>
      </figure>

      <Section title="7 อย่างที่ต้องตรวจก่อนวางมัดจำ">
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          {CHECKS.map(c => (
            <li key={c.n} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: C.cyan, color: '#0d1520', fontWeight: 900, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{c.n}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16.5, color: '#fff', marginBottom: 4 }}>{c.t}</div>
                <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.6, marginBottom: 6 }}>{c.d}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                  <span style={{ color: C.green, fontWeight: 700 }}>เช็กยังไง: </span>{c.tool}
                </div>
              </div>
            </li>
          ))}
        </ol>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          ข้อ 4 อยากดูผังเมืองเองทีละขั้น อ่าน{' '}
          <a href="/articles/city-plan-online" style={{ color: C.cyan }}>
            วิธีดูผังเมืองออนไลน์ด้วยตัวเอง
          </a>{' '}และข้อ 7 ดู{' '}
          <a href="/articles/land-appraisal-price-online" style={{ color: C.cyan }}>
            วิธีเช็คราคาประเมินที่ดินออนไลน์ฟรี
          </a>{' '}ประกอบ
        </p>
      </Section>

      <figure style={{ margin: '0 0 28px' }}>
        <img src="/article-images/check-land-before-buying-fig2.webp"
          alt="แผนที่ผังเมืองแสดงสีโซนการใช้ประโยชน์ที่ดินบน TNR MapHub"
          style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
            borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
        <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>
          เปิดชั้นสีผังเมืองทับแปลงที่ดิน — โซนสีบอกทันทีว่าตรงนั้นสร้างที่อยู่อาศัย พาณิชย์ หรือทำได้แค่เกษตร (ข้อ 4)
        </figcaption>
      </figure>

      <Section title="ผ่านครบ 7 ข้อแล้ว ค่อยเซ็นสัญญาวางมัดจำ">
        <p style={p}>
          เมื่อตรวจครบและมั่นใจแล้ว อย่าวางมัดจำด้วยปากเปล่าหรือสลิปโอนเฉย ๆ ทำเป็น
          "สัญญาจะซื้อจะขาย (วางมัดจำ)" เป็นลายลักษณ์อักษร อย่างน้อยควรระบุ:
        </p>
        <ul style={{ margin: '0 0 12px', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {CONTRACT.map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          ข้อควรรู้เรื่องมัดจำ: ถ้าผู้ซื้อผิดนัด ผู้ขายมีสิทธิริบมัดจำได้ แต่ตาม พ.ร.บ.ว่าด้วยข้อสัญญา
          ที่ไม่เป็นธรรม พ.ศ.2540 มาตรา 7 หากมัดจำสูงเกินส่วน ศาลลดให้ริบได้เท่าความเสียหายจริง
          และสัญญาจะซื้อจะขายมีอายุความ 10 ปี (ป.พ.พ. มาตรา 193/30)
        </p>
      </Section>

      <figure style={{ margin: '0 0 28px', textAlign: 'center' }}>
        <img src="/article-images/check-land-before-buying-fig3.webp"
          alt="หน้าสารบัญจดทะเบียนหลังโฉนดที่ดิน แสดงรายการจดทะเบียนและภาระผูกพัน"
          style={{ maxWidth: 380, width: '100%', height: 'auto',
            borderRadius: 10, border: `1px solid ${C.border}`, display: 'inline-block' }} />
        <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>
          หน้า “สารบัญจดทะเบียน” หลังโฉนด — รายการจำนอง อายัด และการโอนจะอยู่ตรงนี้ ขอตรวจฉบับล่าสุดได้จากหนังสือรับรอง ท.ด.21 (ข้อ 3) · ปิดบังข้อมูลส่วนบุคคลแล้ว
        </figcaption>
      </figure>

      <Section title="สรุปเช็กลิสต์ + เครื่องมือที่ใช้">
        <div style={{ display: 'grid', gap: 8 }}>
          {SUMMARY.map((s, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}>{s.check}</div>
              <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{s.tool}</div>
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
        ⚠ <strong>ข้อควรระวัง:</strong> บทความนี้เป็นแนวทางตรวจสอบเบื้องต้น ข้อมูลทะเบียนที่ดินที่เป็นทางการ
        ให้ยึดตามสำนักงานที่ดิน และกรณีมีข้อพิพาทหรือสัญญาซับซ้อน ควรปรึกษานักกฎหมายหรือสำนักงานที่ดินก่อนตัดสินใจ
      </p>

      <p style={{ ...p, marginTop: 20, fontWeight: 600, color: '#fff' }}>
        สรุปสั้น ๆ: ก่อนวางมัดจำทุกครั้ง เช็ก 3 อย่างที่พลาดไม่ได้ — โฉนดเป็นกรรมสิทธิ์ที่โอนได้,
        ไม่มีจำนอง/อายัดติดอยู่ (ขอ ท.ด.21), และผังเมืองให้ทำสิ่งที่คุณตั้งใจได้ ที่เหลือคือเก็บรายละเอียดให้ครบ
        แล้วค่อยจ่ายเงิน
      </p>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub ปักหมุดเช็กที่ดินก่อนซื้อ
        </a>
      </div>
    </article>
  );
}

// ════════════════════════════════════════
// src/content/articles/land-title-deed-types.tsx
// บทความ: เอกสารสิทธิ์ที่ดินมีกี่ประเภท — โฉนด น.ส.3ก ส.ป.ก. ภบท.5
// Body = inline style + plain <a> เท่านั้น (prerender ด้วย renderToStaticMarkup)
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-title-deed-types',
  title:       'เอกสารสิทธิ์ที่ดินมีกี่ประเภท — โฉนด น.ส.3ก ส.ป.ก. ภบท.5 แบบไหนซื้อขายได้',
  description: 'เทียบเอกสารสิทธิ์ที่ดินครบทุกแบบ โฉนดครุฑแดง น.ส.3ก น.ส.3 ส.ป.ก.4-01 ภบท.5 ใบจอง — แบบไหนซื้อขาย โอน จำนองได้ พร้อมวิธีเช็คเอกสารจริงก่อนวางเงินมัดจำ',
  excerpt:     'ครุฑแดง ครุฑเขียว ครุฑดำ ต่างกันตรงไหน? เทียบเอกสารสิทธิ์ที่ดินทุกแบบ พร้อมตารางสรุปว่าแบบไหนซื้อขาย โอน จำนองได้ และวิธีเช็คของจริงก่อนวางเงิน',
  date:        '2026-07-21',
  tags:        ['เอกสารสิทธิ์', 'โฉนดที่ดิน', 'น.ส.3ก', 'ส.ป.ก.', 'ซื้อที่ดิน'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/land-title-deed-types.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

// เอกสารหลักที่เจอบ่อยในตลาดซื้อขาย
const DEEDS = [
  {
    name: 'โฉนดที่ดิน (น.ส.4จ)', garuda: 'ครุฑแดง', color: '#e53935',
    status: 'กรรมสิทธิ์สมบูรณ์',
    detail: 'เอกสารสิทธิ์ระดับสูงสุด เจ้าของมีกรรมสิทธิ์เต็ม ซื้อขาย โอน จำนอง แบ่งแยกได้ทุกอย่าง มีระวางแผนที่และหลักหมุดชัดเจน',
    trade: 'ซื้อขาย/โอน/จำนองได้เต็มที่',
  },
  {
    name: 'น.ส.3ก', garuda: 'ครุฑเขียว', color: '#43a047',
    status: 'สิทธิครอบครอง (ยังไม่ใช่กรรมสิทธิ์)',
    detail: 'หนังสือรับรองการทำประโยชน์ที่มีระวางรูปถ่ายทางอากาศ ตำแหน่งแปลงค่อนข้างแน่นอน จดทะเบียนซื้อขายได้ และนำไปขอออกโฉนดได้',
    trade: 'ซื้อขาย/โอน/จำนองได้ และขอออกเป็นโฉนดได้',
  },
  {
    name: 'น.ส.3 / น.ส.3ข', garuda: 'ครุฑดำ', color: '#455a64',
    status: 'สิทธิครอบครอง (แนวเขตหยาบกว่า)',
    detail: 'หนังสือรับรองการทำประโยชน์ที่ไม่มีระวางรูปถ่ายทางอากาศ แนวเขตอาศัยการบรรยาย จึงเสี่ยงคลาดเคลื่อน ก่อนจดทะเบียนโอนต้องประกาศ 30 วัน (น.ส.3 กับ น.ส.3ข สิทธิเท่ากัน ต่างกันที่เขตท้องที่/ผู้ออกเอกสาร)',
    trade: 'ซื้อขายได้ แต่ต้องประกาศ 30 วันก่อนจดทะเบียน',
  },
  {
    name: 'ส.ป.ก.4-01', garuda: 'ไม่มีครุฑแบบโฉนด', color: '#8d6e63',
    status: 'สิทธิทำกินในที่ดินของรัฐ',
    detail: 'ที่ดินปฏิรูปเพื่อเกษตรกรรม รัฐยังเป็นเจ้าของ ผู้ถือมีสิทธิทำกินเท่านั้น ห้ามซื้อขายให้บุคคลทั่วไป ตกทอดได้เฉพาะทางมรดกแก่ทายาทที่เป็นเกษตรกร',
    trade: 'ห้ามซื้อขาย — โอนได้เฉพาะกรณีที่กฎหมายกำหนด',
  },
  {
    name: 'ใบจอง (น.ส.2)', garuda: '—', color: '#7e57c2',
    status: 'หนังสืออนุญาตให้เข้าทำประโยชน์ชั่วคราว',
    detail: 'รัฐอนุญาตให้ราษฎรเข้าทำประโยชน์ในที่ดินเป็นการชั่วคราว ยังไม่ใช่เอกสารแสดงสิทธิที่โอนขายได้ ต้องทำประโยชน์ต่อเนื่องเพื่อขอออกเอกสารสิทธิ์ในอนาคต',
    trade: 'ห้ามโอน (เว้นแต่ตกทอดทางมรดกตามเงื่อนไข)',
  },
  {
    name: 'ภบท.5', garuda: 'ไม่ใช่เอกสารสิทธิ์', color: '#f4511e',
    status: 'ใบเสียภาษีบำรุงท้องที่ — ไม่ใช่หลักฐานความเป็นเจ้าของ',
    detail: 'เป็นเพียงหลักฐานว่าเคยเสียภาษีบำรุงท้องที่ ที่ดินยังเป็นของรัฐ จดทะเบียนซื้อขายที่สำนักงานที่ดินไม่ได้ — ปัจจุบันภาษีบำรุงท้องที่ถูกแทนด้วยภาษีที่ดินและสิ่งปลูกสร้างแล้ว จึงไม่มีการออก ภบท.5 ใหม่ ประกาศขายที่อ้าง "ภบท.5" เสี่ยงสูงมาก',
    trade: 'ซื้อขายจดทะเบียนไม่ได้',
  },
];

export const FAQ = [
  { q: 'น.ส.3ก กับโฉนด ต่างกันอย่างไร?', a: 'โฉนด (น.ส.4จ) เป็นกรรมสิทธิ์สมบูรณ์ มีระวางแผนที่และหลักหมุดชัดเจน ส่วน น.ส.3ก เป็นเพียงสิทธิครอบครองที่มีระวางรูปถ่ายทางอากาศ ซื้อขายได้เหมือนกันแต่ความมั่นคงของสิทธิต่ำกว่า และนำไปยื่นขอออกเป็นโฉนดได้ที่สำนักงานที่ดิน' },
  { q: 'ที่ดิน ภบท.5 ซื้อได้ไหม?', a: 'ไม่ควรซื้อ เพราะ ภบท.5 เป็นแค่ใบเสียภาษีบำรุงท้องที่ ไม่ใช่เอกสารสิทธิ์ ที่ดินยังเป็นของรัฐ จดทะเบียนโอนที่สำนักงานที่ดินไม่ได้ เงินที่จ่ายไปจึงไม่ได้กรรมสิทธิ์ใด ๆ กลับมา' },
  { q: 'ส.ป.ก.4-01 เปลี่ยนเป็นโฉนดได้ไหม?', a: 'เปลี่ยนเป็นโฉนดครุฑแดงทั่วไปไม่ได้ แต่ผู้ถือที่เข้าเงื่อนไขสามารถขอเปลี่ยนเป็น "โฉนดเพื่อการเกษตร" ได้ตามระเบียบ ส.ป.ก. ซึ่งยังจำกัดการโอนเฉพาะเกษตรกรและทายาทตามเงื่อนไข ไม่ใช่การซื้อขายเสรี' },
  { q: 'จะรู้ได้อย่างไรว่าโฉนดที่ผู้ขายถือมาเป็นของจริง?', a: 'เช็คตำแหน่ง เลขโฉนด รูปแปลง และเนื้อที่ผ่านระบบ LandsMaps ของกรมที่ดินเป็นด่านแรก ส่วนชื่อผู้ถือกรรมสิทธิ์ปัจจุบันและภาระผูกพัน ต้องตรวจสารบบที่สำนักงานที่ดินที่แปลงนั้นตั้งอยู่ก่อนวางเงินทุกครั้ง ถ้าข้อมูลไม่ตรงกับเอกสารที่เห็น ให้หยุดธุรกรรมไว้ก่อน' },
  { q: 'ซื้อที่ดิน น.ส.3 ครุฑดำ เสี่ยงไหม?', a: 'เสี่ยงกว่าโฉนดและ น.ส.3ก เพราะไม่มีระวางรูปถ่ายทางอากาศ แนวเขตอาจคลาดเคลื่อนจากที่เห็นจริง ควรให้รังวัดสอบเขตก่อนตกลงราคา และเผื่อเวลาประกาศ 30 วันก่อนจดทะเบียนโอน' },
];

const SOURCES = [
  { name: 'กรมที่ดิน (DOL)', url: 'https://www.dol.go.th' },
  { name: 'LandsMaps ค้นหาแปลงและโฉนด (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
  { name: 'สำนักงานการปฏิรูปที่ดินเพื่อเกษตรกรรม (ส.ป.ก.)', url: 'https://www.alro.go.th' },
  { name: 'ราคาประเมินที่ดิน (กรมธนารักษ์)', url: 'https://assessprice.treasury.go.th' },
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

export function LandTitleDeedTypes() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          เอกสารสิทธิ์ที่ดินมีกี่ประเภท?
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          โฉนด น.ส.3ก น.ส.3 ส.ป.ก. ภบท.5 — เทียบครบว่าแบบไหนซื้อขายได้ แบบไหนห้ามแตะ
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Thai Land Title Document Types — Which Ones Can Be Legally Traded
        </p>
      </header>

      <Section title="ทำไมต้องดูตัวครุฑ ก่อนดูราคา?">
        <p style={p}>
          ที่ดินแปลงสวย ราคาถูกกว่าตลาดครึ่งต่อครึ่ง — ฟังดูน่าคว้า
          แต่หลายเคสที่จบด้วยการเสียเงินฟรี เริ่มจากจุดเดียวกัน:
          ผู้ซื้อไม่ได้ดูว่าเอกสารที่ผู้ขายถืออยู่เป็นเอกสารประเภทไหน
        </p>
        <p style={p}>
          กระดาษที่หน้าตาคล้ายกัน ให้สิทธิต่างกันคนละโลก
          บางแบบคือกรรมสิทธิ์เต็ม ซื้อขายจำนองได้ทุกอย่าง
          บางแบบเป็นแค่สิทธิทำกินในที่ดินของรัฐ ซื้อขายไม่ได้เลย
          และบางแบบไม่ใช่เอกสารสิทธิ์ด้วยซ้ำ
          จุดสังเกตแรกที่ง่ายที่สุดคือ <strong>สีตราครุฑ</strong> ที่หัวเอกสาร —
          ครุฑแดง ครุฑเขียว ครุฑดำ บอกระดับสิทธิได้ทันทีตั้งแต่ยังไม่อ่านเนื้อใน
        </p>
        <figure style={{ margin: '14px 0 4px' }}>
          <img src="/article-images/land-title-deed-types-fig1.webp" alt="มือถือเอกสารสิทธิ์ที่ดินตรวจสอบตราครุฑที่สำนักงานที่ดิน"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            สีตราครุฑที่หัวเอกสารบอกระดับสิทธิได้ก่อนอ่านเนื้อใน — แดง เขียว ดำ ให้สิทธิไม่เท่ากัน
          </figcaption>
        </figure>
      </Section>

      <Section title="เทียบเอกสารสิทธิ์ทีละแบบ — สิทธิถึงไหน ซื้อขายได้ไหม">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          6 แบบที่เจอบ่อยที่สุดในตลาดซื้อขายที่ดิน เรียงจากสิทธิสูงสุดลงไป
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {DEEDS.map(d => (
            <div key={d.name} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{d.name}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: '#fff', background: d.color,
                  borderRadius: 999, padding: '2px 10px',
                }}>{d.garuda}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.cyan, marginBottom: 4 }}>{d.status}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55, marginBottom: 6 }}>{d.detail}</div>
              <div style={{ fontSize: 13.5, color: C.text }}>
                <span style={{ color: C.green, fontWeight: 700 }}>⟶ </span>{d.trade}
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 12 }}>
          หมายเหตุ: กรมที่ดินยังมีเอกสารเกี่ยวกับที่ดินอีกหลายแบบ (เช่น น.ค.3 ของนิคมสร้างตนเอง, ส.ท.ก. ของกรมป่าไม้)
          ส่วนใหญ่เป็นสิทธิทำกินในที่ดินของรัฐที่ซื้อขายทั่วไปไม่ได้ — เจอเอกสารที่ไม่รู้จัก ให้ถามสำนักงานที่ดินก่อนเสมอ
        </p>
      </Section>

      <Section title="สรุปสั้น: แบบไหนซื้อขาย โอน จำนองได้บ้าง?">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 480 }}>
            <thead>
              <tr>
                {['เอกสาร', 'ซื้อขาย/โอน', 'จำนองธนาคาร', 'ขอออกโฉนด'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px', color: C.cyan, fontWeight: 700,
                    borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['โฉนด (น.ส.4จ)', '✓ ได้เต็มที่', '✓ ได้', '— เป็นโฉนดอยู่แล้ว'],
                ['น.ส.3ก', '✓ ได้', '✓ ได้ (ธนาคารพิจารณา)', '✓ ยื่นขอได้'],
                ['น.ส.3 / น.ส.3ข', '✓ ได้ (ประกาศ 30 วัน)', 'บางธนาคารรับ', '✓ ยื่นขอได้ (ต้องรังวัด)'],
                ['ส.ป.ก.4-01', '✗ ห้ามซื้อขาย', '✗ (เว้นแหล่งทุนรัฐบางกรณี)', '✗ ได้เฉพาะโฉนดเพื่อการเกษตร'],
                ['ใบจอง (น.ส.2)', '✗ ห้ามโอน', '✗', 'ต้องทำประโยชน์ตามเงื่อนไขก่อน'],
                ['ภบท.5', '✗ จดทะเบียนไม่ได้', '✗', '✗ ไม่ใช่เอกสารสิทธิ์'],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: '10px 12px', borderBottom: `1px solid ${C.border}`,
                      color: j === 0 ? '#fff' : C.text, fontWeight: j === 0 ? 700 : 400, lineHeight: 1.5,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 10 }}>
          เงื่อนไขการรับจำนองขึ้นกับนโยบายของแต่ละธนาคาร — ตารางนี้เป็นภาพรวมเพื่อการเปรียบเทียบ
        </p>
      </Section>

      <Section title="ถือ น.ส.3ก อยู่ อัปเกรดเป็นโฉนดได้ไหม?">
        <p style={p}>
          ได้ — และควรทำ เพราะโฉนดทำให้สิทธิมั่นคงขึ้นและขายต่อได้ราคาดีกว่า
          เจ้าของ น.ส.3ก ยื่นคำขอออกโฉนดได้ที่สำนักงานที่ดินที่แปลงนั้นตั้งอยู่
          เจ้าหน้าที่จะนัดรังวัดตรวจสอบแนวเขต ประกาศ 30 วันเพื่อเปิดให้คัดค้าน แล้วจึงออกโฉนด
          มีค่ารังวัดและค่าธรรมเนียมตามขนาดแปลง — สอบถามอัตราจริงกับสำนักงานที่ดินท้องที่
        </p>
        <p style={p}>
          ส่วนที่ดิน ส.ป.ก.4-01 เป็นคนละเส้นทาง — เปลี่ยนเป็นโฉนดทั่วไปไม่ได้
          ทำได้เฉพาะ "โฉนดเพื่อการเกษตร" ซึ่งยังจำกัดการโอนอยู่
          อ่านเงื่อนไขละเอียดได้ที่บทความ{' '}
          <a href="/articles/spk-to-title-deed" style={{ color: C.cyan }}>
            เปลี่ยน ส.ป.ก. เป็นโฉนดได้ไหม
          </a>
        </p>
      </Section>

      <Section title="เช็คเอกสารจริงยังไง ไม่ให้โดนหลอก?">
        <ol style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', display: 'grid', gap: 10 }}>
          {[
            { n: 1, t: 'ดูตัวจริง ไม่ดูสำเนา', d: 'ขอดูเอกสารฉบับจริงจากผู้ขาย สังเกตตราครุฑ ลายน้ำ เนื้อกระดาษ และรอยแก้ไขผิดปกติ' },
            { n: 2, t: 'เช็คกับ LandsMaps', d: 'กรอกเลขโฉนด/ตำแหน่งแปลงใน landsmaps.dol.go.th เทียบรูปแปลง เนื้อที่ และที่ตั้งว่าตรงกับเอกสารไหม' },
            { n: 3, t: 'ตรวจที่สำนักงานที่ดิน', d: 'ก่อนวางมัดจำ ให้ตรวจสารบบที่สำนักงานที่ดินท้องที่ — ชื่อผู้ถือสิทธิปัจจุบัน ภาระผูกพัน การอายัด ครบในจุดเดียว' },
            { n: 4, t: 'ลงพื้นที่ดูแปลงจริง', d: 'เทียบสภาพจริงกับรูปแปลงในระวาง ดูหลักหมุด แนวเขต และทางเข้าออกด้วยตาตัวเอง' },
          ].map(s => (
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
        <figure style={{ margin: '14px 0 4px' }}>
          <img src="/article-images/land-title-deed-types-fig2.webp" alt="ลงพื้นที่ตรวจหลักหมุดและแนวเขตแปลงที่ดินจริงก่อนตัดสินใจซื้อ"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            เอกสารตรงกับสารบบแล้ว ยังต้องลงพื้นที่เทียบหลักหมุดและแนวเขตกับสภาพจริงอีกชั้น
          </figcaption>
        </figure>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 10 }}>
          เอกสารเป็นแค่ด่านแรก — ก่อนวางเงินยังมีอีกหลายจุดที่ต้องเช็ค ดูเช็คลิสต์เต็มที่{' '}
          <a href="/articles/check-land-before-buying" style={{ color: C.cyan }}>
            ซื้อที่ดินต้องตรวจอะไรบ้าง ก่อนวางมัดจำ
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
        ⚠ <strong>ข้อควรระวัง:</strong> บทความนี้สรุปภาพรวมเพื่อความเข้าใจเบื้องต้น
        สถานะทางกฎหมายของที่ดินแต่ละแปลงต้องตรวจสอบเป็นรายกรณีกับสำนักงานที่ดินท้องที่
        และเงื่อนไขของ ส.ป.ก. อาจเปลี่ยนตามระเบียบล่าสุด ก่อนทำธุรกรรมมูลค่าสูง
        ควรปรึกษานักกฎหมายหรือเจ้าหน้าที่สำนักงานที่ดินโดยตรง
      </p>

      <Section title="สรุปก่อนตัดสินใจ">
        <p style={p}>
          ก่อนคุยราคา ให้ตอบ 3 ข้อนี้ให้ได้ก่อน:
          เอกสารที่ผู้ขายถือคือประเภทไหน (ดูตัวครุฑ) —
          เอกสารนั้นจดทะเบียนซื้อขายได้จริงไหม (โฉนด/น.ส.3ก/น.ส.3 ได้, ส.ป.ก./ใบจอง/ภบท.5 ไม่ได้) —
          และข้อมูลในเอกสารตรงกับสารบบที่ดินกับสภาพแปลงจริงหรือเปล่า
          ผ่านครบ 3 ข้อ ค่อยเริ่มต่อรองราคา
        </p>
      </Section>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub ดูตำแหน่งแปลงจริง
        </a>
      </div>
    </article>
  );
}

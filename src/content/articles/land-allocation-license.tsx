// ════════════════════════════════════════
// src/content/articles/land-allocation-license.tsx
// บทความ: ขออนุญาตจัดสรรที่ดิน — แบ่งกี่แปลงต้องขอใบอนุญาต
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-allocation-license',
  title:       'ขออนุญาตจัดสรรที่ดิน — แบ่งกี่แปลงต้องขอใบอนุญาต ขั้นตอน ค่าธรรมเนียม',
  description: 'แบ่งที่ดินขายตั้งแต่ 10 แปลงต้องขอใบอนุญาตจัดสรร ฝ่าฝืนมีโทษจำคุก บทความนี้พาเช็กเกณฑ์เข้าข่าย เอกสาร ม.23 ขั้นตอน 45 วัน ค่าธรรมเนียม และกฎหมายใหม่ปี 2569',
  excerpt:     'แบ่งที่ดินขายกี่แปลงถึงต้องขอใบอนุญาตจัดสรร? เช็กเกณฑ์ 10 แปลง/3 ปี ขั้นตอนยื่นคำขอ เอกสาร ค่าธรรมเนียม และกฎหมายจัดสรรฉบับใหม่ที่มีผลปี 2569 ก่อนเริ่มโครงการ',
  date:        '2026-06-06',
  tags:        ['จัดสรรที่ดิน', 'แบ่งแปลงที่ดิน', 'ใบอนุญาตจัดสรร', 'กฎหมายที่ดิน'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/land-allocation-license.webp',
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
  { n: 1, t: 'ยื่นคำขอที่สำนักงานที่ดิน', d: 'ยื่นคำขอพร้อมเอกสารต่อเจ้าพนักงานที่ดินจังหวัดหรือสาขาที่ที่ดินตั้งอยู่ (กรุงเทพฯ ยื่นที่สำนักงานที่ดินกรุงเทพมหานคร)' },
  { n: 2, t: 'เจ้าหน้าที่ตรวจเอกสารและแผนผัง', d: 'ตรวจความครบถ้วนของเอกสาร แผนผังแบ่งแปลง และระบบสาธารณูปโภค แล้วส่งต่อหน่วยงานที่เกี่ยวข้อง' },
  { n: 3, t: 'ลงพื้นที่ตรวจสภาพจริง', d: 'เจ้าหน้าที่ออกตรวจสภาพที่ดินจริง และประเมินมูลค่างานก่อสร้างสาธารณูปโภค' },
  { n: 4, t: 'เข้าที่ประชุมคณะกรรมการ', d: 'จัดทำวาระเสนอคณะกรรมการจัดสรรที่ดินจังหวัดพิจารณาและลงมติ ว่าอนุญาตได้หรือไม่' },
  { n: 5, t: 'วางหลักประกัน + รับใบอนุญาต', d: 'หากสาธารณูปโภคยังไม่เสร็จ ต้องมีสัญญาค้ำประกันกับสถาบันการเงิน จากนั้นชำระค่าธรรมเนียมและรับใบอนุญาต' },
];

const DOCS = [
  'เอกสารสิทธิในที่ดิน (โฉนดตัวจริง)',
  'บัตรประชาชน + ทะเบียนบ้าน (หรือหนังสือรับรองนิติบุคคล)',
  'แผนผังการแบ่งแปลง และแผนผังระบบสาธารณูปโภค (ถนน ไฟฟ้า ประปา ระบบระบายน้ำ)',
  'รายละเอียดโครงการและวิธีการจัดสรร พร้อมประมาณการค่าก่อสร้าง',
  'หนังสืออนุญาตเชื่อมทาง และหนังสือรับรองจากการไฟฟ้า/การประปา',
  'แบบสัญญาจะซื้อจะขาย และรายงาน EIA (หากโครงการเข้าเกณฑ์)',
];

const FEES = [
  { type: 'จัดสรรเพื่อที่อยู่อาศัย / พาณิชยกรรม / อุตสาหกรรม', rate: 'ไร่ละ 250 บาท' },
  { type: 'จัดสรรเพื่อเกษตรกรรม', rate: 'ไร่ละ 100 บาท' },
  { type: 'โอนใบอนุญาตจัดสรร', rate: 'รายละ 3,000 บาท' },
];

export const FAQ = [
  { q: 'แบ่งที่ดินขาย 9 แปลง ต้องขอใบอนุญาตจัดสรรไหม?', a: 'ไม่ต้อง ถ้าแบ่งไม่ถึง 10 แปลง แต่มีกับดักอยู่ — ถ้าภายใน 3 ปีคุณแบ่งเพิ่มจนยอดรวมถึง 10 แปลงเมื่อไหร่ ที่ดินแปลงเดิมจะเข้าข่ายจัดสรรทันที และต้องขอใบอนุญาตให้ถูกต้อง' },
  { q: 'ขายที่ดินเองไม่กี่แปลง เลี่ยงขอใบอนุญาตได้ไหม?', a: 'ถ้าเข้าเกณฑ์จัดสรรแล้วไม่ขอ ถือว่าผิดมาตรา 21 มีโทษตามมาตรา 59 จำคุกไม่เกิน 2 ปี และปรับ 40,000–100,000 บาท การแบ่งให้พอดี 9 แปลงโดยไม่มีเจตนาเลี่ยงเป็นเรื่องทำได้ แต่การจงใจซอยโครงการเพื่อหนีกฎหมายมีความเสี่ยง' },
  { q: 'ขอใบอนุญาตจัดสรรใช้เวลานานแค่ไหน?', a: 'กฎหมายกำหนดให้คณะกรรมการพิจารณาแผนผังและโครงการให้เสร็จภายใน 45 วันนับแต่ได้รับคำขอที่ถูกต้องครบถ้วน แต่ในทางปฏิบัติเวลารวมอาจมากกว่านั้น ขึ้นกับความครบของเอกสารและรอบประชุมคณะกรรมการ' },
  { q: 'ค่าธรรมเนียมใบอนุญาตจัดสรรเท่าไหร่?', a: 'คิดตามเนื้อที่ โครงการที่อยู่อาศัย/พาณิชย์/อุตสาหกรรม ไร่ละ 250 บาท ส่วนเกษตรกรรม ไร่ละ 100 บาท (เศษของไร่คิดเป็นหนึ่งไร่) ตามกฎกระทรวงกำหนดค่าธรรมเนียมฯ พ.ศ. 2544' },
];

const SOURCES = [
  { name: 'พ.ร.บ.การจัดสรรที่ดิน พ.ศ. 2543 (กรมที่ดิน)', url: 'https://www.dol.go.th/Documents/law/law6202.pdf' },
  { name: 'หมวด 2 การขออนุญาตจัดสรรที่ดิน มาตรา 21–30', url: 'https://www.drthawip.com/landlaw/058' },
  { name: 'กฎหมายจัดสรรที่ดินฉบับที่ 3 มีผล 1 มี.ค. 2569 (กรมประชาสัมพันธ์)', url: 'https://www.prd.go.th/th/content/category/detail/id/33/iid/481003' },
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

export function LandAllocationLicense() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ขออนุญาตจัดสรรที่ดิน — แบ่งกี่แปลงถึงต้องขอใบอนุญาต
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          เช็กเกณฑ์ให้ชัดก่อนซอยแปลงขาย เลี่ยงโทษจำคุก
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Land Allocation License — Rules, Steps &amp; Fees
        </p>
      </header>

      <Section title="ซอยที่ดินขายผิดจังหวะ เจอโทษอาญาได้">
        <p style={p}>
          คุณซื้อที่ดินผืนใหญ่มาแบ่งขายเป็นแปลงเล็ก ฟังดูเป็นธุรกิจที่ตรงไปตรงมา
          แต่พอแบ่งถึงจำนวนหนึ่ง กฎหมายมองว่าคุณกำลัง <strong>“จัดสรรที่ดิน”</strong>{' '}
          ซึ่งต้องขอใบอนุญาตก่อนเริ่มขาย
        </p>
        <p style={p}>
          แบ่งขายโดยไม่ขอใบอนุญาตทั้งที่เข้าเกณฑ์ ไม่ใช่แค่ถูกปรับ — มีโทษ <strong>จำคุก</strong> ติดตัวด้วย
          คำถามสำคัญจึงไม่ใช่ “จัดสรรยุ่งยากไหม” แต่เป็น <strong>“แบ่งกี่แปลงถึงเข้าข่าย”</strong> และคุณข้ามเส้นนั้นไปแล้วหรือยัง
        </p>
      </Section>

      <Section title="แบ่งกี่แปลงถึงเรียกว่า “จัดสรรที่ดิน”?">
        <p style={p}>
          พระราชบัญญัติการจัดสรรที่ดิน พ.ศ. 2543 มาตรา 4 วางเส้นไว้ชัด —
          แบ่งที่ดินเป็นแปลงย่อยเพื่อ “จำหน่าย” <strong>ตั้งแต่ 10 แปลงขึ้นไป</strong> ถือว่าเป็นการจัดสรร
        </p>
        <div style={{ display: 'grid', gap: 10, margin: '4px 0 12px' }}>
          {[
            { k: 'ไม่เข้าข่าย', v: 'แบ่งขายไม่เกิน 9 แปลง และไม่ได้แบ่งเพิ่มอีกภายใน 3 ปี', tone: C.green },
            { k: 'เข้าข่ายจัดสรร', v: 'แบ่งขายตั้งแต่ 10 แปลงขึ้นไป — ต้องขอใบอนุญาตก่อนขาย', tone: C.cyan },
            { k: 'กับดัก 3 ปี', v: 'แบ่งไม่ถึง 10 แปลงก่อน แต่แบ่งเพิ่มภายใน 3 ปีจนยอดรวมถึง 10 แปลง = เข้าข่ายย้อนหลัง', tone: '#ffb300' },
          ].map(r => (
            <div key={r.k} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr', gap: 14, alignItems: 'center',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px',
            }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: r.tone }}>{r.k}</span>
              <span style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>{r.v}</span>
            </div>
          ))}
        </div>
        <p style={p}>
          มาตรา 21 ห้ามทำการจัดสรรที่ดินเว้นแต่ได้รับอนุญาตจากคณะกรรมการ พูดง่าย ๆ คือ
          เข้าเกณฑ์เมื่อไหร่ ต้องขออนุญาต <strong>ก่อน</strong> ลงมือขาย ไม่ใช่ขายไปก่อนแล้วค่อยขอ
        </p>
      </Section>

      <Section title="ไม่ขอใบอนุญาต เสี่ยงอะไรบ้าง?">
        <p style={p}>
          จัดสรรที่ดินโดยไม่ได้รับอนุญาต ผิดมาตรา 21 และมีโทษตาม <strong>มาตรา 59</strong>:
        </p>
        <div style={{
          background: 'rgba(235,87,87,0.08)', border: '1px solid rgba(235,87,87,0.3)',
          borderRadius: 10, padding: '14px 16px', margin: '4px 0 10px',
        }}>
          <div style={{ fontWeight: 800, color: '#ff6b6b', fontSize: 16, marginBottom: 4 }}>
            จำคุกไม่เกิน 2 ปี + ปรับ 40,000–100,000 บาท
          </div>
          <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.55 }}>
            นอกจากโทษอาญา ผู้ซื้อยังไม่ได้รับความคุ้มครองตามกฎหมายจัดสรร เช่น การโอนสาธารณูปโภคและการดูแลส่วนกลาง ทำให้โครงการขายยากและเสียความน่าเชื่อถือ
          </div>
        </div>
      </Section>

      <Section title="เอกสารที่ต้องเตรียม (ตามมาตรา 23)">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          รายการหลักที่ต้องยื่นพร้อมคำขอ — รายละเอียดปลีกย่อยมีกำหนดเพิ่มในกฎกระทรวงและประกาศคณะกรรมการ
        </p>
        <figure style={{ margin: '12px 0 16px' }}>
          <img src="/article-images/land-allocation-license-fig1.webp"
            alt="เอกสารขออนุญาตจัดสรรที่ดิน 6 รายการ — โฉนดที่ดิน บัตรประชาชน ทะเบียนบ้าน แผนผังแบ่งแปลง รายละเอียดโครงการ หนังสือเชื่อมทาง และแบบสัญญาจะซื้อจะขาย"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            เอกสารหลักที่ต้องยื่นตามมาตรา 23 — รายละเอียดแต่ละรายการด้านล่าง
          </figcaption>
        </figure>
        <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {DOCS.map(d => (
            <li key={d} style={{ display: 'flex', gap: 10, fontSize: 14.5, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 10 }}>
          รายการนี้เป็นแนวทางหลัก ไม่ใช่รายการครบทุกข้อตามมาตรา 23 — ก่อนยื่นจริงควรขอแบบฟอร์มและเช็กลิสต์ฉบับปัจจุบันจากสำนักงานที่ดินที่ที่ดินตั้งอยู่
        </p>
      </Section>

      <Section title="ขั้นตอนขอใบอนุญาต 5 ขั้น">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          กฎหมายกำหนดให้คณะกรรมการพิจารณาแผนผังและโครงการให้เสร็จภายใน 45 วัน นับแต่ได้รับคำขอที่ถูกต้องครบถ้วน (มาตรา 25)
        </p>
        <figure style={{ margin: '12px 0 16px' }}>
          <img src="/article-images/land-allocation-license-fig2.webp"
            alt="ขั้นตอนขออนุญาตจัดสรรที่ดิน 5 ขั้น — ยื่นคำขอที่สำนักงานที่ดิน ตรวจเอกสารและแผนผัง ลงพื้นที่ตรวจสภาพจริง เข้าที่ประชุมคณะกรรมการ และวางหลักประกันรับใบอนุญาต"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ภาพรวม 5 ขั้นตอนขออนุญาตจัดสรรที่ดิน — กฎหมายกำหนดพิจารณาให้เสร็จภายใน 45 วัน
          </figcaption>
        </figure>
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

      <Section title="ค่าธรรมเนียมใบอนุญาตจัดสรร">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          คิดตามเนื้อที่โครงการ — เศษของไร่คิดเป็นหนึ่งไร่ (กฎกระทรวงกำหนดค่าธรรมเนียมฯ พ.ศ. 2544)
        </p>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {FEES.map(f => (
            <div key={f.type} style={{
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'center',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px',
            }}>
              <span style={{ fontSize: 14.5, color: C.text, lineHeight: 1.5 }}>{f.type}</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: C.green, whiteSpace: 'nowrap' }}>{f.rate}</span>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 10 }}>
          ค่าธรรมเนียมนี้เป็นค่าออกใบอนุญาต ยังไม่รวมต้นทุนงานก่อสร้างถนน ไฟฟ้า ประปา ระบบระบายน้ำ และการวางหลักประกันสาธารณูปโภค ซึ่งเป็นค่าใช้จ่ายหลักของโครงการจริง
        </p>
      </Section>

      <Section title="มาตรฐานโครงการ — ทำไมแต่ละจังหวัดไม่เท่ากัน">
        <p style={p}>
          หลายคนถามหา “ตัวเลขกลาง” ของความกว้างถนน ขนาดแปลงขั้นต่ำ หรือสัดส่วนพื้นที่ส่วนกลาง
          แต่ตัวเลขพวกนี้ <strong>ไม่ได้อยู่ในตัว พ.ร.บ.</strong> โดยตรง
        </p>
        <p style={p}>
          มาตรฐานทางกายภาพอยู่ใน <strong>ข้อกำหนดเกี่ยวกับการจัดสรรที่ดินของแต่ละจังหวัด</strong>{' '}
          ที่คณะกรรมการจัดสรรที่ดินจังหวัดออกตามนโยบายของคณะกรรมการจัดสรรที่ดินกลาง จึง
          แตกต่างกันได้ตามพื้นที่และประเภทโครงการ แนวทางที่พบบ่อย เช่น:
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ความกว้างเขตทาง (ถนนในโครงการ) เพิ่มขึ้นตามจำนวนแปลง — ยิ่งแปลงเยอะ ถนนยิ่งต้องกว้าง',
            'ขนาดแปลงย่อยขั้นต่ำต่างกันตามประเภทบ้าน (บ้านเดี่ยว / บ้านแฝด / ทาวน์เฮาส์)',
            'ต้องกันพื้นที่ส่วนกลาง เช่น สวนหรือสนามเด็กเล่น ตามสัดส่วนที่ข้อกำหนดระบุ',
            'ต้องจัดระบบสาธารณูปโภคให้ครบ ทั้งถนน ไฟฟ้า ประปา และระบบระบายน้ำ',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 14.5, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.cyan, fontWeight: 700, flexShrink: 0 }}>•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 10 }}>
          ก่อนวางผังโครงการ ให้ยึด “ข้อกำหนดการจัดสรรที่ดิน” ฉบับล่าสุดของจังหวัดที่ที่ดินตั้งอยู่เป็นหลัก อย่าอ้างอิงตัวเลขจากจังหวัดอื่นหรือบทความทั่วไป
        </p>
      </Section>

      <Section title="กฎหมายจัดสรรฉบับใหม่ — มีผล 1 มีนาคม 2569">
        <p style={p}>
          พระราชบัญญัติการจัดสรรที่ดิน (ฉบับที่ 3) พ.ศ. 2568 มีผลบังคับใช้ <strong>1 มีนาคม 2569</strong>{' '}
          ยกระดับการคุ้มครองผู้ซื้อและการดูแลส่วนกลางหมู่บ้านจัดสรร จุดที่ผู้จัดสรรต้องรู้:
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ผู้จัดสรรต้องทำสัญญาค้ำประกัน “การบำรุงรักษา” สาธารณูปโภคกับสถาบันการเงิน และรักษามาตรฐานไม่ให้ทรุดโทรมลงจากเดิม',
            'ผู้ซื้อตั้งแต่กึ่งหนึ่งขึ้นไป ยื่นจัดตั้งนิติบุคคลหมู่บ้านจัดสรรได้เอง หากผู้จัดสรรเพิกเฉยไม่ทำหน้าที่',
            'เพิ่มโทษปรับ 50,000–100,000 บาท พร้อมโทษปรับรายวัน',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 14.5, lineHeight: 1.55, color: C.text }}>
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
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          อยากเข้าใจความต่างของ “แบ่งแปลง” กับ “จัดสรร” ให้ชัดขึ้น อ่านต่อ{' '}
          <a href="/articles/land-subdivision-vs-allocation" style={{ color: C.cyan }}>
            “แบ่งแปลง” vs “จัดสรรที่ดิน” ต่างกันยังไง
          </a>
        </p>
      </Section>

      <p style={{
        fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginTop: 28,
        padding: '14px 16px', background: 'rgba(255,179,0,0.06)',
        border: '1px solid rgba(255,179,0,0.25)', borderRadius: 10,
      }}>
        ⚠ <strong>ข้อควรระวัง:</strong> บทความนี้เป็นข้อมูลเบื้องต้น ตัวเลขเรื่องถนน ขนาดแปลง พื้นที่ส่วนกลาง
        และค่าธรรมเนียมอาจเปลี่ยนตามประกาศและข้อกำหนดของแต่ละจังหวัด ก่อนเริ่มโครงการจริง
        ควรตรวจสอบกับสำนักงานที่ดินในพื้นที่และปรึกษานักกฎหมายเพื่อความถูกต้อง
      </p>

      <p style={{ ...p, marginTop: 18, fontWeight: 600, color: C.text }}>
        สรุปก่อนลงมือ: เช็กให้ชัดว่าโครงการของคุณแตะ 10 แปลงหรือยัง (รวมการแบ่งเพิ่มภายใน 3 ปี)
        ถ้าเข้าเกณฑ์ ให้ขอใบอนุญาตก่อนเริ่มขายเสมอ เตรียมเอกสารตามมาตรา 23 ให้ครบ
        และยึดข้อกำหนดของจังหวัดที่ที่ดินตั้งอยู่เป็นหลัก
      </p>

      <div style={{ marginTop: 22, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub วางผังแบ่งแปลงที่ดิน
        </a>
      </div>
    </article>
  );
}

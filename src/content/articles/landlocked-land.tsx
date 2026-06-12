// ════════════════════════════════════════
// src/content/articles/landlocked-land.tsx
// บทความ: ที่ดินตาบอดคืออะไร ซื้อได้ไหม (ทางจำเป็น vs ภาระจำยอม)
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'landlocked-land',
  title:       'ที่ดินตาบอดคืออะไร ซื้อได้ไหม — สิทธิขอทางจำเป็น vs ภาระจำยอม ก่อนตัดสินใจ',
  description: 'ที่ดินตาบอดไม่มีทางออกสู่ทางสาธารณะ ซื้อได้ไหม เสี่ยงแค่ไหน เข้าใจสิทธิขอทางจำเป็น (ม.1349-1350) ต่างกับภาระจำยอมอย่างไร พร้อมเช็กลิสต์ก่อนวางมัดจำ',
  excerpt:     'ที่ดินถูกกว่าตลาดครึ่งราคา อาจเป็น "ที่ดินตาบอด" — เข้าใจสิทธิขอทางจำเป็นตามกฎหมาย ความต่างกับภาระจำยอม และ 5 สิ่งที่ต้องเช็กก่อนตัดสินใจซื้อ',
  date:        '2026-06-13',
  tags:        ['ที่ดินตาบอด', 'ทางจำเป็น', 'ภาระจำยอม', 'ซื้อที่ดิน'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/landlocked-land.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const RISKS = [
  { t: 'เข้าที่ดินตัวเองไม่ได้', d: 'ไม่มีทางเข้าออกตามกฎหมาย — จะเดินผ่านที่ดินคนอื่นโดยไม่ได้รับอนุญาต ก็เสี่ยงถูกฟ้องบุกรุก' },
  { t: 'ขออนุญาตก่อสร้างยาก', d: 'การขออนุญาตปลูกสร้างอาคารต้องแสดงทางเข้าออกของแปลง — ไม่มีทางเข้าออก เรื่องมักไม่ผ่าน' },
  { t: 'ธนาคารมักไม่รับจำนอง', d: 'สถาบันการเงินส่วนใหญ่ปฏิเสธหรือตีมูลค่าหลักประกันต่ำมาก เพราะขายทอดตลาดต่อยาก' },
  { t: 'ขายต่อยาก ราคากดตลอด', d: 'ผู้ซื้อรายถัดไปก็เจอปัญหาเดียวกัน — สภาพคล่องต่ำ ต่อรองราคาได้ลึก' },
];

const STEPS = [
  { n: 1, t: 'เจรจากับเจ้าของแปลงที่ล้อม', d: 'เลือกแนวทางผ่านที่สั้นและกระทบแปลงเขาน้อยที่สุด — กฎหมายก็บังคับให้เลือกแบบนี้อยู่แล้ว เจรจาจึงง่ายขึ้น' },
  { n: 2, t: 'ตกลงค่าทดแทนเป็นลายลักษณ์อักษร', d: 'จ่ายเป็นเงินก้อนหรือรายปีก็ได้ตามที่ตกลงกัน — ระบุแนวทาง ความกว้าง และค่าทดแทนให้ชัดในหนังสือ' },
  { n: 3, t: 'ตกลงไม่ได้ → ฟ้องศาลขอเปิดทางจำเป็น', d: 'สิทธิตามมาตรา 1349 มีอยู่โดยผลของกฎหมาย ศาลจะกำหนดแนวทางและค่าทดแทนให้ — แต่มีต้นทุนเวลาและค่าใช้จ่ายคดี' },
];

const COMPARE = [
  { k: 'เกิดขึ้นได้อย่างไร', n: 'โดยผลของกฎหมายทันทีที่ที่ดินถูกล้อม (ม.1349)', s: 'ตกลงกัน + จดทะเบียน (ม.1387) หรือใช้ทางครบ 10 ปี (ม.1401)' },
  { k: 'ที่ดินต้องตาบอดไหม', n: 'ต้องไม่มีทางออกสู่ทางสาธารณะ', s: 'ไม่จำเป็น — มีทางออกอยู่แล้วก็ตกลงทำภาระจำยอมเพิ่มได้' },
  { k: 'ต้องจดทะเบียนไหม', n: 'ไม่ต้อง — อ้างสิทธิได้เลย ใช้ยันบุคคลทั่วไปได้', s: 'นิติกรรมต้องทำหนังสือ + จดทะเบียน จึงบริบูรณ์เป็นทรัพยสิทธิ (ม.1299)' },
  { k: 'ต้องจ่ายเงินไหม', n: 'ต้องจ่ายค่าทดแทน (ยกเว้นตาบอดเพราะแบ่งแปลง — ม.1350)', s: 'แล้วแต่ตกลง — ให้ฟรีหรือมีค่าตอบแทนก็ได้' },
  { k: 'สิ้นสุดเมื่อไหร่', n: 'หมดความจำเป็น (เช่น มีทางออกใหม่) สิทธิก็สิ้นไป', s: 'ไม่ได้ใช้ติดต่อกัน 10 ปี ย่อมสิ้นไป (ม.1399)' },
];

const CHECKLIST = [
  { n: 1, t: 'กางแผนที่ดูแปลงรอบทุกด้าน', d: 'เปิด LandsMaps หรือ TNR MapHub ดูว่าแปลงถูกล้อมด้วยแปลงไหนบ้าง แปลงไหนติดทางสาธารณะ — แนวขอทางที่เป็นไปได้อยู่ตรงไหน' },
  { n: 2, t: 'พลิกดูสารบัญจดทะเบียนหลังโฉนด', d: 'เช็กว่ามีภาระจำยอมจดทะเบียนไว้แล้วหรือไม่ — ถ้ามีทางจดทะเบียนพร้อมใช้ ความเสี่ยงลดลงมาก' },
  { n: 3, t: 'คุยกับเจ้าของแปลงที่ล้อมก่อนวางมัดจำ', d: 'หยั่งท่าทีว่ายอมให้ผ่านไหม ค่าทดแทนประมาณเท่าไร — รู้คำตอบก่อนจ่ายเงิน ดีกว่าไปลุ้นทีหลัง' },
  { n: 4, t: 'คิดต้นทุนแฝงให้ครบ', d: 'ค่าทดแทนทางจำเป็นหรือค่าตอบแทนภาระจำยอม + ค่าทำถนน + ค่ารังวัด/จดทะเบียน + เผื่อค่าใช้จ่ายคดีถ้าต้องฟ้อง' },
  { n: 5, t: 'ต่อรองราคาให้สะท้อนความเสี่ยง', d: 'ราคาที่คุ้มต้องเผื่อทั้งต้นทุนแฝงและเวลาที่เสียไป — ถ้าราคาลดไม่พอชดเชย เดินออกได้เสมอ' },
];

export const FAQ = [
  { q: 'ที่ดินตาบอดซื้อขายได้ไหม?', a: 'ซื้อขายโอนกรรมสิทธิ์ได้ตามปกติ กฎหมายไม่ได้ห้าม — สิ่งที่ขาดคือทางเข้าออก ผู้ซื้อจึงต้องวางแผนเรื่องทางจำเป็นหรือภาระจำยอมก่อนตัดสินใจ และตีราคาให้สะท้อนความเสี่ยงนี้' },
  { q: 'ขอทางจำเป็นต้องจ่ายเงินไหม?', a: 'ต้องจ่ายค่าทดแทนให้เจ้าของที่ดินที่ถูกผ่านตามมาตรา 1349 จะตกลงเป็นเงินก้อนหรือรายปีก็ได้ ยกเว้นกรณีที่ดินตาบอดเพราะการแบ่งแยกหรือแบ่งโอนแปลงเดียวกัน (มาตรา 1350) ขอผ่านแปลงที่แบ่งกันมาได้โดยไม่ต้องจ่ายค่าทดแทน' },
  { q: 'ทางจำเป็นกว้างเท่าไร?', a: 'กฎหมายไม่ได้กำหนดตัวเลขตายตัว — มาตรา 1349 ให้เลือกที่และวิธีทำทาง "พอควรแก่ความจำเป็น" โดยให้แปลงที่ถูกผ่านเสียหายน้อยที่สุด แนวคำพิพากษายอมรับการใช้รถยนต์ผ่านได้ตามความจำเป็นจริงของยุคปัจจุบัน ศาลเป็นผู้กำหนดเป็นรายกรณี' },
  { q: 'ใช้ทางผ่านที่ดินคนอื่นมาเกิน 10 ปี ได้ภาระจำยอมอัตโนมัติไหม?', a: 'ไม่อัตโนมัติ — ต้องเป็นการใช้โดยสงบ เปิดเผย และด้วยเจตนาจะได้สิทธิ ติดต่อกันครบ 10 ปี (มาตรา 1401) ถ้าใช้แบบขออนุญาตหรือถือวิสาสะกันในเครือญาติ ใช้นานแค่ไหนก็ไม่ได้ภาระจำยอม และแม้เข้าเกณฑ์ก็ควรฟ้องขอให้ศาลสั่งและจดทะเบียนให้เรียบร้อย' },
  { q: 'ธนาคารรับจำนองที่ดินตาบอดไหม?', a: 'ส่วนใหญ่ไม่รับ หรือตีมูลค่าหลักประกันต่ำกว่าปกติมาก เพราะขายทอดตลาดต่อยาก — ถ้ามีภาระจำยอมทางเข้าออกจดทะเบียนติดโฉนดแล้ว โอกาสผ่านการพิจารณาจะดีขึ้น' },
];

const SOURCES = [
  { name: 'กรมที่ดิน — ความรู้เรื่องทางจำเป็น', url: 'https://www.dol.go.th' },
  { name: 'LandsMaps ค้นหาแปลงและโฉนด (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
  { name: 'สำนักงานกิจการยุติธรรม — คำนี้ในกฎหมาย: ทางจำเป็น', url: 'https://justicechannel.org/read/law-vocabulary-public-way' },
  { name: 'DDproperty — ที่ดินตาบอดกับทางจำเป็น มาตรา 1349', url: 'https://www.ddproperty.com' },
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

export function LandlockedLand() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ที่ดินตาบอดคืออะไร ซื้อได้ไหม
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          เข้าใจสิทธิขอทางจำเป็น vs ภาระจำยอม ก่อนตัดสินใจซื้อที่ดินไม่มีทางออก
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Landlocked Land in Thailand — Necessity Passage vs Servitude Explained
        </p>
      </header>

      <Section title="ที่ดินถูกกว่าตลาดครึ่งราคา — ของดีหรือกับดัก?">
        <p style={p}>
          เจอประกาศขายที่ดินทำเลไม่เลว แต่ราคาต่ำกว่าแปลงข้างเคียงเกือบครึ่ง อย่าเพิ่งรีบวางมัดจำ —
          เปิดแผนที่ดูก่อนว่าแปลงนั้น <strong>มีทางออกสู่ถนนสาธารณะหรือเปล่า</strong>
          เพราะสาเหตุยอดฮิตที่ทำให้ที่ดินถูกผิดปกติ คือมันเป็น <strong>"ที่ดินตาบอด"</strong>
        </p>
        <p style={p}>
          ข่าวดีคือ กฎหมายไม่ได้ทิ้งให้เจ้าของที่ดินตาบอดติดอยู่ในแปลงตัวเอง —
          มีสิทธิที่เรียกว่า <strong>"ทางจำเป็น"</strong> รออยู่ แต่สิทธินั้นมีเงื่อนไข มีต้นทุน
          และไม่เหมือนกับ "ภาระจำยอม" ที่คนมักเข้าใจสับสนกัน บทความนี้จะพาแยกให้ขาดทีละเรื่อง
        </p>
      </Section>

      <Section title="ที่ดินตาบอดคือแบบไหน?">
        <p style={p}>
          ที่ดินตาบอด คือ ที่ดินที่ถูกแปลงอื่นล้อมรอบจน <strong>ไม่มีทางออกถึงทางสาธารณะ</strong> —
          จะเข้าจะออกต้องผ่านที่ดินของคนอื่นเท่านั้น และกฎหมาย (ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 1349)
          ยังนับรวมกรณีที่ "มีทางออกอยู่ แต่ใช้จริงไม่ได้" ด้วย ได้แก่
        </p>
        <ul style={{ margin: '0 0 10px', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ถูกแปลงอื่นล้อมรอบทุกด้าน ไม่ติดทางสาธารณะเลย',
            'มีทางออก แต่ต้องข้ามสระ บึง หรือทะเล',
            'มีทางออก แต่ระดับที่ดินกับทางสาธารณะชันต่างกันมากจนใช้ไม่ได้จริง',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          วิธีเช็กเร็วที่สุด: เปิดแผนที่แปลงที่ดิน ดูว่าขอบเขตแปลงด้านไหนติดถนนหรือทางสาธารณะบ้าง —
          ถ้าทุกด้านชนแต่แปลงเอกชน นั่นแหละสัญญาณตาบอด
        </p>
      </Section>

      <Section title="ทำไมที่ดินตาบอดถึงถูก — และเสี่ยงตรงไหน?">
        <figure style={{ margin: '0 0 16px' }}>
          <img src="/article-images/landlocked-land-fig1.webp" alt="มุมโดรนที่ดินตาบอดในชนบทไทย ถูกแปลงข้างเคียงล้อมรอบทุกด้าน เห็นถนนสาธารณะอยู่ไกลออกไปแต่ไม่มีทางเชื่อมถึง"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            แปลงในที่ถูกล้อมทุกด้าน — เห็นถนนอยู่ลิบ ๆ แต่เข้าไม่ถึง คือสภาพจริงของที่ดินตาบอด
          </figcaption>
        </figure>
        <div style={{ display: 'grid', gap: 10 }}>
          {RISKS.map(r => (
            <div key={r.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{r.t}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>{r.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ซื้อได้ไหม? ได้ — เพราะกฎหมายให้สิทธิขอ &quot;ทางจำเป็น&quot;">
        <p style={p}>
          ที่ดินตาบอด <strong>ซื้อขายโอนกรรมสิทธิ์ได้ตามปกติ</strong> กฎหมายไม่ได้ห้าม
          และเจ้าของที่ดินตาบอด (รวมถึงคุณที่ซื้อต่อมา) มีสิทธิตามมาตรา 1349
          ขอผ่านที่ดินแปลงที่ล้อมอยู่ออกไปสู่ทางสาธารณะได้ เรียกว่า <strong>ทางจำเป็น</strong> —
          สิทธินี้เกิดโดยผลของกฎหมายทันทีที่ที่ดินตกอยู่ในสภาพถูกล้อม ไม่ต้องจดทะเบียนใด ๆ
        </p>
        <p style={p}>
          แต่สิทธิมาพร้อมเงื่อนไข 2 ข้อใหญ่: ต้องเลือกแนวทางผ่านที่{' '}
          <strong>กระทบแปลงที่ถูกผ่านน้อยที่สุด</strong> และต้อง{' '}
          <strong>จ่ายค่าทดแทน</strong> ให้เจ้าของแปลงนั้น ส่วนความกว้างของทาง
          กฎหมายใช้คำว่า "พอควรแก่ความจำเป็น" — ไม่มีตัวเลขตายตัว
          ศาลกำหนดเป็นรายกรณี โดยแนวคำพิพากษายอมรับการใช้รถยนต์ผ่านตามความจำเป็นจริง
        </p>
        <figure style={{ margin: '12px 0 16px' }}>
          <img src="/article-images/landlocked-land-fig2.webp" alt="ทางลูกรังผ่านที่ดินเอกชนออกสู่ถนนสาธารณะ มีหลักหมุดและธงปักแนวเขตทางสองข้าง สื่อถึงทางจำเป็นตามมาตรา 1349"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            แนวทางจำเป็นต้องเลือกเส้นทางที่กระทบแปลงที่ถูกผ่านน้อยที่สุด — ปักแนวให้ชัด ตกลงให้เป็นลายลักษณ์อักษร
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
        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 10,
          background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.25)',
          fontSize: 14, lineHeight: 1.6, color: C.text,
        }}>
          💡 <strong>กรณีพิเศษ ไม่ต้องจ่ายค่าทดแทน:</strong> ถ้าที่ดินตาบอดเพราะ
          <strong>การแบ่งแยกหรือแบ่งโอนแปลงเดียวกัน</strong> (เช่น แบ่งแปลงแม่แล้วแปลงในไม่เหลือทางออก)
          มาตรา 1350 ให้ขอทางผ่านได้เฉพาะแปลงที่แบ่งกันมา <strong>โดยไม่ต้องเสียค่าทดแทน</strong> —
          ใครกำลังวางแผนแบ่งแปลง อ่าน{' '}
          <a href="/articles/land-subdivision-steps" style={{ color: C.cyan }}>
            5 ขั้นตอนแบ่งแปลงที่ดินตามกฎหมาย
          </a>{' '}
          แล้ววางผังให้ทุกแปลงมีทางออกตั้งแต่แรก จะตัดปัญหานี้ทิ้งได้เลย
        </div>
      </Section>

      <Section title="ทางจำเป็น vs ภาระจำยอม — ต่างกันตรงไหน?">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          สองคำนี้คนสับสนบ่อยที่สุดในเรื่องทางเข้าออกที่ดิน — สรุปให้เทียบกันชัด ๆ
        </p>
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 560 }}>
            <thead>
              <tr>
                {['ประเด็น', 'ทางจำเป็น (ม.1349-1350)', 'ภาระจำยอม (ม.1387)'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px', color: C.cyan, fontWeight: 700,
                    borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(r => (
                <tr key={r.k}>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: '#fff', verticalAlign: 'top' }}>{r.k}</td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: C.text, lineHeight: 1.55, verticalAlign: 'top' }}>{r.n}</td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: C.text, lineHeight: 1.55, verticalAlign: 'top' }}>{r.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...p, marginTop: 14 }}>
          แล้วภาระจำยอมได้มายังไง? มี 2 ทาง — ทางแรกคือ <strong>ตกลงกับเจ้าของแปลงข้างเคียง</strong>{' '}
          แล้วทำหนังสือและจดทะเบียนต่อพนักงานเจ้าหน้าที่ที่สำนักงานที่ดิน
          (ไม่จดทะเบียน = ผูกพันเฉพาะคู่สัญญา เจ้าของแปลงคนใหม่ไม่ต้องยอมรับ)
          ทางที่สองคือ <strong>อายุความ</strong> — ใช้ทางนั้นโดยสงบ เปิดเผย
          ด้วยเจตนาจะได้สิทธิ ติดต่อกันครบ 10 ปี (มาตรา 1401)
        </p>
        <p style={p}>
          จุดพลาดคลาสสิก: ใช้ทางของญาติหรือเพื่อนบ้านแบบ "ขอผ่านหน่อย" มาหลายสิบปี
          แบบนี้เรียกว่าใช้โดย <strong>ถือวิสาสะ</strong> — นานแค่ไหนก็ไม่ได้ภาระจำยอม
          และอีกด้านหนึ่ง ภาระจำยอมที่ได้มาแล้ว ถ้า <strong>ไม่ได้ใช้ติดต่อกัน 10 ปี ก็สิ้นไป</strong> (มาตรา 1399)
        </p>
      </Section>

      <Section title="ก่อนซื้อที่ดินตาบอด เช็ก 5 อย่างนี้">
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {CHECKLIST.map(s => (
            <li key={s.n} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: C.green, color: '#0d1520', fontWeight: 900, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.n}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          ทางเข้าออกเป็นแค่ 1 ใน 7 เรื่องที่ต้องเช็กก่อนวางมัดจำ — ดูเช็กลิสต์เต็มได้ที่{' '}
          <a href="/articles/check-land-before-buying" style={{ color: C.cyan }}>
            ซื้อที่ดินต้องตรวจอะไรบ้าง ก่อนวางมัดจำ
          </a>
        </p>
      </Section>

      <Section title="สรุป — ตาบอดไม่ใช่ตาย แต่ต้องรู้ราคาของความเสี่ยง">
        <p style={p}>
          ที่ดินตาบอดซื้อได้ และบางแปลงคือโอกาสของคนที่เข้าใจกฎหมาย —
          แต่ก่อนตัดสินใจ ตอบ 3 คำถามนี้ให้ได้ก่อน: <strong>(1)</strong> แนวขอทางออกที่เป็นไปได้อยู่ตรงไหน
          และเจ้าของแปลงนั้นว่าอย่างไร <strong>(2)</strong> ต้นทุนแฝงทั้งหมด
          (ค่าทดแทน ค่าทำถนน ค่าจดทะเบียน เผื่อค่าคดี) รวมแล้วเท่าไร{' '}
          <strong>(3)</strong> ราคาที่ลดให้ คุ้มกับต้นทุนและเวลาที่ต้องเสียไหม —
          ถ้าตอบครบและตัวเลขยังบวก นั่นคือดีลที่ซื้อเพราะรู้ ไม่ใช่ซื้อเพราะถูก
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
        ⚠ <strong>ข้อควรระวัง:</strong> บทความนี้สรุปหลักกฎหมายเพื่อความเข้าใจเบื้องต้นเท่านั้น
        ข้อเท็จจริงแต่ละแปลงต่างกัน ผลทางกฎหมายจึงต่างกันได้มาก — ก่อนซื้อที่ดินตาบอดหรือฟ้องขอเปิดทาง
        ควรปรึกษานักกฎหมายหรือสอบถามสำนักงานที่ดินในพื้นที่ก่อนทุกครั้ง
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub เช็กแปลงรอบที่ดินจริง
        </a>
      </div>
    </article>
  );
}

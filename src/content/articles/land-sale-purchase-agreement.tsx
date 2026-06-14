// ════════════════════════════════════════
// src/content/articles/land-sale-purchase-agreement.tsx
// บทความ: สัญญาจะซื้อจะขายที่ดิน — ดาวน์โหลดฟอร์มฟรี + วิธีเขียนให้ฟ้องร้องได้
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-sale-purchase-agreement',
  title:       'สัญญาจะซื้อจะขายที่ดิน — ดาวน์โหลดฟอร์มฟรี + วิธีเขียนให้ฟ้องร้องได้',
  description: 'สัญญาจะซื้อจะขายที่ดินคืออะไร ต่างจากสัญญาซื้อขายอย่างไร ต้องมีอะไรบ้างถึงจะฟ้องบังคับได้ตามกฎหมาย (ป.พ.พ. ม.456) พร้อมดาวน์โหลดฟอร์ม PDF ฟรี',
  excerpt:     'วางมัดจำที่ดินไปแล้วแต่ไม่มีสัญญาเป็นลายลักษณ์อักษร = เสี่ยงสุด ๆ — รู้ว่าสัญญาจะซื้อจะขายต้องมีอะไรถึงฟ้องบังคับได้ พร้อมดาวน์โหลดฟอร์มฟรี',
  date:        '2026-06-15',
  tags:        ['สัญญาจะซื้อจะขาย', 'ซื้อขายที่ดิน', 'มัดจำ', 'กฎหมายที่ดิน'],
  readMin:     6,
  cover:       'https://tnrmaphub.com/article-images/land-sale-purchase-agreement.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

// เปรียบเทียบสัญญา 2 แบบ
const COMPARE = [
  {
    dim: 'กรรมสิทธิ์ในที่ดิน',
    promise: 'ยังไม่โอน — ที่ดินยังเป็นของผู้ขาย',
    final: 'โอนทันทีเมื่อจดทะเบียนเสร็จ',
  },
  {
    dim: 'ต้องจดทะเบียนที่สำนักงานที่ดินไหม',
    promise: 'ไม่ต้อง — ทำกันเองได้ มีผลผูกพันทันที',
    final: 'ต้องจดทะเบียนต่อพนักงานเจ้าหน้าที่ มิฉะนั้นเป็นโมฆะ',
  },
  {
    dim: 'ใช้ตอนไหน',
    promise: 'ก่อนวันโอน — รอผู้ซื้อจัดเงินกู้ หรือผู้ขายเตรียมเอกสาร',
    final: 'วันโอนจริง ณ สำนักงานที่ดิน',
  },
  {
    dim: 'ถ้าอีกฝ่ายผิดสัญญา',
    promise: 'ฟ้องบังคับให้โอน / ริบมัดจำ / เรียกเบี้ยปรับได้',
    final: 'กรรมสิทธิ์โอนไปแล้ว ใช้กระบวนการอื่นแก้ไข',
  },
];

// 3 เงื่อนไขที่ทำให้ฟ้องบังคับได้ (ม.456 วรรคสอง)
const ENFORCE = [
  { t: 'มีหลักฐานเป็นหนังสือ', d: 'ลงลายมือชื่อฝ่ายที่ต้องรับผิด — สัญญาที่เขียนและเซ็นกันไว้คือหลักฐานที่ชัดที่สุด' },
  { t: 'วางมัดจำ', d: 'มีการวางเงินมัดจำ (เงินประจำ) เป็นหลักฐานว่าตกลงทำสัญญากันจริง' },
  { t: 'ชำระหนี้บางส่วนแล้ว', d: 'ผู้ซื้อจ่ายเงินบางส่วน หรือผู้ขายส่งมอบที่ดินบางส่วนให้ครอบครองแล้ว' },
];

// สิ่งที่สัญญาที่ดีต้องมี
const CLAUSES = [
  { t: 'คู่สัญญา', d: 'ชื่อ-นามสกุล เลขบัตรประชาชน และที่อยู่ของผู้จะซื้อและผู้จะขายให้ครบ' },
  { t: 'รายละเอียดที่ดิน', d: 'เลขโฉนด เลขที่ดิน หน้าสำรวจ ตำบล อำเภอ จังหวัด และเนื้อที่ (ไร่-งาน-ตร.ว.) ให้ตรงกับโฉนด' },
  { t: 'ราคาและวิธีชำระ', d: 'ราคาซื้อขายรวม เงินมัดจำ งวดผ่อน (ถ้ามี) และยอดที่จ่ายวันโอน ระบุให้ชัดทุกก้อน' },
  { t: 'กำหนดวันโอน', d: 'วันนัดโอนกรรมสิทธิ์ ณ สำนักงานที่ดิน ระบุวันที่ชัดเจน ไม่ใช่ "ภายหลัง"' },
  { t: 'ใครออกค่าใช้จ่าย', d: 'ค่าธรรมเนียมโอน ภาษี และค่าใช้จ่าย ณ วันโอน ตกลงให้ชัดว่าใครจ่ายส่วนไหน' },
  { t: 'การรับรองของผู้ขาย', d: 'ผู้ขายรับรองว่าที่ดินเป็นของตนจริง ปลอดจำนอง ปลอดอายัด และไม่มีภาระผูกพัน' },
  { t: 'เงื่อนไขผิดนัด', d: 'ถ้าผู้ซื้อผิดนัด = ริบมัดจำ / ถ้าผู้ขายผิดนัด = คืนมัดจำและชดใช้ หรือถูกฟ้องบังคับโอน' },
  { t: 'ลายมือชื่อและพยาน', d: 'ลงลายมือชื่อคู่สัญญาทั้งสองฝ่าย พร้อมพยานอย่างน้อย 1-2 คน' },
];

export const FAQ = [
  { q: 'สัญญาจะซื้อจะขายที่ดิน ต้องไปจดทะเบียนที่สำนักงานที่ดินไหม?', a: 'ไม่ต้อง สัญญาจะซื้อจะขายทำกันเองระหว่างผู้ซื้อกับผู้ขายได้เลย และมีผลผูกพันทันที การจดทะเบียนต่อพนักงานเจ้าหน้าที่เป็นขั้นตอนของการโอนกรรมสิทธิ์จริง (สัญญาซื้อขายเสร็จเด็ดขาด) เท่านั้น' },
  { q: 'ตกลงกันด้วยปากเปล่า ฟ้องบังคับได้ไหม?', a: 'เสี่ยงมาก ตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 456 วรรคสอง การจะฟ้องบังคับคดีได้ต้องมีอย่างใดอย่างหนึ่ง คือ มีหลักฐานเป็นหนังสือลงลายมือชื่อฝ่ายที่ต้องรับผิด มีการวางมัดจำ หรือชำระหนี้บางส่วนแล้ว ถ้าไม่มีเลยจะฟ้องบังคับไม่ได้' },
  { q: 'ถ้าผู้จะซื้อผิดสัญญา ผู้ขายริบมัดจำได้ไหม?', a: 'ได้ ตามมาตรา 378 หากผู้วางมัดจำ (ผู้จะซื้อ) เป็นฝ่ายผิดสัญญา ผู้รับมัดจำมีสิทธิริบมัดจำได้ แต่ในทางกลับกัน ถ้าผู้ขายเป็นฝ่ายผิดเอง ต้องคืนมัดจำให้ผู้ซื้อ และอาจต้องชดใช้เพิ่มตามที่ตกลง' },
  { q: 'ดาวน์โหลดฟอร์มมาใช้เลยปลอดภัยไหม?', a: 'ใช้เป็นโครงตั้งต้นได้ดี แต่ควรปรับเนื้อหาให้ตรงกับกรณีจริงของคุณ โดยเฉพาะเงื่อนไขการชำระเงินและการผิดนัด ถ้าที่ดินมูลค่าสูงหรือมีเงื่อนไขซับซ้อน ควรให้นักกฎหมายหรือทนายตรวจก่อนเซ็น' },
  { q: 'เซ็นสัญญาจะซื้อจะขายแล้ว ที่ดินเป็นของผู้ซื้อเลยไหม?', a: 'ยังไม่เป็น กรรมสิทธิ์ยังอยู่กับผู้ขายจนกว่าจะไปจดทะเบียนโอนต่อหน้าเจ้าพนักงานที่สำนักงานที่ดิน สัญญาจะซื้อจะขายเป็นเพียงข้อตกลงว่าจะโอนกันในอนาคตเท่านั้น' },
];

const SOURCES = [
  { name: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 456 (สำนักงานคณะกรรมการกฤษฎีกา)', url: 'https://www.krisdika.go.th' },
  { name: 'สัญญาจะซื้อจะขายที่ดิน — ถาม-ตอบ กรมที่ดิน', url: 'https://www.dol.go.th' },
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

export function LandSalePurchaseAgreement() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          สัญญาจะซื้อจะขายที่ดิน ต้องมีอะไรบ้าง
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          เขียนให้ฟ้องร้องบังคับได้ตามกฎหมาย พร้อมดาวน์โหลดฟอร์มฟรี
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Land Sale & Purchase Agreement — Free Form Download
        </p>
      </header>

      <p style={{ ...p, fontSize: 16 }}>
        วางมัดจำที่ดินไปก้อนใหญ่ แต่มีแค่ข้อความแชตกับคำพูด "ตกลงนะ" — แล้ววันดีคืนดีผู้ขายเปลี่ยนใจ
        ขายให้คนอื่นที่ให้ราคาดีกว่า คุณจะเอาอะไรไปฟ้อง? ปัญหานี้เกิดบ่อยกว่าที่คิด และทางป้องกันมีอย่างเดียว
        คือ <strong>สัญญาจะซื้อจะขายที่เขียนถูกต้อง</strong> บทความนี้จะพาดูว่าสัญญาแบบนี้ต้องมีอะไร
        ถึงจะใช้บังคับได้จริง
      </p>

      <Section title="สัญญาจะซื้อจะขาย ต่างจากสัญญาซื้อขายอย่างไร?">
        <p style={p}>
          คนมักสับสนสองคำนี้ แต่มันคนละขั้นตอนกัน <strong>สัญญาจะซื้อจะขาย</strong> คือข้อตกลงว่า
          "จะ" ซื้อและ "จะ" ขายกันในอนาคต ยังไม่โอนกรรมสิทธิ์ ส่วน <strong>สัญญาซื้อขายเสร็จเด็ดขาด</strong>{' '}
          คือการโอนกรรมสิทธิ์จริงที่ทำต่อหน้าเจ้าพนักงาน ณ สำนักงานที่ดิน
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {COMPARE.map(r => (
            <div key={r.dim} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14,
            }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff', marginBottom: 10 }}>{r.dim}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.cyan, fontWeight: 700, marginBottom: 3 }}>จะซื้อจะขาย</div>
                  <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{r.promise}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 3 }}>ซื้อขายเสร็จเด็ดขาด</div>
                  <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{r.final}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          จุดสำคัญ: การซื้อขายที่ดินจะสมบูรณ์ต้องจดทะเบียน ถ้าไม่จดทะเบียนถือเป็น <strong>โมฆะ</strong>{' '}
          ตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 456 — สัญญาจะซื้อจะขายจึงเป็นแค่ "ขั้นเตรียม" ก่อนวันโอนจริง
        </p>
      </Section>

      <Section title="ทำไมต้องทำสัญญาเป็นหนังสือ?">
        <p style={p}>
          เพราะถ้าวันหนึ่งต้องขึ้นโรงขึ้นศาล กฎหมายไม่รับฟังแค่คำพูด มาตรา 456 วรรคสอง กำหนดว่า
          สัญญาจะซื้อจะขายอสังหาริมทรัพย์จะ <strong>ฟ้องร้องบังคับคดีได้</strong> ก็ต่อเมื่อมีอย่างน้อยหนึ่งใน
          สามอย่างนี้:
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
          {ENFORCE.map((e, i) => (
            <div key={e.t} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: C.cyan, color: '#0d1520', fontWeight: 900, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{e.t}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{e.d}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          พูดง่าย ๆ คือ ถ้าไม่มีหลักฐานเลยสักอย่าง ต่อให้ตกลงกันด้วยวาจาแน่นแค่ไหน ก็ฟ้องบังคับให้โอนไม่ได้
          การมีสัญญาเป็นหนังสือจึงคุ้มครองทั้งสองฝ่าย
        </p>
      </Section>

      <Section title="ในสัญญาต้องมีอะไรบ้าง?">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          เช็กให้ครบก่อนเซ็น — ข้อไหนหายไปคือช่องโหว่
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 10 }}>
          {CLAUSES.map((c, i) => (
            <li key={c.t} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                background: C.green, color: '#0d1520', fontWeight: 900, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15.5, color: '#fff', marginBottom: 2 }}>{c.t}</div>
                <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{c.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          ก่อนกรอกรายละเอียดที่ดิน อย่าลืม{' '}
          <a href="/articles/check-land-before-buying" style={{ color: C.cyan }}>
            ตรวจสอบที่ดินให้ครบทุกจุดก่อนวางมัดจำ
          </a>{' '}
          ทั้งโฉนด ภาระผูกพัน และทางเข้าออก จะได้ไม่เซ็นสัญญาผูกมัดกับที่ดินที่มีปัญหา
        </p>
      </Section>

      <Section title="มัดจำกับเบี้ยปรับ ต่างกันอย่างไร?">
        <p style={p}>
          <strong>มัดจำ</strong> คือเงินที่ผู้จะซื้อวางไว้เป็นหลักประกันว่าจะทำตามสัญญา ถ้าผู้ซื้อผิดสัญญาเอง
          ผู้ขายมีสิทธิริบมัดจำได้ (มาตรา 378) แต่ถ้าผู้ขายเป็นฝ่ายผิด ต้องคืนมัดจำให้ผู้ซื้อ
        </p>
        <p style={p}>
          <strong>เบี้ยปรับ</strong> คือเงินค่าเสียหายที่ตกลงกันไว้ล่วงหน้าว่าจะจ่ายถ้าผิดสัญญา — ต่างจากมัดจำ
          ตรงที่ระบุเพิ่มเป็นเงื่อนไขในสัญญา การเขียนข้อนี้ให้ชัดช่วยลดข้อพิพาทเวลาฝ่ายใดฝ่ายหนึ่งเบี้ยว
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 4 }}>
          ก่อนตกลงราคาและมัดจำ ลอง{' '}
          <a href="/articles/appraisal-vs-market-price" style={{ color: C.cyan }}>
            เทียบราคาประเมินกับราคาตลาด
          </a>{' '}
          เพื่อให้รู้ว่าราคาที่ตกลงสมเหตุสมผลแค่ไหน
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
        ⚠ <strong>ข้อควรระวัง:</strong> เนื้อหานี้สรุปหลักกฎหมายเบื้องต้นเพื่อความเข้าใจ
        ฟอร์มสัญญาเป็นเพียงแบบตั้งต้น ควรปรับให้ตรงกับกรณีจริง หากที่ดินมูลค่าสูงหรือมีเงื่อนไขซับซ้อน
        ควรปรึกษานักกฎหมายหรือทนายความก่อนลงนามทุกครั้ง
      </p>

      <div style={{
        marginTop: 28, textAlign: 'center',
        display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.green, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          📄 ดาวน์โหลดฟอร์มสัญญาจะซื้อจะขาย (PDF) ฟรี
        </a>
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

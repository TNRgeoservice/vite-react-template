// ════════════════════════════════════════
// src/content/articles/inherited-land-division.tsx
// บทความ: แบ่งที่ดินมรดกให้ทายาท ตั้งแต่โอนมรดกถึงแยกโฉนด
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'inherited-land-division',
  title:       'แบ่งที่ดินมรดกให้ทายาท ทำอย่างไรไม่ให้จบที่ศาล — ตั้งแต่โอนมรดกถึงแยกโฉนด',
  description: 'ที่ดินมรดกยังไม่แบ่ง ทายาททุกคนเป็นเจ้าของร่วม เข้าใจสิทธิทายาทโดยธรรม ขั้นตอนโอนมรดก ค่าธรรมเนียม 0.5% vs 2% และวิธีแบ่งให้ยุติธรรมจริงก่อนบานปลาย',
  excerpt:     'พ่อแม่เสียไปหลายปี ที่ดินยังอยู่ชื่อท่าน พี่น้องเริ่มไม่คุยกัน — เข้าใจสิทธิทายาท ขั้นตอนโอนมรดกถึงแยกโฉนด ค่าธรรมเนียมจริง และทางออกเมื่อแบ่งไม่ลงตัว',
  date:        '2026-07-16',
  tags:        ['ที่ดินมรดก', 'แบ่งมรดก', 'ทายาทโดยธรรม', 'แยกโฉนด', 'รังวัดแบ่งแปลง'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/inherited-land-division.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const HEIRS = [
  { n: 1, t: 'ผู้สืบสันดาน', d: 'ลูก หลาน เหลน — รวมลูกบุญธรรมที่จดทะเบียนรับรองแล้ว' },
  { n: 2, t: 'บิดามารดา', d: 'พ่อแม่ของเจ้ามรดก' },
  { n: 3, t: 'พี่น้องร่วมบิดามารดาเดียวกัน', d: 'พี่น้องแท้ ๆ พ่อแม่เดียวกัน' },
  { n: 4, t: 'พี่น้องร่วมบิดา หรือร่วมมารดาเดียวกัน', d: 'พี่น้องต่างพ่อหรือต่างแม่' },
  { n: 5, t: 'ปู่ ย่า ตา ยาย', d: 'ญาติชั้นบน' },
  { n: 6, t: 'ลุง ป้า น้า อา', d: 'ญาติชั้นข้าง' },
];

const STEPS = [
  { n: 1, t: 'ตั้งผู้จัดการมรดก (ถ้าจำเป็น)', d: 'ยื่นคำร้องต่อศาลขอตั้งผู้จัดการมรดก (มาตรา 1713) — จำเป็นเมื่อทายาทหลายคน มีข้อขัดแย้ง หรือสำนักงานที่ดินขอคำสั่งศาล ถ้าทายาทมีคนเดียวและเอกสารครบ บางกรณีข้ามขั้นนี้ได้' },
  { n: 2, t: 'ยื่นโอนมรดกที่สำนักงานที่ดิน', d: 'ใช้โฉนดตัวจริง ใบมรณบัตร บัตรประชาชนและทะเบียนบ้านของทายาท (คำสั่งศาลถ้ามีผู้จัดการมรดก) — เจ้าหน้าที่จะประกาศ 30 วันเพื่อเปิดโอกาสให้คัดค้าน' },
  { n: 3, t: 'ตกลงกันให้ชัดว่าใครได้ตรงไหน', d: 'ทำเป็นหนังสือลงลายมือชื่อทุกคน — มาตรา 1750 กำหนดว่าสัญญาแบ่งมรดกที่ไม่มีหลักฐานเป็นหนังสือ ฟ้องบังคับกันไม่ได้ ตกลงด้วยปากเปล่าคือความเสี่ยงล้วน ๆ' },
  { n: 4, t: 'ยื่นรังวัดแบ่งแยกโฉนด', d: 'ขอรังวัดแบ่งแยกที่สำนักงานที่ดิน ช่างจะออกไปรังวัดปักหลักเขตตามที่ตกลง แล้วออกโฉนดใหม่แยกเป็นรายแปลงในชื่อทายาทแต่ละคน' },
];

const DEADLOCK = [
  { n: 1, t: 'แบ่งทรัพย์สินกันเองก่อน', d: 'ศาลให้โอกาสแบ่งตัวที่ดินกันเองเป็นลำดับแรก ถ้าส่วนที่แบ่งไม่เท่ากัน ศาลสั่งให้ชดเชยส่วนต่างเป็นเงินได้' },
  { n: 2, t: 'ประมูลราคากันเองระหว่างทายาท', d: 'ถ้าแบ่งตัวที่ดินไม่ได้ หรือแบ่งแล้วเสียหายมาก — ใครให้ราคาสูงสุดได้ที่ดินไป แล้วเอาเงินมาแบ่งกันตามส่วน' },
  { n: 3, t: 'ขายทอดตลาด แล้วแบ่งเงิน', d: 'ทางสุดท้ายเมื่อประมูลกันเองไม่สำเร็จ — ขายทอดตลาดให้คนนอก ได้เงินสุทธิเท่าไรแบ่งกันตามส่วน มักเป็นทางที่ทุกคนได้น้อยที่สุด' },
];

const FAIR = [
  { t: 'อย่าวัดความยุติธรรมด้วยจำนวนไร่อย่างเดียว', d: 'แปลงติดถนนกับแปลงในสุด เนื้อที่เท่ากันเป๊ะ แต่มูลค่าต่างกันได้เท่าตัว — แบ่งไร่เท่ากันแล้วบอกว่ายุติธรรม คือจุดเริ่มของการทะเลาะรอบหน้า' },
  { t: 'วางผังให้ทุกแปลงมีทางออก', d: 'แบ่งสะเปะสะปะแล้วมีแปลงในกลายเป็นที่ดินตาบอด คนที่ได้แปลงนั้นเดือดร้อนทันที — วางแนวถนนหรือทางเข้าออกร่วมกันไว้ตั้งแต่บนกระดาษ ก่อนช่างรังวัดจะปักหลัก' },
  { t: 'ชดเชยส่วนต่างเป็นเงิน', d: 'ถ้าแบ่งให้มูลค่าเท่ากันเป๊ะไม่ได้จริง ๆ ให้คนที่ได้แปลงดีกว่าจ่ายส่วนต่างคืนกองกลาง — วิธีนี้ศาลก็ใช้ (มาตรา 1364) ตกลงกันเองได้ก่อนถึงศาลยิ่งดี' },
  { t: 'เอาราคาประเมินมากางบนโต๊ะ', d: 'เถียงกันด้วยความรู้สึกไม่มีวันจบ — เปิดราคาประเมินรายแปลงให้ทุกคนเห็นตัวเลขเดียวกัน แล้วคุยกันบนข้อมูล ไม่ใช่บนอารมณ์' },
];

export const FAQ = [
  { q: 'พ่อแม่เสียไปหลายปีแล้ว ที่ดินยังไม่ได้โอน ยังทำได้ไหม?', a: 'ยื่นโอนมรดกที่สำนักงานที่ดินได้ ไม่มีกำหนดว่าต้องโอนภายในกี่ปี สิ่งที่มีอายุความคือ "การฟ้องคดีมรดก" ซึ่งมาตรา 1754 ห้ามฟ้องเมื่อพ้น 1 ปีนับแต่เจ้ามรดกตาย หรือนับแต่ทายาทรู้/ควรได้รู้ถึงการตาย แต่มาตรา 1748 คุ้มครองทายาทที่ครอบครองทรัพย์มรดกที่ยังไม่ได้แบ่งอยู่ ให้เรียกร้องขอแบ่งได้แม้พ้นกำหนด — เรื่องอายุความซับซ้อนและขึ้นกับข้อเท็จจริงรายคดี ควรปรึกษานักกฎหมาย' },
  { q: 'ทายาทคนหนึ่งไม่ยอมเซ็น ทำอย่างไร?', a: 'ที่ดินมรดกที่ยังไม่แบ่งถือเป็นกรรมสิทธิ์รวม เจ้าของรวมคนใดคนหนึ่งมีสิทธิเรียกให้แบ่งได้ตามมาตรา 1363 ถ้าตกลงกันไม่ได้ ยื่นฟ้องขอแบ่งกรรมสิทธิ์รวมต่อศาล ศาลจะสั่งตามลำดับในมาตรา 1364 คือแบ่งกันเอง → ประมูลกันเอง → ขายทอดตลาด' },
  { q: 'โอนมรดกที่ดินเสียค่าธรรมเนียมเท่าไร?', a: 'ถ้าโอนระหว่างบุพการีกับผู้สืบสันดาน (พ่อแม่–ลูก) หรือระหว่างคู่สมรส เสีย 0.5% ของราคาประเมินทุนทรัพย์ ตามกฎกระทรวง ฉบับที่ 47 (พ.ศ. 2541) ข้อ 2(7)(ง) — แต่ถ้าเป็นทายาทลำดับอื่น เช่น พี่น้อง ปู่ย่าตายาย ลุงป้าน้าอา จะเสียอัตราปกติ 2% ของราคาประเมิน' },
  { q: 'แบ่งที่ดินมรดกให้ทายาท 10 คนขึ้นไป เข้าข่ายจัดสรรที่ดินไหม?', a: 'การแบ่งให้ทายาทรับมรดกไม่ใช่การ "จำหน่าย" จึงไม่ใช่การจัดสรรตามนิยามมาตรา 4 พ.ร.บ.จัดสรรที่ดิน 2543 — แต่ถ้าแบ่งแล้วตั้งใจนำแปลงย่อยออกขายตั้งแต่ 10 แปลงขึ้นไป (หรือแบ่งเพิ่มจนครบ 10 ภายใน 3 ปี) กรณีนั้นเข้าข่ายจัดสรรและต้องขออนุญาต ควรสอบถามสำนักงานที่ดินให้ชัดก่อนวางแผน' },
  { q: 'ที่ดินมรดกต้องเสียภาษีมรดกไหม?', a: 'ภาษีการรับมรดกตาม พ.ร.บ.ภาษีการรับมรดก พ.ศ. 2558 เก็บเฉพาะกองมรดกส่วนที่เกิน 100 ล้านบาทต่อผู้รับหนึ่งคน มรดกที่ดินของครอบครัวทั่วไปจึงมักไม่ถึงเกณฑ์ — แต่ค่าธรรมเนียมโอนที่สำนักงานที่ดินยังต้องจ่ายตามปกติ' },
];

const SOURCES = [
  { name: 'กรมที่ดิน — ครบเรื่องมรดกที่ดิน ใครมีสิทธิและโอนอย่างไร', url: 'https://www.dol.go.th' },
  { name: 'กรมที่ดิน — ถาม-ตอบ แบ่งโฉนดที่ดินมรดกให้แก่ทายาท', url: 'https://www.dol.go.th/question-answer/Q2502-007700' },
  { name: 'สถาบันนิติธรรมาลัย — ป.พ.พ. หมวดการแบ่งมรดก (ม.1745-1752)', url: 'https://www.drthawip.com/civilandcommercialcode/236' },
  { name: 'สถาบันนิติธรรมาลัย — ป.พ.พ. อายุความมรดก (ม.1754-1755)', url: 'https://www.drthawip.com/civilandcommercialcode/238' },
  { name: 'LandsMaps ค้นหารูปแปลงและโฉนด (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
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

export function InheritedLandDivision() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          แบ่งที่ดินมรดกให้ทายาท ทำอย่างไรไม่ให้จบที่ศาล
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          ตั้งแต่โอนมรดก ค่าธรรมเนียมจริง จนถึงรังวัดแยกโฉนด — และทางออกเมื่อแบ่งไม่ลงตัว
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Dividing Inherited Land Among Heirs in Thailand — A Practical Legal Guide
        </p>
      </header>

      <Section title="ที่ดินยังอยู่ชื่อพ่อ แต่พี่น้องเริ่มไม่คุยกัน">
        <p style={p}>
          พ่อเสียไปห้าปี ที่ดินสิบไร่ยังอยู่ชื่อท่านเหมือนเดิม ตอนแรกทุกคนบอกว่า "ไม่รีบหรอก พี่น้องกันทั้งนั้น"
          จนวันหนึ่งมีคนอยากขายส่วนของตัวเอง อีกคนปลูกบ้านทับไปแล้ว
          และคนที่สามเพิ่งรู้ว่าตัวเองมีสิทธิด้วย — ตอนนั้นแหละที่ทุกอย่างเริ่มพัง
        </p>
        <p style={p}>
          เรื่องแบบนี้ไม่ได้เริ่มจากความโลภ ส่วนใหญ่เริ่มจาก <strong>ไม่มีใครรู้ว่าต้องทำอะไรก่อน</strong> แล้วปล่อยเวลาผ่านไป
          จนความทรงจำเรื่อง "พ่อบอกไว้ว่า..." ของแต่ละคนไม่ตรงกันอีกต่อไป
          บทความนี้เรียงให้ครบว่าใครมีสิทธิบ้าง ต้องเดินเรื่องยังไง เสียเงินเท่าไร
          และถ้าตกลงกันไม่ได้จริง ๆ กฎหมายพาไปจบที่ไหน
        </p>
      </Section>

      <Section title="ตราบใดที่ยังไม่แบ่ง ทุกคนเป็นเจ้าของร่วมกันหมด">
        <figure style={{ margin: '0 0 16px' }}>
          <img src="/article-images/inherited-land-division-fig1.webp" alt="มุมโดรนที่ดินมรดกในชนบทไทยยามเย็น บ้านไม้เก่าหลังเดิมของครอบครัวตั้งอยู่ริมแปลง ล้อมด้วยทุ่งนาผืนเดียวที่ยังไม่มีแนวรั้วหรือเส้นแบ่งใด ๆ"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ที่ดินผืนเดียว ไม่มีเส้นแบ่ง ไม่มีรั้ว — สวยดี จนถึงวันที่ต้องตอบว่าตรงไหนของใคร
          </figcaption>
        </figure>
        <p style={p}>
          นี่คือจุดที่คนเข้าใจผิดมากที่สุด — หลายคนคิดว่า "พ่อยกที่ตรงนี้ให้ฉันแล้ว" เลยถือว่าเป็นของตัวเอง
          แต่ตามกฎหมาย ถ้ายังไม่ได้แบ่งกันอย่างเป็นทางการ <strong>ทายาททุกคนมีสิทธิและหน้าที่ในที่ดินทั้งผืนร่วมกัน</strong>{' '}
          ไม่ใช่แค่มุมที่ตัวเองใช้อยู่
        </p>
        <div style={{
          padding: '14px 16px', borderRadius: 10, marginBottom: 10,
          background: 'rgba(64,196,255,0.06)', border: '1px solid rgba(64,196,255,0.25)',
          fontSize: 14.5, lineHeight: 1.65, color: C.text,
        }}>
          <strong>มาตรา 1745</strong> — ถ้ามีทายาทหลายคน ทายาทเหล่านั้นมีสิทธิและหน้าที่เกี่ยวกับทรัพย์มรดกร่วมกัน
          จนกว่าจะแบ่งมรดกเสร็จ และให้นำบทบัญญัติเรื่อง <strong>กรรมสิทธิ์รวม (มาตรา 1356-1366)</strong> มาใช้บังคับด้วย
          <br />
          <strong>มาตรา 1746</strong> — ทายาทด้วยกันมีส่วนเท่ากันในกองมรดกที่ยังไม่ได้แบ่ง เว้นแต่พินัยกรรมกำหนดไว้เป็นอย่างอื่น
        </div>
        <p style={p}>
          ผลของมันตรงไปตรงมามาก: คุณจะขายที่ดินผืนนั้นคนเดียวไม่ได้ จะจำนองคนเดียวไม่ได้
          และในทางกลับกัน <strong>พี่น้องคนใดคนหนึ่งก็มีสิทธิเรียกให้แบ่งได้ทุกเมื่อ</strong> (มาตรา 1363)
          โดยคุณห้ามเขาไม่ได้ — การปล่อยไว้เฉย ๆ จึงไม่ใช่การรักษาสถานะเดิม แต่คือการปล่อยให้ระเบิดเวลาเดินต่อ
        </p>
      </Section>

      <Section title="ใครมีสิทธิรับมรดกที่ดินบ้าง?">
        <p style={p}>
          ถ้ามีพินัยกรรม ให้ว่าตามพินัยกรรมก่อน ถ้าไม่มี กฎหมายจัดลำดับ <strong>ทายาทโดยธรรมไว้ 6 ลำดับ</strong>{' '}
          ตามมาตรา 1629 หลักสำคัญคือ <strong>ลำดับต้นตัดลำดับหลัง</strong> — ถ้ามีลูกอยู่ พี่น้องของผู้ตายก็ไม่ได้อะไร
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 8 }}>
          {HEIRS.map(h => (
            <li key={h.n} style={{
              display: 'flex', gap: 12, alignItems: 'center',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px',
            }}>
              <span style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                background: C.cyan, color: '#0d1520', fontWeight: 900, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{h.n}</span>
              <div>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{h.t}</span>
                <span style={{ fontSize: 13.5, color: C.muted }}> — {h.d}</span>
              </div>
            </li>
          ))}
        </ol>
        <p style={p}>
          แล้วคู่สมรสอยู่ตรงไหน? <strong>คู่สมรสที่ยังมีชีวิตอยู่เป็นทายาทโดยธรรมเสมอ</strong> ไม่ถูกตัดออกด้วยลำดับ
          โดยมาตรา 1635 กำหนดส่วนแบ่งไว้ต่างหาก — กรณีที่พบบ่อยที่สุดคือมีลูกอยู่ด้วย
          คู่สมรสจะได้ส่วนแบ่ง <strong>เสมือนเป็นทายาทชั้นบุตรอีกคนหนึ่ง</strong>
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          ข้อควรระวัง: ถ้าที่ดินเป็นสินสมรส คู่สมรสที่ยังอยู่มีสิทธิในครึ่งหนึ่งของที่ดินอยู่แล้วในฐานะเจ้าของ
          ส่วนที่เป็นมรดกให้แบ่งกันคือครึ่งที่เหลือ — จุดนี้พลาดกันบ่อยและทำให้คำนวณส่วนแบ่งผิดทั้งกอง
        </p>
      </Section>

      <Section title="4 ขั้นตอน จากที่ดินชื่อคนที่จากไป สู่โฉนดชื่อคุณ">
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
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
        <figure style={{ margin: '16px 0' }}>
          <img src="/article-images/inherited-land-division-fig2.webp" alt="ช่างรังวัดสวมเสื้อกั๊กสะท้อนแสงกำลังตอกหลักเขตคอนกรีตลงดินแดงริมแปลงที่ดิน มีกล้องสำรวจตั้งบนขาตั้งอยู่ด้านหลัง"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            หลักเขตที่ตอกลงไปแล้ว คือข้อตกลงที่จับต้องได้ — ก่อนถึงวันนี้ ทุกอย่างยังเป็นแค่คำพูด
          </figcaption>
        </figure>
        <p style={{ ...p, marginTop: 14 }}>
          ขั้นที่ 4 คือขั้นที่คนมักประเมินต่ำที่สุด — เพราะ "ตกลงกันได้แล้ว" ไม่เท่ากับ "แบ่งได้จริงบนพื้นที่"
          รายละเอียดการยื่นรังวัดแบ่งแยกอ่านต่อได้ที่{' '}
          <a href="/articles/land-subdivision-steps" style={{ color: C.cyan }}>
            5 ขั้นตอนแบ่งแปลงที่ดินตามกฎหมาย
          </a>
        </p>
      </Section>

      <Section title="ต้องเสียเงินเท่าไร? — 0.5% หรือ 2% ต่างกันมหาศาล">
        <p style={p}>
          ค่าธรรมเนียมโอนมรดกที่ดิน <strong>ไม่ได้เท่ากันทุกคน</strong> — มันขึ้นกับว่าคุณเป็นทายาทความสัมพันธ์แบบไหน
          และตรงนี้คือจุดที่หลายคนตกใจตอนไปถึงเคาน์เตอร์
        </p>
        <div style={{ overflowX: 'auto', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
            <thead>
              <tr>
                {['ผู้รับโอนมรดก', 'ค่าธรรมเนียม', 'ฐานคำนวณ'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px', color: C.cyan, fontWeight: 700,
                    borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: '#fff', verticalAlign: 'top' }}>
                  ผู้สืบสันดาน (ลูก หลาน) หรือคู่สมรส
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: C.green, fontWeight: 700, verticalAlign: 'top' }}>0.5%</td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: C.text, lineHeight: 1.55, verticalAlign: 'top' }}>ราคาประเมินทุนทรัพย์</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: '#fff', verticalAlign: 'top' }}>
                  ทายาทลำดับอื่น (พี่น้อง ปู่ย่าตายาย ลุงป้าน้าอา)
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: '#ffb300', fontWeight: 700, verticalAlign: 'top' }}>2%</td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: C.text, lineHeight: 1.55, verticalAlign: 'top' }}>ราคาประเมินทุนทรัพย์</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: '#fff', verticalAlign: 'top' }}>
                  ค่าจดทะเบียนผู้จัดการมรดก
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: C.text, fontWeight: 700, verticalAlign: 'top' }}>50 บาท</td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, color: C.text, lineHeight: 1.55, verticalAlign: 'top' }}>ต่อแปลง</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={p}>
          อัตรา 0.5% มาจาก <strong>กฎกระทรวง ฉบับที่ 47 (พ.ศ. 2541) ข้อ 2(7)(ง)</strong> ซึ่งให้สิทธิเฉพาะการโอนมรดกหรือให้
          <strong>ระหว่างผู้บุพการีกับผู้สืบสันดาน หรือระหว่างคู่สมรส</strong> เท่านั้น —
          พี่น้องกันเองไม่เข้าข่าย ต้องเสีย 2% เต็ม
        </p>
        <p style={p}>
          สังเกตว่าทุกอัตราคิดจาก <strong>ราคาประเมินทุนทรัพย์</strong> ไม่ใช่ราคาตลาด
          ซึ่งปกติต่ำกว่ากันมาก และนั่นเป็นข่าวดีสำหรับค่าธรรมเนียม — ความต่างของสองราคานี้อ่านได้ที่{' '}
          <a href="/articles/appraisal-vs-market-price" style={{ color: C.cyan }}>
            ราคาประเมิน vs ราคาตลาด ต่างกันอย่างไร
          </a>
        </p>
      </Section>

      <Section title="แบ่งไม่ลงตัว ตกลงกันไม่ได้ — กฎหมายพาไปจบที่ไหน?">
        <p style={p}>
          ถ้าคุยกันเองไม่จบ ทายาทคนใดคนหนึ่งฟ้องขอแบ่งกรรมสิทธิ์รวมต่อศาลได้
          และศาลจะไม่ได้ "ตัดสินให้ใครชนะ" อย่างที่หลายคนคิด — <strong>มาตรา 1364 บังคับลำดับวิธีแบ่งไว้ 3 ขั้น</strong>
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 10 }}>
          {DEADLOCK.map(s => (
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
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          background: 'rgba(255,179,0,0.06)', border: '1px solid rgba(255,179,0,0.25)',
          fontSize: 14, lineHeight: 1.6, color: C.text,
        }}>
          ⚠ <strong>ลองอ่านทั้งสามขั้นอีกครั้ง</strong> — ปลายทางที่แย่ที่สุดคือที่ดินของครอบครัวถูกขายทอดตลาดให้คนนอก
          แล้วทุกคนได้เงินก้อนเล็กลงหลังหักค่าใช้จ่ายคดีและเวลาที่เสียไปหลายปี ไม่มีใครชนะสักคน —
          นี่คือเหตุผลที่การลงทุนเวลาตกลงกันบนโต๊ะให้จบ คุ้มกว่าการไปวัดใจกันในศาลเสมอ
        </div>
      </Section>

      <Section title="แบ่งอย่างไรให้ยุติธรรมจริง ไม่ใช่แค่ไร่เท่ากัน">
        <p style={p}>
          สมมติที่ดิน 8 ไร่ ทายาท 4 คน — แบ่งคนละ 2 ไร่ ฟังดูยุติธรรมที่สุดแล้วใช่ไหม? ยังไม่แน่
          เพราะถ้าแปลงหนึ่งติดถนนใหญ่ อีกแปลงอยู่ในสุดไม่มีทางออก <strong>เนื้อที่เท่ากันแต่มูลค่าห่างกันเป็นเท่าตัว</strong>{' '}
          คนที่ได้แปลงในจะรู้สึกว่าถูกโกง และเขาก็ไม่ได้คิดไปเอง
        </p>
        <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
          {FAIR.map(f => (
            <div key={f.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{f.t}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>{f.d}</div>
            </div>
          ))}
        </div>
        <p style={p}>
          ข้อที่สองสำคัญกว่าที่คิด — ถ้าแบ่งแล้วมีแปลงกลายเป็นที่ดินตาบอด คนที่ได้แปลงนั้นต้องไปขอทางจำเป็นจากพี่น้องตัวเอง
          ซึ่งเป็นชนวนทะเลาะรอบใหม่ทันที รู้จักสิทธิและกับดักตรงนี้ก่อนที่{' '}
          <a href="/articles/landlocked-land" style={{ color: C.cyan }}>
            ที่ดินตาบอดคืออะไร ซื้อได้ไหม
          </a>
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          และถ้าทายาทหลายคนตั้งใจจะแบ่งแล้วนำแปลงย่อยออกขายตั้งแต่ 10 แปลงขึ้นไป
          เรื่องจะข้ามไปเป็น "จัดสรรที่ดิน" ซึ่งต้องขออนุญาต — เทียบความต่างได้ที่{' '}
          <a href="/articles/land-subdivision-vs-allocation" style={{ color: C.cyan }}>
            แบ่งแปลง vs จัดสรรที่ดิน
          </a>
        </p>
      </Section>

      <Section title="สรุป — เริ่มจาก 3 อย่างนี้ก่อนที่จะสาย">
        <p style={p}>
          ที่ดินมรดกที่ยังไม่แบ่ง ไม่ได้อยู่นิ่ง ๆ รอเราพร้อม — มันสะสมความเสี่ยงทุกปี
          ถ้าครอบครัวคุณกำลังอยู่ในสถานะนี้ เริ่มจากสามอย่างนี้ได้เลย:
          <strong> (1)</strong> ทำรายชื่อทายาทที่มีสิทธิให้ครบตามลำดับมาตรา 1629 อย่าลืมคู่สมรสและเรื่องสินสมรส
          <strong> (2)</strong> กางแผนที่แปลงจริงพร้อมราคาประเมิน คุยกันบนตัวเลขชุดเดียว ไม่ใช่บนความทรงจำ
          <strong> (3)</strong> ตกลงได้แล้วให้ <strong>ทำเป็นหนังสือลงลายมือชื่อทุกคนทันที</strong> แล้วเดินเรื่องโอนและรังวัดแยกโฉนดให้จบ
        </p>
        <p style={p}>
          ข้อ (3) คือข้อที่คนผัดวันประกันพรุ่งมากที่สุด และเป็นข้อที่ทำให้เรื่องบานปลายบ่อยที่สุดเช่นกัน —
          ตกลงกันได้วันไหน ทำเป็นเอกสารวันนั้น
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
        คดีมรดกขึ้นอยู่กับข้อเท็จจริงรายครอบครัวอย่างมาก โดยเฉพาะเรื่องอายุความ สินสมรส
        พินัยกรรม และการครอบครองทรัพย์มรดก — ก่อนดำเนินการหรือฟ้องคดี
        ควรปรึกษานักกฎหมายและสอบถามสำนักงานที่ดินในพื้นที่ก่อนทุกครั้ง
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub กางแปลงมรดกพร้อมราคาประเมิน
        </a>
      </div>
    </article>
  );
}

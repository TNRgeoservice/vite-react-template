// ════════════════════════════════════════
// src/content/articles/object-land-appraisal-price.tsx
// บทความ: ขอคัดค้านราคาประเมินทรัพย์สิน ทำยังไง
// อ้างอิงเอกสารทางการ กองประเมินราคาทรัพย์สิน กรมธนารักษ์
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'object-land-appraisal-price',
  title:       'ราคาประเมินที่ดินสูงเกินจริง? วิธียื่นคัดค้านกับกรมธนารักษ์',
  description: 'ราคาประเมินทรัพย์สินไม่ตรงสภาพจริง ยื่นคัดค้านได้ภายใน 90 วัน สรุปแบบฟอร์ม บค.1/บค.2/บค.3 เอกสารที่ต้องเตรียม ยื่นที่ไหน ขั้นตอนพิจารณา และสิทธิฟ้องศาลปกครอง',
  excerpt:     'ราคาประเมินที่ดินไม่ตรงสภาพจริง ทำให้จ่ายภาษีหรือค่าโอนแพงเกิน — ยื่นคัดค้านกับกรมธนารักษ์ได้ภายใน 90 วัน สรุปแบบฟอร์ม เอกสาร สถานที่ยื่น และขั้นตอนพิจารณาครบ',
  date:        '2026-06-05',
  tags:        ['ราคาประเมินที่ดิน', 'คัดค้านราคาประเมิน', 'กรมธนารักษ์', 'ภาษีที่ดิน', 'ค่าโอนที่ดิน'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/object-land-appraisal-price.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const REASONS = [
  { t: 'ราคาสูงหรือต่ำเกินจริง', d: 'ราคาประเมินไม่สอดคล้องกับสภาพและทำเลจริงของทรัพย์สิน' },
  { t: 'เนื้อที่ / คุณลักษณะผิด', d: 'ระบบบันทึกเนื้อที่ ประเภทอาคาร หรือลักษณะทรัพย์สินคลาดเคลื่อน' },
  { t: 'สภาพเสื่อม / มีข้อจำกัด', d: 'ที่ดินหรือสิ่งปลูกสร้างมีสภาพหรือข้อจำกัดที่ราคาประเมินไม่ได้สะท้อน' },
  { t: 'ตำแหน่งไม่ตรงฐานข้อมูล', d: 'ตำแหน่งแปลงในระบบไม่ตรงกับที่ตั้งจริง ทำให้ประเมินผิดทำเล' },
];

const FORMS = [
  { code: 'บค.1', use: 'คัดค้านราคาประเมิน "ที่ดิน"' },
  { code: 'บค.2', use: 'คัดค้านราคาประเมิน "สิ่งปลูกสร้าง"' },
  { code: 'บค.3', use: 'คัดค้านราคาประเมิน "ห้องชุด"' },
];

const LOCATIONS = [
  { place: 'ทรัพย์สินอยู่ในกรุงเทพมหานคร', to: 'ยื่นต่อหรือส่งที่ กองประเมินราคาทรัพย์สิน กรมธนารักษ์' },
  { place: 'ทรัพย์สินอยู่ในจังหวัดอื่น', to: 'ยื่นต่อหรือส่งที่ สำนักงานธนารักษ์พื้นที่ที่ทรัพย์สินตั้งอยู่' },
  { place: 'ส่งทางไปรษณีย์', to: 'ถือวันที่ที่ทำการไปรษณีย์ต้นทางประทับตรา เป็นวันยื่นคำคัดค้าน' },
];

const STEPS = [
  { n: 1, t: 'รับทราบราคาประเมิน', d: 'เจ้าของรับทราบราคาประเมินตอนได้รับแบบประเมินภาษี (ภ.ด.ส.3) หรือตอนจดทะเบียนสิทธิและนิติกรรม หากไม่เห็นด้วยให้เริ่มดำเนินการ' },
  { n: 2, t: 'เตรียมเอกสาร + กรอกแบบ บค.', d: 'กรอกแบบคัดค้านให้ตรงประเภททรัพย์ (บค.1/บค.2/บค.3) พร้อมแนบเอกสารแสดงสิทธิและหลักฐานเหตุคัดค้าน' },
  { n: 3, t: 'ยื่นภายใน 90 วันนับแต่วันที่รู้', d: 'ยื่นที่กองประเมินราคาทรัพย์สิน (กทม.) หรือสำนักงานธนารักษ์พื้นที่ (จังหวัดอื่น) หรือส่งไปรษณีย์' },
  { n: 4, t: 'ตรวจสอบเอกสาร', d: 'ถ้าเอกสารครบถ้วน กรมแจ้งผลตรวจสอบ — ถ้าไม่ครบ จะแจ้งให้ส่งเอกสารเพิ่มภายใน 15 วันนับแต่วันที่ได้รับแจ้ง' },
  { n: 5, t: 'คณะกรรมการพิจารณาภายใน 90 วัน', d: 'คณะกรรมการรับคำคัดค้านและพิจารณาให้แล้วเสร็จภายใน 90 วัน แล้วมีหนังสือแจ้งผล' },
];

const DOCS_OWNER = [
  'บุคคลธรรมดา: สำเนาบัตรประจำตัวประชาชน พร้อมรับรองสำเนา (ต่างชาติใช้สำเนาหนังสือเดินทางพร้อมรับรองสำเนา)',
  'นิติบุคคล: สำเนาหนังสือรับรองนิติบุคคล (อายุไม่เกิน 3 เดือน)',
  'กรณีมอบอำนาจ: หนังสือมอบอำนาจ พร้อมปิดอากรแสตมป์',
];

const DOCS_RIGHT = [
  'บค.1 (ที่ดิน): สำเนาโฉนดที่ดิน หรือสำเนา น.ส.3 ก. พร้อมสารบัญจดทะเบียน หรือเอกสารสิทธิประเภทอื่น + แบบ ภ.ด.ส.3 / ภ.ด.ส.7',
  'บค.2 (สิ่งปลูกสร้าง): แบบ อ.1 + แบบ ภ.ด.ส.3 / ภ.ด.ส.7',
  'บค.3 (ห้องชุด): สำเนา อ.ช.2 พร้อมสารบัญจดทะเบียน + แบบ ภ.ด.ส.4 / ภ.ด.ส.8',
];

const DOCS_PROOF = [
  'ที่ดิน: ภาพถ่ายที่แสดงพื้นที่ ลักษณะ สภาพ และทำเลที่ตั้งของแปลง',
  'สิ่งปลูกสร้าง: ภาพถ่ายที่แสดงลักษณะ สภาพ หรือประเภทของสิ่งปลูกสร้าง',
  'ห้องชุด: ภาพถ่ายที่แสดงพื้นที่ ลักษณะ สภาพ และทำเลที่ตั้งของห้องชุด',
];

const FAQ = [
  { q: 'ต้องยื่นคัดค้านภายในกี่วัน?', a: 'ภายใน 90 วันนับแต่วันที่รู้ราคาประเมิน (เช่น วันที่ได้รับแบบ ภ.ด.ส.3 หรือวันจดทะเบียนสิทธิและนิติกรรม) หากส่งไปรษณีย์ ใช้วันที่ตราประทับไปรษณีย์ต้นทางเป็นวันยื่น' },
  { q: 'ถ้ากรมเห็นด้วยกับการคัดค้าน ราคาใหม่มีผลเมื่อไหร่?', a: 'ถ้าคณะกรรมการเห็นด้วยและปรับปรุงราคาประเมิน ราคาประเมินที่แก้ไขจะมีผลนับแต่วันที่ยื่นคำคัดค้าน' },
  { q: 'ถ้าคัดค้านแล้วถูกยกคำขอ ทำอะไรต่อได้?', a: 'หากคณะกรรมการไม่เห็นด้วย (ยกคำคัดค้าน) ผู้ยื่นมีสิทธิฟ้องคดีต่อศาลปกครองภายใน 90 วันนับแต่วันที่ได้รับหนังสือแจ้งผลการพิจารณา' },
  { q: 'คัดค้านราคาประเมินทรัพย์สินอะไรได้บ้าง?', a: 'ที่ดิน สิ่งปลูกสร้าง และห้องชุด ที่อยู่ในบัญชีราคาประเมินของกรมธนารักษ์ โดยใช้แบบคัดค้านให้ตรงประเภท (บค.1/บค.2/บค.3)' },
];

const SOURCES = [
  { name: 'การคัดค้านราคาประเมินทรัพย์สิน (กรมธนารักษ์)', url: 'https://www.treasury.go.th/th/services/land-assessment/objection-to-property-appraisal-value' },
  { name: 'กองประเมินราคาทรัพย์สิน กรมธนารักษ์', url: 'https://dep-assess.treasury.go.th' },
  { name: 'ระบบราคาประเมินทรัพย์สิน (กรมธนารักษ์)', url: 'https://assessprice.treasury.go.th' },
  { name: 'พ.ร.บ.การประเมินราคาทรัพย์สินเพื่อประโยชน์แห่งรัฐ พ.ศ.2562 (กฤษฎีกา)', url: 'https://www.krisdika.go.th' },
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

function DocGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: C.cyan, marginBottom: 8 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 7 }}>
        {items.map((t, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.55, color: C.text }}>
            <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ObjectLandAppraisalPrice() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ราคาประเมินที่ดินสูงเกินจริง? คัดค้านได้
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          วิธียื่นคัดค้านราคาประเมินทรัพย์สินกับกรมธนารักษ์
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          How to Object to Your Property Appraisal Value
        </p>
      </header>

      <Section title="ทำไมต้องสนใจ ถ้าราคาประเมินผิด?">
        <p style={p}>
          ราคาประเมินของราชการไม่ได้กระทบแค่ตัวเลขบนกระดาษ — มันคือฐานที่ใช้คิด
          <strong> ภาษีที่ดินรายปี</strong> และ <strong>ค่าธรรมเนียมโอน</strong> ตอนซื้อขาย
          ถ้าราคาประเมินสูงเกินสภาพจริง คุณก็จ่ายแพงเกินไปทุกปี
        </p>
        <p style={p}>
          ข่าวดีคือ ถ้าเห็นว่าราคาประเมินหรือข้อมูลทรัพย์สินไม่ตรงกับความจริง
          คุณมีสิทธิ <strong>ยื่นคัดค้าน</strong> กับกรมธนารักษ์ได้ภายใน <strong>90 วัน</strong> —
          ไม่ต้องยอมรับตัวเลขที่ผิดไปเฉย ๆ
        </p>
      </Section>

      <Section title="เริ่มนับ 90 วันจากตอนไหน?">
        <figure style={{ margin: '0 0 14px' }}>
          <img src="/article-images/object-land-appraisal-price-fig1.webp" alt="เจ้าของที่ดินตรวจใบแจ้งประเมินภาษีพบว่าราคาประเมินสูงเกินจริง"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ตรวจใบแจ้งประเมินภาษี (ภ.ด.ส.3) แล้วเริ่มนับ 90 วันถ้าจะคัดค้าน
          </figcaption>
        </figure>
        <p style={p}>
          คุณจะ "รับทราบ" ราคาประเมินใน 2 จังหวะหลัก — และนับจากวันนั้นคือเส้นตาย 90 วัน
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ตอนได้รับแบบประเมินภาษีที่ดินและสิ่งปลูกสร้าง (ภ.ด.ส.3)',
            'ตอนจดทะเบียนสิทธิและนิติกรรม (เช่น ซื้อขาย โอน) ณ สำนักงานที่ดิน',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 10 }}>
          ไม่แน่ใจว่าราคาประเมินแปลงตัวเองเท่าไหร่?{' '}
          <a href="/articles/land-appraisal-price-online" style={{ color: C.cyan }}>
            อ่านวิธีเช็กราคาประเมินออนไลน์ฟรี
          </a>
        </p>
      </Section>

      <Section title="เหตุผลแบบไหนที่ใช้คัดค้านได้?">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          ต้องเป็นกรณีที่ราคาหรือข้อมูลไม่ตรงกับสภาพจริงหรือข้อเท็จจริง
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {REASONS.map(r => (
            <div key={r.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 3 }}>{r.t}</div>
              <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.55 }}>{r.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ใช้แบบฟอร์มไหน? (บค.1 / บค.2 / บค.3)">
        <div style={{ display: 'grid', gap: 10 }}>
          {FORMS.map(f => (
            <div key={f.code} style={{
              display: 'grid', gridTemplateColumns: '70px 1fr', gap: 14, alignItems: 'center',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
            }}>
              <div style={{
                background: C.cyan, color: '#0d1520', borderRadius: 8, padding: '10px 6px',
                textAlign: 'center', fontWeight: 900, fontSize: 16,
              }}>{f.code}</div>
              <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.5 }}>{f.use}</div>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 12.5, color: C.muted, marginTop: 10 }}>
          ดาวน์โหลดแบบฟอร์มได้จากเว็บกรมธนารักษ์ หรือขอรับที่สำนักงานธนารักษ์พื้นที่
        </p>
      </Section>

      <Section title="เอกสารที่ต้องเตรียม">
        <div style={{ display: 'grid', gap: 10 }}>
          <DocGroup title="1) เอกสารผู้ยื่น" items={DOCS_OWNER} />
          <DocGroup title="2) เอกสารแสดงสิทธิความเป็นเจ้าของ" items={DOCS_RIGHT} />
          <DocGroup title="3) หลักฐานประกอบเหตุคัดค้าน" items={DOCS_PROOF} />
        </div>
      </Section>

      <Section title="ยื่นคัดค้านได้ที่ไหน?">
        <figure style={{ margin: '0 0 14px' }}>
          <img src="/article-images/object-land-appraisal-price-fig2.webp" alt="ยื่นคำคัดค้านราคาประเมินที่สำนักงานธนารักษ์พื้นที่"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ยื่นคำคัดค้านพร้อมเอกสารที่สำนักงานธนารักษ์พื้นที่ หรือส่งทางไปรษณีย์
          </figcaption>
        </figure>
        <div style={{ display: 'grid', gap: 10 }}>
          {LOCATIONS.map(l => (
            <div key={l.place} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 3 }}>{l.place}</div>
              <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.55 }}>{l.to}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ขั้นตอนตั้งแต่ยื่นถึงรู้ผล">
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

      <Section title="ผลการพิจารณา — เป็นไปได้ 2 ทาง">
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.green, marginBottom: 4 }}>✓ เห็นด้วย (ปรับปรุงราคาประเมิน)</div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>
              ราคาประเมินที่แก้ไขมีผลนับแต่วันที่ยื่นคำคัดค้าน
            </div>
          </div>
          <div style={{ background: 'rgba(235,87,87,0.06)', border: '1px solid rgba(235,87,87,0.3)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#ff8a80', marginBottom: 4 }}>✕ ไม่เห็นด้วย (ยกคำคัดค้าน)</div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>
              ฟ้องคดีต่อศาลปกครองได้ภายใน 90 วันนับแต่วันที่ได้รับหนังสือแจ้งผลการพิจารณา
            </div>
          </div>
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

      <Section title="สรุป — ก่อนยื่นคัดค้าน เช็ก 3 อย่าง">
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
          <li style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>
            <strong>นับเวลาให้ทัน</strong> — ยื่นภายใน 90 วันนับแต่วันที่รู้ราคาประเมิน
          </li>
          <li style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>
            <strong>เลือกแบบให้ถูก + เตรียมหลักฐานแน่น</strong> — บค.1/2/3 + เอกสารสิทธิ + ภาพถ่ายสภาพจริง
          </li>
          <li style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>
            <strong>ยื่นให้ถูกที่</strong> — กทม.ที่กองประเมินราคาทรัพย์สิน / จังหวัดอื่นที่สำนักงานธนารักษ์พื้นที่
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
        ⚠ <strong>ข้อควรระวัง:</strong> ข้อมูลนี้สรุปจากแนวทางของกองประเมินราคาทรัพย์สิน กรมธนารักษ์
        รายละเอียดแบบฟอร์ม เอกสาร และกำหนดเวลาอาจมีการปรับปรุง ก่อนยื่นจริงควรตรวจสอบกับ
        สำนักงานธนารักษ์พื้นที่ที่ทรัพย์สินตั้งอยู่ หรือสายด่วนกรมธนารักษ์ 0-2059-4999
        และปรึกษาผู้เชี่ยวชาญหากจำเป็น
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub ดูข้อมูลที่ดิน
        </a>
      </div>
    </article>
  );
}

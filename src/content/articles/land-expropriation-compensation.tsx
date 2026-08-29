// ════════════════════════════════════════
// src/content/articles/land-expropriation-compensation.tsx
// บทความ: ที่ดินโดนเวนคืนต้องทำอย่างไร
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'land-expropriation-compensation',
  title:       'ที่ดินโดนเวนคืนต้องทำอย่างไร — ค่าทดแทน ขั้นตอน และการอุทธรณ์',
  description: 'ที่ดินอยู่ในแนวเวนคืนต้องทำอย่างไร เช็กแนวเขตจากไหน ค่าทดแทนครอบคลุมอะไร ไม่พอใจอุทธรณ์ได้ภายในกี่วัน อธิบายทีละขั้นตามกฎหมายเวนคืนฉบับปัจจุบัน',
  excerpt:     'เช็กว่าที่ดินอยู่ในแนวเวนคืนจริงหรือไม่ ค่าทดแทนคิดจากอะไร ครอบคลุมใครบ้าง และถ้าไม่พอใจต้องอุทธรณ์ภายในกี่วัน — อธิบายทีละขั้นแบบที่เจ้าของที่ดินใช้ได้จริง',
  date:        '2026-08-30',
  tags:        ['เวนคืนที่ดิน', 'ค่าทดแทน', 'รถไฟฟ้า', 'กฎหมายที่ดิน'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/land-expropriation-compensation.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
  amber:  '#ffb300',
};

const CHECK = [
  { n: 1, t: 'อ่านประกาศในราชกิจจานุเบกษา', d: 'พระราชกฤษฎีกากำหนดเขตสำรวจและพระราชบัญญัติเวนคืนแต่ละฉบับ จะมีแผนที่และบัญชีท้ายกฎหมายระบุพื้นที่ที่อยู่ในข่าย' },
  { n: 2, t: 'ถามหน่วยงานเจ้าของโครงการโดยตรง', d: 'เช่น รฟม. กรมทางหลวง หรือหน่วยงานที่ระบุในประกาศ ขอให้ยืนยันว่าแปลงของคุณอยู่ในแนวเขตหรือไม่' },
  { n: 3, t: 'ตรวจกับสำนักงานที่ดินในพื้นที่', d: 'ตรวจว่ามีการจดแจ้งหรือหมายเหตุใดในสารบบที่ดินของแปลงนั้นแล้วหรือยัง' },
  { n: 4, t: 'ขอคำตอบเป็นหนังสือ', d: 'ถ้ากำลังจะซื้อ ขาย จำนอง หรือแบ่งแปลง ให้ขอหนังสือยืนยันแนวเขต คำตอบทางโทรศัพท์ใช้พิสูจน์สิทธิภายหลังไม่ได้' },
];

const STAGES = [
  { t: 'พระราชกฤษฎีกากำหนดเขตสำรวจ', d: 'รัฐประกาศเขตที่จะสำรวจเพื่อเวนคืน ยังไม่ใช่การเวนคืนจริง แต่เป็นสัญญาณแรกที่เจ้าของที่ดินต้องเริ่มเก็บหลักฐาน' },
  { t: 'เจ้าหน้าที่เข้าสำรวจและรังวัด', d: 'สำรวจที่ดิน สิ่งปลูกสร้าง ต้นไม้ยืนต้น และผู้มีสิทธิในที่ดิน เจ้าของควรอยู่ร่วมและถ่ายรูปสภาพจริงไว้' },
  { t: 'คณะกรรมการกำหนดราคาเบื้องต้น', d: 'กำหนดราคาและเงินค่าทดแทน กฎหมายกำหนดกรอบให้ทำให้แล้วเสร็จภายใน 180 วันนับแต่ได้รับแต่งตั้ง และขยายเวลาได้เมื่อได้รับอนุมัติ' },
  { t: 'แจ้งราคาและเจรจาทำสัญญา', d: 'ถ้าตกลงราคากันได้ จะทำสัญญาซื้อขายกับเจ้าหน้าที่ กรรมสิทธิ์โอนเมื่อมีการชำระเงิน' },
  { t: 'จ่ายค่าทดแทน', d: 'กรณีทำสัญญาซื้อขาย เจ้าหน้าที่ต้องจ่ายเงินภายใน 120 วันนับแต่วันทำสัญญา' },
  { t: 'ตราพระราชบัญญัติเวนคืนและเข้าใช้พื้นที่', d: 'เมื่อมี พ.ร.บ.เวนคืนของโครงการนั้น หน่วยงานจึงมีอำนาจเข้าใช้พื้นที่ตามกรอบเวลาที่กฎหมายกำหนด' },
];

const COVER = [
  'ที่ดินตามเนื้อที่ที่ถูกเวนคืน',
  'อาคารและสิ่งปลูกสร้างบนที่ดิน',
  'ต้นไม้ยืนต้นที่มีมูลค่า',
  'ความเสียหายของที่ดินส่วนที่เหลือ หากส่วนที่เหลือราคาลดลงหรือใช้ประโยชน์ได้น้อยลง',
  'ค่าขนย้ายและความเสียหายของผู้เช่าหรือผู้ต้องออกจากพื้นที่',
];

const MYTHS = [
  { m: 'เห็นเส้นแนวโครงการในแผนที่ออนไลน์ แปลว่าที่ดินโดนเวนคืนแน่นอน', f: 'แนวในแผนที่เป็นข้อมูลเบื้องต้น แนวเขตที่มีผลตามกฎหมายคือแผนที่และบัญชีท้ายประกาศ ต้องตรวจกับหน่วยงานเจ้าของโครงการ' },
  { m: 'ค่าทดแทนคิดตามราคาประเมินทุนทรัพย์เท่านั้น', f: 'ราคาประเมินเป็นเพียงหนึ่งในปัจจัย กฎหมายให้พิจารณาราคาซื้อขายจริง สภาพและที่ตั้ง รวมถึงความเสียหายของผู้ถูกเวนคืนด้วย' },
  { m: 'มีอัตราค่าทดแทนกลางเป็นบาทต่อตารางวา', f: 'ไม่มีอัตรากลางตายตัว แต่ละโครงการและแต่ละแปลงต่างกันตามข้อเท็จจริง' },
  { m: 'รับเงินไปแล้วหมดสิทธิโต้แย้ง', f: 'กฎหมายให้สิทธิอุทธรณ์นับแต่วันรับเงิน แต่ต้องอ่านข้อความในเอกสารรับเงินและสัญญาให้ดี เพราะถ้อยคำสละสิทธิในเอกสารมีผลต่างกันไปแต่ละกรณี' },
  { m: 'ผู้เช่าไม่เกี่ยวข้อง ได้แต่เจ้าของที่ดิน', f: 'ผู้เช่าหรือผู้เช่าช่วงที่มีหลักฐานอาจมีสิทธิได้รับค่าขนย้ายและค่าเสียหายอื่นตามกรณี' },
];

export const FAQ = [
  { q: 'ที่ดินโดนเวนคืนบางส่วน ส่วนที่เหลือใช้ไม่ได้ ทำอย่างไร?', a: 'กฎหมายให้พิจารณาความเสียหายของที่ดินส่วนที่เหลือประกอบการกำหนดค่าทดแทนด้วย และมีบทบัญญัติเรื่องที่ดินส่วนที่เหลือแยกต่างหาก ควรยื่นข้อเท็จจริงและหลักฐานสภาพแปลงต่อคณะกรรมการตั้งแต่ต้น' },
  { q: 'ไม่พอใจค่าทดแทน อุทธรณ์ได้ภายในกี่วัน?', a: 'ผู้มีสิทธิได้รับเงินค่าทดแทนมีสิทธิอุทธรณ์ต่อรัฐมนตรีภายใน 90 วันนับแต่วันที่ได้รับเงินจากเจ้าหน้าที่หรือรับเงินที่วางไว้ แล้วแต่กรณี' },
  { q: 'อุทธรณ์แล้วยังไม่พอใจ ฟ้องศาลได้ไหม?', a: 'ได้ หากไม่พอใจคำวินิจฉัยของรัฐมนตรีหรือรัฐมนตรีไม่วินิจฉัยภายในเวลาที่กฎหมายกำหนด ผู้มีสิทธิอาจฟ้องคดีต่อศาลได้ กำหนดเวลาฟ้องและศาลที่มีเขตอำนาจต้องตรวจจากลักษณะข้อพิพาทและเอกสารของโครงการนั้น จึงควรปรึกษานักกฎหมาย' },
  { q: 'ซื้อที่ดินหลังมีประกาศแล้ว ยังได้ค่าทดแทนไหม?', a: 'ขึ้นกับข้อเท็จจริงและช่วงเวลาการได้มา ก่อนตัดสินใจซื้อที่ดินในพื้นที่ที่มีข่าวโครงการ ควรขอหนังสือยืนยันแนวเขตและสถานะโครงการก่อนเสมอ' },
  { q: 'ที่ดินติดจำนองอยู่ ค่าทดแทนจ่ายให้ใคร?', a: 'เมื่อมีผู้มีสิทธิหรือผู้รับจำนองเกี่ยวข้อง การจ่ายเงินต้องเป็นไปตามที่กฎหมายกำหนด กรณีมีข้อโต้แย้งเจ้าหน้าที่อาจวางเงินไว้ตามกฎหมาย จึงควรแจ้งสถานะจำนองให้ครบตั้งแต่ชั้นสำรวจ' },
];

const SOURCES = [
  { name: 'ราชกิจจานุเบกษา (สำนักเลขาธิการคณะรัฐมนตรี)', url: 'https://ratchakitcha.soc.go.th' },
  { name: 'ระบบค้นหากฎหมายไทย (สำนักงานคณะกรรมการกฤษฎีกา)', url: 'https://www.krisdika.go.th' },
  { name: 'กรมที่ดิน', url: 'https://www.dol.go.th' },
  { name: 'การรถไฟฟ้าขนส่งมวลชนแห่งประเทศไทย (รฟม.)', url: 'https://www.mrta.co.th' },
  { name: 'กรมทางหลวง — ระเบียบการเวนคืนที่ดิน', url: 'https://www.doh.go.th' },
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

export function LandExpropriationCompensation() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ที่ดินโดนเวนคืนต้องทำอย่างไร
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          เช็กแนวเขต ค่าทดแทนครอบคลุมอะไร และอุทธรณ์ได้ภายในกี่วัน
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Land Expropriation in Thailand: Compensation, Process and Appeal
        </p>
      </header>

      <Section title="ข่าวเวนคืนออก แล้วที่ดินคุณอยู่ในแนวหรือเปล่า">
        <p style={p}>
          ทุกครั้งที่ราชกิจจานุเบกษาประกาศ พ.ร.บ.เวนคืนของโครงการใหม่ คนที่มีที่ดินแถวนั้นจะเจอคำถามเดียวกันหมด
          — แปลงเราอยู่ในแนวไหม ได้เงินเท่าไหร่ และถ้าไม่พอใจทำอะไรได้บ้าง
        </p>
        <p style={p}>
          คำตอบไม่ได้อยู่ที่ข่าว แต่อยู่ที่แผนที่และบัญชีท้ายประกาศ กับกรอบเวลาที่กฎหมายกำหนดไว้ชัดเจน
          ถ้ารู้ลำดับขั้นล่วงหน้า คุณจะเตรียมหลักฐานทัน และไม่พลาดกรอบเวลาที่ใช้สิทธิได้
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 10 }}>
          ถ้ากำลังจะซื้อที่ดินในพื้นที่ที่มีข่าวโครงการ อ่านคู่กับ{' '}
          <a href="/articles/check-land-before-buying" style={{ color: C.cyan }}>
            เช็กที่ดินก่อนซื้อ
          </a>{' '}เพื่อดูว่าต้องตรวจอะไรเพิ่ม
        </p>
      </Section>

      <Section title="4 ทางเช็กว่าแปลงอยู่ในแนวเวนคืนจริงไหม">
        <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 10 }}>
          {CHECK.map(s => (
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

      <Section title="ลำดับขั้นของการเวนคืน ตั้งแต่ประกาศจนถึงจ่ายเงิน">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          แต่ละโครงการรายละเอียดต่างกัน แต่โครงหลักเดินตามลำดับนี้
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 10 }}>
          {STAGES.map((s, i) => (
            <li key={s.t} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: C.green, color: '#062012', fontWeight: 900, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <div style={{
          marginTop: 14, background: C.card, border: `1px solid ${C.amber}55`,
          borderLeft: `3px solid ${C.amber}`, borderRadius: 10, padding: '14px 16px',
        }}>
          <div style={{ fontWeight: 700, color: C.amber, marginBottom: 4 }}>ช่วงที่ต้องเก็บหลักฐานที่สุด</div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>
            คือตอนเจ้าหน้าที่เข้าสำรวจ ถ่ายรูปสภาพที่ดิน สิ่งปลูกสร้าง ต้นไม้ยืนต้น และการใช้ประโยชน์จริงไว้ให้ครบ
            พร้อมเก็บสัญญาเช่า ใบอนุญาต และหลักฐานรายได้จากพื้นที่ เอกสารชุดนี้คือสิ่งที่ใช้โต้แย้งได้ในชั้นอุทธรณ์
          </div>
        </div>
      </Section>

      <Section title="ค่าทดแทนครอบคลุมอะไรบ้าง">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {COVER.map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, marginTop: 12 }}>
          สิ่งที่หลายคนเข้าใจผิดคือคิดว่ามีอัตรากลางเป็นบาทต่อตารางวา — <strong>ไม่มี</strong>
          {' '}กฎหมายให้พิจารณาราคาซื้อขายจริง สภาพและที่ตั้งของอสังหาริมทรัพย์ ความเสียหายของผู้ถูกเวนคืน
          และประโยชน์ที่เหลืออยู่ของที่ดินส่วนที่เหลือประกอบกัน ค่าทดแทนของสองแปลงที่อยู่ติดกันจึงต่างกันได้
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          อยากเข้าใจว่าราคาประเมินกับราคาตลาดต่างกันตรงไหน อ่าน{' '}
          <a href="/articles/appraisal-vs-market-price" style={{ color: C.cyan }}>
            ราคาประเมินกับราคาตลาด
          </a>
        </p>
      </Section>

      <Section title="ไม่พอใจค่าทดแทน ทำอะไรได้บ้าง">
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: '16px 18px', marginBottom: 12,
        }}>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: C.text }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ color: C.cyan, fontWeight: 800 }}>ขั้นที่ 1 — อุทธรณ์ต่อรัฐมนตรี</span><br />
              ยื่นภายใน <strong style={{ color: C.green }}>90 วัน</strong> นับแต่วันที่ได้รับเงินจากเจ้าหน้าที่
              หรือรับเงินที่วางไว้ แล้วแต่กรณี
            </div>
            <div>
              <span style={{ color: C.cyan, fontWeight: 800 }}>ขั้นที่ 2 — ฟ้องคดีต่อศาล</span><br />
              ถ้าไม่พอใจคำวินิจฉัย หรือรัฐมนตรีไม่วินิจฉัยภายในเวลาที่กฎหมายกำหนด
              กำหนดเวลาฟ้องและศาลที่มีเขตอำนาจขึ้นกับลักษณะข้อพิพาทและเอกสารของโครงการ ควรปรึกษานักกฎหมายก่อน
            </div>
          </div>
        </div>
        <p style={p}>
          ก่อนเซ็นเอกสารรับเงินทุกฉบับ ให้อ่านถ้อยคำให้ครบ โดยเฉพาะข้อความทำนอง
          &ldquo;ไม่ติดใจเรียกร้องใด ๆ อีก&rdquo; เพราะผลของถ้อยคำแบบนี้ต่างกันไปตามข้อเท็จจริงของแต่ละฉบับ
          ถ้าไม่มั่นใจ ให้ถ่ายเอกสารไปปรึกษาก่อนเซ็น
        </p>
      </Section>

      <Section title="5 เรื่องที่คนเข้าใจผิดบ่อย">
        <div style={{ display: 'grid', gap: 10 }}>
          {MYTHS.map(x => (
            <div key={x.m} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 14.5, color: '#ff8a80', fontWeight: 700, marginBottom: 4 }}>
                เข้าใจผิด: {x.m}
              </div>
              <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.green, fontWeight: 700 }}>ที่ถูกคือ:</span> {x.f}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ถ้ากำลังจะแบ่งแปลงในพื้นที่ที่มีข่าวโครงการ">
        <p style={p}>
          แนวเวนคืนพาดผ่านแปลงเมื่อไหร่ ผังแบ่งแปลงที่วางไว้จะใช้ไม่ได้ทันที เพราะรูปแปลง ทางเข้าออก
          และเนื้อที่ที่ขายได้จะเปลี่ยนทั้งหมด ทางที่ปลอดภัยกว่าคือยืนยันแนวเขตให้จบก่อน แล้วค่อยวางผัง
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted }}>
          ดูขั้นตอนการแบ่งแปลงตามกฎหมายได้ที่{' '}
          <a href="/articles/land-subdivision-steps" style={{ color: C.cyan }}>
            5 ขั้นตอนแบ่งแปลงที่ดิน
          </a>
        </p>
      </Section>

      <Section title="สรุปสิ่งที่ต้องทำ">
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 15, lineHeight: 1.6 }}>
          <li>ขอหนังสือยืนยันแนวเขตจากหน่วยงานเจ้าของโครงการ อย่าเชื่อคำบอกเล่าหรือเส้นในแผนที่ออนไลน์</li>
          <li>เก็บหลักฐานสภาพแปลงตั้งแต่ชั้นสำรวจ ทั้งรูปถ่าย สัญญาเช่า และหลักฐานการใช้ประโยชน์</li>
          <li>อ่านเอกสารก่อนเซ็นทุกฉบับ โดยเฉพาะข้อความสละสิทธิ</li>
          <li>ถ้าไม่พอใจค่าทดแทน ให้ยื่นอุทธรณ์ภายใน 90 วันนับแต่วันรับเงิน อย่าปล่อยให้เลยกำหนด</li>
          <li>เรื่องที่มีเงินก้อนใหญ่และกรอบเวลาแบบนี้ ค่าที่ปรึกษากฎหมายถูกกว่าการเสียสิทธิ</li>
        </ol>
      </Section>

      <div style={{
        background: C.card, border: `1px solid ${C.amber}55`, borderLeft: `3px solid ${C.amber}`,
        borderRadius: 10, padding: '14px 16px', marginBottom: 32,
      }}>
        <div style={{ fontWeight: 700, color: C.amber, marginBottom: 4 }}>ข้อควรทราบเรื่องตัวบทกฎหมาย</div>
        <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>
          กฎหมายหลักคือพระราชบัญญัติว่าด้วยการเวนคืนและการได้มาซึ่งอสังหาริมทรัพย์ พ.ศ. 2562
          และมีพระราชบัญญัติแก้ไขเพิ่มเติม (ฉบับที่ 2) พ.ศ. 2569 ประกาศในราชกิจจานุเบกษา
          เล่ม 143 ตอนที่ 38 ก เมื่อวันที่ 8 กรกฎาคม 2569 ซึ่งแก้ไขรายละเอียดบางมาตรา
          ก่อนใช้สิทธิจริงให้ตรวจตัวบทฉบับรวมล่าสุด และปรึกษานักกฎหมายหรือหน่วยงานที่รับผิดชอบโครงการ
          บทความนี้เป็นความรู้ทั่วไป ไม่ใช่คำปรึกษาทางกฎหมายรายกรณี
        </div>
      </div>

      <Section title="แหล่งข้อมูลที่เกี่ยวข้อง">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {SOURCES.map(s => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow"
                 style={{ color: C.cyan, fontSize: 14.5 }}>
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
           style={{
             display: 'inline-block', background: C.cyan, color: '#0d1520',
             fontWeight: 800, fontSize: 16, padding: '12px 28px', borderRadius: 10,
             textDecoration: 'none',
           }}>
          ดูแปลงที่ดินบนแผนที่ TNR MapHub
        </a>
      </div>
    </article>
  );
}

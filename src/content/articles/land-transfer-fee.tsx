// ════════════════════════════════════════
// src/content/articles/land-transfer-fee.tsx
// บทความ: ค่าโอนที่ดินคิดยังไง — 4 รายการที่ต้องจ่ายจริงที่สำนักงานที่ดิน
// ตัวหนังสือเป็น HTML จริง (prerender ลง static) → SEO เก็บได้ ไม่มีตัวอักษรเพี้ยน
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';
const RD_CALC = 'https://rdsrv2.rd.go.th/landwht/formcal1.asp';

export const meta: ArticleMeta = {
  slug:        'land-transfer-fee',
  title:       'ค่าโอนที่ดินคิดยังไง — 4 รายการที่ต้องจ่ายจริง พร้อมวิธีคำนวณเอง',
  description: 'ค่าโอนที่ดินไม่ได้มีแค่ 2% เข้าใจครบ 4 รายการ ค่าธรรมเนียมโอน ภาษีธุรกิจเฉพาะ อากรแสตมป์ ภาษีหัก ณ ที่จ่าย และเหตุผลที่ที่ดินเปล่าไม่ได้ลดเหลือ 0.01%',
  excerpt:     'เห็นข่าวลดค่าโอนเหลือ 0.01% แล้วดีใจ — แต่ถ้าคุณซื้อที่ดินเปล่า คุณไม่ได้ลด แยกให้ครบทีละรายการว่าต้องจ่ายอะไรบ้าง คิดจากฐานไหน และใครควรเป็นคนจ่าย',
  date:        '2026-07-16',
  tags:        ['ค่าโอนที่ดิน', 'ค่าธรรมเนียมโอน', 'ภาษีธุรกิจเฉพาะ', 'อากรแสตมป์', 'ซื้อขายที่ดิน'],
  readMin:     6,
  cover:       'https://tnrmaphub.com/article-images/land-transfer-fee.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const ITEMS = [
  {
    t: 'ค่าธรรมเนียมการโอน',
    rate: '2%',
    base: 'ราคาประเมินทุนทรัพย์',
    d: 'เก็บทุกกรณีที่มีการจดทะเบียนโอนกรรมสิทธิ์ — ข้อสังเกตสำคัญคือคิดจากราคาประเมินอย่างเดียว ไม่เกี่ยวกับราคาที่ตกลงซื้อขายกันจริง',
  },
  {
    t: 'ภาษีธุรกิจเฉพาะ',
    rate: '3.3%',
    base: 'ราคาซื้อขาย หรือ ราคาประเมิน แล้วแต่อันไหนสูงกว่า',
    d: 'เสียเมื่อถือครองไม่ถึง 5 ปี (3% + ภาษีท้องถิ่น 0.3%) — ถ้าถือครบ 5 ปีขึ้นไป หรือมีชื่อในทะเบียนบ้านเกิน 1 ปี ได้รับยกเว้น',
  },
  {
    t: 'อากรแสตมป์',
    rate: '0.5%',
    base: 'ราคาซื้อขาย หรือ ราคาประเมิน แล้วแต่อันไหนสูงกว่า',
    d: 'จ่ายเฉพาะเมื่อ "ไม่ต้อง" เสียภาษีธุรกิจเฉพาะ — สองตัวนี้จ่ายอย่างใดอย่างหนึ่ง ไม่มีทางเสียซ้อนกัน',
  },
  {
    t: 'ภาษีเงินได้หัก ณ ที่จ่าย',
    rate: 'อัตราก้าวหน้า',
    base: 'ราคาประเมินทุนทรัพย์',
    d: 'บุคคลธรรมดาคำนวณตามจำนวนปีที่ถือครองด้วยอัตราก้าวหน้า — ตัวนี้แหละที่คนคำนวณเองผิดมากที่สุด (วิธีคิดอยู่หัวข้อถัดไป)',
  },
];

const DEDUCT = [
  { y: '1 ปี', r: '92%' },
  { y: '2 ปี', r: '84%' },
  { y: '3 ปี', r: '77%' },
  { y: '4 ปี', r: '71%' },
  { y: '5 ปี', r: '65%' },
  { y: '6 ปี', r: '60%' },
  { y: '7 ปี', r: '55%' },
  { y: '8 ปีขึ้นไป', r: '50%' },
];

const CALC_STEPS = [
  { n: 1, t: 'ตั้งฐานจากราคาประเมินทุนทรัพย์', d: 'ไม่ใช่ราคาที่ขายจริง — เช็กราคาประเมินได้ฟรีจากเว็บกรมธนารักษ์' },
  { n: 2, t: 'หักค่าใช้จ่ายเหมาตามจำนวนปีที่ถือครอง', d: 'ยิ่งถือนาน ยิ่งหักได้น้อย (ดูตารางด้านบน) — ถ้าที่ดินได้มาจากมรดกหรือการให้โดยเสน่หา ใช้หักเหมา 50%' },
  { n: 3, t: 'หารด้วยจำนวนปีที่ถือครอง', d: 'นับตามปี พ.ศ. และนับได้สูงสุด 10 ปี แม้ถือครองมานานกว่านั้น' },
  { n: 4, t: 'คำนวณภาษีตามอัตราก้าวหน้า', d: 'เอาเงินได้เฉลี่ยต่อปีไปเข้าบันไดอัตราภาษีเงินได้บุคคลธรรมดา' },
  { n: 5, t: 'คูณกลับด้วยจำนวนปีที่ถือครอง', d: 'ได้ตัวเลขภาษีหัก ณ ที่จ่ายที่ต้องชำระที่สำนักงานที่ดิน' },
];

export const FAQ = [
  { q: 'ซื้อที่ดินเปล่า ได้ลดค่าโอนเหลือ 0.01% ไหม?', a: 'ไม่ได้ — มาตรการลดค่าธรรมเนียมโอนและจดจำนองเหลือ 0.01% กำหนดประเภททรัพย์ไว้ว่าต้องเป็นที่ดินพร้อมอาคารที่อยู่อาศัย (บ้านเดี่ยว บ้านแฝด บ้านแถว ห้องแถว ตึกแถว) อาคารพาณิชย์ หรือห้องชุดในอาคารชุด ที่ดินเปล่าที่ไม่มีสิ่งปลูกสร้างไม่เข้าเกณฑ์ แม้ราคาจะต่ำกว่าเพดานก็ตาม จึงเสียค่าธรรมเนียมโอนอัตราปกติ 2%' },
  { q: 'ค่าโอน 2% คิดจากราคาที่ซื้อขายกันจริงหรือราคาประเมิน?', a: 'คิดจากราคาประเมินทุนทรัพย์เท่านั้น ไม่เกี่ยวกับราคาที่ตกลงกัน — ต่างจากภาษีธุรกิจเฉพาะและอากรแสตมป์ที่ใช้ราคาซื้อขายหรือราคาประเมินแล้วแต่อันไหนสูงกว่า จุดนี้เป็นสาเหตุที่หลายคนคำนวณค่าใช้จ่ายรวมผิด' },
  { q: 'ต้องเสียทั้งภาษีธุรกิจเฉพาะและอากรแสตมป์เลยไหม?', a: 'ไม่ — จ่ายอย่างใดอย่างหนึ่งเท่านั้น ถ้าเข้าเกณฑ์เสียภาษีธุรกิจเฉพาะ 3.3% ก็ไม่ต้องเสียอากรแสตมป์ 0.5% เจ้าหน้าที่สำนักงานที่ดินจะเป็นผู้พิจารณาจากระยะเวลาถือครองและข้อเท็จจริงของคุณ' },
  { q: 'ถือที่ดินครบ 5 ปีแล้ว ประหยัดได้เท่าไร?', a: 'ประหยัดส่วนต่างระหว่างภาษีธุรกิจเฉพาะ 3.3% กับอากรแสตมป์ 0.5% คือราว 2.8% ของฐานคำนวณ และยังได้หักค่าใช้จ่ายเหมาในการคำนวณภาษีหัก ณ ที่จ่ายลดลงตามปีที่ถือด้วย — ถ้าใกล้ครบ 5 ปี การรออีกไม่กี่เดือนอาจคุ้มมาก ลองคำนวณเทียบก่อนตัดสินใจขาย' },
  { q: 'ค่าโอนที่ดินใครเป็นคนจ่าย ผู้ซื้อหรือผู้ขาย?', a: 'กฎหมายไม่ได้กำหนดตายตัวว่าฝ่ายใดต้องจ่าย เป็นเรื่องที่ตกลงกันเอง — ในทางปฏิบัติที่พบบ่อยคือแบ่งคนละครึ่ง หรือผู้ขายรับผิดชอบภาษีของตัวเอง สิ่งสำคัญคือต้องระบุให้ชัดในสัญญาจะซื้อจะขายตั้งแต่แรก อย่าไปเถียงกันหน้าเคาน์เตอร์วันโอน' },
];

const SOURCES = [
  { name: 'กรมที่ดิน — หลักเกณฑ์คำนวณภาษีเงินได้ อากร และค่าธรรมเนียมการโอน', url: 'https://www.dol.go.th/en/question-answer/1408-119536' },
  { name: 'กรมสรรพากร — โปรแกรมคำนวณภาษีหัก ณ ที่จ่าย ขายอสังหาริมทรัพย์', url: 'https://rdsrv2.rd.go.th/landwht/formcal1.asp' },
  { name: 'กรมธนารักษ์ — ตรวจสอบราคาประเมินทุนทรัพย์', url: 'https://assessprice.treasury.go.th' },
  { name: 'ราชกิจจานุเบกษา — ประกาศ มท. การเรียกเก็บค่าธรรมเนียมจดทะเบียนสิทธิและนิติกรรม', url: 'https://www.ratchakitcha.soc.go.th/DATA/PDF/2564/E/024/T_0014.PDF' },
  { name: 'กรมที่ดิน — รายละเอียดมาตรการลดค่าโอน-จดจำนอง', url: 'https://www.dol.go.th/question-answer/1603-129226' },
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

export function LandTransferFee() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ค่าโอนที่ดินคิดยังไง
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          4 รายการที่ต้องจ่ายจริงที่สำนักงานที่ดิน คิดจากฐานไหน และทำไมที่ดินเปล่าไม่ได้ลด 0.01%
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Land Transfer Fees &amp; Taxes in Thailand — What You Actually Pay at the Land Office
        </p>
      </header>

      <Section title="ข่าวบอกว่าลดเหลือ 0.01% — แล้วทำไมคุณโดนเต็ม?">
        <p style={p}>
          พาดหัวข่าว "ลดค่าโอนเหลือ 0.01%" วิ่งเต็มหน้าฟีดมาหลายปี คนซื้อที่ดินจำนวนมากจึงตั้งงบไว้หลักพัน
          แล้วไปเจอบิลหลักหมื่นถึงหลักแสนที่เคาน์เตอร์สำนักงานที่ดิน
        </p>
        <p style={p}>
          เหตุผลไม่ใช่เจ้าหน้าที่คิดผิด แต่เป็นเพราะ <strong>มาตรการนั้นไม่เคยครอบคลุมที่ดินเปล่า</strong> —
          และแทบไม่มีบทความไหนบอกเรื่องนี้ เพราะเกือบทั้งหมดเขียนให้คนซื้อบ้านกับคอนโดอ่าน
          ถ้าคุณกำลังซื้อขายที่ดินเปล่า บทความนี้เขียนให้คุณโดยเฉพาะ
        </p>
      </Section>

      <Section title="ค่าโอนที่ดินมี 4 รายการ ไม่ใช่รายการเดียว">
        <p style={p}>
          คนส่วนใหญ่จำได้แค่ "2%" แล้วคิดว่าจบ — จริง ๆ แล้วมีถึง 4 รายการ
          และแต่ละรายการ <strong>คิดจากฐานคนละอย่างกัน</strong> ซึ่งเป็นต้นเหตุที่คำนวณเองแล้วเพี้ยน
        </p>
        <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
          {ITEMS.map(i => (
            <div key={i.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15.5, color: '#fff' }}>{i.t}</span>
                <span style={{ fontWeight: 900, fontSize: 15, color: C.green }}>{i.rate}</span>
              </div>
              <div style={{ fontSize: 13, color: C.cyan, marginBottom: 5 }}>ฐานคำนวณ: {i.base}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>{i.d}</div>
            </div>
          ))}
        </div>
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.25)',
          fontSize: 14, lineHeight: 1.6, color: C.text,
        }}>
          💡 <strong>จุดที่คนพลาดบ่อยที่สุด:</strong> ค่าธรรมเนียมโอน 2% คิดจาก <strong>ราคาประเมินอย่างเดียว</strong>{' '}
          ไม่เกี่ยวกับราคาที่ตกลงกัน แต่ภาษีธุรกิจเฉพาะกับอากรแสตมป์ใช้ <strong>ราคาที่สูงกว่า</strong> ระหว่างราคาขายกับราคาประเมิน —
          สองราคานี้ห่างกันได้มาก อ่านต่อที่{' '}
          <a href="/articles/appraisal-vs-market-price" style={{ color: C.cyan }}>
            ราคาประเมิน vs ราคาตลาด ต่างกันอย่างไร
          </a>
        </div>
        <p style={{ ...p, marginTop: 12 }}>
          และถ้าผู้ซื้อกู้ธนาคาร จะมี <strong>ค่าจดทะเบียนจำนองอีก 1%</strong> ของวงเงินจำนองเพิ่มเข้ามา —
          รายการนี้เป็นภาระของผู้กู้ ไม่ได้อยู่ในบิลค่าโอนของผู้ขาย
        </p>
      </Section>

      <Section title="ทำไมที่ดินเปล่าถึงไม่ได้ลดเหลือ 0.01%">
        <figure style={{ margin: '0 0 16px' }}>
          <img src="/article-images/land-transfer-fee-fig1.webp" alt="มุมโดรนถนนชนบทคั่นกลาง ฝั่งหนึ่งเป็นที่ดินเปล่าหญ้าแห้งมีหลักเขตต้นเดียว อีกฝั่งเป็นบ้านจัดสรรสร้างเสร็จพร้อมสนามหญ้าและรถจอดหน้าบ้าน"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ถนนเส้นเดียวกัน ราคาพอกัน — แต่ฝั่งที่มีบ้านได้ลดเหลือ 0.01% ส่วนฝั่งที่ดินเปล่าจ่าย 2% เต็ม
          </figcaption>
        </figure>
        <p style={p}>
          หัวใจอยู่ที่คำว่า <strong>"อาคาร"</strong> — ประกาศของมาตรการระบุประเภททรัพย์ที่ได้สิทธิไว้ชัดเจน ได้แก่
          ที่ดินพร้อมที่อยู่อาศัย บ้านเดี่ยว บ้านแฝด บ้านแถว (รวมห้องแถวและตึกแถว) อาคารพาณิชย์
          และห้องชุดในอาคารชุด ทั้งมือหนึ่งและมือสอง โดยมีเพดานราคาซื้อขายและราคาประเมินไม่เกิน 7 ล้านบาทต่อสัญญา
        </p>
        <p style={p}>
          <strong>ที่ดินเปล่าไม่อยู่ในรายการนั้น</strong> — ต่อให้ราคา 5 แสนบาท ก็ไม่เข้าเกณฑ์
          เพราะเกณฑ์ไม่ได้ดูที่ราคาอย่างเดียว แต่ดูว่ามีสิ่งปลูกสร้างไหม ผลคือที่ดินเปล่าเสียค่าธรรมเนียมโอน
          อัตราปกติ <strong>2% ของราคาประเมิน</strong> เสมอ
        </p>
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          background: 'rgba(255,179,0,0.06)', border: '1px solid rgba(255,179,0,0.25)',
          fontSize: 14, lineHeight: 1.6, color: C.text,
        }}>
          ⚠ <strong>มาตรการ 0.01% เป็นมาตรการชั่วคราว</strong> ที่ต่ออายุเป็นรอบ ๆ ตามมติคณะรัฐมนตรี
          (รอบปัจจุบันต่อถึง 30 มิถุนายน 2570) เงื่อนไขและเพดานราคาปรับเปลี่ยนได้ทุกรอบ —
          ถ้าคุณซื้อขายทรัพย์ที่มีอาคาร ให้เช็กประกาศล่าสุดของกรมที่ดินก่อนวันโอนเสมอ
          อย่าอ้างอิงบทความเก่าหรือข่าวเก่า
        </div>
      </Section>

      <Section title="ภาษีหัก ณ ที่จ่าย — ตัวที่คำนวณเองผิดมากที่สุด">
        <figure style={{ margin: '0 0 16px' }}>
          <img src="/article-images/land-transfer-fee-fig2.webp" alt="โฉนดที่ดินวางบนโต๊ะไม้ ข้างเครื่องคิดเลขที่จอยังว่างเปล่า ธนบัตรไทยเรียงเป็นพัด และปากกาวางทับ ภายใต้แสงอุ่นสาดจากด้านข้าง"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ตัวเลขบนเครื่องคิดเลขจะถูกหรือผิด อยู่ที่ว่าคุณเริ่มจากฐานไหน — ราคาประเมิน ไม่ใช่ราคาที่ตกลงกัน
          </figcaption>
        </figure>
        <p style={p}>
          สามรายการแรกคูณเปอร์เซ็นต์ตรง ๆ ได้เลย แต่ตัวนี้ไม่ใช่ —
          มันเป็น <strong>อัตราก้าวหน้าที่เฉลี่ยตามจำนวนปีที่ถือครอง</strong> ยิ่งถือนาน ภาระภาษีต่อปียิ่งเบาลง
          เริ่มจากตารางหักค่าใช้จ่ายเหมาก่อน
        </p>
        <div style={{ overflowX: 'auto', marginBottom: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 420 }}>
            <thead>
              <tr>
                {['จำนวนปีที่ถือครอง', 'หักค่าใช้จ่ายเหมาได้'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px', color: C.cyan, fontWeight: 700,
                    borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEDUCT.map(d => (
                <tr key={d.y}>
                  <td style={{ padding: '9px 12px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: '#fff' }}>{d.y}</td>
                  <td style={{ padding: '9px 12px', borderBottom: `1px solid ${C.border}`, color: C.green, fontWeight: 700 }}>{d.r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: -4, marginBottom: 14 }}>
          ตารางนี้ใช้กับที่ดินที่ได้มา "โดยทางอื่น" เช่น ซื้อมาเอง — ถ้าได้มาจาก
          <strong> มรดกหรือการให้โดยเสน่หา</strong> ใช้หักเหมา 50% ไม่ต้องดูจำนวนปี
          (กำลังจัดการที่ดินมรดกอยู่? อ่าน{' '}
          <a href="/articles/inherited-land-division" style={{ color: C.cyan }}>
            แบ่งที่ดินมรดกให้ทายาท
          </a>)
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {CALC_STEPS.map(s => (
            <li key={s.n} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                background: C.cyan, color: '#0d1520', fontWeight: 900, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.n}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 10,
          background: 'rgba(64,196,255,0.06)', border: '1px solid rgba(64,196,255,0.25)',
          fontSize: 14, lineHeight: 1.6, color: C.text,
        }}>
          🧮 <strong>อย่าคำนวณมือ</strong> — กรมสรรพากรมีโปรแกรมคำนวณภาษีหัก ณ ที่จ่ายสำหรับการขายอสังหาริมทรัพย์
          ให้ใช้ฟรีบนเว็บทางการ ใส่ราคาประเมินกับปีที่ถือครองแล้วได้ตัวเลขที่ตรงกับที่สำนักงานที่ดินคิดจริง:{' '}
          <a href={RD_CALC} target="_blank" rel="noopener noreferrer nofollow" style={{ color: C.cyan, wordBreak: 'break-all' }}>
            rdsrv2.rd.go.th/landwht/formcal1.asp
          </a>
        </div>
      </Section>

      <Section title="ใครควรเป็นคนจ่าย? — กฎหมายไม่ได้บอก">
        <p style={p}>
          คำถามนี้ทำให้ดีลล่มมาแล้วนับไม่ถ้วน คำตอบคือ <strong>กฎหมายไม่ได้กำหนดว่าฝ่ายไหนต้องจ่าย</strong>{' '}
          มันเป็นเรื่องที่ตกลงกันล้วน ๆ ในทางปฏิบัติที่เห็นบ่อยคือแบ่งคนละครึ่ง
          หรือผู้ขายรับผิดชอบภาษีที่เป็นของตัวเอง (ธุรกิจเฉพาะและหัก ณ ที่จ่าย) ส่วนผู้ซื้อรับค่าธรรมเนียมโอน
        </p>
        <p style={p}>
          สิ่งที่ต้องทำคือ <strong>เขียนลงสัญญาจะซื้อจะขายให้ชัดตั้งแต่วันวางมัดจำ</strong> ว่าใครจ่ายรายการไหน คิดจากฐานอะไร
          ไม่ใช่ไปคุยกันหน้าเคาน์เตอร์วันโอน ตอนที่ทุกคนลางานมาแล้วและกำลังกดดันกัน —
          ดูว่าสัญญาต้องมีอะไรบ้างที่{' '}
          <a href="/articles/land-sale-purchase-agreement" style={{ color: C.cyan }}>
            สัญญาจะซื้อจะขายที่ดิน ต้องมีอะไรบ้าง
          </a>
        </p>
      </Section>

      <Section title="สรุป — 3 อย่างที่ต้องรู้ก่อนถึงวันโอน">
        <p style={p}>
          <strong>(1) เปิดราคาประเมินก่อน</strong> เพราะสามในสี่รายการอิงตัวเลขนี้ ไม่ใช่ราคาที่คุณตกลงกัน —
          เช็กฟรีได้จากเว็บกรมธนารักษ์ <strong>(2) นับปีถือครองให้แม่น</strong> เส้น 5 ปีคือเส้นที่แพงที่สุดในเรื่องนี้
          ข้ามได้ประหยัดราว 2.8% ของฐานคำนวณ ถ้าใกล้ครบให้ลองคำนวณเทียบก่อนรีบขาย
          <strong> (3) ถ้าเป็นที่ดินเปล่า ตัดความหวังเรื่อง 0.01% ทิ้งไป</strong> แล้วตั้งงบ 2% ของราคาประเมินไว้ตั้งแต่แรก
        </p>
        <p style={p}>
          ทำสามข้อนี้ก่อนวางมัดจำ คุณจะรู้ตัวเลขจริงทั้งบิลตั้งแต่วันแรก และเอาไปใช้ต่อรองราคาได้ด้วย —
          ดีกว่ารู้ตอนยืนอยู่หน้าเคาน์เตอร์แล้วเงินไม่พอ
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
        ⚠ <strong>ข้อควรระวัง:</strong> อัตราค่าธรรมเนียม ภาษี และเงื่อนไขมาตรการของรัฐเปลี่ยนแปลงได้
        และการคำนวณจริงขึ้นกับข้อเท็จจริงรายแปลง เช่น ประเภทผู้ขาย วิธีได้มาซึ่งที่ดิน และการยกเว้นเฉพาะกรณี —
        ตัวเลขในบทความนี้ใช้เพื่อวางแผนเบื้องต้นเท่านั้น ก่อนโอนจริงควรสอบถามสำนักงานที่ดินในพื้นที่
        หรือปรึกษาผู้เชี่ยวชาญด้านภาษีทุกครั้ง
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub เช็กราคาประเมินแปลงจริง
        </a>
      </div>
    </article>
  );
}

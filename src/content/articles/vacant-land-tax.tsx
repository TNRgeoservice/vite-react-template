// ════════════════════════════════════════
// src/content/articles/vacant-land-tax.tsx
// บทความ: ภาษีที่ดินเปล่า/รกร้าง เสียเท่าไร + วิธีลดแบบถูกกฎหมาย
// Body = inline style + plain <a> เท่านั้น (prerender ด้วย renderToStaticMarkup)
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'vacant-land-tax',
  title:       'ภาษีที่ดินเปล่า ที่รกร้างเสียเท่าไร — วิธีคำนวณ + ลดภาษีแบบถูกกฎหมาย',
  description: 'ที่ดินเปล่าไม่ทำประโยชน์เสียภาษีแพงสุดใน 4 ประเภท และปล่อยรกร้างนานยิ่งโดนเพิ่ม — สรุปอัตราภาษีที่ดินและสิ่งปลูกสร้าง วิธีคำนวณ และวิธีลดภาระแบบถูกกฎหมาย',
  excerpt:     'ปล่อยที่ดินทิ้งไว้เฉย ๆ ภาษีแพงกว่าทำเกษตรหลายสิบเท่า และยิ่งรกร้างนานยิ่งโดนเพิ่ม — สรุปอัตราภาษีที่ดิน 4 ประเภท วิธีคำนวณจากราคาประเมิน และทางลดภาระที่ทำได้จริง',
  date:        '2026-07-21',
  tags:        ['ภาษีที่ดิน', 'ที่ดินรกร้าง', 'ที่ดินเปล่า', 'ภาษีที่ดินและสิ่งปลูกสร้าง'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/vacant-land-tax.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

export const FAQ = [
  { q: 'ที่ดินเปล่าไม่ได้ใช้ทำอะไร ต้องเสียภาษีไหม?', a: 'ต้องเสีย ที่ดินที่ทิ้งไว้ว่างเปล่าหรือไม่ได้ทำประโยชน์ตามควรแก่สภาพ จัดอยู่ในประเภทที่เสียภาษีอัตราสูงสุดตาม พ.ร.บ.ภาษีที่ดินและสิ่งปลูกสร้าง พ.ศ. 2562 และถ้าปล่อยรกร้างต่อเนื่องหลายปี อัตราจะถูกปรับเพิ่มขึ้นอีกเป็นขั้น ๆ' },
  { q: 'ปลูกกล้วยบนที่ดินเปล่า ช่วยลดภาษีได้จริงไหม?', a: 'ได้จริง ถ้าทำถึงเกณฑ์ การใช้ที่ดินทำเกษตรกรรมตามเกณฑ์ขั้นต่ำที่ทางการกำหนด ทำให้ที่ดินถูกจัดประเภทเป็นเกษตรกรรมซึ่งอัตราภาษีต่ำกว่าที่ดินรกร้างมาก แต่ต้องทำจริงจังต่อเนื่อง ไม่ใช่ปลูกทิ้งขว้างพอเป็นพิธี เพราะเจ้าหน้าที่ อปท. มีอำนาจสำรวจการใช้ประโยชน์จริง' },
  { q: 'ภาษีที่ดินคำนวณจากราคาซื้อขายหรือราคาประเมิน?', a: 'คำนวณจากราคาประเมินทุนทรัพย์ของกรมธนารักษ์ ไม่ใช่ราคาที่ซื้อขายกันจริง ฐานภาษี = มูลค่าราคาประเมินหักด้วยรายการยกเว้น/ลดหย่อน (ถ้ามี) แล้วคูณอัตราภาษีตามประเภทการใช้ประโยชน์' },
  { q: 'ใครเป็นคนเก็บภาษีที่ดิน จ่ายที่ไหน?', a: 'องค์กรปกครองส่วนท้องถิ่นที่ที่ดินตั้งอยู่ (เทศบาล อบต. กทม. เมืองพัทยา) เป็นผู้ประเมินและจัดเก็บ โดยจะส่งหนังสือแจ้งการประเมินให้เจ้าของ และชำระได้ที่สำนักงานท้องถิ่นนั้นหรือช่องทางที่ท้องถิ่นกำหนด' },
  { q: 'ไม่จ่ายภาษีที่ดิน จะเกิดอะไรขึ้น?', a: 'มีเบี้ยปรับสูงสุดถึง 40% ของภาษีค้าง (ลดเหลือ 10-20% ถ้ารีบชำระตามเงื่อนไข) บวกเงินเพิ่มอีก 1% ต่อเดือน และท้องถิ่นมีอำนาจติดตามหนี้ภาษีค้างชำระ ที่สำคัญสำหรับคนจะขายที่ดิน คือภาษีค้างอาจเป็นอุปสรรคตอนจดทะเบียนโอน จึงควรเคลียร์ให้ครบก่อนทำธุรกรรม' },
];

const SOURCES = [
  { name: 'พ.ร.บ.ภาษีที่ดินและสิ่งปลูกสร้าง พ.ศ. 2562 (ระบบกฎหมาย สนง.กฤษฎีกา)', url: 'https://www.krisdika.go.th' },
  { name: 'ราคาประเมินที่ดิน (กรมธนารักษ์)', url: 'https://assessprice.treasury.go.th' },
  { name: 'กรมส่งเสริมการปกครองท้องถิ่น (หน่วยงานกำกับ อปท. ผู้จัดเก็บ)', url: 'https://www.dla.go.th' },
  { name: 'กรมที่ดิน (DOL)', url: 'https://www.dol.go.th' },
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

export function VacantLandTax() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ภาษีที่ดินเปล่า ที่รกร้างเสียเท่าไร?
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          สรุปอัตราภาษีที่ดินและสิ่งปลูกสร้าง วิธีคำนวณ และทางลดภาระแบบถูกกฎหมาย
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Thailand Land and Building Tax on Vacant Land — Rates and Legal Ways to Reduce
        </p>
      </header>

      <Section title="ทำไมที่ดินที่ 'ไม่ได้ทำอะไรเลย' กลับเสียภาษีแพงสุด?">
        <p style={p}>
          หลายคนซื้อที่ดินเก็บไว้เฉย ๆ รอราคาขึ้น แล้ววันหนึ่งหนังสือแจ้งประเมินภาษีก็มาถึงหน้าบ้าน —
          ตัวเลขสูงกว่าแปลงข้าง ๆ ที่ปลูกมันสำปะหลังอยู่หลายเท่า ทั้งที่เนื้อที่พอกัน
        </p>
        <p style={p}>
          นั่นไม่ใช่ความผิดพลาดของเจ้าหน้าที่
          กฎหมายภาษีที่ดินและสิ่งปลูกสร้างตั้งใจออกแบบมาแบบนั้น:
          ที่ดินที่ <strong>ทิ้งไว้ว่างเปล่าหรือไม่ได้ทำประโยชน์ตามควรแก่สภาพ</strong> ถูกจัดเข้ากลุ่มอัตราสูงสุด
          เพื่อกดดันให้เจ้าของเอาที่ดินออกมาใช้ประโยชน์ ไม่ใช่กักตุนเก็งกำไร
          ยิ่งปล่อยรกร้างนาน อัตรายิ่งถูกปรับเพิ่มเป็นขั้นบันได
          ใครถือที่ดินเปล่าอยู่ จึงต้องรู้กติกานี้ก่อนที่ภาษีสะสมจะกินกำไรที่หวังไว้
        </p>
      </Section>

      <Section title="ภาษีนี้เก็บจากใคร เมื่อไหร่?">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ผู้เสียภาษี: เจ้าของที่ดิน/สิ่งปลูกสร้าง หรือผู้ครอบครองทำประโยชน์ในที่ดินของรัฐ ณ วันที่ 1 มกราคมของปีภาษีนั้น',
            'ผู้จัดเก็บ: องค์กรปกครองส่วนท้องถิ่น (เทศบาล อบต. กทม. เมืองพัทยา) ที่ที่ดินตั้งอยู่ — ไม่ใช่กรมสรรพากร',
            'ฐานภาษี: ราคาประเมินทุนทรัพย์ของกรมธนารักษ์ ไม่ใช่ราคาซื้อขายจริง',
            'กำหนดชำระตามปกติ: ภายในเดือนเมษายนของทุกปี (ท้องถิ่น/รัฐอาจประกาศขยายเวลาเป็นรายปี — ดูหนังสือแจ้งประเมินของปีนั้นเป็นหลัก)',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 10 }}>
          ฐานภาษีมาจากราคาประเมิน — เช็คราคาประเมินแปลงของคุณเองได้ฟรี ดูวิธีที่{' '}
          <a href="/articles/land-appraisal-price-online" style={{ color: C.cyan }}>
            เช็คราคาประเมินที่ดินออนไลน์ฟรี 2 เว็บราชการ
          </a>
        </p>
      </Section>

      <Section title="ที่ดิน 4 ประเภท เสียภาษีต่างกันแค่ไหน?">
        <p style={{ ...p, color: C.muted, fontSize: 13, marginTop: -4 }}>
          กฎหมายแบ่งการใช้ประโยชน์เป็น 4 ประเภท — ประเภทไหนอัตราเท่าไรขึ้นกับมูลค่าราคาประเมินเป็นขั้นบันได
        </p>
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
            <thead>
              <tr>
                {['ประเภทการใช้ประโยชน์', 'อัตราที่จัดเก็บจริง (ขั้นบันไดตามมูลค่า)', 'จุดที่ควรรู้'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px', color: C.cyan, fontWeight: 700,
                    borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['เกษตรกรรม', '0.01% – 0.1%', 'ถูกสุด — บุคคลธรรมดาได้ยกเว้นมูลค่า 50 ล้านบาทแรกต่อเขตท้องถิ่น'],
                ['ที่อยู่อาศัย', '0.02% – 0.1%', 'บ้านหลังหลัก (เจ้าของทั้งที่ดิน+บ้าน มีชื่อในทะเบียนบ้าน) ยกเว้น 50 ล้านบาทแรก'],
                ['พาณิชยกรรม/อื่น ๆ', '0.3% – 0.7%', 'ใช้เชิงพาณิชย์ ให้เช่า ทำธุรกิจ'],
                ['ที่ดินรกร้างว่างเปล่า', 'เริ่ม 0.3% และปรับเพิ่มเมื่อรกร้างต่อเนื่อง', 'อัตราเริ่มเท่าพาณิชย์ แต่โดนบวกเพิ่มเมื่อทิ้งรกร้างนาน'],
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
          อัตราในตารางเป็นอัตราจัดเก็บที่ใช้อยู่ในปัจจุบันตามกฎหมายและพระราชกฤษฎีกากำหนดอัตราภาษี
          — เพดานสูงสุดที่ พ.ร.บ. ให้อำนาจไว้สูงกว่านี้ และรัฐปรับอัตรา/มาตรการลดหย่อนได้เป็นรายปี
          ตัวเลขสุดท้ายให้ยึดหนังสือแจ้งการประเมินของ อปท. ในปีนั้น
        </p>
      </Section>

      <Section title="ปล่อยรกร้างนาน โดนหนักแค่ไหน?">
        <p style={p}>
          จุดที่เจ็บที่สุดของคนถือที่ดินเปล่า: ที่ดินที่ทิ้งไว้ว่างเปล่า <strong>ติดต่อกัน 3 ปี</strong> จะถูกเก็บเพิ่มอีก{' '}
          <strong>0.3%</strong> ในปีที่ 4 และถ้ายังปล่อยรกร้างต่อ จะถูกบวกเพิ่ม 0.3% ทุก ๆ 3 ปี
          โดยรวมแล้วอัตราไต่ได้สูงสุดถึง <strong>3%</strong> ของราคาประเมิน
        </p>
        <figure style={{ margin: '14px 0 12px' }}>
          <img src="/article-images/vacant-land-tax-fig1.webp" alt="ที่ดินรกร้างว่างเปล่าหญ้าขึ้นสูง เสี่ยงโดนภาษีที่ดินอัตราเพิ่ม"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ทิ้งรกร้างติดต่อกัน 3 ปี = โดนบวกเพิ่ม 0.3% และบวกซ้ำทุก 3 ปี จนแตะเพดาน 3%
          </figcaption>
        </figure>
        <p style={p}>
          ลองคิดเป็นเงินจริง: ที่ดินเปล่าราคาประเมิน 5 ล้านบาท เสียปีละราว 15,000 บาท (อัตรา 0.3%)
          ถ้าปล่อยรกร้างจนโดนบวกเพิ่ม ภาระจะขยับขึ้นเรื่อย ๆ ถือครบสิบปีเงินภาษีสะสมอาจแตะหลักแสน —
          เงินก้อนนี้กินส่วนต่างกำไรที่หวังจากราคาที่ดินขึ้นโดยตรง
        </p>
      </Section>

      <Section title="วิธีคำนวณภาษีที่ดินเปล่า (ดูทีละขั้น)">
        <ol style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', display: 'grid', gap: 10 }}>
          {[
            { n: 1, t: 'หามูลค่าฐานภาษี', d: 'ราคาประเมินทุนทรัพย์ต่อตารางวา × เนื้อที่ (เช็คได้ที่ assessprice.treasury.go.th)' },
            { n: 2, t: 'หักรายการยกเว้น/ลดหย่อน (ถ้ามี)', d: 'เช่น เกษตรกรรมของบุคคลธรรมดาได้ยกเว้น 50 ล้านบาทแรกต่อเขตท้องถิ่น — ที่ดินเปล่ารกร้างไม่มีสิทธินี้' },
            { n: 3, t: 'คูณอัตราตามประเภท', d: 'ที่ดินเปล่า/ไม่ทำประโยชน์เริ่มที่ 0.3% ของมูลค่า และเพิ่มตามขั้นมูลค่าและจำนวนปีที่รกร้าง' },
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
        <div style={{
          marginTop: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>ตัวอย่าง</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
            ที่ดินเปล่า 2 ไร่ ราคาประเมินรวม 4,000,000 บาท ไม่เข้าข่ายยกเว้นใด ๆ<br />
            ภาษีต่อปี = 4,000,000 × 0.3% = <span style={{ color: C.green, fontWeight: 700 }}>12,000 บาท/ปี</span><br />
            แปลงเดียวกันถ้าทำเกษตรถึงเกณฑ์ (บุคคลธรรมดา มูลค่าไม่เกิน 50 ล้าน) = <span style={{ color: C.green, fontWeight: 700 }}>ได้รับยกเว้น</span>
          </div>
        </div>
      </Section>

      <Section title="ลดภาษีที่ดินเปล่ายังไง ให้ถูกกฎหมาย?">
        <p style={p}>
          หัวใจคือเปลี่ยนสถานะจาก "ไม่ทำประโยชน์" ให้เป็น "ใช้ประโยชน์" จริง —
          ทางที่นิยมที่สุดคือทำเกษตรกรรม เพราะเปลี่ยนอัตราจากกลุ่มแพงสุดไปอยู่กลุ่มถูกสุดทันทีที่เข้าเกณฑ์
        </p>
        <figure style={{ margin: '14px 0 12px' }}>
          <img src="/article-images/vacant-land-tax-fig2.webp" alt="แปลงที่ดินปลูกกล้วยเป็นแถวเพื่อใช้ประโยชน์เกษตรกรรม ลดภาษีที่ดิน"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            เปลี่ยนที่ดินเปล่าเป็นแปลงเกษตรจริงจัง = ย้ายจากอัตราแพงสุดไปกลุ่มถูกสุด
          </figcaption>
        </figure>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ปลูกพืชให้ถึงเกณฑ์ขั้นต่ำต่อไร่ตามประกาศของทางการ — เช่น กล้วย 200 ต้น/ไร่ มะนาว 50 ต้น/ไร่ มะม่วง 20 ต้น/ไร่ (เกณฑ์มีอีกหลายสิบชนิดพืช เช็คบัญชีแนบท้ายประกาศฯ กับ อปท. ก่อนลงมือ)',
            'ทำต่อเนื่องจริง ไม่ใช่ปลูกเฉพาะช่วงสำรวจ — เจ้าหน้าที่ท้องถิ่นมีอำนาจออกสำรวจการใช้ประโยชน์จริง',
            'ให้เช่าทำเกษตร ก็ทำให้ที่ดินถูกใช้ประโยชน์เกษตรกรรมได้ (ตกลงเงื่อนไขให้ชัดเป็นหนังสือ)',
            'แบ่งแปลงขายส่วนที่ไม่ได้ใช้ — ลดทั้งภาระภาษีและได้เงินทุนกลับมา',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 10 }}>
          ถ้าเลือกทางแบ่งแปลง — ดูขั้นตอนทั้งหมดที่{' '}
          <a href="/articles/land-subdivision-steps" style={{ color: C.cyan }}>
            5 ขั้นตอนแบ่งแปลงที่ดินตามกฎหมาย
          </a>{' '}ก่อนวางแผน
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
        ⚠ <strong>ข้อควรระวัง:</strong> อัตราภาษี มาตรการลดหย่อน และกำหนดเวลาชำระ
        อาจเปลี่ยนแปลงตามประกาศของรัฐและท้องถิ่นเป็นรายปี ตัวเลขในบทความใช้เพื่อความเข้าใจภาพรวม
        การประเมินจริงของแปลงคุณให้ยึดหนังสือแจ้งการประเมินจาก อปท. เป็นหลัก
        และกรณีมูลค่าสูงควรปรึกษานักภาษี/สำนักงานท้องถิ่นโดยตรง
      </p>

      <Section title="สรุปสำหรับคนถือที่ดินเปล่า">
        <p style={p}>
          สามเรื่องที่ควรทำตั้งแต่ปีนี้:
          เช็คราคาประเมินแปลงของคุณเพื่อรู้ฐานภาษีที่แท้จริง —
          ตัดสินใจให้ชัดว่าจะใช้ประโยชน์ยังไง (ทำเกษตรถึงเกณฑ์ ให้เช่า หรือแบ่งขายส่วนเกิน)
          อย่าปล่อยเฉยจนโดนนับเป็นรกร้างต่อเนื่อง —
          และเก็บหลักฐานการใช้ประโยชน์ไว้เสมอ เผื่อโต้แย้งผลประเมิน
          ภาษีที่ดินไม่ใช่เรื่องหลบได้ แต่บริหารให้ถูกลงได้มาก ถ้าลงมือก่อนถูกจัดกลุ่มรกร้าง
        </p>
      </Section>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub ดูแปลงและราคาประเมิน
        </a>
      </div>
    </article>
  );
}

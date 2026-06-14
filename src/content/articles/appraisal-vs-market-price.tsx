// ════════════════════════════════════════
// src/content/articles/appraisal-vs-market-price.tsx
// บทความ: ราคาประเมิน vs ราคาตลาด ต่างกันอย่างไร
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'appraisal-vs-market-price',
  title:       'ราคาประเมิน vs ราคาตลาด ต่างกันอย่างไร — ใช้ตัวไหนตอนซื้อขายที่ดิน',
  description: 'ราคาประเมินที่ดินกับราคาตลาดต่างกันคนละเรื่อง รู้ก่อนซื้อขายไม่เสียเปรียบ — ใครกำหนด ใช้คำนวณอะไร ทำไมราคาตลาดมักสูงกว่า พร้อมตารางเทียบชัด',
  excerpt:     'ราคาประเมินใช้คิดค่าโอน-ภาษี ราคาตลาดคือราคาซื้อขายจริง — สองตัวนี้ห่างกันได้หลายเท่าในทำเลทอง รู้ความต่างก่อนวางมัดจำ จะไม่ถูกหลอกเรื่องราคา',
  date:        '2026-06-14',
  tags:        ['ราคาประเมินที่ดิน', 'ราคาตลาดที่ดิน', 'ซื้อขายที่ดิน', 'ค่าโอน'],
  readMin:     6,
  cover:       'https://tnrmaphub.com/article-images/appraisal-vs-market-price.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const ROWS = [
  { topic: 'ใครกำหนด',        appraise: 'กรมธนารักษ์ (ราชการ)',                 market: 'ตลาด — ผู้ซื้อผู้ขายตกลงกันเอง' },
  { topic: 'อ้างอิงจากอะไร',   appraise: 'หลักเกณฑ์ราชการ ทำเป็นรอบ',            market: 'อุปสงค์-อุปทาน ทำเล ศักยภาพ ณ ขณะนั้น' },
  { topic: 'ปรับบ่อยแค่ไหน',   appraise: 'คงที่ทั้งรอบ (รอบละหลายปี)',           market: 'เปลี่ยนตลอดเวลา ตามตลาด' },
  { topic: 'ระดับราคา',        appraise: 'มักต่ำกว่าตลาด',                       market: 'มักสูงกว่าประเมิน โดยเฉพาะทำเลทอง' },
  { topic: 'ใช้ทำอะไร',        appraise: 'คิดค่าโอน ภาษี จดจำนอง',              market: 'ตั้งราคาซื้อขายจริง ขอสินเชื่อ' },
  { topic: 'เช็กที่ไหน',       appraise: 'assessprice.treasury.go.th (ฟรี)',     market: 'เทียบประกาศขายในทำเล / ผู้ประเมินเอกชน' },
];

export const FAQ = [
  { q: 'ราคาประเมินกับราคาตลาด ต่างกันมากไหม?', a: 'ต่างกันได้มาก ในทำเลทั่วไปราคาตลาดอาจสูงกว่าราคาประเมินไม่กี่สิบเปอร์เซ็นต์ แต่ในทำเลทองหรือพื้นที่ที่กำลังเติบโต ราคาตลาดอาจสูงกว่าราคาประเมินหลายเท่า เพราะราคาประเมินปรับเป็นรอบ ตามตลาดที่ขึ้นเร็วไม่ทัน' },
  { q: 'ตอนซื้อขายที่ดิน ใช้ราคาไหนคิดค่าโอน?', a: 'ค่าธรรมเนียมการโอนและค่าจดจำนองที่สำนักงานที่ดินคิดจากราคาประเมินของกรมธนารักษ์ ไม่ใช่ราคาที่คุณซื้อขายจริง ส่วนภาษีบางตัวใช้ราคาที่สูงกว่าระหว่างราคาประเมินกับราคาขาย' },
  { q: 'ซื้อที่ดินควรยึดราคาประเมินไหม?', a: 'ใช้ราคาประเมินเป็นจุดอ้างอิงเริ่มต้นได้ แต่อย่ายึดเป็นราคาซื้อขาย เพราะราคาตลาดจริงต่างออกไป ควรเทียบกับราคาประกาศขายของที่ดินใกล้เคียงในทำเลเดียวกันด้วย' },
  { q: 'ราคาประเมินสูงกว่าราคาตลาดได้ไหม?', a: 'ได้ในบางกรณี เช่น ทำเลที่ตลาดซบเซาหรือราคาตกหลังรอบประเมิน ที่ดินบางแปลงอาจขายจริงต่ำกว่าราคาประเมิน จึงต้องดูสภาพตลาดปัจจุบันประกอบเสมอ' },
  { q: 'ธนาคารปล่อยกู้ตามราคาไหน?', a: 'ธนาคารใช้ราคาประเมินของผู้ประเมินที่ธนาคารแต่งตั้ง ซึ่งอิงราคาตลาดแต่ตีค่าแบบระมัดระวัง มักให้วงเงินราว 70–80% ของราคาที่ประเมินได้ ไม่ใช่ราคาประเมินราชการ' },
];

const SOURCES = [
  { name: 'ราคาประเมินที่ดินและสิ่งปลูกสร้าง (กรมธนารักษ์)', url: 'https://assessprice.treasury.go.th' },
  { name: 'LandsMaps ค้นหาแปลงและโฉนด (กรมที่ดิน)', url: 'https://landsmaps.dol.go.th' },
  { name: 'กรมที่ดิน — ค่าธรรมเนียมและภาษีการโอน', url: 'https://www.dol.go.th' },
  { name: 'กรมสรรพากร — ภาษีที่เกี่ยวกับอสังหาริมทรัพย์', url: 'https://www.rd.go.th' },
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

export function AppraisalVsMarketPrice() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          ราคาประเมิน vs ราคาตลาด ต่างกันอย่างไร
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          รู้ความต่างก่อนซื้อขายที่ดิน จะไม่ถูกหลอกเรื่องราคา
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Appraised Value vs Market Price of Land — What's the Difference?
        </p>
      </header>

      <Section title="คนละราคา อย่าเอามาปนกัน">
        <p style={p}>
          คนขายบอก "ที่แปลงนี้ราคาประเมินตั้งสามล้าน" แล้วคุณก็เผลอคิดว่ามันคุ้ม —
          จุดนี้แหละที่หลายคนพลาด เพราะ <strong>ราคาประเมิน</strong> กับ <strong>ราคาตลาด</strong>
          เป็นคนละค่ากันโดยสิ้นเชิง และมักห่างกันไกลกว่าที่คิด
        </p>
        <p style={p}>
          ราคาประเมินคือราคาที่ราชการกำหนดไว้สำหรับคิดค่าธรรมเนียมและภาษี
          ส่วนราคาตลาดคือราคาที่คนซื้อคนขายตกลงซื้อขายกันจริง ๆ
          ถ้าคุณแยกสองตัวนี้ออก คุณจะตั้งราคาซื้อ-ขายได้แม่น และประเมินค่าใช้จ่ายตอนโอนได้ถูก
        </p>
      </Section>

      <Section title="ราคาประเมินที่ดิน คืออะไร?">
        <p style={p}>
          ราคาประเมินที่ดิน คือ ราคากลางที่ <strong>กรมธนารักษ์</strong> กำหนดขึ้นเพื่อใช้เป็นฐาน
          คำนวณค่าธรรมเนียมและภาษีในการจดทะเบียนสิทธิและนิติกรรมที่สำนักงานที่ดิน
          ราคานี้ทำเป็น <strong>รอบ</strong> (รอบละหลายปี) จึงค่อนข้างคงที่ตลอดรอบ
          ไม่ขยับขึ้นลงตามตลาดรายวัน
        </p>
        <p style={p}>
          จุดสำคัญ: ราคาประเมินเป็นราคา "ทางการ" มีไว้ให้ภาครัฐเก็บค่าธรรมเนียม
          ไม่ได้สะท้อนว่าที่ดินซื้อขายกันจริงเท่าไร คุณเช็กได้ฟรีที่เว็บกรมธนารักษ์
          ด้วยเลขโฉนดหรือพิกัด
        </p>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 10 }}>
          อยากดูตัวเลขจริงของแปลงคุณ —{' '}
          <a href="/articles/land-appraisal-price-online" style={{ color: C.cyan }}>
            เช็คราคาประเมินที่ดินออนไลน์ฟรี 2 เว็บราชการ
          </a>{' '}ทำเองได้ใน 5 นาที
        </p>
      </Section>

      <Section title="ราคาตลาดที่ดิน คืออะไร?">
        <p style={p}>
          ราคาตลาด คือ ราคาที่ผู้ซื้อกับผู้ขายตกลงซื้อขายกันจริงในทำเลนั้น ณ ช่วงเวลานั้น
          มันขึ้นอยู่กับ <strong>ความต้องการ</strong> ทำเล ศักยภาพการพัฒนา ถนนตัดใหม่ รถไฟฟ้า
          และข่าวโครงการรัฐ ทุกอย่างที่ทำให้คนอยากได้ที่แปลงนั้นมากขึ้นหรือน้อยลง
        </p>
        <p style={p}>
          เพราะอิงตลาด ราคานี้จึง <strong>เปลี่ยนตลอดเวลา</strong> และในทำเลที่กำลังโต
          มันมักวิ่งขึ้นเร็วกว่าราคาประเมินที่ปรับเป็นรอบ ผลคือราคาตลาดมักสูงกว่าราคาประเมิน
          บางทำเลทองห่างกันหลายเท่า
        </p>
      </Section>

      <Section title="ตารางเทียบชัด ๆ">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 480 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: C.muted, fontWeight: 700, borderBottom: `1px solid ${C.border}`, width: '22%' }}></th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: C.cyan, fontWeight: 800, borderBottom: `1px solid ${C.border}` }}>ราคาประเมิน</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: C.green, fontWeight: 800, borderBottom: `1px solid ${C.border}` }}>ราคาตลาด</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.topic}>
                  <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 700, borderBottom: `1px solid ${C.border}`, verticalAlign: 'top' }}>{r.topic}</td>
                  <td style={{ padding: '10px 12px', color: C.text, borderBottom: `1px solid ${C.border}`, verticalAlign: 'top', lineHeight: 1.5 }}>{r.appraise}</td>
                  <td style={{ padding: '10px 12px', color: C.text, borderBottom: `1px solid ${C.border}`, verticalAlign: 'top', lineHeight: 1.5 }}>{r.market}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="ตอนซื้อขายจริง ใช้ราคาไหน?">
        <figure style={{ margin: '0 0 16px' }}>
          <img src="/article-images/appraisal-vs-market-price-fig2.webp" alt="โต๊ะทำธุรกรรมที่สำนักงานที่ดิน มีโฉนด เงินสด และการเซ็นโอนกรรมสิทธิ์"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ราคาที่จ่ายให้คนขายคือราคาตลาด แต่ค่าโอน-จดจำนองที่สำนักงานที่ดินคิดจากราคาประเมิน
          </figcaption>
        </figure>
        <p style={p}>
          คำตอบคือ <strong>ใช้ทั้งคู่ คนละหน้าที่</strong> นี่คือจุดที่ทำให้คนสับสนที่สุด ลองแยกแบบนี้:
        </p>
        <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ตั้งราคาซื้อ-ขาย → ใช้ราคาตลาด (เทียบประกาศขายในทำเลเดียวกัน)',
            'คิดค่าธรรมเนียมการโอนและค่าจดจำนองที่สำนักงานที่ดิน → คิดจากราคาประเมิน',
            'ภาษีบางตัว เช่น ภาษีธุรกิจเฉพาะ → ใช้ราคาที่สูงกว่าระหว่างราคาประเมินกับราคาขาย',
            'ขอสินเชื่อกับธนาคาร → ธนาคารประเมินเองตามราคาตลาดแบบระมัดระวัง',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...p, marginTop: 12 }}>
          แปลว่าราคาที่คุณจ่ายให้คนขาย กับราคาที่ใช้คิดค่าโอน เป็นคนละตัว
          ที่ดินทำเลทองที่ตกลงซื้อ 10 ล้าน อาจมีราคาประเมินแค่ 3 ล้าน
          ค่าโอนจะคิดจาก 3 ล้านนั้น ไม่ใช่ 10 ล้านที่คุณจ่ายจริง
        </p>
      </Section>

      <Section title="ทำไมราคาประเมินมักต่ำกว่าตลาด?">
        <p style={p}>
          เหตุผลหลักคือ <strong>จังหวะการปรับ</strong> ราคาประเมินทำเป็นรอบหลายปีครั้ง
          พอตลาดวิ่งขึ้นระหว่างรอบ ราคาประเมินก็ตามไม่ทัน ยิ่งทำเลโตเร็ว ช่องว่างยิ่งกว้าง
        </p>
        <p style={p}>
          อีกเหตุผลคือราคาประเมินกำหนดเป็นโซน ใช้ราคากลางของบริเวณ
          ขณะที่ราคาตลาดดูเป็นรายแปลง ที่ดินหน้ากว้างติดถนนใหญ่กับที่ดินในซอยแคบ
          อาจมีราคาประเมินใกล้กัน แต่ราคาตลาดต่างกันลิบ
        </p>
        <figure style={{ margin: '4px 0 16px' }}>
          <img src="/article-images/appraisal-vs-market-price-fig1.webp" alt="ภาพมุมสูงที่ดินสองแปลงในทำเลเดียวกัน แปลงติดถนนใหญ่กับแปลงในซอย"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            แปลงติดถนนใหญ่กับแปลงในซอย โซนผังเมืองเดียวกัน ราคาประเมินใกล้กัน แต่ราคาตลาดต่างกันมาก
          </figcaption>
        </figure>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 10 }}>
          ก่อนเคาะราคา ควรเช็กให้ครบ —{' '}
          <a href="/articles/check-land-before-buying" style={{ color: C.cyan }}>
            ซื้อที่ดินต้องตรวจอะไรบ้างก่อนวางมัดจำ
          </a>{' '}รวมเช็กลิสต์ที่กระทบราคาจริง
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
        ⚠ <strong>ข้อควรระวัง:</strong> อัตราค่าธรรมเนียมและภาษีการโอนอาจมีมาตรการลดหย่อนชั่วคราวจากภาครัฐเป็นช่วง ๆ
        ตัวเลขจริงและฐานที่ใช้คำนวณ ควรตรวจสอบกับสำนักงานที่ดินในพื้นที่หรือกรมสรรพากรก่อนทำธุรกรรมทุกครั้ง
      </p>

      <p style={{ ...p, marginTop: 20 }}>
        <strong>สรุปก่อนซื้อขาย:</strong> ใช้ราคาตลาดตั้งราคาและต่อรอง โดยเทียบกับแปลงใกล้เคียงจริง
        ใช้ราคาประเมินคำนวณค่าโอนและภาษีล่วงหน้า และอย่าเชื่อเมื่อใครยกราคาประเมินมาอ้างว่า "ของถูก" —
        เพราะมันคนละตัวกับราคาที่คุณจะจ่ายจริง
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub เทียบราคาที่ดินจริง
        </a>
      </div>
    </article>
  );
}
